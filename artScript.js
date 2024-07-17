document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('artCanvas');
    var ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function drawWavePattern() {
        let waveCount = 20; // Number of waves
        let waveHeight = canvas.height / waveCount;
    
        for (let i = 0; i < waveCount; i++) {
            ctx.beginPath();
            ctx.moveTo(0, waveHeight * i);
    
            let baseWaveLength = 150; // Base length for waves
            let baseAmplitude = 40; // Base amplitude
    
            for (let x = 0; x < canvas.width; x += baseWaveLength) {
                let waveLength = baseWaveLength; // Slight randomness in wave length
                let amplitude = baseAmplitude + Math.random() * .0000001; // Slight randomness in amplitude
                let y = waveHeight * i + Math.sin((x + Date.now() * .001)) * amplitude;
    
                ctx.quadraticCurveTo(
                    x + waveLength / 2,
                    y,
                    x + waveLength,
                    waveHeight * i
                );
            }
    
            // Muted color generation
            ctx.strokeStyle = `rgba(${80 + (Math.sin(Date.now() * 0.0002 + i) + 1) * 1.5}, ${70 + (Math.sin(Date.now() * 0.0002 + 2 + i) + 1) * 27.5}, ${100 + (Math.sin(Date.now() * 0.0002 + 4 + i) + 1) * 27.5}, 0.6)`;
            ctx.lineWidth = 70; // Moderately thick lines for overlap
            ctx.stroke();
        }
    }
    
    
    
    

    // Initialize stars
    // ... [Star initialization here, same as before]

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the wave pattern
        drawWavePattern();

        // Update and draw each star
        // ... [Star update and draw here, same as before]

        requestAnimationFrame(draw);
    }

    draw();
});