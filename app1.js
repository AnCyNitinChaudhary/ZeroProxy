const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/cameras', upload.single('image'), async (req, res) => {
  console.log('Received image upload request.');
  if (!req.file) {
    console.error('No file uploaded.');
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, req.file.path);
  console.log('File path:', filePath);

  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(filePath), 'capture.png');

    const response = await axios.post('http://localhost:5000/validate', form, {
      headers: form.getHeaders(),
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error in axios request:', error);
    res.status(500).send(error.toString());
  } finally {
    fs.unlinkSync(filePath); // Clean up the uploaded file
  }
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
