<script setup lang="ts">
import { computed } from "vue";


const props = defineProps<{
  id: number;
  name: string;
  size: string;
  progress: number;
  status: string;
  downloadUrl?: string | null; 
}>();

// Mendefinisikan event yang akan dikirim ke parent
const emit = defineEmits(['start-backup']);

// Computed property sekarang langsung menggunakan props, bukan state lokal
const buttonProps = computed(() => {
  switch (props.status) {
    case "downloadable":
      return { label: "Download", color: "blue", variant: "solid", action: 'download' };
    case "in_progress":
      return { label: "Memproses...", color: "gray", variant: "outline", action: null };
    case "selesai": // Status setelah didownload
      return { label: "Selesai", color: "green", variant: "outline", action: null };
    default: // 'pending'
      return { label: "Backup", color: "red", variant: "solid", action: 'backup' };
  }
});


// Fungsi untuk menghandle ketika user menekan tombol
function handleButtonClick() {
  if (buttonProps.value.action === 'backup') {
    // Kirim event 'start-backup' dengan menyertakan ID task ini
    emit('start-backup', props.id);
  } else if (buttonProps.value.action === 'download') {
    // Logika untuk download bisa langsung di sini jika sederhana
    // Atau bisa juga emit event lagi jika perlu logika kompleks di parent
    if (props.downloadUrl) {
      const link = document.createElement('a');
      link.href = props.downloadUrl;
      link.setAttribute('download', `backup-${props.name.replace(/\s+/g, '_')}-${props.id}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Anda bisa emit event untuk mengubah status menjadi 'selesai'
    }
  }
}
</script>

<template>
  <div class="hover:shadow-xl transition-transform duration-300 ease-in-out hover:scale-105">
    <UCard :ui="{ divide: '' }">
      <template #header>
        <div class="flex justify-between font-medium">
          <span>{{ name }}</span>
          <span>{{ size }}</span>
        </div>
      </template>

      <!-- Langsung gunakan props.progress, tidak perlu state lokal -->
      <div class="flex items-center gap-x-2 -mt-6">
        <UProgress class="flex-1" :value="props.progress" />
        <span class="text-sm font-semibold text-gray-700">{{ props.progress }}%</span>
      </div>
      
      <template #footer>
        <UButton
          class="button"
          block
          :label="buttonProps.label"
          :color="buttonProps.color"
          :loading="props.status === 'in_progress'"
          :disabled="props.status === 'in_progress' || props.status === 'selesai'"
          :variant="buttonProps.variant"
          @click="handleButtonClick"
        />
      </template>
    </UCard>
  </div>
</template>

<style scoped>
.button {
  margin-top: -40px;
}
</style>
