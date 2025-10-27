<script setup lang="ts">
import { ref } from 'vue';
import StateCard from '../components/StateCard.vue';

const stats = ref([
  { title: 'Progres Tugas Harian', value: 0, total: 11, type: 'progress' },
  { title: 'Progres Tugas Total', value: 114, total: 242, type: 'progress' },
  { title: 'Peringkat Kamu', value: 35, total: 40, type: 'emoji', emoji: '😥' },
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <StateCard
      v-for="stat in stats"
      :key="stat.title"
      :title="stat.title"
      :value="stat.value"
      :total="stat.total"
      :type="stat.type"
      :emoji="stat.emoji"
    />
  </div>
</template>