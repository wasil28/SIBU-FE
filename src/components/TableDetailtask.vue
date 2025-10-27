<script setup lang="ts">
import TableTabulator from '@/components/TableTabulator.vue';

const selectedYear = ref(2025)
const years = [2024, 2025, 2026]

// Define columns for Tabulator
const columns = [
  { title: '#', field: 'no', hozAlign: 'center', width: 70, headerSort: false },
  { title: 'UT Daerah', field: 'ut_daerah', headerSort: false },
  { title: 'Total Backup', field: 'total_backup', hozAlign: 'center' },
  { title: 'Sudah Backup', field: 'sudah_backup', hozAlign: 'center' },
  { title: 'Belum Backup', field: 'belum_backup', hozAlign: 'center' },
  { title: 'Total Point', field: 'total_point', hozAlign: 'center' },
]

// Define table data
const tableData = [
  { no: 1, ut_daerah: 'UT Manado', total_backup: 330, sudah_backup: 30, belum_backup: 300, total_point: 120 },
  { no: 2, ut_daerah: 'UT Kupang', total_backup: 330, sudah_backup: 60, belum_backup: 290, total_point: 230 },
  { no: 3, ut_daerah: 'UT Jakarta', total_backup: 330, sudah_backup: 120, belum_backup: 300, total_point: 120 },
  { no: 4, ut_daerah: 'UT Bandung', total_backup: 330, sudah_backup: 163, belum_backup: 290, total_point: 230 },
  { no: 5, ut_daerah: 'UT Serang', total_backup: 330, sudah_backup: 47, belum_backup: 300, total_point: 120 },
  { no: 6, ut_daerah: 'UT Majene', total_backup: 330, sudah_backup: 82, belum_backup: 290, total_point: 230 },
  { no: 7, ut_daerah: 'UT Ambon', total_backup: 330, sudah_backup: 71, belum_backup: 300, total_point: 120 },
  { no: 8, ut_daerah: 'UT Surabaya', total_backup: 330, sudah_backup: 140, belum_backup: 300, total_point: 120 },
]

</script>

<style scoped>
</style>

<template>
  <div class="mt-8 ">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Detail Task</h2>
      <USelect v-model="selectedYear" :options="years" size="sm" />
    </div>

    <!-- Table -->
    <TableTabulator
      title="Detail Task"
      :columns="columns"
      :data="tableData"
      :footer="false"
      :remoteSearch = "false"
      :search="false"
      :fit-layout="'fitColumns'"
      height="auto"
      @cellClick=""
    />
  </div>
</template>
