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

const rootRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const isVisible = ref(false)
const hasRendered = ref(false)
const isBroken = ref(false)
// Durasi render dial-up yang snappy dan smooth (0.45s - 0.8s)
const renderTime = (Math.random() * 0.35 + 0.45).toFixed(2)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && rootRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting) {
          isVisible.value = true
          if (!hasRendered.value) {
            hasRendered.value = true
          }
          if (videoRef.value && videoRef.value.paused) {
            videoRef.value.play().catch(() => {})
          }
        } else {
          isVisible.value = false
          // Pause offscreen video agar hemat memori & GPU decoder!
          if (videoRef.value && !videoRef.value.paused) {
            videoRef.value.pause()
          }
        }
      },
      {
        rootMargin: '250px 250px 250px 250px',
        threshold: 0.01,
      }
    )
    observer.observe(rootRef.value)
  } else {
    isVisible.value = true
    hasRendered.value = true
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div
    v-if="!isBroken"
    ref="rootRef"
    :class="['work-item', { 'is-selected': isSelected }]"
    @click.stop="emit('select', work)"
  >
    <div class="img-container">
      <video
        v-if="work.type === 'video'"
        ref="videoRef"
        :src="isVisible || hasRendered ? work.src : undefined"
        preload="metadata"
        loop
        muted
        playsinline
        :class="['laggy-img', { 'is-loaded': hasRendered }]"
        :style="{ animationDuration: `${renderTime}s` }"
        @error="isBroken = true"
      />
      <img
        v-else
        :src="isVisible || hasRendered ? work.src : undefined"
        alt=""
        loading="lazy"
        decoding="async"
        draggable="false"
        :class="['laggy-img', { 'is-loaded': hasRendered }]"
        :style="{ animationDuration: `${renderTime}s` }"
        @error="isBroken = true"
      />
    </div>
  </div>
</template>
