lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const clearBtn = document.getElementById('clearBtn');
    const extractBtn = document.getElementById('extractBtn');
    
    const resultSection = document.getElementById('resultSection');
    const loader = document.getElementById('loader');
    const extractedText = document.getElementById('extractedText');
    const errorBox = document.getElementById('errorBox');
    const copyBtn = document.getElementById('copyBtn');
    const toastContainer = document.getElementById('toastContainer');

    let currentFile = null;

    // --- Drag and Drop Logic ---
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropzone.addEventListener(type, () => {
            dropzone.classList.remove('dragover');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // --- File Handling ---
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            showError('Please upload an image file (JPG, PNG, etc.)');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            dropzone.classList.add('hidden');
            previewContainer.classList.remove('hidden');
            extractBtn.disabled = false;
            
            // Reset results
            resultSection.classList.add('hidden');
            extractedText.value = '';
            hideError();
        };

        reader.readAsDataURL(file);
    }

    clearBtn.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        imagePreview.src = '';
        previewContainer.classList.add('hidden');
        dropzone.classList.remove('hidden');
        extractBtn.disabled = true;
        resultSection.classList.add('hidden');
    });

    // --- Extraction Logic ---
    extractBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        // UI Reset
        resultSection.classList.remove('hidden');
        extractedText.classList.add('hidden');
        hideError();
        loader.classList.remove('hidden');
        extractBtn.disabled = true;

        const formData = new FormData();
        formData.append('file', currentFile);

        try {
            // Priority 1: Use window.API_BASE_URL if set (e.g., via script tag or console)
            // Priority 2: Use localStorage.getItem('API_BASE_URL') for persistent testing
            // Priority 3: Use local IP for local network testing (if on local network)
            // Priority 4: Default to 127.0.0.1:8000
            
            const savedUrl = localStorage.getItem('API_BASE_URL');
            const defaultUrl = 'http://127.0.0.1:8000';
            const apiBase = window.API_BASE_URL || savedUrl || defaultUrl;
            
            const API_URL = `${apiBase}/predict`;
            
            console.log(`📡 Connecting to OCR backend at: ${API_URL}`);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            // Show result
            loader.classList.add('hidden');
            extractedText.classList.remove('hidden');
            extractedText.value = data.text;
            
        } catch (error) {
            console.error('OCR Error:', error);
            loader.classList.add('hidden');
            
            let errorMessage = error.message || 'An error occurred during text extraction.';
            
            // Check if it's a typical connection error
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                const isHttps = window.location.protocol === 'https:';
                
                if (isHttps) {
                    errorMessage = "🔒 **Security Block (Mixed Content)**: You are using HTTPS but trying to connect to an HTTP backend. Browsers block this for security. \n\n" +
                                   "To fix this: \n" +
                                   "1. Open the site via HTTP (e.g. http://localhost:5500) \n" +
                                   "2. Or provide a public HTTPS backend URL (e.g. from ngrok)";
                } else {
                    errorMessage = "📡 **Backend Unreachable**: Failed to connect to the OCR backend. \n\n" +
                                   "Please ensure the server is running on your machine. \n\n" +
                                   "💡 Tip: If you're on a different device, set your API URL in the browser console: \n" +
                                   "`localStorage.setItem('API_BASE_URL', 'http://YOUR_MAC_IP:8000')` then refresh.";
                }
            }
            
            showError(errorMessage);
        } finally {
            extractBtn.disabled = false;
        }
    });

    // --- Utilities ---
    copyBtn.addEventListener('click', () => {
        if (!extractedText.value) return;
        
        navigator.clipboard.writeText(extractedText.value).then(() => {
            showToast('Text copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy', err);
        });
    });

    function showToast(message, iconName = 'copy') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        lucide.createIcons();
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
        extractedText.classList.add('hidden');
    }

    function hideError() {
        errorBox.classList.add('hidden');
    }
});
