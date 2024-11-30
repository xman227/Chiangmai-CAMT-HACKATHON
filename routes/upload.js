import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

const runPythonScript = (imagePaths) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['model\\model.py', imagePaths]);

    let outputData = '';
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stdout.on('close', () => {
      resolve(outputData);
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });
  });
};



app.post('/process_images', upload.single('image'), (req, res) => {
    const imagePath = path.join(uploadDir, req.file.filename);
  
    const pythonProcess = spawn('python', ['model/model.py', imagePath]);
  
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python Output: ${data}`);
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });
  
    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      res.send(`Python process exited with code ${code}`);
    });
  });
  




const clearUploadsDirectory = () => {
  const directory = 'uploads';

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
};

router.get('/', (req, res) => {
    const petId = req.session.petId;
    res.render('upload', { petId: petId });
    console.log(petId);
    console.log(req.session);

});

router.post('/', upload.array('photos', 13), (req, res) => {
    const petId = req.session.petId;
    const photos = req.files;

    if (!petId || !photos || photos.length === 0) {
        return res.status(400).send("PetId and photos are required.");
    }

    const imagePaths = photos.map(photo => photo.path);

    runPythonScript(imagePaths)
      .then(output => {
        console.log('Python script output:', output);

        res.render('result', { prediction: output });

        // Python 스크립트 실행 후 uploads 폴더 비우기
        clearUploadsDirectory();

        const data = {
          PetId: petId,
          prediction: output,
      };
      console.log(data.prediction);

      updateSql.updatePet(data);
    })
    .catch(error => {
      console.error('Error executing Python script:', error);
      res.status(500).send('Error processing image');
    });
  
});


export default router;