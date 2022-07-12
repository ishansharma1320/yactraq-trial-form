const express = require('express');
const path = require('path')
const multer  = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const cclist = require('./config/countries-and-phone-codes');
const industries = require('./config/industries');
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

// ----------- Multer Config Starts -----------
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});


const multerFilter = (req, file, cb) => {
  Form.find({email: req.body.email}).sort({'_id':-1}).then(documents=>{
    let count = 0;
    let flag = false;
    if(documents.length > 1){
      let sumCount = documents.reduce((total, obj) => obj.c + total,0)
      let docCount = documents.length;
      count = docCount>=sumCount?docCount:sumCount;
      for(item of documents){
        if (item.flag === true){
          flag = true;
          break;
        }
      }
      let latestDoc = documents.shift();
      let validKeys = ['_id'];
      documents.map(item => Object.keys(item).forEach(key=>validKeys.includes(key) || delete item[key]));
      Form.deleteMany({_id: {$in: remDocs}}).then(()=>{
        console.log("Deleted");
      }).catch(()=>{
        console.log("SOMETHING WRONG 1");
        return cb(new Error("Something Wrong"), false);
      });
      Form.updateOne({_id: latestDoc._id},{$set:{flag: flag,count: count}})
        .then(documents=>{
        
        })
        .catch(err=>{
          console.log("SOMETHING WRONG 2");
          return cb(new Error("Something Wrong"), false);
        })
      
    } else if (documents.length === 1){
      count = documents[0].count;
      flag = documents[0].flag;
    }

    if (count>=3){
      console.log("COUNT EXCEEDED");
      return cb(new Error("Free Limit Exceeded!"), false);
    }
    if (flag === true){
      console.log("FLAG TRUE");
      return cb(new Error("Email ID Flagged!"), false);
    }
    console.log("FILE BEING UPLOADED")
    return cb(null, true);
  }).catch(err=>{
    console.log("SOMETHING WRONG 3");
    return cb(new Error("Something Wrong"), false);
  })
  
};
const multerConfig = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
const upload = multerConfig.single('fileSource');

// ----------- Multer Config Ends -----------

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(filePath));
PORT=3003




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

app.post('/placeholder',(req,res)=>{
  let mailData = {from: "ishansharma1320@gmail.com",to: req.body.email ,subject: req.body.subject,text: req.body.text ,html: "<p> Testing Email </p>"};
  sendMailFunction(mailData);
  res.status(501).json({
    message: "PlaceHolder"
  });
})
// --------- misc Ends -----------
// ----------- external API Starts -------------
app.get('/getLanguage', function(req,res){
  Languages.find({}).then(documents=>{
    res.status(200).json({response:documents,count: documents.length});
  }).catch(err=>{
   res.status(500).json({error: "Cannot Fetch Languages from Database"});
  })
 });
 app.get('/getPlan', function(req,res){
   Plans.find({}).then(documents=>{
     res.status(200).json({response:documents,count: documents.length});
   }).catch(err=>{
    res.status(500).json({error: "Cannot Fetch Languages from Database"});
   })
 });

app.get('/getInitData',(req,res)=>{
  const ccneeded = cclist.map(({code,...item})=>item); 
  res.status(200).json({response: {
    countryInfo: ccneeded,
    industries: industries
  }});
});

app.post('/postForm', function (req, res) {
  upload(req,res,function(err){
    if (err){
      console.log("HERE 1");
      console.log(err.message);
      err.message === "Something Wrong"?res.status(500).json({message: "Service Unavailable"}):res.status(403).json({message: err.message});
      return;
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
              res.status(500).json({
                message: "Service Unavailable: File not Uploaded",
              })
            })
          }
        
        }
        else{
    Form.create({name: req.body.name,email: req.body.email,language: req.body.lang,fileName: req.file.filename,plans: req.body.plans.split(',')})
      .then(document=>{
        res.status(200).json({
          message: "File Upload Successful",
        })
      }).catch(err=>{
        console.log("HERE 3");
        res.status(500).json({
          message: "Service Unavailable: File not Uploaded",
        })
      })
        }
        })
  }
);
});
// ----------- external API Ends -------------
// ----------- internal API Starts -------------
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
        res.status(500).json({message: 'Unable to save to database',status: false})
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
        res.status(500).json({message: 'Unable to save to database',status: false})
      });


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
// ----------- internal API Ends -------------
app.get('*',(req,res)=>{
  res.sendFile(path.join(filePath,'index.html'));
})

app.listen(PORT, function () {
    console.log('server started at port : '+PORT);
});
