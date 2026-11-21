<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// ---------------------------------------------------------------------------
// DAFTAR PLAYLIST YOUTUBE (Bisa masukin Video ID atau Link YouTube langsung!)
// Tinggal tambah/ganti link atau ID di bawah ini sesuka hati:
// ---------------------------------------------------------------------------
const PLAYLIST_TRACKS: string[] = [
  'KLVvsHcpZb8', // Track 1 (default)
  'oR30PyN0CPg', // Track 2 (lofi hip hop radio / chill)
  'sKJvJCsey84', // Track 3 (synthwave / dark ambient)
]

// Helper: otomatis ekstrak ID kalau yang dimasukin link penuh (youtube.com/watch?v=... atau youtu.be/...)
const extractVideoId = (input: string): string => {
  const trimmed = input.trim()
  const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = trimmed.match(regExp)
  return match ? match[1] : trimmed
}

const normalizedTracks = computed(() => PLAYLIST_TRACKS.map(extractVideoId))
const currentIndex = ref(0)
const currentVideoId = computed(() => normalizedTracks.value[currentIndex.value] || 'm0nSqRV-QSk')

const isPlaying = ref(false)
const isControlsOpen = ref(false) // Umpetin volume & ganti lagu sampai dibuka
const volume = ref(75)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ytPlayer = ref<any>(null)
const trackInfo = ref({ title: 'loading...', author: '' })

const fetchTrackMetadata = (videoId: string) => {
  trackInfo.value = { title: 'loading...', author: '' }
  fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.title) {
        trackInfo.value = {
          title: data.title.toLowerCase(),
          author: data.author_name ? data.author_name.toLowerCase() : '',
        }
      } else {
        trackInfo.value = { title: `track 0${currentIndex.value + 1}`, author: '' }
      }
    })
    .catch(() => {
      trackInfo.value = { title: `track 0${currentIndex.value + 1}`, author: '' }
    })
}

watch(currentVideoId, (newId) => {
  fetchTrackMetadata(newId)
})

onMounted(() => {
  fetchTrackMetadata(currentVideoId.value)

  const initPlayer = () => {
    new (window as any).YT.Player('yt-player-container', {
      height: '100%',
      width: '100%',
      videoId: currentVideoId.value,
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
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          ytPlayer.value = event.target
          ytPlayer.value.setVolume(volume.value)
        },
        onStateChange: (event: any) => {
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED (otomatis lanjut lagu berikutnya!)
          if (event.data === 1) {
            isPlaying.value = true
          } else if (event.data === 2) {
            isPlaying.value = false
          } else if (event.data === 0) {
            nextTrack(true)
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

  window.addEventListener('click', handleDocClick)
  window.addEventListener('touchstart', handleDocClick, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('click', handleDocClick)
  window.removeEventListener('touchstart', handleDocClick)
})

const handleDocClick = (e: Event) => {
  if (!isControlsOpen.value) return
  const target = e.target as HTMLElement | null
  if (target && !target.closest('.bottom-left-dock')) {
    isControlsOpen.value = false
  }
}

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

const loadCurrentTrack = (autoPlayAfterLoad = true) => {
  if (!ytPlayer.value || typeof ytPlayer.value.loadVideoById !== 'function') return
  if (autoPlayAfterLoad || isPlaying.value) {
    ytPlayer.value.loadVideoById(currentVideoId.value)
    ytPlayer.value.setVolume(volume.value)
    isPlaying.value = true
  } else {
    ytPlayer.value.cueVideoById(currentVideoId.value)
  }
}

const nextTrack = (forcePlay = false) => {
  currentIndex.value = (currentIndex.value + 1) % normalizedTracks.value.length
  loadCurrentTrack(forcePlay || isPlaying.value)
}

const prevTrack = () => {
  currentIndex.value =
    (currentIndex.value - 1 + normalizedTracks.value.length) % normalizedTracks.value.length
  loadCurrentTrack(isPlaying.value)
}

const handleVolumeChange = () => {
  if (ytPlayer.value && typeof ytPlayer.value.setVolume === 'function') {
    ytPlayer.value.setVolume(volume.value)
  }
}
</script>

<template>
  <div class="bgm-root">
    <!-- HIDDEN AUDIO-ONLY YOUTUBE PLAYER (TIDAK MUNCUL DI BACKGROUND) -->
    <div id="yt-player-container" class="yt-audio-only" aria-hidden="true"></div>

    <!-- MINIMALIST BORDERLESS VINYL PLAYER + HIDDEN VOLUME/PLAYLIST PANEL -->
    <div :class="['bgm-minimal-wrap', { 'is-open': isControlsOpen }]">
      <div class="bgm-minimal">
        <!-- KLIK PIRINGAN VINYL = PLAY / PAUSE -->
        <button
          :class="['vinyl-disc', { 'is-playing': isPlaying }]"
          :title="isPlaying ? 'pause music' : 'play music'"
          aria-label="Toggle music"
          @click="togglePlay"
        >
          <img
            :src="`https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`"
            alt="vinyl"
          />
          <div class="vinyl-center-hole"></div>
        </button>

        <!-- KLIK JUDUL LAGU = BUKA / TUTUP SLIDER VOLUME & GANTI LAGU -->
        <button
          type="button"
          :class="['bgm-track-wrap', { 'is-active': isPlaying }]"
          title="click to open volume & playlist controls"
          @click="isControlsOpen = !isControlsOpen"
        >
          <div class="bgm-track-marquee">
            <span>
              {{ trackInfo.title }}<template v-if="trackInfo.author"> — {{ trackInfo.author }}</template>
              &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;
              {{ trackInfo.title }}<template v-if="trackInfo.author"> — {{ trackInfo.author }}</template>
              &nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </button>
      </div>

      <!-- PANEL VOLUME & PLAYLIST YANG DI-HIDE (BARU MUNCUL PAS JUDUL LAGU DIKLIK) -->
      <div v-if="isControlsOpen" class="bgm-hidden-panel" @click.stop @mousedown.stop @touchstart.stop>
        <!-- TOMBOL PREV / NEXT PLAYLIST -->
        <div v-if="normalizedTracks.length > 1" class="bgm-playlist-nav">
          <button type="button" class="bgm-nav-btn" title="previous track" @click="prevTrack">
            &lt;&lt;
          </button>
          <span class="bgm-track-counter">
            {{ currentIndex + 1 }}/{{ normalizedTracks.length }}
          </span>
          <button type="button" class="bgm-nav-btn" title="next track" @click="nextTrack(true)">
            &gt;&gt;
          </button>
        </div>

        <!-- SLIDER VOLUME -->
        <div class="bgm-volume-control">
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
  </div>
</template>
