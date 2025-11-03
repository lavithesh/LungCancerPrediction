🩺 Ensemble-Based Lung Cancer Prediction

Lung Cancer Prediction is a deep-learning–based research and production-ready project that detects and classifies lung cancer from medical images (DICOM / CT / X-ray).
It integrates TensorFlow CNN models with an ensemble technique and provides a complete Flask + React web application for real-time predictions and AI-generated explanations.

🚀 Project Overview

This project provides an end-to-end pipeline for automated lung cancer detection:

Preprocess and normalize DICOM / image files.

Train deep CNN models (Xception, ResNet, VGG).

Combine model outputs through ensemble averaging for higher accuracy.

Serve predictions through a Flask REST API.

Use a React frontend to upload images and view predictions in real time.

✨ Features

✅ DICOM & image preprocessing pipeline
✅ Ensemble model combining Xception, ResNet & VGG
✅ Flask REST API for inference
✅ React frontend with real-time upload & display
✅ AI-generated textual analysis using Hugging Face / Groq API
✅ GPU acceleration supported
✅ Configurable training & evaluation scripts

📁 Repository Structure
LungCancerPrediction/
│
├── Backend/                     # Flask backend (API + ML models)
│   ├── app.py                   # Main Flask server
│   ├── models/                  # Saved CNN models (.keras files)
│   └── uploads/                 # Uploaded images
│
├── lung-cancer-prediction/      # React frontend
│   ├── src/                     # React components
│   ├── public/
│   └── package.json
│
├── data/
│   ├── raw/                     # Original DICOM / image files (not committed)
│   ├── processed/               # Preprocessed images or numpy arrays
│   └── labels.csv               # Image filenames + labels
│
├── notebooks/                   # Jupyter notebooks for EDA & model training
├── src/                         # Core ML pipeline scripts
│   ├── data_loader.py
│   ├── augmentations.py
│   ├── models.py
│   ├── train.py
│   ├── evaluate.py
│   └── utils.py
│
├── requirements.txt             # Python dependencies
├── README.md                    # Project documentation
└── .gitignore                   # Ignored files (to be added)

🧩 Technologies Used
Category	Tools / Libraries
Backend (ML)	Python, TensorFlow / Keras, NumPy, Pandas, OpenCV, Pillow
API Framework	Flask, Flask-CORS
Frontend	React.js, HTML, CSS, JavaScript
AI Explanation	Hugging Face API / Groq API
Visualization	Matplotlib, scikit-learn
Environment	dotenv, Virtualenv
⚙️ Setup & Run Instructions
🖥️ 1️⃣ Clone the Repository
git clone https://github.com/<your-username>/LungCancerPrediction.git
cd LungCancerPrediction

🧩 2️⃣ Backend Setup (Flask API)

Navigate to the backend folder:
```
cd Backend

```
Create and activate a virtual environment:
```
python -m venv venv
venv\Scripts\activate       # Windows
# or
source venv/bin/activate    # macOS / Linux
```

Install dependencies:
```
pip install -r ../requirements.txt
```

Start the Flask server:
```
python app.py
```

✅ Backend will run at http://localhost:5000

💻 3️⃣ Frontend Setup (React App)

Open a new terminal (keep backend running).

Navigate to the frontend directory:
```
cd lung-cancer-prediction
```

Install dependencies:
```
npm install
```

Start the React development server:
```
npm start
```

✅ Frontend will run at http://localhost:3000

🌐 4️⃣ Access the Application

Now open your browser and visit:
👉 http://localhost:3000

You can:

Upload lung scan images 🩻

Get instant AI-based cancer predictions 🧠

Receive text explanations powered by Hugging Face or Groq 💬

🧠 Model Information

The system uses an ensemble of three CNN architectures:

Model	Framework	Role
Xception	TensorFlow	Feature extractor
ResNet50	TensorFlow	High-level feature refinement
VGG16	TensorFlow	Texture & edge recognition
Ensemble	Custom	Combines all predictions
📊 Evaluation Metrics
```
Accuracy

Precision / Recall / F1-Score

Confusion Matrix

ROC-AUC Curve
```
🧾 Environment Variables (.env Example)

Create a .env file in the Backend folder:
```
HF_API_KEY=your_huggingface_api_key
GROQ_API_KEY=your_groq_api_key
```
🙌 Contributors

👤 Lavithesh
🧷 License

This project is licensed under the MIT License – feel free to use and modify with credit.

🧷 License

This project is licensed under the MIT License – feel free to use and modify with credit.
