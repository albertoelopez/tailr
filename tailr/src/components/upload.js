import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('resume', selectedFile);

        axios.post('http://localhost:5000/python-api/upload-resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Success:', response.data);
                alert('Resume uploaded successfully');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error uploading resume');
            });
    };

    return (
        <div className="App">
        <header className="App-header">
        <h2>Upload Your Resume</h2>
        <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload Resume</button>
        </form>
        </header>
        </div>
    );
}

export default App;

