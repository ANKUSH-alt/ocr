# Intelligent OCR - TrOCR with Groq Post-Correction

A modern, high-precision OCR (Optical Character Recognition) application leveraging a fine-tuned **TrOCR (Transformer-based OCR)** model for text extraction and **Groq Cloud (Llama 3.1)** for intelligent post-correction.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ocr-3hishvovx-ankush-alts-projects.vercel.app)

## 🚀 Features

- **Fine-tuned TrOCR**: Specifically optimized for high-accuracy handwritten or scanned text extraction.
- **AI-Powered Refinement**: Integrates Groq's Llama 3.1 to correct OCR errors, improve grammar, and ensure contextual accuracy.
- **Modern Interface**: A sleek, glassmorphic UI built with Vanilla JS, CSS, and Lucide icons.
- **Local/Cloud Hybrid**: Frontend deployed on Vercel with a powerful local FastAPI backend.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS, JavaScript (ES6+), Lucide Icons.
- **Backend**: FastAPI (Python), PyTorch, Hugging Face Transformers (TrOCR).
- **LLM Integration**: Groq API (Llama 3.1 8B Instant).
- **Deployment**: Vercel (Frontend).

## 📦 Project Structure

```text
├── backend/            # FastAPI Backend
│   ├── app.py          # Inference API & Groq Integration
│   └── requirements.txt
├── frontend/           # Modern UI
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── trocr-iam-model/    # Fine-tuned Model (Excluded from Git)
├── vercel.json         # Vercel Configuration
└── README.md
```

## ⚙️ Setup & Installation

### Backend
1. Initialize a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   ```
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Set up your `.env` file:
   ```text
   GROQ_API_KEY=your_api_key_here  # Optional if post-correction is disabled
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn backend.app:app --host 0.0.0.0 --port 8000
   ```

### Frontend
- **Local Testing**: Open `frontend/index.html` via a local server like Live Server or `python3 -m http.server 5500 --directory frontend`.
- **Production (Vercel)**: Connects to `localhost:8000` by default.

---

## 🔒 Security & Remote Access (Mixed Content Fix)

If you are using the **Vercel-deployed site** (HTTPS) but running your backend locally (HTTP), the browser will block the connection. To fix this:

### 1. Start a Secure Tunnel
Run the provided script to give your local backend a public HTTPS address:
```bash
bash setup_tunnel.sh
```
Look for the `trycloudflare.com` URL in the output (e.g., `https://example.trycloudflare.com`).

### 2. Connect the Frontend
1. Open the OCR app on Vercel.
2. When the "Security Block" error appears, paste your **Tunnel URL** into the "Quick Connect" box.
3. Click **Connect**. The page will refresh and be ready for use!

---

## 🚀 Zero-Paste Connection (Permanent Hosting)

If you want the Vercel site to **always connect automatically** without pasting a URL:

### Deploy to Hugging Face Spaces (Free)
1.  Create a new **Docker Space** on [Hugging Face Spaces](https://huggingface.co/new-space?template=docker).
2.  Upload the following files from this repository:
    -   `Dockerfile`
    -   `backend/` folder
    -   `trocr-iam-model/` folder
3.  Once deployed, Hugging Face will provide a permanent HTTPS URL (e.g., `https://username-ocr.hf.space`).
4.  **One-time Setup**: Open `frontend/script.js` and set your new URL in the `STATIC_API_URL` variable:
    ```javascript
    const STATIC_API_URL = 'https://username-ocr.hf.space';
    ```
5.  Push this change to GitHub, and your Vercel site will now **always** work automatically!

---

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## 👤 Author

**Ankush Gupta**  
*Full Stack Developer & AI Engineer*

Feel free to connect or reach out for collaborations!
