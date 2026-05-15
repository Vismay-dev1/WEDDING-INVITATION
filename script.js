// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    disable: 'mobile' // Disable on mobile for performance if needed, but keeping it for now with low offset
});

// Intro Overlay Logic - Snappier
const startBtn = document.getElementById('start-btn');
const introOverlay = document.getElementById('intro-overlay');

startBtn.addEventListener('click', () => {
    // Unlock and play music
    bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.innerHTML = '<span class="icon">🔊</span>';
    }).catch(e => {
        console.log("Initial audio blocked, will try on next click");
        // Add a global click listener as a fallback
        document.addEventListener('click', function secondTry() {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicToggle.innerHTML = '<span class="icon">🔊</span>';
            });
            document.removeEventListener('click', secondTry);
        }, { once: true });
    });

    introOverlay.classList.add('fade-out');
    document.body.style.overflow = 'auto';
    
    // Initialize fireflies
    setTimeout(createFireflies, 1000);
});


// Disable scroll during intro
document.body.style.overflow = 'hidden';


// Countdown Timer
const weddingDate = new Date('July 28, 2028 08:00:00').getTime();

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector('.countdown-container').innerHTML = "<h3>Just Married! ❤️</h3>";
    }
};

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Background Music
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<span class="icon">🔇</span>';
    } else {
        bgMusic.play().catch(e => console.log("Auto-play blocked"));
        musicToggle.innerHTML = '<span class="icon">🔊</span>';
    }
    isPlaying = !isPlaying;
});

// RSVP Form Submission
const rsvpForm = document.getElementById('rsvp-form');
const rsvpMessage = document.getElementById('rsvp-message');
const msgText = document.getElementById('msg-text');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = rsvpForm.querySelector('input[type="text"]').value;
        const attendance = rsvpForm.querySelector('input[name="attendance"]:checked').value;
        
        rsvpForm.classList.add('hidden');
        rsvpMessage.classList.remove('hidden');
        
        if (attendance === 'yes') {
            msgText.innerHTML = `Dearest <strong>${name}</strong>, we are overjoyed that you'll be joining us! See you at the celebration! ✨`;
            // Trigger celebration
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#7D0A0A', '#2E5A1C']
            });
        } else {
            msgText.innerHTML = `Thank you for letting us know, <strong>${name}</strong>. You will be missed, but your wishes stay with us! ❤️`;
        }
    });
}

function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#f2d2d2', '#ffffff']
    });
}

// Fireflies Effect - Optimized for mobile
function createFireflies() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 10 : 25; // Fewer fireflies on mobile
    const container = document.body;
    
    for (let i = 0; i < count; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const moveX = (Math.random() - 0.5) * (isMobile ? 300 : 600);
        const moveY = (Math.random() - 0.5) * (isMobile ? 300 : 600);
        const duration = 15 + Math.random() * 20;
        
        firefly.style.left = `${startX}px`;
        firefly.style.top = `${startY}px`;
        firefly.style.setProperty('--x', `${moveX}px`);
        firefly.style.setProperty('--y', `${moveY}px`);
        firefly.style.animation = `fly ${duration}s infinite alternate ease-in-out`;
        firefly.style.animationDelay = `${Math.random() * 10}s`;
        
        container.appendChild(firefly);
    }
}

// Invitation Card Reveal
const cardInner = document.querySelector('.card-inner');
if (cardInner) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cardInner.classList.add('opened');
            }
        });
    }, { threshold: window.innerWidth < 768 ? 0.2 : 0.5 });
    observer.observe(cardInner);
}

// Parallax & Timeline Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax
    if (window.innerWidth > 768) {
        const parallax = document.querySelector('.parallax');
        if (parallax) {
            parallax.style.backgroundPositionY = (scrolled * 0.5) + 'px';
        }
    }

    // Timeline Progress
    const timeline = document.getElementById('timeline');
    const progressBar = document.getElementById('timeline-progress');
    
    if (timeline && progressBar) {
        const timelineRect = timeline.getBoundingClientRect();
        // Calculate how much of the timeline is scrolled past the middle of the screen
        const scrollPosition = (window.innerHeight / 2) - timelineRect.top;
        const totalHeight = timelineRect.height;
        
        if (scrollPosition > 0 && scrollPosition <= totalHeight) {
            progressBar.style.height = `${scrollPosition}px`;
        } else if (scrollPosition > totalHeight) {
            progressBar.style.height = `${totalHeight}px`;
        } else {
            progressBar.style.height = '0px';
        }
    }
});

// ── Tap-to-Flip for Mobile Touch Devices ──
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        if (isTouchDevice()) {
            card.classList.toggle('tapped');
        }
    });
});
