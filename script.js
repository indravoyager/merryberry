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
    let activeStopElement = null; // Menyimpan elemen DOM yang sedang aktif
    let activeStopIndex = -1;    // Menyimpan index dari colorStop yang aktif
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
        // Hancurkan Pickr lama hanya jika ada perubahan signifikan pada jumlah/urutan stop
        const currentStopCount = colorStopsContainer.children.length;
        if (currentStopCount !== colorStops.length || pickrInstances.length === 0) {
            pickrInstances.forEach(p => p.destroyAndRemove());
            pickrInstances = [];
            colorStopsContainer.innerHTML = '';

            colorStops.forEach((stop, index) => {
                const stopElement = document.createElement('div');
                stopElement.className = 'color-stop';
                stopElement.style.left = `${stop.position}%`;
                // Menambahkan transisi untuk posisi
                stopElement.style.transition = 'left 0.1s ease-out'; 
                
                const marker = document.createElement('div');
                marker.className = 'color-stop-marker';
                
                marker.addEventListener('mousedown', (e) => {
                    e.stopPropagation(); // Mencegah event lain yang tidak perlu
                    activeStopElement = stopElement;
                    activeStopIndex = index;
                    activeStopElement.classList.add('active');
                    document.body.style.cursor = 'grabbing';
                    // Hapus transisi saat dragging agar lebih responsif
                    activeStopElement.style.transition = 'none'; 
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
                    instance.getRoot().button.style.background = newColor; // Set background, bukan color
                    colorStops[index].color = newColor;
                    renderGradientBar();
                    applyGradientMap();
                });
            });
        } else {
            // Jika tidak ada perubahan jumlah stop, hanya update posisi dan warna
            colorStops.forEach((stop, index) => {
                const stopElement = colorStopsContainer.children[index];
                if (stopElement && stopElement !== activeStopElement) { // Jangan update elemen yang sedang di-drag
                    stopElement.style.left = `${stop.position}%`;
                    stopElement.style.transition = 'left 0.1s ease-out'; // Kembali pakai transisi
                }
                pickrInstances[index].setColor(stop.color, false); // Update warna di pickr tanpa memicu event 'change'
            });
        }
    };
    
    // updateGradientAndApply dipanggil saat ada perubahan besar (tambah/hapus stop, reverse, preset)
    const updateGradientAndApply = () => {
        renderGradientBar();
        renderColorStops(); // Memanggil renderColorStops yang akan menangani Pickr
        applyGradientMap();
    };

    const applyGradientMap = () => {
        if (!originalImageData) return;
        requestAnimationFrame(() => { // Menggunakan requestAnimationFrame untuk rendering yang lebih smooth
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
        });
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
    
    // --- Event Listeners ---
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();

        reader.onload = (e) => {
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
            img.onerror = () => {
                console.error("ERROR: Gagal memuat file gambar. Mungkin file rusak atau bukan format gambar.");
                alert("Gagal memuat gambar. Pastikan file valid.");
            };
            img.src = e.target.result;
        };
        reader.onerror = () => {
            console.error("ERROR: FileReader gagal membaca file.");
            alert("Gagal membaca file.");
        };
        reader.readAsDataURL(file);
    }

    imageUpload.addEventListener('change', handleImageUpload);

    gradientBar.addEventListener('click', (e) => {
        // Hanya tambahkan stop jika mengklik area kosong di gradientBar, bukan di atas stop atau picker
        if (e.target.closest('.color-stop') || e.target.closest('.pcr-app')) return;

        const rect = gradientBar.getBoundingClientRect();
        const position = ((e.clientX - rect.left) / rect.width) * 100;
        const newColor = getColorAtPosition(position);
        const newColorHex = `#${newColor.r.toString(16).padStart(2, '0')}${newColor.g.toString(16).padStart(2, '0')}${newColor.b.toString(16).padStart(2, '0')}`;
        colorStops.push({ color: newColorHex, position: position });
        updateGradientAndApply();
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeStopElement || activeStopIndex === -1) return;

        const rect = gradientBar.getBoundingClientRect();
        let newPosition = ((e.clientX - rect.left) / rect.width) * 100;
        newPosition = Math.max(0, Math.min(100, newPosition));

        // Update posisi di data
        colorStops[activeStopIndex].position = newPosition;
        // Update posisi visual elemen DOM secara langsung
        activeStopElement.style.left = `${newPosition}%`;

        // Panggil render dan apply hanya untuk gradien dan gambar, bukan render ulang semua stop
        renderGradientBar();
        applyGradientMap();
    });

    document.addEventListener('mouseup', () => {
        if (activeStopElement) {
            activeStopElement.classList.remove('active');
            activeStopElement.style.transition = 'left 0.1s ease-out'; // Kembalikan transisi setelah selesai drag
        }
        activeStopElement = null;
        activeStopIndex = -1;
        document.body.style.cursor = 'default';
        // Pastikan posisi final di-render ulang Pickr-nya
        renderColorStops(); 
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
