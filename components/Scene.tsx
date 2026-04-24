'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '@/lib/scrollStore'

function createPlanetTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Base naranja
  ctx.fillStyle = '#C2956C'
  // ctx.fillStyle = '#fb8e5c'
  ctx.fillRect(0, 0, size, size)

  // Bandas horizontales
  const bands = [
    { y: 0.08, h: 0.06, color: 'rgba(180, 110, 55, 0.6)' },
    { y: 0.18, h: 0.04, color: 'rgba(230, 160, 90, 0.5)' },
    { y: 0.28, h: 0.08, color: 'rgba(160, 90, 45, 0.5)' },
    { y: 0.40, h: 0.05, color: 'rgba(220, 150, 80, 0.4)' },
    { y: 0.50, h: 0.07, color: 'rgba(150, 85, 40, 0.6)' },
    { y: 0.62, h: 0.05, color: 'rgba(235, 165, 95, 0.4)' },
    { y: 0.72, h: 0.08, color: 'rgba(170, 100, 50, 0.5)' },
    { y: 0.84, h: 0.04, color: 'rgba(210, 140, 75, 0.4)' },
    { y: 0.92, h: 0.06, color: 'rgba(155, 88, 42, 0.5)' },
  ]

  bands.forEach(({ y, h, color }) => {
    const grad = ctx.createLinearGradient(0, y * size, 0, (y + h) * size)
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(0.5, color)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, y * size, size, h * size)
  })

  // Manchas orgánicas
  const spots = [
    { x: 0.2, y: 0.3, rx: 0.12, ry: 0.07, color: 'rgba(140, 80, 35, 0.45)' },
    { x: 0.6, y: 0.45, rx: 0.10, ry: 0.06, color: 'rgba(200, 130, 65, 0.4)' },
    { x: 0.8, y: 0.25, rx: 0.08, ry: 0.05, color: 'rgba(130, 75, 30, 0.4)' },
    { x: 0.35, y: 0.65, rx: 0.14, ry: 0.06, color: 'rgba(190, 120, 55, 0.35)' },
    { x: 0.7, y: 0.7, rx: 0.09, ry: 0.05, color: 'rgba(145, 85, 38, 0.4)' },
    { x: 0.1, y: 0.55, rx: 0.07, ry: 0.04, color: 'rgba(210, 140, 70, 0.35)' },
    { x: 0.5, y: 0.15, rx: 0.11, ry: 0.05, color: 'rgba(135, 78, 32, 0.4)' },
  ]

  spots.forEach(({ x, y, rx, ry, color }) => {
    ctx.beginPath()
    ctx.ellipse(x * size, y * size, rx * size, ry * size, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })



  return new THREE.CanvasTexture(canvas)
}

function Planet() {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const texture = useMemo(() => createPlanetTexture(), [])

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.08
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.02

    if (groupRef.current) {
      const t = scrollState.progress

      // Quadratic Bézier curve: center → up → upper-right
      // P0 = (0, 0, 0)  P1 = (0, 4, -8)  P2 = (6, 3.5, -16)
      const targetX = 2 * (1 - t) * t * 0 + t * t * 9
      const targetY = 2 * (1 - t) * t * 4 + t * t * 4
      const targetZ = 2 * (1 - t) * t * -8 + t * t * -16

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1)
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1)

      const targetScale = 1 - t * 0.3
      const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      groupRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.2]}>
      {/* Planeta */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Anillo principal */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[3.2, 0.35, 2, 200]} />
        <meshStandardMaterial
          color="#b666cf"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* Anillo exterior tenue */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[3.8, 0.15, 2, 200]} />
        <meshStandardMaterial
          color="#8c35a7"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} color="#FFF5E0" />
      <directionalLight position={[5, 3, 5]} intensity={2} color="#ffa680" />
      <pointLight position={[-4, 2, 3]} intensity={1} color="#e86e28" />
      <Stars
        radius={100}
        depth={50}
        count={4000}
        factor={10}
        fade

        speed={1}
      />
      <Planet />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.4}
      />
    </Canvas>
  )
}