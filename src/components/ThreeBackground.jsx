import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 5, 18);

    // WebGL Renderer with alpha transparency enabled for blending
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x3d5ee1, 2.5);
    dirLight.position.set(15, 25, 10);
    scene.add(dirLight);

    // Warning warning glowing lights on top of skeletons (red and green beacons)
    const glowLightRed = new THREE.PointLight(0xef4444, 2.5, 10);
    glowLightRed.position.set(-4, 7.1, -3);
    scene.add(glowLightRed);

    const glowLightGreen = new THREE.PointLight(0x10b981, 2.5, 10);
    glowLightGreen.position.set(4, 9.1, -5);
    scene.add(glowLightGreen);

    // Blueprint Grid Floor
    const gridHelper = new THREE.GridHelper(60, 30, 0x3d5ee1, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Reflective semi-transparent dark ground
    const groundGeom = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.25,
      metalness: 0.95,
      transparent: true,
      opacity: 0.85
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    scene.add(ground);

    // Building Skeletons Generator
    const buildSkeletons = [];
    const createStructure = (x, z, w, h, d, floors) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Structural wireframe outer shell
      const boxGeom = new THREE.BoxGeometry(w, h, d, 2, floors, 2);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x3d5ee1,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      });
      const wireframe = new THREE.Mesh(boxGeom, wireMat);
      wireframe.position.y = h / 2;
      group.add(wireframe);

      // Floor slabs
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.6,
        transparent: true,
        opacity: 0.65
      });
      for (let i = 0; i <= floors; i++) {
        const slabHeight = (h / floors) * i;
        const slabGeom = new THREE.BoxGeometry(w - 0.04, 0.08, d - 0.04);
        const slab = new THREE.Mesh(slabGeom, slabMat);
        slab.position.y = slabHeight;
        group.add(slab);
      }

      // Vertical steel columns
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.4 });
      const pillarPositions = [
        [-w/2, -d/2], [w/2, -d/2], [-w/2, d/2], [w/2, d/2],
        [0, -d/2], [0, d/2], [-w/2, 0], [w/2, 0]
      ];
      pillarPositions.forEach(([px, pz]) => {
        const pillarGeom = new THREE.CylinderGeometry(0.06, 0.06, h, 4);
        const pillar = new THREE.Mesh(pillarGeom, pillarMat);
        pillar.position.set(px, h / 2, pz);
        group.add(pillar);
      });

      scene.add(group);
      buildSkeletons.push(group);
    };

    // Generate low-poly wireframe structures
    createStructure(-4, -3, 3.2, 7, 3.2, 4);
    createStructure(4, -5, 4.2, 9, 3.2, 5);
    createStructure(0, -9, 5.2, 5, 4.2, 3);

    // Cranes Generator
    const cranes = [];
    const createCrane = (x, z, height, armLength, swingSpeed) => {
      const craneGroup = new THREE.Group();
      craneGroup.position.set(x, 0, z);

      // Mast
      const mastGeom = new THREE.BoxGeometry(0.25, height, 0.25, 1, 6, 1);
      const mastMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        wireframe: true,
        metalness: 0.9,
        roughness: 0.3
      });
      const mast = new THREE.Mesh(mastGeom, mastMat);
      mast.position.y = height / 2;
      craneGroup.add(mast);

      // Rotating Jib Assembly Group
      const rotatingGroup = new THREE.Group();
      rotatingGroup.position.y = height;

      // Operator Cab
      const cabGeom = new THREE.BoxGeometry(0.4, 0.4, 0.5);
      const cabMat = new THREE.MeshStandardMaterial({ color: 0x3d5ee1, roughness: 0.2 });
      const cab = new THREE.Mesh(cabGeom, cabMat);
      cab.position.set(0, 0.2, 0.15);
      rotatingGroup.add(cab);

      // Jib horizontal boom arm
      const jibGeom = new THREE.BoxGeometry(0.12, 0.12, armLength, 1, 1, 8);
      const jibMat = new THREE.MeshStandardMaterial({ color: 0x475569, wireframe: true });
      const jib = new THREE.Mesh(jibGeom, jibMat);
      jib.position.z = armLength / 4;
      rotatingGroup.add(jib);

      // Counter Weight block
      const weightGeom = new THREE.BoxGeometry(0.35, 0.25, 0.45);
      const weightMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
      const weight = new THREE.Mesh(weightGeom, weightMat);
      weight.position.set(0, 0.1, -armLength / 4);
      rotatingGroup.add(weight);

      // Hook Hoist Line
      const hookPos = armLength / 2;
      const hookLinePoints = [
        new THREE.Vector3(0, 0, hookPos),
        new THREE.Vector3(0, -height * 0.45, hookPos)
      ];
      const hookLineGeom = new THREE.BufferGeometry().setFromPoints(hookLinePoints);
      const hookLineMat = new THREE.LineBasicMaterial({ color: 0x3d5ee1 });
      const hookLine = new THREE.Line(hookLineGeom, hookLineMat);
      rotatingGroup.add(hookLine);

      // Hook block
      const hookBlockGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 5);
      const hookBlock = new THREE.Mesh(hookBlockGeom, cabMat);
      hookBlock.position.set(0, -height * 0.45, hookPos);
      rotatingGroup.add(hookBlock);

      craneGroup.add(rotatingGroup);
      scene.add(craneGroup);

      cranes.push({
        group: craneGroup,
        rotator: rotatingGroup,
        speed: swingSpeed,
        angle: Math.random() * Math.PI * 2
      });
    };

    // Create 2 functional cranes
    createCrane(-5.5, -4.5, 8, 8.5, 0.002);
    createCrane(5.5, -6.5, 10, 10.5, -0.0015);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // 1. Slow, continuous crane swinging (back and forth using sine)
      cranes.forEach(crane => {
        crane.angle += crane.speed;
        crane.rotator.rotation.y = Math.sin(crane.angle) * 0.75;
      });

      // 2. Slow Camera Drift/Orbit (Subtle Parallax)
      const orbitSpeed = 0.025;
      const radius = 17.5;
      camera.position.x = Math.sin(elapsed * orbitSpeed) * radius;
      camera.position.z = Math.cos(elapsed * orbitSpeed) * radius;
      camera.position.y = 5.2 + Math.sin(elapsed * 0.04) * 1.3;
      
      camera.lookAt(0, 3.6, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      // Clean up WebGL resources
      scene.traverse(obj => {
        if (!obj.isMesh) return;
        obj.geometry.dispose();
        if (obj.material.isMaterial) {
          obj.material.dispose();
        } else {
          for (const mat of obj.material) mat.dispose();
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="admin-login-canvas-container" 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ThreeBackground;
