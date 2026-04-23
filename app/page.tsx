'use client'

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('../components/Scene'), { ssr: false })

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-[#050508] overflow-hidden">
      {/* Escena 3D */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* Contenido encima */}
      <div className="relative z-10 flex flex-col justify-center h-full px-12 md:px-24">
        <p className="text-[#4A7DFF] text-sm tracking-[0.3em] uppercase mb-4">
          Fullstack Developer
        </p>
        <h1 className="text-white text-6xl md:text-8xl font-light leading-none mb-6">
          Alan Ruanova
        </h1>
        <p className="text-[#E8E8F0]/50 text-lg max-w-md font-light">
          Construyo sistemas que funcionan.<br />
          Desde la interfaz hasta la infraestructura.
        </p>
      </div>
    </main>
  )
}