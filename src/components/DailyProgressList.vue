<script lang="ts" setup>
import CardDailyProgress from './CardDailyProgress.vue';
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { useSocket } from '~/composables/useWebsocket';

interface dailyProgressItem {
  id?: string | number;
  name: string;
  percentage: number;
}
// URL dasar Backend API (Sesuaikan dengan APP_PORT di .env Backend Anda)
const BACKEND_HTTP_BASE_URL = 'http://localhost:3007';
// URL WebSocket (Sesuaikan dengan WS_PORT di .env Backend Anda)
const WEBSOCKET_URL = 'http://localhost:3007';
// Base path API (Sesuaikan dengan yang di AppController NestJS)
const API_BASE_PATH = '/api/v1/auth-sso';

const {
  socket,
  isConnected,
  on,
  off,
  emit,
  connect,
  disconnect, } = useSocket(WEBSOCKET_URL);


const dailyListData = ref<dailyProgressItem[]>([
  { name: 'UT Aceh', percentage: 67 },
  { name: 'UT Medan', percentage: 82 },
  { name: 'UT Padang', percentage: 45 },
  { name: 'UT Pekanbaru', percentage: 59 },
  { name: 'UT Batam', percentage: 74 },
  { name: 'UT Palembang', percentage: 63 },
  { name: 'UT Bengkulu', percentage: 41 },
  { name: 'UT Jambi', percentage: 54 },
  { name: 'UT Bandar Lampung', percentage: 79 },
  { name: 'UT Jakarta', percentage: 93 },
  { name: 'UT Bogor', percentage: 88 },
  { name: 'UT Bandung', percentage: 95 },
  { name: 'UT Serang', percentage: 64 },
  { name: 'UT Purwokerto', percentage: 58 },
  { name: 'UT Semarang', percentage: 91 },
  { name: 'UT Surakarta', percentage: 72 },
  { name: 'UT Yogyakarta', percentage: 77 },
  { name: 'UT Surabaya', percentage: 90 },
  { name: 'UT Malang', percentage: 85 },
  { name: 'UT Jember', percentage: 62 },
  { name: 'UT Denpasar', percentage: 81 },
  { name: 'UT Mataram', percentage: 53 },
  { name: 'UT Kupang', percentage: 36 },
  { name: 'UT Pontianak', percentage: 68 },
  { name: 'UT Palangkaraya', percentage: 47 },
  { name: 'UT Banjarmasin', percentage: 83 },
  { name: 'UT Samarinda', percentage: 61 },
  { name: 'UT Manado', percentage: 75 },
  { name: 'UT Gorontalo', percentage: 34 },
  { name: 'UT Palu', percentage: 50 },
  { name: 'UT Kendari', percentage: 57 },
  { name: 'UT Makassar', percentage: 92 },
  { name: 'UT Parepare', percentage: 39 },
  { name: 'UT Ambon', percentage: 28 },
  { name: 'UT Ternate', percentage: 22 },
  { name: 'UT Jayapura', percentage: 31 },
  { name: 'UT Merauke', percentage: 18 },
  { name: 'UT Sorong', percentage: 25 },
]);

const sortedDailyListData = computed<dailyProgressItem[]>(() => {
  return [...dailyListData.value]
    .map(item => ({ ...item, percentage: Math.floor(item.percentage), }))
    .sort((a, b) => a.percentage - b.percentage);
})

const visibleItems = ref<Set<number>>(new Set());
const scrollDirection = ref<"up" | "down">("down");

let observerAll: IntersectionObserver | null = null;
let rootScrollEl: HTMLElement | null = null;
let onScrollHandler: ((e: Event) => void) | null = null;


const setupObservers = async () => {
  await nextTick();
  if (!rootScrollEl) return;
  observerAll?.disconnect();


  // Intersection Observer
  observerAll = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.getAttribute("data-index"));
        if (entry.isIntersecting) {
          visibleItems.value.add(index);
        } else {
          visibleItems.value.delete(index);
        }
      });
    },
    {
      threshold: 0.1,
      // root: document.querySelector("#daily-list-scroll"),
      root: rootScrollEl,
    }
  );

  // document.querySelectorAll(".daily-list-card").forEach((el) =>
  //   observerAll?.observe(el)
  // );

  const cards = rootScrollEl.querySelectorAll('.daily-list-card');
  cards.forEach((el) => observerAll?.observe(el));
}

const handleUpdateDailyProgress = (data: unknown) => {
  try {
    if (Array.isArray(data)) {
      dailyListData.value = data as DailyProgressItem[];
    } else {
      console.error('Invalid data received:', data);
    }
  } catch (error) {
    console.error('Error updating daily progress:', error);
  }
};

onMounted(async () => {
  rootScrollEl = document.querySelector("#daily-list-scroll");

  let lastScrollTop = 0;
  onScrollHandler = () => {
    if (!rootScrollEl) return;
    const st = rootScrollEl.scrollTop;
    scrollDirection.value = st > lastScrollTop ? "down" : "up";
    lastScrollTop = st <= 0 ? 0 : st;
  };

  // arah scroll
  rootScrollEl?.addEventListener("scroll", onScrollHandler);

  on('updateDailyProgress', handleUpdateDailyProgress);

  // Request initial leaderboard data
  try {
    emit('getDailyProgress');
  } catch (error) {
    console.error('Error requesting:', error);
  }

  await nextTick();
  await setupObservers();

});

watch(dailyListData, async () => {
  await setupObservers();
});

onBeforeUnmount(() => {
  // Clean up scroll listener
  if (rootScrollEl && onScrollHandler) {
    rootScrollEl.removeEventListener("scroll", onScrollHandler);
  }
  // Disconnect observers
  observerAll?.disconnect();
  observerAll = null;
  // Clean up WebSocket
  off('updateDailyProgress', handleUpdateDailyProgress);
  disconnect();
})

</script>

<template>
  <div>
    <h4 class="font-medium mb-1 px-10 text-xl text-center">Progress Tugas Harian <br> UT daerah</h4>
    <div id="daily-list-scroll" class="relative h-60 overflow-y-auto no-scrollbar">
      <div v-for="(item, index) in sortedDailyListData" :key="index" :data-index="index"
        class="daily-list-card transition-all duration-700 ease-out transform border-b border-gray-900 last:border-b-0 "
        :class="visibleItems.has(index)
          ? 'opacity-100 translate-y-0'
          : scrollDirection === 'down'
            ? 'opacity-0 translate-y-6'
            : 'opacity-0 -translate-y-6'
          ">
        <CardDailyProgress :item="item" :rank="index + 1" :percent="item.percentage" />
      </div>
    </div>
  </div>
</template>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>