<h1>🩺 Ensemble-Based Lung Cancer Prediction

Ensemble-Based Lung Cancer Prediction is a deep learning–powered web application that predicts and classifies lung cancer from medical images (DICOM / CT / X-ray) using an ensemble of CNN models — Xception, ResNet, and VGG.
It provides real-time predictions and AI-generated explanations through a Flask + React interface.</h1>

<h2>🚀 Features

🧠 Upload and analyze medical images (CT / X-ray) instantly

🔗 Ensemble model combining Xception, ResNet, and VGG for high accuracy

🤖 AI-based explanation using Hugging Face / Groq API

⚙️ Flask REST API for backend inference

💻 React frontend for image upload & real-time display

🔒 Secure session-based login system

⚡ Supports both CPU and GPU environments</h2>

<h1>🧠 Technologies Used</h1>

```
Category	Tools / Libraries
Backend (ML)	Python, Flask, TensorFlow / Keras, NumPy, Pandas
Frontend	React.js, HTML, CSS, JavaScript
AI Explanation	Hugging Face API, Groq API
Utilities	OpenCV, Pillow, dotenv, Flask-CORS

```

⚙️ How to Run
🧩 1️⃣ Clone the Repository

```
git clone https://github.com/yourusername/LungCancerPrediction.git
cd LungCancerPrediction
```

<h1>💻 2️⃣ Run the Backend (Flask API)</h1>

```
cd Backend
python -m venv venv
venv\Scripts\activate       # For Windows
# or
source venv/bin/activate    # For macOS / Linux
pip install -r ../requirements.txt
python app.py

```
✅ Backend will run at: http://localhost:5000

<h1>🌐 3️⃣ Run the Frontend (React App)

Open a new terminal (keep backend running):</h1>

````
cd lung-cancer-prediction
npm install
npm start
````
✅ Frontend will run at: http://localhost:3000

🔐 Environment Variables (.env Example)

Create a .env file inside the Backend directory:

```
HF_API_KEY=your_huggingface_api_key
GROQ_API_KEY=your_groq_api_key

```
📊 Output

🩻 Predicted Lung Condition:
Adenocarcinoma | Large Cell | Normal | Squamous Cell

💬 AI-Generated Explanation: Simple medical summary + next steps

🖼️ Uploaded Image Preview: Displayed in real time on the frontend

👤 Author

👨‍💻 Lavithesh
🎓 Srinivas Institute of Technology
💡 Passionate about AI, Deep Learning & Healthcare Innovation

🧷 License

This project is licensed under the MIT License – feel free to use, modify, and distribute with proper credit.
