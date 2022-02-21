const express = require('express');
const path = require('path')
const multer  = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/development');
const Languages = require('./models/Languages');
const Plans = require('./models/Plans');
const Form = require('./models/Form');
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
      console.log("HERE 1");
      res.status(503).json({
        message: "Service Unavailable: File not Uploaded",
      })
    }
    // Save to model
    Form.find({email: req.body.email}).sort({'_id':-1}).then(documents=>{
        if (documents.length === 1){
          if(documents[0].flag === true){
            res.send(200).json({message: "Email ID Flagged"})
          }else if(documents[0].count >= 3){
            res.send(200).json({message: "Free Limit Exceeded"})
          }else{
            Form.updateOne({email: req.body.email},{fileName: req.file.filename,language: req.body.lang,plans: req.body.plans.split(','),$inc: {count: 1}})
            .then(documents=>{
              res.status(200).json({
                message: "File Upload Successful",
              })
            })
            .catch(err=>{
              console.log("HERE 2");
              res.status(503).json({
                message: "Service Unavailable: File not Uploaded",
              })
            })
          }
        
        }
      //   else if (documents.length > 1){
      //     const latestDoc = documents[0];
      //     const count = documents.length+1;
      //     const remDocs = []
      //     documents.splice(0,1).map((itm)=>{
      //       remDocs.push(itm._id)
      //     })
      //     Form.deleteMany({_id: {$in: remDocs}}).then(()=>{
      //       console.log("Deleted");
      //     }).catch(()=>{
      //       console.log("error");
      //     })
      //     Form.updateOne({_id: latestDoc._id},{fileName: req.file.filename,language: req.body.lang,plans: req.body.plans.split(','),count: count})
      //   .then(documents=>{
      //     res.status(200).json({
      //       message: "File Upload Successful",
      //     })
      //   })
      //   .catch(err=>{
      //     console.log("HERE 2");
      //     res.status(503).json({
      //       message: "Service Unavailable: File not Uploaded",
      //     })
      //   })
      // }
        else{
    Form.create({name: req.body.name,email: req.body.email,language: req.body.lang,fileName: req.file.filename,plans: req.body.plans.split(',')})
      .then(document=>{
        res.status(200).json({
          message: "File Upload Successful",
        })
      }).catch(err=>{
        console.log("HERE 3");
        res.status(503).json({
          message: "Service Unavailable: File not Uploaded",
        })
      })
        }
        })
  }
);
});

app.post('/setLanguage',function(req,res){
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
app.post('/setPlan',function(req,res){
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
app.get('/getLanguage', function(req,res){
 Languages.find({}).then(documents=>{
   res.status(200).json({response:documents,count: documents.length});
 }).catch(err=>{
  res.status(400).json({error: "Cannot Fetch Languages from Database"});
 })
});
app.get('/getPlan', function(req,res){
  Plans.find({}).then(documents=>{
    res.status(200).json({response:documents,count: documents.length});
  }).catch(err=>{
   res.status(400).json({error: "Cannot Fetch Languages from Database"});
  })
});

app.delete('/deleteLanguage',function(req,res){
  Languages.deleteMany({viewValue: {$in: req.body.array}}).then(document=>{
    res.status(201).json({message: "Deletion Successful", deletedCount: document.deletedCount})
  }).catch(err=>{
    res.status(400).json({error: "Cannot Delete values from Database"});
  })

});
app.delete('/deletePlans',function(req,res){
  Plans.deleteMany({viewValue: {$in: req.body.array}}).then(document=>{
    res.status(201).json({message: "Deletion Successful", deletedCount: document.deletedCount})
  }).catch(err=>{
    res.status(400).json({error: "Cannot Delete values from Database"});
  })

});
app.listen(PORT, function () {
    console.log('server started at port : '+PORT);
});
