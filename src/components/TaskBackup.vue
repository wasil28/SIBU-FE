<script setup lang="ts">
import { ref } from 'vue';
import BackupTaskCard from './BackupTaskCard.vue';

const backupTasks = ref([
  { id: 1, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 2, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 3, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 4, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 5, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 6, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 7, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 8, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
  { id: 9, name: 'Data Pribadi', size: '28 MB', progress: 0, status: 'pending' },
]);

// Buat fungsi untuk menangani event 'start-backup' dari anak/BackupTaskCard
const handleStartBackup = (taskId: number) => {
  // Cari task yang sesuai di dalam array data kita
  const task = backupTasks.value.find(t => t.id === taskId);

  // Jika task tidak ditemukan atau sedang diproses, jangan lakukan apa-apa
  if (!task || task.status !== 'pending') return;

  // Ubah status menjadi 'in_progress'
  task.status = 'in_progress';

  // --- Di sinilah simulasi proses backup berjalan ---
  //!IMPORTANT
  const backupInterval = setInterval(() => {
    if (task.progress < 100) {
      task.progress += 10; // Naikkan progress langsung pada data
    } else {
      clearInterval(backupInterval); // Hentikan simulasi
      task.status = 'downloadable'; // Ubah status menjadi siap download
      // Berikan URL download (dari API dummy sebagai contoh)
      task.downloadUrl = `https://dummyjson.com/products/${task.id}`;
    }
  }, 300); // Setiap 300ms
};
</script>

<template>
  <div class="task-backup-container">
    <h2 class="text">Backup dinyatakan selesai ketika berhasil download</h2>
    
    <div class="task-grid">
      <BackupTaskCard
        v-for="task in backupTasks"
        :key="task.id"
        :id="task.id"
        :name="task.name"
        :size="task.size"
        :progress="task.progress"
        :status="task.status"
        :download-url="task.downloadUrl"
        @start-backup="handleStartBackup"
      />
    </div>
  </div>
</template>


<style scoped>

.task-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem; 
}

.task-backup-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.text {
  font-size: 12px;
  font-style: italic;
  margin-top: -30px;
  margin-bottom: 20px;
}

</style>