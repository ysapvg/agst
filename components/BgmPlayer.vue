<script setup lang="ts">
import { ref, onMounted } from 'vue'

const YOUTUBE_VIDEO_ID = 'm0nSqRV-QSk'

const isPlaying = ref(false)
const volume = ref(75)
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

  const initPlayer = () => {
    new (window as any).YT.Player('yt-player-container', {
      height: '100%',
      width: '100%',
      videoId: YOUTUBE_VIDEO_ID,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          ytPlayer.value = event.target
          ytPlayer.value.setVolume(volume.value)
        },
        onStateChange: (event: any) => {
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
          if (event.data === 1) {
            isPlaying.value = true
          } else if (event.data === 2 || event.data === 0) {
            isPlaying.value = false
          }
        },
      },
    })
  }

  if ((window as any).YT && (window as any).YT.Player) {
    initPlayer()
  } else {
    if (!(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
    }
    ;(window as any).onYouTubeIframeAPIReady = () => {
      initPlayer()
    }
  }
})

const togglePlay = (e: Event) => {
  e.preventDefault()
  if (!ytPlayer.value || typeof ytPlayer.value.getPlayerState !== 'function') return

  const state = ytPlayer.value.getPlayerState()
  if (state === 1) {
    ytPlayer.value.pauseVideo()
    isPlaying.value = false
  } else {
    ytPlayer.value.setVolume(volume.value)
    ytPlayer.value.playVideo()
    isPlaying.value = true
  }
}

const handleVolumeChange = () => {
  if (ytPlayer.value && typeof ytPlayer.value.setVolume === 'function') {
    ytPlayer.value.setVolume(volume.value)
  }
}
</script>

<template>
  <div class="bgm-root">
    <!-- FULLSCREEN LOW-OPACITY BACKGROUND VIDEO SAAT MUSIK PLAY -->
    <Teleport to="body">
      <div
        :class="['yt-bg-video-stage', { 'is-active': isPlaying }]"
        aria-hidden="true"
      >
        <div class="yt-bg-video-Aspect">
          <div id="yt-player-container"></div>
        </div>
      </div>
    </Teleport>

    <!-- MINIMALIST BORDERLESS VINYL PLAYER + VOLUME SLIDER -->
    <div class="bgm-minimal-wrap">
      <div class="bgm-minimal" @click="togglePlay">
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

      <!-- SLIDER VOLUME -->
      <div class="bgm-volume-control" @click.stop @mousedown.stop @touchstart.stop>
        <label class="bgm-vol-label">vol</label>
        <input
          v-model.number="volume"
          type="range"
          min="0"
          max="100"
          step="1"
          class="minimal-slider bgm-vol-slider"
          title="volume"
          @input="handleVolumeChange"
        />
      </div>
    </div>
  </div>
</template>
