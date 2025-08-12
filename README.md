# 🎬 Movie App

Movie App adalah aplikasi pencarian film berbasis **React.js** yang menggunakan API **OMDb** untuk menampilkan daftar film, detail film, serta fitur **Watchlist** untuk menyimpan film favorit.  
Aplikasi ini memiliki desain modern, responsif, dan mudah digunakan.

---

## 🚀 Fitur

- 🔍 **Search Movie** – Cari film berdasarkan judul menggunakan API OMDb.
- 📄 **Movie Detail** – Lihat detail lengkap film termasuk poster dan informasi penting lainnya.
- ❤️ **Watchlist** – Simpan film favorit untuk ditonton nanti.
- 🎨 **Responsive UI** – Tampilan menyesuaikan di desktop dan mobile.
- 🖼 **Background Poster** – Halaman detail film menggunakan poster sebagai background untuk efek visual yang menarik.

---

## 🖼 Screenshot

### Home Page

![Home Screenshot](https://github.com/Nathxmd/MovieFinder/blob/main/Screenshot%202025-08-13%20003020.png)

### Movie Detail Page

![Detail Screenshot](https://github.com/Nathxmd/MovieFinder/blob/main/Screenshot%202025-08-13%20003032.png)

### Watchlist Page

![Watchlist Screenshot](https://github.com/Nathxmd/MovieFinder/blob/main/Screenshot%202025-08-13%20003055.png)

---

## 🛠 Tech Stack

- **React.js** – Frontend framework
- **React Router DOM** – Routing antar halaman
- **CSS Modules / Custom CSS** – Styling
- **OMDb API** – Data film
- **Local Storage** – Menyimpan watchlist

---

## 📂 Struktur Direktori

```bash
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── MovieCard.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── MovieDetail.jsx
│   ├── Watchlist.jsx
│
├── styles/
│   ├── Home.css
│   ├── MovieCard.css
│   ├── Navbar.css
│   ├── MovieDetail.css
│   ├── Watchlist.css
│
├── App.jsx
├── main.jsx
└── index.css

⚙️ Instalasi & Menjalankan Proyek
Clone repository

git clone https://github.com/username/movie-app.git
cd movie-app

Install dependencies

npm install

Tambahkan API Key OMDb

Buat akun di OMDb API (gratis).

Buat file .env di root project:

VITE_OMDB_API_KEY=YOUR_API_KEY

Jalankan aplikasi
npm run dev

Buka di browser
http://localhost:5173

📌 Catatan
Fitur Watchlist menggunakan Local Storage, jadi data akan tetap tersimpan meskipun halaman direfresh.

Pastikan API Key OMDb aktif untuk mendapatkan hasil pencarian film.

📄 Lisensi
MIT License © 2025 Nathan Mahesa Dewanto
```
