const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const resultList = document.getElementById('result-list');
const backendUrl = 'http://localhost:3001'; // URL server backend kita

// Fungsi untuk membuat kartu hasil konversi
function createResultCard(file, status) {
  const card = document.createElement('div');
  card.className = 'flex items-center justify-between bg-slate-50 p-4 rounded-lg shadow-sm';
  card.innerHTML = `
    <div class="flex items-center gap-4">
      <div id="status-${file.name}" class="spinner"></div>
      <span class="font-medium text-slate-700 truncate">${file.name}</span>
    </div>
    <div id="action-${file.name}">
        <span class="text-sm text-slate-500">${status}</span>
    </div>
  `;
  resultList.appendChild(card);
  return card;
}

// Fungsi untuk update kartu setelah konversi selesai
function updateCardOnSuccess(card, originalName, newName, downloadUrl) {
  const statusElement = document.getElementById(`status-${originalName}`);
  const actionElement = document.getElementById(`action-${originalName}`);

  statusElement.className = 'w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white';
  statusElement.innerHTML = '✓'; // Tanda centang

  actionElement.innerHTML = `
    <a href="${backendUrl}${downloadUrl}" download="${newName}" class="bg-blue-500 text-white font-bold py-2 px-4 text-sm rounded-lg hover:bg-blue-600 transition-colors">
      Unduh
    </a>
  `;
}

// Fungsi untuk menangani proses upload
async function handleFiles(files) {
  const formData = new FormData();
  for (const file of files) {
    if (file.type !== 'image/webp') {
      alert('Hanya file WEBP yang diizinkan!');
      continue;
    }
    formData.append('images', file);
    createResultCard(file, 'Mengunggah...');
  }

  try {
    const response = await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload gagal!');

    const convertedFiles = await response.json();
    
    // Update setiap kartu dengan tombol unduh
    for (const convertedFile of convertedFiles) {
        const cardElement = Array.from(resultList.children).find(card => card.innerText.includes(convertedFile.originalName));
        if(cardElement) {
            updateCardOnSuccess(cardElement, convertedFile.originalName, convertedFile.newName, convertedFile.downloadUrl);
        }
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Oops, terjadi kesalahan!');
  }
}

// Event Listeners untuk area upload
browseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  uploadArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

['dragenter', 'dragover'].forEach(eventName => {
  uploadArea.addEventListener(eventName, () => uploadArea.classList.add('border-rose-400', 'bg-rose-50'));
});

['dragleave', 'drop'].forEach(eventName => {
  uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('border-rose-400', 'bg-rose-50'));
});

uploadArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
