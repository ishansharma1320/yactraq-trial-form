const Languages = require('../../models/Languages');
const Plans = require('../../models/Plans');

const express = require('express'),
    router = express.Router();
    upload = require('../lib/multer');
    router.post('/setLanguage',function(req,res){
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
  
  router.post('/setPlan',function(req,res){
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
  router.delete('/deleteLanguage',function(req,res){
    Languages.deleteMany({viewValue: {$in: req.body.array}}).then(document=>{
      res.status(201).json({message: "Deletion Successful", deletedCount: document.deletedCount})
    }).catch(err=>{
      res.status(400).json({error: "Cannot Delete values from Database"});
    })
  
  });
  router.delete('/deletePlans',function(req,res){
    Plans.deleteMany({viewValue: {$in: req.body.array}}).then(document=>{
      res.status(201).json({message: "Deletion Successful", deletedCount: document.deletedCount})
    }).catch(err=>{
      res.status(400).json({error: "Cannot Delete values from Database"});
    })
  
  });