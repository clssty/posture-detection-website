# README: Cara Menjalankan Sistem Integrasi

Dokumen ini menjelaskan cara menjalankan sistem **Python Posture Detection** bersama **Website React** secara bersamaan di laptop yang sama.

---

## Prasyarat

| Software     | Versi minimal |
|--------------|--------------|
| Python       | 3.10+        |
| Node.js      | 18+          |
| Webcam       | Diperlukan   |

---

## Langkah 1 — Jalankan Python Backend Server

Buka **Terminal 1**, lalu jalankan:

```powershell
cd d:\Posture-Detection-System\Backend
venv\Scripts\activate
python server.py
```

Server berjalan di: **http://localhost:8000**

Anda akan melihat output seperti:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Untuk memverifikasi server aktif, buka browser dan akses:
- http://localhost:8000/health  → menampilkan `{"status":"ok"}`
- http://localhost:8000/video_feed → live video webcam

---

## Langkah 2 — Jalankan Website React

Buka **Terminal 2** (jangan tutup Terminal 1), lalu jalankan:

```powershell
cd d:\Posture-Detection-System\WebsiteBuild
npm run dev
```

Website berjalan di: **http://localhost:5173**

---

## Langkah 3 — Gunakan Sistem

1. Buka browser ke `http://localhost:5173`
2. Klik tombol **"Analyze My Posture"** di halaman Home
3. Pastikan badge **"Server Connected"** (hijau) terlihat di navbar
4. Klik **"▶ Start Analysis"**
5. Posisikan tubuh menghadap **kiri** ke kamera
6. Nilai CA, SA, dan KA akan diperbarui secara real-time

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Badge "Server Offline" (merah) | Pastikan `python server.py` sudah berjalan di Terminal 1 |
| "No pose detected" muncul | Mundur dari kamera agar seluruh tubuh (Ear → Hip) terlihat |
| Webcam tidak terdeteksi | Pastikan tidak ada aplikasi lain yang sedang menggunakan webcam |
| Port 8000 sudah digunakan | Ubah port di `server.py` baris terakhir: `port=8001` |

---

## Arsitektur Singkat

```
[Browser: React App :5173]
        │
        ├─── GET /video_feed  ──► [Python FastAPI :8000]
        │     (MJPEG stream)              │
        │                                 ├── MediaPipe Pose
        └─── WS  /ws          ──►         └── Webcam
              (JSON data 10fps)
```

---

## File Penting

| File | Keterangan |
|------|-----------|
| `Backend/server.py` | FastAPI server (titik masuk integrasi) |
| `Backend/post_test.py` | Logika deteksi original (referensi) |
| `WebsiteBuild/src/pages/PostureCheck.tsx` | Halaman analisis di website |
