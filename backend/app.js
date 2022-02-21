const express = require('express');
const path = require('path')
const filePath = path.join(__dirname, '..','dist','yactraq-transcripts-trial');
var multer  = require('multer');
var app = express();
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

app.listen(PORT, function () {
    console.log('server started at port : '+PORT);
});
