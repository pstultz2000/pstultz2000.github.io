document.addEventListener('DOMContentLoaded', (event) => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let currentPosition = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[currentPosition]) {
            currentPosition++;
            if (currentPosition === konamiCode.length) {
                activateKonami();
            }
        } else {
            currentPosition = 0; // Reset if the sequence is wrong
        }
    });

    function activateKonami() {
        showKonamiModal();
        currentPosition = 0; // Reset the position for the next attempt
    }

    function closeModal() {
        document.getElementById('konamiModal').style.display = 'none';
    }
       
    
    function showKonamiModal() {
        document.getElementById('konamiModal').style.display = 'block';
    }
    
});

