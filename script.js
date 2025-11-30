// Word matrix
const matrix = [
    "ITLISASAMPM",
    "ACQUARTERDC",
    "TWENTYFIVEX",
    "HALFSTENFTO",
    "PASTERUNINE",
    "ONESIXTHREE",
    "FOURFIVETWO",
    "EIGHTELEVEN",
    "SEVENTWELVE",
    "TENSEOCLOCK"
];

const grid = document.getElementById('wordGrid');
const letters = [];
let currentActiveWords = [];

// Build grid with animations
matrix.forEach((row, rowIndex) => {
    row.split('').forEach((letter, colIndex) => {
        const span = document.createElement('span');
        span.textContent = letter;
        grid.appendChild(span);
        letters.push(span);
    });
});

// Reveal entire grid at once (no per-letter stagger)
setTimeout(() => {
    grid.classList.add('fade-in');
}, 50);

// Activate word with smooth transition
function activateWord(word) {
    const fullText = matrix.join('');
    const index = fullText.indexOf(word.toUpperCase());

    if (index !== -1) {
        for (let i = index; i < index + word.length; i++) {
            if (!letters[i].classList.contains('active')) {
                letters[i].classList.add('active');
            }
        }
        currentActiveWords.push(word);
    }
}

// Get time in words
function getTimeInWords(hours, minutes) {
    const hourWords = [
        "TWELVE", "ONE", "TWO", "THREE", "FOUR", "FIVE",
        "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN"
    ];

    // Round to nearest 5 minutes
    const roundedMinutes = Math.round(minutes / 5) * 5;

    let words = [];
    let readableText = "IT IS ";

    // Adjust hour for "TO" times (after 32 minutes)
    let displayHour = hours % 12;
    if (roundedMinutes > 32) {
        displayHour = (displayHour + 1) % 12;
    }

    const hourWord = hourWords[displayHour];

    // Build the time phrase
    words.push("IT", "IS");

    if (roundedMinutes === 0) {
        words.push(hourWord, "OCLOCK");
        readableText += hourWord + " O'CLOCK";
    } else if (roundedMinutes === 5) {
        words.push("FIVE", "PAST", hourWord);
        readableText += "FIVE PAST " + hourWord;
    } else if (roundedMinutes === 10) {
        words.push("TEN", "PAST", hourWord);
        readableText += "TEN PAST " + hourWord;
    } else if (roundedMinutes === 15) {
        words.push("QUARTER", "PAST", hourWord);
        readableText += "QUARTER PAST " + hourWord;
    } else if (roundedMinutes === 20) {
        words.push("TWENTY", "PAST", hourWord);
        readableText += "TWENTY PAST " + hourWord;
    } else if (roundedMinutes === 25) {
        words.push("TWENTYFIVE", "PAST", hourWord);
        readableText += "TWENTY FIVE PAST " + hourWord;
    } else if (roundedMinutes === 30) {
        words.push("HALF", "PAST", hourWord);
        readableText += "HALF PAST " + hourWord;
    } else if (roundedMinutes === 35) {
        words.push("TWENTYFIVE", "TO", hourWord);
        readableText += "TWENTY FIVE TO " + hourWord;
    } else if (roundedMinutes === 40) {
        words.push("TWENTY", "TO", hourWord);
        readableText += "TWENTY TO " + hourWord;
    } else if (roundedMinutes === 45) {
        words.push("QUARTER", "TO", hourWord);
        readableText += "QUARTER TO " + hourWord;
    } else if (roundedMinutes === 50) {
        words.push("TEN", "TO", hourWord);
        readableText += "TEN TO " + hourWord;
    } else if (roundedMinutes === 55) {
        words.push("FIVE", "TO", hourWord);
        readableText += "FIVE TO " + hourWord;
    }

    return { words, readableText };
}

// Update clock with  logic
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Clear previous active states smoothly
    letters.forEach(letter => {
        if (letter.classList.contains('active')) {
            letter.style.transition = 'all 0.3s ease-out';
            letter.classList.remove('active');
        }
    });
    currentActiveWords = [];

    // Get time in words
    const { words, readableText } = getTimeInWords(hours, minutes);

    // Activate words simultaneously (no stagger)
    setTimeout(() => {
        words.forEach((word) => activateWord(word));
    }, 300);

    // Update readable text
    document.getElementById('readingText').textContent = readableText;

    // Update digital time
    updateDigitalTime(hours, minutes, seconds);

    // Update date
    updateDate(now);
}

// Update digital time with individual digit animations
function updateDigitalTime(hours, minutes, seconds) {
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');

    const timeDigits = document.querySelectorAll('.time-digit');
    const newTime = h + m + s;

    timeDigits.forEach((digit, index) => {
        if (digit.textContent !== newTime[index]) {
            digit.style.animation = 'none';
            setTimeout(() => {
                digit.style.animation = 'digitFlip 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                digit.textContent = newTime[index];
            }, 10);
        }
    });

    // Update AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    document.getElementById('timePeriod').textContent = period;
}

// Update date display
function updateDate(now) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();

    const dateStr = `${dayName}, ${monthName} ${date}, ${year}`;
    document.getElementById('dateDisplay').textContent = dateStr;
}

// Premium 3D hover effect with enhanced smoothness
const watch = document.querySelector('.watch');
const watchContainer = document.querySelector('.watch-container');
const sensitivity = 18;
let isHovering = false;
let rafId = null;

watchContainer.addEventListener('mouseenter', () => {
    isHovering = true;
});

watchContainer.addEventListener('mousemove', (e) => {
    if (!isHovering) return;

    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
        const rect = watchContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / sensitivity).toFixed(2);
        const rotateY = ((centerX - x) / sensitivity).toFixed(2);

        watch.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
    });
});

watchContainer.addEventListener('mouseleave', () => {
    isHovering = false;
    if (rafId) cancelAnimationFrame(rafId);
    watch.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
});

// Ambient light follows cursor smoothly
const ambientLight = document.querySelector('.ambient-light');
let ambientRafId = null;

document.addEventListener('mousemove', (e) => {
    if (ambientRafId) cancelAnimationFrame(ambientRafId);

    ambientRafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        ambientLight.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.08) 40%, transparent 70%)`;
    });
});

// Initialize
updateClock();
// Update every second for smooth digital time
setInterval(updateClock, 1000);