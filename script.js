document.addEventListener('DOMContentLoaded', function() {
    // Menampilkan tahun saat ini di footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Fungsi untuk menu mobile (hamburger)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Update aria-expanded attribute for accessibility
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            // Ganti ikon hamburger menjadi 'X' dan sebaliknya
            if (isExpanded) {
                menuToggle.innerHTML = '&times;'; // Karakter 'X'
            } else {
                menuToggle.innerHTML = '☰'; // Karakter hamburger
            }
        });

        // Menutup menu jika link di klik (berguna untuk navigasi halaman tunggal)
        const allNavLinks = navLinks.querySelectorAll('a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.innerHTML = '☰'; // Kembalikan ikon hamburger
                }
            });
        });
    }
});
