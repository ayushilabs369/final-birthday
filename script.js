/* ============================================================
   A PERSONALIZED INTERACTIVE BIRTHDAY GIFT WEBSITE FOR HARSHIT
   SCRIPT.JS - INTERACTIONS, FUNCTIONALITY & ANIMATIONS
   CRAFTED FOR HARSHIT BY AYUSHI
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. GLOBAL STATE & STAGES
  // ============================================================
  const stages = {
    welcome: document.getElementById('stage-welcome'),
    balloons: document.getElementById('stage-balloons'),
    gift: document.getElementById('stage-gift'),
    envelope: document.getElementById('stage-envelope'),
    main: document.getElementById('stage-main')
  };

  // Smooth stage transition utility
  function switchStage(fromStage, toStage) {
    if (fromStage) {
      fromStage.classList.remove('stage-active');
      fromStage.classList.add('stage-hidden');
    }
    setTimeout(() => {
      if (toStage) {
        toStage.classList.remove('stage-hidden');
        toStage.classList.add('stage-active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 400);
  }

  // ============================================================
  // 2. STARRY BACKGROUND CANVAS (#bg-canvas)
  // ============================================================
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
  let bgStars = [];
  let bgParticles = [];

  function initBgCanvas() {
    if (!bgCanvas || !bgCtx) return;
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;

    bgStars = [];
    const starCount = Math.floor((bgCanvas.width * bgCanvas.height) / 4500);
    for (let i = 0; i < starCount; i++) {
      bgStars.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }

    bgParticles = [];
    const particleCount = Math.floor(bgCanvas.width / 40);
    for (let i = 0; i < particleCount; i++) {
      bgParticles.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.2
      });
    }
  }

  function renderBg() {
    if (!bgCanvas || !bgCtx) return;
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Draw twinkling stars
    bgStars.forEach(star => {
      star.alpha += star.twinkleSpeed * star.twinkleDir;
      if (star.alpha >= 1) { star.alpha = 1; star.twinkleDir = -1; }
      else if (star.alpha <= 0.2) { star.alpha = 0.2; star.twinkleDir = 1; }

      bgCtx.beginPath();
      bgCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(245, 231, 200, ${star.alpha})`;
      bgCtx.shadowColor = '#D7B978';
      bgCtx.shadowBlur = star.radius > 1 ? 6 : 0;
      bgCtx.fill();
    });

    // Draw floating golden ambient particles
    bgParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = bgCanvas.height;
        p.x = Math.random() * bgCanvas.width;
      }
      if (p.x < 0) p.x = bgCanvas.width;
      if (p.x > bgCanvas.width) p.x = 0;

      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(215, 185, 120, ${p.alpha})`;
      bgCtx.shadowColor = '#E8CB91';
      bgCtx.shadowBlur = 8;
      bgCtx.fill();
    });

    bgCtx.shadowBlur = 0;
    requestAnimationFrame(renderBg);
  }

  window.addEventListener('resize', initBgCanvas);
  initBgCanvas();
  renderBg();

  // ============================================================
  // 3. DESKTOP CUSTOM CURSOR & GOLDEN CLOUD PARTICLE TRAIL
  // ============================================================
  const cursorCanvas = document.getElementById('cursor-canvas');
  const cursorCtx = cursorCanvas ? cursorCanvas.getContext('2d') : null;
  const customCursor = document.getElementById('custom-cursor');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let mouseX = -100;
  let mouseY = -100;
  let cursorParticles = [];

  if (isFinePointer && cursorCanvas && cursorCtx) {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      cursorCanvas.width = window.innerWidth;
      cursorCanvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (customCursor) {
        customCursor.style.left = `${mouseX}px`;
        customCursor.style.top = `${mouseY}px`;
      }

      // Spawn spherical cloud of tiny golden dust around cursor point
      const spawnCount = 4;
      for (let i = 0; i < spawnCount; i++) {
        const radius = Math.random() * 16;
        const angle = Math.random() * Math.PI * 2;
        const px = mouseX + Math.cos(angle) * radius;
        const py = mouseY + Math.sin(angle) * radius;

        cursorParticles.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 + 0.2,
          size: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.7 + 0.3,
          life: 1.0,
          decay: Math.random() * 0.025 + 0.015
        });
      }
    });

    // Detect clickable elements to expand cursor
    document.querySelectorAll('a, button, [role="button"], .flip-card, .award-card, .polaroid-card, .balloon-item').forEach(el => {
      el.addEventListener('mouseenter', () => customCursor && customCursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => customCursor && customCursor.classList.remove('cursor-hover'));
    });

    function renderCursorTrail() {
      cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

      for (let i = cursorParticles.length - 1; i >= 0; i--) {
        const p = cursorParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          cursorParticles.splice(i, 1);
          continue;
        }

        const currentAlpha = p.alpha * p.life;
        const currentSize = p.size * (0.4 + 0.6 * p.life);

        cursorCtx.beginPath();
        cursorCtx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        cursorCtx.fillStyle = `rgba(232, 203, 145, ${currentAlpha})`;
        cursorCtx.shadowColor = 'rgba(215, 185, 120, 0.8)';
        cursorCtx.shadowBlur = 6;
        cursorCtx.fill();
      }

      cursorCtx.shadowBlur = 0;
      requestAnimationFrame(renderCursorTrail);
    }
    renderCursorTrail();
  }

  // Generic Sparkle Burst Function
  function createSparkleBurst(x, y, count = 50) {
    if (!cursorCtx || !cursorCanvas) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      cursorParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }

  // ============================================================
  // 4. STAGE A -> STAGE B-1 (BALLOONS POPPING STAGE)
  // ============================================================
  const btnEnter = document.getElementById('btn-enter');
  if (btnEnter) {
    btnEnter.addEventListener('click', () => {
      initAudioSynthesizer();
      switchStage(stages.welcome, stages.balloons);
    });
  }

  // Balloon popping logic (20 scattered balloons covering secret card)
  const balloonItems = document.querySelectorAll('.balloon-item');
  const balloonSecretCard = document.getElementById('balloon-secret-card');
  const balloonHint = document.getElementById('balloon-hint');
  const btnBalloonsContinue = document.getElementById('btn-balloons-continue');
  const stageBalloons = document.getElementById('stage-balloons');

  let poppedBalloonsCount = 0;
  const totalBalloons = balloonItems.length;
  let balloonsReadyToAdvance = false;

  balloonItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (item.classList.contains('popped')) return;
      e.stopPropagation();

      item.classList.add('popped');
      poppedBalloonsCount++;

      // Pop sound effect + sparkle explosion at balloon coordinates
      const rect = item.getBoundingClientRect();
      createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
      
      // Dynamic musical pitches as balloons pop
      const pitch = 500 + (poppedBalloonsCount % 8) * 75;
      playChimeSound(pitch);

      const remaining = totalBalloons - poppedBalloonsCount;

      if (remaining > 0) {
        if (balloonHint) {
          balloonHint.textContent = `✨ Pop the balloons to uncover the secret note! (${remaining} left) ✨`;
        }
        if (remaining <= 5 && balloonSecretCard) {
          balloonSecretCard.classList.add('uncovered');
        }
      } else {
        // All balloons popped! Fully uncover the card and reveal button
        if (balloonSecretCard) balloonSecretCard.classList.add('uncovered');
        if (btnBalloonsContinue) btnBalloonsContinue.classList.remove('hidden');
        if (balloonHint) balloonHint.textContent = '🎈 All 20 balloons popped! Secret note unlocked 🎈';

        fireConfetti(60);
        playChimeSound(880);

        setTimeout(() => {
          balloonsReadyToAdvance = true;
        }, 350);
      }
    });
  });

  function advanceFromBalloons() {
    if (!balloonsReadyToAdvance) return;
    playChimeSound(700);
    switchStage(stages.balloons, stages.gift);
  }

  if (btnBalloonsContinue) {
    btnBalloonsContinue.addEventListener('click', (e) => {
      e.stopPropagation();
      advanceFromBalloons();
    });
  }

  if (stageBalloons) {
    stageBalloons.addEventListener('click', () => {
      if (balloonsReadyToAdvance) {
        advanceFromBalloons();
      }
    });
  }

  // ============================================================
  // 5. STAGE B-2: INTERACTIVE GIFT BOX
  // ============================================================
  const giftBox = document.getElementById('gift-box');
  const giftHint = document.getElementById('gift-hint');
  const giftActionContainer = document.getElementById('gift-action-container');
  const btnGiftContinue = document.getElementById('btn-gift-continue');
  const stageGift = document.getElementById('stage-gift');

  let giftOpened = false;
  let giftReadyToAdvance = false;

  function openGiftBox() {
    if (giftOpened) return;
    giftOpened = true;
    giftBox.classList.add('opened');

    if (giftHint) {
      giftHint.textContent = '✨ Gift opened! Tap anywhere or click below to proceed to your letter ✨';
    }

    if (giftActionContainer) {
      giftActionContainer.classList.remove('hidden');
    }

    createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 70);
    playChimeSound(660);

    setTimeout(() => {
      giftReadyToAdvance = true;
    }, 400);
  }

  function advanceFromGift() {
    if (!giftOpened || !giftReadyToAdvance) return;
    playChimeSound(784);
    switchStage(stages.gift, stages.envelope);
  }

  if (giftBox) {
    giftBox.addEventListener('click', (e) => {
      if (!giftOpened) {
        e.stopPropagation();
        openGiftBox();
      }
    });
  }

  if (btnGiftContinue) {
    btnGiftContinue.addEventListener('click', (e) => {
      e.stopPropagation();
      advanceFromGift();
    });
  }

  if (stageGift) {
    stageGift.addEventListener('click', () => {
      if (giftOpened && giftReadyToAdvance) {
        advanceFromGift();
      }
    });
  }

  // ============================================================
  // 6. STAGE C: INTERACTIVE ENVELOPE & LETTER PREVIEW
  // ============================================================
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelopeHint = document.getElementById('envelope-hint');
  const envelopeActionContainer = document.getElementById('envelope-action-container');
  const btnEnvelopeContinue = document.getElementById('btn-envelope-continue');
  const stageEnvelope = document.getElementById('stage-envelope');

  let envelopeOpened = false;
  let envelopeReadyToAdvance = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    envelopeWrapper.classList.add('opened');

    if (envelopeHint) {
      envelopeHint.textContent = '💌 Letter unsealed! Tap anywhere or click below to enter your universe ✨';
    }

    if (envelopeActionContainer) {
      envelopeActionContainer.classList.remove('hidden');
    }

    playChimeSound(880);

    setTimeout(() => {
      envelopeReadyToAdvance = true;
    }, 400);
  }

  function advanceFromEnvelope() {
    if (!envelopeOpened || !envelopeReadyToAdvance) return;
    playChimeSound(988);
    switchStage(stages.envelope, stages.main);
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', (e) => {
      if (!envelopeOpened) {
        e.stopPropagation();
        openEnvelope();
      }
    });
  }

  if (btnEnvelopeContinue) {
    btnEnvelopeContinue.addEventListener('click', (e) => {
      e.stopPropagation();
      advanceFromEnvelope();
    });
  }

  if (stageEnvelope) {
    stageEnvelope.addEventListener('click', () => {
      if (envelopeOpened && envelopeReadyToAdvance) {
        advanceFromEnvelope();
      }
    });
  }

  // ============================================================
  // 7. WEB AUDIO CHIME & AMBIENT SYNTHESIZER
  // ============================================================
  let audioCtx = null;
  let isAmbientPlaying = false;
  let ambientOscInterval = null;

  function initAudioSynthesizer() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playChimeSound(frequency = 523.25) {
    initAudioSynthesizer();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioCtx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // Audio fallback
    }
  }

  // Ambient Gentle Melody Generator
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  const ambientAudio = document.getElementById('ambient-audio');

  function toggleAmbientMusic() {
    initAudioSynthesizer();
    isAmbientPlaying = !isAmbientPlaying;

    if (musicIcon) {
      musicIcon.textContent = isAmbientPlaying ? '🔊' : '🎵';
    }

    if (isAmbientPlaying) {
      if (ambientAudio && ambientAudio.src && !ambientAudio.src.endsWith('/')) {
        ambientAudio.play().catch(() => playGentleChimeSequence());
      } else {
        playGentleChimeSequence();
      }
    } else {
      if (ambientAudio) ambientAudio.pause();
      if (ambientOscInterval) clearInterval(ambientOscInterval);
    }
  }

  function playGentleChimeSequence() {
    if (!audioCtx) return;
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    if (ambientOscInterval) clearInterval(ambientOscInterval);

    ambientOscInterval = setInterval(() => {
      if (!isAmbientPlaying) return;
      const note = notes[Math.floor(Math.random() * notes.length)];
      playChimeSound(note);
    }, 2800);
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleAmbientMusic);
  }

  // ============================================================
  // 8. HARSHIT DICTIONARY PRONUNCIATION
  // ============================================================
  const btnPronounce = document.getElementById('btn-pronounce');
  if (btnPronounce) {
    btnPronounce.addEventListener('click', () => {
      playChimeSound(587.33);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Harshit');
        utterance.rate = 0.85;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    });
  }

  // ============================================================
  // 10. AWARDS CELEBRATION
  // ============================================================
  window.triggerAwardCelebration = function(awardTitle) {
    playChimeSound(659.25);
    fireConfetti();
    alert(`🏆 Certified Honor: "${awardTitle}" officially bestowed upon Harshit by Ayushi!`);
  };

  // ============================================================
  // 11. POLAROID MEMORY LANE LIGHTBOX
  // ============================================================
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  const lightbox = document.getElementById('memory-lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxMedia = document.getElementById('lightbox-media');
  const lightboxCaption = document.getElementById('lightbox-caption');

  polaroidCards.forEach(card => {
    card.addEventListener('click', () => {
      const caption = card.getAttribute('data-caption') || 'A memorable college moment with Harshit.';
      const photoFrameContent = card.querySelector('.polaroid-photo-frame').innerHTML;

      if (lightboxMedia) lightboxMedia.innerHTML = photoFrameContent;
      if (lightboxCaption) lightboxCaption.textContent = caption;
      if (lightbox) lightbox.classList.add('active');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightbox) lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  // ============================================================
  // 12. GOLDEN FORTUNE COOKIE (AYUSHI'S PERSONAL FORTUNES)
  // ============================================================
  const fortunes = [
    "This year, all the quiet efforts and hard work you've been putting in will lead to something huge. Keep believing in yourself.",
    "A reminder for the year ahead: you are capable of so much more than you give yourself credit for.",
    "Never stop being curious, ambitious, funny, and slightly annoying. This next chapter is going to be your strongest yet.",
    "Whenever you doubt yourself, remember there's someone in your corner who genuinely believes in you.",
    "May your year be filled with fewer stressful deadlines and 100x more reasons to laugh.",
    "Good food, exciting opportunities, and an annoyingly caring best friend (me!) are guaranteed in your future."
  ];

  const cookieStage = document.getElementById('cookie-stage');
  const btnCrackCookie = document.getElementById('btn-crack-cookie');
  const btnNewCookie = document.getElementById('btn-new-cookie');
  const fortuneText = document.getElementById('fortune-text');
  let cookieCracked = false;

  function crackCookie() {
    if (cookieCracked) return;
    cookieCracked = true;
    if (cookieStage) cookieStage.classList.add('cracked');

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    if (fortuneText) fortuneText.textContent = `"${randomFortune}"`;

    playChimeSound(783.99);
    if (btnCrackCookie) btnCrackCookie.classList.add('hidden');
    if (btnNewCookie) btnNewCookie.classList.remove('hidden');
  }

  function resetCookie() {
    cookieCracked = false;
    if (cookieStage) cookieStage.classList.remove('cracked');
    if (btnCrackCookie) btnCrackCookie.classList.remove('hidden');
    if (btnNewCookie) btnNewCookie.classList.add('hidden');
  }

  if (cookieStage) cookieStage.addEventListener('click', crackCookie);
  if (btnCrackCookie) btnCrackCookie.addEventListener('click', crackCookie);
  if (btnNewCookie) btnNewCookie.addEventListener('click', resetCookie);

  // ============================================================
  // 13. AESTHETIC BIRTHDAY CAKE & CANDLE BLOWING
  // ============================================================
  const cakeContainer = document.getElementById('cake-container');
  const candles = document.querySelectorAll('.cake-candle');
  const celebrationBanner = document.getElementById('celebration-banner');
  const cakeInstruction = document.getElementById('cake-instruction');
  let cakeBlown = false;

  function blowCandles() {
    if (cakeBlown) return;
    cakeBlown = true;

    // Extinguish candles in sequence
    candles.forEach((candle, idx) => {
      setTimeout(() => {
        candle.classList.add('blown');
      }, idx * 150);
    });

    if (cakeInstruction) cakeInstruction.style.display = 'none';
    if (celebrationBanner) celebrationBanner.classList.remove('hidden');

    playChimeSound(880);
    fireConfetti(120);
  }

  window.relightCandles = function() {
    cakeBlown = false;
    candles.forEach(candle => candle.classList.remove('blown'));
    if (cakeInstruction) cakeInstruction.style.display = 'block';
    if (celebrationBanner) celebrationBanner.classList.add('hidden');
    playChimeSound(523.25);
  };

  if (cakeContainer) {
    cakeContainer.addEventListener('click', blowCandles);
  }

  // Confetti Blast Engine on #confetti-canvas
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  function fireConfetti(particleCount = 100) {
    if (!confettiCanvas || !confettiCtx) return;

    confettiCanvas.width = confettiCanvas.parentElement.offsetWidth;
    confettiCanvas.height = confettiCanvas.parentElement.offsetHeight;

    const colors = ['#D7B978', '#E8CB91', '#F5E7C8', '#FFF', '#202D49', '#FFD1DC'];

    for (let i = 0; i < particleCount; i++) {
      confettiParticles.push({
        x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 60,
        y: confettiCanvas.height / 2 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.35,
        opacity: 1
      });
    }

    if (!confettiAnimationId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!confettiCanvas || !confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.008;

      if (p.opacity <= 0 || p.y > confettiCanvas.height) {
        confettiParticles.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = p.opacity;
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();
    }

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimationId = null;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // ============================================================
  // 14. SECRET MESSAGE MODAL (HEADER STAR TRIGGER)
  // ============================================================
  const secretStarBtn = document.getElementById('secret-star-btn');
  const secretModal = document.getElementById('secret-modal');

  if (secretStarBtn) {
    secretStarBtn.addEventListener('click', () => {
      if (secretModal) secretModal.classList.add('active');
      playChimeSound(987.77);
      fireConfetti(30);
    });
  }

  window.closeSecretModal = function() {
    if (secretModal) secretModal.classList.remove('active');
  };

  // ============================================================
  // 15. SCROLL SPY FOR NAVIGATION DOCK
  // ============================================================
  const sections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('.nav-dock .nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.pageYOffset >= top) {
        current = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

});
