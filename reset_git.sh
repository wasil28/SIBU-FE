#!/bin/bash

# Skrip ini akan menghapus konfigurasi Git dan GitLab CI/CD dari direktori saat ini.
# Jalankan skrip ini di dalam direktori root proyek Anda.

echo "Skrip ini akan menghapus koneksi ke repositori Git yang ada (GitLab)."
echo "Pastikan Anda sudah mem-backup kode jika diperlukan."
read -p "Apakah Anda yakin ingin melanjutkan? (y/n) " -n 1 -r
echo    # Pindah ke baris baru

if [[ $REPLY =~ ^[Yy]$ ]]
then
    # 1. Hapus file konfigurasi GitLab CI/CD jika ada
    if [ -f ".gitlab-ci.yml" ]; then
        echo "Menghapus file .gitlab-ci.yml..."
        rm ".gitlab-ci.yml"
        echo "File .gitlab-ci.yml berhasil dihapus."
    else
        echo "File .gitlab-ci.yml tidak ditemukan, melanjutkan..."
    fi

    # 2. Hapus direktori .git yang berisi semua riwayat dan remote
    if [ -d ".git" ]; then
        echo "Menghapus direktori .git..."
        # 'rm -rf' akan menghapus direktori dan isinya secara paksa
        rm -rf .git
        echo "Direktori .git berhasil dihapus."
    else
        echo "Direktori .git tidak ditemukan."
    fi

    echo ""
    echo "Proses selesai! Proyek ini sudah tidak terhubung ke repositori Git manapun."
    echo "Anda sekarang bisa memulai dari awal dengan 'git init'."

else
    echo "Operasi dibatalkan."
fi
