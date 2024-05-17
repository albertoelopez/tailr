const axios = require("axios");
const textract = require('textract');
const path = require('path');
const fs = require("fs").promises;

async function sendDataWithFileContent(userData, filePath, fileName) {
    try {
        const ext = path.extname(filePath);
        const fileBuffer = await fs.readFile(filePath);

        let fileData;

        if (ext === '.pdf') {
            fileData = await textract.fromPdf(filePath);
        } else if (ext === '.docx') {
            const docToText = await new Promise((resolve, reject) => {
                textract.fromFileWithPath(filePath, (error, text) => {
                    if (error) reject(error);
                    else resolve(text);
                });
            });
            fileData = docToText;
        } else if (ext === '.jpg' || ext === '.png') {
            // For image extraction
            const imageToText = await new Promise((resolve, reject) => {
                textract.fromBufferWithName(fileName, fileBuffer, (error, text) => {
                    if (error) reject(error);
                    else resolve(text);
                });
            });
            fileData = imageToText;
        } else {
            throw new Error('Unsupported file type');
        }

        // Combine userData and file content in the prompt
        const prompt = `
        Create a resume from: job description: 
        ${userData}\n\n and original_resume: ${fileData}
        
        Do not include information from job description that does not match original_resume information. 
        Also, if the job description and original_resume are not good matches return empty string.`;

        /*
        const prompt = `Given a detailed job description and the content of a current resume, generate a new resume that closely matches the job description. This new resume should effectively highlight relevant experiences, skills, and achievements from the current resume, aligning with the job requirements. Ensure the new resume rephrases and reorganizes the information to appeal specifically to this job opportunity, maintaining a professional tone, action-oriented language, and an emphasis on results and accomplishments.

- **Job Description Provided:**\n${userData}\n

- **Current Resume Content:**\n${fileData}\n

**Instructions for New Resume Creation:**
1. **Skills and Experiences Alignment:** Directly identify and highlight skills and experiences from the current resume that match the job description. Emphasize achievements or projects demonstrating these qualifications.
2. **Resume Structure:** Organize the new resume in a professional, easy-to-read format. Use headings, bullet points, and concise sentences.
3. **Craft a Professional Summary:** Write a new summary positioning the candidate as an ideal fit, incorporating keywords from the job description.
4. **Tailored Language:** Employ action verbs and quantify achievements to demonstrate impact. Ensure the language suits the job's tone and requirements.
5. **Omit Irrelevant Details:** Exclude experiences or skills not relevant to the job to maintain focus on pertinent qualifications.
6. **Update and Refine:** Ensure all information is current and refine sections for a closer match to the job application.
7. **Format and Clean-up:** Properly indent and remove unnecessary text and characters for a clean presentation.

Generate the tailored resume with these guidelines in mind.`;
*/

        const data = {
            model: "llama3:8b",
            prompt: prompt,
            stream: false
        };

        // Send the combined data in the POST request
        const response = await axios.post('http://localhost:11434/api/generate', data);
        const extractedText = await response.data.response;
        console.log(`EXTRACTEDTEXT: ${extractedText}`);

        return extractedText;
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = sendDataWithFileContent;
