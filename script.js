// Pastikan DOM sudah sepenuhnya dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', function() {

    console.log("Situs Sederhana Siap!");

    // Contoh interaksi: Mengubah teks judul artikel ketiga saat diklik
    const changeableTitle = document.getElementById('changeableTitle');

    if (changeableTitle) {
        changeableTitle.addEventListener('click', function() {
            if (changeableTitle.textContent.includes("Diklik!")) {
                changeableTitle.textContent = "Judul Artikel Ketiga (Klik Saya!)";
                changeableTitle.style.color = "#ffffff"; // Kembali ke warna asli
            } else {
                changeableTitle.textContent = "Judul Artikel Ketiga (Sudah Diklik!)";
                changeableTitle.style.color = "#ffcc66"; // Ubah warna saat diklik
            }
        });

        // Menambahkan efek hover sederhana dengan JS (bisa juga dengan CSS :hover)
        changeableTitle.addEventListener('mouseover', function() {
            changeableTitle.style.cursor = 'pointer'; // Ubah kursor menjadi tangan
            if (!changeableTitle.textContent.includes("Diklik!")) {
                 changeableTitle.style.opacity = '0.8';
            }
        });
        changeableTitle.addEventListener('mouseout', function() {
            changeableTitle.style.opacity = '1';
        });
    }

    // Contoh lain: Alert sederhana saat link "Baca Selengkapnya" pertama diklik
    const firstReadMoreButton = document.querySelector('.post-item .read-more'); // Ambil tombol pertama
    if(firstReadMoreButton) {
        firstReadMoreButton.addEventListener('click', function(event) {
            event.preventDefault(); // Mencegah link berpindah halaman (untuk demo)
            alert("Anda mengklik 'Baca Selengkapnya' untuk artikel pertama!");
        });
    }

    // Menambahkan tahun sekarang di footer secara dinamis
    const footerText = document.querySelector('footer p');
    if (footerText && footerText.textContent.includes('2025')) { // Pastikan placeholder tahun ada
        footerText.textContent = footerText.textContent.replace('2025', new Date().getFullYear());
    }

});
