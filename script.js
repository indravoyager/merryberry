// Menampilkan tahun saat ini di footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Optional: Smooth scroll untuk semua link internal (jika html {scroll-behavior: smooth;} tidak cukup atau ingin kontrol lebih)
    // const internalLinks = document.querySelectorAll('a[href^="#"]');
    // internalLinks.forEach(link => {
    //     link.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         let targetId = this.getAttribute('href');
    //         let targetElement = document.querySelector(targetId);

    //         if (targetElement) {
    //             targetElement.scrollIntoView({
    //                 behavior: 'smooth'
    //             });
    //         }
    //     });
    // });
});
