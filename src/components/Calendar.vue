<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import { ref, computed, watch } from 'vue'
import { useSocket } from '~/composables/useWebsocket';
// ===== TYPES =====
interface Task {
  id: string
  date: string // Format: YYYY-MM-DD
  status: TaskStatus
  title: string
}

type TaskStatus = 'completed' | 'in-progress' | 'not-started'
type DateStatus = 'all-done' | 'partial' | 'not-done' | 'no-tasks'

interface DateStatusInfo {
  date: CalendarDate
  status: DateStatus
  tasks: Task[]
}

// ===== CONSTANTS =====
const STATUS_COLORS = {
  'all-done': 'oklch(88.2% 0.059 254.128)',    // blue-500
  'partial': 'oklch(94.5% 0.129 101.54)',     // yellow-500
  'not-done': 'oklch(88.5% 0.062 18.334)',    // red-500
  'no-tasks': 'transparent'
} as const

const STATUS_LABELS = {
  'all-done': 'Semua Selesai',
  'partial': 'Sebagian Selesai',
  'not-done': 'Tidak Dikerjakan',
  'no-tasks': 'Tidak Ada Tugas'
} as const

// ===== STATE =====
const tasks = ref<Task[]>([])
const dateStatuses = ref<DateStatusInfo[]>([])
const refreshTrigger = ref(0)

// ===== API FUNCTIONS =====
async function fetchTask(): Promise<Task[]> {
  try {
    const [jsonPlaceholderResponse, dummyJsonResponse] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/todos'),
      fetch('https://dummyjson.com/todos?limit=150')
    ])

    if (!jsonPlaceholderResponse.ok || !dummyJsonResponse.ok) {
      throw new Error('Failed to fetch tasks')
    }

    const jsonPlaceholderData = await jsonPlaceholderResponse.json()
    const dummyJsonData = await dummyJsonResponse.json()

    const today = new Date()
    const startDate = new Date(today.getFullYear(), 0, 1)
    const endDate = new Date(today.getFullYear(), 11, 31)
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const jsonPlaceholderTasks: Task[] = jsonPlaceholderData.map((todo: any, index: number) => {
      const dayOffset = Math.floor((index / jsonPlaceholderData.length) * totalDays)
      const taskDate = new Date(startDate)

      taskDate.setDate(startDate.getDate() + dayOffset)

      let status: TaskStatus
      if (todo.completed) {
        status = 'completed'
      } else {
        status = Math.random() > 0.5 ? 'in-progress' : 'not-started'
      }

      return {
        id: `jp-${todo.id}`,
        date: formatDate(taskDate),
        status: status,
        title: todo.title.length > 50 ? todo.title.substring(0, 50) + '...' : todo.title
      }
    })

    const dummyJsonTasks: Task[] = dummyJsonData.todos.map((todo: any, index: number) => {
      const dayOffset = Math.floor((index / dummyJsonData.todos.length) * totalDays)
      const taskDate = new Date(startDate)
      taskDate.setDate(startDate.getDate() + dayOffset)

      let status: TaskStatus
      if (todo.completed) {
        status = 'completed'
      } else {
        status = Math.random() > 0.5 ? 'in-progress' : 'not-started'
      }

      return {
        id: `dj-${todo.id}`,
        date: formatDate(taskDate),
        status: status,
        title: todo.todo.length > 50 ? todo.todo.substring(0, 50) + '...' : todo.todo
      }
    })

    const allTasks = [...jsonPlaceholderTasks, ...dummyJsonTasks]
    return allTasks.sort(() => Math.random() - 0.5)

  } catch (err) {
    console.error('Error fetching tasks:', err)
    throw err
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ===== BUSINESS LOGIC =====
function calculateDateStatus(dateTasks: Task[]): DateStatus {
  if (dateTasks.length === 0) return 'no-tasks'

  const completedCount = dateTasks.filter(task => task.status === 'completed').length
  const totalTasks = dateTasks.length

  if (completedCount === totalTasks) return 'all-done'
  if (completedCount > 0) return 'partial'
  return 'not-done'
}

function groupTasksByDate(taskList: Task[]): Map<string, Task[]> {
  const dateMap = new Map<string, Task[]>()

  taskList.forEach(task => {
    const existingTasks = dateMap.get(task.date) || []
    dateMap.set(task.date, [...existingTasks, task])
  })

  return dateMap
}

function createDateStatusInfo(tasks: Task[], dateStr: string): DateStatusInfo {
  const [year, month, day] = dateStr.split('-').map(Number)
  const calendarDate = new CalendarDate(year, month, day)

  return {
    date: calendarDate,
    status: calculateDateStatus(tasks),
    tasks
  }
}

function processTasksToDateStatuses(taskList: Task[]): DateStatusInfo[] {
  const tasksByDate = groupTasksByDate(taskList)
  const statuses: DateStatusInfo[] = []
  tasksByDate.forEach((tasks, dateStr) => {
    statuses.push(createDateStatusInfo(tasks, dateStr))
  })
  return statuses
}

// ===== DATA MANAGEMENT =====

// URL dasar Backend API (Sesuaikan dengan APP_PORT di .env Backend Anda)
const BACKEND_HTTP_BASE_URL = 'http://localhost:3007';
// URL WebSocket (Sesuaikan dengan WS_PORT di .env Backend Anda)
const WEBSOCKET_URL = 'http://localhost:3007';
// Base path API (Sesuaikan dengan yang di AppController NestJS)
const API_BASE_PATH = '/api/v1/auth-sso';
const {
  socket,
  isConnected,
  on,
  off,
  emit,
  connect,
  disconnect, } = useSocket(WEBSOCKET_URL);

async function loadTasks(): Promise<void> {
  try {
    const fetchedTasks = await fetchTask()
    tasks.value = fetchedTasks
    dateStatuses.value = processTasksToDateStatuses(fetchedTasks)
  } catch (error) {
    console.error('Error loading tasks:', error)
    throw error
  }
}

function updateTaskInList(updatedTask: Task) {
  const index = tasks.value.findIndex(t => t.id === updatedTask.id)
  if (index !== -1) {
    tasks.value[index] = updatedTask
  } else {
    tasks.value.push(updatedTask)
  }
  // Perbarui status per tanggal
  dateStatuses.value = processTasksToDateStatuses(tasks.value)
}

const { pending, error, refresh } = await useLazyAsyncData(
  'tasks',
  async () => {
    await loadTasks()
    return { tasks: tasks.value, dateStatuses: dateStatuses.value }
  },
  {
    default: () => ({ tasks: [], dateStatuses: [] }),
    watch: [refreshTrigger]
  }
)

onMounted(() => {
  // Dengarkan event task baru / update
  on('taskUpdated', (updatedTask: Task) => {    
    updateTaskInList(updatedTask)
  })

  // Dengarkan event kalau ada task baru
  on('taskCreated', (newTask: Task) => {    
    tasks.value.push(newTask)
    dateStatuses.value = processTasksToDateStatuses(tasks.value)
  })

  // Dengarkan event delete
  on('taskDeleted', (taskId: string) => {
    tasks.value = tasks.value.filter(task => task.id !== taskId)
    dateStatuses.value = processTasksToDateStatuses(tasks.value)
  })
})

onUnmounted(() => {
  off('taskUpdated')
  off('taskCreated')
  off('taskDeleted')
})

// ===== VIEW HELPERS =====
function findDateStatus(dateStr: string): DateStatusInfo | null {
  return dateStatuses.value.find(ds => {
    const dsDateStr = `${ds.date.year}-${String(ds.date.month).padStart(2, '0')}-${String(ds.date.day).padStart(2, '0')}`
    return dsDateStr === dateStr
  }) || null
}

function createTooltipText(dateStr: string): string {
  const dateStatus = findDateStatus(dateStr)
  if (!dateStatus || dateStatus.status === 'no-tasks') {
    return 'No tasks'
  }

  const completedCount = dateStatus.tasks.filter(t => t.status === 'completed').length
  const totalCount = dateStatus.tasks.length

  return `${completedCount}/${totalCount} backup selesai`
}

function getLegendItems() {
  return [
    { color: 'bg-blue-200', label: STATUS_LABELS['all-done'] },
    { color: 'bg-yellow-200', label: STATUS_LABELS['partial'] },
    { color: 'bg-red-200', label: STATUS_LABELS['not-done'] }
  ]
}

// ===== V-CALENDAR ATTRIBUTES =====
const calendarAttributes = computed(() => {
  const attributes: any[] = []

  dateStatuses.value.forEach((dateStatus, index) => {
    if (dateStatus.status === 'no-tasks') return

    const jsDate = new Date(
      dateStatus.date.year,
      dateStatus.date.month - 1,
      dateStatus.date.day
    )

    const dateStr = `${dateStatus.date.year}-${String(dateStatus.date.month).padStart(2, '0')}-${String(dateStatus.date.day).padStart(2, '0')}`

    attributes.push({
      key: `status-${index}`,
      dates: jsDate,
      highlight: {
        fillMode: 'light',
        style: {
          backgroundColor: STATUS_COLORS[dateStatus.status],
          borderRadius: '6px',
          opacity: 0.8,
          color: 'black',
        },
        class: 'task-status-highlight'
      },
      popover: {
        label: createTooltipText(dateStr),
        hideIndicator: true
      }
    })
  })

  // Add today indicator
  const today = new Date()
  attributes.push({
    key: 'today',
    dates: today,
    highlight: {
      fillMode: 'border',
      class: 'today-highlight'
    }
  })

  return attributes
})
</script>

<template>
  <div class="flex-1 px-2">
    <!-- Loading State -->


    <!-- <div v-if="pending" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p class="mt-2 text-sm text-gray-600">Memuat tugas...</p>
    </div> -->

    <!-- Error State -->
    <!-- <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 text-sm">{{ error.message || 'Terjadi kesalahan' }}</p>
      <button @click="refresh()" class="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
        Coba Lagi
      </button>
    </div> -->

    <!-- Calendar Content -->
    <!-- <div v-else> -->
    <!-- Calendar -->
    <div class="border-b-2 border-black mb-1">
      <VCalendar class="pb-0 border-b-2 w-full max-w-md" :attributes="calendarAttributes" :columns="1" :rows="1"
        expanded borderless nav-visibility="focus" :first-day-of-week="2" trim-weeks />
    </div>

    <!-- Legend -->
    <div class="mt-2 grid text-sm">
      <div v-for="item in getLegendItems()" :key="item.label" class="flex items-center gap-2">
        <div :class="['w-4', 'h-4', 'rounded', item.color]"></div>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<style scoped>
/* Custom styles for V-Calendar */

:deep(.vc-day *) {
  color: #1f2937 !important;
}

:deep(.vc-container) {
  border: none;
  width: 100%;
}

:deep(.vc-title) {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

:deep(.vc-weekday) {
  color: #1f2937;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 5px;
}

:deep(.vc-day) {
  min-height: 32px;
  width: 32px;
  margin: 1px;
}

:deep(.vc-day-content) {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: all 0.2s;
}

:deep(.vc-day.is-not-in-month .vc-day-content) {
  color: #9ca3af !important;
  opacity: 0.5;
}

:deep(.vc-day.is-not-in-month:hover .vc-day-content) {
  background-color: transparent !important;
  color: #9ca3af !important;
}

:deep(.vc-day:not(.is-not-in-month):hover .vc-day-content) {
  background-color: #dbeafe !important;
}

:deep(.vc-day:hover .vc-day-content) {
  background-color: #dbeafe !important;
}

:deep(.task-status-highlight) {
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.today-highlight) {
  font-weight: bold;
  box-shadow: 0 0 0 1px #1e40af;
  border-radius: 6px;
}

:deep(.vc-highlight) {
  border-radius: 6px;
}

:deep(.vc-nav-arrow) {
  color: #374151;
  border-radius: 4px;
  padding: 4px;
}

:deep(.vc-nav-arrow:hover) {
  background-color: #f3f4f6;
}

:deep(.vc-nav-title) {
  color: #1f2937;
  font-weight: 600;
}

:deep(.vc-nav-title:hover) {
  background-color: #f3f4f6;
}
</style>