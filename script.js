/* ===== 1. SCHEDULE DATA (edit here) ===== */
const DAYS = [
  ["11.10.2026","ఆదివారం","శ్రీ బాలా త్రిపురసుందరి దేవి","","bala-tripura-sundari","బాల రూపంలో కొలువైన అమ్మవారు."],
  ["12.10.2026","సోమవారం","శ్రీ గాయత్రీ దేవి","","gayatri-devi","జ్ఞాన ప్రదాయిని, వేదమాత."],
  ["13.10.2026","మంగళవారం","శ్రీ అన్నపూర్ణ దేవి","","annapurna-devi","అన్నదాత్రి, అందరినీ పోషించే తల్లి."],
  ["14.10.2026","బుధవారం","శ్రీ మహా చండి దేవి","","maha-chandi","దుష్ట శిక్షణ, శిష్ట రక్షణ చేసే శక్తి."],
  ["15.10.2026","గురువారం","శ్రీ లలితా త్రిపుర సుందరి దేవి","","lalitha-tripura-sundari","శ్రీ చక్ర నివాసిని, సౌందర్య స్వరూపిణి."],
  ["16.10.2026","శుక్రవారం","శ్రీ సరస్వతి దేవి","(మూలా నక్షత్రం)","saraswati-devi","విద్య, కళల అధిష్ఠాన దేవత."],
  ["17.10.2026","శనివారం","శ్రీ మహాలక్ష్మి దేవి","","mahalakshmi-devi","ఐశ్వర్య, సౌభాగ్య ప్రదాయిని."],
  ["18.10.2026","ఆదివారం","శ్రీ దుర్గాదేవి","(దుర్గాష్టమి)","durga-devi","కష్టాలను తొలగించే దుర్గమ్మ."],
  ["19.10.2026","సోమవారం","శ్రీ మహిషాసుర మర్ధిని దేవి","","mahishasura-mardini","మహిషాసురుని సంహరించిన విజయ స్వరూపిణి."],
  ["20.10.2026","మంగళవారం","శ్రీ రాజరాజేశ్వరి దేవి","(విజయదశమి)","rajarajeshwari","సర్వలోకాధిపతి, విజయదశమి అమ్మవారు."]
];
const $ = s => document.querySelector(s);
const DAY_ONE_DATE = new Date("2026-10-11T00:00:00");
const updateCountdown = () => {
  const countdownEl = $("#countdown");
  if (!countdownEl) return;

  const now = new Date();
  const diff = DAY_ONE_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    countdownEl.textContent = "Day 1 is here";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownEl.textContent = `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
};
setInterval(updateCountdown, 1000);
updateCountdown();

const IMG = k => {
  const map = {
    "bala-tripura-sundari": "ammavaru1.jpg",
    "gayatri-devi": "ammavaru4.jpg",
    "annapurna-devi": "ammavaru3.jpg",
    "maha-chandi": "ammavaru4.jpg",
    "lalitha-tripura-sundari": "ammavaru5.jpg",
    "saraswati-devi": "ammavaru6.jpg",
    "mahalakshmi-devi": "sri mahalakshmi devi.jpg",
    "durga-devi": "ammavaru8.jpg",
    "mahishasura-mardini": "ammamvaru9.jpg",
    "rajarajeshwari": "ammavaru10.jpg"
  };
  return map[k] || "assets/images/goddess-generic.svg";
};
let boost = 1; // particle speed boost while hovering a card

/* ===== 2. BUILD CARDS + GALLERY ===== */
DAYS.forEach(([date, wk, name, sub, key, desc]) => {
  const c = document.createElement("div");
  c.className = "card"; c.tabIndex = 0;
  c.style.setProperty("--img", `url(${IMG(key)})`);
  c.innerHTML = `<div class="d">${date} – ${wk}</div><div class="n">${name}</div><div class="s">${sub}</div>`;
  c.onmouseenter = () => boost = 2.5;   // more particles/speed on hover
  c.onmouseleave = () => boost = 1;
  const open = () => {
    $("#mimg").src = IMG(key); $("#mname").textContent = name + " " + sub;
    $("#mdate").textContent = `${date} – ${wk}`; $("#mdesc").textContent = desc;
    $("#modal").classList.add("on");
    gsap.from(".box", {scale: .85, opacity: 0, duration: .5, ease: "back.out(1.6)"});
  };
  c.onclick = open; c.onkeydown = e => e.key === "Enter" && open();
  $("#cards").append(c);

  const g = document.createElement("div");
  g.className = "g";
  g.innerHTML = `<img loading="lazy" src="${IMG(key)}" alt="${name}"><span>${name}</span>`;
  // 3D tilt following the pointer
  g.onmousemove = e => {
    const r = g.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    g.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
  };
  g.onmouseleave = () => g.style.transform = "";
  $("#gal").append(g);
});
$("#close").onclick = () => $("#modal").classList.remove("on");
$("#modal").onclick = e => e.target.id === "modal" && $("#modal").classList.remove("on");

/* ===== 3. SCROLL REVEAL (IntersectionObserver + GSAP) ===== */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    // clearProps removes GSAP's inline styles afterwards so cards end fully visible
    gsap.fromTo(e.target.children, {y: 30, opacity: 0}, {y: 0, opacity: 1, stagger: .06, duration: .6, clearProps: "all"});
    io.unobserve(e.target);
  }
}), {threshold: 0, rootMargin: "0px 0px -5% 0px"});
["#cards", "#gal"].forEach(s => io.observe($(s)));
gsap.from(".frame", {scale: .9, opacity: 0, duration: 1.4, ease: "power3.out"});

/* ===== 4. THREE.JS SCENE: kalash, petals, particles ===== */
const low = matchMedia("(max-width:700px)").matches || (navigator.hardwareConcurrency || 4) <= 4;
const renderer = new THREE.WebGLRenderer({canvas: $("#scene"), alpha: true, antialias: !low});
renderer.setPixelRatio(Math.min(devicePixelRatio, low ? 1 : 2));
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(55, 1, .1, 100);
cam.position.z = 9;
scene.add(new THREE.AmbientLight(0xffddaa, .6));
const light = new THREE.PointLight(0xffaa33, 2.5, 40); light.position.set(3, 4, 6); scene.add(light);

// Golden kalash (lathe-shaped pot) + lotus petals ring
const gold = new THREE.MeshStandardMaterial({color: 0xf5c451, metalness: .9, roughness: .25});
const kalash = new THREE.Group();
const prof = [[0,0],[.9,.2],[1.3,1],[.8,1.7],[.6,2.1],[.9,2.3]].map(p => new THREE.Vector2(p[0], p[1]));
kalash.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 32), gold));
const coco = new THREE.Mesh(new THREE.SphereGeometry(.75, 24, 24), new THREE.MeshStandardMaterial({color: 0x3c8f3c}));
coco.position.y = 2.9; kalash.add(coco);
for (let i = 0; i < 10; i++) {          // lotus petals around the base
  const p = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.1, 8), new THREE.MeshStandardMaterial({color: 0xff5f8d}));
  const a = i / 10 * Math.PI * 2;
  p.position.set(Math.cos(a) * 1.5, .3, Math.sin(a) * 1.5);
  p.rotation.set(0, 0, Math.cos(a) * -1.1); p.rotation.x = Math.sin(a) * 1.1;
  kalash.add(p);
}
kalash.position.set(0, -1.5, -2); kalash.scale.setScalar(.9);
scene.add(kalash);

// Falling petals + golden particles (fewer on mobile)
function points(n, color, size) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i += 3) { pos[i] = (Math.random() - .5) * 20; pos[i+1] = (Math.random() - .5) * 16; pos[i+2] = (Math.random() - .5) * 10; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const m = new THREE.Points(g, new THREE.PointsMaterial({color, size, transparent: true, opacity: .85}));
  scene.add(m); return m;
}
const petals = points(low ? 50 : 140, 0xff5f8d, .18);
const sparks = points(low ? 80 : 260, 0xffd36b, .07);
function drift(pts, dy, rise) {          // move points up or down and wrap around
  const a = pts.geometry.attributes.position.array;
  for (let i = 1; i < a.length; i += 3) { a[i] += dy * boost; if (rise ? a[i] > 8 : a[i] < -8) a[i] = rise ? -8 : 8; }
  pts.geometry.attributes.position.needsUpdate = true;
}

// Mouse / touch parallax
let mx = 0, my = 0;
addEventListener("pointermove", e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
function resize() { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); }
addEventListener("resize", resize); resize();

(function loop(t) {
  t *= .001;
  kalash.rotation.y = t * .4;
  kalash.position.y = -1.5 + Math.sin(t) * .25;   // gentle float
  drift(petals, -.012, false); drift(sparks, .006, true);
  cam.position.x += (mx * 1.5 - cam.position.x) * .03;
  cam.position.y += (-my * 1 - cam.position.y) * .03;
  cam.lookAt(0, 0, 0);
  renderer.render(scene, cam);
  requestAnimationFrame(loop);
})(0);

/* ===== 5. MUSIC (only starts when user clicks) ===== */
const bgm = $("#bgm");
const musicSources = ["dasarasong.mp3", "dasara.mp3", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"];
let sourceIndex = 0;

bgm.src = musicSources[sourceIndex];
bgm.addEventListener("error", () => {
  sourceIndex += 1;
  if (sourceIndex < musicSources.length) {
    bgm.src = musicSources[sourceIndex];
    bgm.load();
  }
});

$("#play").onclick = () => {
  if (bgm.paused) {
    bgm.play().catch(() => alert("మ్యూజిక్ ఫైల్ లోడ్ కాలేదు. పేజీని రీలోడ్ చేసి మళ్లీ ప్రయత్నించండి."));
  } else {
    bgm.pause();
  }
};
$("#mute").onclick = () => { bgm.muted = !bgm.muted; $("#mute").textContent = bgm.muted ? "🔇" : "🔊"; };
$("#vol").oninput = e => bgm.volume = e.target.value;
bgm.volume = .5;