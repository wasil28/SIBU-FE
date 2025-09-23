<script setup lang="ts">
import { ref, onMounted } from 'vue';

// --- METADATA & LAYOUT SETUP ---
// Menetapkan judul halaman dan breadcrumb untuk konsistensi di seluruh aplikasi.
// useHead dan definePageMeta adalah fitur bawaan Nuxt 3.
useHead({
  title: 'SIBU - Report Task',
});

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

// 3. Data untuk Leaderboard
const leaderboardData = ref([
    { id: 1, name: 'UT Daerah', location: 'nama ict', score: 2976, avatar: 'https://placehold.co/40x40/FBBF24/000000?text=U' },
    { id: 2, name: 'UT Daerah', location: 'nama ict', score: 2616, avatar: 'https://placehold.co/40x40/FBBF24/000000?text=U' },
    { id: 3, name: 'UT Daerah', location: 'nama ict', score: 2213, avatar: 'https://placehold.co/40x40/FBBF24/000000?text=U' },
    { id: 4, name: 'UT Daerah', location: 'nama ict', score: 2031, avatar: 'https://placehold.co/40x40/FBBF24/000000?text=U' },
    { id: 5, name: 'UT Daerah', location: 'nama ict', score: 1963, avatar: 'https://placehold.co/40x40/FBBF24/000000?text=U' },
    { id: 6, name: 'UT Daerah', location: 'nama ict', score: 1961, avatar: 'https://placehold.co/40x40/FBBF24/000000?text=U' },
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
    <main class="flex-1 p-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">Report Task</h2>
      
      <!-- Progress Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p class="text-gray-500">Progres Tugas Harian</p>
            <p class="text-3xl font-bold">{{ dailyProgress.current }} <span class="text-lg font-normal text-gray-400">dari {{ dailyProgress.total }}</span></p>
          </div>
          <div class="text-2xl font-bold text-blue-500">{{ calculatePercentage(dailyProgress.current, dailyProgress.total) }}%</div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p class="text-gray-500">Progres Tugas Total</p>
            <p class="text-3xl font-bold">{{ totalProgress.current }} <span class="text-lg font-normal text-gray-400">dari {{ totalProgress.total }}</span></p>
          </div>
           <div class="relative w-16 h-16">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <path class="text-gray-200" stroke-width="3" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-blue-500" stroke-width="3" fill="none" stroke="currentColor" :stroke-dasharray="`${calculatePercentage(totalProgress.current, totalProgress.total)}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-sm font-bold">{{ calculatePercentage(totalProgress.current, totalProgress.total) }}%</div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-md">
          <p class="text-gray-500">Peringkat Kamu</p>
          <p class="text-3xl font-bold">{{ userRank.rank }} <span class="text-lg font-normal text-gray-400">dari {{ userRank.total }}</span></p>
        </div>
      </div>

      <!-- Task Backup Section -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-700">Task Backup</h3>
          <p class="text-sm text-gray-500">X Backup dinyatakan selesai ketika berhasil berhasi download</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="task in backupTasks" :key="task.id" class="bg-white p-5 rounded-xl shadow-md">
            <div class="flex justify-between items-center mb-3">
              <p class="font-semibold">{{ task.name }}</p>
              <p class="text-sm text-gray-500">{{ task.size }}</p>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div class="h-2 rounded-full" :class="{
                'bg-red-500': task.status === 'completed',
                'bg-green-500': task.status === 'downloadable',
                'bg-blue-500': task.status === 'in_progress'
              }" :style="{ width: task.progress + '%' }"></div>
            </div>
            
            <button v-if="task.status === 'completed'" class="w-full text-center py-2 px-4 rounded-lg font-semibold bg-red-100 text-red-600 border border-red-500">
              Selesai
            </button>
            <button v-else-if="task.status === 'downloadable'" class="w-full text-center py-2 px-4 rounded-lg font-semibold bg-green-100 text-green-600 border border-green-500">
              Download
            </button>
            <button v-else-if="task.status === 'in_progress'" class="w-full text-center py-2 px-4 rounded-lg font-semibold bg-blue-100 text-blue-600 border border-blue-500">
              Backup
            </button>
            <button v-else class="w-full text-center py-2 px-4 rounded-lg font-semibold bg-gray-100 text-gray-600 border border-gray-400">
              Backup
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Right Panel -->
    <aside class="w-80 bg-white p-6 border-l border-gray-200">
       <div class="flex justify-end mb-6">
          <button class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600">EX</button>
      </div>
      
      <!-- Calendar -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <button class="text-gray-500">&lt;</button>
          <h4 class="font-bold">February, 2025</h4>
          <button class="text-gray-500">&gt;</button>
        </div>
        <div class="grid grid-cols-7 text-center text-sm text-gray-500">
          <div class="py-2">S</div>
          <div class="py-2">M</div>
          <div class="py-2">T</div>
          <div class="py-2">W</div>
          <div class="py-2">T</div>
          <div class="py-2">F</div>
          <div class="py-2">S</div>
        </div>
        <div class="grid grid-cols-7 text-center text-sm">
            <div v-for="day in 28" :key="day" class="py-2" :class="{'bg-blue-500 text-white rounded-full': day === 12, 'text-gray-300': day < 3}">
               {{ day < 3 ? 27 + day -1 : day - 2 }}
            </div>
             <div class="py-2 text-gray-300">1</div>
             <div class="py-2 text-gray-300">2</div>
             <div class="py-2 text-gray-300">3</div>
        </div>
        <div class="mt-4 space-y-2 text-sm">
            <div class="flex items-center">
                <span class="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span>Sudah Selesai</span>
            </div>
            <div class="flex items-center">
                <span class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                <span>Belum Selesai</span>
            </div>
            <div class="flex items-center">
                <span class="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>Tidak Dikerjakan</span>
            </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div>
        <h4 class="font-bold mb-4">Leaderboard</h4>
        <div class="space-y-3">
            <div v-for="(user, index) in leaderboardData" :key="user.id" class="flex items-center p-2 rounded-lg" :class="{'bg-yellow-100 border border-yellow-300': index === 0}">
                <div class="w-6 text-center font-bold">{{ index + 1 }}</div>
                <img :src="user.avatar" class="w-10 h-10 rounded-full mx-3" :alt="user.name">
                <div class="flex-1">
                    <p class="font-semibold">{{ user.name }}</p>
                    <p class="text-xs text-gray-500">{{ user.location }}</p>
                </div>
                <div class="font-bold text-gray-700">{{ user.score }}</div>
            </div>
        </div>
      </div>
    </aside>
  </div>
</template>
