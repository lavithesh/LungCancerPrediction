
from flask import Flask, request, render_template, redirect, url_for, send_from_directory, session, flash, jsonify
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from flask_cors import CORS
import logging
from PIL import Image, ImageStat
from dotenv import load_dotenv
import requests
from sklearn.metrics import classification_report, accuracy_score
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Logging setup
logging.basicConfig(level=logging.DEBUG)

app.secret_key = 'your_secret_key'

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ✅ API Key (OpenRouter)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Load ML models
try:
    xception_model = load_model(r'C:\\Users\\91989\\OneDrive\\Desktop\\coding\\Ensamble\\Backend\\Model\\xception_model.keras', compile=False)
    resnet_model = load_model(r'C:\\Users\\91989\\OneDrive\\Desktop\\coding\\Ensamble\\Backend\Model\\resnet_model.keras', compile=False)
    vgg_model = load_model(r'C:\\Users\\91989\\OneDrive\\Desktop\\coding\\Ensamble\\Backend\\Model\\vgg_model.keras', compile=False)
    logging.info("✅ All models loaded successfully.")
except Exception as e:
    logging.error(f"❌ Error loading model: {e}")

class_labels = ['Adenocarcinoma', 'Large_Cell_Carcinoma', 'Normal', 'Squamous_Cell_Carcinoma']

USERNAME = "lavithesh@gmail.com"
PASSWORD = "1234"

def load_and_preprocess_image(img_path, target_size=(350, 350)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    return img_array


# ------------------ ROUTES ------------------

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def authenticate():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username == USERNAME and password == PASSWORD:
        session['user'] = username
        return jsonify({"success": True, "user": username}), 200
    else:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401


@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

@app.route('/home')
def home():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')


# ------------------ PREDICTION ------------------

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return {"error": "No file provided"}, 400

    file = request.files['file']
    if file.filename == '':
        return {"error": "No selected file"}, 400

    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # 🧩 Validate image
        try:
            img_pil = Image.open(filepath).convert("RGB")
            stat = ImageStat.Stat(img_pil)
            brightness = sum(stat.mean) / len(stat.mean)
            width, height = img_pil.size
            if width < 100 or height < 100 or brightness < 10 or brightness > 240:
                return {"error": "Please upload a valid lung X-ray image."}, 400
        except Exception as e:
            return {"error": f"Invalid image file: {str(e)}"}, 400

        # 🧠 Preprocess and Predict
        img = load_and_preprocess_image(filepath)
        try:
            xception_preds = xception_model.predict(img)
            resnet_preds = resnet_model.predict(img)
            vgg_preds = vgg_model.predict(img)

            # ✅ Ensemble Average
            ensemble_preds = (xception_preds + resnet_preds + vgg_preds) / 3
            predicted_class = np.argmax(ensemble_preds[0])
            predicted_label = class_labels[predicted_class]
            confidence = float(np.max(ensemble_preds))  # ✅ Added confidence
            accuracy = round(confidence * 100, 2)

            # ✅ Return prediction + confidence
            return {
                "label": predicted_label,
                "confidence": round(confidence, 4),
                "accuracy": accuracy,
                "image_url": f"http://localhost:5000/uploads/{filename}"
            }

        except Exception as e:
            return {"error": f"Prediction failed: {str(e)}"}, 500



# ------------------ AI ANALYSIS (OpenRouter) ------------------

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    label = data.get("label", "N/A")
    confidence = data.get("confidence", "N/A")

    if label == "N/A":
        return jsonify({"message": "No valid prediction available to analyze."}), 400

    prompt = f"""
    A patient's lung X-ray was analyzed by an AI model.
    The model predicts: {label} with confidence: {confidence}.
    Explain this result in simple, human-friendly terms.
    Mention possible symptoms and suggest safe next steps.
    End with a reassuring note.
    """

    try:
        api_url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful and empathetic medical assistant."},
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post(api_url, headers=headers, json=payload, timeout=30)

        if response.status_code == 200:
            result = response.json()
            ai_text = result["choices"][0]["message"]["content"]
            return jsonify({"message": ai_text})
        else:
            logging.error(f"OpenRouter API Error: {response.text}")
            return jsonify({"message": "⚠️ AI explanation failed. Try again later."}), 500

    except Exception as e:
        logging.error(f"OpenRouter Error: {e}")
        return jsonify({"message": "⚠️ Unable to connect to AI service."}), 500
    
    
    
    
# ------------------ MODEL METRICS ------------------



@app.route('/metrics', methods=['GET'])
def model_metrics():
    try:
        import cv2
        import numpy as np
        from sklearn.metrics import roc_auc_score
        from PIL import ImageStat

        # 🧩 Get the most recently uploaded image
        upload_dir = app.config['UPLOAD_FOLDER']
        files = sorted(
            [os.path.join(upload_dir, f) for f in os.listdir(upload_dir)
             if f.lower().endswith(('.jpg', '.png', '.jpeg'))],
            key=os.path.getmtime,
            reverse=True
        )
        if not files:
            return jsonify({"error": "No uploaded image found."}), 400
        latest_image_path = files[0]

        # 🔍 Preprocess and predict
        img = load_and_preprocess_image(latest_image_path)

        x_pred = xception_model.predict(img, verbose=0)
        r_pred = resnet_model.predict(img, verbose=0)
        v_pred = vgg_model.predict(img, verbose=0)
        ensemble_pred = (x_pred + r_pred + v_pred) / 3

        # 🧠 Prediction info
        predicted_idx = np.argmax(ensemble_pred)
        predicted_label = class_labels[predicted_idx]
        confidence = float(np.max(ensemble_pred))

        # ✅ Feature extraction
        img_cv = cv2.imread(latest_image_path, cv2.IMREAD_GRAYSCALE)

        texture_contrast = cv2.Laplacian(img_cv, cv2.CV_64F).var()
        mean_intensity = float(np.mean(img_cv))
        std_intensity = float(np.std(img_cv))

        _, mask = cv2.threshold(img_cv, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        area = sum(cv2.contourArea(c) for c in contours)
        perimeter = sum(cv2.arcLength(c, True) for c in contours)
        brightness = sum(ImageStat.Stat(Image.open(latest_image_path)).mean) / 3

        # ✅ ROC-AUC
        try:
            roc_auc = float(roc_auc_score(
                [1 if i == predicted_idx else 0 for i in range(len(class_labels))],
                ensemble_pred[0],
                multi_class='ovr'
            ))
        except Exception:
            roc_auc = None

        return jsonify({
            "label": predicted_label,
            "confidence": round(confidence, 4),
            "accuracy": round(confidence * 100, 2),
            "roc_auc": round(roc_auc or 0.0, 4),
            "features": {
                "texture_contrast": round(texture_contrast, 4),
                "mean_intensity": round(mean_intensity, 4),
                "std_intensity": round(std_intensity, 4),
                "shape_area": round(area, 2),
                "shape_perimeter": round(perimeter, 2),
                "brightness": round(brightness, 2),
            },
            "tumor_segmentation": {
                "detected": bool(area > 0),
                "segmented_area": round(area, 2),
                "mask_resolution": f"{img_cv.shape[1]}x{img_cv.shape[0]}"
            }
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        logging.error(f"❌ Metrics computation failed: {e}")
        return jsonify({"error": f"Metrics computation failed: {str(e)}"}), 500


# ------------------ IMAGE UPLOADS ------------------

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ------------------ RUN APP ------------------

if __name__ == '__main__':
    app.run(debug=True)