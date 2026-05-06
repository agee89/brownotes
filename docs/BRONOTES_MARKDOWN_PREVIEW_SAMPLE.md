# BroNotes Markdown Preview Sample

BroNotes adalah extension catatan ringan untuk mencatat ide, referensi, dan ringkasan langsung dari halaman yang sedang dibaca.

## Kenapa BroNotes?

BroNotes dibuat untuk momen ketika kamu sedang membaca artikel, dokumentasi, atau riset kecil, lalu ingin menulis catatan tanpa pindah tab.

### Fitur utama

- Drawer catatan yang bisa dibuka di setiap halaman
- Mode transparan untuk melihat referensi di belakang panel
- Panel bisa ditutup sebagian dan dibuka lagi dari ribbon kecil
- Label untuk mengelompokkan catatan
- Preview Markdown essential

## Format Teks

Kamu bisa menulis **teks tebal** untuk poin penting, *teks miring* untuk penekanan ringan, dan _garis bawah gaya Markdown_ untuk italic berbasis underscore.

Gunakan ~~coretan~~ untuk menandai ide yang dibatalkan.

Inline code juga didukung, misalnya `chrome.storage.local` untuk menyebut API penyimpanan lokal.

## Link Dan Gambar

Contoh link: [Buka dokumentasi Chrome Extensions](https://developer.chrome.com/docs/extensions).

Contoh gambar sederhana:

![BroNotes icon](../icons/icon128.png)

## Checklist

- [x] Buka drawer BroNotes
- [x] Tulis catatan dari halaman referensi
- [x] Aktifkan mode transparan saat perlu melihat konten belakang
- [ ] Rapikan catatan sebelum disimpan
- [ ] Tambahkan label yang sesuai

## Unordered List

- Catatan riset
- Kutipan penting
- Ide artikel
  - Draft pembuka
  - Poin pembahasan
  - Catatan revisi
- Daftar referensi

## Ordered List

1. Buka halaman referensi
2. Aktifkan BroNotes
3. Buat catatan baru
   1. Isi judul
   2. Tambahkan label
   3. Tulis isi catatan
4. Simpan catatan

## Blockquote

> BroNotes membantu menjaga konteks tetap dekat dengan halaman yang sedang dibaca.
> Catatan bisa dibuat tanpa memutus alur riset.

## Horizontal Rule

Bagian di bawah ini dipisahkan dengan garis horizontal.

---

## Tabel

| Fitur | Fungsi | Status |
| --- | --- | ---: |
| Drawer | Panel catatan di sisi kanan halaman | Aktif |
| Transparansi | Membuat halaman belakang tetap terlihat | Aktif |
| Labels | Mengelompokkan catatan | Aktif |
| Markdown Preview | Melihat hasil format catatan | Essential |

## Code Block

```js
const note = {
  title: "Ide riset",
  label: "research",
  content: "Ringkasan halaman dan poin penting.",
  savedLocally: true
};

console.log("BroNotes menyimpan catatan secara lokal:", note.savedLocally);
```

```css
#bronotes-drawer {
  position: fixed;
  right: 0;
  width: 440px;
  height: 100vh;
}
```

## Catatan Panjang

BroNotes cocok digunakan untuk membuat ringkasan singkat, daftar tugas, potongan kode, atau catatan referensi. Preview Markdown ini sengaja dibuat essential agar tetap ringan dan responsif saat digunakan di banyak halaman.

