// Data gambar (ganti dengan path dan deskripsi gambar Anda)
const images = [
    { src: 'https://placehold.co/600x400/A5B4FC/3730A3?text=Ilustrasi+1', alt: 'Deskripsi Ilustrasi Pertama', title: 'Karya Seni Digital Abstrak' },
    { src: 'https://placehold.co/600x400/C4B5FD/4338CA?text=Ilustrasi+2', alt: 'Deskripsi Ilustrasi Kedua', title: 'Pemandangan Fantasi' },
    { src: 'https://placehold.co/600x400/DDD6FE/5B21B6?text=Ilustrasi+3', alt: 'Deskripsi Ilustrasi Ketiga', title: 'Karakter Anime Lucu' },
    { src: 'https://placehold.co/600x400/A78BFA/6D28D9?text=Ilustrasi+4', alt: 'Deskripsi Ilustrasi Keempat', title: 'Robot Futuristik' },
    { src: 'https://placehold.co/600x400/8B5CF6/7C3AED?text=Ilustrasi+5', alt: 'Deskripsi Ilustrasi Kelima', title: 'Makhluk Mitos' },
    { src: 'https://placehold.co/600x400/7C3AED/8B5CF6?text=Ilustrasi+6', alt: 'Deskripsi Ilustrasi Keenam', title: 'Kota Cyberpunk' },
    { src: 'https://placehold.co/600x400/6D28D9/A78BFA?text=Ilustrasi+7', alt: 'Deskripsi Ilustrasi Ketujuh', title: 'Alam Semesta Miniatur' },
    { src: 'https://placehold.co/600x400/5B21B6/DDD6FE?text=Ilustrasi+8', alt: 'Deskripsi Ilustrasi Kedelapan', title: 'Potret Surreal' },
];

const galleryGrid = document.getElementById('galleryGrid');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const captionText = document.getElementById('caption');
const closeModal = document.querySelector('.close-modal');
const prevModalButton = document.querySelector('.prev-modal');
const nextModalButton = document.querySelector('.next-modal');
let currentIndex = 0;

// Fungsi untuk membuat item galeri
function createGalleryItem(image, index) {
    const div = document.createElement('div');
    // Kartu galeri dengan latar belakang putih
    div.className = 'gallery-item bg-white rounded-lg shadow-lg overflow-hidden'; 
    
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.className = 'w-full h-64 object-cover';
    img.loading = 'lazy'; // Lazy loading untuk performa

    const titleContainer = document.createElement('div');
    titleContainer.className = 'p-4';
    
    const title = document.createElement('h3');
    // Judul item galeri berwarna ungu
    title.className = 'text-lg font-semibold text-purple-700'; 
    title.textContent = image.title;

    titleContainer.appendChild(title);
    div.appendChild(img);
    div.appendChild(titleContainer);

    // Event listener untuk membuka modal ketika gambar diklik
    div.addEventListener('click', () => {
        openModal(index);
    });
    return div;
}

// Fungsi untuk memuat gambar ke galeri
function loadGallery() {
    images.forEach((image, index) => {
        galleryGrid.appendChild(createGalleryItem(image, index));
    });
}

// Fungsi untuk membuka modal
function openModal(index) {
    currentIndex = index;
    modal.style.display = "flex"; // Menggunakan flex untuk centering
    modalImage.src = images[currentIndex].src;
    modalImage.alt = images[currentIndex].alt;
    captionText.textContent = images[currentIndex].title;
    document.body.style.overflow = 'hidden'; // Mencegah scroll halaman di belakang modal
    updateModalNavigation();
}

// Fungsi untuk menutup modal
function closeModalFunction() {
    modal.style.display = "none";
    document.body.style.overflow = 'auto'; // Mengembalikan scroll halaman
}

// Fungsi untuk menampilkan gambar sebelumnya
function showPrevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        openModal(currentIndex);
    }
}

// Fungsi untuk menampilkan gambar selanjutnya
function showNextImage() {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        openModal(currentIndex);
    }
}

// Fungsi untuk memperbarui visibilitas tombol navigasi modal
function updateModalNavigation() {
    prevModalButton.classList.toggle('nav-hidden', currentIndex === 0);
    nextModalButton.classList.toggle('nav-hidden', currentIndex === images.length - 1);
}

// Event listener untuk tombol tutup modal
closeModal.addEventListener('click', closeModalFunction);

// Event listener untuk tombol navigasi
prevModalButton.addEventListener('click', showPrevImage);
nextModalButton.addEventListener('click', showNextImage);

// Event listener untuk menutup modal dengan klik di luar gambar
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModalFunction();
    }
});

// Event listener untuk navigasi keyboard (Esc, panah kiri, panah kanan)
document.addEventListener('keydown', (event) => {
    if (modal.style.display === "flex") { // Hanya aktif jika modal terbuka
        if (event.key === 'Escape') {
            closeModalFunction();
        } else if (event.key === 'ArrowLeft') {
            showPrevImage();
        } else if (event.key === 'ArrowRight') {
            showNextImage();
        }
    }
});

// Mengatur tahun saat ini di footer
// Pastikan elemen dengan id 'currentYear' ada di HTML Anda
if (document.getElementById('currentYear')) {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}


// Memuat galeri saat halaman dimuat
window.onload = loadGallery;
