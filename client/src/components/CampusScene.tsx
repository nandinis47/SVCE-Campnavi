/**
 * CampusScene — Interactive 3D campus navigation
 * Design: Satellite Explorer
 * Drone image as textured ground plane with 3D markers
 */
import { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CAMPUS_LOCATIONS,
  CATEGORY_COLORS,
  type CampusLocation,
} from "@/lib/campusData";
import { ROUTE_NODES } from "@/lib/routeGraph";
import gsap from "gsap";

export interface RoutePath {
  nodeIds: string[];
}

interface CampusSceneProps {
  onMarkerClick: (location: CampusLocation) => void;
  onHover: (location: CampusLocation | null) => void;
  flyToLocation: CampusLocation | null;
  routePath: RoutePath | null;
  currentLocationNodeId: string | null;
}

export default function CampusScene({
  onMarkerClick,
  onHover,
  flyToLocation,
  routePath,
  currentLocationNodeId,
}: CampusSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const markersRef = useRef<Map<string, THREE.Group>>(new Map());
  const routeLineRef = useRef<THREE.Group | null>(null);
  const currentLocationRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const hoveredRef = useRef<CampusLocation | null>(null);
  const animFrameRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);

  // Load drone image texture
  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 80, 180);
    sceneRef.current = scene;

    // Camera — angled isometric-like view
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
    camera.position.set(0, 45, 45);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 15;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2.1; // Don't go below ground
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Ground plane (drone image)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/1000087507_1e3231b3.jpg",
      (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.colorSpace = THREE.SRGBColorSpace;

        // Image is 1536x1136 — maintain aspect ratio
        const imgAspect = 1536 / 1136;
        const groundWidth = 50;
        const groundHeight = groundWidth / imgAspect;

        const geometry = new THREE.PlaneGeometry(groundWidth, groundHeight);
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.05,
        });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        ground.name = "ground";
        ground.userData.dimensions = { width: groundWidth, height: groundHeight };
        scene.add(ground);

        // Add subtle grid overlay
        const gridHelper = new THREE.GridHelper(
          Math.max(groundWidth, groundHeight) * 1.2,
          40,
          0x333355,
          0x222244
        );
        gridHelper.position.y = 0.05;
        gridHelper.material.opacity = 0.15;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);

        setLoaded(true);
      },
      undefined,
      (error) => {
        console.error("Failed to load drone texture:", error);
      }
    );

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    dirLight.position.set(20, 30, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-15, 10, -10);
    scene.add(fillLight);

    // Hemisphere light for natural sky/ground color
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x444422, 0.4);
    scene.add(hemiLight);

    // Animation loop
    const startTime = performance.now();
    function animate() {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      controls.update();

      // Animate markers (bobbing effect)
      markersRef.current.forEach((group, id) => {
        const pin = group.getObjectByName("pin") as THREE.Object3D | null;
        const ring = group.getObjectByName("ring") as THREE.Mesh | null;
        const glow = group.getObjectByName("glow") as THREE.Mesh | null;
        if (pin) {
          pin.position.y = Math.sin(elapsed * 2 + parseFloat(id) * 0.5) * 0.3 + 3;
        }
        if (glow) {
          glow.position.y = Math.sin(elapsed * 2 + parseFloat(id) * 0.5) * 0.3 + 3;
          glow.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.1);
          (glow.material as THREE.MeshBasicMaterial).opacity =
            0.12 + Math.sin(elapsed * 3) * 0.08;
        }
        if (ring) {
          const scale = 1 + Math.sin(elapsed * 2) * 0.2;
          ring.scale.set(scale, scale, scale);
          (ring.material as THREE.MeshBasicMaterial).opacity =
            0.4 + Math.sin(elapsed * 2) * 0.2;
        }
      });
      const pulse = currentLocationRef.current?.getObjectByName("current-location-pulse");
      if (pulse) {
        const scale = 1 + (Math.sin(elapsed * 3) + 1) * 0.08;
        pulse.scale.setScalar(scale);
      }

      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  // Create 3D markers for each location
  const createMarkers = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Get ground dimensions to map normalized coords to 3D space
    const ground = scene.getObjectByName("ground") as THREE.Mesh | null;
    if (!ground) return;

    const dims = ground.userData.dimensions || {};
    const width = dims.width || 50;
    const height = dims.height || 50;

    // Reference-matched Sports Ground gate. It remains at the exact former
    // marker coordinate and spans the road laterally without changing the map.
    const sportsGateX = (0.28 - 0.5) * width;
    const sportsGateZ = (0.44 - 0.5) * height;
    const gateGroup = new THREE.Group();
    gateGroup.name = "sports-ground-gate-structure";
    gateGroup.position.set(sportsGateX, 0, sportsGateZ);
    gateGroup.scale.setScalar(0.25);

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xd7d4cc,
      roughness: 0.88,
      metalness: 0.02,
    });
    const stoneCapMat = new THREE.MeshStandardMaterial({
      color: 0xbdbab2,
      roughness: 0.8,
      metalness: 0.04,
    });
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x101216,
      roughness: 0.3,
      metalness: 0.86,
    });
    const ironHighlightMat = new THREE.MeshStandardMaterial({
      color: 0x34383d,
      roughness: 0.24,
      metalness: 0.92,
    });

    const addGateMesh = (
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      position: THREE.Vector3,
      castShadow = true
    ) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      gateGroup.add(mesh);
      return mesh;
    };

    // White stone posts and cap blocks from the supplied reference.
    [-2.35, 2.35].forEach((pillarX) => {
      addGateMesh(new THREE.BoxGeometry(1.1, 3.9, 1.15), stoneMat, new THREE.Vector3(pillarX, 1.95, 0));
      addGateMesh(new THREE.BoxGeometry(1.28, 0.42, 1.34), stoneCapMat, new THREE.Vector3(pillarX, 4.12, 0));
    });

    // A bowed wrought-iron arch follows the reference silhouette.
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.02, 3.16, 0.68),
      new THREE.Vector3(-1.35, 3.55, 0.68),
      new THREE.Vector3(0, 4.32, 0.68),
      new THREE.Vector3(1.35, 3.55, 0.68),
      new THREE.Vector3(2.02, 3.16, 0.68),
    ]);
    addGateMesh(new THREE.TubeGeometry(archCurve, 32, 0.09, 10, false), ironHighlightMat, new THREE.Vector3(0, 0, 0));

    // Double gate leaves with dense vertical bars, pointed finials, and rails.
    [-1.17, 1.17].forEach((leafCenterX) => {
      const barOffsets = [-0.92, -0.69, -0.46, -0.23, 0, 0.23, 0.46, 0.69, 0.92];
      barOffsets.forEach((offset) => {
        const localX = leafCenterX + offset;
        const normalized = Math.min(Math.abs(localX) / 2.15, 1);
        const topY = 3.03 + 0.92 * (1 - normalized * normalized);
        const barHeight = topY - 0.42;
        addGateMesh(new THREE.CylinderGeometry(0.045, 0.065, barHeight, 8), ironMat, new THREE.Vector3(localX, 0.42 + barHeight / 2, 0.7));
        addGateMesh(new THREE.ConeGeometry(0.11, 0.28, 8), ironHighlightMat, new THREE.Vector3(localX, topY + 0.13, 0.7));
      });

      [0.62, 1.48, 2.35].forEach((railY) => {
        addGateMesh(new THREE.BoxGeometry(2.05, 0.095, 0.12), ironHighlightMat, new THREE.Vector3(leafCenterX, railY, 0.72));
      });

      // Subtle lower frame gives each leaf a manufactured, hinged construction.
      addGateMesh(new THREE.BoxGeometry(2.08, 0.16, 0.16), ironMat, new THREE.Vector3(leafCenterX, 0.38, 0.72));
      addGateMesh(new THREE.BoxGeometry(0.13, 2.75, 0.18), ironMat, new THREE.Vector3(leafCenterX - 1.0, 1.7, 0.74));
    });

    // Center seam, hinges, and latch complete the double-leaf gate detail.
    addGateMesh(new THREE.BoxGeometry(0.12, 2.85, 0.18), ironHighlightMat, new THREE.Vector3(0, 1.75, 0.78));
    [-2.0, 2.0].forEach((hingeX) => {
      addGateMesh(new THREE.CylinderGeometry(0.105, 0.105, 0.4, 12), ironHighlightMat, new THREE.Vector3(hingeX, 1.55, 0.9));
    });
    addGateMesh(new THREE.BoxGeometry(0.18, 0.42, 0.22), ironHighlightMat, new THREE.Vector3(0, 1.5, 0.93));

    scene.add(gateGroup);

    CAMPUS_LOCATIONS.forEach((loc, idx) => {
      const group = new THREE.Group();
      group.name = loc.id;
      group.userData = { location: loc };
      // Keep the 2nd Gate symbol visibly on top of the co-located hostel entrance marker.
      const isSecondGate = loc.id === "second-gate";

      // Map normalized coords to 3D world position
      // Image: x=0 left, x=1 right; y=0 top, y=1 bottom
      // 3D: x=center=0, z=center=0 (y=up)
      // Image top (y=0) = back (negative Z), image bottom (y=1) = front (positive Z)
      const worldX = (loc.x - 0.5) * width;
      const worldZ = (loc.y - 0.5) * height; // image y maps directly to Z

      group.position.set(worldX, 0, worldZ);

      // Pin pole - thicker and taller for visibility
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 3, 12);
      const color = new THREE.Color(CATEGORY_COLORS[loc.category]);
      const poleMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.2,
        metalness: 0.7,
        emissive: color,
        emissiveIntensity: 0.15,
      });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 1.5;
      pole.castShadow = true;
      group.add(pole);

      // Pin head (sphere) - larger and more visible
      const headGeo = new THREE.SphereGeometry(0.6, 20, 20);
      const headMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.15,
        metalness: 0.5,
        emissive: color,
        emissiveIntensity: 0.3,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 3;
      head.castShadow = true;
      head.name = "pin";
      group.add(head);

      // Pin tip
      const tipGeo = new THREE.ConeGeometry(0.25, 0.5, 12);
      const tipMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.2,
        metalness: 0.6,
        emissive: color,
        emissiveIntensity: 0.2,
      });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.y = 3.5;
      tip.rotation.x = Math.PI;
      tip.castShadow = true;
      group.add(tip);

      // Outer glow sphere
      const glowGeo = new THREE.SphereGeometry(0.9, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.15,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.y = 3;
      glow.name = "glow";
      group.add(glow);

      // Pulsing ring at base - larger
      const ringGeo = new THREE.RingGeometry(0.7, 1.0, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      ring.name = "ring";
      group.add(ring);

      // Label sprite (canvas text) - number badge + name
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 80;
      const ctx = canvas.getContext("2d")!;
      ctx.textBaseline = "middle";
      const labelColor = CATEGORY_COLORS[loc.category];
      
      // Number badge circle
      const badgeX = 50;
      const badgeY = 40;
      const badgeR = 18;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = labelColor;
      ctx.fill();
      ctx.font = "bold 22px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(loc.number.toString(), badgeX, badgeY + 1);
      
      // Name text
      ctx.font = "bold 30px 'Space Grotesk', 'Inter', sans-serif";
      ctx.textAlign = "left";
      const textMetrics = ctx.measureText(loc.name);
      const nameX = badgeX + badgeR + 16;
      const pillWidth = textMetrics.width + 32;
      const pillHeight = 44;
      const pillY = 18;
      // Pill background for name
      ctx.fillStyle = "rgba(15,23,42,0.85)";
      ctx.beginPath();
      ctx.roundRect(nameX - 8, pillY, pillWidth + 16, pillHeight, 10);
      ctx.fill();
      ctx.strokeStyle = `${labelColor}60`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Name text
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(loc.name, nameX, badgeY);

      const labelTexture = new THREE.CanvasTexture(canvas);
      labelTexture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true,
        depthTest: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(6, 0.94, 1);
      sprite.position.y = 4.2;
      group.add(sprite);

      // Both markers share the exact gate coordinate; prioritize the 2nd Gate symbol
      // so it remains visually discoverable without changing click/navigation behavior.
      if (isSecondGate) {
        group.traverse((child) => {
          child.renderOrder = 10;
        });
      }

      scene.add(group);
      markersRef.current.set(loc.id, group);
    });
  }, []);

  // Handle click on markers
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      // Check intersections with marker groups
      const allMarkerMeshes: THREE.Object3D[] = [];
      markersRef.current.forEach((group) => {
        group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            allMarkerMeshes.push(child);
          }
        });
      });

      const intersects = raycasterRef.current.intersectObjects(
        allMarkerMeshes,
        false
      );

      if (intersects.length > 0) {
        // Find the parent group
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.location) {
          obj = obj.parent;
        }
        if (obj.userData.location) {
          onMarkerClick(obj.userData.location as CampusLocation);
        }
      }
    },
    [onMarkerClick]
  );

  // Handle hover on markers
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      const allMarkerMeshes: THREE.Object3D[] = [];
      markersRef.current.forEach((group) => {
        group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            allMarkerMeshes.push(child);
          }
        });
      });

      const intersects = raycasterRef.current.intersectObjects(
        allMarkerMeshes,
        false
      );

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.location) {
          obj = obj.parent;
        }
        if (obj.userData.location) {
          const loc = obj.userData.location as CampusLocation;
          if (hoveredRef.current?.id !== loc.id) {
            hoveredRef.current = loc;
            onHover(loc);
            containerRef.current.style.cursor = "pointer";
          }
        }
      } else {
        if (hoveredRef.current) {
          hoveredRef.current = null;
          onHover(null);
          containerRef.current.style.cursor = "grab";
        }
      }
    },
    [onHover]
  );

  // Fly to location
  useEffect(() => {
    if (!flyToLocation || !cameraRef.current || !controlsRef.current) return;

    const ground = sceneRef.current?.getObjectByName("ground") as THREE.Mesh | null;
    if (!ground) return;

    const dims = ground.userData.dimensions || {};
    const width = dims.width || 50;
    const height = dims.height || 50;

    const targetX = (flyToLocation.x - 0.5) * width;
    const targetZ = (flyToLocation.y - 0.5) * height;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    // Fly animation
    const endPos = new THREE.Vector3(targetX + 8, 15, targetZ + 12);
    const endTarget = new THREE.Vector3(targetX, 0, targetZ);

    gsap.to(camera.position, {
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      duration: 1.5,
      ease: "power2.inOut",
    });

    gsap.to(controls.target, {
      x: endTarget.x,
      y: endTarget.y,
      z: endTarget.z,
      duration: 1.5,
      ease: "power2.inOut",
    });
  }, [flyToLocation]);

  useEffect(() => {
    const cleanup = initScene();

    // Markers are created via the 'loaded' state effect below

    return () => {
      if (cleanup) cleanup();
    };
  }, [initScene, createMarkers]);

  // Create markers once scene is loaded
  useEffect(() => {
    if (loaded) {
      // Clear any existing markers first to prevent duplicates
      const scene = sceneRef.current;
      if (scene) {
        markersRef.current.forEach((group) => {
          scene.remove(group);
          group.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
        });
        markersRef.current.clear();
      }
      createMarkers();
    }
  }, [loaded, createMarkers]);

  useEffect(() => {
    const scene = sceneRef.current;
    const ground = scene?.getObjectByName("ground") as THREE.Mesh | null;
    if (!loaded || !scene || !ground) return;

    if (routeLineRef.current) {
      scene.remove(routeLineRef.current);
      routeLineRef.current.traverse((child) => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      routeLineRef.current = null;
    }
    if (!routePath || routePath.nodeIds.length < 2) return;

    const dims = ground.userData.dimensions || {};
    const width = dims.width || 50;
    const height = dims.height || 50;
    const routeGroup = new THREE.Group();
    routeGroup.name = "documented-route-highlight";
    let contiguous: THREE.Vector3[] = [];
    const flush = () => {
      if (contiguous.length < 2) { contiguous = []; return; }
      const geometry = new THREE.BufferGeometry().setFromPoints(contiguous);
      const material = new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.95 });
      const line = new THREE.Line(geometry, material);
      line.renderOrder = 20;
      routeGroup.add(line);
      contiguous = [];
    };
    routePath.nodeIds.forEach((id) => {
      const node = ROUTE_NODES.find((candidate) => candidate.id === id);
      let x: number | undefined;
      let y: number | undefined;
      if (node?.anchorId) {
        const location = CAMPUS_LOCATIONS.find((candidate) => candidate.id === node.anchorId);
        x = location?.x;
        y = location?.y;
      } else if (id === "sports-ground-gate") {
        x = 0.28;
        y = 0.44;
      }
      if (x === undefined || y === undefined) {
        flush();
        return;
      }
      contiguous.push(new THREE.Vector3((x - 0.5) * width, 0.16, (y - 0.5) * height));
    });
    flush();
    if (routeGroup.children.length === 0) return;
    scene.add(routeGroup);
    routeLineRef.current = routeGroup;
  }, [loaded, routePath]);

  useEffect(() => {
    const scene = sceneRef.current;
    const ground = scene?.getObjectByName("ground") as THREE.Mesh | null;
    if (!loaded || !scene || !ground) return;

    if (currentLocationRef.current) {
      scene.remove(currentLocationRef.current);
      currentLocationRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      currentLocationRef.current = null;
    }
    if (!currentLocationNodeId) return;
    const node = ROUTE_NODES.find((candidate) => candidate.id === currentLocationNodeId);
    const location = node?.anchorId ? CAMPUS_LOCATIONS.find((candidate) => candidate.id === node.anchorId) : null;
    if (!location) return;
    const dimensions = ground.userData.dimensions || {};
    const width = dimensions.width || 50;
    const height = dimensions.height || 50;
    const marker = new THREE.Group();
    marker.name = "current-location-blue-dot";
    marker.position.set((location.x - 0.5) * width, 0.34, (location.y - 0.5) * height);

    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 16), new THREE.MeshBasicMaterial({ color: 0x2f8cff }));
    dot.name = "current-location-dot";
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.72, 0.9, 32), new THREE.MeshBasicMaterial({ color: 0x74b9ff, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
    halo.name = "current-location-pulse";
    halo.rotation.x = -Math.PI / 2;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8), new THREE.MeshBasicMaterial({ color: 0x2f8cff }));
    stem.position.y = -0.6;
    marker.add(dot, halo, stem);
    marker.renderOrder = 50;
    scene.add(marker);
    currentLocationRef.current = marker;
  }, [loaded, currentLocationNodeId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("click", handleClick);
    el.addEventListener("mousemove", handleMouseMove);
    return () => {
      el.removeEventListener("click", handleClick);
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleClick, handleMouseMove]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e] z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <span className="text-white/70 text-sm font-medium tracking-wide">
              Loading Campus...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
