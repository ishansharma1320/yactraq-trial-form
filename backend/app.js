const express = require('express');
const path = require('path')
const multer  = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/development');
const Languages = require('./models/Languages');
const Plans = require('./models/Plans');
const filePath = path.join(__dirname, '..','dist','yactraq-transcripts-trial');
const app = express();
const finalConfig = config.development;

mongoose.connect('mongodb://'+ finalConfig.username + ':' + finalConfig.password + '@' + finalConfig.host + '/' + finalConfig.db)
.then(()=>{
  console.log("Connected to Database");
}).catch(()=>{
  console.error("Could not Connect to Database");
});

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// multerFilter not needed as we are already filtering the audio files in the frontend
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.split("/")[0] === "audio") {
//     cb(null, true);
//   } else {
//     cb(new Error("Not a Audio File!!"), false);
//   }
// };

const multerConfig = multer({
  storage: multerStorage,
  // fileFilter: multerFilter,
});
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(filePath));
PORT=3003
const upload = multerConfig.single('fileSource');

app.post('/postForm', function (req, res) {
  upload(req,res,function(err){
    if (err){
      res.status(503).json({
        message: "Service Unavailable: File not Uploaded",
      })
    }
    // Save to model
    console.log("In Successful");
    res.status(200).json({
      message: "File Upload Successful",
    })
  }
);
});

app.post('/setLanguages',function(req,res){
  const obj = [];
  // console.log(req.body);
  if(req.body.array){
    req.body.array.map((item)=>{
      obj.push({value: item.value,viewValue: item.viewValue})
    });
  }else{
    obj.push({value: req.body.value,viewValue: req.body.viewValue});
  }
  Languages.insertMany(obj)
  .then(itm =>{
      res.status(201).json({message: 'Data Added Successfully',status: true})
    }).catch(err => {
        res.status(400).json({message: 'Unable to save to database',status: false})
      });
  
});
app.post('/setPlans',function(req,res){
  const obj = [];
  if(req.body.array){
    req.body.array.map((item)=>{
      obj.push({value: item.value,viewValue: item.viewValue})
    });
  }else{
    obj.push({value: req.body.value,viewValue: req.body.viewValue});
  }
  Plans.insertMany(obj)
  .then(itm =>{
      res.status(201).json({message: 'Data Added Successfully',status: true})
    }).catch(err => {
        res.status(400).json({message: 'Unable to save to database',status: false})
      });


});
app.get('/getLanguages', function(req,res){
 Languages.find({}).then(documents=>{
   res.status(200).json({response:documents,count: documents.length});
 }).catch(err=>{
  res.status(400).json({error: "Cannot Fetch Languages from Database"});
 })
});
app.get('/getPlans', function(req,res){
  Plans.find({}).then(documents=>{
    res.status(200).json({response:documents,count: documents.length});
  }).catch(err=>{
   res.status(400).json({error: "Cannot Fetch Languages from Database"});
  })
});
app.listen(PORT, function () {
    console.log('server started at port : '+PORT);
});
