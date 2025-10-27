import { io, Socket } from 'socket.io-client'
import { ref, onBeforeUnmount } from 'vue'

export function useSocket(baseUrl: string, options: any = {}) {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)

  // Inisialisasi socket
  const connect = () => {
    if (socket.value) return 

    socket.value = io(baseUrl, {
      transports: ['websocket'],
      autoConnect: true,
      ...options,
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log(`[Socket Connected]: ${socket.value?.id}`)
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('[Socket Disconnected]')
    })
  }

  // Lepas koneksi ketika composable dihapus
  onBeforeUnmount(() => {
    socket.value?.disconnect()
  })

  // Metode API seragam
  const on = (event: string, callback: (...args: any[]) => void) => {
    socket.value?.on(event, callback)
  }

  const off = (event: string, callback?: (...args: any[]) => void) => {
    socket.value?.off(event, callback)
  }

  const emit = (event: string, data?: any) => {
    socket.value?.emit(event, data)
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
  }

  // Jalankan koneksi otomatis
  connect()

  // Kembalikan API
  return {
    socket,
    isConnected,
    on,
    off,
    emit,
    connect,
    disconnect,
  }
}
