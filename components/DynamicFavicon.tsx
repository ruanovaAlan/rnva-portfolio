'use client'

import { useEffect } from 'react'

export default function DynamicFavicon() {
  useEffect(() => {
    // Solo se ejecuta en el cliente
    const size = 32
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }

    let frame = 0

    const updateFavicon = () => {
      frame += 0.05
      ctx.clearRect(0, 0, size, size)

      // Cuerpo del planeta
      ctx.save()
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = '#da5f18'
      ctx.fill()
      ctx.clip()

      // Bandas animadas
      ctx.fillStyle = 'rgba(150, 85, 40, 0.5)'
      const offset = (frame * 5) % size
      ctx.fillRect(0, (size * 0.3) + Math.sin(frame) * 2, size, size * 0.1)
      ctx.fillRect(0, (size * 0.6) - Math.sin(frame) * 2, size, size * 0.1)
      ctx.restore()

      // Anillos (Inclinación similar a tu escena Three.js)
      ctx.strokeStyle = '#c82bf7'
      ctx.lineWidth = 1.5
      ctx.save()
      ctx.translate(size / 2, size / 2)
      ctx.rotate(0.3)
      ctx.beginPath()
      ctx.ellipse(0, 0, size * 0.48, size * 0.12, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // La letra 'A'
      ctx.font = `bold ${size * 0.4}px Inter, Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      ctx.shadowBlur = 3
      ctx.shadowColor = 'rgba(0,0,0,0.8)'
      ctx.fillText('A', size / 2, size / 2)

      link!.href = canvas.toDataURL('image/png')
    }

    const interval = setInterval(updateFavicon, 100) // 10 FPS es suficiente para un icono
    return () => clearInterval(interval)
  }, [])

  return null // No renderiza nada visualmente en el DOM de la página
}