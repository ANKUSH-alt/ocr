import io
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import torch
# from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TrOCR Inference API")

# Setup CORS for frontend to allow local requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://ocr-3hishvovx-ankush-alts-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": model is not None}

# Check for model in current root (Docker) or parent root (Local)
MODEL_DIR = os.path.join(os.getcwd(), "trocr-iam-model")
if not os.path.exists(MODEL_DIR):
    WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MODEL_DIR = os.path.join(WORKSPACE_DIR, "trocr-iam-model")

print(f"Loading model from: {MODEL_DIR}")

# Load model and processor globally
try:
    processor = TrOCRProcessor.from_pretrained(MODEL_DIR)
    model = VisionEncoderDecoderModel.from_pretrained(MODEL_DIR)
    
    # Check for Apple Silicon MPS or fallback to CPU
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")
        
    model.to(device)
    model.eval()
    print(f"✅ Model successfully loaded on {device}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    processor = None
    model = None
    device = torch.device("cpu")

@app.post("/predict")
async def predict_text(file: UploadFile = File(...)):
    if not model or not processor:
        raise HTTPException(status_code=500, detail="Model is not loaded. Check backend console logs.")
        
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Preprocess
        pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device)
        
        # Inference
        with torch.no_grad():
            generated_ids = model.generate(pixel_values, max_new_tokens=100)
            
        # Postprocess
        generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        
        return {
            "text": generated_text,
            "original_ocr_text": generated_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
