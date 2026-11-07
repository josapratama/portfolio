// Built-in fetch used
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
  console.log("✓ Logged in as Admin. Access token acquired.");
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const apiPut = async (endpoint, data) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data)
    });
    return res.json();
  };

  const apiPost = async (endpoint, data) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    return res.json();
  };

  const apiDelete = async (endpoint) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
      headers
    });
    if (res.status === 204) return { success: true };
    const text = await res.text();
    return text ? JSON.parse(text) : { success: true };
  };

  // 1. UPDATE SITE SETTINGS
  console.log("\n1. Updating Site Settings...");
  const siteSettings = {
    site_name: "Josa Pratama — Software Engineer & Cloud Architect",
    brand_name: "Josa Pratama",
    full_name: "Josa Pratama",
    title: "Full-Stack Software Engineer & Cloud Architect",
    contact_email: "hello@josapratama.com",
    location: "Prabumulih, Indonesia",
    availability_status: "Available for contract & remote engineering",
    is_available: true,
    footer_text: "© 2026 Josa Pratama. Built with resilience on custom VPS infrastructure.",
    cta_primary_label: "View My Work",
    cta_secondary_label: "Get In Touch",
    default_language: "en",
    default_theme: "dark"
  };
  await apiPut("/admin/settings/site", siteSettings);
  console.log("  ✓ Site Settings updated");

  // 2. UPDATE HERO CONTENT
  console.log("\n2. Updating Hero Content...");
  const heroContent = {
    headline: {
      en: "Architecting Resilient Cloud Systems & Modern Web Applications",
      id: "Merancang Sistem Cloud Tangguh & Aplikasi Web Modern"
    },
    subheadline: {
      en: "Full-Stack Software Engineer & Cloud Infrastructure Architect",
      id: "Software Engineer Full-Stack & Arsitek Infrastruktur Cloud"
    },
    short_intro: {
      en: "Specializing in high-performance Go backends, modern React & Next.js frontends, and automated Linux edge server deployments.",
      id: "Spesialis dalam backend Go berkinerja tinggi, antarmuka modern React & Next.js, dan otomatisasi server edge Linux."
    },
    profile_image_url: "https://uploadbox.josapratama.com/cdn/16362849-9ea8-4dc0-9971-657400f8508b/IMG-20260702-WA0002(1).jpg",
    availability_badge: {
      en: "Available for selected projects",
      id: "Tersedia untuk proyek terpilih"
    },
    show_availability_badge: true
  };
  await apiPut("/admin/hero", heroContent);
  console.log("  ✓ Hero Content updated");

  // 3. UPDATE ABOUT CONTENT
  console.log("\n3. Updating About Content...");
  const aboutContent = {
    short_bio: {
      en: "Passionate Full-Stack Software Engineer & Cloud Architect with hands-on experience building distributed systems, custom VPS infrastructure, and modern web applications.",
      id: "Software Engineer Full-Stack & Arsitek Cloud yang berfokus membangun sistem terdistribusi, infrastruktur VPS kustom, dan aplikasi web modern berkinerja tinggi."
    },
    full_bio: {
      en: `## About Me

Hello! I'm **Josa Pratama**, a Full-Stack Software Engineer and Cloud Architect based in **Prabumulih, South Sumatra, Indonesia**.

I have a deep passion for designing resilient backend architectures, developing responsive and intuitive web user experiences, and managing high-availability cloud & edge server infrastructures.

### What I Do

- **Cloud & Edge Infrastructure**: Custom Linux VPS orchestration, Docker container management, reverse proxies (Caddy, Nginx), Cloudflare Tunnels, and automated SSL/TLS workflows.
- **Backend Architecture**: Scalable REST APIs and microservices in **Go (Golang)** and **Node.js / TypeScript**, optimized PostgreSQL databases, Redis caching, and WebSockets.
- **Modern Frontend**: Interactive and accessible web applications using **React 19**, **Next.js**, **TypeScript**, and **Tailwind CSS**.
- **Security & Identity**: Single Sign-On (SSO), OAuth2 / OpenID Connect, and hardware-backed authentication (**FIDO2 / WebAuthn YubiKeys**).

When I'm not coding, I enjoy experimenting with embedded systems (ESP32, Raspberry Pi) and exploring new cloud engineering tools.`,
      id: `## Tentang Saya

Halo! Saya **Josa Pratama**, seorang Full-Stack Software Engineer dan Cloud Architect yang berdomisili di **Prabumulih, Sumatera Selatan, Indonesia**.

Saya memiliki dedikasi dan minat mendalam dalam merancang arsitektur backend yang tangguh, mengembangkan pengalaman antarmuka web yang modern dan responsif, serta mengelola infrastruktur server cloud & edge berkinerja tinggi.

### Keahlian & Fokus Utama

- **Infrastruktur Cloud & Edge**: Manajemen cluster Linux VPS, orkestrasi kontainer Docker, reverse proxy (Caddy, Nginx), Cloudflare Tunnels, serta otomatisasi sertifikat SSL/TLS.
- **Arsitektur Backend**: Membangun REST API dan microservices berkecepatan tinggi dengan **Go (Golang)** dan **Node.js / TypeScript**, optimasi database PostgreSQL, Redis caching, dan WebSockets.
- **Frontend Modern**: Aplikasi web interaktif dan terstruktur menggunakan **React 19**, **Next.js**, **TypeScript**, dan **Tailwind CSS**.
- **Keamanan & Identitas**: Single Sign-On (SSO), OAuth2 / OIDC, serta autentikasi hardware (**FIDO2 / WebAuthn YubiKey**).

Di luar koding aplikasi web, saya senang mengeksplorasi sistem embedded (ESP32, Raspberry Pi) dan inovasi teknologi otomasi terbaru.`
    },
    profile_image_url: "https://uploadbox.josapratama.com/cdn/16362849-9ea8-4dc0-9971-657400f8508b/IMG-20260702-WA0002(1).jpg",
    years_of_experience: 5,
    highlights: [
      "Custom Linux VPS & Edge Docker Orchestrator Architect",
      "Built Production Ecosystem (MiniHost, UploadBox, Polyglot Hub, AuthHub, WA Bridge)",
      "High-Performance Go & React/TypeScript Specialist",
      "Enterprise Identity & FIDO2 YubiKey Security"
    ]
  };
  await apiPut("/admin/about", aboutContent);
  console.log("  ✓ About Content updated");

  // 4. ADD REMAINING REAL DEPLOYED PROJECTS
  console.log("\n4. Adding Deployed Projects...");
  const newProjects = [
    {
      slug: "authhub-sso-gateway",
      title: {
        en: "AuthHub — Centralized Single Sign-On & FIDO2 Identity Gateway",
        id: "AuthHub — Single Sign-On Terpusat & FIDO2 Identity Gateway"
      },
      short_description: {
        en: "Enterprise identity provider and OAuth2/OIDC gateway powering single sign-on across all private apps, with WebAuthn/FIDO2 hardware security keys (YubiKey).",
        id: "Penyedia identitas enterprise dan gateway OAuth2/OIDC untuk single sign-on di seluruh aplikasi pribadi dengan kunci hardware WebAuthn/FIDO2 (YubiKey)."
      },
      full_description: {
        en: `## Overview\n\n**AuthHub** is the central authentication authority and Single Sign-On (SSO) gateway protecting all services across the infrastructure.\n\n## Key Capabilities\n\n- **Hardware Token Auth**: FIDO2/WebAuthn passkeys and YubiKey NFC hardware token support.\n- **OAuth2 & OIDC Provider**: Standardized authorization code grant workflows for third-party and internal app integrations.\n- **Granular RBAC**: Superadmin, Admin, Editor, and Viewer permission levels across multiple organizational scopes.\n- **Audit & Session Monitoring**: Centralized revocation of active device sessions and login history tracking.`,
        id: `## Gambaran Umum\n\n**AuthHub** adalah otoritas autentikasi terpusat dan gateway Single Sign-On (SSO) yang mengamankan seluruh layanan di ekosistem VPS.\n\n## Fitur Utama\n\n- **Autentikasi Kunci Hardware**: Mendukung WebAuthn passkey dan kunci fisik YubiKey FIDO2.\n- **Penyedia OAuth2 & OIDC**: Alur authorization code terstandar untuk integrasi aplikasi internal dan eksternal.\n- **RBAC Berjenjang**: Hak akses Superadmin, Admin, Editor, dan Viewer yang terisolasi.\n- **Audit & Pengawasan Sesi**: Pemutusan sesi login aktif lintas perangkat dan pencatatan riwayat masuk secara terpusat.`
      },
      tech_stack: ["Node.js", "TypeScript", "OAuth2", "WebAuthn", "FIDO2", "JWT", "Redis", "PostgreSQL"],
      role: {
        en: "Security & Backend Engineer",
        id: "Security & Backend Engineer"
      },
      status: "published",
      is_featured: true,
      is_visible: true,
      sort_order: 4,
      live_demo_url: "https://auth.josapratama.com",
      repo_url: "https://github.com/josapratama/auth-hub",
      cover_image_url: ""
    },
    {
      slug: "wabridge-whatsapp-gateway",
      title: {
        en: "WA Bridge — WhatsApp Multi-Device Gateway & Automation",
        id: "WA Bridge — Gateway WhatsApp Multi-Perangkat & Otomasi"
      },
      short_description: {
        en: "Production WhatsApp API engine supporting QR/Pairing code sessions, smart keyword auto-reply bots, bulk broadcast campaigns, and webhook dispatchers.",
        id: "Engine API WhatsApp skala produksi yang mendukung sesi QR/pairing code, bot balas otomatis kata kunci cerdas, jadwal pesan siaran massal, dan webhook dispatcher."
      },
      full_description: {
        en: `## Overview\n\n**WA Bridge** is a multi-device WhatsApp gateway engine designed for reliable messaging automation, notifications, and customer interaction.\n\n## Key Capabilities\n\n- **Multi-Device Engine**: Persistent pairing with real-time socket connection and automatic reconnection recovery.\n- **Automated Keyword Bots**: Trigger matching rules with exact and fuzzy keyword reply templates.\n- **Broadcast Campaigns**: Scheduled bulk message delivery with CSV contact import and delivery rate tracking.\n- **Webhook Dispatcher**: Outgoing HTTP events delivered securely to backend listeners on every message receipt.`,
        id: `## Gambaran Umum\n\n**WA Bridge** adalah engine gateway WhatsApp multi-perangkat yang dirancang untuk otomasi perpesanan, notifikasi sistem, dan interaksi pengguna secara andal.\n\n## Fitur Utama\n\n- **Koneksi Multi-Perangkat**: Sesi persisten dengan pemulihan koneksi otomatis saat terjadi gangguan jaringan.\n- **Bot Kata Kunci Otomatis**: Logika balasan cerdas berdasarkan pemicu kata kunci persis maupun parsial.\n- **Kampanye Siaran Massal**: Pengiriman pesan terjadwal dengan impor kontak CSV dan pemantauan tingkat keberhasilan.\n- **Webhook Dispatcher**: Pengiriman event HTTP aman secara instan setiap ada pesan masuk.`
      },
      tech_stack: ["Node.js", "TypeScript", "Baileys", "WebSockets", "Redis", "REST API", "Docker"],
      role: {
        en: "Backend & API Engineer",
        id: "Backend & API Engineer"
      },
      status: "published",
      is_featured: true,
      is_visible: true,
      sort_order: 5,
      live_demo_url: "https://wabridge.josapratama.com",
      repo_url: "https://github.com/josapratama/wabridge",
      cover_image_url: ""
    },
    {
      slug: "nexus-chat-workspace",
      title: {
        en: "Nexus Chat — Real-Time Channels & AI Assistant Workspace",
        id: "Nexus Chat — Ruang Kolaborasi Real-Time & AI Assistant"
      },
      short_description: {
        en: "Modern collaborative communication suite with instant channels, direct messages, vector knowledge-base RAG search, and flexible LLM integrations.",
        id: "Aplikasi komunikasi kolaboratif modern dengan kanal instan, pesan langsung, pencarian dokumen RAG vector database, dan integrasi model AI."
      },
      full_description: {
        en: `## Overview\n\n**Nexus Chat** is a real-time messaging suite combining human team collaboration with AI capabilities.\n\n## Key Capabilities\n\n- **Real-Time Channels & DMs**: Low-latency message synchronization over WebSockets with media previews.\n- **Vector Knowledge Base**: Upload PDF and Markdown files to query and summarize documents using RAG.\n- **AI Model Agnostic**: Switch seamlessly between local and cloud LLM providers with temperature and token controls.\n- **System Prompt Library**: Save and execute custom AI personas and reusable prompts.`,
        id: `## Gambaran Umum\n\n**Nexus Chat** adalah platform kolaborasi perpesanan instan yang menggabungkan komunikasi tim dengan kecerdasan buatan terpadu.\n\n## Fitur Utama\n\n- **Kanal & Pesan Langsung Real-Time**: Sinkronisasi pesan latensi rendah melalui WebSockets beserta pratinjau lampiran media.\n- **Pusat Pengetahuan Vektor (RAG)**: Unggah dokumen PDF dan Markdown untuk diringkas dan ditanyakan secara interaktif.\n- **Dukungan Beragam Model AI**: Pilihan fleksibel berbagai model LLM dengan kendali parameter kreativitas dan batas token.\n- **Pustaka Prompt Sistem**: Koleksi template prompt sistem yang dapat disimpan dan digunakan kembali.`
      },
      tech_stack: ["React", "Next.js", "TypeScript", "WebSockets", "Tailwind CSS", "Vector DB", "Docker"],
      role: {
        en: "Full-Stack Engineer",
        id: "Full-Stack Engineer"
      },
      status: "published",
      is_featured: false,
      is_visible: true,
      sort_order: 6,
      live_demo_url: "https://chat.josapratama.com",
      repo_url: "https://github.com/josapratama/nexus-chat",
      cover_image_url: ""
    },
    {
      slug: "arsip-digital-system",
      title: {
        en: "Arsip Digital — Institutional Document & Mail Management",
        id: "Arsip Digital — Tata Kelola Surat & Arsip Elektronik"
      },
      short_description: {
        en: "Digital archival management system for tracking incoming/outgoing letters, automated disposition workflows, and secure institutional record retention.",
        id: "Sistem manajemen kearsipan digital untuk pencatatan surat masuk/keluar, alur kerja disposisi berjenjang, dan penyimpanan berkas instansi yang aman."
      },
      full_description: {
        en: `## Overview\n\n**Arsip Digital** is an institutional archival and records management application created to digitize government and enterprise administrative communications.\n\n## Key Capabilities\n\n- **Hierarchical Dispositions**: Track document routing from top executives down to operational departments.\n- **Mail Indexing**: Comprehensive search and categorization of incoming and outgoing official correspondence.\n- **Document Retention Schedules**: Automatic retention policies with archival classification standards.`,
        id: `## Gambaran Umum\n\n**Arsip Digital** adalah platform tata kelola kearsipan dan korespondensi kedinasan yang dirancang untuk mendigitalkan alur administrasi instansi.\n\n## Fitur Utama\n\n- **Disposisi Berjenjang**: Pelacakan instruksi pimpinan hingga unit kerja pelaksana secara transparan.\n- **Agenda Surat Masuk & Keluar**: Pencatatan nomor agenda dan pengelompokan jenis naskah dinas.\n- **Retensi Arsip Terstruktur**: Standarisasi masa simpan dokumen sesuai pedoman kearsipan resmi.`
      },
      tech_stack: ["PHP", "Laravel", "PostgreSQL", "Livewire", "Tailwind CSS", "Docker"],
      role: {
        en: "Full-Stack Developer",
        id: "Pengembang Full-Stack"
      },
      status: "published",
      is_featured: false,
      is_visible: true,
      sort_order: 7,
      live_demo_url: "https://arsip.josapratama.com",
      repo_url: "https://github.com/josapratama/arsip_digital",
      cover_image_url: ""
    },
    {
      slug: "irma-iryani-showcase",
      title: {
        en: "Irma Iryani — Academic & Professional Portfolio Showcase",
        id: "Irma Iryani — Platform Portofolio Akademik & Profesional"
      },
      short_description: {
        en: "Modern academic showcase with interactive PDF viewers, bilingual localization via Polyglot Hub, and tailored dynamic presentation.",
        id: "Showcase portofolio akademik modern dengan pratinjau PDF interaktif, lokalisasi multibahasa via Polyglot Hub, dan tata letak elegan responsif."
      },
      full_description: {
        en: `## Overview\n\n**Irma Iryani Web** is a specialized academic and creative portfolio built with Next.js 16 and Tailwind CSS.\n\n## Key Capabilities\n\n- **Polyglot Hub Integration**: Seamless runtime localization across Indonesian, English, and Japanese.\n- **Embedded PDF Certificate Reader**: High-performance canvas-rendered certificate viewer.\n- **Performance Optimized**: Sub-second initial load with responsive mobile design.`,
        id: `## Gambaran Umum\n\n**Irma Iryani Web** adalah platform portofolio profil akademik dan prestasi yang dibangun menggunakan Next.js 16 dan Tailwind CSS.\n\n## Fitur Utama\n\n- **Integrasi Polyglot Hub**: Dukungan lokalisasi 3 bahasa (Indonesia, Inggris, Jepang) tanpa lag.\n- **Penampil Sertifikat PDF Interaktif**: Pratinjau berkas dokumen resolusi tinggi langsung di halaman web.\n- **Performa Responsif**: Kecepatan muat halaman instan yang dioptimalkan untuk perangkat seluler.`
      },
      tech_stack: ["Next.js 16", "React 19", "Tailwind CSS", "Framer Motion", "Polyglot Hub", "Vercel"],
      role: {
        en: "Lead Frontend Engineer",
        id: "Lead Frontend Engineer"
      },
      status: "published",
      is_featured: false,
      is_visible: true,
      sort_order: 8,
      live_demo_url: "https://irma-iryani.vercel.app",
      repo_url: "https://github.com/josapratama/irma-iryani",
      cover_image_url: ""
    }
  ];

  for (const proj of newProjects) {
    const res = await apiPost("/admin/projects", proj);
    console.log(`  ✓ Created project "${proj.slug}":`, res.success);
  }

  console.log("\n========================================================");
  console.log("🎉 SUCCESS: ALL REAL VPS DATA SYNCHRONIZED!");
  console.log("========================================================");
}

main().catch(console.error);
