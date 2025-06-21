document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const imageUpload = document.getElementById('imageUpload');
    const dropZone = document.getElementById('drop-zone');
    const fileInfo = document.querySelector('.file-info');
    const imagePreview = document.getElementById('image-preview');
    const imageCanvas = document.getElementById('imageCanvas');
    const mainContent = document.querySelector('.main-content-wrapper');
    const uploadArea = document.getElementById('upload-area');
    const resetButton = document.getElementById('resetButton');

    const colorPaletteDiv = document.getElementById('color-palette');
    const paletteLoader = document.querySelector('.palette-loader-container');
    
    const pickedColorDisplay = document.getElementById('picked-color-display');
    const pickedColorValue = document.getElementById('picked-color-value');
    const copyPickedColorButton = document.getElementById('copyPickedColorButton');

    const progressContainer = document.getElementById('upload-progress-container');
    const progressBar = document.getElementById('upload-progress-bar');
    
    const notificationPopup = document.getElementById('notification-popup');
    const popupMessage = document.getElementById('popup-message');

    const ctx = imageCanvas.getContext('2d');
    const colorThief = new ColorThief();

    let popupTimeout;
    let isPicking = false;

    // === Functions ===

    const rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

    const showNotification = (message, duration = 3000) => {
        if (popupTimeout) clearTimeout(popupTimeout);
        popupMessage.textContent = message;
        notificationPopup.classList.add('show');
        popupTimeout = setTimeout(() => notificationPopup.classList.remove('show'), duration);
    };

    const displayColorPalette = (colors) => {
        paletteLoader.style.display = 'none';
        colorPaletteDiv.innerHTML = '';
        if (!colors || colors.length === 0) {
            colorPaletteDiv.innerHTML = '<p>Gagal mengekstrak palet warna.</p>';
            return;
        }

        colors.forEach(color => {
            const [r, g, b] = color;
            const hex = rgbToHex(r, g, b);

            const item = document.createElement('div');
            item.className = 'color-item';
            item.innerHTML = `
                <div class="color-box" style="background-color: ${hex};" title="Warna: ${hex}"></div>
                <div class="color-info">${hex}</div>
                <button class="copy-button" title="Salin ${hex}">
                    <i data-lucide="copy"></i> Salin
                </button>
            `;
            
            item.querySelector('.copy-button').addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(hex)
                    .then(() => showNotification(`Warna ${hex} berhasil disalin!`))
                    .catch(() => showNotification('Gagal menyalin warna.'));
            });

            colorPaletteDiv.appendChild(item);
        });
        lucide.createIcons();
    };

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            showNotification('Format file tidak didukung. Silakan pilih gambar.');
            return;
        }

        mainContent.style.display = 'none';
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        
        const reader = new FileReader();

        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percent + '%';
                progressBar.textContent = percent + '%';
            }
        };

        reader.onload = (e) => {
            progressBar.style.width = '100%';
            progressBar.textContent = '100%';
            setTimeout(() => { progressContainer.style.display = 'none'; }, 500);

            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = e.target.result;

            img.onload = () => {
                mainContent.style.display = 'flex';
                uploadArea.style.display = 'none';
                resetButton.style.display = 'inline-flex';
                
                imageCanvas.width = img.naturalWidth;
                imageCanvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);

                imagePreview.src = img.src;

                pickedColorDisplay.style.backgroundColor = '#444';
                pickedColorValue.textContent = 'Warna Dipilih: N/A';
                copyPickedColorButton.style.display = 'none';

                colorPaletteDiv.innerHTML = '';
                paletteLoader.style.display = 'flex';
                setTimeout(() => {
                    try {
                        // --- PERUBAHAN DI SINI: dari 9 menjadi 10 ---
                        const palette = colorThief.getPalette(img, 10);
                        displayColorPalette(palette);
                    } catch (error) {
                        console.error("Gagal memproses gambar:", error);
                        showNotification("Terjadi kesalahan saat memproses gambar.");
                        paletteLoader.style.display = 'none';
                    }
                }, 50);
            };
            img.onerror = () => {
                showNotification("Gagal memuat file gambar. Mungkin file rusak.");
                resetToInitialState();
            };
        };

        reader.readAsDataURL(file);
    };
    
    const resetToInitialState = () => {
        uploadArea.style.display = 'block';
        mainContent.style.display = 'none';
        resetButton.style.display = 'none';
        progressContainer.style.display = 'none';
        fileInfo.textContent = '';
        imageUpload.value = '';
    }

    const pickColorAt = (event) => {
        const rect = imagePreview.getBoundingClientRect();
        const scaleX = imageCanvas.width / rect.width;
        const scaleY = imageCanvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        if (x < 0 || x >= imageCanvas.width || y < 0 || y >= imageCanvas.height) {
            return;
        }

        try {
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            const [r, g, b] = pixelData;
            const hexColor = rgbToHex(r, g, b);

            pickedColorDisplay.style.backgroundColor = hexColor;
            pickedColorValue.textContent = `${hexColor}`;
            copyPickedColorButton.style.display = 'inline-flex';
        } catch (error) {
            console.error("Gagal mengambil warna piksel:", error);
        }
    };

    // === Event Listeners ===
    dropZone.addEventListener('click', () => imageUpload.click());
    imageUpload.addEventListener('change', (e) => handleFile(e.target.files[0]));

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    
    dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    dropZone.addEventListener('drop', (e) => {
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    imagePreview.addEventListener('mousedown', (event) => {
        isPicking = true;
        imagePreview.classList.add('is-picking-cursor');
        pickColorAt(event);
    });

    imagePreview.addEventListener('mousemove', (event) => {
        if (isPicking) {
            pickColorAt(event);
        }
    });

    window.addEventListener('mouseup', () => {
        isPicking = false;
        imagePreview.classList.remove('is-picking-cursor');
    });

    imagePreview.addEventListener('mouseleave', () => {
        isPicking = false;
        imagePreview.classList.remove('is-picking-cursor');
    });


    copyPickedColorButton.addEventListener('click', () => {
        const colorToCopy = pickedColorValue.textContent;
        if (colorToCopy && colorToCopy !== 'Warna Dipilih: N/A') {
            navigator.clipboard.writeText(colorToCopy)
                .then(() => showNotification(`Warna ${colorToCopy} berhasil disalin!`))
                .catch(() => showNotification('Gagal menyalin warna.'));
        }
    });

    resetButton.addEventListener('click', resetToInitialState);

    // === Inisialisasi ===
    lucide.createIcons();
    resetToInitialState();
});
