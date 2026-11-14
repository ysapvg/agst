<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export interface WorkItem {
  id: number
  title: string
  src: string
  type: 'image' | 'video'
}

const props = defineProps<{
  work: WorkItem
  delay: number
  isSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', work: WorkItem): void
}>()

const isTriggered = ref(false)
const isBroken = ref(false)
const renderTime = (Math.random() * 1.6 + 1.1).toFixed(2)
let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  timer = setTimeout(() => {
    isTriggered.value = true
  }, props.delay)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div
    v-if="!isBroken"
    :class="['work-item', { 'is-selected': isSelected }]"
    @click.stop="emit('select', work)"
  >
    <div class="img-container">
      <video
        v-if="work.type === 'video'"
        :src="work.src"
        autoplay
        loop
        muted
        playsinline
        :class="['laggy-img', { 'is-loaded': isTriggered }]"
        :style="{ animationDuration: isTriggered ? `${renderTime}s` : '0s' }"
        @error="isBroken = true"
      />
      <img
        v-else
        :src="work.src"
        alt=""
        draggable="false"
        :class="['laggy-img', { 'is-loaded': isTriggered }]"
        :style="{ animationDuration: isTriggered ? `${renderTime}s` : '0s' }"
        @error="isBroken = true"
      />
    </div>
  </div>
</template>
