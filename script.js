document.addEventListener('DOMContentLoaded', () => {
    // --- Variabel Elemen Penting ---
    const imageUpload = document.getElementById('imageUpload');
    const previewCanvas = document.getElementById('previewCanvas');
    const placeholderText = document.querySelector('#imagePreview p');
    const downloadButton = document.getElementById('downloadButton');
    const gradientBar = document.getElementById('gradientBar');
    const colorStopsContainer = document.getElementById('colorStopsContainer');
    const reverseButton = document.getElementById('reverseButton');
    const preset1Button = document.getElementById('preset1Button');

    // --- Pengaturan Awal ---
    const ctx = previewCanvas.getContext('2d');
    let originalImageData = null;
    let activeStop = null;
    let pickrInstances = [];

    let colorStops = [
        { color: '#000000', position: 0 },
        { color: '#ffffff', position: 100 }
    ];

    // --- Fungsi-Fungsi Inti ---
    const renderGradientBar = () => {
        colorStops.sort((a, b) => a.position - b.position);
        const gradientString = colorStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
        gradientBar.style.background = `linear-gradient(to right, ${gradientString})`;
    };
    
    const renderColorStops = () => {
        pickrInstances.forEach(p => p.destroyAndRemove());
        pickrInstances = [];
        colorStopsContainer.innerHTML = '';

        colorStops.forEach((stop, index) => {
            const stopElement = document.createElement('div');
            stopElement.className = 'color-stop';
            stopElement.style.left = `${stop.position}%`;
            
            const marker = document.createElement('div');
            marker.className = 'color-stop-marker';
            
            marker.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                activeStop = stopElement;
                activeStop.dataset.index = index;
                activeStop.classList.add('active');
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

            const pickr = Pickr.create({
                el: stopElement, theme: 'monolith', default: stop.color,
                components: {
                    preview: true, opacity: false, hue: true,
                    interaction: { hex: true, input: true, clear: false, save: true }
                }
            });
            pickrInstances.push(pickr);

            pickr.on('change', (color, source, instance) => {
                const newColor = color.toHEXA().toString();
                instance.getRoot().button.style.color = newColor;
                colorStops[index].color = newColor;
                renderGradientBar();
                applyGradientMap();
            });
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
                startStop = colorStops[i]; endStop = colorStops[i + 1]; break;
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
    
    // --- **FUNGSI UPLOAD GAMBAR YANG DIPERBAIKI DAN DIBERI LOG** ---
    function handleImageUpload(event) {
        console.log("1. File dipilih, fungsi handleImageUpload berjalan.");
        const file = event.target.files[0];
        
        if (!file) {
            console.error("Upload dibatalkan: Tidak ada file yang dipilih.");
            return;
        }
        console.log("2. File ditemukan:", file.name);

        const reader = new FileReader();

        reader.onload = (e) => {
            console.log("3. FileReader selesai membaca file.");
            const img = new Image();

            img.onload = () => {
                console.log("4. Gambar berhasil dimuat ke memori, ukurannya:", img.width, "x", img.height);
                try {
                    placeholderText.style.display = 'none';
                    previewCanvas.style.display = 'block';
                    previewCanvas.width = img.width;
                    previewCanvas.height = img.height;
                    console.log("5. Canvas disiapkan dan ditampilkan.");
                    
                    ctx.drawImage(img, 0, 0);
                    console.log("6. Gambar digambar ke canvas.");
                    
                    originalImageData = ctx.getImageData(0, 0, img.width, img.height);
                    console.log("7. Pixel data gambar asli berhasil diambil.");
                    
                    downloadButton.disabled = false;
                    applyGradientMap();
                    console.log("8. Proses selesai! Gambar seharusnya muncul.");
                } catch (error) {
                    console.error("Terjadi error saat menampilkan gambar di canvas:", error);
                }
            };
            
            img.onerror = () => {
                console.error("ERROR: Gagal memuat file gambar. Mungkin file rusak atau bukan format gambar.");
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            console.error("ERROR: FileReader gagal membaca file.");
        };

        reader.readAsDataURL(file);
    }

    // --- Setup Event Listeners ---
    imageUpload.addEventListener('change', handleImageUpload);

    gradientBar.addEventListener('click', (e) => {
        if (e.target.closest('.color-stop') || e.target.closest('.pcr-app')) return;
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
        activeStop.style.left = `${position}%`;
        renderGradientBar();
        applyGradientMap();
    });

    document.addEventListener('mouseup', () => {
        if (activeStop) {
            activeStop.classList.remove('active');
        }
        activeStop = null;
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
        colorStops = [ { color: '#4ca537', position: 0 }, { color: '#d25796', position: 100 } ];
        updateGradientAndApply();
    });

    // Inisialisasi awal
    updateGradientAndApply();
});
