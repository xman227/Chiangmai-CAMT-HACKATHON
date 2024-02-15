const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');

const uploader = multer({
    storage: multer.diskStorage({
        destination(req,file,cb){
            cb(null, 'upload/');
        },
        filename(req,file,cb){
            const ext = path.extname(file.originalname);
            cb(null, 'file_'+Date.now()+ext);
        }
    }),
    limits: {fileSize: 5*1024*1024},
});

const spawn = require('child_process').spawn

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

app.post('/', uploader.single('image'),async(req,res)=>{
    //spawn으로 파이썬 스크립트 실행
    //실행할 파일(app.py)와  매개변수로 저장된 파일명을 전달
    const net = spawn('python',['model\\model.py', req.file.filename]);
    console.log(req.file.filename);

    res.send('baby');
});
    

    // const pythonFilePath = './model/model.py';


    // exec(`python ${pythonFilePath} ${req.file.filename}`, (error, stdout, stderr) => {
    //     if (error) {
    //       console.error(`Error: ${error.message}`);
    //       return res.status(500).send('Internal Server Error');
    //     }
    
    //     if (stderr) {
    //       console.error(`stderr: ${stderr}`);
    //       return res.status(500).send('Internal Server Error');
    //     }
    
    //     // 정상적으로 실행되었을 때 결과값 전송
    //     res.send(`Python script output: ${stdout}`);
    //   });




//     //파이썬 파일 수행 결과를 받아온다
//     net.stdout.on('data', function(data) { 
//         console.log(data);
//         console.log(data.toString());
//         if(data.toString() == 'nsfw')
//             res.status(200).send('nsfw')
//         else
//             res.status(200).send('sfw')
//     })

//     console.log('dad')

// })

app.listen(4000, () => {
    console.log('listening on *:3000');
  });



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
