import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let controlesFijos;
let scene, renderer, controls;
let sol, luzSol;
let planetas = [];
let cinturonesAsteroides = [];
let clock = new THREE.Clock();
let orbitaActiva = true;

let camaraLibre, camaraFija, camaraActiva;

const datosPlanetas = [
  {
    nombre: "Mercurio",
    radio: 0.3,
    distancia: 10,
    textura: "mercurymap.jpg",
    rotacion: 0.02,
    retro: false,
    lunas: [],
  },
  {
    nombre: "Venus",
    radio: 0.6,
    distancia: 15,
    textura: "venusmap.jpg",
    atm: "venusatmospheremap.jpg",
    rotacion: 0.02,
    retro: true,
    lunas: [],
  },
  {
    nombre: "Tierra",
    radio: 0.65,
    distancia: 20,
    textura: "earthmap.jpg",
    atm: "earthatmosphere.jpg",
    rotacion: 0.02,
    retro: false,
    lunas: [
      {
        nombre: "Luna",
        radio: 0.2,
        distanciaOrbita: 1.5,
        textura: "moonmap.png",
        velocidadOrbita: 0.08,
        rotacion: 0.01,
      },
    ],
  },
  {
    nombre: "Marte",
    radio: 0.35,
    distancia: 25,
    textura: "marsmap.jpg",
    rotacion: 0.018,
    retro: false,
    lunas: [
      {
        nombre: "Phobos",
        radio: 0.08,
        distanciaOrbita: 0.8,
        textura: "phobosmap.png",
        velocidadOrbita: 0.1,
        rotacion: 0.05,
      },
      {
        nombre: "Deimos",
        radio: 0.06,
        distanciaOrbita: 1.2,
        textura: "deimosmap.png",
        velocidadOrbita: 0.08,
        rotacion: 0.04,
      },
    ],
  },
  {
    nombre: "Júpiter",
    radio: 1.2,
    distancia: 35,
    textura: "jupitermap.jpg",
    rotacion: 0.04,
    retro: false,
    lunas: [
      {
        nombre: "Ío",
        radio: 0.15,
        distanciaOrbita: 2.0,
        textura: "iomap.jpg",
        velocidadOrbita: 0.05,
        rotacion: 0.02,
      },
      {
        nombre: "Europa",
        radio: 0.12,
        distanciaOrbita: 2.8,
        textura: "europamap.jpg",
        velocidadOrbita: 0.04,
        rotacion: 0.02,
      },
      {
        nombre: "Ganimedes",
        radio: 0.18,
        distanciaOrbita: 3.6,
        textura: "ganymedemap.jpg",
        velocidadOrbita: 0.035,
        rotacion: 0.015,
      },
      {
        nombre: "Calisto",
        radio: 0.16,
        distanciaOrbita: 4.5,
        textura: "callistomap.jpg",
        velocidadOrbita: 0.03,
        rotacion: 0.012,
      },
    ],
  },
  {
    nombre: "Saturno",
    radio: 1.0,
    distancia: 45,
    textura: "saturnmap.jpg",
    rotacion: 0.038,
    retro: false,
    lunas: [
      {
        nombre: "Titán",
        radio: 0.16,
        distanciaOrbita: 3.8,
        textura: "titanmap.jpg",
        velocidadOrbita: 0.028,
        rotacion: 0.012,
      },
      {
        nombre: "Encélado",
        radio: 0.08,
        distanciaOrbita: 2.2,
        textura: "enceladusmap.jpg",
        velocidadOrbita: 0.035,
        rotacion: 0.015,
      },
      {
        nombre: "Rea",
        radio: 0.1,
        distanciaOrbita: 2.9,
        textura: "rheamap.jpg",
        velocidadOrbita: 0.03,
        rotacion: 0.012,
      },
    ],
  },
  {
    nombre: "Urano",
    radio: 0.7,
    distancia: 55,
    textura: "uranusmap.jpg",
    rotacion: 0.03,
    retro: false,
    lunas: [
      {
        nombre: "Titania",
        radio: 0.1,
        distanciaOrbita: 2.5,
        textura: "titaniamap.jpg",
        velocidadOrbita: 0.03,
        rotacion: 0.012,
      },
      {
        nombre: "Oberón",
        radio: 0.09,
        distanciaOrbita: 3.0,
        textura: "oberonmap.jpg",
        velocidadOrbita: 0.028,
        rotacion: 0.01,
      },
    ],
  },
  {
    nombre: "Neptuno",
    radio: 0.65,
    distancia: 65,
    textura: "neptunemap.jpg",
    rotacion: 0.032,
    retro: false,
    lunas: [
      {
        nombre: "Tritón",
        radio: 0.12,
        distanciaOrbita: 2.8,
        textura: "tritonmap.jpg",
        velocidadOrbita: 0.025,
        rotacion: 0.01,
      },
    ],
  },
];

init();
animate();

function init() {
  scene = new THREE.Scene();

  const loader = new THREE.TextureLoader();
  const texturaFondo = loader.load("textures/spacemap.jpg");
  scene.background = texturaFondo;

  texturaFondo.encoding = THREE.sRGBEncoding;
  texturaFondo.minFilter = THREE.LinearFilter;
  texturaFondo.magFilter = THREE.LinearFilter;

  // --- Renderer ---
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById("sceneContainer").appendChild(renderer.domElement);

  // --- Cámaras ---
  camaraLibre = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camaraLibre.position.set(0, 50, 100);

  camaraFija = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camaraFija.position.set(0, 120, 0);

  camaraActiva = camaraLibre;

  // --- Luz y objetos ---
  addLights();
  crearSol();
  crearPlanetas();
  crearCinturonesAsteroides();

  // --- Controles ---
  setupControls();

  // --- Ajuste al cambiar tamaño de ventana ---
  window.addEventListener("resize", onWindowResize);
}

function setupControls() {
  // --- Controles para cámara libre ---
  controls = new FlyControls(camaraLibre, renderer.domElement);
  controls.movementSpeed = 15;
  controls.rollSpeed = Math.PI / 6;
  controls.dragToLook = true;
  controls.autoForward = false;

  // --- Controles para cámara fija ---
  controlesFijos = new OrbitControls(camaraFija, renderer.domElement);
  controlesFijos.enablePan = true;
  controlesFijos.enableZoom = true;
  controlesFijos.enableRotate = true;
  if (sol) controlesFijos.target.copy(sol.position);

  // --- Botón detener órbitas ---
  const botonOrbita = document.getElementById("detenerOrbitaBtn");
  if (botonOrbita) {
    botonOrbita.onclick = () => {
      orbitaActiva = !orbitaActiva;
      botonOrbita.textContent = orbitaActiva
        ? "Detener Órbitas"
        : "Activar Órbitas";
    };
  }

  // --- Botón cambiar cámara ---
  const botonCamara = document.getElementById("cambiarCamaraBtn");
  if (botonCamara) {
    botonCamara.onclick = () => {
      if (camaraActiva === camaraLibre) {
        camaraActiva = camaraFija;
        botonCamara.textContent = "Cámara Libre";
      } else {
        camaraActiva = camaraLibre;
        botonCamara.textContent = "Cámara Fija";
      }
    };
  }
}

function addLights() {
  const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(luzAmbiente);

  luzSol = new THREE.PointLight(0xffee88, 3, 300);
  luzSol.position.set(0, 0, 0);
  luzSol.castShadow = true;
  luzSol.shadow.mapSize.width = 2048;
  luzSol.shadow.mapSize.height = 2048;
  luzSol.shadow.radius = 2;
  scene.add(luzSol);
}

function crearSol() {
  const loader = new THREE.TextureLoader();
  const texturaColor = loader.load("textures/sunmap.jpg");

  sol = new THREE.Mesh(
    new THREE.SphereGeometry(3.0, 64, 64),
    new THREE.MeshPhongMaterial({
      map: texturaColor,
      emissiveMap: texturaColor,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.5,
      shininess: 5,
    })
  );
  sol.position.set(0, 0, 0);
  scene.add(sol);

  agregarEtiqueta(sol, "Sol");
}

function crearPlanetas() {
  const loader = new THREE.TextureLoader();
  const k = 0.05;

  datosPlanetas.forEach((dato) => {
    const materialPlaneta = new THREE.MeshPhongMaterial({
      map: loader.load(`textures/${dato.textura}`),
    });

    if (dato.nombre === "Tierra") {
      materialPlaneta.bumpMap = loader.load("textures/earthbump.jpg");
      materialPlaneta.bumpScale = 0.05;
    }

    const planeta = new THREE.Mesh(
      new THREE.SphereGeometry(dato.radio, 32, 32),
      materialPlaneta
    );

    planeta.castShadow = true;
    planeta.receiveShadow = true;

    // --- Atmósfera ---
    if (dato.atm) {
      const atmGeo = new THREE.SphereGeometry(dato.radio * 1.05, 32, 32);
      const atmMat = new THREE.MeshPhongMaterial({
        map: loader.load(`textures/${dato.atm}`),
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
        shininess: 0,
      });
      const atm = new THREE.Mesh(atmGeo, atmMat);
      planeta.add(atm);
    }

    // --- Anillos ---
    agregarAnillos(planeta, dato);

    // --- Lunas ---
    if (dato.lunas && dato.lunas.length > 0) {
      agregarLunas(planeta, dato.lunas, loader);
    }

    const grupoPlaneta = new THREE.Object3D();
    grupoPlaneta.userData = {
      velocidadOrbita: k / Math.sqrt(dato.distancia),
      velocidadRotacion: dato.rotacion,
      retro: dato.retro || false,
    };

    planeta.position.set(dato.distancia, 0, 0);
    grupoPlaneta.add(planeta);
    scene.add(grupoPlaneta);

    agregarOrbita(planeta, dato.distancia);
    planetas.push(grupoPlaneta);

    agregarEtiqueta(planeta, dato.nombre);
  });
}

function crearCinturonesAsteroides() {
  const loader = new THREE.TextureLoader();
  const textura = loader.load("textures/asteroidmap.jpg");

  const configuracionCinteles = [
    { num: 200, radioMin: 28, radioMax: 32 },
    { num: 300, radioMin: 68, radioMax: 75 },
  ];

  configuracionCinteles.forEach((cinturonConfig) => {
    const asteroides = [];

    for (let i = 0; i < cinturonConfig.num; i++) {
      const r = THREE.MathUtils.lerp(
        cinturonConfig.radioMin,
        cinturonConfig.radioMax,
        Math.random()
      );
      const angulo = Math.random() * 2 * Math.PI;
      const y = (Math.random() - 0.5) * 0.5;

      // Escalar asteroides
      const tamañoAsteroide = 0.01 + Math.random() * 0.02;
      const geo = new THREE.SphereGeometry(tamañoAsteroide, 8, 8);
      const mat = new THREE.MeshPhongMaterial({ map: textura });
      const asteroide = new THREE.Mesh(geo, mat);

      asteroide.position.set(r * Math.cos(angulo), y, r * Math.sin(angulo));
      asteroide.userData = {
        angulo: angulo,
        radio: r,
        velocidadOrbita: (Math.random() * 0.01 + 0.002) * (1 / r),
      };

      scene.add(asteroide);
      asteroides.push(asteroide);
    }

    cinturonesAsteroides.push(asteroides);
  });
}

function agregarAnillos(planeta, dato) {
  const loader = new THREE.TextureLoader();

  if (dato.nombre === "Saturno") {
    const anilloTex = loader.load("textures/saturnringmap.png");
    const anilloGeo = new THREE.RingGeometry(
      dato.radio * 1.3,
      dato.radio * 2.8,
      128
    );
    const anilloMat = new THREE.MeshBasicMaterial({
      map: anilloTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const anillo = new THREE.Mesh(anilloGeo, anilloMat);
    anillo.rotation.x = THREE.MathUtils.degToRad(27);
    planeta.add(anillo);
    return;
  }
  let ringTex, innerRadius, outerRadius;
  if (dato.nombre === "Urano") {
    ringTex = loader.load("textures/uranusringmap.jpg");
    innerRadius = dato.radio * 1.2;
    outerRadius = dato.radio * 2.0;
  } else if (dato.nombre === "Neptuno") {
    ringTex = loader.load("textures/neptuneringmap.png");
    innerRadius = dato.radio * 1.1;
    outerRadius = dato.radio * 1.9;
  } else {
    return;
  }

  const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 128);
  const ringMat = new THREE.MeshPhongMaterial({
    map: ringTex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
    color: 0xffffff,
  });

  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = THREE.MathUtils.degToRad(20);
  planeta.add(ring);
}

function agregarOrbita(planeta, distancia) {
  const curva = new THREE.EllipseCurve(
    0,
    0,
    distancia,
    distancia,
    0,
    2 * Math.PI
  );
  const puntos = curva.getPoints(50).map((p) => new THREE.Vector3(p.x, 0, p.y));
  const geoOrbita = new THREE.BufferGeometry().setFromPoints(puntos);
  const orbita = new THREE.Line(
    geoOrbita,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true,
    })
  );
  scene.add(orbita);
}

function agregarLunas(planeta, lunas = [], loader) {
  if (!lunas.length) return;
  planeta.userData.lunas = [];

  lunas.forEach((datosLuna) => {
    const materialLuna = new THREE.MeshPhongMaterial({
      map: loader.load(`textures/${datosLuna.textura}`),
    });
    const luna = new THREE.Mesh(
      new THREE.SphereGeometry(datosLuna.radio, 16, 16),
      materialLuna
    );

    luna.castShadow = true;
    luna.receiveShadow = true;
    luna.userData = { velocidadRotacion: datosLuna.rotacion };

    const grupoOrbita = new THREE.Object3D();
    grupoOrbita.userData = {
      angulo: Math.random() * Math.PI * 2,
      velocidadOrbita: datosLuna.velocidadOrbita,
      distancia: datosLuna.distanciaOrbita,
      luna: luna,
      inclinacionRad: THREE.MathUtils.degToRad(Math.random() * 60 - 30),
    };

    grupoOrbita.rotation.x = grupoOrbita.userData.inclinacionRad;
    grupoOrbita.rotation.y = THREE.MathUtils.degToRad(Math.random() * 360);

    const curva = new THREE.EllipseCurve(
      0,
      0,
      datosLuna.distanciaOrbita,
      datosLuna.distanciaOrbita,
      0,
      2 * Math.PI
    );
    const puntos = curva
      .getPoints(50)
      .map((p) => new THREE.Vector3(p.x, 0, p.y));
    const geoOrbita = new THREE.BufferGeometry().setFromPoints(puntos);
    const orbita = new THREE.Line(
      geoOrbita,
      new THREE.LineBasicMaterial({
        color: 0xaaaaaa,
        opacity: 0.4,
        transparent: true,
      })
    );
    grupoOrbita.add(orbita);

    luna.position.set(datosLuna.distanciaOrbita, 0, 0);
    grupoOrbita.add(luna);
    planeta.add(grupoOrbita);
    planeta.userData.lunas.push(grupoOrbita);

    agregarEtiqueta(luna, datosLuna.nombre);
  });
}

function agregarEtiqueta(obj, texto) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.textAlign = "center";
  ctx.fillText(texto, canvas.width / 2, canvas.height / 2 + 10);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4, 1, 1);
  obj.add(sprite);
  sprite.position.set(0, obj.geometry.parameters.radius + 0.5, 0);
}

function onWindowResize() {
  camaraLibre.aspect = window.innerWidth / window.innerHeight;
  camaraLibre.updateProjectionMatrix();

  camaraFija.aspect = window.innerWidth / window.innerHeight;
  camaraFija.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (camaraActiva === camaraLibre) {
    controls.update(delta);
  } else {
    controlesFijos.update();
    camaraFija.lookAt(sol.position);
  }

  if (sol) sol.rotation.y += 0.002;

  planetas.forEach((grupoPlaneta) => {
    const planeta = grupoPlaneta.children[0];

    if (orbitaActiva) {
      grupoPlaneta.rotateOnAxis(
        new THREE.Vector3(0, 1, 0),
        grupoPlaneta.userData.velocidadOrbita
      );
    }

    const velRot = grupoPlaneta.userData.velocidadRotacion || 0;
    planeta.rotation.y += grupoPlaneta.userData.retro ? -velRot : velRot;

    if (planeta.userData.lunas) {
      planeta.userData.lunas.forEach((grupoLuna) => {
        grupoLuna.rotateOnAxis(
          new THREE.Vector3(0, 1, 0),
          grupoLuna.userData.velocidadOrbita
        );
        grupoLuna.userData.luna.rotation.y +=
          grupoLuna.userData.luna.userData.velocidadRotacion;
      });
    }
  });

  cinturonesAsteroides.forEach((cinturon) => {
    cinturon.forEach((asteroide) => {
      asteroide.userData.angulo += asteroide.userData.velocidadOrbita;
      asteroide.position.x =
        Math.cos(asteroide.userData.angulo) * asteroide.userData.radio;
      asteroide.position.z =
        Math.sin(asteroide.userData.angulo) * asteroide.userData.radio;
    });
  });

  renderer.render(scene, camaraActiva);
}
