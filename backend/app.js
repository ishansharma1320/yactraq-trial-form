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
const ManualTranscript = require('./models/ManualTranscript');
const fs = require('fs');
const filePath = path.join(__dirname, '..','dist','yactraq-transcripts-trial');

const authRouter = require('./controllers/routes/auth');
const finalConfig = config.development;
const sttEvaluation = require("stt-evaluation")
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

const calcAggregateErrors =(type,changes)=>{
  let result = {}
  result.count = changes.filter((item)=>item.type === type).length;
  result.error_phrases = []
  changes.forEach((item)=>{
    if(item.type === type && type !== 'substitution'){
      result.error_phrases.push(item.phrase);
    }else if(type === 'substitution' && item.with){
      result.error_phrases.push(item.with);
    }
  })
  return result;
}
const calculateWER = async (call_id,generated,manual)=>{
  generated = `Good afternoon. Thank you for calling me down, speaking to you. Good afternoon to you. Your name is Philip moore and I'm ringing you out. Reference PR 3120457301 which is trying to verify my address, email, etc.. All right. Bear with me. A man whom I'm speaking to. Phillip moore. What's more, just to reconfirm the reference number was 457301. That's right. 457301. 457301. And can I reconfirm if this address is 1419? So confirm what? Yes. Just bear with me if I can reconfirm if this is 1419 Nightingale Way. The address. No, no. This is six Warmington Road. Bear with me, Phillip. On my end. I'm just trying to see if I can get this one more time. And it's spelled WARMINGTON for me. Please, if I get so much trouble. No worries. Yes. That'll be w o. I have no understanding. The thing is towards the purchase of 14 Nightingale Way, Catterall Breast and P3 one T2 and I'm gifting some money to my my granddaughter to enable her to purchase it £25,000. But you need to do checks on that on me. I'm not a money launderer. So part of that is to confirm my address, my name. And. Send you a photo. Yes. So just to reconfirm Felipe, I got the details right here. So this is for Melanie Barry and Paul Barry. Yeah. Yes. And so you were requested to verify your address on this, so. Yes. And you just want to know how you can do that. Is that is. It?`;
  manual = `good afternoon. thank you for calling muve dune speaking how may i assist you oh good afternoon dune my name is phillip moore and i am ringing you about reference pr 3120457301 which is trying to verify my address email etc. all right bear with me may i know whom i am speaking to phillip moore  - moore just to reconfirm the reference number was 457301 that's right 457301 457301 and can i reconfirm if this address is 1419 galway can you sorry confirm what yes sir just bear with me if i can reconfirm if this is 1419 nightingale way the address no no this is six warmington road bear with me phillip one moment i'm just trying to see if i can give these details one more time. and it's spelled warmington for me please  if i get so much trouble no worries. yes that will be w o no no i have not understanding the thing is towards the purchase of 14 nightingale way catterall preston pr31tq and i'm gifting some money to my my granddaughter to enable her to purchase it £25,000. but you need to to check on that on me. i'm not a money launderer. so part of that is to confirm my address, yes my name and send you a photo yes so just reconfirm phillip i got the details right here. so this is for melanie barry and paul barry. yeah. yes. and so you were requested to verify your address on this, so. yes. and you just want to know how you can do that. is that is. it? `
  const experiment = new sttEvaluation({
    groundTruth: [{audio: call_id,transcript: manual}],                             
    recognize: (audio_id) => Promise.resolve(generated)
  })
  let results = await experiment.run();
  
  let changes = results.transcriptions[0].changes;
  
  let final_result = {};
  
  final_result.total_words = results.total_words;
  final_result.word_error_rate = results.word_error_rate;
  final_result.addition = calcAggregateErrors('addition',changes);
  final_result.substitution = calcAggregateErrors('substitution',changes);
  final_result.deletion = calcAggregateErrors('deletion',changes);
  
  return final_result;
}

function convertSeconds(seconds) {
  var convert = function(x) { return (x < 10) ? "0"+x : x; }
  let hour = convert(parseInt(seconds / (60*60)));
  hour = hour === '00'? '': `${hour}:`
  return hour +
         convert(parseInt(seconds / 60 % 60)) + ":" +
         convert(seconds % 60)
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
        let callIdsThatDoesNotExist = call_ids.filter(item=>{
          if(dbCallIds.indexOf(item) === -1){
            return item;
          }
          })
        let filteredJSONObject = jsonObj.filter(item=>{
          if(callIdsThatDoesNotExist.indexOf(item.call_id)>-1){
            return item;
          }
        })
        res.status(200).json({success: true,response:filteredJSONObject,type: filteredJSONObject.length>0? 'some_call_ids_exists' :'all_call_ids_exists'})
      }else{
        res.status(200).json({success: true,response: [],type: 'all_new_call_ids'})
      }
    }else{
      res.status(500).json({success: false,response: null,type: 'error_occured'})
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
    let documents = [];
    let metadata = JSON.parse(req.body.metadata);
    let manual_transcripts = JSON.parse(req.body.manual_transcripts);
    let newCallIds = metadata.map((item)=>item.call_id);
    let fileNames = [];
    req.files.forEach((file)=>{
      fileNames.push({call: file.filename.split('.')[0], file_name: file.filename});
      let name = `${req.body.account_id}_${file.filename.split('.')[0]}_${req.body.lang}`;     
      req.body.plans.split(',').forEach(plan=>{
        let obj = {call_id: `${name}_${plan}`,account_id: req.body.account_id, file_name: file.filename, language: req.body.lang, plan: plan};
        documents.push(obj);
      })
    });
    console.log('fileNames',fileNames);
    console.log(manual_transcripts);
    manual_transcripts = manual_transcripts.map((item)=>{
      let fileData = fileNames.filter((el)=>el.call === item.call);
      console.log(fileData);
      if(fileData.length > 0){
        let newItem = {};
        newItem.file_name = fileData[0].file_name;
        newItem.account_id = req.body.account_id;
        newItem.language = req.body.lang;
        newItem.manual_transcript = item.text;
        newItem.start_duration = item.start;
        newItem.end_duration = item.end;
        return newItem;
      }
      return null;
    })
    manual_transcripts = manual_transcripts.filter((item)=>item !== null);
    if(newCallIds.length>0){
      documents = documents.filter((item)=>{
        if(newCallIds.indexOf(item.call_id) > -1){
          return item;
        }
      })
    }
    console.log(documents);
    console.log(newCallIds);
    console.log(manual_transcripts);
    if(documents.length>0){
      ProcessedCall.insertMany(documents,async (err,docs)=>{
        
        if(!err){
          if(manual_transcripts.length>0){
            await ManualTranscript.insertMany(manual_transcripts);
          }
          res.status(200).json({
            message: "File Upload Successful",
          })
        }else{
          res.status(500).json({
            message: "Some Error has occured.",
          })
        }
      
      });
    }
    
    
    }
  });
});


app.get('/transcript/:id',isAuth,function(req,res){
  fs.readFile(path.join(__dirname,'data','mono.json'),async function(err,data){
    if(!err){
      if (Buffer.isBuffer(data)){ data = JSON.parse(data.toString('utf8')); }
      let result = data.transcript;
      // let generated_transcript = '';
      // result.forEach((item)=>{
      //   if(item && item.utterance){
      //     generated_transcript+=` ${item.utterance}`
      //   }
      // })
      // get transcript for a particular call id, 
      // check if manual transcript exist for that call
      // if yes, and werdata does not exist, then calculate,
      // else return the data or handle else
      // return start and end time also, applying 00 formatting
      let werData = await calculateWER('1','','');
      console.log(werData);
      result = result.filter((el)=>{
        if(el.speaker !== 'left' && el.speaker !== 'right'){
          val = parseInt(el.speaker.split('S')[1])
          if(val%2 === 0){
            el.speaker = 'left';
          }else{
            el.speaker = 'right';
          }
          el.startTime = convertSeconds(Math.floor(el.startTime));
          return el;
        }
      });

      res.status(200).json({success: true,response: result,wer_data: {start:'00:00',end:'00:11',...werData}})
    }else{
      console.log(err);
      res.status(200).json({success: false})
    }
  })
  
})

app.post('/submitManualTranscript',isAuth,multerConfig.none(), function(req,res){
  let jsonObject = req.body;
  let call_id = jsonObject.call_id;
  console.log(call_id);
  ProcessedCall.find({call_id: call_id},function(err,docs){
    if(!err){
      console.log(docs);
      let document = docs[0];
      let newObj = {manual_transcript: jsonObject.man_trans,start_duration: jsonObject.start_time,end_duration: jsonObject.end_time};
      newObj.account_id = document.account_id;
      newObj.file_name = document.file_name;
      newObj.language = document.language;

      ManualTranscript.create(newObj,function(e,d){
        if(!e){
          res.status(200).json({message: 'Submitted'});
        }
      })
    }
  })
})



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
