'use strict';

/* ═══════════════════════════════════════════════════════════════
   THREE.JS  —  PROCEDURAL 3D CODE BACKGROUND
   Floating holographic code panels + word sprites + particles
   Mouse moves the camera; panels gently bob and rotate.
   ═══════════════════════════════════════════════════════════════ */
(function initScene() {

  const canvas   = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0a0e17, 1);

  const scene  = new THREE.Scene();
  scene.fog    = new THREE.FogExp2(0x0a0e17, 0.042);

  const camera = new THREE.PerspectiveCamera(
    55, window.innerWidth / window.innerHeight, 0.1, 120
  );
  camera.position.set(0, 0, 10);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Syntax colour for a single code line ─────────────────── */
  function lineColor(line) {
    const t = line.trim();
    if (!t) return '#00000000';
    if (/^(\/\/|#|--|\/\*)/.test(t))                                     return '#374151';
    if (/^@/.test(t))                                                     return '#c084fc';
    if (/\b(import|export|from|function|const|let|var|return|class|new|extends|async|await|if|else|for|while)\b/.test(t)) return '#a78bfa';
    if (/\b(public|private|protected|void|static|class|interface|extends|implements|new)\b/.test(t)) return '#60a5fa';
    if (/\b(SELECT|FROM|WHERE|JOIN|LEFT|GROUP|ORDER|LIMIT|BY|ON|AS|COUNT|MAX|SUM)\b/.test(t)) return '#38bdf8';
    if (/^[\s]*['"`]/.test(t) || /:\s*['"`]/.test(t))                    return '#34d399';
    if (/^\s*[\}\)\]]+[,;]?\s*$/.test(t))                                return '#fb923c';
    if (/\b(true|false|null|undefined|0\.|[0-9]+)\b/.test(t))            return '#f59e0b';
    return '#7dd3fc';
  }

  /* ── Build a canvas texture for one code panel ────────────── */
  function makePanelTexture(lines, title) {
    const PW = 680;
    const LH = 21;
    const PH = Math.max(lines.length * LH + 62, 280);

    const cv = document.createElement('canvas');
    cv.width = PW; cv.height = PH;
    const cx = cv.getContext('2d');

    /* background */
    cx.fillStyle = 'rgba(4, 9, 22, 0.97)';
    cx.fillRect(0, 0, PW, PH);

    /* animated-looking scanlines overlay */
    for (let y = 0; y < PH; y += 4) {
      cx.fillStyle = 'rgba(0,0,0,0.08)';
      cx.fillRect(0, y, PW, 2);
    }

    /* glowing border — gradient from cyan → purple → cyan */
    const bg = cx.createLinearGradient(0, 0, PW, PH);
    bg.addColorStop(0,   'rgba(0,212,255,0.9)');
    bg.addColorStop(0.5, 'rgba(124,58,237,0.7)');
    bg.addColorStop(1,   'rgba(0,212,255,0.9)');
    cx.strokeStyle = bg;
    cx.lineWidth = 2;
    cx.strokeRect(1, 1, PW - 2, PH - 2);

    /* corner accent brackets */
    cx.strokeStyle = '#00d4ff';
    cx.lineWidth = 3;
    const C = 18;
    // top-left
    cx.beginPath(); cx.moveTo(1, C); cx.lineTo(1, 1); cx.lineTo(C, 1); cx.stroke();
    // top-right
    cx.beginPath(); cx.moveTo(PW-C, 1); cx.lineTo(PW-1, 1); cx.lineTo(PW-1, C); cx.stroke();
    // bottom-left
    cx.beginPath(); cx.moveTo(1, PH-C); cx.lineTo(1, PH-1); cx.lineTo(C, PH-1); cx.stroke();
    // bottom-right
    cx.beginPath(); cx.moveTo(PW-C, PH-1); cx.lineTo(PW-1, PH-1); cx.lineTo(PW-1, PH-C); cx.stroke();

    /* title bar */
    cx.fillStyle = 'rgba(0,212,255,0.055)';
    cx.fillRect(0, 0, PW, 24);
    [['#ff5f57',12],['#febc2e',27],['#28c840',42]].forEach(([c,x]) => {
      cx.fillStyle = c;
      cx.beginPath(); cx.arc(x, 12, 5, 0, Math.PI * 2); cx.fill();
    });
    cx.fillStyle = 'rgba(148,163,184,0.55)';
    cx.font = '11px monospace';
    cx.fillText(title, 58, 16);

    /* code lines */
    lines.forEach((line, i) => {
      const y = 44 + i * LH;
      // line number
      cx.fillStyle = '#1e3a5f';
      cx.font = '11px monospace';
      cx.fillText(String(i + 1).padStart(2, '0'), 8, y);
      // code text
      if (line.trim()) {
        cx.fillStyle = lineColor(line);
        cx.shadowColor = lineColor(line);
        cx.shadowBlur = 4;
        cx.font = '13px monospace';
        cx.fillText(line, 36, y);
        cx.shadowBlur = 0;
      }
    });

    return new THREE.CanvasTexture(cv);
  }

  /* ── Panel definitions ─────────────────────────────────────── */
  const PANELS = [
    {
      title: '~/src/Dashboard.jsx',
      pos: [-5.6, 1.8, -3.0], ry: 0.30, rx: 0.05, w: 4.1, h: 3.4,
      lines: [
        "import { useState, useEffect } from 'react'",
        "import { fetchAPI } from './api/client'",
        '',
        'export default function Dashboard({ userId }) {',
        '  const [vehicles, setVehicles] = useState([])',
        '  const [loading,  setLoading]  = useState(true)',
        '',
        '  useEffect(() => {',
        "    fetchAPI(`/api/vehicles/${userId}`)",
        '      .then(setVehicles)',
        '      .finally(() => setLoading(false))',
        '  }, [userId])',
        '',
        '  if (loading) return <Spinner />',
        '',
        '  return (',
        '    <main className="dashboard-grid">',
        '      {vehicles.map(v => (',
        '        <VehicleCard key={v.id} data={v} />',
        '      ))}',
        '    </main>',
        '  )',
        '}',
      ],
    },
    {
      title: '~/src/VehicleController.java',
      pos: [5.2, 0.8, -4.0], ry: -0.30, rx: 0.04, w: 4.3, h: 3.6,
      lines: [
        '@RestController',
        '@RequestMapping("/api/v1")',
        '@CrossOrigin(origins = "*")',
        'public class VehicleController {',
        '',
        '  @Autowired',
        '  private VehicleService service;',
        '',
        '  @GetMapping("/vehicles")',
        '  public ResponseEntity<List<Vehicle>>',
        '  getAll(@RequestParam Long userId) {',
        '    return ResponseEntity',
        '      .ok(service.findByOwner(userId));',
        '  }',
        '',
        '  @PostMapping("/vehicles")',
        '  public ResponseEntity<Vehicle>',
        '  create(@RequestBody Vehicle v) {',
        '    Vehicle saved = service.save(v);',
        '    return ResponseEntity',
        '      .status(201).body(saved);',
        '  }',
        '',
        '  @DeleteMapping("/vehicles/{id}")',
        '  public ResponseEntity<Void>',
        '  delete(@PathVariable Long id) {',
        '    service.deleteById(id);',
        '    return ResponseEntity.noContent().build();',
        '  }',
        '}',
      ],
    },
    {
      title: '~/prompts/crm_agent_v3.txt',
      pos: [-1.0, -3.2, -2.0], ry: 0.10, rx: -0.10, w: 4.5, h: 3.2,
      lines: [
        '# Agentforce CRM Routing Agent — v3.2',
        '# Accenture / Utility Client — Production',
        '',
        'SYSTEM:',
        '  You are an AI routing agent for a',
        '  utility CRM platform (Salesforce).',
        '  Classify and route customer requests.',
        '  Never fabricate account information.',
        '',
        'CONTEXT:',
        '  Customer Record : {customer_record}',
        '  Interaction Log : {interaction_log}',
        '  Account Tier    : {account_tier}',
        '',
        'RULES:',
        '  - Output must be valid JSON only',
        '  - confidence < 0.7 → flag for review',
        '  - Never expose internal system IDs',
        '',
        'OUTPUT_FORMAT: {',
        '  "action"     : string,',
        '  "department" : string,',
        '  "confidence" : float,',
        '  "reason"     : string',
        '}',
      ],
    },
    {
      title: '~/db/queries/v_tracker.sql',
      pos: [2.4, 3.0, -1.5], ry: -0.20, rx: 0.06, w: 3.9, h: 2.8,
      lines: [
        '-- V-Tracker: full service history report',
        '',
        'SELECT',
        '  v.id,',
        '  v.make, v.model, v.year,',
        '  COUNT(m.id)   AS total_services,',
        '  MAX(m.date)   AS last_service,',
        '  SUM(m.cost)   AS total_spent',
        'FROM   vehicles    v',
        'LEFT JOIN maintenance m',
        '       ON v.id = m.vehicle_id',
        'WHERE  v.owner_id = :userId',
        '  AND  m.date    >= :fromDate',
        'GROUP  BY v.id',
        'ORDER  BY last_service DESC',
        'LIMIT  20;',
      ],
    },
    {
      title: '~/scripts/deploy_agent.js',
      pos: [-4.4, -1.2, -0.6], ry: 0.26, rx: 0.02, w: 4.0, h: 3.2,
      lines: [
        "import { AgentForce } from '@salesforce/agent'",
        "import { loadTemplate } from './prompts/loader'",
        "import { logger }       from './utils'",
        '',
        'async function deployAgent() {',
        '  const prompt = await loadTemplate(',
        "    'crm_agent_v3'",
        '  )',
        '',
        '  const agent = new AgentForce({',
        "    model:    'gpt-4-turbo',",
        "    workflow: 'utility_crm_v3',",
        '    humanReview: true,',
        '    maxRetries:  3,',
        '    temperature: 0.2,',
        '    maxTokens:   2048,',
        '    prompt,',
        '  })',
        '',
        '  await agent.validate()',
        '  await agent.deploy()',
        "  logger.info('Agent deployed ✓')",
        '}',
        '',
        'deployAgent().catch(console.error)',
      ],
    },
  ];

  /* ── Create panel meshes ───────────────────────────────────── */
  const panelMeshes = [];

  PANELS.forEach(p => {
    const tex = makePanelTexture(p.lines, p.title);
    const geo = new THREE.PlaneGeometry(p.w, p.h);
    const mat = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 0.90,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...p.pos);
    mesh.rotation.y = p.ry;
    mesh.rotation.x = p.rx;
    mesh.userData.baseY  = p.pos[1];
    mesh.userData.phase  = Math.random() * Math.PI * 2;
    mesh.userData.speed  = 0.22 + Math.random() * 0.14;
    scene.add(mesh);
    panelMeshes.push(mesh);

    /* cyan glow edges */
    const eGeo = new THREE.EdgesGeometry(geo);
    const eMat = new THREE.LineBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0.22,
    });
    mesh.add(new THREE.LineSegments(eGeo, eMat));
  });

  /* ── Floating code-word sprites ────────────────────────────── */
  const WORDS = [
    '</>',   '{ }',   '[ ]',   '=>',    '===',
    'async', 'await', 'const', 'return','null??',
    'useState','useEffect','fetch','JSON',
    '@Get',  '@Post', '@RestController',
    'SELECT','JOIN',  'WHERE', 'GROUP BY',
    'prompt','AI',    'LLM',   'agent()',
    'React', 'Spring','MySQL', 'REST',
    'git push','npm i','docker','CI/CD',
  ];

  const wordMeshes = [];
  WORDS.forEach(word => {
    const cv = document.createElement('canvas');
    cv.width = 320; cv.height = 76;
    const cx = cv.getContext('2d');
    const hue = Math.random() > 0.45 ? 192 : 268;
    cx.clearRect(0, 0, 320, 76);
    cx.font = 'bold 26px monospace';
    cx.fillStyle   = `hsla(${hue}, 100%, 72%, 0.95)`;
    cx.shadowColor = `hsl(${hue}, 100%, 65%)`;
    cx.shadowBlur  = 16;
    cx.fillText(word, 8, 54);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.65 });
    const spr = new THREE.Sprite(mat);
    const s = 0.8 + Math.random() * 1.0;
    spr.scale.set(s * 2.4, s * 0.58, 1);
    spr.position.set(
      (Math.random() - 0.5) * 24,
      (Math.random() - 0.5) * 15,
      -(Math.random() * 10 + 1)
    );
    spr.userData.baseY = spr.position.y;
    spr.userData.phase = Math.random() * Math.PI * 2;
    spr.userData.speed = 0.16 + Math.random() * 0.22;
    scene.add(spr);
    wordMeshes.push(spr);
  });

  /* ── Particle field (small glowing dots) ───────────────────── */
  const N   = 280;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 6;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  /* cyan dots */
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x00d4ff, size: 0.07, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })));

  /* purple dots (second pass at offset positions) */
  const pos2 = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos2[i * 3]     = (Math.random() - 0.5) * 38;
    pos2[i * 3 + 1] = (Math.random() - 0.5) * 24;
    pos2[i * 3 + 2] = (Math.random() - 0.5) * 18 - 5;
  }
  const pGeo2 = new THREE.BufferGeometry();
  pGeo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
  scene.add(new THREE.Points(pGeo2, new THREE.PointsMaterial({
    color: 0x7c3aed, size: 0.06, transparent: true, opacity: 0.45,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })));

  /* ── Grid floor — subtle perspective grid far below ─────────── */
  const gridHelper = new THREE.GridHelper(60, 40, 0x002233, 0x001122);
  gridHelper.position.y = -7;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.35;
  scene.add(gridHelper);

  /* ── Mouse tracking ────────────────────────────────────────── */
  let mx = 0, my = 0, camX = 0, camY = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Render loop ───────────────────────────────────────────── */
  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    /* smooth camera parallax */
    camX += (mx * 2.0 - camX) * 0.032;
    camY += (-my * 1.2 - camY) * 0.032;
    camera.position.x = camX;
    camera.position.y = camY;
    camera.lookAt(0, 0, 0);

    /* panel float */
    panelMeshes.forEach(m => {
      m.position.y = m.userData.baseY
        + Math.sin(t * m.userData.speed + m.userData.phase) * 0.14;
    });

    /* word sprite float */
    wordMeshes.forEach(s => {
      s.position.y = s.userData.baseY
        + Math.sin(t * s.userData.speed + s.userData.phase) * 0.18;
    });

    /* slow grid drift */
    gridHelper.position.x = Math.sin(t * 0.05) * 1.5;

    renderer.render(scene, camera);
  })();

})(); /* end initScene */


/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO UI  —  nav, burger, typewriter, observers, form
   ═══════════════════════════════════════════════════════════════ */

/* ── Nav scroll ──────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── Burger menu ─────────────────────────────────────────────── */
const burger   = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Terminal typewriter ─────────────────────────────────────── */
const typedCmd = document.getElementById('typed-cmd');
const heroInfo = document.getElementById('hero-info');
const typeText = 'whoami --verbose';
let ti = 0;
heroInfo.style.display = 'none';

function typeChar() {
  if (ti < typeText.length) {
    typedCmd.textContent += typeText[ti++];
    setTimeout(typeChar, 75 + Math.random() * 45);
  } else {
    heroInfo.style.display = 'block';
  }
}
setTimeout(typeChar, 700);

/* ── Scroll reveal ───────────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.section-label, .section-title, .about-text, .about-stats, ' +
  '.skill-category, .project-card, .edu-card, .contact-left, .contact-form'
);
new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('animate-in'), i * 55);
    }
  });
}, { threshold: 0.08 }).observe
  ? (() => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('animate-in'), i * 55);
          }
        });
      }, { threshold: 0.08 });
      revealEls.forEach(el => obs.observe(el));
    })()
  : revealEls.forEach(el => el.classList.add('animate-in'));

/* ── Timeline reveal ─────────────────────────────────────────── */
document.querySelectorAll('.timeline-item').forEach((item, idx) => {
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      setTimeout(() => item.classList.add('visible'), idx * 120);
      obs.unobserve(item);
    }
  }, { threshold: 0.15 });
  obs.observe(item);
});

/* ── Active nav link on scroll ───────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe
  ? (() => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
            if (a) a.classList.add('active');
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' });
      sections.forEach(s => obs.observe(s));
    })()
  : null;

/* ── Contact form — Formspree ─────────────────────────────────── */
const form       = document.getElementById('contact-form');
const btnText    = document.getElementById('btn-text');
const btnSending = document.getElementById('btn-sending');
const formOk     = document.getElementById('form-success');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();
  if (!name || !email || !message) return;

  btnText.classList.add('hidden');
  btnSending.classList.remove('hidden');

  try {
    const res = await fetch('https://formspree.io/f/mykqpoao', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify({ name, email, message }),
    });

    if (res.ok) {
      formOk.classList.remove('hidden');
      form.reset();
      setTimeout(() => formOk.classList.add('hidden'), 6000);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data?.errors?.[0]?.message || 'Something went wrong — please try again.');
    }
  } catch {
    alert('Network error — please check your connection and try again.');
  } finally {
    btnText.classList.remove('hidden');
    btnSending.classList.add('hidden');
  }
});

/* ── Stat counter animation ──────────────────────────────────── */
function countUp(el) {
  const raw    = el.textContent;
  const suffix = raw.replace(/[0-9]/g, '');
  const target = parseInt(raw, 10);
  const start  = performance.now();
  const dur    = 1200;
  (function step(now) {
    const ease = 1 - Math.pow(1 - Math.min((now - start) / dur, 1), 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (ease < 1) requestAnimationFrame(step);
  })(start);
}

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { countUp(e.target); countObs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => countObs.observe(el));
