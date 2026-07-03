import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Float,
  MeshTransmissionMaterial,
  PerspectiveCamera,
  Sparkles,
  useTexture,
} from '@react-three/drei';
import { ReactNode, Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

type SceneShellProps = {
  children: ReactNode;
  className?: string;
  camera?: [number, number, number];
};

function SceneShell({ children, className = '', camera = [0, 0, 6] }: SceneShellProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <div className={className}>
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        shadows
      >
        <PerspectiveCamera makeDefault position={camera} fov={45} />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}

function ScrollCameraRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    const scrollProgress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    camera.position.x += (pointer.x * 0.32 - camera.position.x) * 0.035;
    camera.position.y += (pointer.y * 0.18 + scrollProgress * 0.24 - camera.position.y) * 0.035;
    camera.lookAt(0, 0.2, 0);
  });

  return null;
}

function ArchitecturalForms() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.35) * 0.08;
    groupRef.current.rotation.y = Math.sin(time * 0.18) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <Float speed={0.65} rotationIntensity={0.12} floatIntensity={0.28}>
        <mesh position={[-1.95, 0.15, 0]} rotation={[0.22, 0.45, -0.1]} castShadow>
          <boxGeometry args={[0.75, 2.2, 0.18]} />
          <MeshTransmissionMaterial
            thickness={0.35}
            roughness={0.22}
            transmission={0.86}
            ior={1.26}
            chromaticAberration={0.035}
            color="#f5efe7"
            transparent
            opacity={0.72}
          />
        </mesh>
      </Float>
      <Float speed={0.55} rotationIntensity={0.08} floatIntensity={0.22}>
        <mesh position={[1.7, -0.1, -0.2]} rotation={[-0.12, -0.38, 0.08]} castShadow>
          <cylinderGeometry args={[0.32, 0.48, 2.4, 32]} />
          <meshPhysicalMaterial
            color="#d8a949"
            metalness={0.56}
            roughness={0.24}
            clearcoat={0.9}
            clearcoatRoughness={0.2}
          />
        </mesh>
      </Float>
      <mesh position={[0, -1.35, -0.55]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.2, 96]} />
        <meshStandardMaterial color="#2a2420" roughness={0.72} metalness={0.12} transparent opacity={0.32} />
      </mesh>
      <mesh position={[0, -1.34, -0.56]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 4.2, 96]} />
        <meshBasicMaterial color="#c6972f" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function SkylineRelief() {
  const bars = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        x: -3.6 + index * 0.22,
        height: 0.28 + Math.sin(index * 1.7) * 0.14 + (index % 5) * 0.06,
      })),
    [],
  );

  return (
    <group position={[0, -1.05, -1.8]}>
      {bars.map((bar) => (
        <mesh key={bar.x} position={[bar.x, bar.height / 2, 0]}>
          <boxGeometry args={[0.07, bar.height, 0.05]} />
          <meshStandardMaterial color="#f5efe7" transparent opacity={0.24} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroExperience() {
  return (
    <SceneShell className="absolute inset-0 z-[1] opacity-90" camera={[0, 0.1, 6.3]}>
      <fog attach="fog" args={['#2a2420', 4.2, 10]} />
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[-4, 3, 3]} intensity={1.4} color="#f5efe7" castShadow />
      <pointLight position={[2.2, 0.6, 1.8]} intensity={4.2} color="#c6972f" distance={5.5} />
      <spotLight position={[0, 4.2, 3]} angle={0.35} penumbra={0.8} intensity={2.2} color="#d8a949" />
      <ArchitecturalForms />
      <SkylineRelief />
      <Sparkles count={70} scale={[7, 3, 4]} size={1.25} speed={0.18} color="#e8c563" opacity={0.32} />
      <ScrollCameraRig />
      <Environment preset="city" />
    </SceneShell>
  );
}

type ProductCanSceneProps = {
  textureUrl: string;
};

function Condensation({ radius = 0.86 }: { radius?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const droplets = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => {
        const angle = index * 2.399963 + (index % 3) * 0.18;
        return {
          angle,
          y: -1.15 + (index / 41) * 2.3,
          scale: 0.014 + (index % 5) * 0.003,
        };
      }),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    droplets.forEach((drop, index) => {
      dummy.position.set(Math.cos(drop.angle) * radius, drop.y, Math.sin(drop.angle) * radius);
      dummy.scale.setScalar(drop.scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, droplets.length]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshPhysicalMaterial color="#ffffff" roughness={0.08} transmission={0.6} thickness={0.12} transparent opacity={0.68} />
    </instancedMesh>
  );
}

function CanModel({ textureUrl }: ProductCanSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [drag, setDrag] = useState(0);
  const texture = useTexture(textureUrl);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    groupRef.current.rotation.y += (pointer.x * 0.44 + drag - groupRef.current.rotation.y) * 0.055;
    groupRef.current.rotation.x += (Math.sin(time * 0.5) * 0.04 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.position.y = Math.sin(time * 0.62) * 0.055;
  });

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    setDrag((event.point.x || 0) * 0.16);
  };

  return (
    <group ref={groupRef} onPointerMove={onPointerMove}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.82, 2.45, 96, 1, true]} />
        <meshPhysicalMaterial
          map={texture}
          metalness={0.54}
          roughness={0.26}
          clearcoat={0.85}
          clearcoatRoughness={0.12}
          envMapIntensity={1.6}
        />
      </mesh>
      <mesh position={[0, 1.24, 0]} castShadow>
        <cylinderGeometry args={[0.82, 0.82, 0.055, 96]} />
        <meshPhysicalMaterial color="#d8d3ca" metalness={0.86} roughness={0.18} />
      </mesh>
      <mesh position={[0, -1.24, 0]} receiveShadow>
        <cylinderGeometry args={[0.82, 0.82, 0.055, 96]} />
        <meshPhysicalMaterial color="#b9b1a6" metalness={0.82} roughness={0.22} />
      </mesh>
      <mesh position={[0, 1.31, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.012, 8, 48]} />
        <meshStandardMaterial color="#f5efe7" metalness={0.72} roughness={0.2} />
      </mesh>
      <Condensation />
    </group>
  );
}

export function ProductCanScene({ textureUrl }: ProductCanSceneProps) {
  return (
    <SceneShell className="absolute inset-0" camera={[0, 0, 4.9]}>
      <ambientLight intensity={0.95} />
      <directionalLight position={[-3, 4, 3]} intensity={2.2} color="#fff8ee" castShadow />
      <pointLight position={[2.5, 1.5, 2.5]} intensity={2.1} color="#d8a949" />
      <Float speed={0.55} rotationIntensity={0.06} floatIntensity={0.16}>
        <CanModel textureUrl={textureUrl} />
      </Float>
      <ContactShadows position={[0, -1.48, 0]} opacity={0.38} scale={4.2} blur={2.7} far={3.2} />
      <Environment preset="studio" />
    </SceneShell>
  );
}

function FooterWater() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.18) * 0.015;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
      <planeGeometry args={[8, 4, 32, 32]} />
      <meshPhysicalMaterial
        color="#2a2420"
        roughness={0.18}
        metalness={0.2}
        transmission={0.08}
        transparent
        opacity={0.62}
        clearcoat={0.8}
      />
    </mesh>
  );
}

export function FooterExperience() {
  return (
    <SceneShell className="absolute inset-0 opacity-80" camera={[0, 0.05, 5.7]}>
      <fog attach="fog" args={['#2a2420', 3.6, 9.5]} />
      <ambientLight intensity={0.34} />
      <pointLight position={[-2.7, 1.4, 1.7]} intensity={2.5} color="#c6972f" />
      <pointLight position={[2.8, 0.9, 1.2]} intensity={1.4} color="#f5efe7" />
      <FooterWater />
      <Sparkles count={42} scale={[6, 2.6, 2.2]} size={1.4} speed={0.12} color="#d8a949" opacity={0.42} />
      <ScrollCameraRig />
    </SceneShell>
  );
}
