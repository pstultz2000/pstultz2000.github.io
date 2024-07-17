const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameWidth = 800; // The virtual width of the game
const gameHeight = 600; // The virtual height of the game


let spaceship = {
    x: gameWidth / 4,
    y: gameHeight / 4,
    width: 20,
    height: 40,
    speed: 0,
    maxSpeed: 4.8,
    acceleration: 0.15,
    deceleration: 0.2,
    rotation: 0,
    turningSpeed: 0.055,
    driftFactor: .95,
    lateralSpeed: 0,
    driftAngle: 0,
    rotation: 0,
    targetRotation: 0,
    traction: 0.1,
    recentTurnAmount: 0,
    color: 'white',
    isSpinningOut: false,
};

let keys = {
    w: false,
    s: false,
    a: false,
    d: false
};

function drawSpaceship() {
    const scaleX = canvas.width / gameWidth;
    const scaleY = canvas.height / gameHeight;

    ctx.save();
    ctx.scale(scaleX, scaleY);
    ctx.translate(spaceship.x, spaceship.y);
    ctx.rotate(spaceship.rotation);

    // Begin drawing the spaceship shape
    ctx.beginPath();
    // Nose of the spaceship (right side)
    ctx.moveTo(spaceship.width / 2, 0);
    // Rear top
    ctx.lineTo(-spaceship.width / 2, -spaceship.height / 2);
    // Rear bottom
    ctx.lineTo(-spaceship.width / 2, spaceship.height / 2);
    // Back to the nose
    ctx.closePath();

    // Fill the spaceship
    ctx.fillStyle = spaceship.color;
    ctx.fill();

    ctx.restore();
}

let backgroundMusic = document.getElementById('backgroundMusic');

let colorIndex = 0;
const colors = [
    'white', 'red', 'blue', 'green', 'yellow',
    'orange', 'purple', 'pink', 'cyan', 'magenta',
    'lime', 'teal', 'navy', 'maroon', 'olive',
    'brown', 'coral', 'turquoise', 'indigo', 'violet',
    'gold', 'silver', 'peachpuff', 'wheat', 'lavender',
    'plum', 'sienna', 'tan', 'aqua', 'aquamarine',
    'azure', 'beige', 'bisque', 'blanchedalmond', 'blueviolet',
    'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'cornflowerblue'
];


document.getElementById('colorButton').addEventListener('click', function() {
    colorIndex = (colorIndex + 1) % colors.length; // Cycle through the colors
    spaceship.color = colors[colorIndex];
});

function updateSpaceship() {
    if (keys.w) spaceship.speed = Math.min(spaceship.speed + spaceship.acceleration, spaceship.maxSpeed);
    if (keys.s) spaceship.speed = Math.max(spaceship.speed - spaceship.deceleration, -spaceship.maxSpeed);

    // Traction calculation
    const baseTraction = 0.05; // Base traction value
    const tractionReductionFactor = 0.01; // Factor to reduce traction at higher speeds
    spaceship.traction = baseTraction - tractionReductionFactor * spaceship.speed;
    spaceship.traction = Math.max(spaceship.traction, 0.0001); // Ensure traction doesn't go below a minimum value

    // Turn amount calculation
    const turningMultiplier = 0.5;
    let turnAmount = 0;
    if (keys.a) turnAmount -= spaceship.turningSpeed * turningMultiplier;
    if (keys.d) turnAmount += spaceship.turningSpeed * turningMultiplier;

    // Update target rotation and accumulate turn amount
    if (turnAmount !== 0) {
        spaceship.targetRotation += turnAmount;
        spaceship.recentTurnAmount += Math.abs(turnAmount);
    } else {
        // Reduce recent turn amount over time
        spaceship.recentTurnAmount *= 0.9;
    }

    // Check for spin-out condition
    const spinOutThreshold = 0.42; // Adjust as needed
    const speedThreshold = spaceship.maxSpeed * 0.85; // Spin out at 80% of max speed or higher
    if (spaceship.recentTurnAmount > spinOutThreshold && spaceship.speed > speedThreshold && !spaceship.isSpinningOut) {
        spaceship.isSpinningOut = true;
    }

    // Handle spinning out
    if (spaceship.isSpinningOut) {
        spaceship.rotation += 0.023; // Rapid spin
        // Add logic to stop spinning out if necessary (e.g., reducing speed or after a time delay)
    } else {
        spaceship.rotation += (spaceship.targetRotation - spaceship.rotation) * spaceship.traction;
    }

    const currentTime = Date.now();
    if (spaceship.isSpinningOut) {
        if (!spaceship.spinOutStartTime) {
            spaceship.spinOutStartTime = currentTime; // Record the start time of spin-out
        }
        spaceship.rotation += 0.016; // Rapid spin

        if (currentTime - spaceship.spinOutStartTime > 50) { // Spin-out lasts for twentieth of a second
            spaceship.isSpinningOut = false;
            spaceship.spinOutCooldownStartTime = currentTime; // Start cooldown
            spaceship.spinOutStartTime = null; // Reset spin-out start time
        }
    } else if (spaceship.spinOutCooldownStartTime && currentTime - spaceship.spinOutCooldownStartTime < 2500) {
        // During cooldown period of 2.5 seconds, no new spin-out
    } else {
        spaceship.spinOutCooldownStartTime = null; // Reset cooldown start time

        // Gradually align rotation with targetRotation based on traction
        spaceship.rotation += (spaceship.targetRotation - spaceship.rotation) * spaceship.traction;

        // Update target rotation and accumulate turn amount for spin-out
        let turnAmount = 0;
        if (keys.a) turnAmount -= spaceship.turningSpeed * turningMultiplier;
        if (keys.d) turnAmount += spaceship.turningSpeed * turningMultiplier;

        if (turnAmount !== 0) {
            spaceship.targetRotation += turnAmount;
            spaceship.recentTurnAmount += Math.abs(turnAmount);
        } else {
            // Reduce recent turn amount over time
            spaceship.recentTurnAmount *= 0.9;
        }

        // Check for spin-out condition
        if (spaceship.recentTurnAmount > spinOutThreshold && spaceship.speed > speedThreshold && !spaceship.isSpinningOut) {
            spaceship.isSpinningOut = true;
        }
    }

    if (isOffRoad()) {
        spaceship.speed *= 0.8;
        spaceship.lateralSpeed *= 0.8;
    } else {
        spaceship.speed = Math.min(spaceship.speed, spaceship.maxSpeed);
        spaceship.lateralSpeed = Math.min(spaceship.lateralSpeed, spaceship.maxSpeed);
    }

    // Drift mechanic and basic movement combined
    const driftForce = keys.a || keys.d ? 0.15 : 0;
    spaceship.lateralSpeed += driftForce * (spaceship.speed / spaceship.maxSpeed);
    spaceship.lateralSpeed *= 0.95;
    spaceship.driftAngle = keys.a ? -2 : keys.d ? 2 : 0;

    spaceship.x += spaceship.speed * Math.cos(spaceship.rotation) + spaceship.lateralSpeed * Math.cos(spaceship.rotation + spaceship.driftAngle);
    spaceship.y += spaceship.speed * Math.sin(spaceship.rotation) + spaceship.lateralSpeed * Math.sin(spaceship.rotation + spaceship.driftAngle);
}

let timerStarted = false;




function isOffRoad() {
    const trackBorderWidth = 200; // Adjusted track border width
    const innerTrackX = trackBorderWidth;
    const innerTrackY = trackBorderWidth;
    const innerTrackWidth = gameWidth - 2 * trackBorderWidth;
    const innerTrackHeight = gameHeight - 2 * trackBorderWidth;

    // Check if the spaceship is inside the inner track area
    return spaceship.x - spaceship.width / 2 >= innerTrackX &&
           spaceship.x + spaceship.width / 2 <= innerTrackX + innerTrackWidth &&
           spaceship.y - spaceship.height / 2 >= innerTrackY &&
           spaceship.y + spaceship.height / 2 <= innerTrackY + innerTrackHeight;
}

// Timer Variables
let startTime = Date.now();
let elapsedTime = 0;

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    let tenths = Math.floor((elapsedTime % 1000) / 100); // Calculate tenths of a second
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
}

// Lap Counter Variables
let lapCount = 0;
let hasCrossedLine = false; // To ensure we only count each lap once
const finishLineY = gameHeight / 3; // Example finish line position

const centerX = gameWidth / 2; // Center line on the X-axis
let hasCrossedCenterX = false; // To ensure crossing the center line is counted once per lap

function checkLapCompletion() {
    // Check if spaceship crosses the finish line on the Y-axis
    if (spaceship.y < finishLineY && !hasCrossedLine) {
        hasCrossedLine = true;
    } else if (spaceship.y > finishLineY && hasCrossedLine) {
        hasCrossedLine = false;
        if (hasCrossedCenterX) {
            lapCount++;
            hasCrossedCenterX = false; // Reset for next lap
            if (lapCount === 10) {
                endRace();
            }
        }
    }

    // Check if spaceship crosses the center line on the X-axis
    if (spaceship.x > centerX && !hasCrossedCenterX) {
        hasCrossedCenterX = true;
    } else if (spaceship.x < centerX && hasCrossedCenterX) {
        hasCrossedCenterX = false;
    }
}

let countdown = 0; // 3-second countdown

function startCountdown() {
    let countdownInterval = setInterval(() => {

        countdown -= 1;
        
        // When countdown reaches 0, start the game
        if (countdown < 0) {
            clearInterval(countdownInterval);
            isGameRunning = true;
            requestAnimationFrame(gameLoop);
        }
    }, 1000); // Update every second
}

document.getElementById('countButton').addEventListener('click', function() {
    // Start the countdown
    startCountdown();

    // Optional: Hide the start button
    // this.style.display = 'none';
});


// Web Audio API Setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioCtx.createOscillator();
const gainNode = audioCtx.createGain();

oscillator.type = 'sine';
oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Starting frequency
gainNode.gain.value = 0.1; // Adjust the volume
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.start();

// Function to adjust engine sound based on spaceship state
function updateEngineSound() {
    const baseFrequency = 440; // Hz
    const maxFrequency = 880; // Hz
    let frequency = baseFrequency + (maxFrequency - baseFrequency) * (spaceship.speed / spaceship.maxSpeed);

    if (keys.a || keys.d) {
        frequency += 30; // Increase frequency slightly when turning
    }

    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
}


function endRace() {
    // Implement what happens when the race ends
    const finalTime = updateTimer();
    console.log(`Race finished in ${finalTime}!`);
    // Stop the game loop or show a finish screen
}

function drawText(text, x, y, fontSize, font, color) {
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function gameLoop() {
    if (lapCount < 10) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        

        // Update and draw game components
        updateSpaceship();
        checkBorderCollision();
        checkTrackCollision();
        checkLapCompletion();
        drawSpaceship();
        drawTrack();
        drawText(`Time: ${updateTimer()}`, 10, 30, 20, "Arial", "white");
        drawText(`Laps: ${lapCount}/10`, 10, 60, 20, "Arial", "white");
        drawText(`Controls: WASD`, 640, 30, 20, "Arial", "white");
        drawText(`VisitPaul.com`, 640, 60, 20, "Arial", "white");
        drawText(`BGM: "Transition" by Paul, Capsular Star (2024)`, 476, 570, 15, "Arial", "gray");
        drawText(`© 2024 Paul Stultz. All Rights Reserved.`, 526, 550, 15, "Arial", "gray");
        drawText(`Developer time: 0:43.4`, 10, 560, 20, "Arial", "white");
        drawText("VoidLoop", 330, 35, 35, "Monaco", "Purple");

        // Schedule the next frame
        requestAnimationFrame(gameLoop);
        updateEngineSound();
    } else {
        // End the race
        endRace();
    }
}

    
function checkTrackCollision() {
    const trackBorderWidth = 200; // Adjusted track border width
    const innerTrackX = trackBorderWidth;
    const innerTrackY = trackBorderWidth;
    const innerTrackWidth = gameWidth - 2 * trackBorderWidth;
    const innerTrackHeight = gameHeight - 2 * trackBorderWidth;

    // Check if inside the smaller inner track area
    if (spaceship.x - spaceship.width / 2 >= innerTrackX && 
        spaceship.x + spaceship.width / 2 <= innerTrackX + innerTrackWidth && 
        spaceship.y - spaceship.height / 2 >= innerTrackY && 
        spaceship.y + spaceship.height / 2 <= innerTrackY + innerTrackHeight) {
        // Inside the smaller inner track area - reduce speed
        spaceship.speed *= 0.7;
        spaceship.lateralSpeed *= 0.7;
    } else {
        // Outside the smaller inner track area - no speed reduction
        spaceship.speed = Math.min(spaceship.speed, spaceship.maxSpeed);
        spaceship.lateralSpeed = Math.min(spaceship.lateralSpeed, spaceship.maxSpeed);
    }
}


    function checkBorderCollision() {
        if (spaceship.x - spaceship.width / 2 < 0) {
            spaceship.x = spaceship.width / 2;
            spaceship.speed = 0;
        }
        if (spaceship.x + spaceship.width / 2 > gameWidth) {
            spaceship.x = gameWidth - spaceship.width / 2;
            spaceship.speed = 0;
        }
        if (spaceship.y - spaceship.height / 2 < 0) {
            spaceship.y = spaceship.height / 2;
            spaceship.speed = 0;
        }
        if (spaceship.y + spaceship.height / 2 > gameHeight) {
            spaceship.y = gameHeight - spaceship.height / 2;
            spaceship.speed = 0;
        }
    }
    

function drawTrack() {
    const trackBorderWidth = 200; // Width of the track border
    const innerTrackX = trackBorderWidth;
    const innerTrackY = trackBorderWidth;
    const innerTrackWidth = gameWidth - 2 * trackBorderWidth;
    const innerTrackHeight = gameHeight - 2 * trackBorderWidth;

    // Outer Border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, gameWidth, gameHeight);

    // Inner Border
    ctx.strokeRect(innerTrackX, innerTrackY, innerTrackWidth, innerTrackHeight);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reposition the spaceship
    spaceship.x = canvas.width / 2;
    spaceship.y = canvas.height / 2;

    // Update the game rendering to match new size
    gameLoop();
}



function handleKeyDown(e) {
    if (e.key === 'w') {
        keys.w = true;
        if (!timerStarted) {
            timerStarted = true;
            startTime = Date.now(); // Start the timer
            if (!isGameRunning) {
                isGameRunning = true;
                requestAnimationFrame(gameLoop); // Start the game loop
            }
        }
    }
    if (e.key === 's') keys.s = true;
    if (e.key === 'a') keys.a = true;
    if (e.key === 'd') keys.d = true;
}


function handleKeyUp(e) {
    if (e.key === 'w') keys.w = false;
    if (e.key === 's') keys.s = false;
    if (e.key === 'a') keys.a = false;
    if (e.key === 'd') keys.d = false;
}


document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

requestAnimationFrame(gameLoop);

document.getElementById('startButton').addEventListener('click', function() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    backgroundMusic.play();

    this.style.display = 'none'; // Hide the start button
});