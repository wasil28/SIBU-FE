<script setup lang="ts">
// Menggunakan defineProps untuk mendefinisikan properti yang diterima komponen
defineProps({
  modelValue: { // Untuk v-model
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
});

// Mendefinisikan event yang bisa di-emit oleh komponen
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mb-4">
    <label class="relative">
      <span class="absolute inset-y-0 left-0 flex items-center pl-3">
        <slot name="icon" /> </span>
      
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="w-full pl-10 pr-4 py-3 bg-white border border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
      />

      <span v-if="$slots.rightIcon" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <slot name="rightIcon" />
      </span>
    </label>
  </div>
</template>

