import React, { useState } from 'react';
import axios from 'axios';
import './DataAndFileForm.css'; // Assuming you have this CSS file
import { ThreeDots } from 'react-loader-spinner';

function DataAndFileForm() {
    const [userData, setUserData] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // New state for loading

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        const formData = new FormData();
        formData.append('userData', userData);
        if (selectedFile) {
            formData.append('resume', selectedFile);
        }

        try {
            const response = await axios.post('http://localhost:3000/api/data', formData, {
                responseType: 'blob', // For handling binary response data
            });

            // Trigger file download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.docx'); // or any other filename
            document.body.appendChild(link);
            link.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            link.remove();

        } catch (error) {
            console.error('There was an error!', error);
            alert('Failed to send data');
        }
        setIsLoading(false); // Stop loading regardless of the outcome
    };

    return (
        <form onSubmit={handleSubmit} className="data-form">
            <div className="form-group">
                <label className="form-label">Job Description:</label>
                <input
                    type="text"
                    value={userData}
                    onChange={(e) => setUserData(e.target.value)}
                    className="form-input"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="file-upload" className="form-label">Resume (pdf, docx, jpg, png):</label>
                <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="form-input-file"
                    required // Make this field required
                    accept=".pdf,.docx,.jpg,.png" // Specify accepted file types
                />
            </div>
            <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? <ThreeDots color="#00BFFF" height={10} width={30} /> : 'Create Resume'}
            </button>
        </form>
    );
}

export default DataAndFileForm;
