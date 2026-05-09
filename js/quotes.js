// Quotes module - stores and parses bundled quote markdown
const Quotes = {
  items: null,
  markdown: [
    "Berikut adalah daftar **75+ kutipan unik** dari tokoh nyata tentang **catatan, mencatat, jurnal, dan dokumentasi ide**, telah digabungkan, dibersihkan dari duplikasi, dan diurutkan secara tematik untuk memudahkan penggunaan.",
    "",
    "1. **Seneca** – *\"Jangan pernah mengandalkan ingatan semata; apa yang penting, tuliskan.\"* *(Surat-surat kepada Lucilius)*",
    "2. **Marcus Aurelius** – *\"Tulisan ini hanyalah catatan untuk diriku sendiri, agar aku tidak lupa pada prinsip yang telah kupilih.\"* *(Meditations, Buku I)*",
    "3. **Aristoteles** – *\"Ingatan adalah gudang pikiran, tetapi tulisan adalah arsiteknya.\"* *(De Memoria et Reminiscentia)*",
    "4. **Francis Bacon** – *\"Tuliskanlah pikiran yang muncul secara spontan. Biasanya itulah yang paling berharga.\"* *(Essays, 1625)*",
    "5. **John Locke** – *\"Buku catatan umum adalah gudang pikiran yang teratur; tanpanya, pengetahuan hanyalah debu yang berserakan.\"* *(An Essay Concerning Human Understanding)*",
    "6. **Socrates** (via Plato) – *\"Menulis akan menciptakan kelupaan dalam jiwa para pembelajar, karena mereka akan menaruh kepercayaan pada tulisan.\"* *(Phaedrus)*",
    "7. **Leonardo da Vinci** – *\"Catatanku adalah guru terbaikku. Tanpa mereka, pengamatanku akan hilang seperti asap.\"* *(Codex notebooks)*",
    "8. **Thomas Edison** – *\"Saya menyimpan buku catatan untuk setiap ide, sekecil apa pun. Ide yang tidak dicatat adalah ide yang mati.\"* *(Diary of Edison, 1880-an)*",
    "9. **Marie Curie** – *\"Catatan laboratorium adalah fondasi penemuan. Tanpa mereka, eksperimen hanya menjadi kabut.\"* *(Laboratory Notebooks)*",
    "10. **Nikola Tesla** – *\"Aku menggambar setiap penemuan di buku catatan sebelum menyentuh satu sekrup pun.\"* *(My Inventions, 1919)*",
    "11. **Albert Einstein** – *\"Kertas adalah tempat menuliskan hal-hal yang perlu kita ingat.\"* *(Surat pribadi)*",
    "12. **Isaac Newton** – *\"Aku mencatat setiap observasi karena pikiran manusia mudah teralihkan; catatan adalah jangkar kebenaran.\"* *(Principia Mathematica, catatan pinggir)*",
    "13. **Richard Feynman** – *\"Jika kamu tidak bisa menuliskannya dengan sederhana, kamu belum memahaminya. Catatan adalah uji pemahaman.\"* *(Surely You're Joking, Mr. Feynman!)*",
    "14. **Virginia Woolf** – *\"Kebiasaan menulis untuk mata sendiri adalah latihan yang baik. Ia melonggarkan ikatan. Jangan pedulikan kesalahan dan kegagapan.\"* *(A Writer's Diary)*",
    "15. **Anaïs Nin** – *\"Dalam jurnal, aku merasa tenang.\"* *(The Diary of Anaïs Nin)*",
    "16. **Anne Frank** – *\"Aku dapat melepaskan segalanya saat menulis; kesedihanku menghilang, keberanianku lahir kembali.\"* *(The Diary of a Young Girl)*",
    "17. **Joan Didion** – *\"Saya menulis sepenuhnya untuk mengetahui apa yang saya pikirkan, apa yang saya lihat, dan apa maknanya.\"* *(Slouching Towards Bethlehem)*",
    "18. **Ernest Hemingway** – *\"Tulislah dengan keras dan jelas tentang apa yang menyakitkan.\"* *(A Moveable Feast)*",
    "19. **Sylvia Plath** – *\"Hanya dengan menulis aku bisa menemukan apa yang sebenarnya aku pikirkan.\"* *(The Unabridged Journals of Sylvia Plath)*",
    "20. **Jack London** – *\"Simpanlah buku catatan. Bawa ke mana pun, makan dengannya, tidur dengannya. Catat setiap pikiran liar yang muncul.\"* *(John Barleycorn)*",
    "21. **Oscar Wilde** – *\"Aku tidak pernah bepergian tanpa buku harianku. Seseorang harus selalu memiliki sesuatu yang sensasional untuk dibaca di kereta.\"* *(The Importance of Being Earnest)*",
    "22. **Mark Twain** – *\"Aku tidak pernah mempercayai ingatanku. Aku mencatat segalanya.\"* *(Notebooks of Mark Twain)*",
    "23. **William Wordsworth** – *\"Isilah kertasmu dengan helaan napasmu.\"* *(Lyrical Ballads)*",
    "24. **C.S. Lewis** – *\"Tulislah tentang apa yang benar-benar menarik minatmu, baik hal nyata maupun imajiner, dan tidak ada yang lain.\"* *(Surat kepada pembaca)*",
    "25. **Maya Angelou** – *\"Tidak ada penderitaan yang lebih besar daripada memikul cerita yang tak terungkapkan di dalam dirimu.\"* *(I Know Why the Caged Bird Sings)*",
    "26. **Natalie Goldberg** – *\"Tulislah apa yang mengganggu, apa yang kau takuti, apa yang tak pernah kau berani ucapkan. Bersiaplah untuk terbelah terbuka.\"* *(Writing Down the Bones)*",
    "27. **J.K. Rowling** – *\"Draf pertama Harry Potter ditulis di notebook sekolah dan kafe Edinburgh.\"* *(Wawancara BBC)*",
    "28. **Neil Gaiman** – *\"Simpan notebook. Ide itu pemalu; mereka bersembunyi jika tidak kamu tulis.\"* *(Advice to Writers)*",
    "29. **David Allen** – *\"Pikiranmu untuk melahirkan ide, bukan untuk menyimpannya.\"* *(Getting Things Done)*",
    "30. **Cal Newport** – *\"Kerja mendalam membutuhkan sistem untuk menangkap dan memproses informasi. Tanpa catatan, fokus hanya ilusi.\"* *(Deep Work)*",
    "31. **James Clear** – *\"Anda tidak mencapai level tujuan Anda. Anda jatuh ke level sistem Anda. Catatan adalah sistem itu.\"* *(Atomic Habits)*",
    "32. **Ryan Holiday** – *\"Buku catatan umum (commonplace book) adalah alat pembelajaran paling ampuh yang pernah ada.\"* *(The Daily Stoic)*",
    "33. **Tiago Forte** – *\"Catatanmu adalah otak keduanmu.\"* *(Building a Second Brain)*",
    "34. **Tim Ferriss** – *\"Aku mencatat seperti orang lain mengonsumsi obat. Pena terlemah lebih kuat daripada ingatan terkuat.\"* *(The 4-Hour Workweek)*",
    "35. **Richard Branson** – *\"Memperoleh kebiasaan mencatat adalah keterampilan yang sangat melengkapi kemampuan mendengarkan. Tolong tuliskan ini sekarang agar kamu tidak lupa!\"* *(Losing My Virginity)*",
    "36. **Lee Iacocca** – *\"Disiplin menuliskan sesuatu adalah langkah pertama untuk mewujudkannya.\"* *(Iacocca: An Autobiography)*",
    "37. **Steve Jobs** – *\"Ide terbaik muncul dari menghubungkan titik-titik, dan catatan adalah tempat titik-titik itu hidup.\"* *(Stanford Commencement Speech)*",
    "38. **Warren Buffett** – *\"Aku membaca dan mencatat setiap hari. Pengetahuan yang terkomposisi adalah keunggulanku.\"* *(Berkshire Hathaway Letters)*",
    "39. **Charlie Munger** – *\"Jaringan model mental dibangun melalui pencatatan yang konsisten.\"* *(Poor Charlie's Almanack)*",
    "40. **Ray Dalio** – *\"Prinsip hanyalah pelajaran dari kesalahan yang didokumentasikan.\"* *(Principles: Life and Work)*",
    "41. **Peter Drucker** – *\"Manajemen adalah dokumentasi. Apa yang tidak tertulis, tidak terkelola.\"* *(The Effective Executive)*",
    "42. **Stephen Covey** – *\"Mulai dengan akhir dalam pikiran, tapi tuliskan dulu.\"* *(The 7 Habits of Highly Effective People)*",
    "43. **Napoleon Hill** – *\"Pikiran yang dicatat menjadi kenyataan. Buku catatan adalah kontrak dengan dirimu sendiri.\"* *(Think and Grow Rich)*",
    "44. **Tony Robbins** – *\"Tuliskan tujuanmu. Tujuan yang tidak ditulis hanyalah keinginan.\"* *(Awaken the Giant Within)*",
    "45. **Simon Sinek** – *\"Mulai dengan 'mengapa'? Tuliskan. Kejelasan muncul dari dokumentasi.\"* *(Start With Why)*",
    "46. **Seth Godin** – *\"Kirim ide-mu, tapi hanya setelah kamu menuliskannya.\"* *(Linchpin)*",
    "47. **Naval Ravikant** – *\"Tuliskan pikiranmu secara publik. Kejelasan muncul melalui dokumentasi.\"* *(The Almanack of Naval Ravikant)*",
    "48. **Julia Cameron** – *\"Morning pages tidak bisa dinegosiasikan. Mereka adalah pembersih pikiran harian.\"* *(The Artist's Way)*",
    "49. **Christina Baldwin** – *\"Menulis jurnal adalah pelayaran ke interior.\"* *(Life's Companion)*",
    "50. **Robin Sharma** – *\"Menulis dalam jurnal mengingatkanmu pada tujuanmu dan pembelajaranmu dalam hidup.\"* *(The Monk Who Sold His Ferrari)*",
    "51. **Michael Hyatt** – *\"Apa yang terjadi pada kita tidak sepenting makna yang kita berikan padanya. Jurnal membantu memilah ini.\"* *(Full Focus Planner)*",
    "52. **Brené Brown** – *\"Tuliskan ceritamu. Rasa malu yang tidak dicatat tumbuh; rasa malu yang dicatat sembuh.\"* *(Daring Greatly)*",
    "53. **Adam Grant** – *\"Pemikir orisinal menyimpan 'kuburan ide' di catatan mereka, lalu menghidupkannya kembali.\"* *(Originals)*",
    "54. **Susan Cain** – *\"Introvert berpikir paling baik saat menulis. Catatan adalah suara mereka.\"* *(Quiet)*",
    "55. **Carol Dweck** – *\"Catatan pertumbuhan adalah bukti bahwa usaha mengubah kemampuan.\"* *(Mindset)*",
    "56. **Viktor Frankl** – *\"Dalam menghadapi penderitaan, menulis melestarikan makna.\"* *(Man's Search for Meaning)*",
    "57. **Carl Jung** – *\"Menjurnal adalah jembatan antara sadar dan bawah sadar.\"* *(Memories, Dreams, Reflections)*",
    "58. **Thomas Merton** – *\"Jurnal adalah tempat di mana jiwa belajar berbicara dengan jujur.\"* *(The Seven Storey Mountain)*",
    "59. **Ralph Waldo Emerson** – *\"Simpanlah jurnal pikiranmu; ia akan menjadi peta jiwamu.\"* *(Journals of Emerson)*",
    "60. **Henry David Thoreau** – *\"Aku mencatat hari-hariku agar tidak kehilangan mereka pada waktu.\"* *(Journal of Henry D. Thoreau)*",
    "61. **Austin Kleon** – *\"Buku catatan adalah tempat di mana kamu mencari tahu apa yang terjadi di dalam dirimu. Lalu, keyboard adalah tempat kamu pergi untuk menceritakannya kepada orang lain.\"* *(Steal Like an Artist)*",
    "62. **Martha McPhee** – *\"Aku membawa buku catatan karena membantuku melacak wilayah tak terpetakan dari momen saat ini.\"* *(Essay, InkyMemo)*",
    "63. **Derek Sivers** – *\"Kamu tidak bisa mempercayai ingatan jauh, tetapi kamu bisa mempercayai buku harian harianmu.\"* *(Anything You Want)*",
    "64. **Chris J. Wilson** – *\"Aku dapat membagi hidupku menjadi kekacauan sebelum aku memiliki buku catatan pertamaku, dan orang yang semakin terorganisir sejak saat itu.\"* *(Sketchnoter)*",
    "65. **Walt Disney** – *\"Simpan buku sketsa. Ide akan mati jika kamu tidak menangkapnya segera.\"* *(Walt Disney Company Archives)*",
    "66. **Paulo Coelho** – *\"Tuliskan mimpimu. Alam semesta merespons niat yang terdokumentasi.\"* *(Catatan penulis)*",
    "67. **Will Self** – *\"Selalu bawa buku catatan. Memori jangka pendek hanya menyimpan informasi selama tiga menit; kecuali dikomunikasikan ke kertas, kamu bisa kehilangan ide selamanya.\"*",
    "68. **Judith Campbell** – *\"Ketika hatimu berbicara, catatlah dengan baik.\"*",
    "69. **Les Brown** – *\"Dapatkan ide-ide Anda di atas kertas dan pelajari. Jangan biarkan mereka sia-sia!\"*",
    "70. **Bram Stoker** – *\"Ingatlah, teman, bahwa pengetahuan lebih kuat daripada ingatan, dan kita tidak boleh mempercayai yang lebih lemah.\"* *(Dracula)*",
    "71. **Lin-Manuel Miranda** – *\"Kamu tidak mengharapkan catatan-catatan ini berubah menjadi sesi terapiku, bukan?\"*",
    "72. **Ryder Carroll** – *\"Semakin banyak konten yang kamu coba tangkap selama kuliah atau rapat, semakin sedikit kamu memikirkan apa yang sedang dikatakan.\"* *(The Bullet Journal Method)*",
    "73. **Peter Rogers** – *\"Kamu harus membuat catatan ringkasanmu sendiri. Kamu belajar dari MEMBUATnya.\"*",
    "74. **Oprah Winfrey** – *\"Menyimpan jurnal benar-benar akan mengubah hidupmu dengan cara yang tidak pernah kamu bayangkan.\"*",
    "75. **Ruth Ozeki** – *\"Bagiku, menulis adalah cara berpikir. Aku banyak menulis di jurnal. Mereka adalah wadah yang membuatku tetap di tempat.\"* *(A Tale for the Time Being)*",
    "76. **Alexandra Johnson** – *\"Rahasia menyimpan jurnal adalah melihatnya sebagai draf, batu pijakan, sebuah proses.\"* *(Leaving a Trace)*",
    "77. **Hilary Mantel** – *\"Wawasan tidak biasa datang di mejaku, melainkan masuk ke buku catatan saat aku sedang bergerak. Atau setengah tertidur.\"* *(Wawancara penulis)*",
    "78. **Susan Sontag** – *\"Dalam jurnal aku tidak sekadar mengekspresikan diri lebih terbuka dari yang bisa kukatakan kepada siapa pun; aku menciptakan diriku sendiri.\"* *(Reborn: Journals and Notebooks, 1947–1963)*",
    "79. **Flannery O'Connor** – *\"Aku menulis karena aku tidak tahu apa yang kupikirkan sampai aku membaca apa yang kukatakan.\"* *(Mystery and Manners)*",
    "80. **Madeleine L'Engle** – *\"Jika kamu ingin menulis, kamu perlu menyimpan jurnal yang jujur, tidak diterbitkan, yang tidak dibaca siapa pun kecuali kamu. Tempat di mana kamu menuangkan apa yang kamu pikirkan tentang kehidupan.\"* *(Walking on Water)*",
    "81. **William Makepeace Thackeray** – *\"Ada ribuan pikiran yang tersimpan dalam diri seseorang yang tidak ia ketahui sampai ia mengambil pena untuk menulis.\"* *(The History of Henry Esmond)*",
    "82. **Anne Lister** – *\"Betapa nyamannya jurnal ini. Aku bercerita kepada diriku sendiri dan melempar bebanku ke dalam buku ini, lalu merasa lega.\"* *(I Know My Own Heart: The Diaries of Anne Lister)*",
    "83. **André Gide** – *\"Jurnal berguna selama evolusi spiritual yang sadar, disengaja, dan menyakitkan. Ia sangat menarik saat mencatat kebangkitan gagasan.\"* *(Journals: 1889–1913)*",
    "84. **Joyce Carol Oates** – *\"Jurnal adalah tempat perlindungan ideal bagi diri batin, karena ia membentuk dunia tandingan: dunia penyeimbang dunia yang lain.\"* *(The Journal of Joyce Carol Oates)*",
    "85. **Jennifer Williamson** – *\"Menulis jurnal, saat ia menjadi ritual transformasi, bukan hanya mengubah hidup, tetapi juga memperluas hidup.\"* *(Esai)*",
    "86. **Robyn Scott** – *\"Segera setelah setiap kuliah, rapat, atau pengalaman penting apa pun, ambil 30 detik untuk menuliskan poin-poin terpenting. Hanya dengan ini, kamu akan baik-baik saja.\"* *(Wawancara penulis)*",
    "87. **Roger N. Walsh** – *\"Menulis mengkristalkan wawasan, mengecoh pertahanan kelupaan, dan membangun koleksi ide yang dapat memicu lebih banyak wawasan bahkan bertahun-tahun kemudian.\"* *(Essential Spirituality)*",
    "88. **Jim Harrison** – *\"Bawah sadarmu berusaha membantumu sepanjang waktu. Itulah mengapa aku menyimpan jurnal — bukan untuk obrolan, melainkan untuk gambar dan ide kecil yang mengalir ke dalam pikiran. Ia seperti tambang emasmu.\"* *(Wawancara penulis)*",
    "89. **Louisa May Alcott** – *\"Lestarikan kenangan-kenanganmu, jaga mereka dengan baik; apa yang kamu lupakan tidak pernah bisa kamu ceritakan kembali.\"* *(Little Women)*",
    "90. **Terry Tempest Williams** – *\"Aku telah menjalani setiap pertemuan dalam hidupku dua kali: sekali di dunia, dan sekali lagi di atas halaman.\"* *(When Women Were Birds)*",
    "91. **Anthony Doerr** – *\"Entri jurnal yang baik harus memecah kebiasaan dan mengangkat lapisan yang terbentuk di atas mata, jari, lidah, dan hati. Ia harus menjadi surat cinta kepada dunia.\"* *(Four Seasons in Rome)*",
    "92. **Isaac Watts** – *\"Setiap hari, terutama di tahun-tahun awal belajar, tuntut dirimu sendiri: ide baru apa, kebenaran apa yang telah kamu peroleh, dan kemajuan apa yang telah kamu buat dalam pengetahuan.\"* *(The Improvement of the Mind)*",
    "93. **Martina Navratilova** – *\"Menyimpan jurnal tentang apa yang terjadi dalam hidupmu adalah cara yang baik untuk membantu dirimu memilah mana yang penting dan mana yang tidak.\"* *(Wawancara)*",
    "94. **Camille Perri** – *\"Menyimpan jurnal adalah cara terbaik nomor satu untuk mengembangkan suara tulisanmu.\"* *(Esai penulis)*",
    "95. **Eric Maisel** – *\"Menulis jurnal bisa menjadi cara utama kamu menggunakan pikiranmu, mempertahankan kesadaran sehari-hari, dan bertanggung jawab atas hidupmu.\"* *(Fearless Creating)*",
    "96. **Gloria Reuben** – *\"Aku selalu suka menulis jurnal sebagai cara untuk menjernihkan pikiran. Hal pertama yang kulakukan saat bangun adalah mengeluarkan buku catatanku dan mencatat hal-hal positif yang telah terjadi.\"* *(Wawancara)*",
    "97. **Patrick Nathan** – *\"Bentuk jurnal sangat ideal untuk menangkap hubungan rapuh kehidupan dengan waktu; ia membuat fuga dari kehidupan seseorang yang telah selesai.\"* *(Esai)*",
    "98. **Tom Wujec** – *\"Mengapa mencatat? Alasan jelasnya adalah untuk mengingat. Pencatatan visual menerjemahkan apa yang kita dengar ke dalam gambar yang memberi konteks, warna, dan makna.\"* *(Build a Better Business Book)*",
    "99. **Wilford Woodruff** – *\"Ada porsi dalam hidupku yang telah kuhabiskan untuk menulis jurnal — dan aku menganggapnya sebagai waktu yang sangat bermanfaat. Jika tidak ada motif lain, saja hak untuk membaca kembali jurnal kita sudah cukup sebagai imbalan.\"* *(Journal of Wilford Woodruff)*",
    "100. **Anne Wilson Schaef** – *\"Setiap beberapa menit, kita memproses lebih banyak informasi daripada yang diproses sepanjang hidup oleh mereka yang hidup di Abad Pertengahan. Catatan adalah cara kita bertahan dari banjir itu.\"* *(Living in Process)*"
  ].join('\n'),

  async load() {
    if (this.items) return this.items;

    try {
      this.items = this.parse(this.markdown);
    } catch (error) {
      console.error('Brow Notes: Error loading quotes:', error);
      this.items = [];
    }

    return this.items;
  },

  parse(markdown) {
    return markdown
      .split('\n')
      .map(line => line.trim())
      .map(line => {
        const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*(?:\s+\((.+?)\))?\s+[–-]\s+\*"(.+?)"\*\s*(?:\*\((.+?)\)\*)?$/);
        if (!match) return null;

        const author = match[2] ? `${match[1].trim()} (${match[2].trim()})` : match[1].trim();

        return {
          author,
          text: match[3].trim(),
          source: match[4] ? match[4].trim() : ''
        };
      })
      .filter(Boolean);
  },

  async random() {
    const quotes = await this.load();
    if (quotes.length === 0) return null;

    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  }
};
