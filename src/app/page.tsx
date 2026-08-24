"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Mission = { title: string; detail: string; reward: number };
const missions: Mission[] = [
  { title: "Dead Drop", detail: "Pick up the package at the marina.", reward: 480 },
  { title: "Night Shift", detail: "Bring the ride to the safehouse.", reward: 720 },
  { title: "Clean Getaway", detail: "Lose the heat before sunrise.", reward: 1100 },
];

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [inCar, setInCar] = useState(false);
  const [cash, setCash] = useState(2450);
  const [health, setHealth] = useState(86);
  const [wanted, setWanted] = useState(2);
  const [missionIndex, setMissionIndex] = useState(0);
  const [message, setMessage] = useState("WASD to move · E to enter the car");
  const [soundOn, setSoundOn] = useState(true);
  const [saved, setSaved] = useState(false);
  const mission = missions[missionIndex];
  const stars = useMemo(() => "★".repeat(wanted) + "☆".repeat(5 - wanted), [wanted]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x070a10, 28, 105);
    const camera = new THREE.PerspectiveCamera(52, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(11, 13, 16);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0x6b78a6, 0x10141d, 1.7));
    const moon = new THREE.DirectionalLight(0xa8b5ff, 2.4);
    moon.position.set(-20, 30, 15); moon.castShadow = true; scene.add(moon);
    const neon = new THREE.PointLight(0xff704f, 18, 28); neon.position.set(4, 5, -5); scene.add(neon);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(130, 130), new THREE.MeshStandardMaterial({ color: 0x10151d, roughness: 0.96 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    const water = new THREE.Mesh(new THREE.PlaneGeometry(30, 130), new THREE.MeshStandardMaterial({ color: 0x102a35, metalness: .2, roughness: .35 }));
    water.rotation.x = -Math.PI / 2; water.position.set(-50, .02, 0); scene.add(water);

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x080b10, roughness: .8 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xd6a85f });
    const addRoad = (x: number, z: number, w: number, d: number) => {
      const road = new THREE.Mesh(new THREE.BoxGeometry(w, .12, d), roadMat); road.position.set(x, .05, z); road.receiveShadow = true; scene.add(road);
      for (let i = -Math.floor(w / 8); i < Math.floor(w / 8); i += 2) { const line = new THREE.Mesh(new THREE.BoxGeometry(.12, .13, d * .74), lineMat); line.position.set(x + i * 8, .12, z); scene.add(line); }
    };
    addRoad(0, 0, 118, 8); addRoad(0, -30, 118, 6); addRoad(-20, 0, 6, 120); addRoad(27, 0, 7, 120);

    const buildingMats = [0x1b2633, 0x202838, 0x2b2630, 0x182d32].map((color) => new THREE.MeshStandardMaterial({ color, roughness: .75 }));
    const buildings: THREE.Mesh[] = [];
    for (let x = -46; x <= 46; x += 9) for (let z = -48; z <= 48; z += 10) {
      if (Math.abs(x) < 7 || Math.abs(x - 27) < 7 || Math.abs(z) < 6 || Math.abs(z + 30) < 5) continue;
      const h = 3 + ((Math.abs(x * 7 + z * 3) % 11) / 11) * 10;
      const building = new THREE.Mesh(new THREE.BoxGeometry(6.2, h, 7), buildingMats[Math.abs(x + z) % buildingMats.length]);
      building.position.set(x, h / 2, z); building.castShadow = true; building.receiveShadow = true; scene.add(building); buildings.push(building);
      const windowMat = new THREE.MeshBasicMaterial({ color: Math.abs(x + z) % 3 === 0 ? 0xffbd67 : 0x3b6682 });
      for (let y = 2; y < h - 1; y += 2.2) { const window = new THREE.Mesh(new THREE.BoxGeometry(4.4, .13, .04), windowMat); window.position.set(x, y, z - 3.52); scene.add(window); }
    }

    const car = new THREE.Group();
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, .62, 4.4), new THREE.MeshStandardMaterial({ color: 0xd7563e, metalness: .65, roughness: .3 }));
    carBody.position.y = .72; carBody.castShadow = true; car.add(carBody);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, .52, 2), new THREE.MeshStandardMaterial({ color: 0x111923, metalness: .4, roughness: .18 })); cabin.position.set(0, 1.18, -.15); cabin.castShadow = true; car.add(cabin);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x090a0d, roughness: .9 });
    for (const x of [-1.1, 1.1]) for (const z of [-1.45, 1.45]) { const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .22, 16), wheelMat); wheel.rotation.z = Math.PI / 2; wheel.position.set(x, .43, z); car.add(wheel); }
    const driver = new THREE.Group();
    const driverBody = new THREE.Mesh(new THREE.CapsuleGeometry(.27, .48, 4, 8), new THREE.MeshStandardMaterial({ color: 0xc8fa73 })); driverBody.position.y = 1.06; driverBody.castShadow = true; driver.add(driverBody);
    const driverHead = new THREE.Mesh(new THREE.SphereGeometry(.21, 12, 8), new THREE.MeshStandardMaterial({ color: 0xd9a477 })); driverHead.position.y = 1.65; driverHead.castShadow = true; driver.add(driverHead);
    driver.position.set(0, 0, -.15); car.add(driver);
    car.position.set(2, 0, 2); scene.add(car);

    const addPedestrian = (x: number, z: number, color: number) => {
      const pedestrian = new THREE.Group();
      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.22, .5, 4, 8), new THREE.MeshStandardMaterial({ color })); torso.position.y = .72; torso.castShadow = true; pedestrian.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(.17, 12, 8), new THREE.MeshStandardMaterial({ color: 0xd9a477 })); head.position.y = 1.35; head.castShadow = true; pedestrian.add(head);
      const marker = new THREE.Mesh(new THREE.RingGeometry(.3, .34, 20), new THREE.MeshBasicMaterial({ color: 0xff845b, side: THREE.DoubleSide })); marker.rotation.x = -Math.PI / 2; marker.position.y = .03; pedestrian.add(marker);
      pedestrian.position.set(x, 0, z); scene.add(pedestrian); return pedestrian;
    };
    addPedestrian(-5, -3, 0xff845b); addPedestrian(16, -3, 0x7ad8ff); addPedestrian(-12, 14, 0xd6a85f); addPedestrian(30, 5, 0xb68cff);

    const player = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(.42, .9, 5, 10), new THREE.MeshStandardMaterial({ color: 0xc8fa73 })); body.position.y = 1; body.castShadow = true; player.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 8), new THREE.MeshStandardMaterial({ color: 0xd9a477 })); head.position.y = 1.78; head.castShadow = true; player.add(head);
    const ring = new THREE.Mesh(new THREE.RingGeometry(.7, .76, 32), new THREE.MeshBasicMaterial({ color: 0xc8fa73, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = .04; player.add(ring); player.position.set(2, 0, 7); scene.add(player);

    const keys = new Set<string>();
    const down = (event: KeyboardEvent) => { keys.add(event.key.toLowerCase()); if (["w", "a", "s", "d", "e", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) event.preventDefault(); };
    const up = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate); const delta = Math.min(clock.getDelta(), .05); const speed = inCar ? 11 : 5;
      const dx = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
      const dz = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);
      const actor = inCar ? car : player;
      if (dx || dz) { const length = Math.hypot(dx, dz); actor.position.x += dx / length * speed * delta; actor.position.z += dz / length * speed * delta; actor.rotation.y = Math.atan2(dx, dz); }
      actor.position.x = THREE.MathUtils.clamp(actor.position.x, -53, 53); actor.position.z = THREE.MathUtils.clamp(actor.position.z, -53, 53);
      if (inCar) player.position.lerp(car.position, .18);
      const target = new THREE.Vector3(actor.position.x, 0, actor.position.z);
      camera.position.lerp(new THREE.Vector3(target.x + 11, 13, target.z + 16), .065); camera.lookAt(target);
      ring.rotation.z += delta * 1.6; renderer.render(scene, camera);
    };
    animate();
    const resize = () => { if (!mount) return; camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight); };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("resize", resize); renderer.dispose(); mount.removeChild(renderer.domElement); };
  }, [inCar]);

  const toggleCar = () => { setInCar((value) => !value); setMessage(inCar ? "On foot · the streets are watching" : "Vehicle acquired · drive carefully"); };
  const completeMission = () => { setCash((value) => value + mission.reward); setWanted((value) => Math.max(0, value - 1)); setMissionIndex((value) => (value + 1) % missions.length); setMessage(`Mission complete · +$${mission.reward.toLocaleString()}`); };
  const saveGame = () => { localStorage.setItem("neon-coast-3d-save", JSON.stringify({ cash, health, missionIndex })); setSaved(true); setMessage("Progress saved locally"); window.setTimeout(() => setSaved(false), 1400); };

  return <main className="game-shell three-d-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">NC</span><div><p className="eyebrow">NEON COAST</p><h1>AFTER HOURS / 3D</h1></div></div><div className="top-actions"><span className="online-dot" /><span className="muted">LIVE BUILD</span><button className="icon-button" onClick={() => setSoundOn((value) => !value)} aria-label="Toggle sound">{soundOn ? "◖" : "◌"}</button><button className="save-button" onClick={saveGame}>{saved ? "SAVED" : "SAVE GAME"}</button></div></header>
    <section className="three-d-layout"><div className="scene-card"><div className="scene-label"><span className="live-pill"><i /> 3D CITY VIEW</span><span className="map-coords">NIGHT MODE / 04:27 AM</span></div><div className="scene-mount" ref={mountRef} aria-label="Playable 3D city scene" /><div className="scene-toast">{message}</div><div className="scene-controls"><span><kbd>WASD</kbd> MOVE</span><button onClick={toggleCar}><kbd>E</kbd> {inCar ? "EXIT VEHICLE" : "ENTER VEHICLE"}</button><span><kbd>DRAG</kbd> CAMERA READY</span><button onClick={() => { if (cash >= 150) { setCash((value) => value - 150); setHealth((value) => Math.min(100, value + 20)); setMessage("Medkit purchased · health restored"); } else setMessage("Not enough cash for a medkit"); }}><kbd>B</kbd> MEDKIT</button></div></div>
      <aside className="side-panel"><div className="profile-card"><div className="avatar">JC</div><div><span className="eyebrow">PLAYER ONE</span><h2>JAX CARTER</h2><p className="muted">Level 04 · Street Runner</p></div><span className="status-chip">3D ACTIVE</span></div><div className="stat-row"><div><span className="label">CASH</span><strong>${cash.toLocaleString()}</strong></div><div><span className="label">HEALTH</span><strong>{health}<small>%</small></strong></div><div><span className="label">HEAT</span><strong className="stars">{stars}</strong></div></div><div className="health-bar"><span style={{ width: `${health}%` }} /></div><div className="mission-card"><div className="card-heading"><span className="eyebrow accent">CURRENT OBJECTIVE</span><span className="live-pill subtle"><i /> LIVE</span></div><h2>{mission.title}</h2><p>{mission.detail}</p><div className="mission-meta"><span className="reward">+$ {mission.reward.toLocaleString()}</span><span>MAIN STORY · {missionIndex + 1}/3</span></div><button className="primary-button" onClick={completeMission}>COMPLETE OBJECTIVE <span>→</span></button></div><div className="intel-card"><div className="card-heading"><span className="eyebrow">STREET INTEL</span><span className="live-pill subtle"><i /> LIVE</span></div><p>Explore the rendered city grid. Neon markers and landmarks are your navigation anchors.</p><div className="progress-line"><span /><span /><span /><span /><span /></div><div className="intel-foot"><span>THREAT LEVEL</span><b>LOW</b></div></div></aside></section><footer className="footer-note"><span>NEON COAST // 3D VERTICAL SLICE</span><span>V 0.2.0 · THREE.JS RENDERER</span></footer>
  </main>;
}
