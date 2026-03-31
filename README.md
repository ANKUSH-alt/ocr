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
   GROQ_API_KEY=your_api_key_here
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn backend.app:app --host 0.0.0.0 --port 8000
   ```

### Frontend
- For local development, simply open `frontend/index.html` or serve it using live-server.
- The production frontend is hosted on Vercel and connects to `localhost:8000` by default.

## 🤝 Contribution

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)
