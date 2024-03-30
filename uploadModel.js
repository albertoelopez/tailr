const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
      userData: String,
      fileName: String,
      filePath: String,
      uploadDate: { type: Date, default: Date.now }
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;

