document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const imageUpload = document.getElementById('imageUpload');
    const dropZone = document.getElementById('drop-zone');
    const fileInfo = document.querySelector('.file-info');
    const imagePreview = document.getElementById('image-preview');
    const imageCanvas = document.getElementById('imageCanvas');
    const mainContent = document.querySelector('.main-content-wrapper');
    const uploadArea = document.getElementById('upload-area');

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
    const MAX_WIDTH = 1000;
    const MAX_HEIGHT = 800;

    // === Functions ===

    // Konversi RGB ke HEX
    const rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

    // Tampilkan notifikasi kustom
    const showNotification = (message, duration = 3000) => {
        if (popupTimeout) clearTimeout(popupTimeout);
        popupMessage.textContent = message;
        notificationPopup.classList.add('show');
        popupTimeout = setTimeout(() => notificationPopup.classList.remove('show'), duration);
    };

    // Tampilkan palet warna
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
        lucide.createIcons(); // Render ikon baru
    };

    // Proses file gambar yang dipilih
    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            showNotification('Format file tidak didukung. Silakan pilih gambar.');
            return;
        }

        // Reset tampilan
        mainContent.style.display = 'none';
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        fileInfo.textContent = `File dipilih: ${file.name}`;
        
        const reader = new FileReader();

        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percent + '%';
            }
        };

        reader.onload = (e) => {
            setTimeout(() => { progressContainer.style.display = 'none'; }, 500);

            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = e.target.result;

            img.onload = () => {
                mainContent.style.display = 'flex';
                uploadArea.style.display = 'none'; // Sembunyikan area upload
                
                // Atur canvas sesuai ukuran gambar
                imageCanvas.width = img.naturalWidth;
                imageCanvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);

                // Tampilkan preview
                imagePreview.src = img.src;

                // Reset picker
                pickedColorDisplay.style.backgroundColor = '#444';
                pickedColorValue.textContent = 'Warna Dipilih: N/A';
                copyPickedColorButton.style.display = 'none';

                // Tampilkan loader dan proses palet
                colorPaletteDiv.innerHTML = '';
                paletteLoader.style.display = 'flex';
                setTimeout(() => {
                    try {
                        const palette = colorThief.getPalette(img, 8);
                        displayColorPalette(palette);
                    } catch (error) {
                        console.error("Gagal memproses gambar:", error);
                        showNotification("Terjadi kesalahan saat memproses gambar.");
                        paletteLoader.style.display = 'none';
                    }
                }, 50); // Timeout kecil untuk memastikan UI update
            };
            img.onerror = () => {
                showNotification("Gagal memuat file gambar. Mungkin file rusak.");
                resetToInitialState();
            };
        };

        reader.readAsDataURL(file);
    };
    
    // Reset ke tampilan awal
    const resetToInitialState = () => {
        uploadArea.style.display = 'block';
        mainContent.style.display = 'none';
        progressContainer.style.display = 'none';
        fileInfo.textContent = '';
        imageUpload.value = ''; // Reset input file
    }

    // === Event Listeners ===

    // Klik pada drop zone memicu input file
    dropZone.addEventListener('click', () => imageUpload.click());
    
    // Pemilihan file dari dialog
    imageUpload.addEventListener('change', (e) => handleFile(e.target.files[0]));

    // Drag and Drop listeners
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Color Picker
    imagePreview.addEventListener('click', (event) => {
        const rect = imagePreview.getBoundingClientRect();
        
        // Menghitung rasio skala antara ukuran asli (di canvas) dan ukuran tampilan (di img)
        const scaleX = imageCanvas.width / rect.width;
        const scaleY = imageCanvas.height / rect.height;

        // Menghitung koordinat klik pada gambar asli
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        try {
            const pixelData = ctx.getImageData(x, y, 1, 1).data;
            const [r, g, b] = pixelData;
            const hexColor = rgbToHex(r, g, b);

            pickedColorDisplay.style.backgroundColor = hexColor;
            pickedColorValue.textContent = `${hexColor}`;
            copyPickedColorButton.style.display = 'inline-flex';
        } catch (error) {
            console.error("Gagal mengambil warna piksel:", error);
            // Terkadang terjadi jika klik di luar batas gambar karena pembulatan
        }
    });

    // Tombol salin untuk warna yang dipilih
    copyPickedColorButton.addEventListener('click', () => {
        const colorToCopy = pickedColorValue.textContent;
        if (colorToCopy && colorToCopy !== 'Warna Dipilih: N/A') {
            navigator.clipboard.writeText(colorToCopy)
                .then(() => showNotification(`Warna ${colorToCopy} berhasil disalin!`))
                .catch(() => showNotification('Gagal menyalin warna.'));
        }
    });

    // === Inisialisasi ===
    lucide.createIcons(); // Render semua ikon saat halaman dimuat
});
