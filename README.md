# Dashboard Real Time Monitoring

Dashboard ini digunakan untuk memonitor **Cycle Time Produksi secara
real-time** berbasis data dari **Google Sheets API**. Dashboard ini
menampilkan statistik utama, grafik tren, status produksi, serta tabel
data lengkap dengan fitur pencarian, sortir, pagination, dan export CSV.

------------------------------------------------------------------------

## 🔧 Fitur Utama

-   ✅ Monitoring Cycle Time secara real-time
-   ✅ Auto refresh setiap 30 detik
-   ✅ Grafik Line (Cycle Time)
-   ✅ Grafik Doughnut (Status Produksi)
-   ✅ Statistik Produksi:
    -   Rata-rata Cycle Time
    -   Total Cycle
    -   Cycle Terakhir
    -   Cycle Tercepat
-   ✅ Tabel Data dengan:
    -   Search
    -   Sort per kolom
    -   Pagination
    -   Export CSV
-   ✅ Responsive untuk desktop & mobile
-   ✅ Integrasi Google Sheets API

------------------------------------------------------------------------

## 🗂 Struktur File

    /project
    │── index.html
    │── style.css
    │── script.js
    │── README.md

------------------------------------------------------------------------

## ⚙️ Konfigurasi Google Sheets API

Silakan ubah konfigurasi berikut pada file `script.js`:

``` js
const SHEET_ID = 'YOUR_SHEET_ID';
const RANGE = 'Sheet1!A:D';
const API_KEY = 'YOUR_API_KEY';
```

Pastikan Google Sheet kamu: - Bersifat **Public (Share → Anyone with
link → Viewer)** - Kolom: - A: Timestamp - B: Cycle - C: Cycle Time
(detik) - D: Status (optional)

------------------------------------------------------------------------

## 🚀 Cara Menjalankan di Lokal

1.  Download seluruh file project
2.  Simpan dalam satu folder
3.  Buka file `index.html` di browser
4.  Dashboard akan otomatis memuat data

Untuk lebih optimal, disarankan menggunakan **Live Server (VSCode)**.

------------------------------------------------------------------------

## 🌐 Cara Hosting

Kamu bisa hosting menggunakan:

-   ✅ GitHub Pages
-   ✅ Vercel
-   ✅ Netlify

### Contoh GitHub Pages:

1.  Upload semua file ke repository GitHub
2.  Masuk ke Settings → Pages
3.  Pilih Branch `main` → `/root`
4.  Akses melalui URL GitHub Pages

------------------------------------------------------------------------

## 📊 Status Cycle

-   **LOWER** : Cycle Time \< 55 detik
-   **NORMAL** : 55 -- 65 detik
-   **OVER** : \> 65 detik

Limit bisa diubah pada bagian konfigurasi:

``` js
const LOWER_LIMIT = 55;
const UPPER_LIMIT = 65;
```

------------------------------------------------------------------------

## 📁 Export CSV

Fitur Export akan mengunduh: - Data sesuai filter pencarian - Data
sesuai sorting aktif - Dalam format `.csv`

------------------------------------------------------------------------

## 🛠 Teknologi yang Digunakan

-   HTML5
-   CSS3
-   JavaScript (Vanilla)
-   Chart.js
-   Moment.js
-   Google Sheets API

------------------------------------------------------------------------

## 👤 Developer

Dikembangkan oleh:

**Ariyanto -- ARAYA Tech**\
Dashboard Monitoring Production System

------------------------------------------------------------------------

## ✅ Lisensi

Project ini bebas digunakan untuk keperluan internal perusahaan.\
Tidak untuk diperjualbelikan tanpa izin pengembang.
