# ♟️ Mini Chess AI — Advanced Adversarial Search Simulation

[![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/github%20pages-%23121011.svg?style=for-the-badge&logo=githubpages&logoColor=white)](https://pages.github.com/)

Proyek ini adalah aplikasi web interaktif berbasis game catur mini (ukuran papan 4x4) yang ditenagai oleh Kecerdasan Buatan (AI) sebagai *competitive agent*. Proyek ini dirancang untuk mensimulasikan bagaimana pengambilan keputusan berbasis pohon (*Game Tree Search*) bekerja pada lingkungan *Adversarial Search*. 

Dikembangkan sebagai proyek implementasi untuk mata kuliah **Kecerdasan Buatan (S1 Teknik Informatika)**.

---

## 🚀 Fitur Unggulan

* **Intelligent AI Engine:** Menggunakan Kombinasi Algoritma **Minimax** dan optimasi **Alpha-Beta Pruning** untuk menentukan langkah terbaik (*best move*) secara *real-time*.
* **Live Performance Metrics:** Menampilkan statistik pencarian pohon keputusan secara transparan:
  * **Nodes Evaluated:** Jumlah status papan yang dikalkulasi oleh AI.
  * **Pruned Branches:** Jumlah cabang tidak potensial yang berhasil dipangkas untuk efisiensi memori.
* **Notasi & Riwayat Langkah Otomatis:** Sistem pencatatan *Live Move History* yang mengubah koordinat matriks array ke dalam standar notasi catur internasional (A1 hingga D4).
* **Modern Cyberpunk Theme:** Antarmuka visual premium berbasis *Dark Mode* mewah dengan tipografi futuristik (`Orbitron`), efek *ambient glow*, dan animasi partikel latar belakang yang responsif.
* **State Management & Backtracking:** Implementasi kloning status papan berbasis JSON untuk mencegah mutasi data selama proses kalkulasi pohon keputusan.

---

## 🛠️ Spesifikasi Algoritma

Agen AI bekerja dengan memprediksi langkah ke depan menggunakan fungsi evaluasi statis berbasis bobot nilai bidak (*heuristic value*):
* **Raja (King / ♔ / ♚):** ±100 poin
* **Benteng (Rook / ♖ / ♜):** ±50 poin
* **Pion (Pawn / ♙ / ♟):** ±10 poin

Dengan kedalaman pencarian (*Search Depth*) maksimal bernilai **3**, algoritma melakukan pengecekan rekursif untuk memaksimalkan keuntungan AI (*Maximizing Player*) sekaligus meminimalkan keuntungan langkah manusia (*Minimizing Player*).

---

## 🎮 Aturan Permainan (Papan 4x4)

1. **Pion (Pawn):** Melangkah maju 1 petak jika kosong, dan memakan bidak lawan secara diagonal ke depan sejauh 1 petak.
2. **Benteng (Rook):** Bergerak lurus secara vertikal atau horizontal. Pada variasi catur mini ini, benteng diberikan kemampuan melompati hambatan untuk mempercepat dinamika permainan.
3. **Raja (King):** Bergerak bebas ke 8 arah mata angin sejauh 1 petak.
4. **Kondisi Menang:** Salah satu pihak berhasil mengeliminasi (memakan) Raja lawan.

---

## 📂 Struktur Repositori

```text
├── index.html      # Struktur layout semantik & panel instrumentasi data
├── style.css       # Desain tema futuristik, layout grid, & efek animasi
├── script.js       # Logika state game catur & mesin kecerdasan buatan Minimax
└── README.md       # Dokumentasi teknis proyek (File ini)
