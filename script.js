document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Data ilustrasi (kamu bisa menambahkan lebih banyak di sini!)
    const illustrations = [
        {
            id: 1,
            title: "Fantasi Hutan",
            description: "Ilustrasi digital dengan nuansa magis.",
            category: "digital",
            imageUrl: "https://via.placeholder.com/400x300/6A5ACD/FFFFFF?text=Fantasi+Hutan"
        },
        {
            id: 2,
            title: "Potret Klasik",
            description: "Potret cat minyak dengan detail halus.",
            category: "traditional",
            imageUrl: "https://via.placeholder.com/400x300/CD5C5C/FFFFFF?text=Potret+Klasik"
        },
        {
            id: 3,
            title: "Desain Karakter Robot",
            description: "Konsep karakter untuk dunia fiksi ilmiah.",
            category: "characters",
            imageUrl: "https://via.placeholder.com/400x300/4682B4/FFFFFF?text=Robot+Karakter"
        },
        {
            id: 4,
            title: "Pemandangan Kota Futuristik",
            description: "Ilustrasi digital kota masa depan.",
            category: "digital",
            imageUrl: "https://via.placeholder.com/400x300/8A2BE2/FFFFFF?text=Kota+Futuristik"
        },
        {
            id: 5,
            title: "Still Life Apel",
            description: "Studi still life dengan media pensil warna.",
            category: "traditional",
            imageUrl: "https://via.placeholder.com/400x300/FFD700/000000?text=Still+Life+Apel"
        },
        {
            id: 6,
            title: "Hewan Lucu",
            description: "Ilustrasi karakter hewan untuk anak-anak.",
            category: "characters",
            imageUrl: "https://via.placeholder.com/400x300/20B2AA/FFFFFF?text=Hewan+Lucu"
        }
        // Tambahkan lebih banyak ilustrasi di sini!
    ];

    function displayIllustrations(filter = 'all') {
        galleryContainer.innerHTML = '';
        const filteredIllustrations = filter === 'all'
            ? illustrations
            : illustrations.filter(ill => ill.category === filter);

        if (filteredIllustrations.length === 0) {
            galleryContainer.innerHTML = '<p class="no-results">Tidak ada ilustrasi untuk kategori ini.</p>';
            return;
        }

        filteredIllustrations.forEach(illustration => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.dataset.category = illustration.category;

            galleryItem.innerHTML = `
                <img src="${illustration.imageUrl}" alt="${illustration.title}">
                <div class="item-info">
                    <h3>${illustration.title}</h3>
                    <p>${illustration.description}</p>
                </div>
            `;
            galleryContainer.appendChild(galleryItem);
        });
    }

    // Panggil saat pertama kali dimuat
    displayIllustrations();

    // Event listener untuk filter
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.dataset.filter;
            displayIllustrations(filterValue);
        });
    });

    // Opsional: Smooth scrolling untuk navigasi
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
