'use client'

import { useEffect, useRef } from 'react'

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuração do canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Caracteres para o efeito matrix
    const chars = 'NEXUSKEY0123456789ABCDEF@#$%^&*()'.split('')
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    
    // Array para rastrear posição Y de cada coluna
    const drops: number[] = Array(columns).fill(1)

    // Cor neon verde
    const neonGreen = '#00ff88'
    const darkGreen = 'rgba(0, 255, 136, 0.1)'

    const draw = () => {
      // Fundo semi-transparente para criar efeito de fade
      ctx.fillStyle = 'rgba(8, 10, 15, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = neonGreen
      ctx.font = `${fontSize}px "Geist Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        // Escolhe um caractere aleatório
        const char = chars[Math.floor(Math.random() * chars.length)]
        
        // Desenha o caractere
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Varia a opacidade para criar profundidade
        const opacity = Math.random() * 0.5 + 0.1
        ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`
        ctx.fillText(char, x, y)

        // Reseta a posição quando atinge o fim ou aleatoriamente
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    // Animação
    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    />
  )
}
