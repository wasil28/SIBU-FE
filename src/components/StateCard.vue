<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: number;
  total: number;
  type: 'progress' | 'emoji'; 
  emoji?: string;
}>();

const percentage = computed(() => {
  if (props.total === 0) return 0;
  return Math.round((props.value / props.total) * 100);
});

// --- Logika untuk SVG Progress Bar ---
const radius = 20;
const circumference = 2 * Math.PI * radius;

const strokeOffset = computed(() => {
  return circumference - (percentage.value / 100) * circumference;
});

// Menentukan warna stroke berdasarkan persentase
const strokeColorClass = computed(() => {
  return percentage.value > 0 ? 'stroke-blue-600' : 'stroke-gray-200';
});
</script>

<template>
  <!-- 
    PERUBAHAN UTAMA: 
    - Mengubah layout menjadi flex-row (horizontal)
    - justify-between untuk mendorong item ke sisi berlawanan
    - items-center untuk menengahkan secara vertikal
  -->
  <div class="flex flex-row items-center justify-between rounded-xl bg-white p-6 shadow-sm min-h-[120px] hover:shadow-xl">
    
    <!-- Bagian Kiri: Teks -->
    <div class="flex flex-col ">
      <div class="text-base font-medium text-gray-700">{{ title }}</div>
      <div class="flex items-baseline gap-1.5 mt-1">
        <span class="text-3xl font-bold text-gray-800">{{ value }}</span>
        <span class="text-base text-gray-400">dari {{ total }}</span>
      </div>
    </div>

    <!-- Bagian Kanan: Visual (Progress Circle atau Emoji) -->
    <div class="relative h-16 w-16">
      <!-- v-if untuk Progress Circle -->
      <svg v-if="type === 'progress'" class="h-full w-full" viewBox="0 0 50 50">
        <!-- Lingkaran Latar Belakang -->
        <circle
          class="stroke-gray-200"
          cx="25" cy="25" :r="radius"
          stroke-width="5" fill="transparent"
        />
        <!-- Lingkaran Progres (Foreground) -->
        <circle
          :class="strokeColorClass"
          class="transition-all duration-500"
          cx="25" cy="25" :r="radius"
          stroke-width="5" fill="transparent"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeOffset"
          transform="rotate(-90 25 25)"
        />
        <!-- Teks Persentase di Tengah -->
        <text
          class="text-xs font-semibold text-gray-600"
          x="50%" y="50%"
          dominant-baseline="middle" text-anchor="middle"
          fill="currentColor"
        >
          {{ percentage }}%
        </text>
      </svg>
      
      <!-- v-else-if untuk Emoji -->
      <div v-else-if="type === 'emoji'" class="flex h-full w-full items-center justify-center">
        <span class="text-4xl">{{ emoji }}</span>
      </div>
    </div>
  </div>
</template>
