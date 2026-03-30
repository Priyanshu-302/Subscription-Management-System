import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Text } from '@react-three/drei'
import * as THREE from 'three'

// Simple 3D card layout
function SubscriptionCard({ position, rotation, color, label, price }) {
  const ref = useRef()
  
  useFrame((state) => {
    // gentle sway
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1 + rotation[0]
    ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3 + position[1]) * 0.1 + rotation[1]
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={ref} position={position}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3, 4, 0.2]} />
          <meshPhysicalMaterial 
            color={color} 
            roughness={0.2} 
            metalness={0.1}
            transmission={0.5}
            thickness={2}
          />
        </mesh>
        {/* Glow border simulated by a slightly larger plane behind */}
        <mesh position={[0, 0, -0.11]}>
          <planeGeometry args={[3.1, 4.1]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
        
        <Text
          position={[0, 1, 0.15]}
          fontSize={0.4}
          color="#a3a3a3"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {label}
        </Text>
        <Text
          position={[0, -0.2, 0.15]}
          fontSize={0.7}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {price}
        </Text>
        <Text
          position={[0, -1.2, 0.15]}
          fontSize={0.25}
          color="#3b82f6"
          anchorX="center"
          anchorY="middle"
        >
          / month
        </Text>
      </group>
    </Float>
  )
}

export default function HeroScene() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 opacity-80 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
        
        <SubscriptionCard position={[-4.5, 1, -2]} rotation={[0, 0.2, -0.1]} color="#111111" label="NETFLIX" price="$15.99" />
        <SubscriptionCard position={[4.5, -1, -3]} rotation={[0, -0.3, 0.1]} color="#1e1b4b" label="SPOTIFY" price="$10.99" />
        <SubscriptionCard position={[0, 3, -5]} rotation={[0.2, 0, 0]} color="#0f172a" label="FIGMA" price="$12.00" />
        <SubscriptionCard position={[-5, -3, -4]} rotation={[-0.1, 0.4, 0.2]} color="#312e81" label="AWS" price="$45.00" />
        <SubscriptionCard position={[5, 3, -3]} rotation={[0.1, -0.2, -0.1]} color="#172554" label="ADOBE" price="$29.99" />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
