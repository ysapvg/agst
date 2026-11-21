<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import type { WorkItem } from '~/components/LaggyMedia.vue'

type Lang = 'en' | 'zh' | 'jp'

// -----------------------------------------------------
// 1. DATABASE KARYA (GAMBAR ATAU VIDEO)
// -----------------------------------------------------
const WORKS_DATA: WorkItem[] = [
  { id: 1, title: 'DcvvqUtlBWc_1', src: '/works/DcvvqUtlBWc_1.webp', type: 'image' },
  { id: 2, title: 'DcvvqUtlBWc_2', src: '/works/DcvvqUtlBWc_2.webp', type: 'image' },
  { id: 3, title: 'Dctu_X7kqkS_1', src: '/works/Dctu_X7kqkS_1.webp', type: 'image' },
  { id: 4, title: 'Dctu_X7kqkS_2', src: '/works/Dctu_X7kqkS_2.webp', type: 'image' },
  { id: 5, title: 'DceeqC8k7An_1', src: '/works/DceeqC8k7An_1.webp', type: 'image' },
  { id: 6, title: 'DceeqC8k7An_2', src: '/works/DceeqC8k7An_2.webp', type: 'image' },
  { id: 7, title: 'DceeqC8k7An_3', src: '/works/DceeqC8k7An_3.webp', type: 'image' },
  { id: 8, title: 'DceeqC8k7An_4', src: '/works/DceeqC8k7An_4.webp', type: 'image' },
  { id: 10, title: 'DcWYQksk2yG_1', src: '/works/DcWYQksk2yG_1.webp', type: 'image' },
  { id: 13, title: 'DcRcOzeE1ju_1', src: '/works/DcRcOzeE1ju_1.webp', type: 'image' },
  { id: 14, title: 'DcRcOzeE1ju_2', src: '/works/DcRcOzeE1ju_2.webp', type: 'image' },
  { id: 15, title: 'DcRcOzeE1ju_3', src: '/works/DcRcOzeE1ju_3.webp', type: 'image' },
  { id: 16, title: 'DcRcOzeE1ju_4', src: '/works/DcRcOzeE1ju_4.webp', type: 'image' },
  { id: 17, title: 'DbBPByhE67J_1', src: '/works/DbBPByhE67J_1.mp4', type: 'video' },
  { id: 18, title: 'DbBPByhE67J_2', src: '/works/DbBPByhE67J_2.mp4', type: 'video' },
  { id: 19, title: 'DaxTcwUzrUK', src: '/works/DaxTcwUzrUK.mp4', type: 'video' },
  { id: 20, title: 'DaYfqYNzY_h', src: '/works/DaYfqYNzY_h.mp4', type: 'video' },
  { id: 21, title: 'DaJES14E7LI_1', src: '/works/DaJES14E7LI_1.webp', type: 'image' },
  { id: 22, title: 'DaJES14E7LI_2', src: '/works/DaJES14E7LI_2.webp', type: 'image' },
  { id: 23, title: 'DZUMrO6zxTL', src: '/works/DZUMrO6zxTL.mp4', type: 'video' },
  { id: 24, title: 'DXhs8dokx3s', src: '/works/DXhs8dokx3s.mp4', type: 'video' },
  { id: 25, title: 'DOknNZek9g3_1', src: '/works/DOknNZek9g3_1.mp4', type: 'video' },
  { id: 26, title: 'DOknNZek9g3_2', src: '/works/DOknNZek9g3_2.webp', type: 'image' },
  { id: 27, title: 'DOOr8mOExFG_1', src: '/works/DOOr8mOExFG_1.webp', type: 'image' },
  { id: 28, title: 'DOOr8mOExFG_2', src: '/works/DOOr8mOExFG_2.webp', type: 'image' },
  { id: 29, title: 'DOOr8mOExFG_3', src: '/works/DOOr8mOExFG_3.webp', type: 'image' },
  { id: 30, title: 'C_9n83kTaqM_1', src: '/works/C_9n83kTaqM_1.webp', type: 'image' },
  { id: 31, title: 'C_9n83kTaqM_2', src: '/works/C_9n83kTaqM_2.webp', type: 'image' },
  { id: 32, title: 'C3zK76Hrxqr_1', src: '/works/C3zK76Hrxqr_1.webp', type: 'image' },
  { id: 33, title: 'C3zK76Hrxqr_2', src: '/works/C3zK76Hrxqr_2.webp', type: 'image' },
  { id: 34, title: 'C3zK76Hrxqr_3', src: '/works/C3zK76Hrxqr_3.webp', type: 'image' },
  { id: 35, title: 'C3zK76Hrxqr_4', src: '/works/C3zK76Hrxqr_4.webp', type: 'image' },
  { id: 36, title: 'C3zK76Hrxqr_5', src: '/works/C3zK76Hrxqr_5.webp', type: 'image' },
  { id: 37, title: 'C3iWs-qPq9f_1', src: '/works/C3iWs-qPq9f_1.webp', type: 'image' },
  { id: 38, title: 'C3iWs-qPq9f_2', src: '/works/C3iWs-qPq9f_2.webp', type: 'image' },
  { id: 39, title: 'C3iWs-qPq9f_3', src: '/works/C3iWs-qPq9f_3.webp', type: 'image' },
  { id: 40, title: 'C3fTzusLzZz', src: '/works/C3fTzusLzZz.webp', type: 'image' },
  { id: 41, title: 'C3fKAuRLm_u', src: '/works/C3fKAuRLm_u.webp', type: 'image' },
  { id: 42, title: 'CvuHQWVLnLf_1', src: '/works/CvuHQWVLnLf_1.webp', type: 'image' },
  { id: 43, title: 'CvuHQWVLnLf_2', src: '/works/CvuHQWVLnLf_2.mp4', type: 'video' },
  { id: 44, title: 'CuzsJsshBfX_1', src: '/works/CuzsJsshBfX_1.webp', type: 'image' },
  { id: 45, title: 'CuzsJsshBfX_2', src: '/works/CuzsJsshBfX_2.webp', type: 'image' },
  { id: 46, title: 'CuzFv2RJZIO_1', src: '/works/CuzFv2RJZIO_1.webp', type: 'image' },
  { id: 47, title: 'CuzFv2RJZIO_2', src: '/works/CuzFv2RJZIO_2.webp', type: 'image' },
  { id: 48, title: 'CuRynj2JCvx', src: '/works/CuRynj2JCvx.mp4', type: 'video' },
  { id: 49, title: 'CuE65yVJjI9', src: '/works/CuE65yVJjI9.mp4', type: 'video' },
  { id: 50, title: 'CsNs7NdLf3o_1', src: '/works/CsNs7NdLf3o_1.webp', type: 'image' },
  { id: 51, title: 'CsNs7NdLf3o_2', src: '/works/CsNs7NdLf3o_2.webp', type: 'image' },
  { id: 52, title: 'Cr027ELpkeF_1', src: '/works/Cr027ELpkeF_1.webp', type: 'image' },
  { id: 53, title: 'Cr027ELpkeF_2', src: '/works/Cr027ELpkeF_2.webp', type: 'image' },
  { id: 54, title: 'CqvlRs0A2Tz', src: '/works/CqvlRs0A2Tz.mp4', type: 'video' },
  { id: 55, title: 'CqFPz95r0Dd_1', src: '/works/CqFPz95r0Dd_1.webp', type: 'image' },
  { id: 56, title: 'CqFPz95r0Dd_2', src: '/works/CqFPz95r0Dd_2.webp', type: 'image' },
  { id: 57, title: 'CpAaA0rJHQa', src: '/works/CpAaA0rJHQa.mp4', type: 'video' },
  { id: 58, title: 'CjM2148vdz1', src: '/works/CjM2148vdz1.mp4', type: 'video' },
  { id: 59, title: 'ChC1ITcp_L4', src: '/works/ChC1ITcp_L4.mp4', type: 'video' },
  { id: 60, title: 'CeG1MY_JRqJ_1', src: '/works/CeG1MY_JRqJ_1.webp', type: 'image' },
  { id: 61, title: 'CeG1MY_JRqJ_2', src: '/works/CeG1MY_JRqJ_2.webp', type: 'image' },
  { id: 62, title: 'CeG1MY_JRqJ_3', src: '/works/CeG1MY_JRqJ_3.webp', type: 'image' },
  { id: 63, title: 'CeGJHcLrm6-_1', src: '/works/CeGJHcLrm6-_1.webp', type: 'image' },
  { id: 64, title: 'CeGJHcLrm6-_2', src: '/works/CeGJHcLrm6-_2.webp', type: 'image' },
  { id: 65, title: 'CdK3ZBvppOR_1', src: '/works/CdK3ZBvppOR_1.mp4', type: 'video' },
  { id: 66, title: 'CdK3ZBvppOR_2', src: '/works/CdK3ZBvppOR_2.mp4', type: 'video' },
  { id: 67, title: 'CbXv9UqpTB-_1', src: '/works/CbXv9UqpTB-_1.webp', type: 'image' },
  { id: 68, title: 'CbXv9UqpTB-_2', src: '/works/CbXv9UqpTB-_2.webp', type: 'image' },
  { id: 69, title: 'CbXv9UqpTB-_3', src: '/works/CbXv9UqpTB-_3.webp', type: 'image' },
  { id: 70, title: 'CbXv9UqpTB-_4', src: '/works/CbXv9UqpTB-_4.webp', type: 'image' },
  { id: 71, title: 'CY3TIwaLUq__1', src: '/works/CY3TIwaLUq__1.jpg', type: 'image' },
  { id: 72, title: 'CY3TIwaLUq__2', src: '/works/CY3TIwaLUq__2.jpg', type: 'image' },
  { id: 73, title: 'CY3TIwaLUq__3', src: '/works/CY3TIwaLUq__3.jpg', type: 'image' },
  { id: 74, title: 'CY3TIwaLUq__4', src: '/works/CY3TIwaLUq__4.jpg', type: 'image' },
  { id: 75, title: 'CY3TIwaLUq__5', src: '/works/CY3TIwaLUq__5.jpg', type: 'image' },
  { id: 76, title: 'CY1Zz_jJszA_1', src: '/works/CY1Zz_jJszA_1.jpg', type: 'image' },
  { id: 77, title: 'CY1Zz_jJszA_2', src: '/works/CY1Zz_jJszA_2.jpg', type: 'image' },
  { id: 78, title: 'CXFpYLxJ4H__1', src: '/works/CXFpYLxJ4H__1.mp4', type: 'video' },
  { id: 79, title: 'CXFpYLxJ4H__2', src: '/works/CXFpYLxJ4H__2.jpg', type: 'image' },
  { id: 80, title: 'CSGQsV-BTAD_1', src: '/works/CSGQsV-BTAD_1.jpg', type: 'image' },
  { id: 81, title: 'CSGQsV-BTAD_2', src: '/works/CSGQsV-BTAD_2.jpg', type: 'image' },
  { id: 82, title: 'CQFYDARLutE', src: '/works/CQFYDARLutE.jpg', type: 'image' },
]

// Digandakan 2x untuk infinite loop mulus (total 164 item dari 82 karya asli @ysapvg.00)
const LOOP_WORKS = computed(() => [
  ...WORKS_DATA.map((w, idx) => ({ ...w, uid: `a-${w.id}-${idx}`, delay: (idx % 12) * 85 + 60 })),
  ...WORKS_DATA.map((w, idx) => ({ ...w, uid: `b-${w.id}-${idx}`, delay: (idx % 12) * 85 + 60 })),
])

// -----------------------------------------------------
// 2. STATE & INTERAKSI
// -----------------------------------------------------
const lang = ref<Lang>('en')
const showWorks = ref(false)
const highlightedWork = ref<WorkItem | null>(null)

// --- MARQUEE HORIZONTAL (KANAN KE KIRI + STOP SAAT MOUSE DEKAT + DRAG MAJU/MUNDUR) ---
const stripViewportRef = ref<HTMLElement | null>(null)
const stripTrackRef = ref<HTMLElement | null>(null)
const isMouseNear = ref(false)
const isDragging = ref(false)
const hasDragged = ref(false)
const translateX = ref(0)

const BASE_SPEED = 0.75 // Kecepatan jalan lambat dari kanan ke kiri (px per frame)
let currentSpeed = BASE_SPEED
let inertiaVelocity = 0
let dragStartX = 0
let dragStartTranslateX = 0
let lastDragX = 0
let rafId: number | null = null

const wrapTranslateX = () => {
  if (!stripTrackRef.value) return
  const setWidth = stripTrackRef.value.scrollWidth / 2
  if (setWidth <= 0) return

  // Biar digeser ke kanan (mundur) atau ke kiri (maju) tetap nyambung tanpa batas (infinite loop)
  while (translateX.value > 0) {
    translateX.value -= setWidth
  }
  while (translateX.value <= -setWidth) {
    translateX.value += setWidth
  }
}

const tickMarquee = () => {
  if (showWorks.value && stripTrackRef.value) {
    if (isDragging.value) {
      currentSpeed = 0
    } else {
      // Kalau habis di-drag ada sisa lemparan (inertia), jalankan perlahan sampai habis
      if (Math.abs(inertiaVelocity) > 0.05) {
        translateX.value += inertiaVelocity
        inertiaVelocity *= 0.92
        wrapTranslateX()
      } else {
        inertiaVelocity = 0
      }

      // Berhenti halus kalau mouse dekat ke area strip atau ada poster yang lagi di-highlight
      const shouldPause = isMouseNear.value || highlightedWork.value !== null
      const targetSpeed = shouldPause ? 0 : BASE_SPEED
      currentSpeed += (targetSpeed - currentSpeed) * 0.08

      if (currentSpeed > 0.005) {
        translateX.value -= currentSpeed
        wrapTranslateX()
      }
    }
  }
  rafId = requestAnimationFrame(tickMarquee)
}

const onDragStart = (e: MouseEvent) => {
  if (e.button !== 0) return // Hanya klik kiri
  isDragging.value = true
  hasDragged.value = false
  inertiaVelocity = 0
  dragStartX = e.clientX
  lastDragX = e.clientX
  dragStartTranslateX = translateX.value
}

const onTouchStart = (e: TouchEvent) => {
  if (!e.touches.length) return
  isMouseNear.value = true
  isDragging.value = true
  hasDragged.value = false
  inertiaVelocity = 0
  dragStartX = e.touches[0].clientX
  lastDragX = e.touches[0].clientX
  dragStartTranslateX = translateX.value
}

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || !e.touches.length) return
  const clientX = e.touches[0].clientX
  const delta = clientX - dragStartX
  if (Math.abs(delta) > 6) {
    hasDragged.value = true
  }
  inertiaVelocity = (clientX - lastDragX) * 0.85
  lastDragX = clientX
  translateX.value = dragStartTranslateX + delta
  wrapTranslateX()
}

const onTouchEnd = () => {
  isDragging.value = false
  setTimeout(() => {
    isMouseNear.value = false
  }, 400)
}

const onStripWheel = (e: WheelEvent) => {
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  translateX.value -= delta * 0.75
  wrapTranslateX()
}

const handleGlobalMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    const delta = e.clientX - dragStartX
    if (Math.abs(delta) > 6) {
      hasDragged.value = true
    }
    inertiaVelocity = (e.clientX - lastDragX) * 0.85
    lastDragX = e.clientX
    translateX.value = dragStartTranslateX + delta
    wrapTranslateX()
    return
  }

  if (!showWorks.value || !stripViewportRef.value) {
    isMouseNear.value = false
    return
  }
  const rect = stripViewportRef.value.getBoundingClientRect()
  // Radius kedekatan mouse (85px di atas/bawah area strip poster)
  const proximityPadding = 85
  const isNearVertically =
    e.clientY >= rect.top - proximityPadding &&
    e.clientY <= rect.bottom + proximityPadding
  const isNearHorizontally = e.clientX >= 0 && e.clientX <= window.innerWidth

  isMouseNear.value = isNearVertically && isNearHorizontally
}

const handleGlobalMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && highlightedWork.value) {
    highlightedWork.value = null
  }
}

onMounted(() => {
  rafId = requestAnimationFrame(tickMarquee)
  window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
  window.addEventListener('mouseup', handleGlobalMouseUp)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  window.removeEventListener('mousemove', handleGlobalMouseMove)
  window.removeEventListener('mouseup', handleGlobalMouseUp)
  window.removeEventListener('keydown', handleKeyDown)
})

const handleSelectWork = (work: WorkItem) => {
  // Kalau barusan nge-drag geser poster, jangan dianggap klik buka highlight
  if (hasDragged.value) {
    hasDragged.value = false
    return
  }
  if (highlightedWork.value?.id === work.id) {
    highlightedWork.value = null
  } else {
    highlightedWork.value = work
  }
}

const closeHighlight = () => {
  highlightedWork.value = null
}

// Warna acak saat teks di-hover
const chaosBlendColors = ['#6ccc15', '#ffff00', '#ef467e', '#00a5ff', '#13b766']

const handleColorActive = (e: Event) => {
  const target = e.currentTarget as HTMLElement | null
  if (target) {
    target.style.color = chaosBlendColors[Math.floor(Math.random() * chaosBlendColors.length)]
  }
}

const handleColorReset = (e: Event) => {
  const target = e.currentTarget as HTMLElement | null
  if (target) {
    target.style.color = '#ffffff'
  }
}

const handleWorksClick = async (e: Event) => {
  e.preventDefault()
  showWorks.value = !showWorks.value
  if (!showWorks.value) {
    highlightedWork.value = null
  } else {
    await nextTick()
  }
}
</script>

<template>
  <div :class="['page-stage', { 'has-works-open': showWorks }]">
    <!-- DOCK KIRI BAWAH: BGM YOUTUBE -->
    <div class="bottom-left-dock">
      <BgmPlayer />
    </div>

    <div class="container">
      <!-- AREA UTAMA -->
      <div class="overlap-zone">
        <!-- HERO LOOP VIDEO (LEBIH BESAR & DOMINAN) -->
        <div class="hero-video-box">
          <video
            src="/hero-loop.mp4"
            autoplay
            loop
            muted
            playsinline
            class="hero-loop-video"
          />
        </div>

        <!-- KONTEN UTAMA & NAVIGASI -->
        <div class="overlap-text-layer">
          <!-- LANGUAGE SWITCHER -->
          <div class="lang-switcher sys-text">
            <a
              href="#"
              :class="{ active: lang === 'en' }"
              @click.prevent="lang = 'en'"
            >[ en ]</a>
            <span class="lang-divider">/</span>
            <a
              href="#"
              :class="{ active: lang === 'zh' }"
              @click.prevent="lang = 'zh'"
            >[ 中 ]</a>
            <span class="lang-divider">/</span>
            <a
              href="#"
              :class="{ active: lang === 'jp' }"
              @click.prevent="lang = 'jp'"
            >[ 日 ]</a>
          </div>

          <!-- KONTEN UTAMA (OVERLAP DI ATAS LOGO) -->
          <main class="content">
            <div v-if="lang === 'en'" id="content-en">
              <p
                @mouseenter="handleColorActive"
                @mouseleave="handleColorReset"
                @touchstart="handleColorActive"
                @touchend="handleColorReset"
              >
                what does <ScrambleWord label="ysagst" /> even mean? it’s an acronym of (<ScrambleWord label="yves saint agung soeltani" /> wkwkwk) but actually it’s basically just me keeping track of things (idk why but yeah) under the moniker <ScrambleWord label="visual&visual" />.
              </p>
              <p
                @mouseenter="handleColorActive"
                @mouseleave="handleColorReset"
                @touchstart="handleColorActive"
                @touchend="handleColorReset"
              >
                not a proper showcase tbh... just an ongoing experiment (or whatever). it’s a relaxed spot to play around with graphic designs, raw video treatments, and digital layouts (no rules here wkwk).
              </p>
              <p
                @mouseenter="handleColorActive"
                @mouseleave="handleColorReset"
                @touchstart="handleColorActive"
                @touchend="handleColorReset"
              >
                think of it as a <ScrambleWord label="raw" /> and <ScrambleWord label="brutalist" /> sketchbook of ideas before they end up on my <ScrambleLink href="https://www.instagram.com/ysapvg.00/" label="@instagram" /> (i'll be posting more here wkwk... hopefully).
              </p>
            </div>

            <div v-else-if="lang === 'zh'" id="content-zh">
              <p
                @mouseenter="handleColorActive"
                @mouseleave="handleColorReset"
                @touchstart="handleColorActive"
                @touchend="handleColorReset"
              >
                <ScrambleWord label="ysagst" /> 到底是什么意思？其实就是（<ScrambleWord label="yves saint agung soeltani" /> wkwkwk）的缩写，但说白了就是我用 <ScrambleWord label="visual&visual" /> 这个名字随便记录点东西的地方（我都不知道为什么 tbh wkwk）。
              </p>
              <p
                @mouseenter="handleColorActive"
                @mouseleave="handleColorReset"
                @touchstart="handleColorActive"
                @touchend="handleColorReset"
              >
                算不上什么正式的作品集... 充其量是个乱搞的实验空间（或者别的什么鬼 idk）。随便玩玩平面设计、粗糙的视频处理、还有排版（反正没规矩 wkwk）。
              </p>
              <p
                @mouseenter="handleColorActive"
                @mouseleave="handleColorReset"
                @touchstart="handleColorActive"
                @touchend="handleColorReset"
              >
                当作一个<ScrambleWord label="粗犷" />又<ScrambleWord label="野兽派" />的草稿本看就行，反正都是发到 <ScrambleLink href="https://www.instagram.com/ysapvg.00/" label="@instagram" /> 前的废稿（我之后会多发点东西的 wkwk... 大概吧）。
              </p>
            </div>

            <div v-else-if="lang === 'jp'" id="content-jp">
              <p
                @mouseenter="handleColorActive"
                @mouseleave="handleColorReset"
                @touchstart="handleColorActive"
                @touchend="handleColorReset"
              >
                <ScrambleWord label="ysagst" /> ってそもそも何？実は（<ScrambleWord label="yves saint agung soeltani" /> wkwkwk）の略なんですが、実際には <ScrambleWord label="visual&visual" /> って名義で色々メモしてるだけの場所です（なんでか知らんけど wkwk）。
              </p>
              <p
                @mouseenter="handleColorActive"
                @mouseleave="handleColorReset"
                @touchstart="handleColorActive"
                @touchend="handleColorReset"
              >
                きちんとしたポートフォリオとかじゃなくて tbh... ただの実験場（or whatever）。グラフィックとか未加工の動画とかレイアウトとか、ルールなしで適当に遊んでるだけ（マジで自由 wkwk）。
              </p>
              <p
                @mouseenter="handleColorActive"
                @mouseleave="handleColorReset"
                @touchstart="handleColorActive"
                @touchend="handleColorReset"
              >
                <ScrambleLink href="https://www.instagram.com/ysapvg.00/" label="@instagram" /> に投げる前の、<ScrambleWord label="生々しくて" /><ScrambleWord label="ブルータリズム" />なスケッチブックだと思ってください（ここにももっと投稿する予定 wkwk... たぶん）。
              </p>
            </div>
          </main>

          <!-- LINKS & BUTTONS DENGAN SCRAMBLE EFFECT -->
          <div class="links-section sys-text">
            <ul class="inline-links">
              <li>
                <ScrambleLink href="https://www.instagram.com/ysapvg.00/" label=">> instagram" />
              </li>
              <li>
                <ScrambleLink href="https://twitter.com/agungxsoeltani" label=">> x/twitter" />
              </li>
              <li>
                <ScrambleLink href="#works" label=">> works" @click="handleWorksClick" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- HORIZONTAL STREAM (KANAN KE KIRI LAMBAT, BERHENTI PAS MOUSE DEKAT, BISA DI-DRAG MAJU/MUNDUR) -->
      <div
        v-if="showWorks"
        id="works-gallery"
        ref="stripViewportRef"
        :class="['works-strip-viewport', { 'is-dragging': isDragging }]"
        @mouseenter="isMouseNear = true"
        @mouseleave="isMouseNear = false"
        @mousedown="onDragStart"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
        @wheel.prevent="onStripWheel"
      >
        <div
          ref="stripTrackRef"
          class="works-strip-track"
          :style="{ transform: `translate3d(${translateX}px, 0, 0)` }"
        >
          <LaggyMedia
            v-for="item in LOOP_WORKS"
            :key="item.uid"
            :work="item"
            :delay="item.delay"
            :is-selected="highlightedWork?.id === item.id"
            @select="handleSelectWork"
          />
        </div>
      </div>
    </div>

    <!-- HIGHLIGHT POSTER OVERLAY (SELURUH LAYAR LAINNYA BLUR) -->
    <Transition name="poster-focus">
      <div
        v-if="highlightedWork"
        class="poster-blur-overlay"
        @click="closeHighlight"
      >
        <div class="poster-highlight-stage" @click.stop="closeHighlight">
          <video
            v-if="highlightedWork.type === 'video'"
            :key="highlightedWork.src"
            :src="highlightedWork.src"
            autoplay
            loop
            controls
            playsinline
            class="highlighted-raw-media"
          />
          <img
            v-else
            :key="highlightedWork.src"
            :src="highlightedWork.src"
            :alt="highlightedWork.title"
            class="highlighted-raw-media"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>
