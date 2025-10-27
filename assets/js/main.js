// Goons Software - Futuristic interactions
(function () {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Starfield background
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 180; // balanced for perf

    function resize() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeStar() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: 0.2 + Math.random() * 0.8, // depth factor
        r: 0.4 + Math.random() * 1.2,
        vx: (Math.random() * 0.5 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.2 + 0.05),
      };
    }

    function init() {
      stars = new Array(STAR_COUNT).fill(0).map(makeStar);
    }

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let s of stars) {
        // Move
        s.x += s.vx * s.z;
        s.y += s.vy * s.z;
        if (s.x < 0) s.x = canvas.width; else if (s.x > canvas.width) s.x = 0;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }

        // Draw
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 14 * s.z);
        g.addColorStop(0, `rgba(109,242,255,${0.25 * s.z})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(step);
    }

    resize();
    init();
    step();
    window.addEventListener('resize', resize);
  }

  // Intersection reveal
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('in-view', e.isIntersecting)),
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Tilt cards
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  document.querySelectorAll('.tilt').forEach((card) => {
    const onMove = (ev) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (ev.clientX - cx) / (r.width / 2);
      const dy = (ev.clientY - cy) / (r.height / 2);
      const rx = clamp(-dy * 8, -10, 10).toFixed(2) + 'deg';
      const ry = clamp(dx * 10, -12, 12).toFixed(2) + 'deg';
      card.style.setProperty('--rx', rx);
      card.style.setProperty('--ry', ry);
    };
    const onLeave = () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('touchmove', (e) => {
      if (!e.touches[0]) return; onMove(e.touches[0]);
    }, { passive: true });
    card.addEventListener('touchend', onLeave);
  });
})();

