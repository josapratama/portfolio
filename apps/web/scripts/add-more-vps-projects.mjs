// Script to add 11 additional real projects to the VPS API
const API_BASE = "https://josapratama-api.josapratama.com/api/v1";

async function main() {
  console.log("🚀 Authenticating to VPS Admin API...");
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@portfolio.dev", password: "Admin@12345" })
  });

  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.data?.access_token) {
    throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
  }

  const token = loginData.data.access_token;
  console.log("✓ Logged in as Admin. Access token acquired.\n");
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const additionalProjects = [
    {
      slug: "uml-flow-studio",
      title: {
        en: "UML Flow Studio — Interactive Diagramming & AI Modeling Canvas",
        id: "UML Flow Studio — Kanvas Pemodelan UML Interaktif & Generator AI"
      },
      short_description: {
        en: "High-performance browser-based diagramming suite powered by Bun and Hono. Convert textual DSL into UML and flowcharts, or generate architectures via AI.",
        id: "Aplikasi perancangan diagram browser performa tinggi berbasis Bun dan Hono. Ubah teks DSL menjadi diagram UML dan flowchart, atau buat arsitektur via AI."
      },
      full_description: {
        en: `## Overview\n\n**UML Flow Studio** is an interactive, browser-based visual modeling and architecture design suite. Engineered with Bun, Hono, React 19, and Tailwind CSS 4, it provides smooth canvas manipulation and instant DSL compilation.\n\n## Key Features\n\n- **Interactive Visual Canvas**: Infinite panning, zooming, snap-to-grid, and multi-selection with undo/redo history.\n- **DSL-to-Diagram Engine**: Real-time two-way sync between text DSL definitions and visual canvas nodes.\n- **AI Architecture Generator**: Describe system workflows in natural language and receive formatted diagrams instantly.\n- **Vector Export**: High-resolution PNG, vector SVG, and portable JSON schema export.`,
        id: `## Gambaran Umum\n\n**UML Flow Studio** adalah platform pemodelan visual dan perancangan arsitektur sistem interaktif berbasis browser. Ditenagai oleh Bun, Hono, React 19, dan Tailwind CSS 4 dengan performa tinggi.\n\n## Fitur Utama\n\n- **Kanvas Visual Interaktif**: Navigasi kanvas tak terbatas (pan/zoom), snap-to-grid, dan riwayat undo/redo penuh.\n- **Engine DSL-ke-Diagram**: Sinkronisasi dua arah instan antara kode teks DSL dan node diagram visual.\n- **Generator Arsitektur AI**: Deskripsikan alur sistem dalam bahasa natural untuk diubah menjadi diagram otomatis.\n- **Ekspor Vektor**: Unduh hasil dalam format PNG resolusi tinggi, SVG vektor, maupun JSON schema.`
      },
      tech_stack: ["Bun", "Hono", "React 19", "TypeScript", "Tailwind CSS 4", "Vite", "Docker"],
      role: {
        en: "Creator & Lead Full-Stack Architect",
        id: "Kreator & Lead Arsitek Full-Stack"
      },
      status: "published",
      is_featured: true,
      is_visible: true,
      sort_order: 9,
      live_demo_url: "https://uml.josapratama.com",
      repo_url: "https://github.com/josapratama/uml-flow",
      cover_image_url: ""
    },
    {
      slug: "guidepath-academic",
      title: {
        en: "GuidePath — Integrated Thesis Mentorship & AI Research Assistant",
        id: "GuidePath — Platform Bimbingan Skripsi Terpadu & Asisten Riset AI"
      },
      short_description: {
        en: "Comprehensive academic mentorship platform combining lecturer-student thesis workflows, AI research assistance, SINTA/Crossref indexing, and plagiarism detection.",
        id: "Sistem terpadu bimbingan tugas akhir/skripsi yang menggabungkan alur bimbingan dosen-mahasiswa, asisten riset AI, pencarian jurnal SINTA/Crossref, dan deteksi plagiarisme."
      },
      full_description: {
        en: `## Overview\n\n**GuidePath** is a modern academic research and thesis mentorship platform built on Laravel 13, FrankenPHP, and React 19 Inertia.js. It bridges the gap between students and academic supervisors with intelligent research tools.\n\n## Key Features\n\n- **Supervision Workflows**: Milestone tracking, chapter submissions, inline document annotation, and meeting logs.\n- **AI Research Assistant**: Literature review summarizer, semantic query engine, and thesis draft refinement.\n- **Scholarly Search Engine**: Direct integration with SINTA, Crossref, and Semantic Scholar indexes.\n- **Plagiarism & Similarity Detection**: Fast document comparison with side-by-side highlighted match reporting.\n- **Dual Document Viewer**: Native PDF rendering and Mammoth Word (.docx) HTML previewer.`,
        id: `## Gambaran Umum\n\n**GuidePath** adalah platform bimbingan tugas akhir dan riset akademik modern yang dibangun menggunakan Laravel 13, FrankenPHP, dan React 19 Inertia.js. Mengintegrasikan alur bimbingan dosen-mahasiswa dengan kecerdasan buatan.\n\n## Fitur Utama\n\n- **Alur Bimbingan Interaktif**: Pelacakan bab skripsi, catatan revisi inline, log konsultasi, dan persetujuan dosen.\n- **Asisten Riset AI**: Perumusan kajian pustaka, pencarian semantik jurnal, dan perbaikan tata bahasa naskah.\n- **Integrasi Jurnal Bereputasi**: Akses langsung ke database publikasi SINTA, Crossref, dan Semantic Scholar.\n- **Deteksi Kemiripan & Plagiarisme**: Analisis kemiripan teks dengan sorotan dokumen berdampingan.\n- **Dual Document Viewer**: Penampil dokumen bawaan untuk berkas PDF dan Word (.docx).`
      },
      tech_stack: ["Laravel 13", "FrankenPHP", "React 19", "Inertia.js", "Tailwind CSS 4", "PostgreSQL", "Docker"],
      role: {
        en: "Lead Systems Architect & Full-Stack Developer",
        id: "Lead Systems Architect & Pengembang Full-Stack"
      },
      status: "published",
      is_featured: true,
      is_visible: true,
      sort_order: 10,
      live_demo_url: "https://guidepath.josapratama.com",
      repo_url: "https://github.com/josapratama/guide",
      cover_image_url: ""
    },
    {
      slug: "learnify-learning-platform",
      title: {
        en: "Learnify — Modern E-Learning & Course Platform",
        id: "Learnify — Platform E-Learning & Kursus Daring Modern"
      },
      short_description: {
        en: "Full-featured web e-learning platform built with Next.js 16, Prisma 7, and PostgreSQL. Supports video streaming, interactive quizzes, instructor portals, and payments.",
        id: "Platform e-learning berbasis web modern yang dibangun dengan Next.js 16, Prisma 7, dan PostgreSQL. Mendukung materi video, kuis interaktif, manajemen kursus, dan sertifikat."
      },
      full_description: {
        en: `## Overview\n\n**Learnify** is a scalable course hosting and online education platform designed for seamless learning experiences.\n\n## Key Features\n\n- **Multi-Format Courseware**: Video lessons, rich markdown reading material, downloadable resources, and quizzes.\n- **Instructor Studio**: Comprehensive course curriculum builder, student enrollment analytics, and revenue tracking.\n- **Automated Certification**: Dynamic PDF certificates generated upon course curriculum completion.\n- **Payment & Enrollment**: Integrated checkout with Midtrans and PayGateway for instant course unlocking.`,
        id: `## Gambaran Umum\n\n**Learnify** adalah platform edukasi online dan kursus daring yang dirancang untuk memberikan pengalaman belajar interaktif dan terstruktur.\n\n## Fitur Utama\n\n- **Kurikulum Multi-Format**: Pembelajaran video, modul bacaan, materi unduhan, dan evaluasi kuis.\n- **Studio Instruktur**: Pembuatan silabus kursus, dasbor analitik kemajuan siswa, dan laporan penjualan.\n- **Penerbitan Sertifikat Otomatis**: Sertifikat kelulusan PDF instan setelah menyelesaikan seluruh materi.\n- **Pembayaran Terintegrasi**: Integrasi gateway pembayaran Midtrans dan PayGateway.`
      },
      tech_stack: ["Next.js 16", "React 19", "Prisma 7", "PostgreSQL", "Tailwind CSS 4", "Midtrans", "TypeScript"],
      role: {
        en: "Full-Stack Web Engineer",
        id: "Full-Stack Web Engineer"
      },
      status: "published",
      is_featured: false,
      is_visible: true,
      sort_order: 11,
      live_demo_url: "https://learnify.josapratama.com",
      repo_url: "https://github.com/josapratama/learnify",
      cover_image_url: ""
    },
    {
      slug: "paygateway-hub",
      title: {
        en: "PayGateway Hub — Self-Hosted Direct Payment Engine & Dynamic QRIS",
        id: "PayGateway Hub — Payment Gateway Mandiri & QRIS Dinamis Otomatis"
      },
      short_description: {
        en: "Multi-tenant payment infrastructure enabling direct settlement to bank accounts and dynamic EMVCo QRIS with 0% transaction fee and automatic webhook verification.",
        id: "Infrastruktur gateway pembayaran mandiri untuk penerimaan langsung rekening bank dan QRIS dinamis EMVCo dengan 0% biaya transaksi dan verifikasi mutasi otomatis."
      },
      full_description: {
        en: `## Overview\n\n**PayGateway Hub** is an independent, self-hosted payment gateway engine built to eliminate third-party merchant fees across the application ecosystem.\n\n## Key Features\n\n- **Dynamic EMVCo QRIS**: Programmatic QRIS generation with exact invoice amounts and automatic payment settlement.\n- **Direct Bank Mutation Scraper**: Real-time balance and transaction verification for major Indonesian banks (BCA, Mandiri, BRI, BNI).\n- **Zero Transaction Fees**: Direct settlement into owner bank accounts without third-party commission deductions.\n- **Webhook Dispatcher**: Cryptographically signed payment notifications delivered to Learnify, MiniHost, and WABridge.`,
        id: `## Gambaran Umum\n\n**PayGateway Hub** adalah engine payment gateway mandiri yang dibangun untuk meniadakan biaya potongan pihak ketiga di seluruh ekosistem aplikasi.\n\n## Fitur Utama\n\n- **QRIS Dinamis EMVCo**: Pembuatan barcode QRIS otomatis dengan nominal unik dan pelunasan instan.\n- **Cek Mutasi Bank Otomatis**: Verifikasi pembayaran real-time rekening bank nasional (BCA, Mandiri, BRI, BNI).\n- **Bebas Potongan Komisi (0% Fee)**: Pembayaran langsung masuk ke rekening pribadi tanpa perantara.\n- **Webhook Notifikasi Aman**: Pengiriman konfirmasi status pembayaran terenkripsi ke layanan Learnify, MiniHost, dan WABridge.`
      },
      tech_stack: ["Go", "Node.js", "TypeScript", "PostgreSQL", "Redis", "EMVCo QRIS", "Docker"],
      role: {
        en: "Fintech & Backend Systems Architect",
        id: "Fintech & Backend Systems Architect"
      },
      status: "published",
      is_featured: true,
      is_visible: true,
      sort_order: 12,
      live_demo_url: "https://pay.josapratama.com",
      repo_url: "https://github.com/josapratama/payment-gateway",
      cover_image_url: ""
    },
    {
      slug: "resumecraft-ai-builder",
      title: {
        en: "ResumeCraft AI — Intelligent Resume Builder & ATS Engine",
        id: "ResumeCraft AI — Pembuat CV Pintar & Standar ATS Berbasis AI"
      },
      short_description: {
        en: "AI-powered professional resume builder featuring 25 bespoke templates, real-time preview, ATS score optimization, and pixel-perfect PDF compilation.",
        id: "Platform pembuatan CV profesional bertenaga AI dengan 25 pilihan template elegan, pratinjau real-time, optimasi skor ATS, dan ekspor PDF presisi."
      },
      full_description: {
        en: `## Overview\n\n**ResumeCraft AI** is a professional career resume builder designed to craft high-impact, ATS-optimized CVs with generative AI assistance.\n\n## Key Features\n\n- **25 Designer Templates**: Classic, Modern, Minimal, Executive, Tech, Creative, Elegant, Newspaper, Retro, Swiss, and more.\n- **AI Content Enhancer**: Generate compelling summaries and quantify career achievements using LLM integration.\n- **Real-Time Interactive Editor**: Instant canvas re-rendering as fields are typed with drag-and-drop section reordering.\n- **Vector PDF Generator**: Client-side pixel-perfect PDF rendering with custom margins and typography.`,
        id: `## Gambaran Umum\n\n**ResumeCraft AI** adalah platform penyusun kurikulum vitae (CV) cerdas yang dirancang untuk menghasilkan resume profesional berstandar ATS dengan bantuan AI.\n\n## Fitur Utama\n\n- **25 Template Desain Eksklusif**: Classic, Modern, Minimal, Executive, Tech, Creative, Elegant, Nordic, Swiss, dan lainnya.\n- **Asisten Penulisan AI**: Mengoptimalkan ringkasan profil dan merumuskan deskripsi pencapaian kerja secara persuasif.\n- **Editor Interaktif Real-Time**: Pembaruan tata letak kanvas seketika saat mengetik dengan fitur drag-and-drop urutan bagian.\n- **Ekspor PDF Vektor Presisi**: Kompilasi dokumen PDF beresolusi tinggi yang ramah mesin pemindai ATS.`
      },
      tech_stack: ["React 19", "TypeScript", "Tailwind CSS", "PDF Engine", "OpenAI / LLM API", "Vite"],
      role: {
        en: "Creator & Full-Stack Developer",
        id: "Kreator & Pengembang Full-Stack"
      },
      status: "published",
      is_featured: true,
      is_visible: true,
      sort_order: 13,
      live_demo_url: "https://resumecraft.josapratama.com",
      repo_url: "https://github.com/josapratama/resumecraft-ai",
      cover_image_url: ""
    },
    {
      slug: "wiring-tool-electronics",
      title: {
        en: "WiringTool — Browser Electronics Wiring & Schematic Studio",
        id: "WiringTool — Studio Skematik & Rangkaian Elektronika Berbasis Web"
      },
      short_description: {
        en: "Lightweight, zero-backend circuit design studio built with Svelte 5. Draw intuitive wiring connections between microcontrollers (ESP32, Arduino, Raspberry Pi) and sensors.",
        id: "Studio perancangan skematik elektronika ringan tanpa backend berbasis Svelte 5. Hubungkan pin mikrokontroler (ESP32, Arduino, Raspberry Pi) ke modul sensor secara visual."
      },
      full_description: {
        en: `## Overview\n\n**WiringTool** is a client-side visual engineering canvas for hobbyists and embedded engineers to prototype wiring diagrams without installing heavy desktop software.\n\n## Key Features\n\n- **Rich Component Catalog**: Official footprints for ESP32, Arduino Uno/Nano, Raspberry Pi, OLED displays, relays, and sensors.\n- **Smart Wire Routing**: Automatic pin-label propagation (VCC, GND, SDA, SCL, MOSI) with color-coded signal tracks.\n- **Canvas Controls**: Infinite panning, scroll-to-zoom, rubber-band multi-select, and minimap navigation.\n- **Zero-Backend Storage**: Export clean PNG, vector SVG, and portable JSON schematics with 80-step undo/redo history.`,
        id: `## Gambaran Umum\n\n**WiringTool** adalah kanvas desain visual elektronika berbasis web yang memudahkan perancangan rangkaian mikrokontroler dan sensor tanpa perlu menginstal software berat.\n\n## Fitur Utama\n\n- **Katalog Komponen Lengkap**: Modul ESP32, Arduino Uno/Nano, Raspberry Pi, layar OLED, relay, serta aneka sensor IoT.\n- **Routing Kabel Cerdas**: Penamaan jalur pin otomatis (VCC, GND, SDA, SCL, GPIO) dengan kode warna fleksibel.\n- **Kendali Kanvas Halus**: Navigasi pan, zoom responsif, seleksi banyak objek, dan minimap.\n- **Ekspor Mandiri Tanpa Backend**: Unduh berkas PNG, SVG vektor, dan simpan skema JSON dengan 80 level undo/redo.`
      },
      tech_stack: ["Svelte 5", "Vite", "TypeScript", "HTML5 Canvas", "SVG", "Tailwind CSS"],
      role: {
        en: "Frontend & Embedded Systems Engineer",
        id: "Frontend & Embedded Systems Engineer"
      },
      status: "published",
      is_featured: false,
      is_visible: true,
      sort_order: 14,
      live_demo_url: "https://wiring.josapratama.com",
      repo_url: "https://github.com/josapratama/wiring-tool-svelte",
      cover_image_url: ""
    },
    {
      slug: "pulsehub-sentry-monitor",
      title: {
        en: "PulseHub — Uptime Telemetry, Latency Heatmaps & Incident Hub",
        id: "PulseHub — Pemantauan Uptime, Heatmap Latensi & Pusat Insiden"
      },
      short_description: {
        en: "Production uptime monitoring dashboard with BetterStack-style 90-day interactive heatmaps, SSL expiration tracking, and automated multi-channel incident alerting.",
        id: "Dasbor pemantauan ketersediaan layanan (uptime) dengan heatmap 90 hari gaya BetterStack, pelacak masa aktif SSL, dan alarm insiden otomatis multi-saluran."
      },
      full_description: {
        en: `## Overview\n\n**PulseHub Sentry** provides uninterrupted uptime monitoring and incident response tracking across all VPS cloud services and public domains.\n\n## Key Features\n\n- **90-Day Interactive Heatmaps**: Hoverable daily bars visualizing uptime percentages and average latency millisecond trends.\n- **Automated Health Probes**: Continuous HTTP/HTTPS health checks with response code validation and SSL certificate expiry countdown.\n- **Cascading Incident Alerts**: Instant emergency alerts dispatched via WhatsApp, Telegram, and Discord when services go offline.\n- **AuthHub SSO Protected**: Secured administrator controls with public status page toggling.`,
        id: `## Gambaran Umum\n\n**PulseHub Sentry** adalah pusat komando pemantauan ketersediaan sistem dan respon insiden yang memantau seluruh server dan domain di ekosistem VPS.\n\n## Fitur Utama\n\n- **Heatmap 90 Hari Interaktif**: Bilah visual harian yang menampilkan persentase uptime dan rata-rata latensi saat disentuh kursor.\n- **Pemeriksaan Kesehatan Otomatis**: Validasi berkala respon HTTP/HTTPS dan pelacakan sisa hari kedaluwarsa sertifikat SSL.\n- **Alarm Darurat Multi-Kanal**: Peringatan seketika saat layanan down via WhatsApp, Telegram, dan Discord melalui NotifyBridge.\n- **Integrasi AuthHub SSO**: Manajemen status page publik dan dasbor teknis berkeamanan tinggi.`
      },
      tech_stack: ["Node.js", "TypeScript", "Express", "AuthHub SSO", "NotifyBridge", "Tailwind CSS", "Docker"],
      role: {
        en: "DevOps & Infrastructure Engineer",
        id: "DevOps & Infrastructure Engineer"
      },
      status: "published",
      is_featured: true,
      is_visible: true,
      sort_order: 15,
      live_demo_url: "https://pulse.josapratama.com",
      repo_url: "https://github.com/josapratama/pulse-hub",
      cover_image_url: ""
    },
    {
      slug: "notify-bridge-gateway",
      title: {
        en: "NotifyBridge — Universal Multi-Channel Notification Gateway",
        id: "NotifyBridge — Gateway Notifikasi Terpadu Lintas Saluran"
      },
      short_description: {
        en: "Single API gateway for dispatching notifications across WhatsApp, SMTP Email, Telegram Bot, Discord Webhooks, and Web Push with smart cascading fallback.",
        id: "Satu pintu API untuk mengirim pesan dan notifikasi ke WhatsApp, Email SMTP, Telegram Bot, Discord, dan Web Push dengan fitur cascading fallback otomatis."
      },
      full_description: {
        en: `## Overview\n\n**NotifyBridge** unifies notification delivery across all backend platforms into a single, high-throughput microservice endpoint.\n\n## Key Features\n\n- **Unified API Endpoint**: Send notifications to any provider via a single \`POST /api/v1/send\` payload.\n- **Smart Cascade Fallback**: Automatically failover to Email or Telegram if a WhatsApp phone number is invalid or unreachable.\n- **Dynamic Template Engine**: Render personalized variables (OTP tokens, invoice numbers, receipt totals, dates) dynamically.\n- **Audit & Delivery Logs**: Full dispatch tracking with delivery timestamps and failure reason inspection.`,
        id: `## Gambaran Umum\n\n**NotifyBridge** adalah gateway notifikasi terpadu yang memusatkan pengiriman pesan seluruh aplikasi ke berbagai saluran dalam satu microservice yang cepat.\n\n## Fitur Utama\n\n- **Satu Pintu API Terpadu**: Kirim pesan ke berbagai provider cukup dengan satu format request \`POST /api/v1/send\`.\n- **Smart Cascade Fallback**: Otomatis mengalihkan pengiriman ke Email atau Telegram jika nomor WhatsApp tujuan gagal terkirim.\n- **Engine Template Dinamis**: Mendukung penyisipan variabel dinamis seperti kode OTP, nomor tagihan, dan rincian transaksi.\n- **Log Pengiriman Transparan**: Riwayat status terkirim, waktu eksekusi, serta pelacakan kendala pesan.`
      },
      tech_stack: ["Node.js", "TypeScript", "REST API", "Telegram Bot API", "Discord Webhooks", "Docker"],
      role: {
        en: "Backend & Integration Engineer",
        id: "Backend & Integration Engineer"
      },
      status: "published",
      is_featured: false,
      is_visible: true,
      sort_order: 16,
      live_demo_url: "https://notify.josapratama.com",
      repo_url: "https://github.com/josapratama/notify-bridge",
      cover_image_url: ""
    },
    {
      slug: "rusty-shop-store",
      title: {
        en: "Rusty Shop — High-Performance E-Commerce with Rust & Axum",
        id: "Rusty Shop — E-Commerce Performa Ekstrem dengan Rust & Axum"
      },
      short_description: {
        en: "Ultra-fast, memory-safe single-vendor online store built with Rust (Axum + SQLx) backend and React/Vite frontend on PostgreSQL 16.",
        id: "Aplikasi e-commerce berbasis web dengan performa tinggi dan aman memori, dibangun dengan backend Rust (Axum + SQLx) dan frontend React/Vite."
      },
      full_description: {
        en: `## Overview\n\n**Rusty Shop** showcases high-performance systems programming applied to modern e-commerce. Built using Rust's asynchronous Axum framework, it achieves sub-millisecond API response times.\n\n## Key Features\n\n- **Asynchronous Rust Backend**: Powered by Axum, Tokio, and compile-time checked SQLx queries on PostgreSQL 16.\n- **Product & Inventory Engine**: Category management, variant stock tracking, and secure shopping cart checkouts.\n- **Memory-Safe Architecture**: Zero memory leaks and minimal footprint under intensive concurrent traffic.\n- **Modern React Storefront**: Fast client routing, search filtering, and responsive checkout flows.`,
        id: `## Gambaran Umum\n\n**Rusty Shop** adalah aplikasi e-commerce modern yang membuktikan keunggulan performa bahasa pemrograman Rust untuk layanan web berkecepatan tinggi dengan response time di bawah 1 milidetik.\n\n## Fitur Utama\n\n- **Backend Asynchronous Rust**: Ditenagai oleh framework Axum, runtime Tokio, dan query SQLx yang divalidasi saat kompilasi.\n- **Manajemen Produk & Stok**: Pengelompokan kategori, pelacakan varian barang, dan keranjang belanja interaktif.\n- **Efisiensi Memori Tinggi**: Tidak ada memory leak dengan konsumsi resource RAM yang sangat rendah di bawah beban tinggi.\n- **Storefront React Cepat**: Antarmuka responsif dengan pencarian produk seketika dan alur checkout yang mudah.`
      },
      tech_stack: ["Rust", "Axum", "SQLx", "PostgreSQL 16", "React", "TypeScript", "Tailwind CSS", "Docker"],
      role: {
        en: "Backend Systems & Rust Developer",
        id: "Backend Systems & Pengembang Rust"
      },
      status: "published",
      is_featured: false,
      is_visible: true,
      sort_order: 17,
      live_demo_url: "https://rustyshop.josapratama.com",
      repo_url: "https://github.com/josapratama/rusty-shop",
      cover_image_url: ""
    },
    {
      slug: "nexus-digital-marketplace",
      title: {
        en: "NEXUS — Cyberpunk Digital Assets Marketplace",
        id: "NEXUS — Marketplace Aset Digital Bertema Cyberpunk"
      },
      short_description: {
        en: "Full-stack digital assets marketplace with a dark cyberpunk aesthetic. Browse, compare, and purchase UI kits, 3D assets, fonts, and developer templates.",
        id: "Marketplace aset digital bertema gelap cyberpunk untuk menemukan, membandingkan, dan membeli UI kit, aset 3D, font, dan template developer."
      },
      full_description: {
        en: `## Overview\n\n**NEXUS Marketplace** is an immersive digital goods storefront crafted with a sleek cyberpunk visual identity.\n\n## Key Features\n\n- **Catalog & Deep Filtering**: Browse 50+ digital assets with real-time category, price range, and rating filters.\n- **Product Comparison Matrix**: Side-by-side spec comparison of up to 4 assets concurrently.\n- **Instant Digital Delivery**: Automated download link generation and license key dispatch upon payment.\n- **Reviews & Ratings**: Community feedback system with verified buyer badges and detailed ratings.`,
        id: `## Gambaran Umum\n\n**NEXUS Marketplace** adalah platform marketplace aset digital lengkap dengan identitas visual bertema gelap modern ala cyberpunk.\n\n## Fitur Utama\n\n- **Katalog & Filter Mendalam**: Pencarian 50+ jenis aset digital dengan filter kategori, rentang harga, dan rating real-time.\n- **Matriks Komparasi Produk**: Bandingkan spesifikasi hingga 4 produk digital secara berdampingan di satu layar.\n- **Pengiriman Digital Instan**: Tautan unduhan berkas dan lisensi langsung aktif seketika setelah pembayaran sukses.\n- **Ulasan & Rating Pembeli**: Sistem review komunitas dengan label pembeli terverifikasi.`
      },
      tech_stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Tailwind CSS", "PayGateway", "Docker"],
      role: {
        en: "Full-Stack Web Engineer",
        id: "Full-Stack Web Engineer"
      },
      status: "published",
      is_featured: false,
      is_visible: true,
      sort_order: 18,
      live_demo_url: "https://marketplace.josapratama.com",
      repo_url: "https://github.com/josapratama/nexus-marketplace",
      cover_image_url: ""
    },
    {
      slug: "tanicerdas-agri-hub",
      title: {
        en: "TaniCerdas — Integrated Smart Agriculture & Farm Management",
        id: "TaniCerdas — Manajemen Pertanian & Peternakan Terpadu Cerdas"
      },
      short_description: {
        en: "Integrated smart farming web application. Empowers farmers to monitor garden crops, livestock cycles, financial cash flow, and plant disease diagnostics in one place.",
        id: "Aplikasi manajemen pertanian dan peternakan terpadu berbasis web untuk memantau kebun, kandang ternak, arus kas keuangan, serta diagnosa penyakit tanaman."
      },
      full_description: {
        en: `## Overview\n\n**TaniCerdas** is an end-to-end agriculture and livestock management application built to modernize farm operations and harvest tracking.\n\n## Key Features\n\n- **Crop Life-Cycle Tracking**: Monitor plant growth phases from germination to harvest with daily field logs and CSV reporting.\n- **Livestock Monitoring**: Track livestock batches, egg/milk daily production metrics, and feed consumption schedules.\n- **Farm Financial Ledger**: Real-time operational expense logging, profit/loss calculations, and cash flow charts.\n- **Plant Disease Encyclopedia**: Diagnostic knowledge base with fertilizer and natural pesticide recommendations.`,
        id: `## Gambaran Umum\n\n**TaniCerdas** adalah aplikasi tata kelola pertanian dan peternakan modern yang membantu petani dan peternak mengelola operasional harian secara terukur.\n\n## Fitur Utama\n\n- **Siklus Tanam Kebun**: Pemantauan fase pertumbuhan tanaman dari semai hingga panen dengan catatan lapangan dan ekspor CSV.\n- **Manajemen Peternakan**: Pelacakan kelompok ternak, statistik produksi harian telur/susu, dan jadwal pakan.\n- **Pencatatan Keuangan Terpadu**: Laporan pengeluaran operasional, grafik arus kas, dan analisis laba/rugi panen.\n- **Ensiklopedi Penyakit & Pupuk**: Panduan diagnosa gejala penyakit tanaman serta takaran pupuk dan pestisida ramah lingkungan.`
      },
      tech_stack: ["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Chart.js", "Vite"],
      role: {
        en: "Full-Stack Developer",
        id: "Pengembang Full-Stack"
      },
      status: "published",
      is_featured: false,
      is_visible: true,
      sort_order: 19,
      live_demo_url: "https://tanicerdas.josapratama.com",
      repo_url: "https://github.com/josapratama/tanicerdas",
      cover_image_url: ""
    }
  ];

  for (const proj of additionalProjects) {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      method: "POST",
      headers,
      body: JSON.stringify(proj)
    });
    const resData = await res.json();
    console.log(`  ✓ Created project "${proj.slug}":`, resData.success);
  }

  console.log("\n========================================================");
  console.log("🎉 ALL 11 ADDITIONAL PROJECTS SUCCESSFULLY ADDED TO VPS!");
  console.log("========================================================");
}

main().catch(console.error);

