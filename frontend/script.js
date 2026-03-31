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
            // Send request to our FastAPI backend
            const response = await fetch('http://localhost:8000/predict', {
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
            showError(error.message || 'An error occurred during text extraction.');
        } finally {
            extractBtn.disabled = false;
        }
    });

    // --- Utilities ---
    copyBtn.addEventListener('click', () => {
        if (!extractedText.value) return;
        
        navigator.clipboard.writeText(extractedText.value).then(() => {
            const icon = copyBtn.querySelector('i');
            // Swap icon to check temporarily
            const oldIcon = icon.getAttribute('data-lucide');
            icon.setAttribute('data-lucide', 'check');
            lucide.createIcons();
            
            setTimeout(() => {
                icon.setAttribute('data-lucide', oldIcon);
                lucide.createIcons();
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy', err);
        });
    });

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove('hidden');
        extractedText.classList.add('hidden');
    }

    function hideError() {
        errorBox.classList.add('hidden');
    }
});
