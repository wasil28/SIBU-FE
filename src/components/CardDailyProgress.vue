<script lang="ts" setup>
// Props
const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (item) => {
      return item.hasOwnProperty('name') && item.hasOwnProperty('score')
    }
  },
  rank: {
    type: Number,
    required: true
  },
  percent: {
    type: Number,
    required: true
  }
})

</script>

<template>
  <div class="flex items-center gap-4 py-2 transition-colors hover:bg-gray-50">
    <!-- NUMBER -->
    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-600 font-medium">
      {{ rank }}
    </div>
    <!-- UT -->
    <div class="flex-1 min-w-0">
      <h3 class="font-base text-gray-900 truncate text-xs">
        {{ item.name }}
      </h3>
    </div>
    <!-- percent -->
    <div class="flex-shrink-0 flex items-center gap-2">
      <div class="w-32">
        <UProgress :value="percent" :color="'indigo'" :size="'sm'" :indicator="false" />
      </div>
      <span class="text-sm font-normal text-gray-900 whitespace-nowrap">{{ percent }}%</span>
    </div>
  </div>
</template>