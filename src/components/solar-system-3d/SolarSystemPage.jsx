import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "react-router-dom";
import PlanetInfoModal from "./PlanetInfoModal";

const PLANETS = [
  {
    name: "Sun",
    radius: 10,
    orbit: 0,
    speed: 0,
    textureUrl: "/textures/sun.jpg",
    description:
      "The Sun is a massive sphere of plasma, generating energy through nuclear fusion at its core. It drives the solar system with its gravity and solar winds.",
  },
  {
    name: "Mercury",
    radius: 1,
    orbit: 18,
    speed: 0.04,
    textureUrl: "/textures/mercury.jpg",
    description:
      "Mercury has a molten core with a surprisingly strong magnetic field. It undergoes extreme temperature swings due to its lack of atmosphere.",
  },
  {
    name: "Venus",
    radius: 1.5,
    orbit: 25,
    speed: 0.03,
    textureUrl: "/textures/venus.jpg",
    atmosphereTextureUrl: "/textures/venus_atmos.jpg",
    description:
      "Venus spins retrograde and has a dense, toxic atmosphere causing a runaway greenhouse effect, making it extremely hot and crushing atmospheric pressure.",
  },
  {
    name: "Earth",
    radius: 1.6,
    orbit: 32,
    speed: 0.025,
    textureUrl: "/textures/earth.jpg",
    description:
      "Earth supports diverse life with a magnetic field protecting its atmosphere. Plate tectonics create dynamic surface changes.",
  },
  {
    name: "Mars",
    radius: 1.2,
    orbit: 40,
    speed: 0.02,
    textureUrl: "/textures/mars.jpg",
    description:
      "Mars has the tallest volcano and largest canyon in the Solar System. Ice caps and dry riverbeds hint at past water activity.",
  },
  {
    name: "Jupiter",
    radius: 3,
    orbit: 52,
    speed: 0.008,
    textureUrl: "/textures/jupiter.jpg",
    description:
      "Jupiter's Great Red Spot is a centuries-old storm larger than Earth. It has powerful magnetic fields and many moons.",
  },
  {
    name: "Saturn",
    radius: 2.7,
    orbit: 64,
    speed: 0.006,
    textureUrl: "/textures/saturn.jpg",
    ringTextureUrl: "/textures/saturn_ring.jpg",
    description:
      "Saturn’s rings consist mostly of ice particles; internal heating arises from helium precipitation.",
  },
  {
    name: "Uranus",
    radius: 2,
    orbit: 74,
    speed: 0.004,
    textureUrl: "/textures/uranus.jpg",
    description:
      "Uranus rotates on its side causing extreme seasonal variation. Methane gives its cyan color.",
  },
  {
    name: "Neptune",
    radius: 2,
    orbit: 84,
    speed: 0.003,
    textureUrl: "/textures/neptune.jpg",
    description:
      "Neptune exhibits some of the solar system’s fastest winds. Its moon Triton shows active geysers.",
  },
];

// Default blank texture for hooks consistency
const BLANK_TEXTURE = "/textures/blank.png";

// ORBIT RING: Very bold and thick, highly visible
function OrbitRing({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.3, radius + 0.3, 128]} />
      <meshBasicMaterial
        color="#ffffff"
        side={THREE.DoubleSide}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function Planet({
  radius,
  orbit,
  speed,
  index,
  timeMultiplier,
  textureUrl,
  atmosphereTextureUrl,
  ringTextureUrl,
  onClick,
}) {
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  const atmosphereTexture = useLoader(
    THREE.TextureLoader,
    atmosphereTextureUrl || BLANK_TEXTURE
  );
  const ringTexture = useLoader(
    THREE.TextureLoader,
    ringTextureUrl || BLANK_TEXTURE
  );
  const planetRef = useRef();
  const ringRef = useRef();

  useFrame(({ clock }) => {
    const t =
      clock.getElapsedTime() * speed * timeMultiplier + index * 1.0;
    if (planetRef.current) {
      const x = Math.cos(t) * orbit;
      const z = Math.sin(t) * orbit;
      planetRef.current.position.x = x;
      planetRef.current.position.z = z;

      if (ringRef.current) {
        ringRef.current.position.x = x;
        ringRef.current.position.z = z;
      }
    }
  });

  return (
    <group>
      <mesh ref={planetRef} onClick={onClick}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {atmosphereTextureUrl && (
        <mesh>
          <sphereGeometry args={[radius * 1.05, 64, 64]} />
          <meshStandardMaterial
            map={atmosphereTexture}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {ringTextureUrl && (
        <mesh
          ref={ringRef}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[radius + 0.5, radius + 1.2, 64]} />
          <meshStandardMaterial
            map={ringTexture}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

export default function SolarSystemPage() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [timeMultiplier, setTimeMultiplier] = useState(1);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 20,
          zIndex: 10,
          color: "white",
        }}
      >
        <label htmlFor="timeSlider">Time Speed:</label>
        <input
          id="timeSlider"
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={timeMultiplier}
          onChange={(e) =>
            setTimeMultiplier(parseFloat(e.target.value))
          }
          style={{ marginLeft: "10px" }}
        />
        <span style={{ marginLeft: "10px" }}>
          {timeMultiplier.toFixed(1)}x
        </span>
      </div>

      <Link
        to="/"
        style={{
          position: "absolute",
          top: 14,
          right: 20,
          zIndex: 10,
          textDecoration: "none",
          color: "#f3f7ff",
          border: "1px solid rgba(146, 194, 255, 0.4)",
          background: "rgba(8, 17, 36, 0.75)",
          padding: "10px 16px",
          borderRadius: "10px",
          fontSize: "0.9rem",
          letterSpacing: "0.03em",
        }}
      >
        Home
      </Link>

      <Canvas camera={{ position: [0, 40, 120], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[0, 0, 0]} intensity={2.2} />
        <Stars radius={300} depth={60} count={2500} factor={12} />

        <Planet
          radius={PLANETS[0].radius}
          orbit={0}
          speed={0}
          index={0}
          timeMultiplier={timeMultiplier}
          textureUrl={PLANETS[0].textureUrl}
          onClick={() => setSelectedPlanet(PLANETS[0])}
        />

        {PLANETS.slice(1).map((planet) => (
          <OrbitRing key={planet.name + "-orbit"} radius={planet.orbit} />
        ))}

        {PLANETS.slice(1).map((planet, i) => (
          <Planet
            key={planet.name}
            {...planet}
            index={i + 1}
            timeMultiplier={timeMultiplier}
            onClick={() => setSelectedPlanet(planet)}
          />
        ))}

        <OrbitControls enablePan={false} />
      </Canvas>

      <PlanetInfoModal
        open={!!selectedPlanet}
        planet={selectedPlanet}
        onClose={() => setSelectedPlanet(null)}
      />
    </div>
  );
}
