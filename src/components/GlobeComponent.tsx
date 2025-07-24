'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three'; // Import Three.js secara keseluruhan
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Color,
  Fog,
  Group,
  MeshBasicMaterial,
  Raycaster,
  Vector2,
  Object3D,
  Mesh,
  CanvasTexture, // Import CanvasTexture
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useRouter } from 'next/navigation';

import countries from '../app/files/globe-data-min.json';

// Deklarasi variabel global (tetap sama)
let renderer: WebGLRenderer;
let camera: PerspectiveCamera;
let scene: Scene;
let controls: OrbitControls;
let globeGroup: Group;
let Globe: any;
let raycaster: Raycaster;
let mouse: Vector2;
let isPointerDown = false;
let globeMesh: Object3D | null = null; // Ini tidak akan digunakan untuk klik lagi, tapi tetap untuk kursor hover

// Definisi interface (tetap sama)
interface FeatureProperties {
  ADMIN?: string;
  NAME?: string;
  ISO_A3?: string;
}

interface Feature {
  properties: FeatureProperties;
  geometry: any;
  type: string;
}

// --- Definisikan Bounding Box 2D untuk Pulau-Pulau ---
// Ini adalah nilai placeholder. ANDA HARUS MENGUKUR DAN MENGGANTINYA DENGAN NILAI AKURAT.
// Koordinat dalam Normalized Device Coordinates (NDC)
// X: -1 (kiri) hingga 1 (kanan)
// Y: -1 (bawah) hingga 1 (atas)
// Jika Anda merasa lebih mudah dengan piksel, Anda bisa ubah onMouseMove untuk menyimpan piksel
// dan menggunakan nilai piksel di sini.
const ISLAND_BOUNDS_NDC = {
  // Contoh untuk Layar 1920x1080, globe di tengah. Anda perlu menyesuaikannya!
  // Perkiraan NDC (disesuaikan dengan posisi globe Anda)
  // Untuk mengubah piksel ke NDC: (piksel_X / lebar_layar) * 2 - 1, dan -(piksel_Y / tinggi_layar) * 2 + 1
  Jawa: { xMin: -0.3, xMax: -0.05, yMin: -0.3, yMax: -0.2 },
  Sumatera: { xMin: -0.5, xMax: -0.3, yMin: -0.2, yMax: 0.4 },
  Kalimantan: { xMin: -0.25, xMax: 0, yMin: -0.1, yMax: 0.3 },
  Sulawesi: { xMin: 0, xMax: 0.1, yMin: -0.2, yMax: 0.15 },
  Papua: { xMin: 0.3, xMax: 0.5, yMin: -0.3, yMax: 0.1},
};


export default function GlobeComponent() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ThreeGlobeModule, setThreeGlobeModule] = useState<any>(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const router = useRouter();

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (renderer && renderer.domElement) {
      const rect = renderer.domElement.getBoundingClientRect();
      // Simpan koordinat mouse dalam NDC
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
  }, []);

  // Modifikasi onMouseClick untuk menggunakan bounding box 2D
  const onMouseClick = useCallback((event: MouseEvent) => {
    // Karena kita tidak lagi raycast ke objek 3D untuk logika klik,
    // kita tidak perlu isGlobeReady atau globeMesh di sini untuk redirect.
    // Namun, kita tetap membutuhkan `mouse` yang akurat dari `onMouseMove`.

    console.log("Mouse clicked at NDC:", mouse.x, mouse.y); // Debug: Posisi klik

    let targetIsland = '';

    // Periksa apakah koordinat mouse berada di dalam bounding box pulau
    if (
      mouse.x >= ISLAND_BOUNDS_NDC.Jawa.xMin && mouse.x <= ISLAND_BOUNDS_NDC.Jawa.xMax &&
      mouse.y >= ISLAND_BOUNDS_NDC.Jawa.yMin && mouse.y <= ISLAND_BOUNDS_NDC.Jawa.yMax
    ) {
      targetIsland = 'Jawa';
    } else if (
      mouse.x >= ISLAND_BOUNDS_NDC.Sumatera.xMin && mouse.x <= ISLAND_BOUNDS_NDC.Sumatera.xMax &&
      mouse.y >= ISLAND_BOUNDS_NDC.Sumatera.yMin && mouse.y <= ISLAND_BOUNDS_NDC.Sumatera.yMax
    ) {
      targetIsland = 'Sumatera';
    } else if (
      mouse.x >= ISLAND_BOUNDS_NDC.Kalimantan.xMin && mouse.x <= ISLAND_BOUNDS_NDC.Kalimantan.xMax &&
      mouse.y >= ISLAND_BOUNDS_NDC.Kalimantan.yMin && mouse.y <= ISLAND_BOUNDS_NDC.Kalimantan.yMax
    ) {
      targetIsland = 'Kalimantan';
    } else if (
      mouse.x >= ISLAND_BOUNDS_NDC.Sulawesi.xMin && mouse.x <= ISLAND_BOUNDS_NDC.Sulawesi.xMax &&
      mouse.y >= ISLAND_BOUNDS_NDC.Sulawesi.yMin && mouse.y <= ISLAND_BOUNDS_NDC.Sulawesi.yMax
    ) {
      targetIsland = 'Sulawesi';
    } else if (
      mouse.x >= ISLAND_BOUNDS_NDC.Papua.xMin && mouse.x <= ISLAND_BOUNDS_NDC.Papua.xMax &&
      mouse.y >= ISLAND_BOUNDS_NDC.Papua.yMin && mouse.y <= ISLAND_BOUNDS_NDC.Papua.yMax
    ) {
      targetIsland = 'Papua';
    }

    if (targetIsland) {
      console.log(`Clicked inside bounding box for: ${targetIsland}. Redirecting...`);
      router.push(`/Dashboard/${targetIsland.toLowerCase()}`); // Redirect ke /jawa, /sumatera, dll.
    } else {
      console.log("Clicked outside any defined island bounding box. No redirect.");
      // Opsional: Redirect ke halaman default atau lakukan sesuatu yang lain
      // router.push('/lainnya');
    }

  }, [router, mouse]); // onMouseClick tidak lagi tergantung pada isGlobeReady, tambahkan router dan mouse

  useEffect(() => {
    import('three-globe')
      .then((module) => {
        setThreeGlobeModule(() => module.default);
      })
      .catch((error) => {
        console.error('Failed to load ThreeGlobe module:', error);
      });
  }, []);

  useEffect(() => {
    if (!mountRef.current || !ThreeGlobeModule) {
      console.log('Mount ref or ThreeGlobe module not ready. Aborting useEffect init.');
      return;
    }

    Globe = new ThreeGlobeModule({
      waitForGlobeReady: true,
      animateIn: true,
    });

    Globe.onGlobeReady(() => {
        console.log("ThreeGlobe is ready! Attempting to find globeMesh.");
        Globe.traverse((obj: Object3D) => {
            if (obj instanceof Mesh && obj.name === 'globe') {
                globeMesh = obj;
                console.log("Globe Mesh found and assigned (onGlobeReady):", globeMesh);
            }
        });
        setIsGlobeReady(true);
        // Event listener click sudah ada di init(), tapi saya akan pindahkan ke sini untuk kepastian.
        // Dengan bounding box 2D, onMouseClick tidak lagi butuh globeMesh di dalamnya.
        // Tapi kursor hover/drag tetap butuh globeMesh.
        if (renderer && renderer.domElement) {
             console.log("Attaching initial mouse event listeners.");
             // onMouseClick sudah di attach via useCallback dan dependency-nya tidak berubah
        }
    });

    function init() {
      renderer = new WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current?.appendChild(renderer.domElement);

      scene = new Scene();
      //scene.background = new Color(0x3EAD92); // Warna solid
      // Buat gradient background
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, '#FFFFFF'); // Putih di tengah
        gradient.addColorStop(1, '#3EAD92'); // #3EAD92 di tepi
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        const texture = new CanvasTexture(canvas); // Menggunakan CanvasTexture yang diimpor
        scene.background = texture;
      }

      camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 150);
      scene.add(camera);

      const dLight = new DirectionalLight(0xffffff, 0.8);
      dLight.position.set(-800, 2000, 400);
      camera.add(dLight);

      const dLight1 = new DirectionalLight(0x7982f6, 1);
      dLight1.position.set(-200, 500, 200);
      camera.add(dLight1);

      const dLight2 = new PointLight(0x8566cc, 0.5);
      dLight2.position.set(-200, 500, 200);
      camera.add(dLight2);

      scene.fog = new Fog(0x535ef3, 400, 2000);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableRotate = true;
      controls.autoRotate = false;
      controls.minPolarAngle = Math.PI / 3.5;
      controls.maxPolarAngle = Math.PI - Math.PI / 3;

      raycaster = new Raycaster();
      mouse = new Vector2();

      if (renderer.domElement) {
        renderer.domElement.style.cursor = 'default';

        renderer.domElement.addEventListener('mouseleave', () => {
          renderer.domElement.style.cursor = 'default';
          isPointerDown = false;
          controls.enableRotate = true;
        });

        renderer.domElement.addEventListener('mousedown', () => {
          isPointerDown = true;
        });

        renderer.domElement.addEventListener('mouseup', () => {
          isPointerDown = false;
        });

        renderer.domElement.addEventListener('mousemove', onMouseMove, false);
        // Tambahkan event listener click di sini karena tidak lagi menunggu globeReady
        renderer.domElement.addEventListener('click', onMouseClick, false);
      }

      window.addEventListener('resize', onWindowResize, false);
    }

    function initGlobe() {
      Globe
        .polygonsData(countries.features)
        .polygonAltitude(0.01)
        .polygonCapColor((feature: any) =>
          feature.properties.ISO_A3 === 'IDN' ? 'rgba(60, 179, 113, 1)' : 'rgba(0, 0, 0, 0)'
        )
        .polygonSideColor((feature: any) =>
          feature.properties.ISO_A3 === 'IDN' ? 'rgba(0, 200, 0, 1)' : 'rgba(0, 0, 0, 0)'
        )
        .polygonStrokeColor((feature: any) => feature.properties.ISO_A3 === 'IDN' ? '#ffffff' : 'green') // Ubah warna garis di sini
        .showAtmosphere(false)
        .atmosphereColor('#3a228a')
        .atmosphereAltitude(0.25)
        .showGraticules(false);

      const globeMaterial = Globe.globeMaterial() as MeshBasicMaterial & {
        color: Color;
        emissive: Color;
        emissiveIntensity: number;
        shininess: boolean;
        wireframe: boolean;
        transparent: boolean;
        opacity: number;
      };

      globeMaterial.color = new Color(0xFDFAE8);
      globeMaterial.emissive = new Color(0xFDFAE8);
      globeMaterial.emissiveIntensity = 0.1;
      // globeMaterial.shininess = 0.9; // Removed: MeshBasicMaterial does not have 'shininess'
      globeMaterial.wireframe = true;
      globeMaterial.needsUpdate = true;

      globeGroup = new Group();
      globeGroup.add(Globe);
      scene.add(globeGroup);

      const lng = 118.8;
      const lat = -1.5;

      globeGroup.rotation.y = -lng * (Math.PI / 180);
      globeGroup.rotation.x = lat * (Math.PI / 180);
    }

    function onWindowResize() {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }

    function animate() {
      controls.update();

      // Logika raycasting untuk kursor dan kontrol rotasi tetap membutuhkan globeMesh
      // Karena kita ingin kursor dan drag hanya aktif di atas globe, bukan di seluruh kanvas
      if (isGlobeReady && raycaster && mouse && globeMesh) {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([globeMesh]); // Raycast ke globeMesh untuk hover/drag

        if (intersects.length > 0) {
          controls.enableRotate = true;
          if (isPointerDown) {
            renderer.domElement.style.cursor = 'grabbing';
          } else {
            renderer.domElement.style.cursor = 'grab';
          }
        } else {
          controls.enableRotate = false;
          if (!isPointerDown) {
            renderer.domElement.style.cursor = 'default';
          }
        }
      } else {
        if (renderer.domElement && !isPointerDown) {
             renderer.domElement.style.cursor = 'default';
        }
        controls.enableRotate = false;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    init();
    initGlobe();
    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize, false);
      if (renderer) {
        renderer.domElement.removeEventListener('mousemove', onMouseMove, false);
        renderer.domElement.removeEventListener('click', onMouseClick, false); // Hapus listener click
        renderer.domElement.removeEventListener('mouseleave', () => { /* no-op */ });
        renderer.domElement.removeEventListener('mousedown', () => { /* no-op */ });
        renderer.domElement.removeEventListener('mouseup', () => { /* no-op */ });
        renderer.dispose();
      }
      if (mountRef.current && renderer?.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [ThreeGlobeModule, router, isGlobeReady, onMouseMove, onMouseClick]); // Tambahkan callbacks ke dependency array

  return <div ref={mountRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
}