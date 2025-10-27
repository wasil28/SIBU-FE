<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DailyProgressList from '~/components/DailyProgressList.vue';
import ChartProgress from '~/components/ChartProgress.vue';
import TableDetailtask from '~/components/TableDetailtask.vue';
// --- METADATA & LAYOUT SETUP ---
// Menetapkan judul halaman dan breadcrumb untuk konsistensi di seluruh aplikasi.
// useHead dan definePageMeta adalah fitur bawaan Nuxt 3.
const layoutStore = useLayoutStore()
const pageTitle = 'Report Task'
layoutStore.setTitleBreadcrumb(pageTitle, `> ${pageTitle}`)
useHead({
  title: pageTitle,
})

definePageMeta({
  // Anda bisa menambahkan middleware otorisasi di sini jika diperlukan
  // middleware: 'otorisasi', 
  layout: 'module', // Ganti dengan layout utama Anda jika ada
});

// --- DATA REACTIVE ---
// Data di bawah ini adalah simulasi (mock data) untuk mengisi UI.
// Nantinya, Anda bisa mengganti ini dengan data dari API Anda.

// 1. Data untuk kartu progres di bagian atas
const dailyProgress = ref({ current: 0, total: 11 });
const totalProgress = ref({ current: 114, total: 242 });
const userRank = ref({ rank: 35, total: 40 });

// 2. Data untuk daftar tugas backup
const backupTasks = ref([
  { id: 1, name: 'Data Pribadi', size: '28 MB', progress: 100, status: 'completed' },
  { id: 2, name: 'Data Pribadi', size: '28 MB', progress: 60, status: 'downloadable' },
  { id: 3, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'in_progress' },
  { id: 4, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 5, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 6, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 7, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 8, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 9, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
]);

// --- FUNGSI ---

/**
 * Fungsi ini mensimulasikan pengambilan data dari API.
 * Di sini kita hanya mengisi data reactive dengan nilai contoh.
 * Ganti logika di dalam fungsi ini untuk memanggil API backend Anda.
 */
const fetchData = async () => {
  console.log("Fetching data for SIBU dashboard...");
  // Contoh:
  // const response = await SibuApi.getDashboardData(token);
  // dailyProgress.value = response.dailyProgress;
  // totalProgress.value = response.totalProgress;
  // ... dan seterusnya
};

/**
 * Menghitung persentase progres untuk ditampilkan di UI.
 * @param {number} current - Nilai saat ini.
 * @param {number} total - Nilai total.
 * @returns {number} Persentase (0-100).
 */
const calculatePercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  fetchData();
});

</script>

<template>
  <div class="bg-gray-50 min-h-screen flex font-sans">
    <!-- Main Content -->
    <main class="flex-1 p-8 pt-0 pr-[50vh]">
      <!-- Progress Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p class="text-gray-500">Progres Tugas Harian</p>
            <p class="text-3xl font-bold">{{ dailyProgress.current }} <span
                class="text-lg font-normal text-gray-400">dari {{ dailyProgress.total }}</span></p>
          </div>
          <div class="text-2xl font-bold text-blue-500">{{ calculatePercentage(dailyProgress.current,
            dailyProgress.total) }}%</div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p class="text-gray-500">Progres Tugas Total</p>
            <p class="text-3xl font-bold">{{ totalProgress.current }} <span
                class="text-lg font-normal text-gray-400">dari {{ totalProgress.total }}</span></p>
          </div>
          <div class="relative w-16 h-16">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <path class="text-gray-200" stroke-width="3" fill="none" stroke="currentColor"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-blue-500" stroke-width="3" fill="none" stroke="currentColor"
                :stroke-dasharray="`${calculatePercentage(totalProgress.current, totalProgress.total)}, 100`"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-sm font-bold">{{
              calculatePercentage(totalProgress.current, totalProgress.total) }}%</div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md">
          <p class="text-gray-500">Peringkat Kamu</p>
          <p class="text-3xl font-bold">{{ userRank.rank }} <span class="text-lg font-normal text-gray-400">dari {{
            userRank.total }}</span></p>
        </div>
      </div>
      <!-- Task Backup Section -->
      <div>
        <div class="grid gap-6">
          <ChartProgress />
        </div>
        <div class="grid gap-6">
          <TableDetailtask />
        </div>
      </div>
      
    </main>
    <!-- Right Panel -->
    <!-- <aside class="w-[30%] p-6 pt-0 bg-gray-50 "> -->
    <aside class="fixed top-30 right-0 w-[25%] h-full p-6 pt-0 bg-gray-50 overflow-y-auto">
      <!-- list harian -->
      <div class="w-full max-w-md mb-6 flex justify-center bg-white rounded-2xl p-4 shadow-md ">
        <DailyProgressList />
      </div>
      <!-- Leaderboard -->
      <div class="w-full max-w-md bg-white  rounded-2xl p-4 shadow-md">
        <LeaderboardList />
      </div>
    </aside>
  </div>
</template>
