document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');

    const illustrations = [
        // Data ilustrasi tetap sama seperti sebelumnya
        {
            id: 1,
            title: "Fantasi Hutan",
            description: "Ilustrasi digital dengan nuansa magis.",
            category: "digital",
            imageUrl: "https://static.wikia.nocookie.net/bandori/images/1/1d/Ave_Mujica.jpg/revision/latest?cb=20230905093854"
        },
        {
            id: 2,
            title: "Potret Klasik",
            description: "Potret cat minyak dengan detail halus.",
            category: "traditional",
            imageUrl: "https://static.wikia.nocookie.net/bandori/images/1/1d/Ave_Mujica.jpg/revision/latest?cb=20230905093854"
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
    ];

    function displayIllustrations(filter = 'all') {
        const currentItems = Array.from(galleryContainer.children);
        const filteredIllustrations = filter === 'all'
            ? illustrations
            : illustrations.filter(ill => ill.category === filter);

        // 1. Tambahkan kelas 'hide' ke semua item saat ini (untuk fade-out)
        currentItems.forEach(item => {
            item.classList.add('hide');
        });

        // Tunggu transisi fade-out selesai sebelum menghapus dan menambahkan item baru
        setTimeout(() => {
            galleryContainer.innerHTML = ''; // Kosongkan galeri setelah transisi

            if (filteredIllustrations.length === 0) {
                galleryContainer.innerHTML = '<p class="no-results">Tidak ada ilustrasi untuk kategori ini.</p>';
                return;
            }

            filteredIllustrations.forEach((illustration, index) => {
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
                // Secara default, tambahkan kelas 'hide' terlebih dahulu
                galleryItem.classList.add('hide');
                galleryContainer.appendChild(galleryItem);

                // Setelah ditambahkan ke DOM, picu transisi 'show' dengan sedikit delay
                // Menggunakan setTimeout untuk memastikan CSS transisi diterapkan
                setTimeout(() => {
                    galleryItem.classList.remove('hide');
                    galleryItem.classList.add('show');
                }, 50 * index); // Delay bertingkat untuk efek staggered fade-in
            });
        }, 500); // Waktu ini harus sesuai dengan durasi transisi di CSS (0.5s = 500ms)
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

    // Smooth scrolling untuk navigasi
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
