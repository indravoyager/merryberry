document.addEventListener('DOMContentLoaded', () => {
    // --- Inisialisasi Pustaka Coloris ---
    Coloris({
      themeMode: 'dark', // Agar cocok dengan tema gelap kita
      alpha: false,      // Kita tidak butuh slider transparansi
      swatches: [        // Contoh warna yang bisa dipilih cepat
        '#bb86fc',
        '#4ca537',
        '#d25796',
        '#03dac6',
        '#cf6679',
        '#ffffff',
        '#000000',
      ],
    });

    // --- Variabel untuk elemen-elemen penting ---
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreview');
    const previewCanvas = document.getElementById('previewCanvas');
    const placeholderText = imagePreviewContainer.querySelector('p');
    const downloadButton = document.getElementById('downloadButton');
    const gradientBar = document.getElementById('gradientBar');
    const colorStopsContainer = document.getElementById('colorStopsContainer');
    const reverseButton = document.getElementById('reverseButton');
    const preset1Button = document.getElementById('preset1Button');

    // --- Pengaturan awal ---
    const ctx = previewCanvas.getContext('2d');
    let originalImageData = null;
    let activeStop = null;

    let colorStops = [
        { color: '#000000', position: 0 },
        { color: '#ffffff', position: 100 }
    ];

    // --- Fungsi-fungsi ---
    const renderGradientBar = () => {
        colorStops.sort((a, b) => a.position - b.position);
        const gradientString = colorStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
        gradientBar.style.background = `linear-gradient(to right, ${gradientString})`;
    };
    
    // ** FUNGSI DIPERBARUI TOTAL DENGAN COLORIS **
    const renderColorStops = () => {
        colorStopsContainer.innerHTML = '';
        colorStops.forEach((stop, index) => {
            const stopElement = document.createElement('div');
            stopElement.className = 'color-stop';
            stopElement.style.left = `${stop.position}%`;
            stopElement.style.backgroundColor = stop.color;
            stopElement.dataset.index = index; // Penting untuk tahu stop mana yang diubah
            
            // Atribut ini akan memberi tahu Coloris untuk mengambil alih
            stopElement.setAttribute('data-coloris', '');
            stopElement.value = stop.color;

            const marker = document.createElement('div');
            marker.className = 'color-stop-marker';
            
            marker.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                activeStop = stopElement;
                activeStop.classList.add('active');
                document.body.style.cursor = 'grabbing';
            });

            stopElement.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                if (colorStops.length > 2) {
                    colorStops.splice(index, 1);
                    updateGradientAndApply();
                }
            });
            
            stopElement.appendChild(marker);
            colorStopsContainer.appendChild(stopElement);
        });
    };
    
    const updateGradientAndApply = () => {
        renderGradientBar();
        renderColorStops();
        applyGradientMap();
    };

    const applyGradientMap = () => {
        if (!originalImageData) return;

        const newImageData = new ImageData(new Uint8ClampedArray(originalImageData.data), originalImageData.width, originalImageData.height);
        const data = newImageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
            const grayPercent = (grayscale / 255) * 100;
            const newColor = getColorAtPosition(grayPercent);
            data[i] = newColor.r; data[i + 1] = newColor.g; data[i + 2] = newColor.b;
        }
        ctx.putImageData(newImageData, 0, 0);
    };
    
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    };

    const getColorAtPosition = (position) => {
        let startStop = colorStops[0], endStop = colorStops[colorStops.length - 1];
        for (let i = 0; i < colorStops.length - 1; i++) {
            if (position >= colorStops[i].position && position <= colorStops[i + 1].position) {
                startStop = colorStops[i]; endStop = colorStops[i + 1];
                break;
            }
        }
        const startColor = hexToRgb(startStop.color), endColor = hexToRgb(endStop.color);
        const range = endStop.position - startStop.position;
        const factor = range === 0 ? 0 : (position - startStop.position) / range;
        const r = Math.round(startColor.r + (endColor.r - startColor.r) * factor);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * factor);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * factor);
        return { r, g, b };
    };
    
    // --- KUMPULAN EVENT LISTENERS ---
    function setupEventListeners() {
        // Event listener khusus dari Coloris saat warna berubah
        document.addEventListener('coloris:pick', event => {
            const newColor = event.detail.color;
            const stopElement = event.target;
            const index = stopElement.dataset.index;

            if (index !== undefined) {
                // Update warna di array data kita
                colorStops[index].color = newColor;
                // Update warna background lingkaran secara langsung
                stopElement.style.backgroundColor = newColor;
                // Update bar gradien dan gambar
                renderGradientBar();
                applyGradientMap();
            }
        });

        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    placeholderText.style.display = 'none';
                    previewCanvas.style.display = 'block';
                    previewCanvas.width = img.width;
                    previewCanvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    originalImageData = ctx.getImageData(0, 0, img.width, img.height);
                    downloadButton.disabled = false;
                    applyGradientMap();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        gradientBar.addEventListener('click', (e) => {
            if (e.target.closest('.color-stop')) return;
            
            const rect = gradientBar.getBoundingClientRect();
            const position = ((e.clientX - rect.left) / rect.width) * 100;
            const newColor = getColorAtPosition(position);
            const newColorHex = `#${newColor.r.toString(16).padStart(2, '0')}${newColor.g.toString(16).padStart(2, '0')}${newColor.b.toString(16).padStart(2, '0')}`;
            colorStops.push({ color: newColorHex, position: position });
            updateGradientAndApply();
        });

        document.addEventListener('mousemove', (e) => {
            if (!activeStop) return;
            const rect = gradientBar.getBoundingClientRect();
            let position = ((e.clientX - rect.left) / rect.width) * 100;
            position = Math.max(0, Math.min(100, position));
            const index = activeStop.dataset.index;
            colorStops[index].position = position;
            updateGradientAndApply();
        });

        document.addEventListener('mouseup', () => {
            if (activeStop) {
                activeStop.classList.remove('active');
            }
            activeStop = null;
            document.body.style.cursor = 'default';
        });

        downloadButton.addEventListener('click', () => {
            if(downloadButton.disabled) return;
            const link = document.createElement('a');
            link.download = 'mutsumi-gradient-image.png';
            link.href = previewCanvas.toDataURL('image/png');
            link.click();
        });

        reverseButton.addEventListener('click', () => {
            colorStops.forEach(stop => {
                stop.position = 100 - stop.position;
            });
            updateGradientAndApply();
        });

        preset1Button.addEventListener('click', () => {
            colorStops = [
                { color: '#4ca537', position: 0 },
                { color: '#d25796', position: 100 }
            ];
            updateGradientAndApply();
        });
    }

    // --- Inisialisasi ---
    setupEventListeners();
    updateGradientAndApply();
});
