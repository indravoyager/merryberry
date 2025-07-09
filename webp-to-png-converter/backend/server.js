const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

// Mengaktifkan CORS untuk semua request, biar frontend bisa akses
app.use(cors());

// Membuat folder jika belum ada
const uploadsDir = path.join(__dirname, 'uploads');
const convertedDir = path.join(__dirname, 'converted');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir);

// Konfigurasi penyimpanan file dengan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Endpoint untuk mengunggah dan mengonversi gambar
app.post('/upload', upload.array('images'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('Tidak ada file yang diunggah.');
  }

  try {
    const convertedFiles = [];
    for (const file of req.files) {
      const outputFilename = `${path.parse(file.filename).name}.png`;
      const outputPath = path.join(convertedDir, outputFilename);

      await sharp(file.path)
        .toFormat('png')
        .toFile(outputPath);

      // Hapus file WEBP asli setelah konversi
      fs.unlinkSync(file.path);

      convertedFiles.push({
        originalName: file.originalname,
        newName: outputFilename,
        downloadUrl: `/download/${outputFilename}`
      });
    }
    res.json(convertedFiles);
  } catch (error) {
    console.error('Error saat konversi:', error);
    res.status(500).send('Terjadi kesalahan saat mengonversi gambar.');
  }
});

// Endpoint untuk mengunduh file hasil konversi
app.use('/download', express.static(convertedDir));

app.listen(port, () => {
  console.log(`(o･ω･o) Server backend berjalan di http://localhost:${port}`);
});
