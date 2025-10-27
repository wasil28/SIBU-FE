<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const selectedYear = ref(2025)
const availableYears = [2023, 2024, 2025]

// Mock data
const yearlyData = {
  2023: [45, 60, 55, 80, 70, 65, 75, 85, 90, 95, 88, 92],
  2024: [50, 55, 65, 75, 80, 70, 68, 78, 85, 90, 85, 95],
  2025: [55, 45, 70, 100, 60, 0, 0, 0, 0, 0, 0, 0],
}

const data = computed(() => ({
  labels,
  datasets: [
    {
      label: 'Progres Tugas (%)',
      data: yearlyData[selectedYear.value],
      borderRadius: 10,
      backgroundColor: (context) => {
        const chart = context.chart
        const { ctx, chartArea } = chart
        if (!chartArea) return null
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, '#3B82F6')
        gradient.addColorStop(1, 'rgba(59,130,246,0)')
        return gradient
      },                
    },
  ],
}))

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: '#000000',
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value}%`,
        color: '#000000',
        padding:10,
      },
    },
  },
}
</script>

<template>
  <div class="p-4 rounded-xl shadow-md bg-white size-auto flex-1">
    <!-- PYear Selector -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-black">Progres Tugas Perbulan</h2>
      <!-- <select v-model="selectedYear"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-gray-300">
        <option v-for="year in availableYears" :key="year" :value="year" class="bg-white">
          {{ year }}
        </option>
      </select> -->
      <USelect v-model="selectedYear" :options="availableYears" size="sm" />
    </div>

    <!-- Chart -->
    <div class="h-[45vh] w-full">
      <Bar :data="data" :options="options" />
    </div>
  </div>
</template>

<style scoped>

</style>