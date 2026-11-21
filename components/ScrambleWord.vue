<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'

const props = defineProps<{
  label: string
}>()

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________'
const displayText = ref(props.label)
const isScrambling = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

watch(
  () => props.label,
  (newVal) => {
    displayText.value = newVal
  }
)

const triggerScramble = () => {
  let iteration = 0
  const step = Math.max(0.45, props.label.length / 9)
  if (intervalId) clearInterval(intervalId)
  isScrambling.value = true

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
      isScrambling.value = false
      if (intervalId) clearInterval(intervalId)
    }
    iteration += step
  }, 42)
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <strong
    :class="['scramble-word', { 'is-scrambling': isScrambling }]"
    @mouseenter="triggerScramble"
    @touchstart="triggerScramble"
  >{{ displayText }}</strong>
</template>
