<template>
  <div :class="[sizeClass || 'text-4xl sm:text-5xl', 'font-bold text-primary dark:text-cyan-400 transition-colors duration-300']">
    <span v-if="prefix" class="mr-1">{{ prefix }}</span>
    <span ref="counterElement">{{ initialValue }}</span>
    <span v-if="suffix">{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
  startOnView?: boolean
  sizeClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  prefix: '',
  suffix: '',
  startOnView: true,
  sizeClass: ''
})

const counterElement = ref<HTMLElement | null>(null)
const initialValue = ref(0)
let observer: IntersectionObserver | null = null

const startCounter = () => {
  const startTime = performance.now()
  const startValue = 0
  const endValue = props.target

  function updateCounter(currentTime: number) {
    const progress = Math.min((currentTime - startTime) / props.duration, 1)
    const currentValue = Math.floor(progress * (endValue - startValue) + startValue)
    initialValue.value = currentValue

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  requestAnimationFrame(updateCounter)
}

onMounted(() => {
  if (!props.startOnView) {
    startCounter()
    return
  }

  // Use Intersection Observer to start animation when element is in viewport
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter()
        if (observer) {
          observer.unobserve(entry.target)
        }
      }
    })
  }, {
    threshold: 0.5
  })

  if (counterElement.value?.parentElement) {
    observer.observe(counterElement.value.parentElement)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
