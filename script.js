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
            this.classList.toggle('active'); // Toggle kelas .active pada tombol hamburger

            // Update aria-expanded attribute for accessibility
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);

            // Tidak perlu lagi mengubah innerHTML untuk ikon
        });

        // Menutup menu jika link di klik (berguna untuk navigasi halaman tunggal)
        const allNavLinks = navLinks.querySelectorAll('a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active'); // Hapus kelas .active dari tombol
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
});
