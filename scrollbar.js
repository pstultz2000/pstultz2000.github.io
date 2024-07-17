document.addEventListener('DOMContentLoaded', (event) => {
    let currentFact = "Welcome to VisitPaul.com!";
    let recentFacts = [];
    const maxRecentFacts = 35;

const facts = [
    "Paul spent many hours creating and hosting this site...",
    "My uncle thought I was a genius for putting PB into my cereal.",
    "I have spent hours on this scrolling bar and its fun facts alone.",
    "My networking/HTML classes were way easier than making this site.",
    "Paul got 'Most Memorable' in the yearbook his senior year.",
    "The prior host of visitpaul.com was an attorney.",
    "When I was a kid, my guinea pig did a backflip- I named him 'X'.",
    "My first laptop was a near mint Tandy 1400LT, still have it.",
    "Paul beat Pokemon Diamond only using a Bidoof.",
    "I also own the website squid.pizza",
    "Initial development of this site began mid 2023.",
    "So far, Paul has attended four different colleges.",
    "I used to play the Alto Sax- once I became skilled, I quit.",
    "Mead, known as 'Honey wine', is very simple to brew.",
    "Much of this website's work was completed at night.",
    "Try putting homemade eggnog into your coffee.",
    "2005-2015 was peak computing. I still miss Windows 7...",
    "People often call my Camaro 'Bumblebee'.",
    "Random algorithms are not truly random.",
    "Paul enjoys a wide assortment of beers, wines, and liqours.",
    "For my 23rd birthday, I bought what I wanted on my 13th B-Day.",
    "As a teen, I spent hours viewing endangered animals on Wikipedia.",
    "I ran a video game club, 'Pokken Smash', in high school.",
    "Over the span of my life, 'It's a free country' is my most told joke.",
    "I have done way more barrel rolls than cartwheels in my life.",
    "The original site logo, a GIF, was removed for flashing too fast.",
    "Inspired by 'The Useless Web', I wanted a cool website since I was 15.",
    "As an adult, I went half a year without eating a desert.",
    "It would take over 10 minutes to view all my fun facts in one visit.",
    "I prefer my coffee unsweetened or extremely sweetened- no inbetween.",
    "Long Island Tea is one of my favorite mix drinks.",
    "I have probably spent thousands of hours playing video games.",
    "Since I was a kid, I have wanted a classic car.",
    "I was just a few minutes away from being born in November.",
    "When someone dares me to do something, I often accept.",
    "One time, I willfully drank a quart of kefir in under 10 minutes.",
    "As a kid, I would roll up bread with PB inside and dip it in milk.",
    "I won a pie eating contest, and could hardly stand up afterwards.",
    "During class, a friend gave me a jar of peanut butter for my B-Day.",
    "I have a history of switching between various operating systems.",
    "For two weeks, I did hundreds of pushups a day.",
    "Flossing is perhaps my least favorite daily task.",
    "I love white chocolate, but not with Fruity Pebbles inside.",
    "The first beard I grew was a pair of mutton chops."

    
];

function getUniqueFact() {
    let randomIndex;
    let potentialFact;

    do {
        randomIndex = Math.floor(Math.random() * facts.length);
        potentialFact = facts[randomIndex];
    } while (recentFacts.includes(potentialFact));

    recentFacts.push(potentialFact);
    if (recentFacts.length > maxRecentFacts) {
        recentFacts.shift();
    }

    return potentialFact;
}

function changeFact() {
    currentFact = getUniqueFact();
    updateDisplay(); // Update the display after changing the fact
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(); // e.g., '12:35:19 PM'
    adjustMessageForWidth(timeString);
}

function adjustMessageForWidth(timeString) {
    const viewportWidth = window.innerWidth;
    let message = "Current time: " + timeString;

    if (viewportWidth >= 670) {
        message += " | " + currentFact;
    } else {
        message =  message + " | Welcome to VisitPaul.com!"; // Default message for smaller screens
    }

    document.getElementById('factBar').textContent = message;
}


function updateDisplay() {
    updateTime(); // Update the time
}

// Update the fact every 15 seconds
setInterval(changeFact, 15000);

// Update the time every second
setInterval(updateTime, 1000);

// Initial setup
updateDisplay();
changeFact();
});