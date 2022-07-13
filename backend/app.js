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
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
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


app.post('/postForm',isAuth, function (req, res) {
  upload(req,res,function(err){
    if (err){
      console.log("HERE 1");
      console.log(err.message);
      err.message === "Something Wrong"?res.status(500).json({message: "Service Unavailable"}):res.status(403).json({message: err.message});
      return;
    }
    // Save to model
    let filenames = req.files.map(item=>item.filename)
    Form.create({username: req.body.username,language: req.body.lang,account_id: req.body.account_id, files: filenames,plans: req.body.plans.split(',')})
            .then(documents=>{
              res.status(200).json({
                message: "File Upload Successful",
              })
            })
          
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
