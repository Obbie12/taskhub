# Project taskhub

**Nama: Obbie Sanusi**

## Deskripsi Proyek

Proyek ini adalah aplikasi manajemen tugas (task management) yang terdiri dari tiga komponen utama:
- **Backend**: REST API menggunakan Go dengan Echo framework dan PostgreSQL
- **Web UI**: Aplikasi web menggunakan Next.js
- **Mobile**: Aplikasi mobile menggunakan Flutter

Aplikasi ini memungkinkan pengguna untuk mendaftar, login, dan mengelola daftar tugas mereka dengan operasi CRUD (Create, Read, Update, Delete).

## Pilihan Teknologi

### Backend: Echo Framework (Go)
Echo dipilih karena:
- Performa yang tinggi dan ringan
- Routing yang sederhana dan powerful
- Middleware yang mudah dikustomisasi
- Dokumentasi yang lengkap dan komunitas yang aktif
- Built-in support untuk JWT authentication

### Mobile: Provider (Flutter)
Provider dipilih untuk state management karena:
- Mudah dipelajari dan digunakan
- Cocok untuk aplikasi dengan kompleksitas menengah
- Integrasi yang baik dengan Flutter
- Pattern yang familiar (InheritedWidget)
- Mendukung perubahan state yang reaktif

## Menjalankan Proyek Secara Lokal

### Prasyarat
- Go 1.19+
- PostgreSQL
- Node.js 18+
- Flutter 3.0+
- Docker & Docker Compose

### 1. Backend

#### Setup Database
```bash
# Menjalankan database PostgreSQL menggunakan Docker
make docker-run
```

#### Menjalankan Backend
```bash
# Build aplikasi
make build

# Menjalankan aplikasi
make run

# Atau untuk development dengan live reload
make watch
```

Backend akan berjalan di `http://localhost:8080`

### 2. Web UI

```bash
# Masuk ke direktori webui
cd webui

# Install dependencies
npm install

# Menjalankan development server
npm run dev
```

Web UI akan berjalan di `http://localhost:3000`

### 3. Mobile (Flutter)

```bash
# Masuk ke direktori mobile
cd mobile

# Install dependencies
flutter pub get

# Menjalankan aplikasi (pilih device)
flutter run
```

## API Endpoints

- `POST /register` - Registrasi pengguna baru
- `POST /login` - Login pengguna
- `GET /tasks` - Mendapatkan daftar tugas
- `POST /tasks` - Membuat tugas baru
- `PUT /tasks/:id` - Memperbarui tugas
- `DELETE /tasks/:id` - Menghapus tugas

## Struktur Proyek

```
.
├── internal/          # Kode backend Go
├── webui/            # Aplikasi web Next.js
├── mobile/           # Aplikasi mobile Flutter
└── README.md
```

## Testing

```bash
# Menjalankan unit tests
make test

# Menjalankan integration tests
make itest

# Menjalankan semua tests
make all
```

## Membersihkan Build

```bash
make clean
```

## Menghentikan Database

```bash
make docker-down
```

## Catatan

Pastikan backend berjalan sebelum mengakses Web UI atau Mobile app, karena keduanya memerlukan koneksi ke API backend.

Untuk informasi lebih lanjut tentang konfigurasi, lihat file konfigurasi di masing-masing komponen.
