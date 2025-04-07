const welcomeText = document.getElementById('welcome-text');
const initialTextColor = getComputedStyle(welcomeText).color;
const initialBackgroundColor = getComputedStyle(document.body).backgroundColor;

let mouseOverTimeout;
let mouseOutTimeout;
const delay = 200;

welcomeText.addEventListener('mouseover', function() {
    clearTimeout(mouseOutTimeout);
    mouseOverTimeout = setTimeout(() => {
        document.body.style.backgroundColor = initialTextColor;
        welcomeText.style.color = initialBackgroundColor;
    }, delay);
});

welcomeText.addEventListener('mouseout', function() {
    clearTimeout(mouseOverTimeout);
    mouseOutTimeout = setTimeout(() => {
        document.body.style.backgroundColor = initialBackgroundColor;
        welcomeText.style.color = initialTextColor;
    }, delay);
});
