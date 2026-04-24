'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { scrollState } from '@/lib/scrollStore'

const Scene = dynamic(() => import('../components/Scene'), { ssr: false })

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1)
      scrollState.progress = progress

      if (heroRef.current) {
        heroRef.current.style.opacity = String(1 - progress)
        heroRef.current.style.transform = `translateY(${progress * -60}px)`
      }

      if (canvasContainerRef.current) {
        canvasContainerRef.current.style.opacity = String(Math.max(1 - progress * 0.5, 0.3))
      }
    }

    // Initialize on mount in case page loads at non-zero scroll
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className="relative w-full bg-[#050508]">
      {/* Fixed 3D background */}
      <div ref={canvasContainerRef} className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Hero section */}
      <section className="relative z-10 h-screen flex flex-col justify-center px-12 md:px-24">
        <div ref={heroRef}>
          <p className="text-[#4A7DFF] text-sm tracking-[0.3em] uppercase mb-4">
            Fullstack Developer
          </p>
          <h1 className="text-white text-6xl md:text-8xl font-light leading-none mb-6">
            Alan Ruanova
          </h1>
          <p className="text-[#E8E8F0]/50 text-lg max-w-md font-light">
            Transformo desafíos técnicos en soluciones eficaces.<br />
            Construyo herramientas digitales que aportan valor real.
          </p>
        </div>
      </section>

      {/* Portfolio sections */}
      <section className="relative z-10 min-h-screen flex flex-col justify-baseline px-12 md:px-24">
        <p className="text-[#4A7DFF] text-sm tracking-[0.3em] uppercase mb-4 mt-32">Experiencia</p>
        <h2 className="text-white text-5xl md:text-7xl font-light leading-none mb-6">
          Proyectos
        </h2>
        <p className="text-[#E8E8F0]/50 text-lg max-w-md font-light">
          Próximamente...
        </p>
      </section>
    </main>
  )
}
