<script setup lang="ts">
import LoginCard from '../components/LoginCard.vue'
import { LoginApi } from '../apis/users/login.api'

useHead({
  title: 'Login SIBU',
})

const errorMsg = ref<string | null>(null)
const isLoading = ref(false)
const router = useRouter()

// State global untuk session (token & user)
const session = useState('session', () => null)

// Fungsi yang dipanggil saat form login dikirim
async function handleLoginAttempt(loginData: { email: string; password: string }) {
  isLoading.value = true
  errorMsg.value = null

  try {
    const response = await LoginApi.login({
      username: loginData.email,
      password: loginData.password,
    })

    if (response && response.token) {
      // Simpan token dan user info ke global state
      session.value = {
        token: response.token,
        user: response.user || null, // sesuaikan dengan response API
      }

      // Simpan token ke cookie agar tetap tersimpan
      useCookie('token').value = response.token

      // Redirect ke halaman dashboard/adminpanel
      await router.push('/adminpanel')
    } else {
      errorMsg.value = 'Login gagal. Periksa kembali email dan password Anda.'
    }

// sementara untuk login 
console.log("Development Mode: Bypassing login, redirecting to /adminpanel");
    await router.push('/adminpanel');

  } catch (error: any) {
    errorMsg.value = 'Terjadi kesalahan pada sistem. Silakan coba lagi nanti.'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-screen bg-gray-50">
    <LoginCard 
      @submit="handleLoginAttempt" 
      :is-loading="isLoading" 
      :error-message="errorMsg" 
    />
  </div>
</template>
