<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { z } from 'zod'
import { useI18n } from 'vue-i18n'
import { PublicClientApplication } from '@azure/msal-browser'
import { AuthApi, LoginApi, Srs } from '~/apis'
import type { loginData } from '~/types/generalTypes'
definePageMeta({
  layoutTransition: true,
})
// Set title page
useHead({
  title: 'Login',
})

// Menggunakan useSession untuk mengelola sesi
const { session, remove, refresh, update, reset, overwrite } = await useSession()

// Menggunakan router Vue untuk navigasi
const router = useRouter()

const tokenApi = ref(null)

// Captcha
const num1 = ref(Math.floor(Math.random() * 10) + 1)
const num2 = ref(Math.floor(Math.random() * 10) + 1)
const answer = ref(null)
const errorMessage = ref(null)
const isValid = computed(() => answer.value === num1.value + num2.value)
const generateNumbers = () => {
  num1.value = Math.floor(Math.random() * 10) + 1
  num2.value = Math.floor(Math.random() * 10) + 1
  answer.value = null
  errorMessage.value = null
}
const checkAnswer = () => {
  if (!isValid.value)
    errorMessage.value = 'Jawaban salah!'
  else
    errorMessage.value = null
}

// State reaktif untuk menyimpan data formulir login
const dataForm = reactive({
  username: '',
  password: '',
  token: '',
})
const schema = z.object({
  username: z.string({
    required_error: 'Wajib diisi',
    invalid_type_error: 'Wajib diisi!',
  }).min(3, 'Minimal 3 karakter').max(30, 'Maksimal 20 karakter'),
  password: z.string({
    required_error: 'Wajib diisi',
    invalid_type_error: 'Wajib diisi!',
  }).min(8, 'Minimal 8 karakter'),
})

type Schema = z.output<typeof schema>

const { locale } = useI18n()
const { t } = useLang()
const localeUserSetting = ref<CookieRef<string>>(useCookie('i18n_utkurikulum'))
const passwordVisible = ref(false)

// Fungsi untuk melakukan login
const login = async (event: any) => {
  if (!isValid.value) {
    Swal.fire({
      title: 'Gagal Login',
      text: 'silakan isi captcha terlebih dahulu',
      imageUrl: `${useNuxtApp().$config.app.baseURL}assets/images/illustration/error-image.png`,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
    errorMessage.value = 'Silakan isi captcha!'
    return
  }
  // if (event.data.username.split('@')[1] == 'ecampus.ut.ac.id') {
  //   Swal.fire({
  //     title: 'Gagal Login',
  //     text: 'silakan login menggunakan Microsoft 365',
  //     imageUrl: '`${useNuxtApp().$config.app.baseURL}assets/images/illustration/error-image.png',
  //     imageWidth: 400,
  //     imageHeight: 200,
  //     imageAlt: 'Custom image',
  //   })
  //   errorMessage.value = 'silakan login menggunakan Microsoft 365!'
  //   return
  // }

  // Hardcode Login demo
  await update(
    {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlwIjoiMTcyLjE2Ljg3LjExIiwiY2l0eSI6bnVsbCwidGltZXpvbmUiOm51bGwsImNvdW50cnkiOm51bGwsImxhdGl0dWRlIjpudWxsLCJsb25naXR1ZGUiOm51bGwsImJyb3dzZXIiOiJNaWNyb3NvZnQgRWRnZSIsImJyb3dzZXJWZXJzaW9uIjoiMTQwLjAiLCJkZXZpY2UiOiJkZXNrdG9wIiwiZGV2aWNlQnJhbmQiOiJBcHBsZSIsImRldmljZU1vZGVsIjoiIiwib3MiOiJNYWMiLCJvc1ZlcnNpb24iOiIxMC4xNSIsInVzZXJJZCI6MSwiZXhwaXJlZEF0IjoiMjAyNS0wOS0yM1QwMjozMDo1MS45NThaIiwiaWQiOjYyMzcyLCJjcmVhdGVkQXQiOiIyMDI1LTA5LTIzVDAyOjAwOjUxLjk2M1oiLCJ1cGRhdGVkQXQiOiIyMDI1LTA5LTIzVDAyOjAwOjUxLjk2M1oiLCJkZWxldGVkQXQiOm51bGx9LCJpYXQiOjE3NTg1OTI4NTEsImV4cCI6MTc1OTE5NzY1MX0.ZDidf5vos87RnGHi4hNrCE0nU3IhPCKc2IyrL5WmRcE",
  "user": {
    "username": "sysadminmbkm@gmail.com"
  },
  "dataRole": [
    {
      "id": 1,
      "idUserMbkm": 1,
      "idRole": 1,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 1,
        "name": "DEVELOPER",
        "description": "-",
        "active": 1,
        "kode": "RL01",
        "kodeSrs": ""
      }
    },
    {
      "id": 9,
      "idUserMbkm": 1,
      "idRole": 3,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": 2,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": {
        "id": 2,
        "createdBy": "FOXPRO         ",
        "updatedBy": null,
        "createdAt": "1904-01-12T16:52:48.000Z",
        "updatedAt": "2019-08-07T07:29:21.000Z",
        "kodeFakultas": "2",
        "singkatan": "FST",
        "namaFakultas": "Fakultas Sains dan Teknologi"
      },
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 3,
        "name": "WD 1",
        "description": "-",
        "active": 1,
        "kode": "RL03",
        "kodeSrs": "F1001|F2001|F3001|F4001|F2011"
      }
    },
    {
      "id": 10,
      "idUserMbkm": 1,
      "idRole": 4,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": 2,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": {
        "id": 2,
        "createdBy": "FOXPRO         ",
        "updatedBy": null,
        "createdAt": "1904-01-12T16:52:48.000Z",
        "updatedAt": "2019-08-07T07:29:21.000Z",
        "kodeFakultas": "2",
        "singkatan": "FST",
        "namaFakultas": "Fakultas Sains dan Teknologi"
      },
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 4,
        "name": "WD 3",
        "description": "-",
        "active": 1,
        "kode": "RL04",
        "kodeSrs": "F1006|F1007|F2007|F2008|F3006|F3007|F4007|F4008"
      }
    },
    {
      "id": 26,
      "idUserMbkm": 1,
      "idRole": 10,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 10,
        "name": "MAHASISWA UT",
        "description": "Mahasiwa UT",
        "active": 1,
        "kode": "RL10",
        "kodeSrs": "M0000|M0001"
      }
    },
    {
      "id": 66,
      "idUserMbkm": 1,
      "idRole": 94,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 94,
        "name": "WR 1",
        "description": "WAKIL REKTOR 1",
        "active": 1,
        "kode": "RL13",
        "kodeSrs": "F6003"
      }
    },
    {
      "id": 67,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 120,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 120,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "77",
        "namaProgramStudi": "Agribisnis Bidang Minat Penyuluhan dan Komunikasi Perikanan",
        "idFakultas": 2,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 1479,
        "namaSingkatPs": "Agribisnis (Penyuluhan Perikanan)",
        "namaProgramPendidikan": "Agribisnis",
        "masaKurikulum": "20232",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 68,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 80,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 80,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "53",
        "namaProgramStudi": "Ekonomi Pembangunan-S1",
        "idFakultas": 4,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 1958,
        "namaSingkatPs": "Ekonomi Pembangunan",
        "namaProgramPendidikan": "Ekonomi Pembangunan",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 69,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 47,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 47,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "279",
        "namaProgramStudi": "Perencanaan Wilayah dan Kota",
        "idFakultas": 2,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 979,
        "namaSingkatPs": "Perencanaan Wilayah dan Kota",
        "namaProgramPendidikan": "Perencanaan Wilayah dan Kota",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 121,
      "idUserMbkm": 1,
      "idRole": 3,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": 3,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": {
        "id": 3,
        "createdBy": "FOXPRO         ",
        "updatedBy": null,
        "createdAt": "1904-01-12T16:52:48.000Z",
        "updatedAt": "2017-06-07T03:01:45.000Z",
        "kodeFakultas": "3",
        "singkatan": "FHISIP",
        "namaFakultas": "Fakultas Hukum, Ilmu Sosial dan Ilmu Politik"
      },
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 3,
        "name": "WD 1",
        "description": "-",
        "active": 1,
        "kode": "RL03",
        "kodeSrs": "F1001|F2001|F3001|F4001|F2011"
      }
    },
    {
      "id": 122,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 121,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 121,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "78",
        "namaProgramStudi": "Biologi-S1",
        "idFakultas": 2,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 1242,
        "namaSingkatPs": "Biologi",
        "namaProgramPendidikan": "Biologi",
        "masaKurikulum": "20231",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 851,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 113,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 113,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "70",
        "namaProgramStudi": "Sosiologi Sl",
        "idFakultas": 3,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2338,
        "namaSingkatPs": "Sosiologi ",
        "namaProgramPendidikan": "Sosiologi",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 903,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 81,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 81,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "54",
        "namaProgramStudi": "Manajemen-S1",
        "idFakultas": 4,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2014,
        "namaSingkatPs": "Manajemen",
        "namaProgramPendidikan": "Manajemen",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 1115,
      "idUserMbkm": 1,
      "idRole": 3,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": 4,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": {
        "id": 4,
        "createdBy": "FOXPRO         ",
        "updatedBy": null,
        "createdAt": "1904-01-12T16:52:48.000Z",
        "updatedAt": "2017-06-07T02:54:55.000Z",
        "kodeFakultas": "4",
        "singkatan": "FEB",
        "namaFakultas": "Fakultas Ekonomi dan Bisnis"
      },
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 3,
        "name": "WD 1",
        "description": "-",
        "active": 1,
        "kode": "RL03",
        "kodeSrs": "F1001|F2001|F3001|F4001|F2011"
      }
    },
    {
      "id": 1116,
      "idUserMbkm": 1,
      "idRole": 3,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": 1,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": {
        "id": 1,
        "createdBy": "FOXPRO         ",
        "updatedBy": null,
        "createdAt": "1904-01-12T16:52:48.000Z",
        "updatedAt": "2023-03-29T02:19:29.705Z",
        "kodeFakultas": "1",
        "singkatan": "FKIP",
        "namaFakultas": "Fakultas Keguruan dan Ilmu Pendidikan"
      },
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 3,
        "name": "WD 1",
        "description": "-",
        "active": 1,
        "kode": "RL03",
        "kodeSrs": "F1001|F2001|F3001|F4001|F2011"
      }
    },
    {
      "id": 2183,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 115,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 115,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "72",
        "namaProgramStudi": "Ilmu Komunikasi-S1",
        "idFakultas": 3,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2360,
        "namaSingkatPs": "Ilmu Komunikasi",
        "namaProgramPendidikan": "Ilmu Komunikasi",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 2358,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 26,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 26,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "118",
        "namaProgramStudi": "Pendidikan Guru Sekolah Dasar Masukan Guru Dalam jabatan (in Service)",
        "idFakultas": 1,
        "idJenjang": 5,
        "idJenisProgram": 1,
        "idProgramStudiDikti": 2951,
        "namaSingkatPs": "PGSD  Masukan  Guru Dalam jabatan (in Service)",
        "namaProgramPendidikan": "Pendidikan Guru Sekolah Dasar",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 1,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 2808,
      "idUserMbkm": 1,
      "idRole": 4,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": 1,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": {
        "id": 1,
        "createdBy": "FOXPRO         ",
        "updatedBy": null,
        "createdAt": "1904-01-12T16:52:48.000Z",
        "updatedAt": "2023-03-29T02:19:29.705Z",
        "kodeFakultas": "1",
        "singkatan": "FKIP",
        "namaFakultas": "Fakultas Keguruan dan Ilmu Pendidikan"
      },
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 4,
        "name": "WD 3",
        "description": "-",
        "active": 1,
        "kode": "RL04",
        "kodeSrs": "F1006|F1007|F2007|F2008|F3006|F3007|F4007|F4008"
      }
    },
    {
      "id": 2874,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 126,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 126,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "84",
        "namaProgramStudi": "Teknologi Pangan",
        "idFakultas": 2,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 1119,
        "namaSingkatPs": "Teknologi Pangan",
        "namaProgramPendidikan": "Teknolgi Pangan",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 3254,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 36,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 36,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "163",
        "namaProgramStudi": "Teknologi Pendidikan - S1",
        "idFakultas": 1,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2942,
        "namaSingkatPs": "Teknologi Pendidikan",
        "namaProgramPendidikan": "Teknolgi Pangan",
        "masaKurikulum": "20231",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 3293,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 125,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 125,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "83",
        "namaProgramStudi": "Akuntansi - S1",
        "idFakultas": 4,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2138,
        "namaSingkatPs": "Akuntansi",
        "namaProgramPendidikan": "Akuntansi",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 3294,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 76,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 76,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "50",
        "namaProgramStudi": "Ilmu Administrasi Negara-S1",
        "idFakultas": 3,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2221,
        "namaSingkatPs": "Ilmu Administrasi Negara",
        "namaProgramPendidikan": "Administrasi Negara",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 3417,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 102,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 102,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "60",
        "namaProgramStudi": "Pendidikan Fisika-S1",
        "idFakultas": 1,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2801,
        "namaSingkatPs": "Pendidikan Fisika",
        "namaProgramPendidikan": "Pendidikan Fisika",
        "masaKurikulum": "20231",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 3433,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 114,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 114,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "71",
        "namaProgramStudi": "Ilmu Pemerintahan-S1",
        "idFakultas": 3,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2302,
        "namaSingkatPs": "Ilmu Pemerintahan",
        "namaProgramPendidikan": "Ilmu Pemerintahan",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 4402,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 78,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 78,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "51",
        "namaProgramStudi": "Ilmu Administrasi Bisnis-S1",
        "idFakultas": 3,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2226,
        "namaSingkatPs": "Ilmu Administrasi Bisnis",
        "namaProgramPendidikan": "Administrasi Bisnis",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 4403,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 115,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 115,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "72",
        "namaProgramStudi": "Ilmu Komunikasi-S1",
        "idFakultas": 3,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2360,
        "namaSingkatPs": "Ilmu Komunikasi",
        "namaProgramPendidikan": "Ilmu Komunikasi",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 4404,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 44,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 44,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "252",
        "namaProgramStudi": "Sistem Informasi",
        "idFakultas": 2,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 1849,
        "namaSingkatPs": "Sistem Informasi",
        "namaProgramPendidikan": "Informatika",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 4536,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 52,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 52,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "311",
        "namaProgramStudi": "Ilmu Hukum S1",
        "idFakultas": 3,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2469,
        "namaSingkatPs": "Ilmu Hukum",
        "namaProgramPendidikan": "Ilmu Hukum",
        "masaKurikulum": "20231",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 4537,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 129,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 129,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "87",
        "namaProgramStudi": "Sastra Inggris Bidang Minat Penerjemahan",
        "idFakultas": 3,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2666,
        "namaSingkatPs": "Sastra Inggris",
        "namaProgramPendidikan": "Sastra Inggris",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 4541,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 84,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 84,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "57",
        "namaProgramStudi": "Pendidikan Bahasa dan Sastra Indonesia-S1",
        "idFakultas": 1,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 3112,
        "namaSingkatPs": "Pendidikan Bahasa dan Sastra Indonesia",
        "namaProgramPendidikan": "Pendidikan Bahasa dan Sastra Indonesia",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 5557,
      "idUserMbkm": 1,
      "idRole": 6,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 6,
        "name": "P3B",
        "description": "-",
        "active": 1,
        "kode": "RL06",
        "kodeSrs": "PBB01|PBB02"
      }
    },
    {
      "id": 5246,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 31,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 31,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "122",
        "namaProgramStudi": "Pendidikan Guru Anak Usia Dini Masukan Guru Dalam jabatan (In Service)",
        "idFakultas": 1,
        "idJenjang": 5,
        "idJenisProgram": 1,
        "idProgramStudiDikti": 2958,
        "namaSingkatPs": "PGPAUD Masukan Guru Dalam Jabatan ( In service)",
        "namaProgramPendidikan": "Pendidikan Guru Pendidikan Anak Usia Dini",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 1,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 6860,
      "idUserMbkm": 1,
      "idRole": 5,
      "idMitra": null,
      "idProdi": 51,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": {
        "id": 51,
        "createdBy": "Migrasi",
        "updatedBy": null,
        "createdAt": "2024-05-25T12:12:58.991Z",
        "updatedAt": null,
        "kodeProgramStudi": "310",
        "namaProgramStudi": "Ilmu Perpustakaan S1",
        "idFakultas": 3,
        "idJenjang": 5,
        "idJenisProgram": 2,
        "idProgramStudiDikti": 2395,
        "namaSingkatPs": "Ilmu Perpustakaan",
        "namaProgramPendidikan": "Perpustakaan",
        "masaKurikulum": "20212",
        "nomorKurikulum": 0,
        "komponenSkor": 0,
        "idStatusPs": 0
      },
      "role": {
        "id": 5,
        "name": "KA PRODI",
        "description": "-",
        "active": 1,
        "kode": "RL05",
        "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004"
      }
    },
    {
      "id": 7051,
      "idUserMbkm": 1,
      "idRole": 8,
      "idMitra": null,
      "idProdi": null,
      "idFakultas": null,
      "idUpbjj": null,
      "upbjj": null,
      "fakultas": null,
      "mitra": null,
      "programStudi": null,
      "role": {
        "id": 8,
        "name": "PUSJIAN",
        "description": "-",
        "active": 1,
        "kode": "RL08",
        "kodeSrs": "A1001|A1002|A1003"
      }
    }
  ],
  "mySession": {
    "id": "62372",
    "createdAt": "2025-09-23T02:00:51.963Z",
    "updatedAt": "2025-09-23T02:00:51.963Z",
    "isFirstLogin": true,
    "expiredAt": "2025-09-23T02:30:51.958Z",
    "userMbkm": {
      "idGroup": 1,
      "username": "sysadminmbkm",
      "name": "Admin Sistem",
      "email": "sysadminmbkm@gmail.com",
      "ecampusAccount": null,
      "status": 0,
      "emailVerified": true,
      "idNegaraDikti": null,
      "nik": null,
      "noPasport": null,
      "idMhs": null,
      "roles": [
        {
          "id": 1,
          "kode": "RL01",
          "kodeSrs": "",
          "name": "DEVELOPER",
          "description": "-",
          "idMitra": null,
          "idFakultas": null,
          "idProgramStudi": null
        },
        {
          "id": 3,
          "kode": "RL03",
          "kodeSrs": "F1001|F2001|F3001|F4001|F2011",
          "name": "WD 1",
          "description": "-",
          "idMitra": null,
          "idFakultas": 2,
          "idProgramStudi": null
        },
        {
          "id": 4,
          "kode": "RL04",
          "kodeSrs": "F1006|F1007|F2007|F2008|F3006|F3007|F4007|F4008",
          "name": "WD 3",
          "description": "-",
          "idMitra": null,
          "idFakultas": 2,
          "idProgramStudi": null
        },
        {
          "id": 10,
          "kode": "RL10",
          "kodeSrs": "M0000|M0001",
          "name": "MAHASISWA UT",
          "description": "Mahasiwa UT",
          "idMitra": null,
          "idFakultas": null,
          "idProgramStudi": null
        },
        {
          "id": 94,
          "kode": "RL13",
          "kodeSrs": "F6003",
          "name": "WR 1",
          "description": "WAKIL REKTOR 1",
          "idMitra": null,
          "idFakultas": null,
          "idProgramStudi": null
        },
        {
          "id": 5,
          "kode": "RL05",
          "kodeSrs": "F1004|F1010|F2004|F2005|F3004|F3008|F4004",
          "name": "KA PRODI",
          "description": "-",
          "idMitra": null,
          "idFakultas": null,
          "idProgramStudi": 120
        },
        {
          "id": 6,
          "kode": "RL06",
          "kodeSrs": "PBB01|PBB02",
          "name": "P3B",
          "description": "-",
          "idMitra": null,
          "idFakultas": null,
          "idProgramStudi": null
        },
        {
          "id": 8,
          "kode": "RL08",
          "kodeSrs": "A1001|A1002|A1003",
          "name": "PUSJIAN",
          "description": "-",
          "idMitra": null,
          "idFakultas": null,
          "idProgramStudi": null
        }
      ],
      "biodataMahasiswaData": null
    }
  },
  "activeRole": {
    "id": 1,
    "idUserMbkm": 1,
    "idRole": 1,
    "idMitra": null,
    "idProdi": null,
    "idFakultas": null,
    "idUpbjj": null,
    "upbjj": "Batam",
    "fakultas": null,
    "mitra": null,
    "programStudi": null,
    "role": {
      "id": 1,
      "name": "DEVELOPER",
      "description": "-",
      "active": 1,
      "kode": "RL01",
      "kodeSrs": ""
    }
  },
  "masa": [
    {
      "id": "181",
      "idLabelSemester": 1,
      "masa": "20251",
      "labelSemesterData": {
        "id": "1",
        "keterangan": "Ganjil"
      },
      "tahunAkademik": "2025/2026  "
    },
    {
      "id": "180",
      "idLabelSemester": 2,
      "masa": "20242",
      "labelSemesterData": {
        "id": "2",
        "keterangan": "Genap"
      },
      "tahunAkademik": "2024/2025  "
    },
    {
      "id": "179",
      "idLabelSemester": 1,
      "masa": "20241",
      "labelSemesterData": {
        "id": "1",
        "keterangan": "Ganjil"
      },
      "tahunAkademik": "2024/2025  "
    }
  ],
  "menuAside": [
    {
      "label": "Dashboard",
      "icon": "i-mdi-home",
      "menu": [],
      "to": "/adminpanel",
      "allow_view": 1,
      "allow_new": 1,
      "allow_edit": 1,
      "allow_delete": 1,
      "allow_download": 1,
      "allow_approve": 1
    },
    {
      "label": "Detail",
      "icon": "i-mdi-bookshelf",
      "menu": [],
      "to": "/adminpanel/detail",
      "allow_view": 1,
      "allow_new": 1,
      "allow_edit": 1,
      "allow_delete": 1,
      "allow_download": 1,
      "allow_approve": 1
    },
    {
      "label": "Utilitas",
      "icon": "i-mdi-view-grid",
      "menu": [
        {
          "label": "Daftar Pengguna",
          "icon": "",
          "menu": [],
          "to": "/adminpanel/utilitas/users",
          "allow_view": 1,
          "allow_new": 1,
          "allow_edit": 1,
          "allow_delete": 1,
          "allow_download": 1,
          "allow_approve": 1
        },
        {
          "label": "Atur Otorisasi",
          "icon": "",
          "menu": [],
          "to": "/adminpanel/utilitas/privileges",
          "allow_view": 1,
          "allow_new": 1,
          "allow_edit": 1,
          "allow_delete": 1,
          "allow_download": 1,
          "allow_approve": 1
        },
        {
          "label": "Group / Role",
          "icon": "",
          "menu": [],
          "to": "/adminpanel/utilitas/roles",
          "allow_view": 1,
          "allow_new": 1,
          "allow_edit": 1,
          "allow_delete": 1,
          "allow_download": 1,
          "allow_approve": 1
        },
        {
          "label": "Daftar Modul",
          "icon": "",
          "menu": [],
          "to": "/adminpanel/utilitas/modules",
          "allow_view": 1,
          "allow_new": 1,
          "allow_edit": 1,
          "allow_delete": 1,
          "allow_download": 1,
          "allow_approve": 1
        },
        {
          "label": "Panduan",
          "icon": "icona",
          "menu": [],
          "to": "/adminpanel/utilitas/panduan",
          "allow_view": 1,
          "allow_new": 1,
          "allow_edit": 1,
          "allow_delete": 1,
          "allow_download": 1,
          "allow_approve": 1
        },
        {
          "label": "Pengumuman",
          "icon": "icona",
          "menu": [],
          "to": "/adminpanel/referensi/pengumuman",
          "allow_view": 1,
          "allow_new": 1,
          "allow_edit": 1,
          "allow_delete": 1,
          "allow_download": 1,
          "allow_approve": 1
        }
      ],
      "to": "",
      "allow_view": 1,
      "allow_new": 1,
      "allow_edit": 1,
      "allow_delete": 1,
      "allow_download": 1,
      "allow_approve": 1
    }
  ],
  "otorisasi": {
    "allow_approve": true,
    "allow_delete": true,
    "allow_download": true,
    "allow_edit": true,
    "allow_new": true,
    "allow_view": true
  }
}
  )

  // const param = {
  //   username: event.data.username,
  //   password: event.data.password,
  // }

  // // Melakukan refresh sesi sebelum login
  // await refresh()

  // // Melakukan login dengan API
  // const isLogin = await LoginApi.login(param)

  // // Memeriksa status login
  // if (isLogin.data != null) {
  //   const token = isLogin.data.loginUser

  //   // Memperbarui sesi dengan token baru
  //   if (session.value.token !== undefined)
  //     await overwrite({ token })
  //   else
  //     await update({ token })

  //   await update({ user: param })
  //   // await refresh()

  //   const mySession = await AuthApi.getSession(token)
  //   // Check jika ada session
  //   if (mySession.data.mySession) {
  //     const rolesUser = mySession.data.mySession?.userBssn.roles.sort((a, b) => a.id - b.id)
  //     // Check status admisi
  //     if (['RL11', 'RL12'].includes(rolesUser[0].kode)) { // Penulis dan penelaah
  //       navigateTo('/adminpanel/pengembangan-rps/rps', { replace: true })
  //     } else if (['RL10'].includes(rolesUser[0].kode)) { // Pengembang
  //       navigateTo('/adminpanel/pengembangan-rps/rps', { replace: true })
  //     }
  //     else {
  //       navigateTo('/adminpanel', { replace: true })
  //     }
  //   }
  // }
  // else {
  //   // Jika login gagal, tampilkan pesan kesalahan
  //   await Swal.fire({
  //     icon: 'error',
  //     title: 'Gagal',
  //     text: isLogin.errors[0].message,
  //   })
  // }
}

const isLoggedIn = ref(false)


// Fungsi untuk mendecode token dan menampilkan informasi pengguna
const decodeToken = async () => {
  const dataDecode = await LoginApi.decode()
}

onBeforeMount(() => {
  // If user is logged in then redirect to home page
  if (session?.value?.token) {
    // const rolesUser = session?.value?.activeRole.role
    // console.log('navigate to /adminpanel')
    navigateTo('/adminpanel', { replace: true })
  }
})

onMounted(async () => {
  locale.value = localeUserSetting.value ?? 'id-ID'

  tokenApi.value = sessionStorage.getItem('tokenSrs')
  
  if (tokenApi.value == null) {
    const isToken = await useLoginSrs()
    tokenApi.value = isToken 
  }
})

watch(localeUserSetting, () => {
  locale.value = localeUserSetting.value
})
</script>

<template>
  <!-- Tampilan formulir login -->
  <SectionFullScreen>
    <UForm :schema="schema" :state="dataForm" class="bg-ornament flex justify-around items-center h-screen w-screen bg-transparent bg-gradient-to-t from-[#BAD8FF] to-transparent from-10% 2xl:to-35% to-40% dark:bg-slate-900" @submit="login">
      <NuxtLink class="fixed top-5 left-0 bg-white shadow-md rounded-r-full pr-6 pl-4 py-2 hidden md:flex items-center gap-x-2" to="/">
        <img class="h-14" :src="`${useNuxtApp().$config.app.baseURL}assets/images/logo-ut-color.png`" alt="Logo UT">
      </NuxtLink>
      <div class="hidden md:block w-2/5 2xl:w-1/3 2xl:ml-56 md:ml-28 text-center relative">
        <img class="w-full" :src="`${useNuxtApp().$config.app.baseURL}assets/images/illustration/bssn.png`" alt="Login Illustration">
      </div>
      <div class="2xl:!w-[21%] z-10 md:!w-[30%] !w-[94%] h-100 p-0 bg-transparent dark:bg-slate-800 rounded-xl ml-auto 2xl:mr-60 md:mr-28 mr-auto">
        <h1 class="text-3xl block text-left text-ut-textBlue dark:text-white font-extrabold mb-6">
         <span class="text-xl font-bold">Selamat datang di</span><br>SIBU (System Backup)
        </h1>

        <!-- Formulir login -->
        <div class="mt-4">
          <UFormGroup name="username" eager-validation>
            <template #label>
              <label class="flex items-center gap-x-1 text-xs text-ut-textBlue dark:text-white mb-2 font-semibold"><UnoIcon class="i-mdi-envelope" /> Email</label>
            </template>
            <UInput v-model="dataForm.username" size="xl" class="mb-2" color="blue" variant="outline" :placeholder="t('login_form.type_email')" />
          </UFormGroup>
        </div>
        <div class="mt-5">
          <UFormGroup name="password" eager-validation>
            <template #label>
              <label class="flex items-center gap-x-1 text-xs text-ut-textBlue dark:text-white mb-2 font-semibold"><UnoIcon class="i-mdi-lock" /> Password</label>
            </template>
            <div class="relative">
              <UInput v-model="dataForm.password" :type="passwordVisible ? 'text' : 'password'" size="xl" class="mb-2" color="blue" variant="outline" :placeholder="t('login_form.type_password')" />
              <UnoIcon class="!text-ut-textGray absolute right-3 top-3 cursor-pointer" :class="passwordVisible ? 'i-mdi-eye-off' : 'i-mdi-eye'" @click="passwordVisible = !passwordVisible" />
            </div>
          </UFormGroup>
          <!-- <NuxtLink to="/lupa-password" class="block mt-2 text-right text-xs text-ut-textGray" tabindex="-1">
            {{ t('login_form.forgot_password') }}
          </NuxtLink> -->
        </div>
        <div class="mt-3">
          <span class="text-sm leading-5">Silakan jawab pertanyaan berikut *</span>
          <br>
          <!-- <NuxtTurnstile ref="turnstile" v-model="dataForm.token" class="w-[300px]" /> -->
          <div class="flex items-center">
            <UBadge variant="outline" color="blue" size="lg">
              {{ num1 }} + {{ num2 }} = ?
            </UBadge>
            <UInput v-model="answer" type="number" size="sm" class="ml-2" :ui="{ base: '!bg-transparent !ring-ut-asideBlue' }" @blur="checkAnswer" />
            <UButton class="bg-ut-primaryBlue hover:bg-ut-asideBlue dark:bg-ut-primaryBlue dark:text-white dark:hover:bg-ut-asideBlue px-4 ml-2" icon="i-heroicons-arrow-path-solid" @click="generateNumbers" />
          </div>
          <span class="text-sm !text-red-400">{{ errorMessage }}</span>
        </div>
        <!-- Tombol Login -->
        <div class="mt-4">
          <button type="submit" class="bg-ut-bgYellow text-ut-textBlue py-2.5 w-full rounded-md font-semibold transition-all duration-150 hover:bg-ut-bgYellow-hover">
            {{ t('login_form.login') }}
          </button>
          <!-- <small class="block mt-1 mb-2 text-center text-xs text-ut-textBlue">{{ t('login_form.dont_have_account') }} <NuxtLink class="text-ut-bgBlue font-semibold" to="/registrasi">{{ t('login_form.sign_up') }}</NuxtLink></small> -->
          <small class="block mt-4 mb-2 text-center text-xs text-ut-textGray">Atau masuk menggunakan</small>
          <button type="button" class="bg-ut-textBlue text-white flex justify-center items-center py-2.5 w-full rounded-md font-semibold transition-all duration-150 hover:bg-ut-bgBlue-hover" @click="loginSso">
            <img class="h-5" :src="`${useNuxtApp().$config.app.baseURL}assets/images/logo-microsoft.png`" alt="Logo Microsoft 365">&nbsp;
          </button>
          <!-- <small class="block mt-4 mb-2 text-center text-xs text-ut-textGray">{{ t('login_form.login_condition') }}</small> -->
        </div>
      </div>
    </UForm>
  </SectionFullScreen>
</template>

<style scoped>
  .bg-ornament::before {
    content: '';
    background-image: url('${useNuxtApp().$config.app.baseURL}assets/images/background/login-ornament.png');
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
  }
</style>
