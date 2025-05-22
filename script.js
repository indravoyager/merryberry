document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Data ilustrasi (kamu bisa menambahkan lebih banyak di sini!)
    const illustrations = [
        {
            id: 1,
            title: "Kota Malam",
            description: "Ilustrasi digital pemandangan kota di malam hari.",
            category: "digital",
            imageUrl: "https://via.placeholder.com/400x300/FF5733/FFFFFF?text=Ilustrasi+Kota+Malam" // Ganti dengan URL gambar aslimu
        },
        {
            id: 2,
            title: "Potret Tradisional",
            description: "Potret menggunakan media cat air.",
            category: "traditional",
            imageUrl: "https://via.placeholder.com/400x300/33FF57/FFFFFF?text=Potret+Tradisional" // Ganti dengan URL gambar aslimu
        },
        {
            id: 3,
            title: "Karakter Fantasi",
            description: "Desain karakter untuk game fantasi.",
            category: "characters",
            imageUrl: "https://via.placeholder.com/400x300/3357FF/FFFFFF?text=Karakter+Fantasi" // Ganti dengan URL gambar aslimu
        },
        {
            id: 4,
            title: "Pemandangan Hutan",
            description: "Ilustrasi digital pemandangan hutan yang damai.",
            category: "digital",
            imageUrl: "https://via.placeholder.com/400x300/FF33A1/FFFFFF?text=Hutan+Damai" // Ganti dengan URL gambar aslimu
        },
        {
            id: 5,
            title: "Sketsa Pensil",
            description: "Sketsa pensil detail wajah manusia.",
            category: "traditional",
            imageUrl: "https://via.placeholder.com/400x300/A133FF/FFFFFF?text=Sketsa+Pensil" // Ganti dengan URL gambar aslimu
        }
        // Tambahkan lebih banyak ilustrasi di sini
    ];

    // Fungsi untuk menampilkan ilustrasi
    function displayIllustrations(filter = 'all') {
        galleryContainer.innerHTML = ''; // Kosongkan galeri sebelum menampilkan
        const filteredIllustrations = filter === 'all'
            ? illustrations
            : illustrations.filter(ill => ill.category === filter);

        filteredIllustrations.forEach(illustration => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.dataset.category = illustration.category; // Menambahkan data-category untuk filtering

            galleryItem.innerHTML = `
                <img src="${illustration.imageUrl}" alt="${illustration.title}">
                <h3>${illustration.title}</h3>
                <p>${illustration.description}</p>
            `;
            galleryContainer.appendChild(galleryItem);
        });
    }

    // Tampilkan semua ilustrasi saat halaman pertama kali dimuat
    displayIllustrations();

    // Tambahkan event listener untuk tombol filter
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hapus kelas 'active' dari semua tombol
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Tambahkan kelas 'active' ke tombol yang diklik
            this.classList.add('active');

            const filterValue = this.dataset.filter;
            displayIllustrations(filterValue);
        });
    });
});
