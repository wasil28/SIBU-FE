<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue';
import RankCard from './CardRanking.vue';
import { useSocket } from '~/composables/useWebsocket';

/* ---------- types ---------- */
interface LeaderBoardItem {
  id?: string | number;
  name: string;
  subtitle: string;
  score: number;
}

const BACKEND_HTTP_BASE_URL = 'http://localhost:3007';
const WEBSOCKET_URL = 'http://localhost:3007';
const API_BASE_PATH = '/api/v1/auth-sso';

const { socket, isConnected, on, off, emit, connect, disconnect } = useSocket(WEBSOCKET_URL);


const LeaderboardData = ref<LeaderBoardItem[]>([
  { name: 'UT Aceh', subtitle: 'UPBJJ Banda Aceh', score: 2909 },
  { name: 'UT Medan', subtitle: 'UPBJJ Medan', score: 2920 },
  { name: 'UT Padang', subtitle: 'UPBJJ Padang', score: 2709 },
  { name: 'UT Pekanbaru', subtitle: 'UPBJJ Pekanbaru', score: 2507 },
  { name: 'UT Batam', subtitle: 'UPBJJ Batam', score: 2411 },
  { name: 'UT Palembang', subtitle: 'UPBJJ Palembang', score: 2650 },
  { name: 'UT Bengkulu', subtitle: 'UPBJJ Bengkulu', score: 2275 },
  { name: 'UT Jambi', subtitle: 'UPBJJ Jambi', score: 2344 },
  { name: 'UT Bandar Lampung', subtitle: 'UPBJJ Bandar Lampung', score: 2788 },
  { name: 'UT Jakarta', subtitle: 'UPBJJ Jakarta', score: 2999 },
  { name: 'UT Bogor', subtitle: 'UPBJJ Bogor', score: 2805 },
  { name: 'UT Bandung', subtitle: 'UPBJJ Bandung', score: 3100 },
  { name: 'UT Serang', subtitle: 'UPBJJ Serang', score: 2602 },
  { name: 'UT Purwokerto', subtitle: 'UPBJJ Purwokerto', score: 2501 },
  { name: 'UT Semarang', subtitle: 'UPBJJ Semarang', score: 3122 },
  { name: 'UT Surakarta', subtitle: 'UPBJJ Surakarta', score: 2890 },
  { name: 'UT Yogyakarta', subtitle: 'UPBJJ Yogyakarta', score: 2766 },
  { name: 'UT Surabaya', subtitle: 'UPBJJ Surabaya', score: 3211 },
  { name: 'UT Malang', subtitle: 'UPBJJ Malang', score: 2988 },
  { name: 'UT Jember', subtitle: 'UPBJJ Jember', score: 2444 },
  { name: 'UT Denpasar', subtitle: 'UPBJJ Denpasar', score: 2750 },
  { name: 'UT Mataram', subtitle: 'UPBJJ Mataram', score: 2307 },
  { name: 'UT Kupang', subtitle: 'UPBJJ Kupang', score: 1999 },
  { name: 'UT Pontianak', subtitle: 'UPBJJ Pontianak', score: 2705 },
  { name: 'UT Palangkaraya', subtitle: 'UPBJJ Palangkaraya', score: 2207 },
  { name: 'UT Banjarmasin', subtitle: 'UPBJJ Banjarmasin', score: 2822 },
  { name: 'UT Samarinda', subtitle: 'UPBJJ Samarinda', score: 2533 },
  { name: 'UT Manado', subtitle: 'UPBJJ Manado', score: 2759 },
  { name: 'UT Gorontalo', subtitle: 'UPBJJ Gorontalo', score: 2020 },
  { name: 'UT Palu', subtitle: 'UPBJJ Palu', score: 2140 },
  { name: 'UT Kendari', subtitle: 'UPBJJ Kendari', score: 2257 },
  { name: 'UT Makassar', subtitle: 'UPBJJ Makassar', score: 3188 },
  { name: 'UT Parepare', subtitle: 'UPBJJ Parepare', score: 1990 },
  { name: 'UT Ambon', subtitle: 'UPBJJ Ambon', score: 1888 },
  { name: 'UT Ternate', subtitle: 'UPBJJ Ternate', score: 1775 },
  { name: 'UT Jayapura', subtitle: 'UPBJJ Jayapura', score: 2107 },
  { name: 'UT Merauke', subtitle: 'UPBJJ Merauke', score: 1705 },
  { name: 'UT Sorong', subtitle: 'UPBJJ Sorong', score: 1850 }
]);

const { session } = await useSession();

const sortedLeaderboardData = computed<LeaderBoardItem[]>(() => {
  return [...LeaderboardData.value].sort((a, b) => b.score - a.score);
});

const visibleItems = ref<Set<number>>(new Set());
const scrollDirection = ref<'up' | 'down'>('down');

const upbjjUser = computed(() => session?.value?.activeRole?.upbjj);

const userCurrentposition = computed<number | null>(() => {
  if (!upbjjUser.value) return null;
  const idx = sortedLeaderboardData.value.findIndex(item =>
    item.name.toLowerCase().includes(upbjjUser.value.toLowerCase())
  );
  return idx !== -1 ? idx : null;
});

const showFloating = ref<boolean>(true);
const stickyIndex = computed(() => {
  return userCurrentposition.value !== null ? userCurrentposition.value : 0;
});

let rootScrollEl: HTMLElement | null = null;
let observerAll: IntersectionObserver | null = null;
let observerSpecial: IntersectionObserver | null = null;
let onScrollHandler: ((e?: Event) => void) | null = null;

const scrollToCard = () => {
  if (!rootScrollEl) return;
  const targetCard = rootScrollEl.querySelector(`.rank-card[data-index="${stickyIndex.value}"]`) as HTMLElement | null;
  if (targetCard) {
    const cardTop = targetCard.offsetTop;
    const offset = 1;
    rootScrollEl.scrollTo({ top: cardTop - offset, behavior: 'smooth' });
  }
};

/* ---------- observer setup ---------- */
const setupObservers = async () => {
  await nextTick();
  if (!rootScrollEl) return;

  // disconnect previous observers
  observerAll?.disconnect();
  observerSpecial?.disconnect();
  observerAll = null;
  observerSpecial = null;

  // Observer for fade-in / fade-out
  observerAll = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const idxStr = (entry.target as Element).getAttribute('data-index');
        if (idxStr == null) continue;
        const index = Number(idxStr);
        if (entry.isIntersecting) visibleItems.value.add(index);
        else visibleItems.value.delete(index);
      }
    },
    { threshold: 0.1, root: rootScrollEl }
  );

  // Observe only children inside the scroll root
  const cards = rootScrollEl.querySelectorAll('.rank-card');
  cards.forEach((el) => observerAll?.observe(el));

  // Special observer for the sticky card
  if (sortedLeaderboardData.value.length > 0 && stickyIndex.value >= 0 && stickyIndex.value < sortedLeaderboardData.value.length) {
    const specialEl = rootScrollEl.querySelector(`.rank-card[data-index="${stickyIndex.value}"]`) as HTMLElement | null;
    if (specialEl) {
      observerSpecial = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            // hide floating when actual is mostly visible
            showFloating.value = !(entry.isIntersecting && entry.intersectionRatio >= 0.5);
          }
        },
        { root: rootScrollEl, threshold: [0, 0.25, 0.5, 0.75, 1.0] }
      );
      observerSpecial.observe(specialEl);
    }
  }
};

/* ---------- socket event handler (store for off) ---------- */
const handleUpdateLeaderboard = (data: unknown) => {
  try {
    if (Array.isArray(data)) {
      LeaderboardData.value = data as LeaderBoardItem[];
    } else {
      console.error('Invalid leaderboard data received:', data);
    }
  } catch (err) {
    console.error('Error updating leaderboard:', err);
  }
};

/* ---------- lifecycle ---------- */
onMounted(async () => {
  // register socket listener with a named handler so we can remove it later
  on('updateLeaderboard', handleUpdateLeaderboard);

  // attempt to request data (ensure socket implementation handles emit before connected)
  try {
    emit('getLeaderboard');
  } catch (err) {
    console.error('Error emitting getLeaderboard:', err);
  }

  await nextTick();
  rootScrollEl = document.querySelector('#leaderboard-scroll') as HTMLElement | null;
  if (!rootScrollEl) {
    console.error('Leaderboard scroll container not found');
    return;
  }

  // scroll direction tracker
  let lastScrollTop = 0;
  onScrollHandler = () => {
    if (!rootScrollEl) return;
    const st = rootScrollEl.scrollTop;
    scrollDirection.value = st > lastScrollTop ? 'down' : 'up';
    lastScrollTop = st <= 0 ? 0 : st;
  };
  rootScrollEl.addEventListener('scroll', onScrollHandler, { passive: true });

  // initial observers
  await setupObservers();
});

/* re-setup observers when leaderboard changes or sticky index changes */
watch(sortedLeaderboardData, async () => { await setupObservers(); }, { deep: false });
watch(stickyIndex, async () => { await setupObservers(); });

onBeforeUnmount(() => {
  if (rootScrollEl && onScrollHandler) rootScrollEl.removeEventListener('scroll', onScrollHandler);
  observerAll?.disconnect();
  observerSpecial?.disconnect();

  // remove the specific handler
  off('updateLeaderboard', handleUpdateLeaderboard);
  // optionally close socket connection if appropriate for your app
  try { disconnect(); } catch { /* ignore */ }
});
</script>


<template>
  <div>
    <h4 class="font-medium text-2xl text-center">Leaderboard</h4>
    <div id="leaderboard-scroll" class=" relative space-y-2 h-[45vh] overflow-y-auto no-scrollbar">
      <div v-for="(item, index) in sortedLeaderboardData.slice(0, LeaderboardData.length)" :key="index"
        :data-index="index" class="rank-card transition-all duration-700 ease-out transform" :class="visibleItems.has(index)
          ? 'opacity-100 translate-y-0'
          : scrollDirection === 'down'
            ? 'opacity-0 translate-y-6'
            : 'opacity-0 -translate-y-6'
          ">
        <RankCard :item="item" :rank="index + 1" :isCurrent="index === userCurrentposition" />
      </div>
      <!-- Floating card  -->
      <Transition enter-active-class="transition-all duration-300" leave-active-class="transition-all duration-300"
        enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
        <div v-if="showFloating && sortedLeaderboardData.length > stickyIndex"
          class="sticky bottom-0 left-0 right-0 z-20 pointer-events-none">
          <div class="mb-2 bg-blue-700 rounded-lg shadow-lg border-2 border-blue-900 pointer-events-auto">
            <RankCard :item="sortedLeaderboardData[stickyIndex]" :rank="stickyIndex + 1" :isCurrent="true"
              @click="scrollToCard" />
          </div>
        </div>
      </Transition>
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