// Data gambar (ganti dengan path dan deskripsi gambar Anda)
const images = [
    { src: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/11/reverse-1999-the-best-voyager-build-psychubes-team-comp.jpg?', alt: 'Deskripsi Ilustrasi Pertama', title: 'Voyager 001' },
    { src: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/11/reverse-1999-the-best-voyager-build-psychubes-team-comp.jpg?', alt: 'Deskripsi Ilustrasi Kedua', title: 'Voyager 002' },
    { src: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/11/reverse-1999-the-best-voyager-build-psychubes-team-comp.jpg?', alt: 'Deskripsi Ilustrasi Ketiga', title: 'Voyager 003' },
    { src: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/11/reverse-1999-the-best-voyager-build-psychubes-team-comp.jpg?', alt: 'Deskripsi Ilustrasi Keempat', title: 'Robot Futuristik' },
    { src: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/11/reverse-1999-the-best-voyager-build-psychubes-team-comp.jpg?', alt: 'Deskripsi Ilustrasi Kelima', title: 'Makhluk Mitos' },
    { src: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/11/reverse-1999-the-best-voyager-build-psychubes-team-comp.jpg?', alt: 'Deskripsi Ilustrasi Keenam', title: 'Kota Cyberpunk' },
    { src: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/11/reverse-1999-the-best-voyager-build-psychubes-team-comp.jpg?',, alt: 'Deskripsi Ilustrasi Ketujuh', title: 'Alam Semesta Miniatur' },
    { src: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/11/reverse-1999-the-best-voyager-build-psychubes-team-comp.jpg?', alt: 'Deskripsi Ilustrasi Kedelapan', title: 'Potret Surreal' },
];

const galleryGrid = document.getElementById('galleryGrid');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const captionText = document.getElementById('caption');
const closeModalButton = document.querySelector('.close-modal');
const prevModalButton = document.querySelector('.prev-modal');
const nextModalButton = document.querySelector('.next-modal');
let currentIndex = 0;

// Fungsi untuk membuat item galeri
function createGalleryItem(image, index) {
    const div = document.createElement('div');
    div.className = 'gallery-item'; // Kelas CSS kustom
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy'; 

    imageContainer.appendChild(img);

    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    
    const title = document.createElement('h3');
    title.textContent = image.title;

    titleContainer.appendChild(title);
    div.appendChild(imageContainer);
    div.appendChild(titleContainer);

    div.addEventListener('click', () => {
        openModal(index);
    });
    return div;
}

function loadGallery() {
    if (galleryGrid) { // Pastikan elemen galleryGrid ada
        images.forEach((image, index) => {
            galleryGrid.appendChild(createGalleryItem(image, index));
        });
    }
}

function openModal(index) {
    currentIndex = index;
    if (modal && modalImage && captionText) { // Pastikan elemen modal ada
        modal.style.display = "flex";
        modalImage.src = images[currentIndex].src;
        modalImage.alt = images[currentIndex].alt;
        captionText.textContent = images[currentIndex].title;
        document.body.style.overflow = 'hidden';
        updateModalNavigation();
    }
}

function closeModalFunction() {
    if (modal) { // Pastikan elemen modal ada
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }
}

function showPrevImage() {
    if (currentIndex > 0) {
        currentIndex--;
        openModal(currentIndex);
    }
}

function showNextImage() {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        openModal(currentIndex);
    }
}

function updateModalNavigation() {
    if (prevModalButton && nextModalButton) { // Pastikan tombol navigasi ada
        prevModalButton.classList.toggle('nav-hidden', currentIndex === 0);
        nextModalButton.classList.toggle('nav-hidden', currentIndex === images.length - 1);
    }
}

// Pastikan elemen-elemen ada sebelum menambahkan event listener
if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModalFunction);
}
if (prevModalButton) {
    prevModalButton.addEventListener('click', showPrevImage);
}
if (nextModalButton) {
    nextModalButton.addEventListener('click', showNextImage);
}

window.addEventListener('click', (event) => {
    if (modal && event.target === modal) { 
        closeModalFunction();
    }
});

document.addEventListener('keydown', (event) => {
    if (modal && modal.style.display === "flex") {
        if (event.key === 'Escape') {
            closeModalFunction();
        } else if (event.key === 'ArrowLeft' && prevModalButton && !prevModalButton.classList.contains('nav-hidden')) {
            showPrevImage();
        } else if (event.key === 'ArrowRight' && nextModalButton && !nextModalButton.classList.contains('nav-hidden')) {
            showNextImage();
        }
    }
});

if (document.getElementById('currentYear')) {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

window.onload = loadGallery;
