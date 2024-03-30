from flask import Flask, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/python-api/upload-resume', methods=['POST'])
def upload_resume():
    print("----file-----", request)
    file = request.files['resume']
    if file:
        filename = file.filename
        uploads_dir = os.path.join(os.getcwd(), 'uploads') # Get absolute path of uploads directory
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir) # Create the uploads directory if it doesn't exist
        save_path = os.path.join(uploads_dir, filename)
        file.save(save_path)
        return {'message': 'Resume uploaded successfully'}, 200
    return {'error': 'No file provided'}, 400

if __name__ == '__main__':
    app.run(debug=True)

