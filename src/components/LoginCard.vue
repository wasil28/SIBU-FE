<script setup lang="ts">
import { ref } from "vue";
import { errorMessages } from "vue/compiler-sfc";
import { LoginApi } from "~/apis";

// 1. Siapkan state untuk input, sama seperti sebelumnya
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isLoading = ref(false)

const isPasswordVisible = ref(false);

function toogleisPasswordVisible() {
  isPasswordVisible.value = !isPasswordVisible.value;
}
// 2. Definisikan "event" yang bisa dipancarkan oleh komponen ini
// Kita membuat event bernama 'submit' yang akan membawa data login
const emit = defineEmits(["submit"]);

// 3. Modifikasi fungsi handleLogin
function handleLogin = async () => {
  isLoading.value = true;
  errorMessages.value = "";

// Jalankan fungsi try and catch
  try {
    // memanggil api 
    const response = await LoginApi.login({
      username : email.value,
      password : password.value,
    })

    console.log("Login Response:", response);
    // menyimpan token atau data login 
    localStorage.setItem("authToken", response.token);

    this.$router.push({nama : "index"});

  }catch (error: any){
    errorMessages.value = error.message || "Login Failed";
  }finally{
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="w-full max-w-4xl flex bg-white rounded-xl shadow-2xl overflow-hidden justify-center items-center"
  >
    <div
      class="w-1/2 hidden md:flex flex-col items-center justify-center p-8 bg-white"
    >
      <img
        src="../public/assets/images/image 13.png"
        alt="System Backup Illustration"
        class="w-full max-w-sm"
      />
    
    </div>

    <div class="w-full md:w-1/2 p-8 md:p-12 bg-blue-800 text-white">
      <img
        src="../public/assets/images/logo-ut-white.png"
        alt="Universitas Terbuka Logo"
        class="w-24 mx-auto mb-4"
      />
     

      <h2 class="text-2xl font-bold text-center">LOGIN</h2>
      <p class="text-center text-blue-200 mb-8">menggunakan email ecampus</p>

      <div class="space-y-6">
        <!-- email -->
          <UFormGroup>
            <UInput v-model="email" placeholder="Email" size="xl">
              <template #leading>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6 text-blue-800 dark:text-gray-500"
                >
                  <path
                    d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"
                  />
                  <path
                    d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"
                  />
                </svg>
              </template>
            </UInput>
          </UFormGroup>

        <!-- password -->
        <UFormGroup>
          <UInput
            v-model="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Password"
            size="xl"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #leading>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6 text-blue-800"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                  clip-rule="evenodd"
                />
              </svg>
            </template>

            <template #trailing>
              <UButton
                @click="isPasswordVisible = !isPasswordVisible"
                :icon="
                  isPasswordVisible
                    ? 'i-heroicons-eye-slash'
                    : 'i-heroicons-eye'
                "
                color="gray"
                variant="link"
                :padded="false"
              />
            </template>
          </UInput>
        </UFormGroup>

        <div class="flex items-center justify-between text-sm">
          <UCheckbox
            v-model="rememberMe"
            label="Remember Me"
            :ui="{ label: 'text-white' }"
          />
          <NuxtLink to="/forgot-password" class="text-blue-300 hover:text-white"
            >Lupa Password?</NuxtLink
          >
        </div>

        <UButton
          @click="handleLogin"
          block
          size="xl"
          color="white"
          variant="solid"
          class="hover:bg-yellow-500 hover:text-white shadow-md"
        >
          Login
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
