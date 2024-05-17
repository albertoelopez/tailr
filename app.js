const express = require('express');
const Upload = require('./uploadModel'); // Import the model you just created
const app = express();
const port = 3000;
const cors = require('cors');
const multer = require('multer');
// const mongoose = require('mongoose');
const fs = require('fs');
const createResume = require("./create_resume.js");
const { Document, Packer, Paragraph, TextRun } = require('docx');

app.use(cors());
app.use(express.json());

// Middleware to parse JSON bodies
app.use(express.json());

/*
mongoose.connect('mongodb://localhost/myUploadsDB');
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB successfully');
});
mongoose.connection.on('error', (err) => {
    console.error('Failed to connect to MongoDB:', err);
});
*/

// Setup multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use('/api/data', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


// Route to handle POST request
app.post('/api/data', upload.single('resume'), async (req, res) => {
    const userData = req.body.userData; // Access the text data
    const file = req.file; // Access the file

    console.log('Received user data:', userData);
    if (file) {
        console.log('Received file:', file.originalname);
    }

    // Assuming 'file' is the uploaded file from multer
    const filePath = file.path; // Or construct the path if needed
    const fileName = file.filename;

    // Proceed to send 'data' in your POST request with axios...
    const extractedText = await createResume(userData, filePath, fileName);

    // Create a new document
    const doc = new Document({
        sections: [
            {
                children: [
                    // Use the extracted text in a Paragraph
                    new Paragraph({
                        children: [new TextRun(extractedText)],
                    }),
                ],
            },
        ],
    });

    // Set the right headers for the file
    res.setHeader('Content-Disposition', 'attachment; filename=MyDocument.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    const buffer = await Packer.toBuffer(doc)
    res.send(buffer);

    try {
        /*
        const newUpload = new Upload({
            userData: userData,
            fileName: file.filename,
            filePath: file.path
        });

        await newUpload.save();
        */

        // res.status(200).json({ message: 'Data and file uploaded successfully', uploadId: newUpload._id });
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).send('Error uploading data and file');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
