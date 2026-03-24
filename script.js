/* =========================================
   游客2号 PODCAST — MAIN JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAV SCROLL EFFECT ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });


  /* ── 2. FLOATING PETALS BACKGROUND ── */
  const petalBg = document.getElementById('petalBg');
  const petalSymbols = ['❋', '✿', '❀', '✾', '✤', '⁕', '❁'];

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petalSymbols[i % petalSymbols.length];

    const r = Math.random();
    p.style.cssText = `
      left: ${r * 100}%;
      bottom: -50px;
      font-size: ${14 + r * 24}px;
      color: rgba(${138 + r * 60}, ${184 + r * 40}, ${224 + r * 31}, 0.6);
      animation-delay: ${r * 20}s;
      animation-duration: ${18 + r * 20}s;
    `;
    petalBg.appendChild(p);
  }


  /* ── 3. AUDIO PLAYER (DEMO) ── */
  let playing = false;
  let progressInterval = null;

  const playBtn   = document.getElementById('playBtn');
  const progBar   = document.getElementById('progBar');
  const pbTrack   = document.getElementById('pbTrack');

  function togglePlay() {
    playing = !playing;
    playBtn.textContent = playing ? '⏸' : '▶';
    playing ? startProgress() : stopProgress();
  }

  function startProgress() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (!playing) return;
      const current = parseFloat(progBar.style.width) || 28;
      const next = Math.min(current + 0.04, 100);
      progBar.style.width = next + '%';
      if (next >= 100) stopProgress();
    }, 300);
  }

  function stopProgress() {
    clearInterval(progressInterval);
  }

  function seek(e) {
    const rect = pbTrack.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    progBar.style.width = (pct * 100) + '%';
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (pbTrack) pbTrack.addEventListener('click', seek);


  /* ── 4. SCROLL REVEAL (IntersectionObserver) ── */
  const revealTargets = document.querySelectorAll(
    '.ep-card, .tier, .plat-card, .host-card'
  );

  revealTargets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background 0.3s';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealTargets.forEach(el => observer.observe(el));


  /* ── 5. SMOOTH ANCHOR SCROLL (offset for sticky nav) ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── 6. NEWSLETTER FORM (placeholder handler) ── */
  const nlForm = document.getElementById('nlForm');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = nlForm.querySelector('.nl-input');
      const btn   = nlForm.querySelector('.nl-btn');
      if (!input.value.includes('@')) {
        input.style.borderColor = '#e74c3c';
        return;
      }
      btn.textContent = '已订阅 ✓';
      btn.style.background = '#27ae60';
      input.value = '';
      input.style.borderColor = '';
      setTimeout(() => {
        btn.textContent = '订阅 →';
        btn.style.background = '';
      }, 3000);
    });
  }


  /* ── 7. EPISODE PLAY BUTTONS ── */
  document.querySelectorAll('.ep-play').forEach((btn, i) => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      // Reset all
      document.querySelectorAll('.ep-play').forEach(b => b.textContent = '▶');
      // Activate clicked
      btn.textContent = '⏸';
      // Update player bar
      const card  = btn.closest('.ep-card');
      const title = card?.querySelector('.ep-title')?.textContent || '—';
      const guest = card?.querySelector('.ep-who')?.textContent  || '—';
      const epNo  = card?.querySelector('.ep-no span')?.textContent || '';
      const pbTitle = document.querySelector('.pb-title');
      const pbGuest = document.querySelector('.pb-guest');
      const pbLabel = document.querySelector('.pb-label');
      if (pbTitle) pbTitle.textContent = title;
      if (pbGuest) pbGuest.textContent = '对话嘉宾 · ' + guest;
      if (pbLabel) pbLabel.textContent = '▶ 正在播放 · ' + epNo;
      // Start player
      playing = true;
      if (playBtn) playBtn.textContent = '⏸';
      progBar.style.width = '0%';
      startProgress();
    });
  });

});
