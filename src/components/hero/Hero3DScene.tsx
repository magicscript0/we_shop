'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL Availability check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return;
    } catch {
      return;
    }

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    // 3. Renderer with performance caps (Section 4.6: dpr capped at 1.5)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 4. Geometry & Materials: The Abstract Orbiting Router Rings
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    // Main Orbit Torus (WE Purple #5C2D91)
    const torusGeometry = new THREE.TorusGeometry(2.2, 0.04, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0x5c2d91,
      wireframe: false,
    });
    const mainTorus = new THREE.Mesh(torusGeometry, torusMaterial);
    ringGroup.add(mainTorus);

    // Secondary Inclined Orbit Ring (Electric Neon Accent #B9F03C)
    const secondaryTorusGeometry = new THREE.TorusGeometry(1.9, 0.02, 16, 100);
    const secondaryTorusMaterial = new THREE.MeshBasicMaterial({
      color: 0xb9f03c,
      transparent: true,
      opacity: 0.8,
    });
    const secondaryTorus = new THREE.Mesh(secondaryTorusGeometry, secondaryTorusMaterial);
    secondaryTorus.rotation.x = Math.PI / 3;
    ringGroup.add(secondaryTorus);

    // Outer Third Ring
    const thirdTorusGeometry = new THREE.TorusGeometry(2.5, 0.015, 16, 80);
    const thirdTorusMaterial = new THREE.MeshBasicMaterial({
      color: 0xa98bd6,
      transparent: true,
      opacity: 0.5,
    });
    const thirdTorus = new THREE.Mesh(thirdTorusGeometry, thirdTorusMaterial);
    thirdTorus.rotation.y = Math.PI / 4;
    ringGroup.add(thirdTorus);

    // 5. Purple and Neon Particle Constellation
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const purpleColor = new THREE.Color(0xa98bd6);
    const neonColor = new THREE.Color(0xb9f03c);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.1 + (Math.random() - 0.5) * 0.8;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const isNeon = Math.random() > 0.8;
      const c = isNeon ? neonColor : purpleColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    ringGroup.add(particles);

    // 6. Interactive Pointer Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = x * 0.4;
      targetRotationX = -y * 0.3;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // 7. Render Loop with tab visibility handling
    let animationFrameId: number;
    let isPaused = false;

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isPaused) return;

      // Slow smooth rotation
      ringGroup.rotation.y += 0.005;
      ringGroup.rotation.x += 0.002;
      secondaryTorus.rotation.z += 0.008;

      // Smooth pointer interpolation
      ringGroup.rotation.y += (targetRotationY - ringGroup.rotation.y) * 0.05;
      ringGroup.rotation.x += (targetRotationX - ringGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      torusGeometry.dispose();
      secondaryTorusGeometry.dispose();
      thirdTorusGeometry.dispose();
      particleGeometry.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full min-h-[340px] flex items-center justify-center pointer-events-none select-none"
    />
  );
};
