<template>
  <div 
    ref="card"
    class="card aspect-square rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 p-8 shadow-large overflow-hidden flex items-center justify-center"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @mouseover="handleMouseOver"
  >
    <div class="reflection" ref="refl"></div>
    <img
      :src="imageSrc"
      :alt="imageAlt"
      class="w-full h-full object-contain"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    required: true
  }
})

const card = ref<HTMLElement | null>(null)
const refl = ref<HTMLElement | null>(null)

const scale = (val: number, inMin: number, inMax: number, outMin: number, outMax: number): number => 
  outMin + (val - inMin) * (outMax - outMin) / (inMax - inMin)

const handleMouseOver = () => {
  if (refl.value) {
    refl.value.style.opacity = '1'
  }
}

const handleMouseLeave = () => {
  if (card.value) {
    card.value.style.transform = 'perspective(500px) scale(1)'
  }
  if (refl.value) {
    refl.value.style.opacity = '0'
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!card.value || !refl.value) return

  const rect = card.value.getBoundingClientRect()
  const relX = (event.clientX - rect.left) / rect.width
  const relY = (event.clientY - rect.top) / rect.height
  
  const rotY = `rotateY(${(relX - 0.5) * 20}deg)`
  const rotX = `rotateX(${(relY - 0.5) * -20}deg)`
  card.value.style.transform = `perspective(500px) scale(1.05) ${rotY} ${rotX}`

  const lightX = scale(relX, 0, 1, 150, -50)
  const lightY = scale(relY, 0, 1, 30, -100)
  const lightConstrain = Math.min(Math.max(relY, 0.3), 0.7)
  const lightOpacity = scale(lightConstrain, 0.3, 1, 1, 0) * 255
  const lightShade = `rgba(${lightOpacity}, ${lightOpacity}, ${lightOpacity}, 1)`
  const lightShadeBlack = `rgba(0, 0, 0, 1)`
  refl.value.style.backgroundImage = `radial-gradient(circle at ${lightX}% ${lightY}%, ${lightShade} 20%, ${lightShadeBlack})`
}
</script>

<style scoped>
/* 3D Card Effect Styles */
.card {
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0);
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.card:hover {
  transform: perspective(500px) scale(1.05);
  z-index: 2;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.reflection {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  left: 0;
  top: 0;
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: soft-light;
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>
