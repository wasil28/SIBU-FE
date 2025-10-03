<script lang="ts" setup>
import RankCard from './CardRanking.vue';
import { ref, onMounted } from 'vue';

interface LeaderBoardItem {
  id?: string | number;
  name: string;
  subtitle: string;
  score: number;
}

// dummy data
const LeaderboardData = ref<LeaderBoardItem[]>([
  { name: 'UT Daerah', subtitle: 'nama .....', score: 3009 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2920 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2709 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
  { name: 'UT Daerah', subtitle: 'nama .....', score: 2507 },
]);

const visibleItems = ref<Set<number>>(new Set());
const scrollDirection = ref<"up" | "down">("down");


onMounted(() => {
  const scrollEl = document.querySelector("#leaderboard-scroll");
  let lastScrollTop = 0;

  // arah scroll
  scrollEl?.addEventListener("scroll", () => {
    const st = scrollEl.scrollTop;
    scrollDirection.value = st > lastScrollTop ? "down" : "up";
    lastScrollTop = st <= 0 ? 0 : st; // prevent negative
  });
  // Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.getAttribute("data-index"));

        if (entry.isIntersecting) {
          visibleItems.value.add(index);   // fade in + slide up
        } else {
          visibleItems.value.delete(index); // fade out + slide down
        }
      });
    },
    {
      threshold: 0.1,
      root: document.querySelector("#leaderboard-scroll"),
    }
  );

  document.querySelectorAll(".rank-card").forEach((el) =>
    observer.observe(el)
  );
});
</script>

<template>
  <div>
    <h4 class="font-medium mb-4 text-2xl text-center">Leaderboard</h4>    
    <!-- leaderboard -->
    <div id="leaderboard-scroll" class="space-y-3 max-h-[480px] overflow-y-auto no-scrollbar">
      <div v-for="(item, index) in LeaderboardData.slice(0, LeaderboardData.length - 1)" :key="index" :data-index="index"
        class="rank-card transition-all duration-700 ease-out transform" 
          :class="
          visibleItems.has(index)
            ? 'opacity-100 translate-y-0'
            : scrollDirection === 'down'
              ? 'opacity-0 translate-y-6'   
              : 'opacity-0 -translate-y-6'  
          ">
        <RankCard :item="item" :rank="index + 1" />
      </div>
    </div>

  </div>
  <!-- urutan terakhir  -->
  <div class="mt-3">
    <RankCard v-if="LeaderboardData.length" :item="LeaderboardData[LeaderboardData.length - 1]"
      :rank="LeaderboardData.length" :isLast="true" />
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
