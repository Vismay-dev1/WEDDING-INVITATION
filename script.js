/* ════════════════════════════════════════════════════════════
   GROOM ❤ BRIDE — premium wedding experience engine
   Vanilla JS · no dependencies · nadaswaram retained
   ════════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const REDUCED  = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE     = matchMedia('(pointer: fine)').matches;
const WEDDING_TS = new Date('2028-07-28T08:00:00+05:30').getTime();

/* apply data-delay → --d custom prop */
$$('[data-delay]').forEach(el => el.style.setProperty('--d', el.dataset.delay + 'ms'));

/* ─────────── split-text (letter stagger, grapheme-safe for Malayalam) ─────────── */
const GRAPHEMES = (typeof Intl !== 'undefined' && Intl.Segmenter)
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;
$$('[data-split]').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    const parts = GRAPHEMES
        ? [...GRAPHEMES.segment(text)].map(s => s.segment)
        : [...text];
    parts.forEach((ch, i) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.style.setProperty('--i', i);
        s.innerHTML = ch === ' ' ? '&nbsp;' : ch;
        el.appendChild(s);
    });
});

/* ─────────── reveal observer (starts after gate opens) ─────────── */
let revealIO = null;
function startReveals() {
    if (revealIO) return;
    const targets = $$('[data-reveal], .mask, .story-flow');
    if (REDUCED) { targets.forEach(t => t.classList.add('in')); return; }
    revealIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
        });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(t => revealIO.observe(t));
}

/* ─────────── countdown with flip tick ─────────── */
const cd = { d: $('#cd-days'), h: $('#cd-hours'), m: $('#cd-mins'), s: $('#cd-secs') };
const setVal = (el, v) => {
    const t = String(v).padStart(2, '0');
    if (el.textContent !== t) {
        el.textContent = t;
        if (!REDUCED) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
    }
};
function tickCountdown() {
    const dist = WEDDING_TS - Date.now();
    if (dist <= 0) {
        $('.countdown')?.replaceChildren(Object.assign(document.createElement('h3'), { textContent: 'Just Married! ❤️' }));
        clearInterval(cdTimer);
        return;
    }
    setVal(cd.d, Math.floor(dist / 864e5));
    setVal(cd.h, Math.floor(dist / 36e5) % 24);
    setVal(cd.m, Math.floor(dist / 6e4) % 60);
    setVal(cd.s, Math.floor(dist / 1e3) % 60);
}
const cdTimer = setInterval(tickCountdown, 1000);
tickCountdown();

/* ─────────── marigold petals canvas ─────────── */
const Petals = (() => {
    const canvas = $('#petals-canvas');
    const ctx = canvas.getContext('2d');
    const COLORS = ['#E8930C', '#F7B733', '#D97B06', '#C94F4F', '#E4C878'];
    let W, H, dpr, ambient = [], burst = [], running = false;

    function resize() {
        dpr = Math.min(devicePixelRatio || 1, 2);
        W = innerWidth; H = innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    addEventListener('resize', resize); resize();

    const spawn = (fromTop, explosive) => {
        const s = 5 + Math.random() * 7;
        return {
            x: Math.random() * W,
            y: fromTop ? -20 : Math.random() * H,
            s,
            vx: explosive ? (Math.random() - .5) * 6 : 0,
            vy: explosive ? 1 + Math.random() * 4 : .5 + Math.random() * .9,
            a: Math.random() * Math.PI * 2,
            va: (Math.random() - .5) * .08,
            sway: 1 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2,
            color: COLORS[(Math.random() * COLORS.length) | 0],
            life: explosive ? 1 : Infinity,
            explosive
        };
    };

    function loop() {
        ctx.clearRect(0, 0, W, H);
        const t = performance.now() / 1000;

        ambient.forEach(p => {
            p.y += p.vy;
            p.x += Math.sin(t * p.sway + p.phase) * .6;
            p.a += p.va;
            if (p.y > H + 24) { p.y = -24; p.x = Math.random() * W; }
        });
        burst = burst.filter(p => p.life > 0 && p.y < H + 40);
        burst.forEach(p => {
            p.vy += .06; p.vx *= .985;
            p.x += p.vx + Math.sin(t * p.sway + p.phase) * .5;
            p.y += p.vy; p.a += p.va * 2; p.life -= .006;
        });

        [...ambient, ...burst].forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.a);
            ctx.globalAlpha = p.explosive ? Math.max(p.life, 0) * .9 : .75;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.moveTo(0, -p.s);
            ctx.bezierCurveTo(p.s * .95, -p.s * .35, p.s * .7, p.s * .6, 0, p.s);
            ctx.bezierCurveTo(-p.s * .7, p.s * .6, -p.s * .95, -p.s * .35, 0, -p.s);
            ctx.fill();
            ctx.restore();
        });

        if (running || burst.length) requestAnimationFrame(loop);
        else running = false;
    }

    return {
        start() {
            if (REDUCED) return;
            const n = innerWidth < 768 ? 9 : 16;
            ambient = Array.from({ length: n }, () => spawn(false, false));
            if (!running) { running = true; requestAnimationFrame(loop); }
        },
        rain(extra = 70) {
            if (REDUCED) return;
            for (let i = 0; i < extra; i++) burst.push(spawn(true, true));
            if (!running) { running = true; requestAnimationFrame(loop); }
        }
    };
})();

/* ─────────── background music (nadaswaram retained) ─────────── */
const bgMusic = $('#bg-music');
const musicBtn = $('#music-toggle');
let isPlaying = false;

function setMusicUI(on) {
    isPlaying = on;
    musicBtn.classList.toggle('playing', on);
    musicBtn.setAttribute('aria-pressed', on);
}
function playMusic() {
    bgMusic.volume = 0.85;
    bgMusic.play().then(() => setMusicUI(true)).catch(() => {
        document.addEventListener('click', function retry() {
            bgMusic.play().then(() => setMusicUI(true)).catch(() => {});
            document.removeEventListener('click', retry);
        }, { once: true });
    });
}
musicBtn.addEventListener('click', () => {
    if (isPlaying) { bgMusic.pause(); setMusicUI(false); }
    else playMusic();
});
bgMusic.addEventListener('play', () => setMusicUI(true));
bgMusic.addEventListener('pause', () => setMusicUI(false));

/* ─────────── gate · envelope opening ceremony ─────────── */
const gate = $('#gate');
const envelope = $('#envelope');
let gateOpened = false;

function openGate() {
    if (gateOpened) return;
    gateOpened = true;
    playMusic();
    envelope.classList.add('open');

    const part  = REDUCED ? 60  : 1150;
    const gone  = REDUCED ? 120 : 2350;
    setTimeout(() => { gate.classList.add('parting'); Petals.rain(80); }, part);
    setTimeout(() => {
        gate.remove();
        document.documentElement.classList.remove('locked');
        document.body.classList.add('ready');
        Petals.start();
        startReveals();
    }, gone);
}
$('#wax-seal').addEventListener('click', openGate);
$('#start-btn').addEventListener('click', openGate);

/* ─────────── scroll progress + parallax ─────────── */
const progressBar = $('#scroll-progress');
const pxEls = $$('[data-parallax]');
let scrollQueued = false;

function onScrollFrame() {
    scrollQueued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (!REDUCED) {
        const vh = innerHeight;
        pxEls.forEach(el => {
            const r = el.getBoundingClientRect();
            const c = r.top + r.height / 2 - vh / 2;
            el.style.transform = `translate3d(0, ${(-c * parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`;
        });
    }
}
addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScrollFrame); }
}, { passive: true });
onScrollFrame();

/* ─────────── dot nav ─────────── */
const dotNav = $('#dot-nav');
$$('[data-nav]').forEach(sec => {
    const a = document.createElement('a');
    a.href = '#' + sec.id;
    a.dataset.label = sec.dataset.nav;
    a.setAttribute('aria-label', sec.dataset.nav);
    dotNav.appendChild(a);
});
const navLinks = $$('#dot-nav a');
const activeIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        }
    });
}, { rootMargin: '-42% 0px -52% 0px' });
$$('[data-nav]').forEach(s => activeIO.observe(s));

/* ─────────── 3D tilt (fine pointers only) ─────────── */
if (FINE && !REDUCED) {
    $$('[data-tilt]').forEach(el => {
        el.addEventListener('pointerenter', () => { el.style.transition = 'transform .2s ease-out, box-shadow .5s var(--ease)'; });
        el.addEventListener('pointermove', e => {
            if (!el.classList.contains('in')) return;
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - .5;
            const py = (e.clientY - r.top) / r.height - .5;
            el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
        });
        el.addEventListener('pointerleave', () => {
            el.style.transform = '';
            setTimeout(() => { el.style.transition = ''; }, 400);
        });
    });
}

/* ─────────── custom cursor ─────────── */
if (FINE && !REDUCED) {
    document.documentElement.classList.add('has-cursor');
    const dot = $('#cursor-dot'), ring = $('#cursor-ring');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    }, { passive: true });
    (function ringLoop() {
        rx += (mx - rx) * .16; ry += (my - ry) * .16;
        ring.style.transform = `translate(${rx - ring.offsetWidth / 2}px, ${ry - ring.offsetHeight / 2}px)`;
        requestAnimationFrame(ringLoop);
    })();
    document.addEventListener('mouseover', e => {
        ring.classList.toggle('big', !!e.target.closest('a, button, .g-item, [data-tilt], input, textarea, select'));
    });
}

/* ─────────── lightbox ─────────── */
const zoomables = $$('[data-full]');
const lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
let lbIndex = 0, lastFocus = null;

function showLb(i) {
    lbIndex = (i + zoomables.length) % zoomables.length;
    const el = zoomables[lbIndex];
    lbImg.src = el.dataset.full;
    lbImg.alt = el.dataset.caption || '';
    lbCap.textContent = el.dataset.caption || '';
}
function openLb(i) {
    lastFocus = document.activeElement;
    showLb(i);
    lb.classList.remove('hidden');
    document.documentElement.classList.add('locked');
    $('.lb-close', lb).focus();
}
function closeLb() {
    lb.classList.add('hidden');
    document.documentElement.classList.remove('locked');
    lastFocus?.focus();
}
zoomables.forEach((el, i) => el.addEventListener('click', () => openLb(i)));
$('.lb-close', lb).addEventListener('click', closeLb);
$('.lb-prev', lb).addEventListener('click', () => showLb(lbIndex - 1));
$('.lb-next', lb).addEventListener('click', () => showLb(lbIndex + 1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => {
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
    if (e.key === 'ArrowRight') showLb(lbIndex + 1);
});

/* ─────────── RSVP + blessings wall ─────────── */
const rsvpForm = $('#rsvp-form');
const rsvpSuccess = $('#rsvp-success');
const wall = $('#wishes-wall');
const wallEmpty = $('#wishes-empty');
const STORE = 'gw-wishes';

const loadWishes = () => { try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch { return []; } };
const saveWishes = w => localStorage.setItem(STORE, JSON.stringify(w));

function renderWishes() {
    const wishes = loadWishes();
    wallEmpty.classList.toggle('hidden', wishes.length > 0);
    wall.innerHTML = '';
    wishes.slice().reverse().forEach((w, i) => {
        const card = document.createElement('article');
        card.className = 'wish-card';
        card.style.setProperty('--rot', (((i % 5) - 2) * 1.1) + 'deg');
        const p = document.createElement('p');
        p.textContent = '“' + w.msg + '”';
        const foot = document.createElement('footer');
        const strong = document.createElement('strong');
        strong.textContent = w.name + (w.guests > 1 ? ` +${w.guests - 1}` : '');
        const time = document.createElement('time');
        time.textContent = new Date(w.ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        foot.append(strong, time);
        card.append(p, foot);
        wall.appendChild(card);
    });
}
renderWishes();

rsvpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#f-name').value.trim();
    if (!name) { $('#f-name').focus(); $('#f-name').style.borderColor = 'var(--maroon)'; return; }
    const attend = rsvpForm.querySelector('input[name="attend"]:checked').value;
    const guests = parseInt($('#f-guests').value, 10);
    const msg = $('#f-msg').value.trim() || 'Wishing you a lifetime of love and laughter.';

    rsvpForm.classList.add('hidden');
    rsvpSuccess.classList.remove('hidden');
    rsvpSuccess.focus();

    if (attend === 'yes') {
        $('#success-text').innerHTML = `Dearest <strong>${name.replace(/</g, '&lt;')}</strong>, the families are overjoyed — your seat at the mandapam is saved. See you at the celebrations! ✨`;
        Petals.rain(110);
        const wishes = loadWishes();
        wishes.push({ name, msg, guests, ts: Date.now() });
        saveWishes(wishes);
        renderWishes();
    } else {
        $('#success-text').innerHTML = `Thank you for letting us know, <strong>${name.replace(/</g, '&lt;')}</strong>. You will be missed — but your blessings travel with the couple always. ❤️`;
    }
});
$('#rsvp-again').addEventListener('click', () => {
    rsvpSuccess.classList.add('hidden');
    rsvpForm.classList.remove('hidden');
    rsvpForm.reset();
});

/* ─────────── save-the-date (.ics) · whatsapp · copy ─────────── */
$('#ics-btn')?.addEventListener('click', () => {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GroomWedsBride//EN', 'BEGIN:VEVENT',
        'UID:groom-bride-2028@wedding', 'DTSTAMP:20260101T000000Z',
        'DTSTART:20280728T080000', 'DTEND:20280728T110000',
        'SUMMARY:GROOM & BRIDE — Wedding Muhurtham',
        'LOCATION:Taj Auditorium\\, Bengaluru\\, Karnataka',
        'DESCRIPTION:Mangalya Dharana at 8:00 AM. Your presence is our blessing.',
        'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'groom-bride-wedding.ics';
    a.click();
    URL.revokeObjectURL(a.href);
});

const shareText = () => '🪔 You are invited! GROOM weds BRIDE — 28.07.2028, Taj Auditorium, Bengaluru. Open your invitation: ' + location.href;
const waShare = () => window.open('https://wa.me/?text=' + encodeURIComponent(shareText()), '_blank', 'noopener');
$('#wa-btn')?.addEventListener('click', waShare);
$('#wa-btn-2')?.addEventListener('click', waShare);

$('#copy-btn')?.addEventListener('click', async () => {
    const label = $('#copy-label');
    try {
        await navigator.clipboard.writeText(location.href);
        label.textContent = 'Copied ✓';
    } catch {
        label.textContent = location.href;
    }
    setTimeout(() => { label.textContent = 'Copy Link'; }, 2200);
});

})();
