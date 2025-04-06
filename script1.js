 const welcomeText = document.getElementById('welcome-text');
    const colors = ['red', 'green', 'blue', 'orange', 'purple'];
    let colorIndex = 0;

    function changeColor() {
        welcomeText.style.color = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length; // Kembali ke awal array jika sudah mencapai akhir
    }

    setInterval(changeColor, 1000); // Ganti warna setiap 1 detik