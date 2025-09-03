// Dapatkan elemen-elemen penting
const imageContainer = document.querySelector('.image-container');
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');

// Fungsi untuk memperbarui gradient
function updateGradient() {
    const color1 = color1Input.value;
    const color2 = color2Input.value;
    // Kita gunakan linear-gradient untuk menciptakan efek gradient
    imageContainer.style.setProperty('--gradient', `linear-gradient(to right, ${color1}, ${color2})`);
}

// Tambahkan event listener untuk memantau perubahan warna
color1Input.addEventListener('input', updateGradient);
color2Input.addEventListener('input', updateGradient);

// Panggil fungsi pertama kali saat halaman dimuat
updateGradient();
