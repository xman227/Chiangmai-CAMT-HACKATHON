var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Plant-Kindergarden' });
});


// 이미지를 저장할 폴더 지정
const uploadDir = path.join(__dirname, 'uploads');

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({ dest: 'uploads/' })

router.post('/upload', upload.single('userfile'), function(req, res){
  res.send('Uploaded! : '+req.file); // object를 리턴함
  console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
});

module.exports = router;
