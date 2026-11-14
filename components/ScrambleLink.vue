<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const props = defineProps<{
  href: string
  label: string
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________'
const displayText = ref(props.label)
let intervalId: ReturnType<typeof setInterval> | null = null

const triggerScramble = () => {
  let iteration = 0
  if (intervalId) clearInterval(intervalId)

  intervalId = setInterval(() => {
    displayText.value = props.label
      .split('')
      .map((char, index) => {
        if (index < iteration) return props.label[index]
        if (char === ' ') return ' '
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      })
      .join('')

    if (iteration >= props.label.length) {
      if (intervalId) clearInterval(intervalId)
    }
    iteration += 0.5
  }, 30)
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <a
    :href="href"
    :target="href.startsWith('http') ? '_blank' : undefined"
    :rel="href.startsWith('http') ? 'noopener noreferrer' : undefined"
    @mouseenter="triggerScramble"
    @click="(e) => emit('click', e)"
  >
    {{ displayText }}
  </a>
</template>
