document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const captionModalText = document.getElementById('captionModal');
    const closeButton = document.querySelector('.close-button');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgElement = this.querySelector('img');
            const imgSrc = imgElement.src;
            const imgAlt = imgElement.alt;
            
            const captionElement = this.querySelector('.caption');
            const captionText = captionElement ? captionElement.innerText : imgAlt; 

            modalImage.src = imgSrc;
            modalImage.alt = imgAlt; 
            captionModalText.innerText = captionText;

            modal.style.display = "flex"; 
        });
    });

    function closeModal() {
        modal.style.display = "none";
        modalImage.src = ""; 
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });
});
