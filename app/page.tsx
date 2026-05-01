'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { scrollState } from '@/lib/scrollStore'

type Project = {
  name: string
  description: string
  stack: string[]
  githubLink?: string
  liveLink?: string
}

const projects: Project[] = [
  {
    name: 'Week Planner PWA',
    description: 'Aplicación web para visualizar y planificar la distribución semanal de materias de un curso, permitiendo organizar el horario de forma clara e intuitiva.',
    stack: ['React', 'PWA', 'Tailwind CSS'],
    liveLink: 'https://rnva-week-planner.netlify.app/',
    githubLink: 'https://github.com/ruanovaAlan/Course-Planner'
  },
  {
    name: 'Focal',
    description: 'Focal es un lector RSVP (Rapid Serial Visual Presentation) para archivos .epub.',
    stack: ['React', 'PWA', 'Tailwind CSS', 'Supabase'],
    githubLink: 'https://github.com/ruanovaAlan/Focal',
  },
  {
    name: 'Mi puerquito',
    description: 'Aplicación de control de gastos desarrollada en React Native',
    stack: ['React Native', 'Tailwind CSS', 'Expo'],
    githubLink: 'https://github.com/ruanovaAlan/Mi-puerquito',
  },
]

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
      <section className="relative z-10 min-h-screen flex flex-col px-12 md:px-24 py-32">
        <p className="text-[#4A7DFF] text-sm tracking-[0.3em] uppercase mb-4">Experiencia</p>
        <h2 className="text-white text-5xl md:text-7xl font-light leading-none mb-16">
          Proyectos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {projects.map((project) => (
            <div key={project.name} className="group relative p-px rounded-xl overflow-hidden">
              {/* Static border (always visible) */}
              <div className="absolute inset-0 rounded-xl bg-white/10" />

              {/* Rotating glow border (hover only) */}
              <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div
                  className="absolute animate-spin-border"
                  style={{
                    width: '200%',
                    height: '200%',
                    top: '-50%',
                    left: '-50%',
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, #4A7DFF 60deg, #b666cf 120deg, transparent 360deg)',
                  }}
                />
              </div>

              {/* Card content */}
              <div className="relative bg-[#080812] rounded-[11px] p-6 h-full backdrop-blur-sm">
                <h3 className="text-white text-xl font-light mb-3">{project.name}</h3>
                <p className="text-[#E8E8F0]/50 text-sm font-light leading-relaxed mb-5">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[#4A7DFF] text-xs tracking-wider border border-[#4A7DFF]/30 rounded-full px-3 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E8E8F0]/40 hover:text-white transition-colors duration-200"
                      aria-label="Ver repositorio en GitHub"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#E8E8F0]/40 text-xs tracking-[0.2em] uppercase hover:text-[#4A7DFF] transition-colors duration-200"
                    >
                      Ver proyecto
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
