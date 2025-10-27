<script setup lang="ts">
import { ref, computed } from "vue"
import { Icon } from '@iconify/vue'

const layoutStore = useLayoutStore()
const pageTitle = 'Data Backup Bulanan'
layoutStore.setTitleBreadcrumb(pageTitle, `> ${pageTitle}`)
useHead({
  title: pageTitle,
})

definePageMeta({
  // middleware: 'otorisasi',
  layout: 'module',
})

// Tahun & Bulan yang dipilih
const tahun = ref(2025)
const bulan = ref(9) // 9 = September

// Hitung jumlah hari dalam bulan
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

// Generate daftar tanggal sesuai bulan
const days = computed(() => {
  const jumlahHari = getDaysInMonth(tahun.value, bulan.value)
  return Array.from({ length: jumlahHari }, (_, i) => i + 1)
})

// Dummy data status tiap task per tanggal
const tasks = ref([
  {
    name: "Data Tabel 1",
    status: {
      "2025-09-01": "all done",
      "2025-09-02": "failed",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 2",
    status: {
      "2025-09-01": "all done",
      "2025-09-02": "failed",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
  {
    name: "Data Tabel 3",
    status: {
      "2025-09-01": "failed",
      "2025-09-02": "all done",
      "2025-09-03": "empty",
    },
  },
])

function getStatusConfig(status: string) {
  if (status === "all done") {
    return { icon: 'mdi:check', classes: "bg-green-200 text-green-700" }
  }
  if (status === "failed") {
    return { icon: 'mdi:close', classes: "bg-red-200 text-red-700" }
  }
  return { icon: '', classes: "bg-gray-200 text-gray-600" }
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}
// Generate daftar tanggal + key formatted
const daysWithKey = computed(() => {
  const jumlahHari = getDaysInMonth(tahun.value, bulan.value)
  return Array.from({ length: jumlahHari }, (_, i) => {
    const day = i + 1
    return {
      day,
      key: formatDate(tahun.value, bulan.value, day)
    }
  })
})

function getTaskStatus(task: any, dateKey: string) {
  return task.status[dateKey] || "empty"
}
</script>

<template>
  <div class="p-4">
    <!-- <h2 class="text-lg font-bold mb-3">Data Backup Bulan</h2> -->

    <!-- Filter Tahun & Bulan -->
    <div class="flex gap-8 items-center mb-7 mt-2">
      <div class="flex items-center gap-2 ">
        <label class="font-thin">Tahun</label>
        <div class="relative  w-[300px]">
          <select v-model="tahun" class="border rounded-md border-gray-200 w-full appearance-none  px-3 py-1">
            <option v-for="y in [2022, 2023, 2024, 2025, 2026, 2027]" :key="y" :value="y">{{ y }}</option>
          </select>   
            <Icon icon="mdi:chevron-down" class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div class="flex items-center gap-2 ">
        <label class="font-thin">Bulan</label>
        <div class="relative  w-[300px]">
          <select v-model="bulan" class="border rounded-md border-gray-200 w-full px-3 py-1appearance-none">
            <option v-for="m in 12" :key="m" :value="m">
              {{ new Date(0, m - 1).toLocaleString('id-ID', { month: 'long' }) }}
            </option>
          </select>
          <Icon icon="mdi:chevron-down" class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border rounded-lg shadow">
      <table class="min-w-full border-collapse">
        <thead class="bg-gray-100 text-sm">
          <tr>
            <th class="border px-3 py-2 text-left font-light min-w-48 text-base">Nama Tabel</th>
            <th v-for="d in daysWithKey" :key="d.key" class="border px-2 py-2 text-center font-light">
              {{ d.day.toString().padStart(2, '0') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.name" class="hover:bg-gray-50">
            <td class="border px-3 py-2">{{ task.name }}</td>
            <td v-for="d in daysWithKey" :key="d.key" class="border px-2 py-1 text-center ">
              <div class="flex justify-center">
                <div class="w-7 h-7 flex items-center justify-center rounded-full shadow"
                  :class="getStatusConfig(getTaskStatus(task, d.key)).classes">
                  <Icon v-if="getStatusConfig(getTaskStatus(task, d.key)).icon" 
                    :icon="getStatusConfig(getTaskStatus(task, d.key)).icon" 
                    class="w-4 h-4" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>