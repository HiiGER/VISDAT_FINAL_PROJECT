# 🎵 Spotify 2023 Data Visualization

Selamat datang di proyek visualisasi data Spotify 2023!

## Tentang Proyek
Proyek ini bertujuan untuk menyajikan visualisasi interaktif dari data Spotify tahun 2023 yang diambil dari Kaggle. Dengan memanfaatkan teknologi web modern, aplikasi ini membantu pengguna memahami tren, statistik, dan insight menarik dari data musik populer di Spotify.

## Fitur Utama
- Visualisasi tren streaming lagu sepanjang tahun
- Statistik dan distribusi mode lagu
- Chart artis dan lagu teratas
- Analisis fitur audio menggunakan radar chart
- Filter interaktif untuk eksplorasi data

## Teknologi yang Digunakan
- **React** + **TypeScript**
- **Vite** untuk build tool
- **Tailwind CSS** untuk styling
- **D3.js** untuk visualisasi data

## Struktur Direktori
```
project/
├── public/
│   └── spotify-2023.csv         # Dataset utama
├── src/
│   ├── components/              # Komponen visualisasi
│   ├── types/                   # Tipe data TypeScript
│   ├── utils/                   # Utility functions (parser, dsb)
│   ├── App.tsx                  # Root aplikasi
│   └── ...
├── index.html                   # Entry point HTML
├── package.json                 # Konfigurasi npm
├── tailwind.config.js           # Konfigurasi Tailwind
└── vite.config.ts               # Konfigurasi Vite
```

## Cara Menjalankan
1. **Clone repository ini**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```
4. Buka browser di `http://localhost:5173`

## Dataset
Dataset yang digunakan: [Spotify 2023 - Kaggle](https://www.kaggle.com/datasets)

## Kontributor
- Angger Tirta Tetalen Mukti (2200018135)
- Faris Nur Rizqiawan (2200018084)
- Muhammad Fharahbi Fachri (2200018132)

---

> Proyek ini dibuat untuk tugas akhir Visualisasi Data 2025. Selamat menikmati eksplorasi data musik! 🎶
