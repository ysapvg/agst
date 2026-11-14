<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'

const props = defineProps<{
  label: string
}>()

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________'
const displayText = ref(props.label)
let intervalId: ReturnType<typeof setInterval> | null = null

watch(
  () => props.label,
  (newVal) => {
    displayText.value = newVal
  }
)

const triggerScramble = () => {
  let iteration = 0
  // Proporsional supaya kata pendek maupun kalimat panjang tetap jalan ~9-11 frame di ~11 FPS (85ms/frame)
  const step = Math.max(0.35, props.label.length / 10)
  if (intervalId) clearInterval(intervalId)

  intervalId = setInterval(() => {
    displayText.value = props.label
      .split('')
      .map((char, index) => {
        if (index < Math.floor(iteration)) return props.label[index]
        if (char === ' ') return ' '
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      })
      .join('')

    if (iteration >= props.label.length) {
      displayText.value = props.label
      if (intervalId) clearInterval(intervalId)
    }
    iteration += step
  }, 85)
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <strong
    class="scramble-word"
    @mouseenter="triggerScramble"
    @touchstart="triggerScramble"
  >{{ displayText }}</strong>
</template>
