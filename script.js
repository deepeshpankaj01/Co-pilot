/* ════════════════════════════════════════════════════════
   HEALTHAI CLINICAL CO-PILOT — script.js v4.0
   All interactive features, particles, animations
   ════════════════════════════════════════════════════════ */

/* ═══ 1. PARTICLE CANVAS BACKGROUND ═══ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;
  const MAX_DIST = 120;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.3 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.o})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x, dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══ 2. SCROLL PROGRESS BAR ═══ */
const scrollProgressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', function () {
  if (!scrollProgressBar) return;
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  scrollProgressBar.style.width = scrolled + '%';
});

/* ═══ 3. DYNAMIC NAVBAR ═══ */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', function () {
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ═══ 4. SCROLL REVEAL (IntersectionObserver) ═══ */
const revObs = new IntersectionObserver(es => {
  es.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i % 5) * 0.075 + 's';
      e.target.classList.add('vis');
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ═══ 5. TIMELINE BARS ANIMATION ═══ */
const tlObs = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.tl-fill[data-w]').forEach(b => {
        setTimeout(() => b.style.width = b.dataset.w, 280);
      });
      e.target.querySelectorAll('.sim-bar-fill[data-w]').forEach(b => {
        setTimeout(() => b.style.width = b.dataset.w, 400);
      });
      tlObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.prc').forEach(c => tlObs.observe(c));

/* ═══ 6. NAV ACTIVE SECTION HIGHLIGHT ═══ */
const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let c = '';
  secs.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) c = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const isActive = a.getAttribute('href') === '#' + c;
    a.classList.toggle('active', isActive);
  });
});

/* ═══ 7. HAMBURGER MENU ═══ */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ═══ 8. BACK TO TOP BUTTON ═══ */
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══ 9. TYPING ANIMATION ═══ */
(function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;
  const words = ['Clinical Co-Pilot', 'Decision Engine', 'Treatment Advisor', 'Diagnostic Partner'];
  let wordIdx = 0, charIdx = 0, deleting = false;
  function type() {
    const current = words[wordIdx];
    if (deleting) {
      el.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; setTimeout(type, 400); return; }
    } else {
      el.textContent = current.substring(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; setTimeout(type, 2000); return; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 1500);
})();

/* ═══ 10. BUTTON RIPPLE EFFECT ═══ */
document.querySelectorAll('.hbtn-p, .nbtn-solid, .contact-submit, .portal-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ═══ 11. COUNTER ANIMATION ═══ */
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const numTarget = parseFloat(target);
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(numTarget * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObs = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const text = el.textContent.trim();
      const match = text.match(/^([\d.]+)(.*)$/);
      if (match) {
        animateCounter(el, match[1], match[2]);
      }
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hs-n').forEach(el => counterObs.observe(el));

/* ═══ 12. CONTACT FORM VALIDATION ═══ */
function validateContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('c_name');
  const email = document.getElementById('c_email');
  const msg = document.getElementById('c_msg');
  const success = document.getElementById('contactSuccess');
  let valid = true;

  // Clear previous errors
  document.querySelectorAll('.form-error').forEach(el => el.remove());

  function showError(input, message) {
    const err = document.createElement('div');
    err.className = 'form-error';
    err.textContent = message;
    input.parentNode.appendChild(err);
    valid = false;
  }

  if (!name || !name.value.trim()) showError(name || document.querySelector('.contact-form'), 'Name is required');
  if (!email || !email.value.trim()) showError(email || document.querySelector('.contact-form'), 'Email is required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) showError(email, 'Enter a valid email');
  if (!msg || !msg.value.trim()) showError(msg || document.querySelector('.contact-form'), 'Message is required');

  if (valid && success) {
    success.style.display = 'block';
    success.textContent = '✅ Message sent successfully! We\'ll get back to you soon.';
    if (name) name.value = '';
    if (email) email.value = '';
    if (msg) msg.value = '';
    setTimeout(() => { success.style.display = 'none'; }, 5000);
    showToast('✅', 'Message sent successfully!');
  }
}
/* contactForm listener is set via onsubmit in HTML — no duplicate needed */
window.validateContactForm = validateContactForm;

/* ═══ 13. MODAL SYSTEM ═══ */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
  if (id === 'patModal') initPatModal();
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('.modal-ov').forEach(m =>
  m.addEventListener('click', function (e) { if (e.target === this) closeModal(this.id); })
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-ov.open').forEach(m => { m.classList.remove('open'); });
    document.body.style.overflow = '';
  }
});
// Export for inline onclick
window.openModal = openModal;
window.closeModal = closeModal;

/* ═══ 14. PATIENT FORM STATE ═══ */
let step = 0, PD = {}, fileMap = { lab: [], img: [], ecg: [] }, selSyms = new Set();
let _R = null, _RID = null;

const STEPS = ['Identity', 'Vitals', 'Symptoms', 'Lab Reports', 'Review'];
const SYMS = ['Chest Pain', 'Shortness of Breath', 'Fever', 'Persistent Cough', 'Fatigue', 'Headache', 'Dizziness', 'Nausea/Vomiting', 'Abdominal Pain', 'Back Pain', 'Joint Pain', 'Oedema/Swelling', 'Weight Loss', 'Loss of Appetite', 'Palpitations', 'Jaundice', 'Dark Urine', 'Blood in Urine', 'Blurred Vision', 'Night Sweats', 'Wheezing', 'Hemoptysis', 'Muscle Cramps', 'Numbness'];

/* ═══ 15. STEPPER ═══ */
function renderStepper() {
  const bar = document.getElementById('stepBar');
  if (!bar) return;
  bar.innerHTML = STEPS.map((lbl, i) => `
    ${i > 0 ? `<div class="step-conn ${i <= step ? 'done' : ''}"></div>` : ''}
    <div class="step-item ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}">
      <div class="step-circ">${i < step ? '✓' : (i + 1)}</div>
      <span class="step-lbl">${lbl}</span>
    </div>`).join('');
}

/* ═══ 16. SLIDER HELPER ═══ */
function initSlider(id) {
  const sl = document.getElementById(id); if (!sl) return;
  const upd = () => { const p = ((+sl.value - +sl.min) / (+sl.max - +sl.min) * 100).toFixed(1) + '%'; sl.style.setProperty('--pct', p); };
  sl.addEventListener('input', upd); upd();
}

/* ═══ 17. FILE UPLOAD ═══ */
function initUpload(zoneId, inputId, key) {
  const z = document.getElementById(zoneId), inp = document.getElementById(inputId);
  if (!z || !inp) return;
  inp.addEventListener('change', e => { Array.from(e.target.files).forEach(f => fileMap[key].push(f)); renderFileList(key); });
  z.addEventListener('dragover', e => { e.preventDefault(); z.classList.add('over'); });
  z.addEventListener('dragleave', () => z.classList.remove('over'));
  z.addEventListener('drop', e => { e.preventDefault(); z.classList.remove('over'); Array.from(e.dataTransfer.files).forEach(f => fileMap[key].push(f)); renderFileList(key); });
}
function renderFileList(key) {
  const el = document.getElementById('fl_' + key); if (!el) return;
  el.innerHTML = fileMap[key].map((f, i) => `<div class="uf-item"><span>📄</span><span class="uf-name">${f.name}</span><span class="uf-sz">${(f.size / 1024).toFixed(0)}KB</span><button class="uf-rm" onclick="fileMap['${key}'].splice(${i},1);renderFileList('${key}')">✕</button></div>`).join('');
}
window.renderFileList = renderFileList;

/* ═══ 18. SYMPTOM TOGGLE ═══ */
function toggleSym(el, s) {
  el.classList.toggle('sel');
  if (selSyms.has(s)) selSyms.delete(s); else selSyms.add(s);
}
window.toggleSym = toggleSym;

/* ═══ 19. INIT PATIENT MODAL ═══ */
function initPatModal() {
  step = 0; PD = {}; fileMap = { lab: [], img: [], ecg: [] }; selSyms.clear();
  document.getElementById('aiProc').style.display = 'none';
  document.getElementById('rptArea').style.display = 'none';
  document.getElementById('rptArea').innerHTML = '';
  document.getElementById('formPanels').style.display = 'block';
  document.getElementById('stepBar').style.display = 'flex';
  renderStepper(); renderFormStep();
}
window.initPatModal = initPatModal;

/* ═══ 20. RENDER FORM STEPS ═══ */
function renderFormStep() {
  renderStepper();
  const fp = document.getElementById('formPanels');
  fp.style.display = 'block';

  if (step === 0) {
    fp.innerHTML = `<div class="fp">
      <div class="fsh"><div class="fsh-n">1</div><div class="fsh-t">Patient Identity & Profile</div></div>
      <p class="fsh-s">Build your complete clinical profile. Enter personal details accurately for better AI similar-patient matching.</p>
      <div class="fg" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">Full Name <span class="ex">Required</span></label><input class="finput" id="p_name" placeholder="Enter full name" value="${PD.name || ''}"></div>
        <div class="fgrp"><label class="flbl">Contact Number <span class="ex">Optional</span></label><input class="finput" id="p_contact" placeholder="+91 98765 43210" value="${PD.contact || ''}"></div>
      </div>
      <div class="fg g3" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">Age (years)</label>
          <div class="sl-wrap">
            <div class="sl-top"><span><span class="sl-val-big" id="sv_age">${PD.age || 35}</span></span><span class="sl-unit">yrs</span></div>
            <input type="range" class="sl-r" id="sl_age" min="1" max="100" value="${PD.age || 35}" oninput="document.getElementById('sv_age').textContent=this.value;PD.age=+this.value">
            <div class="sl-ticks"><span>1</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
          </div>
        </div>
        <div class="fgrp"><label class="flbl">Gender</label><select class="fsel" id="p_gender"><option value="">Select</option><option ${PD.gender === 'Male' ? 'selected' : ''}>Male</option><option ${PD.gender === 'Female' ? 'selected' : ''}>Female</option><option ${PD.gender === 'Other' ? 'selected' : ''}>Other</option></select></div>
        <div class="fgrp"><label class="flbl">Blood Group</label><select class="fsel" id="p_blood"><option value="">Unknown</option>${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => `<option ${PD.blood === b ? 'selected' : ''}>${b}</option>`).join('')}</select></div>
      </div>
      <div class="fg" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">Referring Doctor / Hospital</label><input class="finput" id="p_doctor" placeholder="e.g. Dr. Sharma, AIIMS Delhi" value="${PD.doctor || ''}"></div>
        <div class="fgrp"><label class="flbl">Existing Diagnoses</label><input class="finput" id="p_diag" placeholder="e.g. Hypertension, T2DM" value="${PD.diag || ''}"></div>
      </div>
      <div class="fg g1" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">Current Medications</label><input class="finput" id="p_meds" placeholder="e.g. Metformin 500mg BD, Amlodipine 5mg OD, None" value="${PD.meds || ''}"></div>
      </div>
      <div class="form-section-divider"><div class="fsd-icon">📋</div><div class="fsd-text">Optional Clinical Info <span class="fsd-optional">(improves AI matching)</span></div></div>
      <div class="fg" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">Previous Surgeries <span class="ex">Optional</span></label><input class="finput" id="p_surgeries" placeholder="e.g. Appendectomy 2015, CABG 2020" value="${PD.surgeries || ''}"></div>
        <div class="fgrp"><label class="flbl">Lifestyle — Smoking <span class="ex">Optional</span></label><select class="fsel" id="p_smoking"><option value="">Select</option><option ${PD.smoking === 'Never' ? 'selected' : ''}>Never</option><option ${PD.smoking === 'Former' ? 'selected' : ''}>Former</option><option ${PD.smoking === 'Current' ? 'selected' : ''}>Current</option></select></div>
      </div>
      <div class="fg g3" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">Alcohol Use <span class="ex">Optional</span></label><select class="fsel" id="p_alcohol"><option value="">Select</option><option ${PD.alcohol === 'None' ? 'selected' : ''}>None</option><option ${PD.alcohol === 'Occasional' ? 'selected' : ''}>Occasional</option><option ${PD.alcohol === 'Regular' ? 'selected' : ''}>Regular</option></select></div>
        <div class="fgrp"><label class="flbl">Exercise Level <span class="ex">Optional</span></label><select class="fsel" id="p_exercise"><option value="">Select</option><option ${PD.exercise === 'Sedentary' ? 'selected' : ''}>Sedentary</option><option ${PD.exercise === 'Moderate' ? 'selected' : ''}>Moderate</option><option ${PD.exercise === 'Active' ? 'selected' : ''}>Active</option></select></div>
        <div class="fgrp"><label class="flbl">Diabetes History <span class="ex">Optional</span></label><select class="fsel" id="p_diabetes"><option value="">Select</option><option ${PD.diabetes === 'No' ? 'selected' : ''}>No</option><option ${PD.diabetes === 'Type 1' ? 'selected' : ''}>Type 1</option><option ${PD.diabetes === 'Type 2' ? 'selected' : ''}>Type 2</option><option ${PD.diabetes === 'Pre-diabetic' ? 'selected' : ''}>Pre-diabetic</option></select></div>
      </div>
      <div class="fnav"><div></div><button class="fnav-next" onclick="saveS0()">Next: Vital Signs →</button></div>
    </div>`;
    initSlider('sl_age');
  }

  else if (step === 1) {
    const sv = (id, val) => `<span class="sl-val-big" id="sv_${id}">${val}</span>`;
    fp.innerHTML = `<div class="fp">
      <div class="fsh"><div class="fsh-n">2</div><div class="fsh-t">Vital Signs & Clinical Measurements</div></div>
      <p class="fsh-s">Use sliders to input vital signs. All values will be analyzed by the AI for risk indicators and similar patient matching.</p>
      <div class="fg g3" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">BP Systolic (mmHg)</label>
          <div class="sl-wrap"><div class="sl-top"><span>${sv('bps', PD.bps || 120)}<span class="sl-unit">mmHg</span></span><span class="sl-status" id="ss_bps" style="color:${(PD.bps || 120) > 140 ? 'var(--rose)' : 'var(--mint)'}">${(PD.bps || 120) > 140 ? 'High' : 'Normal'}</span></div>
          <input type="range" class="sl-r" id="sl_bps" min="70" max="220" value="${PD.bps || 120}"><div class="sl-ticks"><span>70</span><span>120</span><span>140</span><span>180</span><span>220</span></div></div>
        </div>
        <div class="fgrp"><label class="flbl">BP Diastolic (mmHg)</label>
          <div class="sl-wrap"><div class="sl-top"><span>${sv('bpd', PD.bpd || 80)}<span class="sl-unit">mmHg</span></span><span class="sl-status" id="ss_bpd" style="color:${(PD.bpd || 80) > 90 ? 'var(--rose)' : 'var(--mint)'}">${(PD.bpd || 80) > 90 ? 'High' : 'Normal'}</span></div>
          <input type="range" class="sl-r" id="sl_bpd" min="40" max="130" value="${PD.bpd || 80}"><div class="sl-ticks"><span>40</span><span>80</span><span>90</span><span>110</span><span>130</span></div></div>
        </div>
        <div class="fgrp"><label class="flbl">Heart Rate (bpm)</label>
          <div class="sl-wrap"><div class="sl-top"><span>${sv('hr', PD.hr || 75)}<span class="sl-unit">bpm</span></span><span class="sl-status" id="ss_hr" style="color:${(PD.hr || 75) > 100 ? 'var(--rose)' : (PD.hr || 75) < 60 ? 'var(--amber)' : 'var(--mint)'}">${(PD.hr || 75) > 100 ? 'Tachy' : (PD.hr || 75) < 60 ? 'Brady' : 'Normal'}</span></div>
          <input type="range" class="sl-r" id="sl_hr" min="30" max="180" value="${PD.hr || 75}"><div class="sl-ticks"><span>30</span><span>60</span><span>100</span><span>140</span><span>180</span></div></div>
        </div>
      </div>
      <div class="fg g3" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">Temperature (°F)</label>
          <div class="sl-wrap"><div class="sl-top"><span>${sv('temp', PD.temp || 98.6)}<span class="sl-unit">°F</span></span><span class="sl-status" id="ss_temp" style="color:${(PD.temp || 98.6) > 99.5 ? 'var(--rose)' : 'var(--mint)'}">${(PD.temp || 98.6) > 100.4 ? 'High Fever' : (PD.temp || 98.6) > 99.5 ? 'Fever' : 'Normal'}</span></div>
          <input type="range" class="sl-r" id="sl_temp" min="960" max="1050" value="${Math.round((PD.temp || 98.6) * 10)}"><div class="sl-ticks"><span>96°</span><span>98.6°</span><span>100.4°</span><span>103°</span><span>105°</span></div></div>
        </div>
        <div class="fgrp"><label class="flbl">SpO₂ (%)</label>
          <div class="sl-wrap"><div class="sl-top"><span>${sv('spo2', PD.spo2 || 98)}<span class="sl-unit">%</span></span><span class="sl-status" id="ss_spo2" style="color:${(PD.spo2 || 98) < 93 ? 'var(--rose)' : (PD.spo2 || 98) < 96 ? 'var(--amber)' : 'var(--mint)'}">${(PD.spo2 || 98) < 93 ? 'Critical' : (PD.spo2 || 98) < 96 ? 'Low' : 'Normal'}</span></div>
          <input type="range" class="sl-r" id="sl_spo2" min="70" max="100" value="${PD.spo2 || 98}"><div class="sl-ticks"><span>70%</span><span>90%</span><span>93%</span><span>96%</span><span>100%</span></div></div>
        </div>
        <div class="fgrp"><label class="flbl">Respiratory Rate (/min)</label>
          <div class="sl-wrap"><div class="sl-top"><span>${sv('rr', PD.rr || 16)}<span class="sl-unit">/min</span></span><span class="sl-status" id="ss_rr" style="color:${(PD.rr || 16) > 20 ? 'var(--rose)' : 'var(--mint)'}">${(PD.rr || 16) > 20 ? 'Elevated' : 'Normal'}</span></div>
          <input type="range" class="sl-r" id="sl_rr" min="8" max="40" value="${PD.rr || 16}"><div class="sl-ticks"><span>8</span><span>12</span><span>20</span><span>30</span><span>40</span></div></div>
        </div>
      </div>
      <div class="fg" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">Weight (kg)</label>
          <div class="sl-wrap"><div class="sl-top"><span>${sv('wt', PD.wt || 70)}<span class="sl-unit">kg</span></span></div>
          <input type="range" class="sl-r" id="sl_wt" min="20" max="180" value="${PD.wt || 70}"><div class="sl-ticks"><span>20</span><span>60</span><span>90</span><span>130</span><span>180</span></div></div>
        </div>
        <div class="fgrp"><label class="flbl">Height (cm)</label>
          <div class="sl-wrap"><div class="sl-top"><span>${sv('ht', PD.ht || 170)}<span class="sl-unit">cm</span></span></div>
          <input type="range" class="sl-r" id="sl_ht" min="100" max="220" value="${PD.ht || 170}"><div class="sl-ticks"><span>100</span><span>150</span><span>170</span><span>190</span><span>220</span></div></div>
        </div>
      </div>
      <div class="fnav"><button class="fnav-back" onclick="step=0;renderFormStep()">← Back</button><button class="fnav-next" onclick="saveS1()">Next: Symptoms →</button></div>
    </div>`;
    const slDefs = {
      sl_bps: { key: 'bps', fn: v => { const e = document.getElementById('ss_bps'); if (e) { e.textContent = v > 140 ? 'High' : 'Normal'; e.style.color = v > 140 ? 'var(--rose)' : 'var(--mint)' } } },
      sl_bpd: { key: 'bpd', fn: v => { const e = document.getElementById('ss_bpd'); if (e) { e.textContent = v > 90 ? 'High' : 'Normal'; e.style.color = v > 90 ? 'var(--rose)' : 'var(--mint)' } } },
      sl_hr: { key: 'hr', fn: v => { const e = document.getElementById('ss_hr'); if (e) { e.textContent = v > 100 ? 'Tachy' : v < 60 ? 'Brady' : 'Normal'; e.style.color = v > 100 ? 'var(--rose)' : v < 60 ? 'var(--amber)' : 'var(--mint)' } } },
      sl_spo2: { key: 'spo2', fn: v => { const e = document.getElementById('ss_spo2'); if (e) { e.textContent = v < 93 ? 'Critical' : v < 96 ? 'Low' : 'Normal'; e.style.color = v < 93 ? 'var(--rose)' : v < 96 ? 'var(--amber)' : 'var(--mint)' } } },
      sl_rr: { key: 'rr', fn: v => { const e = document.getElementById('ss_rr'); if (e) { e.textContent = v > 20 ? 'Elevated' : 'Normal'; e.style.color = v > 20 ? 'var(--rose)' : 'var(--mint)' } } },
      sl_wt: { key: 'wt', fn: v => { } },
      sl_ht: { key: 'ht', fn: v => { } }
    };
    Object.entries(slDefs).forEach(([id, cfg]) => {
      const el = document.getElementById(id); if (!el) return;
      el.addEventListener('input', function () {
        const d = document.getElementById('sv_' + cfg.key); if (d) d.textContent = this.value;
        PD[cfg.key] = +this.value; cfg.fn(+this.value); initSlider(id);
      });
      initSlider(id);
    });
    const tempEl = document.getElementById('sl_temp');
    if (tempEl) {
      const upd = () => {
        const v = (tempEl.value / 10).toFixed(1); PD.temp = +v; const d = document.getElementById('sv_temp'); if (d) d.textContent = v;
        const s = document.getElementById('ss_temp'); if (s) { const fv = +v; s.textContent = fv > 100.4 ? 'High Fever' : fv > 99.5 ? 'Fever' : 'Normal'; s.style.color = fv > 99.5 ? 'var(--rose)' : 'var(--mint)'; }
        const p = ((tempEl.value - 960) / (1050 - 960) * 100).toFixed(1) + '%'; tempEl.style.setProperty('--pct', p);
      };
      tempEl.addEventListener('input', upd); upd();
    }
  }

  else if (step === 2) {
    const cur = [...selSyms];
    fp.innerHTML = `<div class="fp">
      <div class="fsh"><div class="fsh-n">3</div><div class="fsh-t">Symptoms, History & Medications</div></div>
      <p class="fsh-s">Click symptoms to select them. This data drives the similar patient matching algorithm — the more detail, the better the match.</p>
      <div class="fgrp" style="margin-bottom:1.1rem">
        <label class="flbl">Quick Symptom Selection <span class="ex">Click to add — multiple allowed</span></label>
        <div class="sym-cloud">${SYMS.map(s => `<span class="sym-chip ${cur.includes(s) ? 'sel' : ''}" onclick="toggleSym(this,'${s}')">${s}</span>`).join('')}</div>
      </div>
      <div class="fg g1">
        <div class="fgrp"><label class="flbl">Chief Complaints / Primary Symptoms * <span class="ex">Describe in detail</span></label><textarea class="fta" id="p_sym_txt" placeholder="e.g. Sharp chest pain radiating to left arm for 3 days...">${PD.sym_txt || ''}</textarea></div>
        <div class="fgrp"><label class="flbl">Duration of Current Illness</label><input class="finput" id="p_dur" placeholder="e.g. Chest pain for 3 days" value="${PD.dur || ''}"></div>
        <div class="fgrp"><label class="flbl">Previous Medical History</label><textarea class="fta" style="min-height:72px" id="p_hist" placeholder="e.g. Hypertension since 2018...">${PD.hist || ''}</textarea></div>
        <div class="fgrp"><label class="flbl">Allergies</label><input class="finput" id="p_allergy" placeholder="e.g. Penicillin — rash" value="${PD.allergy || ''}"></div>
        <div class="fgrp"><label class="flbl">Family History</label><input class="finput" id="p_family" placeholder="e.g. Father — MI at age 58" value="${PD.family || ''}"></div>
      </div>
      <div class="fnav"><button class="fnav-back" onclick="step=1;renderFormStep()">← Back</button><button class="fnav-next" onclick="saveS2()">Next: Lab Reports →</button></div>
    </div>`;
  }

  else if (step === 3) {
    fp.innerHTML = `<div class="fp">
      <div class="fsh"><div class="fsh-n">4</div><div class="fsh-t">Lab Reports & Medical Imaging</div></div>
      <p class="fsh-s">Enter available lab values for deeper AI analysis. Upload report files for AI review.</p>
      <div class="fg g3" style="margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">Haemoglobin <span class="ex">g/dL · Normal 12-17</span></label><input class="finput" id="l_hb" placeholder="e.g. 11.2" value="${PD.hb || ''}"></div>
        <div class="fgrp"><label class="flbl">WBC Count <span class="ex">×10³/µL · Normal 4.5-11</span></label><input class="finput" id="l_wbc" placeholder="e.g. 12.5" value="${PD.wbc || ''}"></div>
        <div class="fgrp"><label class="flbl">Platelets <span class="ex">×10³/µL · Normal 150-400</span></label><input class="finput" id="l_plt" placeholder="e.g. 230" value="${PD.plt || ''}"></div>
        <div class="fgrp"><label class="flbl">Glucose (Fasting) <span class="ex">mg/dL · Normal 70-100</span></label><input class="finput" id="l_fbs" placeholder="e.g. 180" value="${PD.fbs || ''}"></div>
        <div class="fgrp"><label class="flbl">Creatinine <span class="ex">mg/dL · Normal 0.6-1.2</span></label><input class="finput" id="l_cr" placeholder="e.g. 1.8" value="${PD.cr || ''}"></div>
        <div class="fgrp"><label class="flbl">Troponin I <span class="ex">ng/mL · Normal &lt;0.04</span></label><input class="finput" id="l_tntn" placeholder="e.g. 0.8" value="${PD.tntn || ''}"></div>
        <div class="fgrp"><label class="flbl">SGPT / ALT <span class="ex">U/L · Normal 7-56</span></label><input class="finput" id="l_sgpt" placeholder="e.g. 52" value="${PD.sgpt || ''}"></div>
        <div class="fgrp"><label class="flbl">Sodium <span class="ex">mEq/L · Normal 136-145</span></label><input class="finput" id="l_na" placeholder="e.g. 138" value="${PD.na || ''}"></div>
        <div class="fgrp"><label class="flbl">LDL Cholesterol <span class="ex">mg/dL · Normal &lt;100</span></label><input class="finput" id="l_ldl" placeholder="e.g. 145" value="${PD.ldl || ''}"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div class="fgrp"><label class="flbl">🩸 Upload Lab Reports</label><div class="uz" id="uz_lab"><input type="file" id="ui_lab" multiple accept=".pdf,.jpg,.jpeg,.png"><span class="uz-ico">🩸</span><div class="uz-t">Drop or click to upload</div><div class="uz-s">CBC, LFT, KFT, Blood tests</div></div><div id="fl_lab"></div></div>
        <div class="fgrp"><label class="flbl">🫁 Upload Imaging (X-ray / CT)</label><div class="uz" id="uz_img"><input type="file" id="ui_img" multiple accept=".pdf,.jpg,.jpeg,.png"><span class="uz-ico">🫁</span><div class="uz-t">Drop or click to upload</div><div class="uz-s">X-Ray, CT, MRI, Echo</div></div><div id="fl_img"></div></div>
        <div class="fgrp"><label class="flbl">💓 Upload ECG</label><div class="uz" id="uz_ecg"><input type="file" id="ui_ecg" multiple accept=".pdf,.jpg,.jpeg,.png"><span class="uz-ico">💓</span><div class="uz-t">Drop or click to upload</div><div class="uz-s">ECG, Holter, Stress Test</div></div><div id="fl_ecg"></div></div>
      </div>
      <div class="fg g1"><div class="fgrp"><label class="flbl">ECG / Imaging Findings (Key Notes)</label><textarea class="fta" id="p_imaging" placeholder="e.g. ECG: ST-elevation in II, III, aVF...">${PD.imaging || ''}</textarea></div></div>
      <div class="fnav"><button class="fnav-back" onclick="step=2;renderFormStep()">← Back</button><button class="fnav-next" onclick="saveS3()">Review & Generate →</button></div>
    </div>`;
    initUpload('uz_lab', 'ui_lab', 'lab');
    initUpload('uz_img', 'ui_img', 'img');
    initUpload('uz_ecg', 'ui_ecg', 'ecg');
  }

  else if (step === 4) {
    const bmi = PD.wt && PD.ht ? (PD.wt / ((PD.ht / 100) ** 2)).toFixed(1) : '—';
    fp.innerHTML = `<div class="fp">
      <div class="fsh"><div class="fsh-n">5</div><div class="fsh-t">Review & Generate AI Clinical Report</div></div>
      <p class="fsh-s">Review your data. The AI will run the full 5-step pipeline and generate a complete clinical report.</p>
      <div class="rv-sec"><div class="rv-sec-t">Patient Identity</div><div class="rv-grid">
        <div class="rv-i"><span>Name:</span><span>${PD.name || '—'}</span></div>
        <div class="rv-i"><span>Age/Gender:</span><span>${PD.age || '—'}y / ${PD.gender || '—'}</span></div>
        <div class="rv-i"><span>Blood Group:</span><span>${PD.blood || '—'}</span></div>
        <div class="rv-i"><span>Doctor:</span><span>${PD.doctor || '—'}</span></div>
      </div></div>
      <div class="rv-sec"><div class="rv-sec-t">Vital Signs</div><div class="rv-grid">
        <div class="rv-i"><span>BP:</span><span>${PD.bps || '—'}/${PD.bpd || '—'} mmHg</span></div>
        <div class="rv-i"><span>Heart Rate:</span><span>${PD.hr || '—'} bpm</span></div>
        <div class="rv-i"><span>Temperature:</span><span>${PD.temp || '—'}°F</span></div>
        <div class="rv-i"><span>SpO₂:</span><span>${PD.spo2 || '—'}%</span></div>
        <div class="rv-i"><span>Resp. Rate:</span><span>${PD.rr || '—'}/min</span></div>
        <div class="rv-i"><span>BMI:</span><span>${bmi}</span></div>
      </div></div>
      <div class="rv-sec"><div class="rv-sec-t">Symptoms (${selSyms.size} selected)</div>
        <div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:${PD.sym_txt ? '.5rem' : '0'}">${[...selSyms].map(s => `<span style="font-size:.72rem;padding:.14rem .52rem;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.15);border-radius:4px;color:var(--cyan)">${s}</span>`).join('')}</div>
        ${PD.sym_txt ? `<div style="font-size:.8rem;color:var(--text2)">${PD.sym_txt.substring(0, 120)}${PD.sym_txt.length > 120 ? '...' : ''}</div>` : ''}
      </div>
      <div class="rv-sec"><div class="rv-sec-t">Key Lab Values</div><div class="rv-grid">
        <div class="rv-i"><span>Haemoglobin:</span><span>${PD.hb || '—'} g/dL</span></div>
        <div class="rv-i"><span>WBC:</span><span>${PD.wbc || '—'} ×10³/µL</span></div>
        <div class="rv-i"><span>Creatinine:</span><span>${PD.cr || '—'} mg/dL</span></div>
        <div class="rv-i"><span>Troponin I:</span><span>${PD.tntn || '—'} ng/mL</span></div>
        <div class="rv-i"><span>Glucose (F):</span><span>${PD.fbs || '—'} mg/dL</span></div>
        <div class="rv-i"><span>Files Uploaded:</span><span style="color:var(--mint)">${fileMap.lab.length + fileMap.img.length + fileMap.ecg.length} file(s)</span></div>
      </div></div>
      <div style="background:rgba(0,212,255,.04);border:1px solid rgba(0,212,255,.12);border-radius:var(--r12);padding:1rem 1.2rem;font-size:.82rem;color:var(--muted)">
        ⚡ <strong style="color:var(--cyan)">Ready.</strong> The Co-Pilot will run all 5 steps: Patient Profiling → AI Disease Analysis → Similar Patient Search (847K+ records) → Treatment Pattern Analysis → AI Clinical Report.
      </div>
      <div class="fnav"><button class="fnav-back" onclick="step=3;renderFormStep()">← Back</button><button class="fnav-next mint" onclick="runAI()">🧠 Generate AI Report →</button></div>
    </div>`;
  }
}
window.renderFormStep = renderFormStep;

/* ═══ 21. SAVE FORM STEPS ═══ */
function gv(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
window.gv = gv;

function saveS0() {
  if (!gv('p_name')) { showErr('Please enter the patient name.'); return; }
  PD.name = gv('p_name'); PD.contact = gv('p_contact');
  /* FIX: capture age from slider if not already set by slider oninput */
  const ageEl = document.getElementById('sl_age'); if (ageEl) PD.age = +ageEl.value;
  PD.gender = gv('p_gender'); PD.blood = gv('p_blood');
  PD.doctor = gv('p_doctor'); PD.diag = gv('p_diag'); PD.meds = gv('p_meds');
  PD.surgeries = gv('p_surgeries'); PD.smoking = gv('p_smoking');
  PD.alcohol = gv('p_alcohol'); PD.exercise = gv('p_exercise'); PD.diabetes = gv('p_diabetes');
  step = 1; renderFormStep();
}
function saveS1() {
  PD.bps = PD.bps || 120; PD.bpd = PD.bpd || 80; PD.hr = PD.hr || 75;
  PD.temp = PD.temp || 98.6; PD.spo2 = PD.spo2 || 98; PD.rr = PD.rr || 16;
  PD.wt = PD.wt || 70; PD.ht = PD.ht || 170;
  step = 2; renderFormStep();
}
function saveS2() {
  if (!gv('p_sym_txt') && selSyms.size === 0) { showErr('Please describe symptoms or select from the list.'); return; }
  PD.sym_txt = gv('p_sym_txt'); PD.dur = gv('p_dur'); PD.hist = gv('p_hist');
  PD.allergy = gv('p_allergy'); PD.family = gv('p_family');
  PD.symTags = [...selSyms];
  step = 3; renderFormStep();
}
function saveS3() {
  ['hb', 'wbc', 'plt', 'fbs', 'cr', 'tntn', 'sgpt', 'na', 'ldl'].forEach(k => { PD[k] = gv('l_' + k); });
  PD.imaging = gv('p_imaging');
  step = 4; renderFormStep();
}
window.saveS0 = saveS0; window.saveS1 = saveS1; window.saveS2 = saveS2; window.saveS3 = saveS3;

function showErr(msg) {
  let ex = document.getElementById('__ve'); if (ex) ex.remove();
  const d = document.createElement('div'); d.id = '__ve';
  d.style.cssText = 'background:rgba(255,77,109,.07);border:1px solid rgba(255,77,109,.22);border-radius:8px;padding:.72rem 1rem;color:var(--rose);font-size:.8rem;margin-top:.8rem';
  d.textContent = '⚠️ ' + msg;
  const nav = document.querySelector('.fnav'); if (nav) nav.before(d);
  setTimeout(() => d.remove(), 4000);
}

/* ═══ 22. PATIENT ID GENERATOR (MED-AI-YYYY-NNNNNN format) ═══ */
function genAITId() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  const id = 'MED-AI-' + year + '-' + rand;
  /* Dedup check against localStorage */
  if (localStorage.getItem(id)) return genAITId();
  return id;
}

/* ═══ 23. RUN AI PIPELINE ═══ */
async function runAI() {
  document.getElementById('formPanels').style.display = 'none';
  document.getElementById('stepBar').style.display = 'none';
  document.getElementById('aiProc').style.display = 'block';
  const adv = async (done, next, ms) => {
    await new Promise(r => setTimeout(r, ms));
    if (done) { const e = document.getElementById(done); if (e) { e.classList.remove('run'); e.classList.add('done'); } }
    if (next) { const e = document.getElementById(next); if (e) e.classList.add('run'); }
  };
  await adv(null, null, 400);
  await adv('ps1', 'ps2', 1100);
  await adv('ps2', 'ps3', 1300);
  await adv('ps3', 'ps4', 1600);
  await adv('ps4', 'ps5', 1200);
  try {
    const r = await callAI();
    await adv('ps5', null, 800);
    _RID = genAITId();
    localStorage.setItem(_RID, JSON.stringify({ PD, r, rid: _RID, date: new Date().toISOString() }));
    document.getElementById('aiProc').style.display = 'none';
    renderReport(r);
  } catch (err) {
    document.getElementById('aiProc').innerHTML = `<div style="text-align:center;padding:3rem"><div style="font-size:2.5rem;margin-bottom:1rem">⚠️</div><div style="font-size:1rem;color:var(--white);margin-bottom:.5rem">Analysis Error</div><p style="color:var(--muted);font-size:.84rem;margin-bottom:1.5rem">${err.message}</p><button class="fnav-back" onclick="document.getElementById('stepBar').style.display='flex';document.getElementById('aiProc').style.display='none';document.getElementById('formPanels').style.display='block';step=4;renderFormStep()">← Back to Review</button></div>`;
  }
}
window.runAI = runAI;

async function callAI() {
  const bmi = PD.wt && PD.ht ? (PD.wt / ((PD.ht / 100) ** 2)).toFixed(1) : 'not calculated';
  const prompt = `You are the HN AI Clinical Co-Pilot. Analyze this patient and return ONLY valid JSON — no markdown, no backticks, pure JSON only.\n\nPATIENT DATA:\nName:${PD.name}|Age:${PD.age}y|Gender:${PD.gender}|Blood:${PD.blood || '?'}|BMI:${bmi}\nVitals: BP ${PD.bps || '?'}/${PD.bpd || '?'} mmHg|HR ${PD.hr || '?'} bpm|Temp ${PD.temp || '?'}°F|SpO2 ${PD.spo2 || '?'}%|RR ${PD.rr || '?'}/min|Wt ${PD.wt || '?'}kg|Ht ${PD.ht || '?'}cm\nSymptoms: ${PD.sym_txt || ''}|Tags: ${(PD.symTags || []).join(',')}|Duration: ${PD.dur || '?'}\nHistory: ${PD.hist || 'none'}|Existing Dx: ${PD.diag || 'none'}|Meds: ${PD.meds || 'none'}|Allergies: ${PD.allergy || 'none'}|Family: ${PD.family || 'none'}\nLabs: Hb ${PD.hb || '?'}|WBC ${PD.wbc || '?'}|Plt ${PD.plt || '?'}|Glucose ${PD.fbs || '?'}|Creatinine ${PD.cr || '?'}|Troponin ${PD.tntn || '?'}|SGPT ${PD.sgpt || '?'}|Na ${PD.na || '?'}|LDL ${PD.ldl || '?'}\nImaging/ECG: ${PD.imaging || 'none'}\n\nReturn this exact JSON with real clinical values based on the patient:\n{"profile":{"summary":"3-sentence clinical profile","risk":"High","risk_reason":"Specific reason","organ":"Heart","bmi_note":"BMI note"},"diagnoses":[{"name":"Primary Diagnosis","pct":75,"organ":"Organ","evidence":"Key clinical evidence"},{"name":"Differential 1","pct":58,"organ":"Organ","evidence":"Evidence"},{"name":"Differential 2","pct":35,"organ":"Organ","evidence":"Evidence"}],"risks":[{"name":"Risk Name","level":"High","value":"Specific value"},{"name":"Risk 2","level":"Moderate","value":"Value"},{"name":"Risk 3","level":"Low","value":"Value"},{"name":"Risk 4","level":"Moderate","value":"Value"}],"insights":"3 sentences of key clinical findings.","warnings":["Critical warning if any"],"actions":["Immediate action 1","Action 2","Action 3","Action 4"],"similar":[{"id":"PT-2841","age":"54M","yr":2022,"organ":"Heart","dx":"Acute STEMI","sim":94,"tx":"PCI + Dual Antiplatelet","txtype":"Procedure+Medication","outcome":"Full Recovery","days":22,"success":89,"meds":["Aspirin 75mg","Clopidogrel 75mg","Atorvastatin 40mg"],"shared":"Chest pain,ST elevation,troponin"},{"id":"PT-3392","age":"61M","yr":2021,"organ":"Heart","dx":"NSTEMI with HF","sim":88,"tx":"Thrombolysis + ACE Inhibitor","txtype":"Medication","outcome":"Full Recovery","days":18,"success":83,"meds":["Aspirin 300mg","Ramipril 5mg","Furosemide"],"shared":"Chest pain,dyspnea,hypertension"},{"id":"PT-4018","age":"58F","yr":2023,"organ":"Lungs","dx":"CAP + DM","sim":82,"tx":"IV Ceftriaxone + Azithromycin","txtype":"IV Combined","outcome":"Full Recovery","days":12,"success":91,"meds":["Ceftriaxone 1g IV BD","Azithromycin 500mg"],"shared":"Cough,SOB,fever"},{"id":"PT-2255","age":"66M","yr":2022,"organ":"Kidney","dx":"CKD Stage 3 + HTN","sim":76,"tx":"ACE Inhibitor + Dialysis","txtype":"Conservative","outcome":"Partial Recovery","days":90,"success":72,"meds":["Ramipril 5mg","Dietary restriction"],"shared":"Edema,fatigue,elevated creatinine"},{"id":"PT-5119","age":"49F","yr":2023,"organ":"Liver","dx":"Hepatitis + Cirrhosis","sim":71,"tx":"Antiviral + Hepatoprotective","txtype":"Medication","outcome":"Stabilised","days":85,"success":68,"meds":["Tenofovir","Ursodeoxycholic acid"],"shared":"Jaundice,fatigue,elevated LFT"}],"treatments":[{"label":"Treatment Option A","name":"Standard Monotherapy","rate":65,"days":"14-21","meds":["Primary Med 1","Primary Med 2"],"why":"First-line approach","side":"GI upset; monitor renal function","combined":false},{"label":"Treatment Option B","name":"Alternative Regimen","rate":74,"days":"12-18","meds":["Med A","Med B","Supportive C"],"why":"When first-line fails","side":"Monitor drug interactions","combined":false},{"label":"Treatment C — Combined (Recommended)","name":"Evidence-Based Combined Protocol","rate":86,"days":"9-13","meds":["Primary Med","Secondary Med","Support Med","Monitoring"],"why":"86% success rate in similar patient cohort.","side":"Monitor LFTs and renal function at day 3","combined":true}],"recommend":"Combined Protocol","grade":"Grade A — RCT Evidence","decision":"4-sentence synthesis for the doctor.","followup":"Follow-up recommendation.","prognosis":"Prognosis with treatment."}\nReplace ALL placeholder text with real clinical values.`;

  /* FIX: Add required API headers — user must set their key */
  const API_KEY = localStorage.getItem('healthai_api_key') || '';
  if (!API_KEY) throw new Error('API key not set. Save your key: localStorage.setItem("healthai_api_key", "sk-ant-...").');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4096, messages: [{ role: 'user', content: prompt }] })
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `API error ${res.status}`); }
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.content.map(c => c.text || '').join('');
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const s = clean.indexOf('{'), e2 = clean.lastIndexOf('}');
  if (s === -1) throw new Error('AI response did not contain valid JSON. Please try again.');
  return JSON.parse(clean.slice(s, e2 + 1));
}

/* ═══ 24. TOAST ═══ */
function showToast(ico, msg) {
  const t = document.getElementById('toast');
  document.getElementById('tIco').textContent = ico;
  document.getElementById('tMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4200);
}
window.showToast = showToast;

/* ═══ 25. RENDER REPORT ═══ */
function renderReport(r) {
  _R = r;
  const ra = document.getElementById('rptArea');
  ra.style.display = 'block';
  const rC = { High: '#ff4d6d', Moderate: '#ffb347', Low: '#00e5a0', Critical: '#ff2244' };
  const rc = rC[r.profile?.risk] || '#ffb347';
  const now = new Date();
  const bmi = PD.wt && PD.ht ? (PD.wt / ((PD.ht / 100) ** 2)).toFixed(1) : '—';
  const pColors = ['#00d4ff', '#f0a500', '#ff4d6d', '#00e5a0', '#ffb347'];
  const rptSimCount = (r.similar || []).length;
  const rptAiConf = Math.max(...(r.diagnoses || []).map(d => d.pct || 0), 0);
  const rptDataFields = [PD.name, PD.age, PD.gender, PD.bps, PD.hr, PD.spo2, PD.temp, PD.hb, PD.wbc, PD.sym_txt].filter(Boolean).length;
  const rptDataQ = Math.min(100, Math.round(rptDataFields / 10 * 100));
  const rptSimStr = rptSimCount ? Math.round((r.similar || []).reduce((a, s) => a + s.sim, 0) / rptSimCount) : 0;
  const rptAvgSucc = rptSimCount ? Math.round((r.similar || []).reduce((a, s) => a + (s.success || 0), 0) / rptSimCount) : 0;
  const rptUrgency = r.profile?.risk === 'High' || r.profile?.risk === 'Critical' ? 'high-priority' : r.profile?.risk === 'Moderate' ? 'medium-priority' : 'routine';
  const rptUrgLabel = rptUrgency === 'high-priority' ? '🔴 High Priority' : rptUrgency === 'medium-priority' ? '🟡 Medium Priority' : '🟢 Routine';

  ra.innerHTML = `<div class="rpt-wrap">
    <div class="rpt-hdr">
      <div class="rpt-hdr-row">
        <div>
          <div class="rpt-brand">HN Healthcare · AI Clinical Co-Pilot · Team Parakram</div>
          <div class="rpt-name">AI Clinical Treatment Report</div>
          <div class="rpt-id-row">AIT Patient ID: <strong>${_RID}</strong> · ${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} · ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.55rem">
          <div class="risk-pill" style="background:${rc}18;border:1.5px solid ${rc}44"><div class="risk-dot" style="background:${rc};box-shadow:0 0 10px ${rc}"></div><span style="color:${rc}">Risk: ${r.profile?.risk || 'Moderate'}</span></div>
          <div style="font-family:var(--FM);font-size:.65rem;color:var(--muted)">Organ Focus: <strong style="color:${rc}">${r.profile?.organ || '—'}</strong></div>
          ${PD.doctor ? `<div style="font-size:.68rem;color:var(--muted)">Ref: ${PD.doctor}</div>` : ''}
        </div>
      </div>
      <div class="rpt-meta">
        ${[['Patient', PD.name], ['Age/Gender', PD.age + 'y / ' + PD.gender], ['Blood Group', PD.blood || '—'], ['BP', (PD.bps || '—') + '/' + (PD.bpd || '—') + ' mmHg'], ['HR', (PD.hr || '—') + ' bpm'], ['SpO₂', (PD.spo2 || '—') + '%'], ['Temp', (PD.temp || '—') + '°F'], ['BMI', bmi]].map(([l, v]) => `<div class="rm-item"><div class="rm-l">${l}</div><div class="rm-v">${v}</div></div>`).join('')}
      </div>
      <div class="rpt-actions">
        <button class="rpt-btn dl" onclick="dlPDF()">⬇ Download PDF</button>
        <button class="rpt-btn cp" onclick="cpyId()">📋 Copy AIT ID: ${_RID}</button>
        <button class="rpt-btn re" onclick="initPatModal()">↩ New Patient</button>
      </div>
    </div>
    <div class="rpt-body">
      <div class="rs">
        <div class="rs-hdr"><div class="rs-num">1</div><div class="rs-title">Patient Clinical Profile</div></div>
        <div style="font-size:.88rem;color:var(--text2);line-height:1.72;margin-bottom:.9rem">${r.profile?.summary || 'Clinical profile compiled.'}</div>
        <div style="padding:.72rem 1rem;background:${rc}0d;border:1px solid ${rc}33;border-radius:8px;font-size:.84rem;margin-bottom:.9rem"><strong style="color:${rc}">Risk Level: ${r.profile?.risk || 'Moderate'}</strong> — ${r.profile?.risk_reason || ''}</div>
        ${PD.symTags?.length ? `<div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:.7rem">${PD.symTags.map(s => `<span style="font-family:var(--FM);font-size:.66rem;padding:.14rem .5rem;background:var(--cg);border:1px solid rgba(0,212,255,.15);border-radius:4px;color:var(--cyan)">${s}</span>`).join('')}</div>` : ''}
        ${PD.sym_txt ? `<div style="font-size:.84rem;color:var(--text2)"><strong style="color:var(--white)">Chief Complaints:</strong> ${PD.sym_txt}</div>` : ''}
        <div class="urgency-tag ${rptUrgency}" style="margin-top:.8rem">${rptUrgLabel}</div>
      </div>
      <div class="rs">
        <div class="rs-hdr"><div class="rs-num" style="background:linear-gradient(135deg,var(--mint),#00c8a0)">✓</div><div class="rs-title">AI Trust Indicators</div></div>
        <div class="trust-grid">
          <div class="trust-item"><span class="ti-val ${rptAiConf >= 70 ? 'green' : rptAiConf >= 50 ? 'amber' : 'red'}">${rptAiConf}%</span><span class="ti-lbl">AI Confidence</span><div class="ti-bar"><div class="ti-bar-fill ${rptAiConf >= 70 ? 'green' : rptAiConf >= 50 ? 'amber' : 'red'}" style="width:${rptAiConf}%"></div></div></div>
          <div class="trust-item"><span class="ti-val ${rptDataQ >= 70 ? 'green' : 'amber'}">${rptDataQ}%</span><span class="ti-lbl">Data Completeness</span><div class="ti-bar"><div class="ti-bar-fill ${rptDataQ >= 70 ? 'green' : 'amber'}" style="width:${rptDataQ}%"></div></div></div>
          <div class="trust-item"><span class="ti-val ${rptSimStr >= 80 ? 'green' : rptSimStr >= 60 ? 'amber' : 'red'}">${rptSimStr}%</span><span class="ti-lbl">Similarity Strength</span><div class="ti-bar"><div class="ti-bar-fill ${rptSimStr >= 80 ? 'green' : rptSimStr >= 60 ? 'amber' : 'red'}" style="width:${rptSimStr}%"></div></div></div>
          <div class="trust-item"><span class="ti-val ${rptAvgSucc >= 75 ? 'green' : 'amber'}">${rptAvgSucc}%</span><span class="ti-lbl">Avg Treatment Success</span><div class="ti-bar"><div class="ti-bar-fill ${rptAvgSucc >= 75 ? 'green' : 'amber'}" style="width:${rptAvgSucc}%"></div></div></div>
        </div>
      </div>
      <div class="rs">
        <div class="rs-hdr"><div class="rs-num">2</div><div class="rs-title">AI Diagnostic Analysis</div></div>
        <div class="dx-grid">
          ${(r.diagnoses || []).map((d, i) => `<div class="dx-card ${i === 0 ? 'primary' : ''}"><div class="dx-name">${d.name}</div><div class="dx-bar-bg"><div class="dx-bar" id="dx${i}" style="width:0%"></div></div><div class="dx-pct">${d.pct}%</div><div class="dx-type">${i === 0 ? 'Primary Diagnosis' : i === 1 ? 'Differential 1' : 'Differential 2'} · ${d.organ}</div><div class="dx-ev">${d.evidence}</div></div>`).join('')}
        </div>
        <div class="risk-row">
          ${(r.risks || []).map(x => `<div class="rc"><div class="rc-lv r${x.level[0]}" style="color:${rC[x.level] || 'var(--muted)'}">● ${x.level}</div><div class="rc-val r${x.level[0]}" style="color:${rC[x.level] || 'var(--text)'}">${x.value}</div><div class="rc-name">${x.name}</div></div>`).join('')}
        </div>
        <div class="ib"><div class="ib-hdr">🧠 AI Co-Pilot Analysis</div><div class="ib-txt"><p>${r.insights || ''}</p>
          ${(r.warnings || []).length ? `<p class="ib-warn">⚠ ${r.warnings.join(' · ')}</p>` : ''}
          ${(r.actions || []).length ? `<div><span class="ib-act">Immediate Actions:</span>${r.actions.map((a, i) => `<div style="display:flex;gap:.6rem;align-items:flex-start;margin-top:.5rem"><span style="background:var(--cg);border:1px solid rgba(0,212,255,.18);border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-family:var(--FM);font-size:.6rem;color:var(--cyan);flex-shrink:0">${i + 1}</span><span style="font-size:.82rem;color:var(--text2)">${a}</span></div>`).join('')}</div>` : ''}
        </div></div>
      </div>
      <div class="rs">
        <div class="rs-hdr"><div class="rs-num">3</div><div class="rs-title">Similar Patient Intelligence</div><span class="rs-core-badge">⭐ Core Innovation</span></div>
        <div style="font-family:var(--FM);font-size:.7rem;color:var(--muted);margin-bottom:1rem">Top ${(r.similar || []).length} similar patients matched across MIMIC-IV, NIH, ICMR · 847,000+ records scanned</div>
        <div class="sim-rpt">
          ${(r.similar || []).map((s, i) => `<div class="srl ${s.sim >= 90 ? 'top' : ''}"><div class="srl-rank" style="${s.sim >= 90 ? 'border-color:var(--mint);color:var(--mint)' : ''}">#${i + 1}</div><div><div class="srl-name"><span style="font-family:var(--FM);color:${pColors[i]}">${s.id}</span> · ${s.age} · ${s.yr} · <span style="color:${pColors[i]}">${s.dx}</span></div><div class="srl-meta">🏥 ${s.organ} · <strong style="color:var(--white)">${s.tx}</strong> · ⏱ ${s.days} days · <span style="color:var(--mint)">✓ ${s.outcome}</span> · ${s.success}% success rate</div><div class="srl-tags">${s.shared?.split(',').map(t => `<span class="srl-tag">${t.trim()}</span>`).join('') || ''}${(s.meds || []).map(m => `<span class="srl-tag srl-drug">💊 ${m}</span>`).join('')}</div></div><div class="srl-score"><span class="srl-pct" style="color:${s.sim >= 90 ? 'var(--mint)' : 'var(--cyan)'}">${s.sim}%</span><span class="srl-pct-l">Match</span></div></div>`).join('')}
        </div>
        <div class="comp-table-wrap" style="margin-top:1.2rem"><table class="comp-table"><thead><tr><th>#</th><th>Patient</th><th>Similarity</th><th>Diagnosis</th><th>Treatment</th><th>Recovery</th><th>Outcome</th><th>Success</th></tr></thead><tbody>${(r.similar || []).map((s, i) => `<tr class="${s.sim >= 90 ? 'best-outcome' : ''}"><td style="color:${pColors[i]};font-weight:700">#${i + 1}</td><td><span style="font-family:var(--FM);color:${pColors[i]}">${s.id}</span> · ${s.age}</td><td class="pct-cell" style="color:${s.sim >= 90 ? 'var(--mint)' : 'var(--cyan)'}">${s.sim}%</td><td>${s.dx}</td><td style="max-width:140px;white-space:normal">${s.tx}</td><td>${s.days}d</td><td class="${s.outcome.includes('Full') ? 'outcome-good' : 'outcome-partial'}">${s.outcome}</td><td class="pct-cell" style="color:var(--mint)">${s.success}%</td></tr>`).join('')}</tbody></table></div>
      </div>
      <div class="rs">
        <div class="rs-hdr"><div class="rs-num">4</div><div class="rs-title">Treatment Outcome Analysis</div></div>
        <div style="font-size:.8rem;color:var(--muted);margin-bottom:1rem"><strong style="color:var(--gold)">${r.grade || 'Grade A Evidence'}</strong> · Evidence from ${(r.similar || []).length} similar historical patient cases</div>
        <div class="bar-chart" style="margin-bottom:1.4rem"><div class="bar-chart-title">Treatment Success Comparison</div>${(r.treatments || []).map((t, i) => `<div class="bar-row"><div class="bar-label">${(t.label || '').substring(0, 20)}</div><div class="bar-track"><div class="bar-fill opt-${['a','b','c'][i] || 'a'}" style="width:${t.rate}%"><span class="bar-pct">${t.rate}%</span></div></div></div>`).join('')}</div>
        <div class="tx-grid2">
          ${(r.treatments || []).map((t, i) => `<div class="txc ${t.combined ? 'rec' : ''}"><div class="txc-lrow"><div class="txc-lbl">${t.label}</div>${t.combined ? '<div class="txc-rec-b">✓ Recommended</div>' : ''}</div><div style="display:flex;gap:.3rem;margin-bottom:.5rem">${t.combined ? '<span class="tx-tag ai-rec">AI Recommended</span>' : ''}${i === 2 || t.combined ? '<span class="tx-tag effective">Most Effective</span>' : ''}<span class="tx-tag fast">${t.days} days</span></div><div class="txc-name">${t.name}</div><div class="txc-stats"><div><span class="txc-stat-n ${t.combined ? 'g' : ''}">${t.rate}%</span><div class="txc-stat-l">Success Rate</div></div><div><span class="txc-stat-n">${t.days}</span><div class="txc-stat-l">Recovery Days</div></div></div><div class="txc-drugs">${(t.meds || []).map(m => `<span class="txc-drug">${m}</span>`).join('')}</div><div class="txc-why"><strong>Evidence:</strong> ${t.why || ''}</div>${t.side ? `<div style="font-size:.73rem;color:var(--amber);margin-top:.55rem">⚠ ${t.side}</div>` : ''}</div>`).join('')}
        </div>
      </div>
      <div class="rs">
        <div class="rs-hdr"><div class="rs-num">5</div><div class="rs-title">Doctor Decision Support</div></div>
        <div class="dd-box">
          <div class="dd-hdr">🩺 AI Co-Pilot Summary for Treating Doctor</div>
          <div class="dd-summary">${r.decision || 'Complete clinical assessment required.'}</div>
          <div class="dd-grid">
            <div><div class="dd-sec-t">Recommended Investigations</div><ul class="dd-list"><li>Complete diagnostic workup based on presenting symptoms</li><li>Confirm abnormal findings with repeat labs if needed</li><li>Specialist consultation as indicated</li></ul></div>
            <div><div class="dd-sec-t">Specialist Referral</div><ul class="dd-list"><li>${r.profile?.organ || 'Relevant'} specialist consultation recommended</li></ul>
            <div class="dd-sec-t" style="margin-top:.8rem">Follow-Up Plan</div><ul class="dd-list"><li>${r.followup || 'Review in 3–5 days or earlier if symptoms worsen.'}</li></ul></div>
          </div>
          <div class="dd-rec"><div class="dd-rec-t">AI Recommended Treatment</div><div class="dd-rec-v">${r.recommend || 'Combined therapy approach'}</div><div class="dd-prog">${r.prognosis || 'Prognosis is favorable with appropriate and timely treatment.'}</div></div>
        </div>
        <div class="disc-box">⚕️ <strong>Medical Disclaimer:</strong> This AI Clinical Report is a decision-support tool only. All final treatment decisions must be made by the qualified treating physician. AI is co-pilot — the doctor is always in command. Patient ID <strong style="font-family:var(--FM)">${_RID}</strong> — share with your doctor for dashboard access.</div>
      </div>
    </div>
  </div>`;

  setTimeout(() => { (r.diagnoses || []).forEach((d, i) => { const b = document.getElementById('dx' + i); if (b) { b.style.width = '0%'; setTimeout(() => b.style.width = d.pct + '%', 150 + i * 100); } }); }, 200);
  showToast('✅', `AIT Report ready! ID: ${_RID}`);
}

/* ═══ 26. COPY ID ═══ */
function cpyId() { if (_RID) { navigator.clipboard.writeText(_RID).catch(() => { }); showToast('📋', 'AIT ID copied: ' + _RID); } }
window.cpyId = cpyId;

/* ═══ 27. PDF DOWNLOAD ═══ */
async function dlPDF() {
  if (!_R || !_RID) return;
  showToast('⏳', 'Generating PDF report...');
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210, M = 16;
    const rC = { High: [255, 77, 109], Moderate: [255, 179, 71], Low: [0, 229, 160], Critical: [255, 34, 68] };
    const rLevel = _R.profile?.risk || 'Moderate';
    const rc = rC[rLevel] || [255, 179, 71];
    const bmi = PD.wt && PD.ht ? (PD.wt / ((PD.ht / 100) ** 2)).toFixed(1) : '—';
    const now = new Date();

    doc.setFillColor(7, 20, 40); doc.rect(0, 0, 210, 24, 'F');
    doc.setFillColor(0, 212, 255); doc.roundedRect(M, 5, 32, 14, 3, 3, 'F');
    doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text('HN', M + 16, 13.5, { align: 'center' });
    doc.setTextColor(0, 212, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.text('HN Healthcare — AI Clinical Treatment Report', M + 36, 10.5);
    doc.setTextColor(90, 130, 165); doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.text('AI Clinical Co-Pilot · Team Parakram · India Innovates 2026', M + 36, 17);
    doc.setTextColor(240, 165, 0); doc.setFont('courier', 'bold'); doc.setFontSize(9); doc.text(_RID, W - M, 13, { align: 'right' });
    doc.setTextColor(90, 130, 165); doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.text('AIT Patient ID', W - M, 18, { align: 'right' });

    let y = 30;
    doc.setFillColor(6, 18, 40); doc.roundedRect(M, y, W - 32, 36, 3, 3, 'F');
    doc.setDrawColor(...rc); doc.setLineWidth(.4); doc.roundedRect(M, y, W - 32, 36, 3, 3, 'S');
    doc.setFillColor(...rc); doc.rect(M, y, 3, 36, 'F');
    doc.setTextColor(220, 235, 245); doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text(PD.name || 'Patient', M + 6, y + 10);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(140, 175, 210);
    doc.text(`${PD.age || '—'}y · ${PD.gender || '—'} · Blood: ${PD.blood || '—'} · BMI: ${bmi}`, M + 6, y + 18);
    doc.text(`BP: ${PD.bps || '—'}/${PD.bpd || '—'} mmHg · HR: ${PD.hr || '—'} bpm · SpO₂: ${PD.spo2 || '—'}% · Temp: ${PD.temp || '—'}°F`, M + 6, y + 25);
    doc.text(`Ref: ${PD.doctor || 'Not specified'} · Generated: ${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`, M + 6, y + 32);
    doc.setFillColor(...rc); doc.roundedRect(W - M - 44, y + 5, 42, 13, 3, 3, 'F');
    doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text('Risk: ' + rLevel, W - M - 23, y + 13, { align: 'center' });
    y += 44;

    const secHdr = (title, yy) => { doc.setFillColor(0, 212, 255); doc.rect(M, yy, 3, 9, 'F'); doc.setTextColor(220, 235, 245); doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.text(title, M + 7, yy + 7); doc.setDrawColor(25, 45, 80); doc.setLineWidth(.3); doc.line(M, yy + 11, W - M, yy + 11); return yy + 16; };

    y = secHdr('STEP 2 — AI DIAGNOSTIC ANALYSIS', y);
    (_R.diagnoses || []).forEach((d, i) => {
      const cols = [[0, 212, 255], [240, 165, 0], [167, 139, 250]]; const c = cols[i] || [100, 100, 100];
      doc.setFillColor(6, 18, 40); doc.roundedRect(M, y, W - 32, 22, 2, 2, 'F');
      doc.setFillColor(...c); doc.roundedRect(M, y, 3, 22, 1, 1, 'F');
      doc.setTextColor(220, 235, 245); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(d.name || '—', M + 6, y + 8);
      const ev = doc.splitTextToSize(d.evidence || '', 130); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.2); doc.setTextColor(130, 160, 195); doc.text(ev, M + 6, y + 14);
      doc.setTextColor(...c); doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.text((d.pct || '—') + '%', W - M - 8, y + 14, { align: 'right' });
      y += 26;
    });

    y += 4; y = secHdr('STEP 3 — SIMILAR PATIENT INTELLIGENCE (CORE INNOVATION)', y);
    doc.setTextColor(90, 130, 165); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
    doc.text(`Top ${(_R.similar || []).length} similar patients from MIMIC-IV, NIH, ICMR · 847,000+ records scanned`, M, y); y += 6;
    (_R.similar || []).slice(0, 5).forEach((s, i) => {
      if (y > 240) { doc.addPage(); doc.setFillColor(2, 10, 22); doc.rect(0, 0, 210, 297, 'F'); y = 16; }
      const pC = [[0, 212, 255], [240, 165, 0], [255, 77, 109], [0, 229, 160], [255, 179, 71]]; const c = pC[i] || [100, 100, 100];
      doc.setFillColor(6, 18, 40); doc.roundedRect(M, y, W - 32, 20, 2, 2, 'F');
      if (s.sim >= 90) { doc.setDrawColor(0, 229, 160); doc.setLineWidth(.3); doc.roundedRect(M, y, W - 32, 20, 2, 2, 'S'); }
      doc.setFillColor(...c); doc.roundedRect(M, y, 3, 20, 1, 1, 'F');
      doc.setTextColor(...c); doc.setFont('courier', 'bold'); doc.setFontSize(7.5); doc.text('#' + (i + 1) + ' ' + s.id, M + 5, y + 7);
      doc.setTextColor(220, 235, 245); doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.text(s.age + ' · ' + s.dx, M + 5, y + 13);
      doc.setTextColor(120, 160, 200); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.2); doc.text('Tx: ' + s.tx + ' · ' + s.days + ' days · ' + s.outcome + ' · ' + s.success + '% success', M + 5, y + 19);
      doc.setTextColor(s.sim >= 90 ? [0, 229, 160] : [0, 212, 255]); doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text(s.sim + '%', W - M - 8, y + 13, { align: 'right' });
      y += 24;
    });

    if (y > 195) { doc.addPage(); doc.setFillColor(2, 10, 22); doc.rect(0, 0, 210, 297, 'F'); y = 16; }
    y += 4; y = secHdr('STEP 4 — TREATMENT OUTCOME ANALYSIS', y);
    const hw = (W - 36) / 3;
    (_R.treatments || []).forEach((t, i) => {
      const x = M + i * (hw + 4);
      doc.setFillColor(6, 18, 40); doc.roundedRect(x, y, hw, 46, 2, 2, 'F');
      if (t.combined) { doc.setDrawColor(0, 229, 160); doc.setLineWidth(.4); doc.roundedRect(x, y, hw, 46, 2, 2, 'S'); }
      doc.setTextColor(140, 170, 200); doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.text((t.label || '').substring(0, 26), x + 4, y + 7);
      doc.setTextColor(t.combined ? [0, 229, 160] : [0, 212, 255]); doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text(t.rate + '%', x + 4, y + 22);
      doc.setTextColor(120, 160, 200); doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.text('Recovery: ' + t.days + ' days', x + 4, y + 29);
      const ml = doc.splitTextToSize((t.meds || []).join(', '), hw - 8); doc.text(ml, x + 4, y + 34);
    });
    y += 54;

    if (y > 230) { doc.addPage(); doc.setFillColor(2, 10, 22); doc.rect(0, 0, 210, 297, 'F'); y = 16; }
    y = secHdr('STEP 5 — DOCTOR DECISION SUPPORT', y);
    doc.setTextColor(130, 170, 210); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    const dl = doc.splitTextToSize(_R.decision || 'Complete clinical assessment required.', W - 36);
    doc.text(dl, M, y); y += dl.length * 4.5 + 5;
    doc.setTextColor(0, 229, 160); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.text('Recommended Treatment: ' + (_R.recommend || 'Combined Protocol'), M, y); y += 5;
    const fl = doc.splitTextToSize(_R.followup || '', W - 36);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(120, 160, 200); doc.text('Follow-up: ', M, y); doc.text(fl, M + 18, y);

    doc.setFillColor(7, 20, 40); doc.rect(0, 290, 210, 7, 'F');
    doc.setTextColor(0, 212, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5);
    doc.text('AI DECISION SUPPORT ONLY — Final treatment decisions remain with the qualified treating physician.', 105, 295, { align: 'center' });

    doc.save(`HealthAI_AIT_${_RID}.pdf`);
    showToast('✅', 'PDF downloaded: HealthAI_AIT_' + _RID + '.pdf');
  } catch (e) { showToast('❌', 'PDF generation failed: ' + e.message); }
}
window.dlPDF = dlPDF;

/* ═══ 28. DOCTOR PORTAL ═══ */
function lookupDoc() {
  const id = document.getElementById('docIdInp').value.trim().toUpperCase();
  if (!id) { showToast('⚠️', 'Enter a Patient AIT ID'); return; }
  const stored = localStorage.getItem(id);
  if (stored) { const d = JSON.parse(stored); buildDocDash(d.PD, d.r, d.rid); }
  else { showToast('⚠️', 'ID not found. Generate a report first, or load the demo case.'); }
}
window.lookupDoc = lookupDoc;

function loadDocDemo() {
  const key = 'AIT-DEMO2026';
  const demoPD = { name: 'Rajesh Kumar Sharma', age: 48, gender: 'Male', blood: 'B+', doctor: 'Dr. Priya Mehta, AIIMS Delhi OPD', bps: 148, bpd: 94, hr: 98, temp: 101.4, spo2: 93, rr: 22, wt: 82, ht: 172, hb: '10.8', wbc: '14.2', plt: '195', cr: '1.1', sgpt: '52', tntn: '0.02', fbs: '186', imaging: 'Chest X-ray: right lower lobe consolidation. ECG: sinus tachycardia.', sym_txt: 'Productive cough with fever for 10 days, breathlessness on exertion, pleuritic chest pain', symTags: ['Fever', 'Persistent Cough', 'Shortness of Breath', 'Chest Pain', 'Fatigue', 'Night Sweats'] };
  const demoR = {
    profile: { summary: '48-year-old diabetic male presenting with 10-day history of productive cough, high-grade fever 101.4°F, and progressive breathlessness. SpO₂ critically low at 93% with right lower lobe consolidation on CXR and markedly elevated WBC 14.2 confirming active bacterial infection.', risk: 'High', risk_reason: 'SpO₂ 93% critical, WBC 14.2 confirmed infection, poor glycemic control FBS 186', organ: 'Lungs' },
    diagnoses: [{ name: 'Community-Acquired Pneumonia (Bacterial)', pct: 71, organ: 'Lungs', evidence: 'Fever 101.4°F, productive cough, right lower lobe consolidation on CXR, WBC 14.2' }, { name: 'Pulmonary Tuberculosis', pct: 18, organ: 'Lungs', evidence: 'Night sweats, right lower lobe involvement — AFB smear mandatory' }, { name: 'Diabetic Pneumonitis/Aspiration', pct: 11, organ: 'Lungs', evidence: 'Uncontrolled T2DM FBS 186 increases aspiration risk' }],
    risks: [{ name: 'Infection Severity', level: 'High', value: 'PSI Class IV — Severe' }, { name: 'Glycemic Control', level: 'High', value: 'FBS 186 — Poor' }, { name: 'Oxygenation', level: 'High', value: 'SpO₂ 93% Critical' }, { name: 'Renal Function', level: 'Moderate', value: 'Cr 1.1 — Mild ↑' }],
    insights: 'Patient presents with classic bacterial CAP: fever 101.4°F, productive cough, WBC 14.2, right lower lobe consolidation. SpO₂ 93% is critically low — immediate supplemental oxygen is mandatory. Uncontrolled diabetes FBS 186 significantly complicates both the infection severity and recovery timeline.',
    warnings: ['SpO₂ 93% — Oxygen supplementation REQUIRED immediately', 'WBC 14.2 — Active bacterial infection confirmed'],
    actions: ['START supplemental O₂ 2–4 L/min immediately', 'INITIATE IV Ceftriaxone 1g BD + Azithromycin 500mg OD', 'INSULIN sliding scale — target glucose 140–180 mg/dL', 'SEND sputum AFB smear × 3 — mandatory TB exclusion'],
    similar: [{ id: 'PT-2841', age: '51M', yr: 2022, organ: 'Lungs', dx: 'Bacterial CAP + DM', sim: 94, tx: 'Ceftriaxone + Azithromycin + Insulin', txtype: 'IV Combined', outcome: 'Full Recovery', days: 11, success: 89, meds: ['Ceftriaxone 1g IV BD', 'Azithromycin 500mg OD', 'Pantoprazole 40mg'], shared: 'Fever,cough,SOB,low SpO2,diabetes' }, { id: 'PT-3392', age: '45M', yr: 2021, organ: 'Lungs', dx: 'Severe CAP', sim: 89, tx: 'IV Antibiotics + O₂ Therapy', txtype: 'IV Combined', outcome: 'Full Recovery', days: 14, success: 86, meds: ['Amoxicillin-Clavulanate', 'Azithromycin', 'Prednisolone'], shared: 'Fever,productive cough,consolidation' }, { id: 'PT-4018', age: '55F', yr: 2023, organ: 'Lungs', dx: 'CAP + T2DM', sim: 84, tx: 'Meropenem + Glucose Control', txtype: 'IV+Metabolic', outcome: 'Recovery with Monitoring', days: 9, success: 83, meds: ['Meropenem 1g TDS', 'Insulin sliding scale', 'Furosemide'], shared: 'SOB,fever,hyperglycemia' }, { id: 'PT-2255', age: '43M', yr: 2022, organ: 'Heart', dx: 'CAP + Sepsis Risk', sim: 79, tx: 'IV Cephalosporin + O₂', txtype: 'IV Antibiotic', outcome: 'Full Recovery', days: 12, success: 81, meds: ['Ceftriaxone 2g IV OD', 'Doxycycline 100mg BD', 'O₂ 4L/min'], shared: 'Cough,chest pain,low SpO2' }, { id: 'PT-5119', age: '62M', yr: 2022, organ: 'Kidney', dx: 'CAP with AKI', sim: 72, tx: 'ICU Protocol + Renal-adjusted', txtype: 'ICU Combined', outcome: 'Partial Recovery', days: 21, success: 71, meds: ['Piperacillin-Taz', 'Vancomycin renal-dose', 'IV Fluids'], shared: 'Fever,SOB,elevated creatinine' }],
    treatments: [{ label: 'Treatment Option A', name: 'Standard Monotherapy — Oral Antibiotics', rate: 61, days: '14-21', meds: ['Amoxicillin-Clavulanate 625mg TDS', 'Paracetamol 650mg SOS'], why: 'Oral monotherapy suitable only for mild CAP (PSI Class I-II).', side: 'Monitor renal function', combined: false }, { label: 'Treatment Option B', name: 'IV Monotherapy — Cephalosporin Alone', rate: 74, days: '10-16', meds: ['Ceftriaxone 1g IV BD', 'Pantoprazole 40mg OD', 'O₂ suppl'], why: 'Covers typical bacteria but misses atypical pathogens.', side: 'Monitor LFTs; atypical not covered', combined: false }, { label: 'Treatment C — Combined IV Protocol (Recommended)', name: 'Ceftriaxone + Azithromycin + Insulin Sliding Scale', rate: 86, days: '9-12', meds: ['Ceftriaxone 1g IV BD', 'Azithromycin 500mg IV OD', 'Insulin sliding scale', 'O₂ 2–4L/min'], why: '86% success rate in 4 similar diabetic CAP patients from MIMIC-IV.', side: 'Monitor LFTs at day 3; step down to oral after 72h', combined: true }],
    recommend: 'Combined IV Protocol: Ceftriaxone + Azithromycin + Insulin Sliding Scale',
    grade: 'Grade A — IDSA/ATS CAP Guidelines 2019 + RCT Evidence',
    decision: 'Patient requires immediate hospital admission. Based on 5 similar patients from MIMIC-IV, combined IV antibiotic therapy achieved 86% success vs 61% for oral monotherapy. Simultaneous glycemic control is mandatory.',
    followup: 'Reassess at 48–72h. Step down to oral antibiotics if afebrile >24h and SpO₂ ≥95% on room air.',
    prognosis: 'With combined IV antibiotic therapy and glycemic control, 86% of similar patients achieved full recovery in 9–12 days.'
  };
  localStorage.setItem(key, JSON.stringify({ PD: demoPD, r: demoR, rid: key }));
  document.getElementById('docIdInp').value = key;
  buildDocDash(demoPD, demoR, key);
}
window.loadDocDemo = loadDocDemo;

function buildDocDash(pat, rep, rid) {
  document.getElementById('docIdScreen').style.display = 'none';
  const dash = document.getElementById('docDash');
  dash.style.display = 'block';
  const rC = { High: 'var(--rose)', Moderate: 'var(--amber)', Low: 'var(--mint)', Critical: 'var(--rose)' };
  const pColors = ['#00d4ff', '#f0a500', '#ff4d6d', '#00e5a0', '#ffb347'];
  const bmi = pat.wt && pat.ht ? (pat.wt / ((pat.ht / 100) ** 2)).toFixed(1) : '—';
  const pr = rep.profile || {};
  const simCount = (rep.similar || []).length;
  const bestTx = (rep.treatments || []).find(t => t.combined) || (rep.treatments || [])[0] || {};
  const avgSuccess = simCount ? Math.round((rep.similar || []).reduce((a, s) => a + (s.success || 0), 0) / simCount) : 0;
  const aiConf = Math.max(...(rep.diagnoses || []).map(d => d.pct || 0), 0);
  const dataFields = [pat.name, pat.age, pat.gender, pat.bps, pat.hr, pat.spo2, pat.temp, pat.hb, pat.wbc, pat.sym_txt].filter(Boolean).length;
  const dataQuality = Math.min(100, Math.round(dataFields / 10 * 100));
  const simStrength = simCount ? Math.round((rep.similar || []).reduce((a, s) => a + s.sim, 0) / simCount) : 0;
  const urgency = pr.risk === 'High' || pr.risk === 'Critical' ? 'high-priority' : pr.risk === 'Moderate' ? 'medium-priority' : 'routine';
  const urgencyLabel = urgency === 'high-priority' ? '🔴 High Priority' : urgency === 'medium-priority' ? '🟡 Medium Priority' : '🟢 Routine';

  dash.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(0,212,255,.07) 0%,rgba(240,165,0,.04) 100%);border:1px solid rgba(0,212,255,.12);border-radius:var(--r20);padding:1.5rem 1.8rem;margin-bottom:1.4rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
        <div>
          <div style="font-family:var(--FM);font-size:.56rem;color:var(--cyan);letter-spacing:.16em;text-transform:uppercase;margin-bottom:.28rem">AIT ID: ${rid}</div>
          <div style="font-family:var(--FD);font-size:2rem;font-weight:700;color:var(--white);display:flex;align-items:center;gap:.8rem">${pat.name || '—'} <span class="urgency-tag ${urgency}">${urgencyLabel}</span></div>
          <div style="font-size:.78rem;color:var(--text2);margin-top:.28rem">${pat.age}y · ${pat.gender} · ${pat.blood || '—'} · BMI: ${bmi} · Ref: ${pat.doctor || 'Self'}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.5rem">
          <div class="risk-pill" style="background:${pr.risk === 'High' ? 'rgba(255,77,109,.15)' : 'rgba(255,179,71,.1)'};border:1.5px solid ${pr.risk === 'High' ? 'rgba(255,77,109,.35)' : 'rgba(255,179,71,.3)'}"><div class="risk-dot" style="background:${rC[pr.risk] || 'var(--amber)'}"></div><span style="color:${rC[pr.risk] || 'var(--amber)'};font-weight:800;font-size:.78rem">Risk: ${pr.risk || 'Moderate'}</span></div>
          <div style="font-size:.68rem;color:var(--muted)">Organ: <strong style="color:var(--white)">${pr.organ || '—'}</strong></div>
          <button class="rpt-btn re" style="font-size:.68rem" onclick="document.getElementById('docDash').style.display='none';document.getElementById('docIdScreen').style.display='block'">← New Patient</button>
        </div>
      </div>
    </div>

    <div class="quick-stats">
      <div class="qs-card"><div class="qs-ico cyan">🔬</div><div><div class="qs-val">847K+</div><div class="qs-lbl">Records Scanned</div></div></div>
      <div class="qs-card"><div class="qs-ico gold">👥</div><div><div class="qs-val">${simCount}</div><div class="qs-lbl">Similar Cases Found</div></div></div>
      <div class="qs-card"><div class="qs-ico mint">🎯</div><div><div class="qs-val">${aiConf}%</div><div class="qs-lbl">AI Confidence</div></div></div>
      <div class="qs-card"><div class="qs-ico rose">💊</div><div><div class="qs-val">${(rep.treatments || []).length}</div><div class="qs-lbl">Treatment Options</div></div></div>
    </div>

    <div class="dtabs">
      <button class="dtab on" onclick="dTab(0)">🔬 Overview</button>
      <button class="dtab" onclick="dTab(1)">👥 Similar (${simCount})</button>
      <button class="dtab" onclick="dTab(2)">💊 Treatments</button>
      <button class="dtab" onclick="dTab(3)">📊 Vitals</button>
      <button class="dtab" onclick="dTab(4)">📥 Export</button>
    </div>

    <!-- TAB 0: Clinical Overview -->
    <div class="dtc on" id="dt0">
      <div class="trust-panel">
        <div class="trust-title"><i class="fa-solid fa-shield-halved"></i> AI Trust Indicators</div>
        <div class="trust-grid">
          <div class="trust-item"><span class="ti-val ${aiConf >= 70 ? 'green' : aiConf >= 50 ? 'amber' : 'red'}">${aiConf}%</span><span class="ti-lbl">AI Confidence</span><div class="ti-bar"><div class="ti-bar-fill ${aiConf >= 70 ? 'green' : aiConf >= 50 ? 'amber' : 'red'}" style="width:${aiConf}%"></div></div></div>
          <div class="trust-item"><span class="ti-val ${dataQuality >= 70 ? 'green' : 'amber'}">${dataQuality}%</span><span class="ti-lbl">Data Completeness</span><div class="ti-bar"><div class="ti-bar-fill ${dataQuality >= 70 ? 'green' : 'amber'}" style="width:${dataQuality}%"></div></div></div>
          <div class="trust-item"><span class="ti-val ${simStrength >= 80 ? 'green' : simStrength >= 60 ? 'amber' : 'red'}">${simStrength}%</span><span class="ti-lbl">Similarity Strength</span><div class="ti-bar"><div class="ti-bar-fill ${simStrength >= 80 ? 'green' : simStrength >= 60 ? 'amber' : 'red'}" style="width:${simStrength}%"></div></div></div>
          <div class="trust-item"><span class="ti-val ${avgSuccess >= 75 ? 'green' : 'amber'}">${avgSuccess}%</span><span class="ti-lbl">Avg Treatment Success</span><div class="ti-bar"><div class="ti-bar-fill ${avgSuccess >= 75 ? 'green' : 'amber'}" style="width:${avgSuccess}%"></div></div></div>
        </div>
      </div>

      <div class="ai-summary">
        <div class="ais-title"><i class="fa-solid fa-brain"></i> AI Clinical Summary</div>
        <div class="ais-text">${pr.summary || 'Clinical profile compiled from patient data.'}</div>
      </div>

      <div class="decision-panel">
        <div class="dec-card recommended"><span class="dc-tag ai-rec">AI Recommended</span><span class="dc-icon">🎯</span><div class="dc-label">Top Diagnosis</div><div class="dc-value">${(rep.diagnoses || [])[0]?.name || '—'}</div><div class="dc-sub">${aiConf}% confidence</div></div>
        <div class="dec-card"><span class="dc-tag effective">Most Effective</span><span class="dc-icon">💊</span><div class="dc-label">Best Treatment</div><div class="dc-value">${bestTx.name || '—'}</div><div class="dc-sub">${bestTx.rate || '—'}% success</div></div>
        <div class="dec-card"><span class="dc-tag fast">Fastest</span><span class="dc-icon">⚡</span><div class="dc-label">Fastest Recovery</div><div class="dc-value">${((rep.treatments || []).reduce((a, t) => { const d = parseInt(t.days); return d && d < a ? d : a; }, 999)) || '—'} days</div><div class="dc-sub">Shortest recovery option</div></div>
        <div class="dec-card"><span class="dc-icon">🛡️</span><div class="dc-label">Lowest Risk</div><div class="dc-value">${((rep.treatments || []).find(t => !t.combined) || {}).name || '—'}</div><div class="dc-sub">Conservative approach</div></div>
      </div>

      ${(rep.risks || []).length ? `<div class="risk-alerts">${(rep.risks || []).map(x => {
        const cls = x.level === 'High' || x.level === 'Critical' ? 'alert-high' : x.level === 'Moderate' ? 'alert-moderate' : 'alert-low';
        return `<div class="risk-alert ${cls}"><i class="fa-solid fa-triangle-exclamation"></i><span class="ra-text"><strong>${x.name}:</strong> ${x.value}</span><span class="ra-badge">${x.level}</span></div>`;
      }).join('')}</div>` : ''}

      <div class="reasoning-panel">
        <div class="reasoning-title"><i class="fa-solid fa-lightbulb"></i> Why AI Suggested This Diagnosis</div>
        <ul class="reasoning-list">
          ${(rep.diagnoses || []).slice(0, 1).map(d => `<li><strong>${d.name}</strong> — ${d.evidence}</li>`).join('')}
          ${(rep.warnings || []).map(w => `<li><strong>⚠ Warning:</strong> ${w}</li>`).join('')}
          ${(rep.actions || []).slice(0, 2).map(a => `<li>${a}</li>`).join('')}
          ${pr.risk_reason ? `<li><strong>Risk basis:</strong> ${pr.risk_reason}</li>` : ''}
        </ul>
      </div>

      <div class="rs-hdr" style="margin-bottom:1rem"><div class="rs-num">2</div><div class="rs-title">AI Diagnostic Analysis</div></div>
      <div class="dx-grid">${(rep.diagnoses || []).map((d, i) => `<div class="dx-card ${i === 0 ? 'primary' : ''}"><div class="dx-name">${d.name}</div><div class="dx-bar-bg"><div class="dx-bar" style="width:${d.pct}%"></div></div><div class="dx-pct">${d.pct}%</div><div class="dx-type">${i === 0 ? 'Primary' : 'Differential'} · ${d.organ}</div><div class="dx-ev">${d.evidence}</div></div>`).join('')}</div>

      <div class="ib"><div class="ib-hdr">🧠 AI Co-Pilot Analysis</div><div class="ib-txt"><p>${rep.insights || ''}</p>
        ${(rep.warnings || []).length ? `<p class="ib-warn">⚠ ${rep.warnings.join(' · ')}</p>` : ''}
        ${(rep.actions || []).length ? `<div><span class="ib-act">IMMEDIATE ACTIONS:</span>${rep.actions.map((a, i) => `<div style="display:flex;gap:.6rem;align-items:flex-start;margin-top:.5rem"><span style="background:var(--cg);border:1px solid rgba(0,212,255,.18);border-radius:50%;width:17px;height:17px;display:flex;align-items:center;justify-content:center;font-family:var(--FM);font-size:.6rem;color:var(--cyan);flex-shrink:0">${i + 1}</span><span style="font-size:.8rem;color:var(--text2)">${a}</span></div>`).join('')}</div>` : ''}
      </div></div>

      <div class="safety-panel" style="margin-top:1.4rem">
        <div class="safety-title"><i class="fa-solid fa-shield-virus"></i> Medical Safety Layer</div>
        <div class="safety-grid">
          <div class="safety-col"><h4><i class="fa-solid fa-triangle-exclamation" style="color:var(--rose)"></i> Possible Complications</h4><ul>${(rep.warnings || ['Monitor for deterioration']).map(w => `<li>${w}</li>`).join('')}</ul></div>
          <div class="safety-col"><h4><i class="fa-solid fa-stethoscope" style="color:var(--cyan)"></i> Alternative Diagnoses</h4><ul>${(rep.diagnoses || []).slice(1).map(d => `<li>${d.name} (${d.pct}%)</li>`).join('') || '<li>None identified</li>'}</ul></div>
          <div class="safety-col"><h4><i class="fa-solid fa-flask" style="color:var(--gold)"></i> Suggested Tests</h4><ul><li>Confirmatory workup for ${pr.organ || 'primary'} condition</li><li>Repeat abnormal labs</li><li>Specialist referral as indicated</li></ul></div>
        </div>
      </div>

      ${rep.followup ? `<div style="margin-top:.9rem;padding:.9rem 1.1rem;background:rgba(0,229,160,.04);border:1px solid rgba(0,229,160,.15);border-radius:var(--r12);font-size:.83rem"><strong style="color:var(--mint)">📅 Follow-Up:</strong> <span style="color:var(--text2)">${rep.followup}</span></div>` : ''}
    </div>

    <!-- TAB 1: Similar Patients -->
    <div class="dtc" id="dt1">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:.8rem">
        <div style="font-family:var(--FM);font-size:.7rem;color:var(--muted)">Top ${simCount} similar patients · MIMIC-IV, NIH, ICMR · 847K+ records</div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap" id="simSortBtns">
          <button class="sf-btn active" onclick="sortSim('sim')">Similarity %</button>
          <button class="sf-btn" onclick="sortSim('days')">Recovery Time</button>
          <button class="sf-btn" onclick="sortSim('success')">Success Rate</button>
        </div>
      </div>

      <div class="smart-filters" id="simFilters">
        <span class="sf-label"><i class="fa-solid fa-filter"></i> Filter:</span>
        <select class="sf-select" id="sfOutcome" onchange="filterSim()"><option value="">All Outcomes</option><option value="Full Recovery">Full Recovery</option><option value="Partial">Partial Recovery</option><option value="Stabilised">Stabilised</option></select>
        <select class="sf-select" id="sfOrgan" onchange="filterSim()"><option value="">All Organs</option>${[...new Set((rep.similar || []).map(s => s.organ))].map(o => `<option value="${o}">${o}</option>`).join('')}</select>
      </div>

      <div class="comp-table-wrap">
        <table class="comp-table" id="compTable">
          <thead><tr><th>Rank</th><th>Patient</th><th>Similarity <span class="sort-icon">▼</span></th><th>Diagnosis</th><th>Treatment</th><th>Recovery</th><th>Outcome</th><th>Success</th></tr></thead>
          <tbody id="compBody">${(rep.similar || []).map((s, i) => `<tr class="${s.sim >= 90 ? 'best-outcome' : ''}"><td style="color:${pColors[i]};font-weight:700">#${i + 1}</td><td><span style="font-family:var(--FM);color:${pColors[i]}">${s.id}</span> · ${s.age}</td><td class="pct-cell" style="color:${s.sim >= 90 ? 'var(--mint)' : 'var(--cyan)'}">${s.sim}%</td><td>${s.dx}</td><td style="max-width:160px;white-space:normal">${s.tx}</td><td>${s.days} days</td><td class="${s.outcome.includes('Full') ? 'outcome-good' : s.outcome.includes('Partial') ? 'outcome-partial' : 'outcome-bad'}">${s.outcome}</td><td class="pct-cell" style="color:var(--mint)">${s.success}%</td></tr>`).join('')}</tbody>
        </table>
      </div>

      <div class="bar-chart">
        <div class="bar-chart-title">Treatment Success Comparison</div>
        ${(rep.treatments || []).map((t, i) => `<div class="bar-row"><div class="bar-label">${t.name ? t.name.substring(0, 22) : 'Option ' + (i + 1)}</div><div class="bar-track"><div class="bar-fill opt-${['a', 'b', 'c'][i] || 'a'}" style="width:${t.rate}%"><span class="bar-pct">${t.rate}%</span></div></div></div>`).join('')}
      </div>

      <div style="background:rgba(0,212,255,.03);border:1px solid rgba(0,212,255,.12);border-radius:var(--r16);padding:1.2rem 1.4rem;margin-bottom:1.4rem">
        <div style="font-family:var(--FM);font-size:.62rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:.8rem;display:flex;align-items:center;gap:.5rem"><i class="fa-solid fa-magnifying-glass-chart"></i> AI Clinical Pattern Detection</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div><div style="font-size:.72rem;font-weight:700;color:var(--white);margin-bottom:.4rem">Common Symptoms</div><div style="display:flex;flex-wrap:wrap;gap:.25rem">${(() => { const syms = {}; (rep.similar || []).forEach(s => (s.shared || '').split(',').forEach(t => { t = t.trim(); if (t) syms[t] = (syms[t] || 0) + 1; })); return Object.entries(syms).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([s, c]) => `<span class="srl-tag">${s} (${c})</span>`).join(''); })()}</div></div>
          <div><div style="font-size:.72rem;font-weight:700;color:var(--white);margin-bottom:.4rem">Recovery Analysis</div><div style="font-size:.78rem;color:var(--text2)">Average: <strong style="color:var(--cyan)">${simCount ? Math.round((rep.similar || []).reduce((a, s) => a + s.days, 0) / simCount) : '—'} days</strong> · Best: <strong style="color:var(--mint)">${Math.min(...(rep.similar || []).map(s => s.days))} days</strong> · Longest: ${Math.max(...(rep.similar || []).map(s => s.days))} days</div></div>
        </div>
      </div>

      <div class="sim-rpt" id="simCards">${(rep.similar || []).map((s, i) => `<div class="srl ${s.sim >= 90 ? 'top' : ''}" data-sim="${s.sim}" data-days="${s.days}" data-success="${s.success}" data-outcome="${s.outcome}" data-organ="${s.organ}"><div class="srl-rank" style="${s.sim >= 90 ? 'border-color:var(--mint);color:var(--mint)' : ''}">#${i + 1}</div><div><div class="srl-name"><span style="font-family:var(--FM);color:${pColors[i]}">${s.id}</span> · ${s.age} · ${s.yr} · <span style="color:${pColors[i]}">${s.dx}</span></div><div class="srl-meta">🏥 ${s.organ} · <strong style="color:var(--white)">${s.tx}</strong> · ⏱ ${s.days} days · <span style="color:var(--mint)">✓ ${s.outcome}</span> · <span style="color:var(--mint)">${s.success}% success</span></div><div class="srl-tags">${s.shared?.split(',').map(t => `<span class="srl-tag">${t.trim()}</span>`).join('') || ''}${(s.meds || []).map(m => `<span class="srl-tag srl-drug">💊 ${m}</span>`).join('')}</div><button class="explain-btn" onclick="this.nextElementSibling.classList.toggle('show')"><i class="fa-solid fa-lightbulb"></i> Explain Similarity</button><div class="explain-content"><p style="font-size:.78rem;color:var(--text2);margin-bottom:.4rem"><strong style="color:var(--cyan)">Matching Factors:</strong></p><div style="font-size:.74rem;color:var(--text2);line-height:1.6">→ Shared symptoms: <strong style="color:var(--white)">${s.shared || 'N/A'}</strong><br>→ Organ: ${s.organ} · Treatment type: ${s.txtype || 'N/A'}<br>→ Recovery: ${s.days} days · Success rate: ${s.success}%<br>→ Medications: ${(s.meds || []).join(', ') || 'N/A'}</div></div></div><div class="srl-score"><span class="srl-pct" style="color:${s.sim >= 90 ? 'var(--mint)' : 'var(--cyan)'}">${s.sim}%</span><span class="srl-pct-l">Match</span></div></div>`).join('')}</div>
    </div>

    <!-- TAB 2: Treatment Analysis -->
    <div class="dtc" id="dt2">
      <div style="font-size:.8rem;color:var(--muted);margin-bottom:1rem"><strong style="color:var(--gold)">${rep.grade || 'Grade A Evidence'}</strong> · Evidence from ${simCount} similar cases</div>

      <div class="bar-chart">
        <div class="bar-chart-title">Treatment Comparison</div>
        ${(rep.treatments || []).map((t, i) => `<div class="bar-row"><div class="bar-label">${t.label ? t.label.substring(0, 20) : 'Option ' + (i + 1)}</div><div class="bar-track"><div class="bar-fill opt-${['a', 'b', 'c'][i] || 'a'}" style="width:${t.rate}%"><span class="bar-pct">${t.rate}%</span></div></div></div>`).join('')}
      </div>

      <div class="tx-grid2">${(rep.treatments || []).map((t, i) => `<div class="txc ${t.combined ? 'rec' : ''}"><div class="txc-lrow"><div class="txc-lbl">${t.label}</div>${t.combined ? '<div class="txc-rec-b">✓ Recommended</div>' : ''}</div><div style="display:flex;gap:.35rem;margin-bottom:.5rem">${t.combined ? '<span class="tx-tag ai-rec">AI Recommended</span>' : ''}${i === 0 ? '' : i === 1 ? '<span class="tx-tag effective">Most Effective</span>' : ''}<span class="tx-tag fast">${t.days} days</span></div><div class="txc-name">${t.name}</div><div class="txc-stats"><div><span class="txc-stat-n ${t.combined ? 'g' : ''}">${t.rate}%</span><div class="txc-stat-l">Success Rate</div></div><div><span class="txc-stat-n">${t.days}</span><div class="txc-stat-l">Recovery Days</div></div></div><div class="txc-drugs">${(t.meds || []).map(m => `<span class="txc-drug">${m}</span>`).join('')}</div><div class="txc-why"><strong>Evidence:</strong> ${t.why || ''}</div>${t.side ? `<div style="font-size:.73rem;color:var(--amber);margin-top:.55rem">⚠ ${t.side}</div>` : ''}</div>`).join('')}</div>

      <div class="dd-box"><div class="dd-hdr">🩺 Doctor Decision Support</div><div class="dd-summary">${rep.decision || ''}</div>
        <div class="dd-rec"><div class="dd-rec-t">AI Recommended Treatment</div><div class="dd-rec-v">${rep.recommend || '—'}</div><div class="dd-prog">${rep.prognosis || '—'}</div></div>
        <div class="disc-box" style="margin-top:1rem">⚕️ AI recommendation based on ${simCount} similar patient cases. Final treatment plan must be made by the treating physician. AI is co-pilot — doctor commands.</div>
      </div>
    </div>

    <!-- TAB 3: Vitals, Labs, Notes, Timeline -->
    <div class="dtc" id="dt3">
      <div class="clinical-timeline">
        <div class="ct-step done"><div class="ct-dot">✓</div><div class="ct-day">Day 0</div><div class="ct-event">Symptom Onset</div></div>
        <div class="ct-step active"><div class="ct-dot">2</div><div class="ct-day">Current</div><div class="ct-event">AI Analysis</div></div>
        <div class="ct-step"><div class="ct-dot">3</div><div class="ct-day">Day 3-5</div><div class="ct-event">Treatment Start</div></div>
        <div class="ct-step"><div class="ct-dot">4</div><div class="ct-day">Week 1-2</div><div class="ct-event">Follow-Up</div></div>
        <div class="ct-step"><div class="ct-dot">5</div><div class="ct-day">${bestTx.days || '14-21'} days</div><div class="ct-event">Recovery Target</div></div>
      </div>

      <div style="font-family:var(--FM);font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--cyan);margin-bottom:.8rem">Vital Signs</div>
      <div class="vg">
        ${[
      { ico: '🌡️', val: (pat.temp || '—') + '°F', lbl: 'Temperature', cls: parseFloat(pat.temp) > 99.5 ? 'bad' : 'ok', st: parseFloat(pat.temp) > 99.5 ? '⚠ Fever' : 'Normal' },
      { ico: '❤️', val: (pat.hr || '—') + ' bpm', lbl: 'Heart Rate', cls: parseInt(pat.hr) > 100 ? 'warn' : 'ok', st: parseInt(pat.hr) > 100 ? '⚠ Tachycardia' : 'Normal' },
      { ico: '🩸', val: (pat.bps || '—') + '/' + (pat.bpd || '—') + ' mmHg', lbl: 'Blood Pressure', cls: parseInt(pat.bps || 120) > 135 ? 'warn' : 'ok', st: parseInt(pat.bps || 120) > 135 ? '⚠ Elevated' : 'Normal' },
      { ico: '💨', val: (pat.spo2 || '—') + '%', lbl: 'SpO₂', cls: parseInt(pat.spo2) < 93 ? 'bad' : parseInt(pat.spo2) < 96 ? 'warn' : 'ok', st: parseInt(pat.spo2) < 93 ? '⚠ CRITICAL' : parseInt(pat.spo2) < 96 ? '⚠ Low' : 'Normal' },
      { ico: '🫁', val: (pat.rr || '—') + '/min', lbl: 'Resp. Rate', cls: parseInt(pat.rr) > 20 ? 'warn' : 'ok', st: parseInt(pat.rr) > 20 ? '⚠ Tachypnea' : 'Normal' },
      { ico: '📊', val: bmi, lbl: 'BMI (kg/m²)', cls: '', st: 'Body Mass Index' },
    ].map(v => `<div class="vc"><div class="vc-ico">${v.ico}</div><span class="vc-val ${v.cls}">${v.val}</span><div class="vc-unit">${v.st}</div><div class="vc-lbl">${v.lbl}</div></div>`).join('')}
      </div>

      <div style="font-family:var(--FM);font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--cyan);margin-bottom:.8rem;margin-top:.8rem">Laboratory Values</div>
      <div class="lg">
        ${[
      { n: 'Haemoglobin', v: pat.hb, u: 'g/dL', lo: 12, hi: 17.5, nr: '12–17.5' },
      { n: 'WBC', v: pat.wbc, u: '×10³/µL', lo: 4.5, hi: 11, nr: '4.5–11' },
      { n: 'Platelets', v: pat.plt, u: '×10³/µL', lo: 150, hi: 400, nr: '150–400' },
      { n: 'Glucose(F)', v: pat.fbs, u: 'mg/dL', lo: 70, hi: 100, nr: '70–100' },
      { n: 'Creatinine', v: pat.cr, u: 'mg/dL', lo: .6, hi: 1.2, nr: '0.6–1.2' },
      { n: 'Troponin I', v: pat.tntn, u: 'ng/mL', lo: 0, hi: .04, nr: '<0.04' },
      { n: 'SGPT/ALT', v: pat.sgpt, u: 'U/L', lo: 7, hi: 56, nr: '7–56' },
    ].map(l => { const vn = parseFloat(l.v); const cls = !l.v ? '' : vn > l.hi ? 'lc-hi' : vn < l.lo && l.lo > 0 ? 'lc-lo' : 'lc-ok'; return `<div class="lc"><div class="lc-name">${l.n}</div><div class="lc-val ${cls}">${l.v || '—'}</div><div class="lc-unit">${l.u}</div><div class="lc-norm">Normal: ${l.nr}</div></div>`; }).join('')}
      </div>

      ${pat.imaging ? `<div class="ib" style="margin-top:1rem"><div class="ib-hdr" style="color:var(--gold)">📋 ECG / Imaging Findings</div><div class="ib-txt"><p>${pat.imaging}</p></div></div>` : ''}
      ${pat.sym_txt ? `<div class="ib" style="margin-top:.9rem"><div class="ib-hdr" style="color:var(--mint)">📝 Chief Complaints</div><div class="ib-txt"><p>${pat.sym_txt}</p>${(pat.symTags || []).length ? `<p style="margin-top:.5rem">${pat.symTags.map(s => `<span style="font-family:var(--FM);font-size:.66rem;padding:.12rem .48rem;background:rgba(0,229,160,.07);border:1px solid rgba(0,229,160,.15);border-radius:4px;color:var(--mint);display:inline-block;margin:.18rem .18rem 0 0">${s}</span>`).join('')}</p>` : ''}</div></div>` : ''}

      <div class="clinical-notes" style="margin-top:1.4rem">
        <div class="cn-title"><i class="fa-solid fa-notes-medical"></i> Clinical Notes</div>
        <div class="cn-tabs"><button class="cn-tab active" onclick="this.parentElement.querySelectorAll('.cn-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Doctor Notes</button><button class="cn-tab" onclick="this.parentElement.querySelectorAll('.cn-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">AI Notes</button></div>
        <textarea class="cn-textarea" placeholder="Write your clinical observations, treatment plan, and follow-up notes here..."></textarea>
      </div>
    </div>

    <!-- TAB 4: Export & Reports -->
    <div class="dtc" id="dt4">
      <div style="text-align:center;padding:2rem 1rem">
        <div style="font-size:3rem;margin-bottom:1rem">📑</div>
        <div style="font-family:var(--FD);font-size:1.6rem;font-weight:700;color:var(--white);margin-bottom:.5rem">Export Clinical Report</div>
        <div style="font-size:.85rem;color:var(--muted);margin-bottom:2rem;max-width:440px;margin-left:auto;margin-right:auto;line-height:1.6">Download or export the complete AI clinical analysis including patient profile, similar patient evidence, treatment insights, and doctor notes.</div>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
          <button class="rpt-btn dl" style="padding:1rem 2rem;font-size:.82rem" onclick="exportDashPDF('${rid}')">⬇ Download PDF Report</button>
          <button class="rpt-btn cp" style="padding:1rem 2rem;font-size:.82rem" onclick="navigator.clipboard.writeText('${rid}');showToast('📋','AIT ID copied: ${rid}')">📋 Copy Patient ID: ${rid}</button>
        </div>
        <div style="margin-top:2rem;padding:1.2rem;background:var(--glass);border:1px solid var(--rim);border-radius:var(--r12)">
          <div style="font-family:var(--FM);font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);margin-bottom:.8rem">Report Contents</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;text-align:left">
            <div style="font-size:.78rem;color:var(--text2)">✅ Patient Clinical Profile</div>
            <div style="font-size:.78rem;color:var(--text2)">✅ AI Diagnostic Analysis</div>
            <div style="font-size:.78rem;color:var(--text2)">✅ ${simCount} Similar Patient Cases</div>
            <div style="font-size:.78rem;color:var(--text2)">✅ Treatment Comparison</div>
            <div style="font-size:.78rem;color:var(--text2)">✅ AI Recommendations</div>
            <div style="font-size:.78rem;color:var(--text2)">✅ Report ID: ${rid}</div>
          </div>
        </div>
      </div>
    </div>`;

  showToast('✅', 'Patient loaded: ' + rid);
}

/* ═══ SORT SIMILAR PATIENTS ═══ */
function sortSim(key) {
  const cards = document.getElementById('simCards');
  if (!cards) return;
  const items = [...cards.children];
  items.sort((a, b) => {
    const av = parseFloat(a.dataset[key]) || 0;
    const bv = parseFloat(b.dataset[key]) || 0;
    return key === 'days' ? av - bv : bv - av;
  });
  items.forEach(el => cards.appendChild(el));
  document.querySelectorAll('#simSortBtns .sf-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}
window.sortSim = sortSim;

/* ═══ FILTER SIMILAR PATIENTS ═══ */
function filterSim() {
  const outcome = document.getElementById('sfOutcome')?.value || '';
  const organ = document.getElementById('sfOrgan')?.value || '';
  document.querySelectorAll('#simCards .srl').forEach(el => {
    const matchOutcome = !outcome || (el.dataset.outcome || '').includes(outcome);
    const matchOrgan = !organ || el.dataset.organ === organ;
    el.style.display = matchOutcome && matchOrgan ? '' : 'none';
  });
  // Also filter table rows
  document.querySelectorAll('#compBody tr').forEach((tr, i) => {
    const card = document.querySelectorAll('#simCards .srl')[i];
    if (card) tr.style.display = card.style.display;
  });
}
window.filterSim = filterSim;

/* ═══ EXPORT DASHBOARD PDF ═══ */
function exportDashPDF(rid) {
  const stored = localStorage.getItem(rid);
  if (stored) {
    const d = JSON.parse(stored);
    _R = d.r; _RID = d.rid;
    Object.assign(PD, d.PD);
    dlPDF();
  } else {
    showToast('⚠️', 'Cannot export — data not found');
  }
}
window.exportDashPDF = exportDashPDF;


function dTab(n) {
  document.querySelectorAll('.dtab').forEach((t, i) => t.classList.toggle('on', i === n));
  document.querySelectorAll('.dtc').forEach((c, i) => c.classList.toggle('on', i === n));
}
window.dTab = dTab;

