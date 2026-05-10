'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '@/lib/scrollStore'

function createCyberpunkTexture() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Light metallic gray base — man-made structure
  // Dark polished platinum base
  const baseGrad = ctx.createLinearGradient(0, 0, size, size)
  baseGrad.addColorStop(0, '#2c2e33')
  baseGrad.addColorStop(0.4, '#3a3d44')
  baseGrad.addColorStop(0.7, '#28292f')
  baseGrad.addColorStop(1, '#1e2026')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, size, size)

  // Polished panel variation — subtle lighter/darker plates
  for (let i = 0; i < 80; i++) {
    const px = Math.random() * size
    const py = Math.random() * size
    const pw = (Math.random() * 5 + 2) * 28
    const ph = (Math.random() * 5 + 2) * 28
    const shade = 30 + Math.random() * 35 | 0
    ctx.fillStyle = `rgba(${shade + 5},${shade + 6},${shade + 10},0.55)`
    ctx.fillRect(px - pw / 2, py - ph / 2, pw, ph)
  }

  // Grid lines — circuit board
  const gridSize = 28
  ctx.strokeStyle = 'rgba(80, 90, 110, 0.35)'
  ctx.lineWidth = 1
  for (let x = 0; x < size; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke()
  }
  for (let y = 0; y < size; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke()
  }

  // Circuit traces — blue on silver
  ctx.lineWidth = 2
  for (let i = 0; i < 35; i++) {
    const snap = (v: number) => Math.round(v / gridSize) * gridSize
    const x1 = snap(Math.random() * size)
    const x2 = snap(Math.random() * size)
    const y = snap(Math.random() * size)
    ctx.strokeStyle = `rgba(0, ${80 + Math.random() * 100 | 0}, 220, ${0.5 + Math.random() * 0.4})`
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke()
  }
  for (let i = 0; i < 35; i++) {
    const snap = (v: number) => Math.round(v / gridSize) * gridSize
    const x = snap(Math.random() * size)
    const y1 = snap(Math.random() * size)
    const y2 = snap(Math.random() * size)
    ctx.strokeStyle = `rgba(0, ${80 + Math.random() * 100 | 0}, 220, ${0.5 + Math.random() * 0.4})`
    ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke()
  }

  // City blocks — mid-gray metallic panels
  for (let i = 0; i < 55; i++) {
    const bx = Math.random() * size
    const by = Math.random() * size
    const bw = (Math.random() * 4 + 1) * gridSize
    const bh = (Math.random() * 4 + 1) * gridSize
    const v = 20 + Math.random() * 30 | 0
    ctx.fillStyle = `rgba(${v},${v + 2},${v + 6},0.8)`
    ctx.fillRect(bx - bw / 2, by - bh / 2, bw, bh)
    ctx.strokeStyle = 'rgba(90, 100, 130, 0.45)'
    ctx.lineWidth = 1
    ctx.strokeRect(bx - bw / 2, by - bh / 2, bw, bh)
  }

  // Orange/warm neon lights — windows & fires
  for (let i = 0; i < 80; i++) {
    const lx = Math.random() * size
    const ly = Math.random() * size
    const lr = Math.random() * 4 + 1
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr * 5)
    g.addColorStop(0, `rgba(255,${120 + Math.random() * 60 | 0},10,1)`)
    g.addColorStop(1, 'rgba(200,60,0,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(lx, ly, lr * 5, 0, Math.PI * 2); ctx.fill()
  }

  // Cyan/blue neon lights
  for (let i = 0; i < 60; i++) {
    const lx = Math.random() * size
    const ly = Math.random() * size
    const lr = Math.random() * 3 + 1
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr * 6)
    g.addColorStop(0, `rgba(0,${180 + Math.random() * 75 | 0},255,1)`)
    g.addColorStop(1, 'rgba(0,80,255,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(lx, ly, lr * 6, 0, Math.PI * 2); ctx.fill()
  }

  // Purple neon accents
  for (let i = 0; i < 30; i++) {
    const lx = Math.random() * size
    const ly = Math.random() * size
    const lr = Math.random() * 3 + 1
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr * 5)
    g.addColorStop(0, 'rgba(180,0,255,0.9)')
    g.addColorStop(1, 'rgba(80,0,180,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(lx, ly, lr * 5, 0, Math.PI * 2); ctx.fill()
  }

  return new THREE.CanvasTexture(canvas)
}

// Glowing plasma arc that orbits the planet
function EnergyArc({ seed = 0, tiltX = 0, tiltZ = 0, color = '#00ccff', speed = 0.25, comet = false, lightColor }: {
  seed?: number; tiltX?: number; tiltZ?: number; color?: string; speed?: number; comet?: boolean; lightColor?: string
}) {
  const ref = useRef<THREE.Group>(null)

  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const segs = 120
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2
      const r = 2.35 + Math.sin(a * 7 + seed) * 0.18 + Math.cos(a * 3 + seed * 2) * 0.1
      const h = Math.sin(a * 4 + seed * 1.3) * 0.35
      pts.push(new THREE.Vector3(Math.cos(a) * r, h, Math.sin(a) * r))
    }
    const curve = new THREE.CatmullRomCurve3(pts, true)
    const tubularSegs = 200
    const radialSegs = 6
    const geo = new THREE.TubeGeometry(curve, tubularSegs, comet ? 0.03 : 0.018, radialSegs, true)

    if (comet) {
      // Vertex colors: blue→purple comet head, black tail (additive = transparent)
      const blue = new THREE.Color('#4A7DFF')
      const purple = new THREE.Color('#b666cf')
      const black = new THREE.Color(0, 0, 0)
      const colorData: number[] = []

      for (let i = 0; i <= tubularSegs; i++) {
        const u = i / tubularSegs
        const dim = new THREE.Color(0.012, 0.018, 0.06)
        const purpleBright = new THREE.Color('#cc00ff').multiplyScalar(.7)
        let c: THREE.Color
        if (u < 0.03) {
          // fade in
          c = dim.clone().lerp(blue, u / 0.03)
        } else if (u < 0.55) {
          // long solid blue body
          c = blue.clone()
        } else if (u < 0.62) {
          // sharp blue → overbright purple
          c = blue.clone().lerp(purpleBright, (u - 0.55) / 0.07)
        } else if (u < 0.72) {
          // purple peak
          c = purpleBright.clone()
        } else if (u < 0.85) {
          // burn out to dim
          c = purpleBright.clone().lerp(dim, (u - 0.72) / 0.13)
        } else {
          c = dim.clone()
        }
        for (let j = 0; j <= radialSegs; j++) {
          colorData.push(c.r, c.g, c.b)
        }
      }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colorData, 3))
    }

    return geo
  }, [seed, comet])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed
  })

  return (
    <group ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <mesh geometry={geometry}>
        {comet ? (
          <meshBasicMaterial
            vertexColors
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={4}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        )}
      </mesh>
      {/* Positioned on arc radius — rotates with group, sweeps planet surface */}
      <pointLight position={[2.4, 0, 0]} color={color} intensity={3} distance={3} decay={2} />
      <pointLight position={[-2.4, 0, 0]} color={lightColor ?? color} intensity={3} distance={3} decay={2} />
    </group>
  )
}

function Planet() {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const texture = useMemo(() => createCyberpunkTexture(), [])

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.06
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.015

    if (groupRef.current) {
      const t = scrollState.progress
      const targetX = 2 * (1 - t) * t * 0 + t * t * 9
      const targetY = 2 * (1 - t) * t * 4 + t * t * 6
      const targetZ = 2 * (1 - t) * t * -8 + t * t * -16

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1)
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1)

      const s = THREE.MathUtils.lerp(groupRef.current.scale.x, 1 - t * 0.3, 0.1)
      groupRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.2]}>
      {/* Planet sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive="#1a1c22"
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Plasma energy arcs — spread across distinct orbital planes */}
      <EnergyArc seed={0} tiltX={0.2} tiltZ={0.0} color="#4A7DFF" speed={0.28} comet lightColor="#b666cf" />
      <EnergyArc seed={1.5} tiltX={-0.9} tiltZ={0.3} color="#4A7DFF" speed={0.22} comet lightColor="#b666cf" />
      <EnergyArc seed={3} tiltX={1.1} tiltZ={-0.5} color="#4A7DFF" speed={0.35} comet lightColor="#b666cf" />
      <EnergyArc seed={4.5} tiltX={-0.3} tiltZ={1.2} color="#4A7DFF" speed={0.18} comet lightColor="#b666cf" />

    </group>
  )
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      {/* Ambient — enough to see gray base */}
      <ambientLight intensity={0.6} color="#c0cce0" />

      {/* Main white fill */}
      <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ddeeff" />

      {/* Blue energy glow */}
      <pointLight position={[3, 2, 5]} intensity={4} color="#00aaff" />
      <pointLight position={[-4, 1, 3]} intensity={2} color="#0066ff" />

      {/* Warm orange underfill */}
      <pointLight position={[0, -4, 2]} intensity={2} color="#ff6600" />

      <Stars radius={100} depth={50} count={5000} factor={10} fade speed={1} />
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
