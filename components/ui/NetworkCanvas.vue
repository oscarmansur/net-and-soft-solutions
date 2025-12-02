<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Canvas Container -->
    <div class="absolute inset-0 z-1 bg-gradient-radial from-slate-800/50 via-slate-900 to-slate-900">
      <canvas ref="canvas" class="w-full h-full"></canvas>
    </div>

    <!-- UI Layer (Optional Text Overlay) -->
    <div 
      v-if="showOverlay"
      class="absolute inset-0 z-2 pointer-events-none flex flex-col justify-center items-center p-4"
      style="background: radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.3) 100%);"
    >
      <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-wider brand-text text-center">
        {{ displayTitle }}
      </h1>
      <p class="text-cyan-300 text-xs md:text-sm lg:text-base tracking-[0.2em] uppercase font-light text-center">
        {{ displaySubtitle }}
      </p>
      <div class="mt-6 flex items-center space-x-2 text-cyan-500/70 text-xs uppercase tracking-widest">
        <span class="animate-pulse">●</span>
        <span>{{ displayStatusText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  showOverlay?: boolean
  title?: string
  subtitle?: string
  statusText?: string
  particleDensity?: number
  connectionDistance?: number
  mouseDistance?: number
}

const props = withDefaults(defineProps<Props>(), {
  showOverlay: false,
  title: '',
  subtitle: '',
  statusText: '',
  particleDensity: 11000,
  connectionDistance: 160,
  mouseDistance: 220
})

// Use computed properties to provide translated defaults
const displayTitle = computed(() => props.title || t('networkCanvas.title'))
const displaySubtitle = computed(() => props.subtitle || t('networkCanvas.subtitle'))
const displayStatusText = computed(() => props.statusText || t('networkCanvas.statusText'))


const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let particles: Particle[] = []
let pulses: DataPulse[] = []
let animationId: number | null = null

const config = {
  particleDensity: props.particleDensity,
  connectionDistance: props.connectionDistance,
  mouseDistance: props.mouseDistance,
  baseSpeed: 0.4,
  pulseChance: 0.0008,
  colors: {
    particleCore: '#64748b',      // Más claro
    particleGlow: '#cbd5e1',      // Mucho más brillante
    line: 'rgba(148, 163, 184, 0.25)',  // Líneas más visibles
    activeLine: 'rgba(34, 211, 238, 0.5)', // Líneas activas más brillantes
    pulse: '#22d3ee',
    processingGlow: '#0ea5e9'
  }
}

const mouse = { x: null as number | null, y: null as number | null }

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseSize: number
  currentSize: number
  isProcessing: boolean
  processingTimer: number

  constructor() {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.vx = (Math.random() - 0.5) * config.baseSpeed
    this.vy = (Math.random() - 0.5) * config.baseSpeed
    this.baseSize = Math.random() * 2.5 + 1.5
    this.currentSize = this.baseSize
    this.isProcessing = false
    this.processingTimer = 0
  }

  triggerProcessing() {
    this.isProcessing = true
    this.processingTimer = 1
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > width) this.vx *= -1
    if (this.y < 0 || this.y > height) this.vy *= -1

    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < config.mouseDistance) {
        const force = (config.mouseDistance - distance) / config.mouseDistance
        const powerForce = Math.pow(force, 2)
        
        this.vx += (dx / distance) * powerForce * 0.8
        this.vy += (dy / distance) * powerForce * 0.8
      }
    }

    this.vx *= 0.96
    this.vy *= 0.96

    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    if (speed < config.baseSpeed * 0.2) {
      this.vx += (Math.random() - 0.5) * 0.08
      this.vy += (Math.random() - 0.5) * 0.08
    }

    if (this.processingTimer > 0) {
      this.processingTimer -= 0.03
      this.currentSize = this.baseSize + (Math.sin(this.processingTimer * Math.PI) * 3)
    } else {
      this.processingTimer = 0
      this.isProcessing = false
      this.currentSize = this.baseSize
    }
  }

  draw() {
    if (!ctx) return

    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.currentSize * 1.5)
    
    if (this.isProcessing) {
      ctx.shadowBlur = 15 * this.processingTimer
      ctx.shadowColor = config.colors.processingGlow
      gradient.addColorStop(0, config.colors.pulse)
      gradient.addColorStop(1, config.colors.processingGlow)
    } else {
      ctx.shadowBlur = 0
      gradient.addColorStop(0, config.colors.particleGlow)
      gradient.addColorStop(1, config.colors.particleCore)
    }

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

class DataPulse {
  startNode: Particle
  endNode: Particle
  progress: number
  speed: number
  active: boolean
  history: Array<{ x: number; y: number }>

  constructor(startNode: Particle, endNode: Particle) {
    this.startNode = startNode
    this.endNode = endNode
    this.progress = 0
    this.speed = 0.03 + Math.random() * 0.04
    this.active = true
    this.history = []
  }

  update() {
    this.progress += this.speed
    
    const currX = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress
    const currY = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress
    
    this.history.unshift({ x: currX, y: currY })
    if (this.history.length > 5) this.history.pop()

    if (this.progress >= 1) {
      this.active = false
      this.endNode.triggerProcessing()
    }
  }

  draw() {
    if (!ctx || !this.active || this.history.length < 1) return

    for (let i = 0; i < this.history.length; i++) {
      const point = this.history[i]
      const opacity = 1 - (i / this.history.length)
      const size = 2.5 * opacity
      
      ctx.beginPath()
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
      ctx.fillStyle = config.colors.pulse
      ctx.shadowBlur = (i === 0) ? 12 : 2
      ctx.shadowColor = config.colors.pulse
      ctx.globalAlpha = opacity
      ctx.fill()
    }
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
  }
}

function resize() {
  if (!canvas.value) return
  
  width = canvas.value.width = canvas.value.offsetWidth
  height = canvas.value.height = canvas.value.offsetHeight
  initParticles()
}

function initParticles() {
  particles = []
  const count = (width * height) / config.particleDensity
  for (let i = 0; i < count; i++) {
    particles.push(new Particle())
  }
}

function animate() {
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)

  particles.forEach(p => p.update())

  // Draw connections
  ctx.beginPath()
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < config.connectionDistance) {
        ctx.strokeStyle = config.colors.line
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        
        if (Math.random() < config.pulseChance) {
          pulses.push(new DataPulse(particles[i], particles[j]))
        }
      }
    }
  }
  ctx.lineWidth = 1
  ctx.stroke()

  // Draw mouse connections
  if (mouse.x != null && mouse.y != null) {
    ctx.beginPath()
    ctx.shadowBlur = 8
    ctx.shadowColor = config.colors.activeLine
    particles.forEach(p => {
      const dx = mouse.x! - p.x
      const dy = mouse.y! - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < config.mouseDistance) {
        const opacity = 1 - (dist / config.mouseDistance)
        ctx!.globalAlpha = opacity
        ctx!.moveTo(p.x, p.y)
        ctx!.lineTo(mouse.x!, mouse.y!)
      }
    })
    ctx.strokeStyle = config.colors.activeLine
    ctx.lineWidth = 1.2
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }

  // Draw particles
  particles.forEach(p => p.draw())

  // Draw and update pulses
  pulses = pulses.filter(p => p.active)
  pulses.forEach(p => {
    p.update()
    p.draw()
  })

  animationId = requestAnimationFrame(animate)
}

function handleMouseMove(e: MouseEvent) {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

function handleMouseLeave() {
  mouse.x = null
  mouse.y = null
}

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    resize()
    animate()

    window.addEventListener('resize', resize)
    canvas.value.addEventListener('mousemove', handleMouseMove)
    canvas.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resize)
  if (canvas.value) {
    canvas.value.removeEventListener('mousemove', handleMouseMove)
    canvas.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})
</script>

<style scoped>
.brand-text {
  text-shadow: 0 0 10px rgba(0, 243, 255, 0.3), 0 0 30px rgba(0, 243, 255, 0.2);
}

.bg-gradient-radial {
  background: radial-gradient(circle at bottom left, #1e293b 0%, #0f172a 70%);
}

.z-1 {
  z-index: 1;
}

.z-2 {
  z-index: 2;
}
</style>
