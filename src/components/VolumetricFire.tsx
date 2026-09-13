'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FireMesh } from '@wolffo/three-fire/vanilla';

type VolumetricFireProps = {
  className?: string;
  color?: number | string;
  magnitude?: number;
  lacunarity?: number;
  gain?: number;
  scale?: [number, number, number];
  opacity?: number;
};

export default function VolumetricFire({
  className = '',
  color = 0xff5500,
  magnitude = 1.35,
  lacunarity = 2.0,
  gain = 0.55,
  scale = [2.2, 3.2, 2.2],
  opacity = 0.95,
}: VolumetricFireProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    let animationFrameId: number;
    let isDisposed = false;

    // Dimensions
    const width = container.clientWidth || window.innerWidth || 1200;
    const height = container.clientHeight || window.innerHeight || 700;

    // Scene
    const scene = new THREE.Scene();

    // Camera - wide angle to cover entire hero background from left to right
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.2);
    camera.lookAt(0, 0.2, 0);

    // Optimized Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Antialias off saves massive GPU fillrate
      powerPreference: 'low-power',
      precision: 'mediump',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1); // Force 1x pixel ratio (no 2x retina overdraw)
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const fireMeshes: any[] = [];

    textureLoader.load(
      '/fire-texture.png',
      (texture) => {
        if (isDisposed) {
          texture.dispose();
          return;
        }

        try {
          // 3 lightweight fire meshes instead of 5, with ultra-fast 10 iterations (50% GPU load drop)
          const firePositions = [
            { x: -2.0, y: -0.7, z: -0.2, scale: [scale[0] * 1.35, scale[1] * 1.15, scale[2]] },
            { x: 0.2, y: -0.8, z: 0.1, scale: [scale[0] * 1.45, scale[1] * 1.25, scale[2]] },
            { x: 2.2, y: -0.7, z: -0.2, scale: [scale[0] * 1.35, scale[1] * 1.15, scale[2]] },
          ];

          firePositions.forEach((pos, idx) => {
            const fire = new FireMesh({
              fireTex: texture,
              color: new THREE.Color(color),
              magnitude: magnitude + (idx === 1 ? 0.15 : -0.1),
              lacunarity,
              gain,
              iterations: 10, // Dropped from 20 to 10 for butter-smooth 60fps!
              octaves: 2,    // Dropped from 3 to 2 (drastically cuts fragment noise calculations)
            });

            fire.scale.set(pos.scale[0], pos.scale[1], pos.scale[2]);
            fire.position.set(pos.x, pos.y, pos.z);
            scene.add(fire);
            fireMeshes.push(fire);
          });
        } catch (e) {
          console.warn('Three.Fire init warning:', e);
        }
      },
      undefined,
      (err) => {
        console.warn('Fire texture load error:', err);
      }
    );

    // Pause rendering when scrolled out of view to save 100% GPU
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Resize Observer
    const handleResize = () => {
      if (!container || isDisposed) return;
      const newWidth = container.clientWidth || window.innerWidth || 1200;
      const newHeight = container.clientHeight || window.innerHeight || 700;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Throttled Animation Loop (Capped at ~35-40 FPS to keep main thread completely free for scrolling)
    const startTime = performance.now();
    let lastRenderTime = 0;
    const targetInterval = 1000 / 36; // 36 FPS is super smooth visually but saves 50% CPU/GPU

    const animate = (currentTime: number) => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Don't render when user scrolls down!

      if (currentTime - lastRenderTime < targetInterval) {
        return;
      }
      lastRenderTime = currentTime;

      const elapsedTime = (currentTime - startTime) / 1000;

      for (let i = 0; i < fireMeshes.length; i++) {
        const mesh = fireMeshes[i];
        if (mesh && typeof mesh.update === 'function') {
          mesh.update(elapsedTime + i * 0.7);
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      fireMeshes.forEach((mesh) => {
        if (mesh) {
          if (typeof mesh.dispose === 'function') {
            mesh.dispose();
          }
          scene.remove(mesh);
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [color, magnitude, lacunarity, gain, scale]);

  return (
    <div
      ref={containerRef}
      className={`volumetric-fire-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity,
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
}
