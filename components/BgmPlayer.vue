<script setup lang="ts">
import { ref, onMounted } from 'vue'

const YOUTUBE_VIDEO_ID = 'm0nSqRV-QSk'

const isPlaying = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ytPlayer = ref<any>(null)
const trackInfo = ref({ title: 'LOADING...', author: '' })

onMounted(() => {
  fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.title) {
        trackInfo.value = {
          title: data.title.toLowerCase(),
          author: data.author_name ? data.author_name.toLowerCase() : '',
        }
      }
    })
    .catch((err) => console.error('Error fetching YT data', err))

  if (!(window as any).YT) {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
  }

  ;(window as any).onYouTubeIframeAPIReady = () => {
    new (window as any).YT.Player('yt-player-container', {
      height: '0',
      width: '0',
      videoId: YOUTUBE_VIDEO_ID,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
      },
      events: {
        onReady: (event: any) => {
          ytPlayer.value = event.target
        },
      },
    })
  }
})

const togglePlay = (e: Event) => {
  e.preventDefault()
  if (!ytPlayer.value) return

  const state = ytPlayer.value.getPlayerState()
  if (state === 1) {
    ytPlayer.value.pauseVideo()
    isPlaying.value = false
  } else {
    ytPlayer.value.playVideo()
    isPlaying.value = true
  }
}
</script>

<template>
  <div>
    <div id="yt-player-container" style="display: none"></div>

    <!-- MINIMALIST BORDERLESS VINYL PLAYER -->
    <div class="bgm-minimal" @click="togglePlay" @touchstart="togglePlay">
      <button
        :class="['vinyl-disc', { 'is-playing': isPlaying }]"
        :title="isPlaying ? 'pause' : 'play'"
        aria-label="Toggle music"
      >
        <img
          :src="`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`"
          alt="vinyl"
        />
        <div class="vinyl-center-hole"></div>
      </button>

      <div :class="['bgm-track-wrap', { 'is-active': isPlaying }]">
        <div class="bgm-track-marquee">
          <span>
            {{ trackInfo.title }}<template v-if="trackInfo.author"> — {{ trackInfo.author }}</template>
            &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;
            {{ trackInfo.title }}<template v-if="trackInfo.author"> — {{ trackInfo.author }}</template>
            &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
