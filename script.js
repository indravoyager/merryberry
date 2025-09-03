// Dapatkan elemen-elemen penting
const imageContainer = document.querySelector('.image-container');
const myImage = document.getElementById('myImage');
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');
const imageUpload = document.getElementById('imageUpload');
const downloadButton = document.getElementById('downloadButton');
const hiddenCanvas = document.getElementById('hiddenCanvas');
const ctx = hiddenCanvas.getContext('2d'); // Dapatkan konteks 2D dari canvas

// Fungsi untuk memperbarui gradient
function updateGradient() {
    const color1 = color1Input.value;
    const color2 = color2Input.value;
    // Gunakan CSS variable untuk gradient, biar mudah diakses di canvas nanti
    imageContainer.style.setProperty('--gradient', `linear-gradient(to right, ${color1}, ${color2})`);
}

// Fungsi untuk mengaplikasikan gradient ke gambar asli di canvas
function applyGradientToCanvas(callback) {
    // Pastikan gambar sudah terload
    if (!myImage.complete) {
        myImage.onload = () => applyGradientToCanvas(callback);
        return;
    }

    hiddenCanvas.width = myImage.naturalWidth;
    hiddenCanvas.height = myImage.naturalHeight;

    // Gambar asli
    ctx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height); // Bersihkan canvas
    ctx.drawImage(myImage, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // Buat gradient
    const gradient = ctx.createLinearGradient(0, 0, hiddenCanvas.width, 0);
    gradient.addColorStop(0, color1Input.value);
    gradient.addColorStop(1, color2Input.value);

    // Aplikasikan gradient dengan mix-blend-mode "overlay"
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    ctx.globalCompositeOperation = 'source-over'; // Kembalikan ke normal

    if (callback) callback();
}


// Event listener untuk upload gambar
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            myImage.src = e.target.result;
            myImage.onload = () => {
                updateGradient(); // Perbarui gradient jika gambar baru dimuat
            };
        };
        reader.readAsDataURL(file);
    }
});

// Event listener untuk download gambar
downloadButton.addEventListener('click', () => {
    // Panggil fungsi applyGradientToCanvas sebelum mendownload
    applyGradientToCanvas(() => {
        const dataURL = hiddenCanvas.toDataURL('image/png'); // Dapatkan data URL dari canvas
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'gradient-map-image.png'; // Nama file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});

// Tambahkan event listener untuk memantau perubahan warna
color1Input.addEventListener('input', updateGradient);
color2Input.addEventListener('input', updateGradient);

// Panggil fungsi pertama kali saat halaman dimuat
updateGradient();
