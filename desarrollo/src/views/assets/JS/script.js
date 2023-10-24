const menuToggle = document.getElementById('menuToggle');
const menuOptions = document.getElementById('menuOptions');

menuToggle.addEventListener('click', () => {
    if (menuOptions.style.display === 'block') {
        menuOptions.style.display = 'none';
    } else {
        menuOptions.style.display = 'block';
    }
}); 