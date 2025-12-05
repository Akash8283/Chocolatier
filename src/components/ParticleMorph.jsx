import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ParticleMorph() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    let scene, camera, renderer, particles;
    const count = 12000;
    let animationId = null;

    const spherePositions = new Float32Array(count * 3);
    const spreadPositions = new Float32Array(count * 3);

    init();

    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 25;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      generatePositions();
      createParticles();
      setupScrollTrigger();
      animate();
      window.addEventListener("resize", onResize);
    }

    function generatePositions() {
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;

        spherePositions[i * 3] = 8 * Math.cos(theta) * Math.sin(phi);
        spherePositions[i * 3 + 1] = 8 * Math.sin(theta) * Math.sin(phi);
        spherePositions[i * 3 + 2] = 8 * Math.cos(phi);
      }

      const spreadRadius = 30;
      const depth = 25;
      const aspect = window.innerWidth / window.innerHeight;

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = spreadRadius * (0.2 + Math.random() * 0.8);
        const edgeFactor = Math.random() < 0.3 ? 1.3 : 1;

        spreadPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * edgeFactor * aspect;
        spreadPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * edgeFactor;
        spreadPositions[i * 3 + 2] = (r * Math.cos(phi) + (Math.random() - 0.5) * depth) * 0.8;
      }
    }

    function createParticles() {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(spherePositions);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const color = new THREE.Color();
        const hue = 0.12 + (Math.random() * 0.04);
        const saturation = 0.8 + (Math.random() * 0.2);
        const lightness = 0.4 + (Math.random() * 0.4);
        color.setHSL(hue, saturation, lightness);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        map: getCircleTexture(),
        depthWrite: false,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    }

    function getCircleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;

      const context = canvas.getContext('2d');
      const center = 16;
      const radius = 16;

      const gradient = context.createRadialGradient(center, center, 0, center, center, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    function updateParticles(progress) {
      const pos = particles.geometry.attributes.position.array;

      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      for (let i = 0; i < count * 3; i++) {
        pos[i] = spherePositions[i] + (spreadPositions[i] - spherePositions[i]) * ease;
      }

      particles.geometry.attributes.position.needsUpdate = true;

      particles.userData.progress = ease;
    }

    function setupScrollTrigger() {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=250%",
        pin: true,
        pinSpacing: true,
        scrub: 1.5,
        id: "particle-morph",
        onUpdate: (self) => {
          updateParticles(self.progress);
        },
      });
    }

    function animate() {
      animationId = requestAnimationFrame(animate);

      if (particles) {
        const progress = particles.userData.progress || 0;

        const sphereRotY = 0.002;
        const spreadRotY = 0.0015;
        const spreadRotX = 0.0008;
        const spreadRotZ = 0.0003;

        particles.rotation.y += sphereRotY * (1 - progress) + spreadRotY * progress;
        particles.rotation.x += spreadRotX * progress;
        particles.rotation.z += spreadRotZ * progress;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars && trigger.vars.id === "particle-morph") {
          trigger.kill();
        }
      });
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      id="particle-container"
      style={{ position: 'relative', zIndex: 0 }}
    />
  );
}
