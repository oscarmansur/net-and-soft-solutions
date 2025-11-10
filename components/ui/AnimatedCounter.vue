<template>
  <div class="text-4xl font-bold text-primary">
    <span v-if="prefix" class="mr-1">{{ prefix }}</span>
    <span ref="counterElement">{{ initialValue }}</span>
    <span v-if="suffix">{{ suffix }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  target: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 2000
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  startOnView: {
    type: Boolean,
    default: true
  }
})

const counterElement = ref(null)
const initialValue = ref(0)
let observer = null

const startCounter = () => {
  const startTime = performance.now()
  const endTime = startTime + props.duration
  const startValue = 0
  const endValue = props.target

  function updateCounter(currentTime) {
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

  if (counterElement.value) {
    observer.observe(counterElement.value.parentElement)
  }

  return () => {
    if (observer) {
      observer.disconnect()
    }
  }
})
</script>
