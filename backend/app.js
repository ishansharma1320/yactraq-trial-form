const express = require('express');
const path = require('path')
const multer  = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const cclist = require('./config/countries-and-phone-codes');
const industries = require('./config/industries');
const config = require('./config/development');
const Languages = require('./models/Languages');
const Plans = require('./models/Plans');
const Form = require('./models/Form');
const ProcessedCall = require('./models/ProcessedCall');
const filePath = path.join(__dirname, '..','dist','yactraq-transcripts-trial');

const authRouter = require('./controllers/routes/auth');
const finalConfig = config.development;

const app = express();
let MONGO_URI = 'mongodb://'+ finalConfig.username + ':' + finalConfig.password + '@' + finalConfig.host + '/' + finalConfig.db;
mongoose.connect(MONGO_URI)
.then(()=>{
  console.log("Connected to Database");
}).catch(()=>{
  console.error("Could not Connect to Database");
});
const store = MongoDBSession({
  uri: MONGO_URI,
  collection: 'YTSessions',
})

app.use(session({
  secret: 'abcjajajb',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(filePath));
PORT=3003

const isAuth = (req,res,next) =>{
  if(req.session.isAuth){
      next();
  }else{
      res.redirect('/');
  }

}

// ----------- Multer Config Starts -----------
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


const multerConfig = multer({
  storage: multerStorage,
});
const upload = multerConfig.array('fileSource',100);

// ----------- Multer Config Ends -----------





// --------- misc Starts -----------
const transporter = nodemailer.createTransport({
  port: 465,              
  host: "smtp.gmail.com",
     auth: {
          user: 'ishansharma1320@gmail.com',
          pass: 'qzqiuuifxehjoefd',
       },
  secure: true,
  });

const sendMailFunction = (mailData)=>{
  transporter.sendMail(mailData,(error,info)=>{
    if(error){
      console.log(error);
      return;
    }
    console.log("Done");
  })
}

app.use('/auth',authRouter);
app.post('/placeholder',isAuth,(req,res)=>{
  let mailData = {from: "ishansharma1320@gmail.com",to: req.body.email ,subject: req.body.subject,text: req.body.text ,html: "<p> Testing Email </p>"};
  sendMailFunction(mailData);
  res.status(501).json({
    message: "PlaceHolder"
  });
})
// --------- misc Ends -----------
// ----------- external API Starts -------------
app.get('/getLanguage',isAuth, function(req,res){
  Languages.find({}).then(documents=>{
    res.status(200).json({response:documents,count: documents.length});
  }).catch(err=>{
   res.status(500).json({error: "Cannot Fetch Languages from Database"});
  })
 });
 app.get('/getPlan',isAuth, function(req,res){
   Plans.find({}).then(documents=>{
     res.status(200).json({response:documents,count: documents.length});
   }).catch(err=>{
    res.status(500).json({error: "Cannot Fetch Languages from Database"});
   })
 });

app.post('/newCallIdCheck',isAuth,function(req,res){
  let jsonObj = req.body;
  let call_ids = req.body.map(item=>item.call_id);
  ProcessedCall.find({call_id:{$in: call_ids}},{_id:0,call_id:1},(err,docs)=>{
    if(!err){
      if(docs.length>0){
        let dbCallIds = [];
        docs.forEach(item=>dbCallIds.push(item.call_id));
        let filteredCallIds = call_ids.filter(item=>{
          if(dbCallIds.indexOf(item) === -1){
            return item;
          }
          })
        let filteredJSONObject = jsonObj.filter(item=>{
          if(filteredCallIds.indexOf(item.call_id)>-1){
            return item;
          }
        })
        res.status(200).json({success: true,response:filteredJSONObject.length>0?filteredJSONObject:null})
      }else{
        res.status(200).json({success: true,response: []})
      }
    }else{
      res.status(500).json({success: false,response: null})
    }
  })
})
app.post('/newForm',isAuth, function (req, res) {
  upload(req,res,function(err){
    if (err){
      console.log("HERE 1");
      console.log(err.message);
      err.message === "Something Wrong"?res.status(500).json({message: "Service Unavailable"}):res.status(403).json({message: err.message});
      return;
    }
    else{
    // console.log(req.files);
    let filenames = req.files.map(item=>item.filename)
    let documents = [];
    let manual_transcript = req.body.man_trans != null ? req.body.man_trans: null;
    let start_duration = req.body.start_time != null ? req.body.start_time: null;
    let end_duration = req.body.end_time != null ? req.body.end_time: null;
    let metadata = JSON.parse(req.body.metadata);
    let newCallIds = metadata.map((item)=>item.call_id);
    req.files.forEach((file)=>{
      let name = `${req.body.account_id}_${file.filename.split('.')[0]}_${req.body.lang}`;
            
      req.body.plans.split(',').forEach(plan=>{
        let obj = {call_id: `${name}_${plan}`};
        if(manual_transcript !== null && start_duration !== null && end_duration !== null){
          obj.manual_transcript = {text: manual_transcript, start_duration,end_duration}
        }
        documents.push(obj);
      })
    });
    
    documents = documents.filter((item)=>{
      if(newCallIds.indexOf(item.call_id) > -1){
        return item;
      }
    })
    console.log(documents);
    if(documents.length>0){
      ProcessedCall.insertMany(documents,(err,docs)=>{
        if(!err){
          res.status(200).json({
            message: "File Upload Successful",
          })
        }
      
      });
    }
    
    
    }
  });
});
// ----------- external API Ends -------------

app.get('/form',isAuth,(req,res)=>{
  res.sendFile(path.join(filePath,'index.html'));
})
app.get('/transcripts',isAuth,(req,res)=>{
  res.sendFile(path.join(filePath,'index.html'));
})
app.get('*',(req,res)=>{
  res.sendFile(path.join(filePath,'index.html'));
})

app.listen(PORT, function () {
    console.log('server started at port : '+PORT);
});
