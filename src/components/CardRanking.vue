<template>    
  <div :class="getRankingClass(rank)" class="h-14 shadow-md">
    <!-- default -->
    <div v-if="rank > 3" class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-600 font-medium">
      {{ rank }}
    </div>

    <!-- top 3 -->
    <div v-else class="flex-shrink-0 w-10 h-10 flex items-center justify-center">
      <img v-if="showIcons" :src="getTrophyImage(rank)" :alt="`Rank ${rank} trophy`" class="" />
      <span v-else class="text-gray-600 font-medium">{{ rank }}</span>
    </div>

    <!--isi card -->
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-gray-900 truncate text-xs">
        {{ item.name }}
      </h3>
      <p class="text-sm text-gray-600 truncate text-xs">
        {{ item.subtitle }}
      </p>
    </div>

    <!-- Skor -->
    <div class="flex-shrink-0 text-right">
      <span :class="getScoreClass(rank)" class="text-sm">
        {{ item.score }}
      </span>
    </div>
  </div>
</template>

<script setup>
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
  showIcons: {
    type: Boolean,
    default: true
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const getTrophyColor = (rank) => {
  const colors = {
    1: 'text-yellow-500', 
    2: 'text-gray-400',   
    3: 'text-orange-400'  
  }
  return colors[rank] || 'text-gray-400'
}

const getRankingClass = (rank) => {
  const baseClass = 'flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50'

  const rankClasses = {
    1: 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200',
    2: 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200',
    3: 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200'
  }

  if (props.isLast) {
    return `${baseClass} bg-gradient-to-r from-red-50 to-red-200 border border-red-300` 
  }

  return `${baseClass} ${rankClasses[rank] || 'bg-white border border-gray-100'}`
}

const getScoreClass = (rank) => {
  const baseClass = 'text-lg font-bold'

  const rankClasses = {
    1: 'text-yellow-700',
    2: 'text-gray-700',
    3: 'text-orange-700'
  }

  return `${baseClass} ${rankClasses[rank] || 'text-gray-900'}`
}

const getTrophyImage = (rank) => {
  const images = {
    1: '/assets/images/logo-juara-1.png',
    2: '/assets/images/logo-juara-2.png',
    3: '/assets/images/logo-juara-3.png'
  }
  return images[rank]
}
</script>