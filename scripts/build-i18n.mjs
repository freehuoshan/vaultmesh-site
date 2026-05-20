#!/usr/bin/env node
// Generates <locale>/index.html for the 12 secondary languages.
// English (index.html) and Simplified Chinese (zh/index.html) are hand-maintained
// and intentionally NOT overwritten here.
//
// Run from repo root:   node scripts/build-i18n.mjs
//
// Adds/updates: zh-Hant, ja, de, es, fr, pt-BR, ko, it, nl, hi, id, vi

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Locale metadata: [pathSegment, htmlLang, nativeName]
const LOCALES = [
  ['zh-Hant', 'zh-Hant', '繁體中文'],
  ['ja',      'ja',      '日本語'],
  ['de',      'de',      'Deutsch'],
  ['es',      'es',      'Español'],
  ['fr',      'fr',      'Français'],
  ['pt-BR',   'pt-BR',   'Português (Brasil)'],
  ['ko',      'ko',      '한국어'],
  ['it',      'it',      'Italiano'],
  ['nl',      'nl',      'Nederlands'],
  ['hi',      'hi',      'हिन्दी'],
  ['id',      'id',      'Bahasa Indonesia'],
  ['vi',      'vi',      'Tiếng Việt']
];

// Full list including EN + zh for the dropdown
const ALL_LOCALES = [
  ['',        'en',      'English'],
  ['zh',      'zh-CN',   '简体中文'],
  ...LOCALES
];

// ---------------------------------------------------------------------------
// Translations. Each key is one message. Each value is an object keyed by
// path segment (matching LOCALES) mapping to the translated text.
// ---------------------------------------------------------------------------
const T = {
  // <head>
  title: {
    'zh-Hant': 'VaultMesh — 跨裝置密碼管理器',
    'ja':      'VaultMesh — クロスデバイス対応のパスワード管理',
    'de':      'VaultMesh — Geräteübergreifender Passwort-Manager',
    'es':      'VaultMesh — Gestor de contraseñas multidispositivo',
    'fr':      'VaultMesh — Gestionnaire de mots de passe multi-appareils',
    'pt-BR':   'VaultMesh — Gerenciador de senhas multidispositivo',
    'ko':      'VaultMesh — 멀티 디바이스 비밀번호 관리자',
    'it':      'VaultMesh — Password manager multi-dispositivo',
    'nl':      'VaultMesh — Wachtwoordmanager voor meerdere apparaten',
    'hi':      'VaultMesh — मल्टी-डिवाइस पासवर्ड मैनेजर',
    'id':      'VaultMesh — Pengelola kata sandi lintas perangkat',
    'vi':      'VaultMesh — Trình quản lý mật khẩu đa thiết bị'
  },
  meta: {
    'zh-Hant': 'VaultMesh 是一款本地優先的跨裝置密碼管理器。手機與桌面之間直接端對端加密同步，無需中心伺服器。',
    'ja':      'VaultMesh はローカルファーストのクロスデバイス対応パスワードマネージャー。モバイルとデスクトップ間で中央サーバーを介さずエンドツーエンド暗号化で直接同期します。',
    'de':      'VaultMesh ist ein lokal-first Passwort-Manager für mehrere Geräte. Mobil und Desktop synchronisieren direkt Ende-zu-Ende verschlüsselt — ohne zentralen Server.',
    'es':      'VaultMesh es un gestor de contraseñas multidispositivo y local-first. Móvil y escritorio sincronizan directamente con cifrado de extremo a extremo, sin servidor central.',
    'fr':      'VaultMesh est un gestionnaire de mots de passe local-first et multi-appareils. Mobile et bureau synchronisent directement, chiffrement de bout en bout, sans serveur central.',
    'pt-BR':   'O VaultMesh é um gerenciador de senhas multidispositivo e local-first. Móvel e desktop sincronizam diretamente com criptografia ponta a ponta, sem servidor central.',
    'ko':      'VaultMesh는 로컬 우선의 멀티 디바이스 비밀번호 관리자입니다. 모바일과 데스크톱이 중앙 서버 없이 종단 간 암호화로 직접 동기화됩니다.',
    'it':      'VaultMesh è un password manager multi-dispositivo e local-first. Mobile e desktop sincronizzano direttamente con cifratura end-to-end, senza server centrale.',
    'nl':      'VaultMesh is een local-first wachtwoordmanager voor meerdere apparaten. Mobiel en desktop synchroniseren direct met end-to-end-encryptie, zonder centrale server.',
    'hi':      'VaultMesh एक लोकल-फर्स्ट, मल्टी-डिवाइस पासवर्ड मैनेजर है। मोबाइल और डेस्कटॉप किसी केंद्रीय सर्वर के बिना सीधे एंड-टू-एंड एन्क्रिप्शन के साथ सिंक होते हैं।',
    'id':      'VaultMesh adalah pengelola kata sandi lintas perangkat dengan prinsip local-first. Ponsel dan desktop tersinkron langsung dengan enkripsi ujung-ke-ujung, tanpa server pusat.',
    'vi':      'VaultMesh là trình quản lý mật khẩu đa thiết bị theo hướng local-first. Di động và máy tính đồng bộ trực tiếp, mã hóa đầu cuối, không cần máy chủ trung tâm.'
  },
  // Nav
  nav_features: {
    'zh-Hant': '功能特色', 'ja': '機能', 'de': 'Funktionen', 'es': 'Funciones',
    'fr': 'Fonctionnalités', 'pt-BR': 'Recursos', 'ko': '기능', 'it': 'Funzionalità',
    'nl': 'Functies', 'hi': 'विशेषताएँ', 'id': 'Fitur', 'vi': 'Tính năng'
  },
  nav_how: {
    'zh-Hant': '運作方式', 'ja': '仕組み', 'de': 'So funktioniert\'s', 'es': 'Cómo funciona',
    'fr': 'Comment ça marche', 'pt-BR': 'Como funciona', 'ko': '작동 방식', 'it': 'Come funziona',
    'nl': 'Hoe het werkt', 'hi': 'कैसे काम करता है', 'id': 'Cara kerja', 'vi': 'Cách hoạt động'
  },
  nav_download: {
    'zh-Hant': '下載', 'ja': 'ダウンロード', 'de': 'Download', 'es': 'Descargar',
    'fr': 'Téléchargement', 'pt-BR': 'Download', 'ko': '다운로드', 'it': 'Scarica',
    'nl': 'Download', 'hi': 'डाउनलोड', 'id': 'Unduh', 'vi': 'Tải xuống'
  },
  nav_relay: {
    'zh-Hant': 'Relay 指南', 'ja': 'Relay ガイド', 'de': 'Relay-Guide', 'es': 'Guía de Relay',
    'fr': 'Guide Relay', 'pt-BR': 'Guia do Relay', 'ko': 'Relay 가이드', 'it': 'Guida al Relay',
    'nl': 'Relay-gids', 'hi': 'Relay गाइड', 'id': 'Panduan Relay', 'vi': 'Hướng dẫn Relay'
  },
  nav_cta: {
    'zh-Hant': '取得 VaultMesh', 'ja': 'VaultMesh を入手', 'de': 'VaultMesh holen',
    'es': 'Obtener VaultMesh', 'fr': 'Obtenir VaultMesh', 'pt-BR': 'Obter VaultMesh',
    'ko': 'VaultMesh 받기', 'it': 'Scarica VaultMesh', 'nl': 'VaultMesh halen',
    'hi': 'VaultMesh प्राप्त करें', 'id': 'Dapatkan VaultMesh', 'vi': 'Tải VaultMesh'
  },
  // Hero
  hero_badge: {
    'zh-Hant': '本地優先 · 端對端加密 · 多裝置',
    'ja':      'ローカルファースト · エンドツーエンド暗号化 · マルチデバイス',
    'de':      'Lokal-first · Ende-zu-Ende verschlüsselt · Mehrere Geräte',
    'es':      'Local-first · Cifrado de extremo a extremo · Multidispositivo',
    'fr':      'Local-first · Chiffrement de bout en bout · Multi-appareils',
    'pt-BR':   'Local-first · Criptografia ponta a ponta · Multidispositivo',
    'ko':      '로컬 우선 · 종단 간 암호화 · 멀티 디바이스',
    'it':      'Local-first · Cifratura end-to-end · Multi-dispositivo',
    'nl':      'Local-first · End-to-end versleuteld · Meerdere apparaten',
    'hi':      'लोकल-फर्स्ट · एंड-टू-एंड एन्क्रिप्टेड · मल्टी-डिवाइस',
    'id':      'Local-first · Enkripsi ujung-ke-ujung · Lintas perangkat',
    'vi':      'Local-first · Mã hóa đầu cuối · Đa thiết bị'
  },
  hero_h1_1: {
    'zh-Hant': '安全的密碼。', 'ja': '安全なパスワード。', 'de': 'Sichere Passwörter.',
    'es': 'Contraseñas seguras.', 'fr': 'Mots de passe sécurisés.', 'pt-BR': 'Senhas seguras.',
    'ko': '안전한 비밀번호.', 'it': 'Password sicure.', 'nl': 'Veilige wachtwoorden.',
    'hi': 'सुरक्षित पासवर्ड।', 'id': 'Kata sandi yang aman.', 'vi': 'Mật khẩu an toàn.'
  },
  hero_h1_em: {
    'zh-Hant': '從首次解鎖起即保持私密',
    'ja':      '初回ロック解除から非公開',
    'de':      'Privat ab dem ersten Entsperren',
    'es':      'Privadas desde el primer desbloqueo',
    'fr':      'Privées dès le premier déverrouillage',
    'pt-BR':   'Privadas desde o primeiro desbloqueio',
    'ko':      '첫 잠금 해제부터 비공개',
    'it':      'Private dal primo sblocco',
    'nl':      'Privé vanaf de eerste ontgrendeling',
    'hi':      'पहले अनलॉक से ही निजी',
    'id':      'Privat sejak buka kunci pertama',
    'vi':      'Riêng tư từ lần mở khóa đầu tiên'
  },
  hero_h1_3: {
    'zh-Hant': '直到日常同步。', 'ja': '日々の同期まで。', 'de': 'bis zur täglichen Sync.',
    'es': 'hasta la sincronización diaria.', 'fr': 'jusqu\'à la synchro quotidienne.',
    'pt-BR': 'até a sincronização diária.', 'ko': '일상의 동기화까지.',
    'it': 'fino alla sincro quotidiana.', 'nl': 'tot de dagelijkse sync.',
    'hi': 'रोज़मर्रा के सिंक तक।', 'id': 'hingga sinkronisasi sehari-hari.',
    'vi': 'đến đồng bộ hằng ngày.'
  },
  hero_desc: {
    'zh-Hant': 'VaultMesh 將你的密碼庫以加密形式保存在自己的裝置上。手機與桌面直接同步，無需中心伺服器，傳輸層也看不到任何明文。',
    'ja':      'VaultMesh はあなたの保管庫を端末上で暗号化したまま保ちます。モバイルとデスクトップは直接同期し、中継サーバーは必要なく、転送経路に平文が露出することもありません。',
    'de':      'VaultMesh hält deinen Tresor auf deinen eigenen Geräten verschlüsselt. Mobil und Desktop synchronisieren direkt – kein zentraler Hub, kein Klartext im Transport.',
    'es':      'VaultMesh mantiene tu bóveda cifrada en tus propios dispositivos. Móvil y escritorio sincronizan directamente, sin hub obligatorio y sin exponer texto en claro al transporte.',
    'fr':      'VaultMesh garde votre coffre chiffré sur vos propres appareils. Mobile et bureau se synchronisent directement, sans hub obligatoire ni texte en clair exposé au transport.',
    'pt-BR':   'O VaultMesh mantém seu cofre criptografado nos seus próprios dispositivos. Móvel e desktop sincronizam diretamente, sem hub obrigatório nem texto em claro exposto no transporte.',
    'ko':      'VaultMesh는 사용자의 기기에 보관된 보관함을 항상 암호화 상태로 유지합니다. 모바일과 데스크톱이 중앙 허브 없이 직접 동기화되며, 중계 전송에 평문이 노출되지 않습니다.',
    'it':      'VaultMesh mantiene il tuo vault cifrato sui tuoi dispositivi. Mobile e desktop si sincronizzano direttamente, senza hub obbligatorio e senza esporre testo in chiaro al trasporto.',
    'nl':      'VaultMesh houdt je kluis versleuteld op je eigen apparaten. Mobiel en desktop synchroniseren rechtstreeks, zonder verplichte hub en zonder klare tekst in het transport.',
    'hi':      'VaultMesh आपके वॉल्ट को आपके अपने डिवाइसों पर एन्क्रिप्टेड रखता है। मोबाइल और डेस्कटॉप सीधे सिंक करते हैं — किसी केंद्रीय हब की ज़रूरत नहीं, और ट्रांसपोर्ट में कोई प्लेन-टेक्स्ट उजागर नहीं होता।',
    'id':      'VaultMesh menjaga vault Anda terenkripsi di perangkat Anda sendiri. Ponsel dan desktop tersinkron langsung — tanpa hub wajib, tanpa teks polos terbuka di transportasi.',
    'vi':      'VaultMesh giữ kho mật khẩu của bạn được mã hóa trên chính các thiết bị của bạn. Di động và máy tính đồng bộ trực tiếp — không cần máy chủ trung tâm, không lộ bản rõ trên đường truyền.'
  },
  hero_primary: { /* same as nav_cta */ },
  hero_secondary: {
    'zh-Hant': '同步如何運作', 'ja': '同期の仕組み', 'de': 'Wie Sync funktioniert',
    'es': 'Cómo funciona la sincro', 'fr': 'Comment fonctionne la synchro',
    'pt-BR': 'Como a sincronização funciona', 'ko': '동기화 작동 방식',
    'it': 'Come funziona la sincro', 'nl': 'Hoe sync werkt',
    'hi': 'सिंक कैसे काम करता है', 'id': 'Cara kerja sinkronisasi', 'vi': 'Cách đồng bộ hoạt động'
  },
  stat_enc: {
    'zh-Hant': '加密', 'ja': '暗号化', 'de': 'Verschlüsselung', 'es': 'Cifrado',
    'fr': 'Chiffrement', 'pt-BR': 'Criptografia', 'ko': '암호화', 'it': 'Cifratura',
    'nl': 'Versleuteling', 'hi': 'एन्क्रिप्शन', 'id': 'Enkripsi', 'vi': 'Mã hóa'
  },
  stat_kdf: {
    'zh-Hant': '金鑰派生', 'ja': '鍵導出', 'de': 'KDF', 'es': 'KDF',
    'fr': 'KDF', 'pt-BR': 'KDF', 'ko': 'KDF', 'it': 'KDF',
    'nl': 'KDF', 'hi': 'KDF', 'id': 'KDF', 'vi': 'KDF'
  },
  stat_kex: {
    'zh-Hant': '金鑰交換', 'ja': '鍵交換', 'de': 'Schlüsselaustausch', 'es': 'Intercambio de claves',
    'fr': 'Échange de clés', 'pt-BR': 'Troca de chaves', 'ko': '키 교환', 'it': 'Scambio chiavi',
    'nl': 'Sleuteluitwisseling', 'hi': 'की एक्सचेंज', 'id': 'Pertukaran kunci', 'vi': 'Trao đổi khóa'
  },
  stat_platform: {
    'zh-Hant': '平台', 'ja': '対応プラットフォーム', 'de': 'Plattformen', 'es': 'Plataformas',
    'fr': 'Plateformes', 'pt-BR': 'Plataformas', 'ko': '플랫폼', 'it': 'Piattaforme',
    'nl': 'Platforms', 'hi': 'प्लेटफ़ॉर्म', 'id': 'Platform', 'vi': 'Nền tảng'
  },
  // Showcase
  sc_label: {
    'zh-Hant': '功能動畫', 'ja': 'デモ', 'de': 'In Aktion', 'es': 'En acción',
    'fr': 'En action', 'pt-BR': 'Em ação', 'ko': '실제 동작', 'it': 'In azione',
    'nl': 'In actie', 'hi': 'क्रिया में देखें', 'id': 'Aksi langsung', 'vi': 'Xem hoạt động'
  },
  sc_title_1: {
    'zh-Hant': '三項能力，', 'ja': '3 つの機能を、', 'de': 'Drei Funktionen,', 'es': 'Tres funciones,',
    'fr': 'Trois fonctions,', 'pt-BR': 'Três recursos,', 'ko': '세 가지 기능을', 'it': 'Tre funzioni,',
    'nl': 'Drie functies,', 'hi': 'तीन क्षमताएँ,', 'id': 'Tiga fitur,', 'vi': 'Ba tính năng,'
  },
  sc_title_2: {
    'zh-Hant': '一眼看懂。', 'ja': 'ひと目で。', 'de': 'auf einen Blick.', 'es': 'de un vistazo.',
    'fr': 'd\'un coup d\'œil.', 'pt-BR': 'numa olhada.', 'ko': '한눈에.', 'it': 'in un colpo d\'occhio.',
    'nl': 'in één oogopslag.', 'hi': 'एक नज़र में।', 'id': 'satu pandang.', 'vi': 'một cái nhìn.'
  },
  sc_sub: {
    'zh-Hant': '看 VaultMesh 如何在沒有雲端中介的情況下完成裝置配對、密碼庫同步與瀏覽器自動填入。',
    'ja':      'VaultMesh がクラウドの仲介なしに、デバイスのペアリング、保管庫の同期、ブラウザの自動入力をどう実現するかをご覧ください。',
    'de':      'Sieh, wie VaultMesh deine Geräte koppelt, deinen Tresor synchronisiert und Passwörter ausfüllt – ganz ohne Cloud-Vermittler.',
    'es':      'Mira cómo VaultMesh empareja tus dispositivos, sincroniza tu bóveda y autocompleta tus contraseñas, sin intermediario en la nube.',
    'fr':      'Découvrez comment VaultMesh associe vos appareils, synchronise votre coffre et remplit vos mots de passe — sans intermédiaire dans le cloud.',
    'pt-BR':   'Veja como o VaultMesh pareia seus dispositivos, sincroniza seu cofre e preenche suas senhas — sem intermediário na nuvem.',
    'ko':      'VaultMesh가 클라우드 중개 없이 기기를 페어링하고, 보관함을 동기화하고, 비밀번호를 자동으로 채우는 방식을 살펴보세요.',
    'it':      'Guarda come VaultMesh accoppia i tuoi dispositivi, sincronizza il tuo vault e compila le password — senza intermediari in cloud.',
    'nl':      'Zie hoe VaultMesh je apparaten koppelt, je kluis synchroniseert en wachtwoorden invult — zonder cloudtussenpersoon.',
    'hi':      'देखें कि VaultMesh बिना किसी क्लाउड बिचौलिए के आपके डिवाइसों को कैसे पेयर करता है, वॉल्ट सिंक करता है और पासवर्ड भरता है।',
    'id':      'Lihat bagaimana VaultMesh memasangkan perangkat, menyinkronkan vault, dan mengisi kata sandi — tanpa perantara cloud.',
    'vi':      'Xem cách VaultMesh ghép cặp thiết bị, đồng bộ kho mật khẩu và tự động điền — không qua trung gian đám mây.'
  },
  tab_pair: {
    'zh-Hant': '配對', 'ja': 'ペアリング', 'de': 'Koppeln', 'es': 'Emparejar',
    'fr': 'Association', 'pt-BR': 'Pareamento', 'ko': '페어링', 'it': 'Accoppiamento',
    'nl': 'Koppelen', 'hi': 'पेयरिंग', 'id': 'Pemasangan', 'vi': 'Ghép cặp'
  },
  tab_sync: {
    'zh-Hant': '同步', 'ja': '同期', 'de': 'Sync', 'es': 'Sincro',
    'fr': 'Synchro', 'pt-BR': 'Sincro', 'ko': '동기화', 'it': 'Sincro',
    'nl': 'Sync', 'hi': 'सिंक', 'id': 'Sinkronisasi', 'vi': 'Đồng bộ'
  },
  tab_auto: {
    'zh-Hant': '自動填入', 'ja': '自動入力', 'de': 'Autofill', 'es': 'Autocompletar',
    'fr': 'Saisie auto', 'pt-BR': 'Autopreencher', 'ko': '자동 입력', 'it': 'Compilazione',
    'nl': 'Autofill', 'hi': 'ऑटोफ़िल', 'id': 'Pengisian otomatis', 'vi': 'Tự động điền'
  },
  cap_pair_strong: {
    'zh-Hant': '安全的裝置配對', 'ja': '安全なデバイスペアリング', 'de': 'Sicheres Geräte-Pairing',
    'es': 'Emparejamiento seguro de dispositivos', 'fr': 'Association sécurisée des appareils',
    'pt-BR': 'Pareamento seguro de dispositivos', 'ko': '안전한 기기 페어링',
    'it': 'Accoppiamento sicuro dei dispositivi', 'nl': 'Veilige apparaatkoppeling',
    'hi': 'सुरक्षित डिवाइस पेयरिंग', 'id': 'Pemasangan perangkat yang aman', 'vi': 'Ghép cặp thiết bị an toàn'
  },
  cap_pair_body: {
    'zh-Hant': '透過 SPAKE2 在裝置間直接交換金鑰，毋需伺服器介入。LAN 或 Relay 皆可使用。',
    'ja':      'SPAKE2 によりデバイス間で直接鍵交換を行います。サーバーは介在せず、LAN でも Relay 経由でも動作します。',
    'de':      'Direkter Geräte-zu-Geräte-Schlüsselaustausch via SPAKE2. Kein Server beteiligt. Funktioniert im LAN oder per Relay.',
    'es':      'Intercambio directo de claves entre dispositivos vía SPAKE2. Sin intervención del servidor. Funciona en LAN o por Relay.',
    'fr':      'Échange direct de clés entre appareils via SPAKE2. Sans serveur. Fonctionne en LAN ou via Relay.',
    'pt-BR':   'Troca direta de chaves entre dispositivos via SPAKE2. Sem envolvimento de servidor. Funciona em LAN ou via Relay.',
    'ko':      'SPAKE2를 통해 기기 간에 직접 키를 교환합니다. 서버는 관여하지 않으며 LAN 또는 Relay 모두에서 작동합니다.',
    'it':      'Scambio diretto di chiavi tra dispositivi via SPAKE2. Nessun server coinvolto. Funziona via LAN o Relay.',
    'nl':      'Directe sleuteluitwisseling tussen apparaten via SPAKE2. Geen serverbetrokkenheid. Werkt over LAN of Relay.',
    'hi':      'SPAKE2 के ज़रिये डिवाइस-से-डिवाइस सीधा की एक्सचेंज। कोई सर्वर शामिल नहीं। LAN या Relay दोनों पर काम करता है।',
    'id':      'Pertukaran kunci langsung antar perangkat via SPAKE2. Tanpa server. Bekerja di LAN maupun via Relay.',
    'vi':      'Trao đổi khóa trực tiếp giữa thiết bị qua SPAKE2. Không cần máy chủ. Hoạt động qua LAN hoặc Relay.'
  },
  cap_sync_strong: {
    'zh-Hant': 'P2P 直接同步', 'ja': 'P2P 直接同期', 'de': 'Direkte P2P-Sync',
    'es': 'Sincro P2P directa', 'fr': 'Synchro P2P directe', 'pt-BR': 'Sincro P2P direta',
    'ko': 'P2P 직접 동기화', 'it': 'Sincro P2P diretta', 'nl': 'Directe P2P-sync',
    'hi': 'सीधा P2P सिंक', 'id': 'Sinkronisasi P2P langsung', 'vi': 'Đồng bộ P2P trực tiếp'
  },
  cap_sync_body: {
    'zh-Hant': '裝置在 LAN 上不經伺服器直接同步。XChaCha20-Poly1305 端對端加密。Relay 為可選，只看得到密文。',
    'ja':      'デバイスは LAN 上でサーバーを介さず直接同期します。XChaCha20-Poly1305 によるエンドツーエンド暗号化。Relay は任意で、見えるのは暗号文のみです。',
    'de':      'Geräte synchronisieren direkt im LAN ohne Server. XChaCha20-Poly1305 Ende-zu-Ende. Relay ist optional und sieht nur Chiffretext.',
    'es':      'Los dispositivos sincronizan directamente en LAN, sin servidor. XChaCha20-Poly1305 de extremo a extremo. Relay es opcional y solo ve texto cifrado.',
    'fr':      'Les appareils se synchronisent directement en LAN, sans serveur. XChaCha20-Poly1305 de bout en bout. Relay est facultatif et ne voit que du chiffré.',
    'pt-BR':   'Os dispositivos sincronizam diretamente na LAN, sem servidor. XChaCha20-Poly1305 ponta a ponta. Relay é opcional e só vê texto cifrado.',
    'ko':      '기기는 서버 없이 LAN에서 직접 동기화됩니다. XChaCha20-Poly1305 종단 간 암호화. Relay는 선택 사항이며 암호문만 볼 수 있습니다.',
    'it':      'I dispositivi si sincronizzano direttamente in LAN, senza server. XChaCha20-Poly1305 end-to-end. Il Relay è opzionale e vede solo testo cifrato.',
    'nl':      'Apparaten synchroniseren rechtstreeks via LAN, zonder server. XChaCha20-Poly1305 end-to-end. Relay is optioneel en ziet alleen versleutelde gegevens.',
    'hi':      'डिवाइस बिना किसी सर्वर के LAN पर सीधे सिंक करते हैं। XChaCha20-Poly1305 एंड-टू-एंड। Relay वैकल्पिक है और केवल साइफ़रटेक्स्ट देखता है।',
    'id':      'Perangkat tersinkron langsung di LAN tanpa server. XChaCha20-Poly1305 ujung-ke-ujung. Relay opsional dan hanya melihat ciphertext.',
    'vi':      'Các thiết bị đồng bộ trực tiếp qua LAN, không máy chủ. Mã hóa đầu cuối XChaCha20-Poly1305. Relay là tùy chọn và chỉ thấy bản mã.'
  },
  cap_auto_strong: {
    'zh-Hant': '瀏覽器自動填入', 'ja': 'ブラウザの自動入力', 'de': 'Browser-Autofill',
    'es': 'Autocompletado del navegador', 'fr': 'Saisie auto du navigateur',
    'pt-BR': 'Autopreencher do navegador', 'ko': '브라우저 자동 입력',
    'it': 'Compilazione automatica del browser', 'nl': 'Browser-autofill',
    'hi': 'ब्राउज़र ऑटोफ़िल', 'id': 'Pengisian otomatis browser', 'vi': 'Tự điền của trình duyệt'
  },
  cap_auto_body: {
    'zh-Hant': '擴充功能透過 native messaging 與桌面用戶端溝通。憑證不存於瀏覽器內。',
    'ja':      '拡張機能はネイティブメッセージング経由でデスクトップクライアントと通信します。認証情報はブラウザに保存されません。',
    'de':      'Die Extension spricht über Native Messaging mit dem Desktop-Client. Anmeldedaten landen nie im Browser.',
    'es':      'La extensión habla con el cliente de escritorio mediante native messaging. Las credenciales no se guardan en el navegador.',
    'fr':      'L\'extension communique avec le client de bureau via le native messaging. Les identifiants ne sont jamais stockés dans le navigateur.',
    'pt-BR':   'A extensão fala com o cliente desktop via native messaging. As credenciais não ficam armazenadas no navegador.',
    'ko':      '확장 프로그램은 네이티브 메시징을 통해 데스크톱 클라이언트와 통신합니다. 자격 증명은 브라우저에 저장되지 않습니다.',
    'it':      'L\'estensione parla con il client desktop tramite native messaging. Le credenziali non vengono archiviate nel browser.',
    'nl':      'De extensie communiceert via native messaging met de desktopclient. Inloggegevens worden niet in de browser opgeslagen.',
    'hi':      'एक्सटेंशन नेटिव मेसेजिंग के माध्यम से डेस्कटॉप क्लाइंट से बात करता है। क्रेडेंशियल कभी ब्राउज़र में नहीं रहते।',
    'id':      'Ekstensi berbicara dengan klien desktop melalui native messaging. Kredensial tidak pernah disimpan di browser.',
    'vi':      'Tiện ích giao tiếp với ứng dụng máy tính qua native messaging. Thông tin đăng nhập không lưu trong trình duyệt.'
  },
  // Features section
  ft_label: { 'zh-Hant': '功能特色', 'ja': '機能', 'de': 'Funktionen', 'es': 'Funciones', 'fr': 'Fonctionnalités', 'pt-BR': 'Recursos', 'ko': '기능', 'it': 'Funzionalità', 'nl': 'Functies', 'hi': 'विशेषताएँ', 'id': 'Fitur', 'vi': 'Tính năng' },
  ft_title_1: {
    'zh-Hant': '流程簡潔，', 'ja': 'シンプルな手順、', 'de': 'Einfacher Ablauf,',
    'es': 'Flujo simple,', 'fr': 'Flux simple,', 'pt-BR': 'Fluxo simples,',
    'ko': '간단한 흐름,', 'it': 'Flusso semplice,', 'nl': 'Eenvoudige werking,',
    'hi': 'सरल वर्कफ़्लो,', 'id': 'Alur sederhana,', 'vi': 'Quy trình đơn giản,'
  },
  ft_title_2: {
    'zh-Hant': '安全嚴肅。', 'ja': '真剣なセキュリティ。', 'de': 'ernsthafte Sicherheit.',
    'es': 'seguridad seria.', 'fr': 'sécurité sérieuse.', 'pt-BR': 'segurança séria.',
    'ko': '진지한 보안.', 'it': 'sicurezza seria.', 'nl': 'serieuze beveiliging.',
    'hi': 'गंभीर सुरक्षा।', 'id': 'keamanan serius.', 'vi': 'bảo mật nghiêm túc.'
  },
  ft_sub: {
    'zh-Hant': '無需把金鑰或明文交給任何第三方，手機與桌面也能共用同一個加密密碼庫。',
    'ja':      '鍵や平文を第三者サービスに預けることなく、モバイルとデスクトップで暗号化された保管庫を共有できる設計です。',
    'de':      'So gebaut, dass Mobil und Desktop einen verschlüsselten Tresor teilen, ohne dass irgendein Drittanbieter Schlüssel oder Klartext sieht.',
    'es':      'Diseñado para que móvil y escritorio compartan una sola bóveda cifrada sin entregar claves ni texto en claro a terceros.',
    'fr':      'Conçu pour que mobile et bureau partagent un seul coffre chiffré, sans confier clés ni texte en clair à un tiers.',
    'pt-BR':   'Feito para que móvel e desktop compartilhem um único cofre criptografado sem entregar chaves ou texto em claro a terceiros.',
    'ko':      '제3자 서비스에 키나 평문을 맡기지 않고도 모바일과 데스크톱이 하나의 암호화된 보관함을 공유하도록 설계되었습니다.',
    'it':      'Pensato perché mobile e desktop condividano un unico vault cifrato senza affidare chiavi o testo in chiaro a terzi.',
    'nl':      'Ontworpen zodat mobiel en desktop één versleutelde kluis delen zonder sleutels of klare tekst aan derden af te geven.',
    'hi':      'इस तरह बना है कि मोबाइल और डेस्कटॉप एक ही एन्क्रिप्टेड वॉल्ट साझा कर सकें — बिना किसी थर्ड-पार्टी को कुंजी या प्लेन-टेक्स्ट सौंपे।',
    'id':      'Dirancang agar ponsel dan desktop berbagi satu vault terenkripsi tanpa menyerahkan kunci atau teks polos ke pihak ketiga.',
    'vi':      'Được thiết kế để di động và máy tính chia sẻ một kho mã hóa duy nhất, không giao chìa khóa hay bản rõ cho bên thứ ba.'
  },
  ft_zk_t: { 'zh-Hant': '零知識', 'ja': 'ゼロ知識', 'de': 'Zero Knowledge', 'es': 'Conocimiento cero', 'fr': 'Zero Knowledge', 'pt-BR': 'Conhecimento zero', 'ko': '제로 지식', 'it': 'Zero Knowledge', 'nl': 'Zero Knowledge', 'hi': 'ज़ीरो-नॉलेज', 'id': 'Zero Knowledge', 'vi': 'Zero Knowledge' },
  ft_zk_d: {
    'zh-Hant': '伺服器無法讀取你的密碼庫。加密與解密只在你的裝置上完成，金鑰絕不離開本地。',
    'ja':      'サーバーは保管庫を読めません。暗号化・復号は端末上のみで行われ、鍵がローカルから離れることはありません。',
    'de':      'Kein Server kann deinen Tresor lesen. Verschlüsselung und Entschlüsselung passieren nur auf deinen Geräten – Schlüssel bleiben lokal.',
    'es':      'Ningún servidor puede leer tu bóveda. El cifrado y el descifrado ocurren solo en tus dispositivos; las claves nunca salen del almacenamiento local.',
    'fr':      'Aucun serveur ne peut lire votre coffre. Le chiffrement et le déchiffrement n\'ont lieu que sur vos appareils ; les clés ne quittent jamais le local.',
    'pt-BR':   'Nenhum servidor pode ler seu cofre. Criptografar e descriptografar acontece só nos seus dispositivos; as chaves nunca saem do armazenamento local.',
    'ko':      '어떤 서버도 보관함을 읽을 수 없습니다. 암복호화는 기기에서만 일어나고, 키는 로컬을 떠나지 않습니다.',
    'it':      'Nessun server può leggere il tuo vault. Cifratura e decifratura avvengono solo sui tuoi dispositivi e le chiavi restano sempre in locale.',
    'nl':      'Geen server kan je kluis lezen. Versleutelen en ontsleutelen gebeurt alleen op je apparaten; sleutels verlaten nooit lokale opslag.',
    'hi':      'कोई भी सर्वर आपके वॉल्ट को नहीं पढ़ सकता। एन्क्रिप्शन और डिक्रिप्शन सिर्फ़ आपके डिवाइसों पर होते हैं — कुंजी कभी लोकल से बाहर नहीं जातीं।',
    'id':      'Tidak ada server yang bisa membaca vault Anda. Enkripsi dan dekripsi hanya terjadi di perangkat Anda; kunci tidak pernah meninggalkan penyimpanan lokal.',
    'vi':      'Không máy chủ nào đọc được kho của bạn. Mã hóa và giải mã chỉ diễn ra trên thiết bị; khóa không bao giờ rời khỏi nơi lưu trữ cục bộ.'
  },
  ft_local_t: { 'zh-Hant': '本地優先', 'ja': 'ローカルファースト', 'de': 'Lokal-first', 'es': 'Local-first', 'fr': 'Local-first', 'pt-BR': 'Local-first', 'ko': '로컬 우선', 'it': 'Local-first', 'nl': 'Local-first', 'hi': 'लोकल-फर्स्ट', 'id': 'Local-first', 'vi': 'Local-first' },
  ft_local_d: {
    'zh-Hant': '密碼庫以加密形式儲存在本地資料庫。完全離線也能正常使用，無網路依賴。',
    'ja':      '保管庫は端末のローカル暗号化データベースに保存。オフラインでも完全に動作し、ネットワーク依存はありません。',
    'de':      'Dein Tresor liegt verschlüsselt in einer lokalen Datenbank. VaultMesh ist offline voll nutzbar – ohne Netzwerk-Abhängigkeit.',
    'es':      'Tu bóveda se guarda localmente en una base de datos cifrada. VaultMesh funciona totalmente sin conexión, sin dependencia de red.',
    'fr':      'Votre coffre est stocké localement dans une base de données chiffrée. VaultMesh reste pleinement utilisable hors ligne, sans dépendance réseau.',
    'pt-BR':   'Seu cofre fica armazenado localmente em um banco de dados criptografado. O VaultMesh continua totalmente utilizável offline, sem depender da rede.',
    'ko':      '보관함은 암호화된 로컬 데이터베이스에 저장됩니다. 오프라인에서도 완전히 사용 가능하며 네트워크 의존성이 없습니다.',
    'it':      'Il tuo vault è memorizzato localmente in un database cifrato. VaultMesh resta pienamente utilizzabile offline, senza dipendenze di rete.',
    'nl':      'Je kluis staat lokaal opgeslagen in een versleutelde database. VaultMesh werkt volledig offline, zonder netwerkafhankelijkheid.',
    'hi':      'आपका वॉल्ट एक एन्क्रिप्टेड लोकल डेटाबेस में रहता है। ऑफ़लाइन भी पूरी तरह काम करता है — कोई नेटवर्क निर्भरता नहीं।',
    'id':      'Vault Anda disimpan lokal di basis data terenkripsi. VaultMesh tetap berfungsi penuh saat offline, tanpa ketergantungan jaringan.',
    'vi':      'Kho mật khẩu lưu cục bộ trong cơ sở dữ liệu được mã hóa. VaultMesh hoạt động đầy đủ ngoại tuyến, không phụ thuộc mạng.'
  },
  ft_cf_t: {
    'zh-Hant': '無衝突同步', 'ja': '衝突なし同期', 'de': 'Konfliktfreie Sync', 'es': 'Sincro sin conflictos',
    'fr': 'Synchro sans conflit', 'pt-BR': 'Sincro sem conflitos', 'ko': '충돌 없는 동기화',
    'it': 'Sincro senza conflitti', 'nl': 'Conflictvrije sync', 'hi': 'बिना टकराव सिंक',
    'id': 'Sinkronisasi bebas konflik', 'vi': 'Đồng bộ không xung đột'
  },
  ft_cf_d: {
    'zh-Hant': '混合邏輯時鐘與版本向量讓多端並發編輯能可靠合併，不會丟資料。',
    'ja':      'ハイブリッド論理時計とバージョンベクトルで、複数端末の並行編集を確定的にマージ。データの取りこぼしはありません。',
    'de':      'Hybrid Logical Clock und Version Vectors mergen gleichzeitige Änderungen deterministisch – ohne Datenverlust.',
    'es':      'Reloj lógico híbrido y vectores de versión fusionan ediciones concurrentes de forma determinista, sin pérdida de datos.',
    'fr':      'Une horloge logique hybride et des vecteurs de version fusionnent les modifications concurrentes de façon déterministe, sans perte de données.',
    'pt-BR':   'Relógio lógico híbrido e vetores de versão mesclam edições concorrentes de forma determinística, sem perda de dados.',
    'ko':      '하이브리드 논리 시계와 버전 벡터로 동시 편집을 결정적으로 병합하며 데이터 손실이 없습니다.',
    'it':      'Hybrid logical clock e version vector fondono le modifiche concorrenti in modo deterministico, senza perdita di dati.',
    'nl':      'Hybrid logical clock en versievectoren mergen gelijktijdige bewerkingen deterministisch, zonder dataverlies.',
    'hi':      'हाइब्रिड लॉजिकल क्लॉक और वर्शन वेक्टर एक साथ हुए बदलावों को निश्चित ढंग से मर्ज करते हैं — कोई डेटा नहीं खोता।',
    'id':      'Jam logis hibrida dan vektor versi menggabungkan suntingan bersamaan secara deterministik, tanpa kehilangan data.',
    'vi':      'Đồng hồ logic lai và vector phiên bản hợp nhất các chỉnh sửa đồng thời một cách xác định, không mất dữ liệu.'
  },
  ft_indep_t: {
    'zh-Hant': '獨立同步', 'ja': '独立同期', 'de': 'Unabhängige Sync', 'es': 'Sincro independiente',
    'fr': 'Synchro indépendante', 'pt-BR': 'Sincro independente', 'ko': '독립 동기화',
    'it': 'Sincro indipendente', 'nl': 'Onafhankelijke sync', 'hi': 'स्वतंत्र सिंक',
    'id': 'Sinkronisasi mandiri', 'vi': 'Đồng bộ độc lập'
  },
  ft_indep_d: {
    'zh-Hant': '手機與桌面互不依賴，無需主裝置。每一台都是平等的同步參與者。',
    'ja':      'モバイルとデスクトップは互いに依存せず、ハブ端末は不要。各端末が同期の対等な参加者です。',
    'de':      'Mobil und Desktop synchronisieren ohne Hub-Gerät. Jedes Gerät ist gleichberechtigter Teil der Sync.',
    'es':      'Móvil y escritorio sincronizan sin necesidad de un dispositivo central. Cada equipo es un participante de pleno derecho.',
    'fr':      'Mobile et bureau se synchronisent sans appareil central. Chaque appareil est un participant à part entière.',
    'pt-BR':   'Móvel e desktop sincronizam sem precisar de um dispositivo central. Cada um é um participante de pleno direito.',
    'ko':      '모바일과 데스크톱이 허브 기기 없이 동기화됩니다. 모든 기기가 동등한 동기화 참가자입니다.',
    'it':      'Mobile e desktop si sincronizzano senza dispositivo hub. Ogni dispositivo è un partecipante alla pari.',
    'nl':      'Mobiel en desktop synchroniseren zonder hub-apparaat. Elk apparaat is gelijkwaardig deelnemer.',
    'hi':      'मोबाइल और डेस्कटॉप एक-दूसरे पर निर्भर नहीं हैं — कोई हब डिवाइस ज़रूरी नहीं। हर डिवाइस बराबर का सहभागी है।',
    'id':      'Ponsel dan desktop sinkron tanpa perangkat hub. Setiap perangkat adalah peserta sinkronisasi setara.',
    'vi':      'Di động và máy tính đồng bộ không cần thiết bị trung tâm. Mỗi thiết bị là một thành viên bình đẳng.'
  },
  ft_pair_t: { 'zh-Hant': '安全配對', 'ja': '安全なペアリング', 'de': 'Sicheres Pairing', 'es': 'Emparejamiento seguro', 'fr': 'Association sécurisée', 'pt-BR': 'Pareamento seguro', 'ko': '안전한 페어링', 'it': 'Accoppiamento sicuro', 'nl': 'Veilige koppeling', 'hi': 'सुरक्षित पेयरिंग', 'id': 'Pemasangan aman', 'vi': 'Ghép cặp an toàn' },
  ft_pair_d: {
    'zh-Hant': 'SPAKE2 加上人工驗證確保只有你信任的實體裝置能加入同步網域。',
    'ja':      'SPAKE2 と人による確認で、信頼する物理デバイスだけが同期ドメインに加わるようにします。',
    'de':      'SPAKE2 plus menschliche Bestätigung stellt sicher, dass nur vertraute Geräte deiner Sync beitreten.',
    'es':      'SPAKE2 más verificación humana garantizan que solo tus dispositivos físicos de confianza puedan unirse al dominio de sincro.',
    'fr':      'SPAKE2 plus vérification humaine garantit que seuls vos appareils physiques de confiance rejoignent votre synchro.',
    'pt-BR':   'SPAKE2 mais verificação humana garantem que só seus dispositivos físicos confiáveis entrem no domínio de sincro.',
    'ko':      'SPAKE2와 사람의 확인으로 신뢰하는 실제 기기만 동기화 도메인에 들어올 수 있습니다.',
    'it':      'SPAKE2 più verifica umana garantiscono che solo i tuoi dispositivi fisici fidati entrino nel dominio di sincronizzazione.',
    'nl':      'SPAKE2 plus menselijke verificatie zorgen dat alleen jouw vertrouwde apparaten je sync-domein binnenkomen.',
    'hi':      'SPAKE2 और मानवीय सत्यापन यह सुनिश्चित करते हैं कि केवल आपके भरोसेमंद डिवाइस ही सिंक डोमेन में शामिल हों।',
    'id':      'SPAKE2 plus verifikasi manusia memastikan hanya perangkat fisik tepercaya yang bergabung dengan domain sinkronisasi Anda.',
    'vi':      'SPAKE2 cộng với xác minh thủ công đảm bảo chỉ những thiết bị tin cậy của bạn mới tham gia miền đồng bộ.'
  },
  ft_ext_t: {
    'zh-Hant': '瀏覽器擴充功能', 'ja': 'ブラウザ拡張', 'de': 'Browser-Extension',
    'es': 'Extensión de navegador', 'fr': 'Extension navigateur', 'pt-BR': 'Extensão de navegador',
    'ko': '브라우저 확장', 'it': 'Estensione browser', 'nl': 'Browserextensie',
    'hi': 'ब्राउज़र एक्सटेंशन', 'id': 'Ekstensi browser', 'vi': 'Tiện ích trình duyệt'
  },
  ft_ext_d: {
    'zh-Hant': '擴充功能透過桌面用戶端完成自動填入，敏感資料不會長時間留在瀏覽器儲存中。',
    'ja':      '拡張機能はデスクトップクライアントを介して自動入力を行い、機微情報がブラウザに長く留まることはありません。',
    'de':      'Extensions verbinden sich mit dem Desktop-Client für sicheres Autofill. Sensible Daten bleiben aus dem Browser-Speicher heraus.',
    'es':      'Las extensiones se conectan al cliente de escritorio para autocompletar seguro. Los datos sensibles no quedan en el almacenamiento del navegador.',
    'fr':      'Les extensions se connectent au client de bureau pour une saisie auto sécurisée. Les données sensibles ne restent pas dans le navigateur.',
    'pt-BR':   'As extensões conectam-se ao cliente desktop para autopreencher com segurança. Dados sensíveis não ficam no armazenamento do navegador.',
    'ko':      '확장 프로그램은 안전한 자동 입력을 위해 데스크톱 클라이언트와 연결됩니다. 민감 데이터는 브라우저 저장소에 남지 않습니다.',
    'it':      'Le estensioni si collegano al client desktop per una compilazione sicura. I dati sensibili non restano nello storage del browser.',
    'nl':      'Extensies maken verbinding met de desktopclient voor veilig autofill. Gevoelige gegevens blijven niet in browseropslag.',
    'hi':      'एक्सटेंशन सुरक्षित ऑटोफ़िल के लिए डेस्कटॉप क्लाइंट से जुड़ते हैं। संवेदनशील डेटा ब्राउज़र की लंबी संग्रहित मेमोरी में नहीं रहता।',
    'id':      'Ekstensi tersambung ke klien desktop untuk autofill yang aman. Data sensitif tidak menetap di penyimpanan browser.',
    'vi':      'Tiện ích kết nối với ứng dụng máy tính để tự điền an toàn. Dữ liệu nhạy cảm không lưu lâu trong trình duyệt.'
  },
  // How it works
  hw_label: { 'zh-Hant': '運作方式', 'ja': '仕組み', 'de': 'So funktioniert\'s', 'es': 'Cómo funciona', 'fr': 'Comment ça marche', 'pt-BR': 'Como funciona', 'ko': '작동 방식', 'it': 'Come funziona', 'nl': 'Hoe het werkt', 'hi': 'कैसे काम करता है', 'id': 'Cara kerja', 'vi': 'Cách hoạt động' },
  hw_title_1: {
    'zh-Hant': '從首次安裝到日常使用，', 'ja': '初インストールから日常使用まで、', 'de': 'Von der Erstinstallation',
    'es': 'De la primera instalación', 'fr': 'De la première installation', 'pt-BR': 'Da primeira instalação',
    'ko': '첫 설치부터', 'it': 'Dalla prima installazione', 'nl': 'Van eerste installatie',
    'hi': 'पहले इंस्टॉल से', 'id': 'Dari instalasi pertama', 'vi': 'Từ lần cài đặt đầu tiên'
  },
  hw_title_2: {
    'zh-Hant': '只需四步。', 'ja': '4 ステップだけ。', 'de': 'in vier Schritten zur täglichen Nutzung.',
    'es': 'al uso diario en cuatro pasos.', 'fr': 'à l\'usage quotidien en quatre étapes.',
    'pt-BR': 'ao uso diário em quatro passos.', 'ko': '일상 사용까지 네 단계.',
    'it': 'all\'uso quotidiano in quattro passi.', 'nl': 'tot dagelijks gebruik in vier stappen.',
    'hi': 'रोज़मर्रा के इस्तेमाल तक चार कदम।', 'id': 'hingga penggunaan harian dalam empat langkah.',
    'vi': 'đến sử dụng hằng ngày chỉ qua bốn bước.'
  },
  hw_sub: {
    'zh-Hant': '從任意裝置開始，要多端同步時再配對其他可信裝置。',
    'ja':      'お好みの端末で始めて、共有同期したくなったら信頼するデバイスを追加でペアリング。',
    'de':      'Auf einem beliebigen Gerät beginnen, weitere vertrauenswürdige Geräte später für Sync koppeln.',
    'es':      'Empieza en cualquier dispositivo y empareja después otros equipos de confianza para sincronizar.',
    'fr':      'Commencez sur l\'appareil de votre choix, puis associez d\'autres appareils de confiance pour la synchro.',
    'pt-BR':   'Comece em qualquer dispositivo e pareie depois outros aparelhos confiáveis para sincronizar.',
    'ko':      '원하는 기기에서 시작하고, 공유 동기화가 필요할 때 신뢰하는 기기를 추가로 페어링하세요.',
    'it':      'Inizia da qualunque dispositivo, poi accoppia altri device fidati quando vuoi la sincronizzazione condivisa.',
    'nl':      'Begin op elk gewenst apparaat en koppel later andere vertrouwde apparaten voor gedeelde sync.',
    'hi':      'किसी भी डिवाइस से शुरू करें, और जब साझा सिंक चाहिए हो तब और भरोसेमंद डिवाइस पेयर कर लें।',
    'id':      'Mulai dari perangkat mana pun, lalu pasangkan perangkat tepercaya lain saat ingin sinkronisasi bersama.',
    'vi':      'Bắt đầu từ thiết bị bất kỳ, ghép cặp thêm các thiết bị tin cậy khi muốn đồng bộ chung.'
  },
  hw_s1_t: {
    'zh-Hant': '在任意裝置上安裝', 'ja': '好きな端末にインストール', 'de': 'Auf einem beliebigen Gerät installieren',
    'es': 'Instala en cualquier dispositivo', 'fr': 'Installer sur n\'importe quel appareil',
    'pt-BR': 'Instale em qualquer dispositivo', 'ko': '원하는 기기에 설치',
    'it': 'Installa su qualunque dispositivo', 'nl': 'Installeer op elk apparaat',
    'hi': 'किसी भी डिवाइस पर इंस्टॉल करें', 'id': 'Pasang di perangkat mana saja',
    'vi': 'Cài đặt trên thiết bị bất kỳ'
  },
  hw_s1_d: {
    'zh-Hant': '在手機或桌面安裝 VaultMesh，無需註冊帳號、無需雲端設定。',
    'ja':      'モバイルでもデスクトップでも、VaultMesh はアカウント登録もクラウド設定も不要でインストール可能。',
    'de':      'Installiere VaultMesh auf Mobil oder Desktop – ohne Account-Registrierung, ohne Cloud-Setup.',
    'es':      'Instala VaultMesh en móvil o escritorio sin registrar cuenta ni configurar nube.',
    'fr':      'Installez VaultMesh sur mobile ou bureau, sans création de compte ni configuration cloud.',
    'pt-BR':   'Instale o VaultMesh em móvel ou desktop sem cadastro de conta nem configuração de nuvem.',
    'ko':      '계정 가입이나 클라우드 설정 없이 모바일 또는 데스크톱에 VaultMesh를 설치하세요.',
    'it':      'Installa VaultMesh su mobile o desktop senza registrare account né configurare cloud.',
    'nl':      'Installeer VaultMesh op mobiel of desktop zonder accountregistratie of cloudconfiguratie.',
    'hi':      'मोबाइल या डेस्कटॉप पर VaultMesh इंस्टॉल करें — कोई अकाउंट रजिस्ट्रेशन या क्लाउड सेटअप नहीं।',
    'id':      'Pasang VaultMesh di ponsel atau desktop tanpa daftar akun atau setup cloud.',
    'vi':      'Cài VaultMesh trên di động hoặc máy tính, không cần đăng ký tài khoản hay thiết lập đám mây.'
  },
  hw_s2_t: { 'zh-Hant': '建立你的密碼庫', 'ja': '保管庫を作成', 'de': 'Tresor anlegen', 'es': 'Crea tu bóveda', 'fr': 'Créer votre coffre', 'pt-BR': 'Crie seu cofre', 'ko': '보관함 만들기', 'it': 'Crea il tuo vault', 'nl': 'Maak je kluis aan', 'hi': 'अपना वॉल्ट बनाएँ', 'id': 'Buat vault Anda', 'vi': 'Tạo kho của bạn' },
  hw_s2_d: {
    'zh-Hant': '設定主密碼。資料先以 Argon2id 派生金鑰，再用 XChaCha20 加密後儲存。',
    'ja':      'マスターパスワードを設定。データは Argon2id で鍵を導出し、XChaCha20 で暗号化されてから保存されます。',
    'de':      'Lege dein Master-Passwort fest. Daten werden mit Argon2id und XChaCha20 verschlüsselt, bevor sie gespeichert werden.',
    'es':      'Define tu contraseña maestra. Los datos se cifran con Argon2id y XChaCha20 antes de almacenarse.',
    'fr':      'Définissez votre mot de passe maître. Les données sont chiffrées avec Argon2id et XChaCha20 avant stockage.',
    'pt-BR':   'Defina sua senha-mestra. Os dados são criptografados com Argon2id e XChaCha20 antes de serem armazenados.',
    'ko':      '마스터 비밀번호를 설정하세요. 데이터는 Argon2id와 XChaCha20으로 암호화된 뒤 저장됩니다.',
    'it':      'Imposta la tua password principale. I dati vengono cifrati con Argon2id e XChaCha20 prima di essere salvati.',
    'nl':      'Stel je hoofdwachtwoord in. Gegevens worden met Argon2id en XChaCha20 versleuteld voordat ze worden opgeslagen.',
    'hi':      'अपना मास्टर पासवर्ड सेट करें। डेटा Argon2id और XChaCha20 से एन्क्रिप्ट करने के बाद ही सेव होता है।',
    'id':      'Tetapkan kata sandi utama Anda. Data dienkripsi dengan Argon2id dan XChaCha20 sebelum disimpan.',
    'vi':      'Đặt mật khẩu chính. Dữ liệu được mã hóa bằng Argon2id và XChaCha20 trước khi lưu.'
  },
  hw_s3_t: {
    'zh-Hant': '配對可信裝置', 'ja': '信頼する端末をペアリング', 'de': 'Vertrauenswürdige Geräte koppeln',
    'es': 'Empareja dispositivos de confianza', 'fr': 'Associer des appareils de confiance',
    'pt-BR': 'Pareie dispositivos confiáveis', 'ko': '신뢰하는 기기 페어링',
    'it': 'Accoppia dispositivi fidati', 'nl': 'Vertrouwde apparaten koppelen',
    'hi': 'भरोसेमंद डिवाइस पेयर करें', 'id': 'Pasangkan perangkat tepercaya', 'vi': 'Ghép cặp thiết bị tin cậy'
  },
  hw_s3_d: {
    'zh-Hant': '在裝置間使用 QR 或配對碼，並在雙方核對安全短語後再確認。',
    'ja':      'デバイス間で QR またはペアリングコードを使い、双方の安全文字列を照合してから承認します。',
    'de':      'Verwende QR oder Pairing-Code zwischen Geräten und prüfe vor der Bestätigung den Security-String beidseitig.',
    'es':      'Usa QR o código de emparejamiento entre dispositivos y verifica la frase de seguridad en ambos antes de aprobar.',
    'fr':      'Utilisez un QR ou un code d\'association entre appareils et vérifiez la phrase de sécurité sur les deux avant d\'approuver.',
    'pt-BR':   'Use QR ou código de pareamento entre dispositivos e confira a frase de segurança em ambos antes de aprovar.',
    'ko':      '기기 간에 QR 또는 페어링 코드를 사용하고, 양쪽에서 안전 문구를 대조한 뒤 승인하세요.',
    'it':      'Usa QR o codice di accoppiamento tra i dispositivi e verifica la stringa di sicurezza su entrambi prima di approvare.',
    'nl':      'Gebruik QR of een koppelcode tussen apparaten en verifieer de security string aan beide kanten voor je goedkeurt.',
    'hi':      'डिवाइसों के बीच QR या पेयरिंग कोड इस्तेमाल करें और मंज़ूरी से पहले दोनों जगह सिक्योरिटी स्ट्रिंग मिलाएँ।',
    'id':      'Gunakan QR atau kode pemasangan antar perangkat dan cocokkan frase keamanan di kedua sisi sebelum menyetujui.',
    'vi':      'Dùng mã QR hoặc mã ghép cặp giữa các thiết bị và đối chiếu chuỗi an toàn ở cả hai bên trước khi xác nhận.'
  },
  hw_s4_t: {
    'zh-Hant': '隨處使用', 'ja': 'どこでも使う', 'de': 'Überall nutzen',
    'es': 'Úsalo en cualquier lugar', 'fr': 'Utiliser partout', 'pt-BR': 'Use em qualquer lugar',
    'ko': '어디서나 사용', 'it': 'Usa ovunque', 'nl': 'Overal gebruiken',
    'hi': 'हर जगह उपयोग करें', 'id': 'Gunakan di mana saja', 'vi': 'Sử dụng mọi nơi'
  },
  hw_s4_d: {
    'zh-Hant': '一個加密密碼庫橫跨手機與桌面。需要時再接上瀏覽器擴充功能。',
    'ja':      '一つの暗号化保管庫をモバイルとデスクトップで共有。必要に応じてブラウザ拡張機能と連携。',
    'de':      'Ein verschlüsselter Tresor für Mobil und Desktop. Browser-Extension dazuholen, wann du sie brauchst.',
    'es':      'Una sola bóveda cifrada en móvil y escritorio. Añade la extensión de navegador cuando la necesites.',
    'fr':      'Un seul coffre chiffré sur mobile et bureau. Ajoutez l\'extension de navigateur quand vous en avez besoin.',
    'pt-BR':   'Um único cofre criptografado em móvel e desktop. Some a extensão de navegador quando precisar.',
    'ko':      '하나의 암호화된 보관함을 모바일과 데스크톱에서 공유하고, 필요할 때 브라우저 확장을 추가하세요.',
    'it':      'Un unico vault cifrato su mobile e desktop. Aggiungi l\'estensione browser quando ti serve.',
    'nl':      'Eén versleutelde kluis op mobiel en desktop. Voeg de browserextensie toe wanneer je wilt.',
    'hi':      'मोबाइल और डेस्कटॉप पर एक ही एन्क्रिप्टेड वॉल्ट। ज़रूरत पड़ने पर ब्राउज़र एक्सटेंशन जोड़ लें।',
    'id':      'Satu vault terenkripsi di ponsel dan desktop. Tambahkan integrasi ekstensi browser saat dibutuhkan.',
    'vi':      'Một kho mã hóa duy nhất trên di động và máy tính. Thêm tích hợp tiện ích trình duyệt khi cần.'
  },
  // Download section
  dl_label: { 'zh-Hant': '下載', 'ja': 'ダウンロード', 'de': 'Download', 'es': 'Descargar', 'fr': 'Téléchargement', 'pt-BR': 'Download', 'ko': '다운로드', 'it': 'Scarica', 'nl': 'Download', 'hi': 'डाउनलोड', 'id': 'Unduh', 'vi': 'Tải xuống' },
  dl_title_1: {
    'zh-Hant': '下載安裝', 'ja': 'ダウンロードと', 'de': 'Downloads',
    'es': 'Descargas', 'fr': 'Téléchargements', 'pt-BR': 'Downloads',
    'ko': '다운로드와', 'it': 'Download', 'nl': 'Downloads',
    'hi': 'डाउनलोड', 'id': 'Unduhan', 'vi': 'Tải xuống'
  },
  dl_title_2: {
    'zh-Hant': '與商店連結。', 'ja': 'ストアのリンク。', 'de': 'und Store-Links.',
    'es': 'y enlaces de tienda.', 'fr': 'et liens des stores.', 'pt-BR': 'e links das lojas.',
    'ko': '스토어 링크.', 'it': 'e link agli store.', 'nl': 'en storelinks.',
    'hi': 'और स्टोर लिंक।', 'id': 'dan tautan toko.', 'vi': 'và liên kết kho ứng dụng.'
  },
  dl_sub: {
    'zh-Hant': '手機與瀏覽器擴充功能請走官方商店；桌面與 Relay 安裝包由本站直接提供。',
    'ja':      'モバイルとブラウザ拡張は公式ストアから、デスクトップと Relay のパッケージは本サイトから直接配布しています。',
    'de':      'Mobile Apps und Browser-Extensions kommen aus offiziellen Stores; Desktop- und Relay-Pakete liefern wir direkt hier aus.',
    'es':      'Móvil y extensiones de navegador desde sus tiendas oficiales; los paquetes de escritorio y Relay se sirven directamente desde este sitio.',
    'fr':      'Mobile et extensions navigateur via les stores officiels ; les paquets bureau et Relay sont servis directement depuis ce site.',
    'pt-BR':   'Móvel e extensões de navegador pelas lojas oficiais; pacotes desktop e Relay são servidos diretamente deste site.',
    'ko':      '모바일과 브라우저 확장은 공식 스토어를 통해, 데스크톱과 Relay 패키지는 이 사이트에서 직접 제공합니다.',
    'it':      'Mobile ed estensioni browser dagli store ufficiali; i pacchetti desktop e Relay sono distribuiti direttamente da questo sito.',
    'nl':      'Mobiel en browserextensies via officiële stores; desktop- en Relay-pakketten worden rechtstreeks vanaf deze site geserveerd.',
    'hi':      'मोबाइल और ब्राउज़र एक्सटेंशन के लिए आधिकारिक स्टोर का उपयोग करें। डेस्कटॉप और Relay पैकेज इस साइट से सीधे मिलते हैं।',
    'id':      'Aplikasi ponsel dan ekstensi browser melalui toko resmi; paket desktop dan Relay disajikan langsung dari situs ini.',
    'vi':      'Ứng dụng di động và tiện ích trình duyệt qua kho chính thức; gói máy tính và Relay được phục vụ trực tiếp từ trang này.'
  },
  dl_mob_t: {
    'zh-Hant': '行動裝置應用程式', 'ja': 'モバイルアプリ', 'de': 'Mobile-Apps',
    'es': 'Apps móviles', 'fr': 'Applications mobiles', 'pt-BR': 'Apps móveis',
    'ko': '모바일 앱', 'it': 'App mobili', 'nl': 'Mobiele apps',
    'hi': 'मोबाइल ऐप्स', 'id': 'Aplikasi ponsel', 'vi': 'Ứng dụng di động'
  },
  dl_mob_s: {
    'zh-Hant': '行動裝置同步獨立運作，無需桌面',
    'ja':      'モバイル同期はデスクトップを必要としません',
    'de':      'Mobile Sync ist unabhängig – kein Desktop nötig',
    'es':      'La sincronización móvil es independiente, no requiere escritorio',
    'fr':      'La synchro mobile est indépendante, aucun bureau requis',
    'pt-BR':   'A sincronização móvel é independente, não requer desktop',
    'ko':      '모바일 동기화는 독립적이며 데스크톱이 필요하지 않습니다',
    'it':      'La sincronizzazione mobile è indipendente, non richiede desktop',
    'nl':      'Mobiele sync werkt onafhankelijk, geen desktop nodig',
    'hi':      'मोबाइल सिंक स्वतंत्र है, डेस्कटॉप ज़रूरी नहीं',
    'id':      'Sinkronisasi ponsel mandiri, tidak butuh desktop',
    'vi':      'Đồng bộ di động độc lập, không cần máy tính'
  },
  dl_ios_n: { 'zh-Hant': 'iOS 應用程式', 'ja': 'iOS アプリ', 'de': 'iOS-App', 'es': 'App iOS', 'fr': 'Application iOS', 'pt-BR': 'App iOS', 'ko': 'iOS 앱', 'it': 'App iOS', 'nl': 'iOS-app', 'hi': 'iOS ऐप', 'id': 'Aplikasi iOS', 'vi': 'Ứng dụng iOS' },
  dl_and_n: { 'zh-Hant': 'Android 應用程式', 'ja': 'Android アプリ', 'de': 'Android-App', 'es': 'App Android', 'fr': 'Application Android', 'pt-BR': 'App Android', 'ko': 'Android 앱', 'it': 'App Android', 'nl': 'Android-app', 'hi': 'Android ऐप', 'id': 'Aplikasi Android', 'vi': 'Ứng dụng Android' },
  dl_and_m: {
    'zh-Hant': 'Google Play · 即將推出', 'ja': 'Google Play · 近日公開',
    'de': 'Google Play · in Kürze', 'es': 'Google Play · próximamente',
    'fr': 'Google Play · bientôt', 'pt-BR': 'Google Play · em breve',
    'ko': 'Google Play · 곧 출시', 'it': 'Google Play · in arrivo',
    'nl': 'Google Play · binnenkort', 'hi': 'Google Play · जल्द आ रहा है',
    'id': 'Google Play · segera hadir', 'vi': 'Google Play · sắp ra mắt'
  },
  dl_and_btn: {
    'zh-Hant': '即將推出', 'ja': '近日公開', 'de': 'Bald verfügbar', 'es': 'Próximamente',
    'fr': 'Bientôt', 'pt-BR': 'Em breve', 'ko': '곧 출시', 'it': 'In arrivo',
    'nl': 'Binnenkort', 'hi': 'जल्द आ रहा है', 'id': 'Segera hadir', 'vi': 'Sắp ra mắt'
  },
  dl_dt_t: {
    'zh-Hant': '桌面用戶端', 'ja': 'デスクトップクライアント', 'de': 'Desktop-Client',
    'es': 'Cliente de escritorio', 'fr': 'Client de bureau', 'pt-BR': 'Cliente de desktop',
    'ko': '데스크톱 클라이언트', 'it': 'Client desktop', 'nl': 'Desktopclient',
    'hi': 'डेस्कटॉप क्लाइंट', 'id': 'Klien desktop', 'vi': 'Ứng dụng máy tính'
  },
  dl_dt_s: {
    'zh-Hant': 'Safari 自動填入請用 App Store 版；Chrome / Firefox / Edge 自動填入請用本站桌面安裝包',
    'ja':      'Safari 自動入力には App Store 版を、Chrome / Firefox / Edge 自動入力には本サイトのデスクトップパッケージをお使いください',
    'de':      'Für Safari-Autofill die App-Store-Version nutzen; für Chrome / Firefox / Edge die hier bereitgestellten Desktop-Pakete',
    'es':      'Para Safari, usa la versión de la App Store; para Chrome / Firefox / Edge usa los paquetes de escritorio de este sitio',
    'fr':      'Pour la saisie auto Safari, utilisez la version App Store ; pour Chrome / Firefox / Edge, utilisez les paquets de bureau de ce site',
    'pt-BR':   'Para autopreencher no Safari use a versão da App Store; para Chrome / Firefox / Edge use os pacotes desktop deste site',
    'ko':      'Safari 자동 입력은 App Store 버전을, Chrome / Firefox / Edge 자동 입력은 이 사이트의 데스크톱 패키지를 사용하세요',
    'it':      'Per la compilazione su Safari usa la versione App Store; per Chrome / Firefox / Edge usa i pacchetti desktop di questo sito',
    'nl':      'Voor Safari-autofill: gebruik de App Store-versie; voor Chrome / Firefox / Edge: gebruik de desktoppakketten van deze site',
    'hi':      'Safari ऑटोफ़िल के लिए App Store वर्शन का उपयोग करें; Chrome / Firefox / Edge ऑटोफ़िल के लिए इस साइट के डेस्कटॉप पैकेज का उपयोग करें',
    'id':      'Untuk autofill Safari pakai versi App Store; untuk Chrome / Firefox / Edge pakai paket desktop dari situs ini',
    'vi':      'Tự điền Safari dùng phiên bản App Store; Chrome / Firefox / Edge dùng các gói máy tính từ trang này'
  },
  dl_btn_dl: {
    'zh-Hant': '下載', 'ja': 'ダウンロード', 'de': 'Download', 'es': 'Descargar',
    'fr': 'Télécharger', 'pt-BR': 'Baixar', 'ko': '다운로드', 'it': 'Scarica',
    'nl': 'Download', 'hi': 'डाउनलोड', 'id': 'Unduh', 'vi': 'Tải xuống'
  },
  dl_meta_chrome: {
    'zh-Hant': '支援 Chrome / Firefox / Edge 自動填入',
    'ja':      'Chrome / Firefox / Edge 自動入力対応',
    'de':      'Unterstützt Chrome- / Firefox- / Edge-Autofill',
    'es':      'Compatible con autocompletado en Chrome / Firefox / Edge',
    'fr':      'Prise en charge de la saisie auto Chrome / Firefox / Edge',
    'pt-BR':   'Suporta autopreencher Chrome / Firefox / Edge',
    'ko':      'Chrome / Firefox / Edge 자동 입력 지원',
    'it':      'Supporto compilazione Chrome / Firefox / Edge',
    'nl':      'Ondersteunt Chrome- / Firefox- / Edge-autofill',
    'hi':      'Chrome / Firefox / Edge ऑटोफ़िल समर्थित',
    'id':      'Mendukung autofill Chrome / Firefox / Edge',
    'vi':      'Hỗ trợ tự điền Chrome / Firefox / Edge'
  },
  dl_meta_safari: {
    'zh-Hant': '支援 Safari 自動填入', 'ja': 'Safari 自動入力対応', 'de': 'Unterstützt Safari-Autofill',
    'es': 'Compatible con autocompletado de Safari', 'fr': 'Prise en charge de la saisie auto Safari',
    'pt-BR': 'Suporta autopreencher do Safari', 'ko': 'Safari 자동 입력 지원',
    'it': 'Supporto compilazione Safari', 'nl': 'Ondersteunt Safari-autofill',
    'hi': 'Safari ऑटोफ़िल समर्थित', 'id': 'Mendukung autofill Safari', 'vi': 'Hỗ trợ tự điền Safari'
  },
  dl_ext_t: {
    'zh-Hant': '瀏覽器擴充功能 + CLI', 'ja': 'ブラウザ拡張 + CLI', 'de': 'Browser-Extensions + CLI',
    'es': 'Extensiones de navegador + CLI', 'fr': 'Extensions navigateur + CLI',
    'pt-BR': 'Extensões de navegador + CLI', 'ko': '브라우저 확장 + CLI',
    'it': 'Estensioni browser + CLI', 'nl': 'Browserextensies + CLI',
    'hi': 'ब्राउज़र एक्सटेंशन + CLI', 'id': 'Ekstensi browser + CLI', 'vi': 'Tiện ích trình duyệt + CLI'
  },
  dl_ext_s: {
    'zh-Hant': '擴充功能透過 native messaging 與桌面應用通訊',
    'ja':      '拡張機能はネイティブメッセージング経由でデスクトップアプリと通信します',
    'de':      'Extensions sprechen via Native Messaging mit der Desktop-App',
    'es':      'Las extensiones se comunican con la app de escritorio mediante native messaging',
    'fr':      'Les extensions communiquent avec l\'app de bureau via le native messaging',
    'pt-BR':   'As extensões se comunicam com o app desktop via native messaging',
    'ko':      '확장 프로그램은 네이티브 메시징을 통해 데스크톱 앱과 통신합니다',
    'it':      'Le estensioni comunicano con l\'app desktop tramite native messaging',
    'nl':      'Extensies praten via native messaging met de desktop-app',
    'hi':      'एक्सटेंशन डेस्कटॉप ऐप से नेटिव मेसेजिंग के माध्यम से बात करते हैं',
    'id':      'Ekstensi berkomunikasi dengan aplikasi desktop lewat native messaging',
    'vi':      'Tiện ích giao tiếp với ứng dụng máy tính qua native messaging'
  },
  dl_chrome_n: { 'zh-Hant': 'Chrome 擴充功能', 'ja': 'Chrome 拡張', 'de': 'Chrome-Extension', 'es': 'Extensión Chrome', 'fr': 'Extension Chrome', 'pt-BR': 'Extensão Chrome', 'ko': 'Chrome 확장', 'it': 'Estensione Chrome', 'nl': 'Chrome-extensie', 'hi': 'Chrome एक्सटेंशन', 'id': 'Ekstensi Chrome', 'vi': 'Tiện ích Chrome' },
  dl_ff_n:     { 'zh-Hant': 'Firefox 擴充功能', 'ja': 'Firefox 拡張', 'de': 'Firefox-Extension', 'es': 'Extensión Firefox', 'fr': 'Extension Firefox', 'pt-BR': 'Extensão Firefox', 'ko': 'Firefox 확장', 'it': 'Estensione Firefox', 'nl': 'Firefox-extensie', 'hi': 'Firefox एक्सटेंशन', 'id': 'Ekstensi Firefox', 'vi': 'Tiện ích Firefox' },
  dl_edge_n:   { 'zh-Hant': 'Edge 擴充功能', 'ja': 'Edge 拡張', 'de': 'Edge-Extension', 'es': 'Extensión Edge', 'fr': 'Extension Edge', 'pt-BR': 'Extensão Edge', 'ko': 'Edge 확장', 'it': 'Estensione Edge', 'nl': 'Edge-extensie', 'hi': 'Edge एक्सटेंशन', 'id': 'Ekstensi Edge', 'vi': 'Tiện ích Edge' },
  dl_cli_n: {
    'zh-Hant': 'CLI 套件', 'ja': 'CLI パッケージ', 'de': 'CLI-Pakete',
    'es': 'Paquetes CLI', 'fr': 'Paquets CLI', 'pt-BR': 'Pacotes CLI',
    'ko': 'CLI 패키지', 'it': 'Pacchetti CLI', 'nl': 'CLI-pakketten',
    'hi': 'CLI पैकेज', 'id': 'Paket CLI', 'vi': 'Gói CLI'
  },
  dl_cli_m: {
    'zh-Hant': '即將隨發行流程提供', 'ja': '今後のリリースワークフローで提供予定',
    'de': 'In Kürze im Release-Workflow', 'es': 'Próximamente en el flujo de release',
    'fr': 'Bientôt dans le flux de release', 'pt-BR': 'Em breve no fluxo de release',
    'ko': '곧 릴리스 워크플로에서 제공', 'it': 'Presto nel workflow di rilascio',
    'nl': 'Binnenkort in de release-workflow', 'hi': 'जल्द ही रिलीज़ वर्कफ़्लो में',
    'id': 'Segera hadir di alur rilis', 'vi': 'Sắp có trong quy trình phát hành'
  },
  dl_cli_btn: {
    'zh-Hant': '查看狀態', 'ja': 'ステータス', 'de': 'Status', 'es': 'Estado',
    'fr': 'Statut', 'pt-BR': 'Status', 'ko': '상태', 'it': 'Stato',
    'nl': 'Status', 'hi': 'स्थिति', 'id': 'Status', 'vi': 'Trạng thái'
  },
  rb_t: {
    'zh-Hant': '需要跨網路遠端同步？',
    'ja':      'ネットワークをまたいだ同期が必要ですか？',
    'de':      'Sync über Netzwerkgrenzen hinweg nötig?',
    'es':      '¿Necesitas sincro remota entre redes?',
    'fr':      'Besoin de synchro à distance entre réseaux ?',
    'pt-BR':   'Precisa de sincro remota entre redes?',
    'ko':      '네트워크 너머의 원격 동기화가 필요하신가요?',
    'it':      'Serve sincronizzazione remota tra reti?',
    'nl':      'Sync nodig over netwerken heen?',
    'hi':      'नेटवर्क्स के बीच रिमोट सिंक चाहिए?',
    'id':      'Butuh sinkronisasi jarak jauh lintas jaringan?',
    'vi':      'Cần đồng bộ từ xa giữa các mạng?'
  },
  rb_d: {
    'zh-Hant': '使用 Relay 節點進行 NAT 穿透。Relay 只轉發加密載荷，無法讀取密碼庫明文。',
    'ja':      'Relay ノードを使って NAT 越えを行います。Relay は暗号化されたペイロードを転送するだけで、保管庫の平文は読めません。',
    'de':      'Nutze einen Relay-Knoten für NAT-Traversal. Der Relay leitet nur verschlüsselte Payloads weiter und liest niemals Klartext.',
    'es':      'Usa un nodo Relay para atravesar NAT. El Relay solo reenvía cargas cifradas y nunca lee texto en claro de la bóveda.',
    'fr':      'Utilisez un nœud Relay pour traverser le NAT. Le Relay ne relaie que des charges chiffrées et ne lit jamais le coffre en clair.',
    'pt-BR':   'Use um nó Relay para travessia NAT. O Relay só encaminha cargas cifradas e nunca lê texto em claro do cofre.',
    'ko':      'NAT 통과를 위해 Relay 노드를 사용하세요. Relay는 암호화된 페이로드만 전달하며 보관함의 평문을 읽지 못합니다.',
    'it':      'Usa un nodo Relay per attraversare il NAT. Il Relay inoltra solo payload cifrati e non legge mai il vault in chiaro.',
    'nl':      'Gebruik een Relay-knooppunt voor NAT-traversal. De Relay stuurt alleen versleutelde payloads door en leest nooit klare kluis-tekst.',
    'hi':      'NAT ट्रैवर्सल के लिए Relay नोड का उपयोग करें। Relay केवल एन्क्रिप्टेड पेलोड फ़ॉरवर्ड करता है, वॉल्ट का प्लेन-टेक्स्ट कभी नहीं पढ़ता।',
    'id':      'Gunakan node Relay untuk traversal NAT. Relay hanya meneruskan payload terenkripsi dan tidak pernah membaca teks polos vault.',
    'vi':      'Dùng nút Relay để vượt NAT. Relay chỉ chuyển tiếp payload đã mã hóa và không bao giờ đọc bản rõ của kho.'
  },
  rb_cta: {
    'zh-Hant': '查看 Relay 指南', 'ja': 'Relay ガイドを見る', 'de': 'Relay-Guide ansehen',
    'es': 'Ver guía de Relay', 'fr': 'Voir le guide Relay', 'pt-BR': 'Ver guia do Relay',
    'ko': 'Relay 가이드 보기', 'it': 'Vedi la guida al Relay', 'nl': 'Bekijk de Relay-gids',
    'hi': 'Relay गाइड देखें', 'id': 'Lihat panduan Relay', 'vi': 'Xem hướng dẫn Relay'
  },
  // Footer
  foot_desc: {
    'zh-Hant': '面向桌面與行動裝置的私有密碼管理器，本地優先儲存、端對端加密。',
    'ja':      'デスクトップとモバイル向けのプライベートなパスワード管理。ローカルファースト保存 + エンドツーエンド暗号化。',
    'de':      'Privater Passwort-Manager für Desktop und Mobil – lokal-first und Ende-zu-Ende verschlüsselt.',
    'es':      'Gestor de contraseñas privado para escritorio y móvil, con almacenamiento local-first y cifrado de extremo a extremo.',
    'fr':      'Gestionnaire de mots de passe privé pour bureau et mobile, stockage local-first et chiffrement de bout en bout.',
    'pt-BR':   'Gerenciador de senhas privado para desktop e móvel, com armazenamento local-first e criptografia ponta a ponta.',
    'ko':      '데스크톱과 모바일을 위한 프라이빗 비밀번호 관리자. 로컬 우선 저장과 종단 간 암호화.',
    'it':      'Password manager privato per desktop e mobile, archiviazione local-first e cifratura end-to-end.',
    'nl':      'Privé wachtwoordmanager voor desktop en mobiel, local-first opslag en end-to-end-encryptie.',
    'hi':      'डेस्कटॉप और मोबाइल के लिए निजी पासवर्ड मैनेजर — लोकल-फर्स्ट स्टोरेज और एंड-टू-एंड एन्क्रिप्शन।',
    'id':      'Pengelola kata sandi privat untuk desktop dan ponsel, penyimpanan local-first, dan enkripsi ujung-ke-ujung.',
    'vi':      'Trình quản lý mật khẩu riêng tư cho máy tính và di động, lưu trữ local-first và mã hóa đầu cuối.'
  },
  foot_product: {
    'zh-Hant': '產品', 'ja': '製品', 'de': 'Produkt', 'es': 'Producto',
    'fr': 'Produit', 'pt-BR': 'Produto', 'ko': '제품', 'it': 'Prodotto',
    'nl': 'Product', 'hi': 'उत्पाद', 'id': 'Produk', 'vi': 'Sản phẩm'
  },
  foot_resources: {
    'zh-Hant': '資源', 'ja': 'リソース', 'de': 'Ressourcen', 'es': 'Recursos',
    'fr': 'Ressources', 'pt-BR': 'Recursos', 'ko': '리소스', 'it': 'Risorse',
    'nl': 'Bronnen', 'hi': 'संसाधन', 'id': 'Sumber daya', 'vi': 'Tài nguyên'
  },
  foot_legal: {
    'zh-Hant': '法律', 'ja': '法的事項', 'de': 'Rechtliches', 'es': 'Legal',
    'fr': 'Mentions légales', 'pt-BR': 'Legal', 'ko': '법적 정보', 'it': 'Legale',
    'nl': 'Juridisch', 'hi': 'कानूनी', 'id': 'Hukum', 'vi': 'Pháp lý'
  },
  foot_cs: {
    'zh-Hant': '校驗碼', 'ja': 'チェックサム', 'de': 'Prüfsummen', 'es': 'Checksums',
    'fr': 'Sommes de contrôle', 'pt-BR': 'Checksums', 'ko': '체크섬', 'it': 'Checksum',
    'nl': 'Checksums', 'hi': 'चेकसम', 'id': 'Checksum', 'vi': 'Mã kiểm tra'
  },
  foot_desktop: {
    'zh-Hant': '桌面安裝包', 'ja': 'デスクトップパッケージ', 'de': 'Desktop-Pakete',
    'es': 'Paquetes de escritorio', 'fr': 'Paquets bureau', 'pt-BR': 'Pacotes desktop',
    'ko': '데스크톱 패키지', 'it': 'Pacchetti desktop', 'nl': 'Desktoppakketten',
    'hi': 'डेस्कटॉप पैकेज', 'id': 'Paket desktop', 'vi': 'Gói máy tính'
  },
  foot_relay: {
    'zh-Hant': 'Relay 安裝包', 'ja': 'Relay パッケージ', 'de': 'Relay-Pakete',
    'es': 'Paquetes Relay', 'fr': 'Paquets Relay', 'pt-BR': 'Pacotes Relay',
    'ko': 'Relay 패키지', 'it': 'Pacchetti Relay', 'nl': 'Relay-pakketten',
    'hi': 'Relay पैकेज', 'id': 'Paket Relay', 'vi': 'Gói Relay'
  },
  foot_privacy: {
    'zh-Hant': '隱私政策', 'ja': 'プライバシーポリシー', 'de': 'Datenschutz',
    'es': 'Política de privacidad', 'fr': 'Politique de confidentialité',
    'pt-BR': 'Política de privacidade', 'ko': '개인정보 처리방침',
    'it': 'Informativa sulla privacy', 'nl': 'Privacybeleid',
    'hi': 'गोपनीयता नीति', 'id': 'Kebijakan privasi', 'vi': 'Chính sách riêng tư'
  },
  foot_contact: {
    'zh-Hant': '聯絡我們', 'ja': 'お問い合わせ', 'de': 'Kontakt', 'es': 'Contacto',
    'fr': 'Contact', 'pt-BR': 'Contato', 'ko': '문의', 'it': 'Contatti',
    'nl': 'Contact', 'hi': 'संपर्क', 'id': 'Kontak', 'vi': 'Liên hệ'
  },
  foot_copy: {
    'zh-Hant': '© 2026 VaultMesh. 保留所有權利。',
    'ja':      '© 2026 VaultMesh. All rights reserved.',
    'de':      '© 2026 VaultMesh. Alle Rechte vorbehalten.',
    'es':      '© 2026 VaultMesh. Todos los derechos reservados.',
    'fr':      '© 2026 VaultMesh. Tous droits réservés.',
    'pt-BR':   '© 2026 VaultMesh. Todos os direitos reservados.',
    'ko':      '© 2026 VaultMesh. 모든 권리 보유.',
    'it':      '© 2026 VaultMesh. Tutti i diritti riservati.',
    'nl':      '© 2026 VaultMesh. Alle rechten voorbehouden.',
    'hi':      '© 2026 VaultMesh. सर्वाधिकार सुरक्षित।',
    'id':      '© 2026 VaultMesh. Hak cipta dilindungi.',
    'vi':      '© 2026 VaultMesh. Bảo lưu mọi quyền.'
  }
};
// hero_primary === nav_cta (filled below)
T.hero_primary = T.nav_cta;

// ---------------------------------------------------------------------------
// Helper: build the language dropdown for a given current locale path
// ---------------------------------------------------------------------------
function buildLangMenu(currentSeg) {
  return ALL_LOCALES.map(([seg, hreflang, native]) => {
    const isCurrent = seg === currentSeg;
    // From <locale>/index.html the link to other locales:
    //   - EN root index.html       → '../index.html'
    //   - other locale dir/index   → '../<seg>/index.html'
    const href = isCurrent
      ? 'index.html'
      : seg === ''
        ? '../index.html'
        : `../${seg}/index.html`;
    const cur = isCurrent ? ' is-current" aria-current="true' : '';
    return `      <li><a href="${href}" role="menuitem" hreflang="${hreflang}" data-lang-switch="${seg || 'en'}" lang="${hreflang}" class="lang-option${cur}">${native}</a></li>`;
  }).join('\n');
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------
function pageHtml(seg, htmlLang, nativeName) {
  const t = (key) => {
    const v = T[key]?.[seg];
    if (v == null) throw new Error(`Missing translation: ${key} / ${seg}`);
    return v;
  };

  const langMenu = buildLangMenu(seg);

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('title')}</title>
  <meta name="description" content="${t('meta')}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Fraunces:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

<nav class="site-nav">
  <a class="nav-brand" href="index.html">
    <img src="../img/vaultmesh-app-icon.png" alt="" class="nav-brand-icon-img" aria-hidden="true">
    <span class="nav-brand-name">VaultMesh</span>
  </a>
  <ul class="nav-links">
    <li><a href="#features">${t('nav_features')}</a></li>
    <li><a href="#how-it-works">${t('nav_how')}</a></li>
    <li><a href="#download">${t('nav_download')}</a></li>
    <li><a href="../relay.html">${t('nav_relay')}</a></li>
    <li><a href="../blog/">Blog</a></li>
    <li class="lang-dropdown">
      <button type="button" class="lang-toggle" aria-haspopup="true" aria-expanded="false">
        <span class="lang-current">${nativeName}</span>
        <svg class="lang-caret" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3.5l3 3 3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <ul class="lang-menu" role="menu" hidden>
${langMenu}
      </ul>
    </li>
    <li><a href="#download" class="nav-cta">${t('nav_cta')}</a></li>
  </ul>
</nav>

<section class="hero">
  <div class="hero-badge">${t('hero_badge')}</div>
  <h1>${t('hero_h1_1')}<br><em>${t('hero_h1_em')}</em><br>${t('hero_h1_3')}</h1>
  <p class="hero-desc">
    ${t('hero_desc')}
  </p>
  <div class="hero-actions">
    <a href="#download" class="btn-primary">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ${t('hero_primary')}
    </a>
    <a href="#how-it-works" class="btn-secondary">${t('hero_secondary')}</a>
  </div>
  <div class="hero-stats">
    <div class="stat-item">
      <span class="stat-label">${t('stat_enc')}</span>
      <span class="stat-value">XChaCha20-Poly1305</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">${t('stat_kdf')}</span>
      <span class="stat-value">Argon2id</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">${t('stat_kex')}</span>
      <span class="stat-value">X25519 + SPAKE2</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">${t('stat_platform')}</span>
      <span class="stat-value">iOS · Android · Mac · Win · Linux</span>
    </div>
  </div>
</section>

<div class="divider"></div>

<section class="section showcase-section" id="showcase">
  <div class="section-label">${t('sc_label')}</div>
  <h2 class="section-title">${t('sc_title_1')}<br>${t('sc_title_2')}</h2>
  <p class="section-sub">${t('sc_sub')}</p>

  <div class="showcase-tabs" role="tablist" aria-label="${t('sc_label')}">
    <button class="showcase-tab active" role="tab" aria-selected="true"
            aria-controls="showcase-panel-pairing" id="showcase-tab-pairing" data-tab="pairing">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="4" cy="7" r="2.5" stroke="currentColor" stroke-width="1.3"/>
        <circle cx="10" cy="3" r="2.5" stroke="currentColor" stroke-width="1.3"/>
        <circle cx="10" cy="11" r="2.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M6.5 7h1M6.3 5.4l1-.8M6.3 8.6l1 .8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      ${t('tab_pair')}
    </button>
    <button class="showcase-tab" role="tab" aria-selected="false"
            aria-controls="showcase-panel-sync" id="showcase-tab-sync" data-tab="sync">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 7a5 5 0 0 1 9.5-2.2M12 7a5 5 0 0 1-9.5 2.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M11.5 2l.5 2.8-2.7-.5M2.5 12l-.5-2.8 2.7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      ${t('tab_sync')}
    </button>
    <button class="showcase-tab" role="tab" aria-selected="false"
            aria-controls="showcase-panel-autofill" id="showcase-tab-autofill" data-tab="autofill">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M3 1.5h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M4 7.5h2.5M4 9.5h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="10.5" cy="8.5" r="1.5" fill="currentColor" opacity=".35"/>
      </svg>
      ${t('tab_auto')}
    </button>
  </div>

  <div class="showcase-progress" aria-hidden="true">
    <div class="showcase-progress-bar"></div>
  </div>

  <div class="showcase-canvas">

    <div class="showcase-panel active" id="showcase-panel-pairing"
         role="tabpanel" aria-labelledby="showcase-tab-pairing">
      <svg class="showcase-svg" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="240" cy="235" rx="200" ry="190" fill="#dbe9ff" opacity="0.35"/>

        <line class="pair-line pair-line-1" x1="240" y1="80" x2="68" y2="226"
              stroke="#3f8efc" stroke-width="1.5" stroke-dasharray="1 0"
              pathLength="1" stroke-dashoffset="1"/>
        <line class="pair-line pair-line-2" x1="240" y1="80" x2="374" y2="211"
              stroke="#3f8efc" stroke-width="1.5" stroke-dasharray="1 0"
              pathLength="1" stroke-dashoffset="1"/>
        <line class="pair-line pair-line-3" x1="240" y1="80" x2="237" y2="387"
              stroke="#3f8efc" stroke-width="1.5" stroke-dasharray="1 0"
              pathLength="1" stroke-dashoffset="1"/>
        <line class="pair-line pair-line-4" x1="68" y1="226" x2="374" y2="211"
              stroke="#3f8efc" stroke-width="1.5" stroke-dasharray="1 0"
              pathLength="1" stroke-dashoffset="1"/>
        <line class="pair-line pair-line-5" x1="68" y1="226" x2="237" y2="387"
              stroke="#3f8efc" stroke-width="1.5" stroke-dasharray="1 0"
              pathLength="1" stroke-dashoffset="1"/>
        <line class="pair-line pair-line-6" x1="374" y1="211" x2="237" y2="387"
              stroke="#3f8efc" stroke-width="1.5" stroke-dasharray="1 0"
              pathLength="1" stroke-dashoffset="1"/>

        <g transform="translate(185,45)">
          <rect x="0" y="0" width="110" height="70" rx="5" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1.5"/>
          <rect x="5" y="5" width="100" height="60" rx="3" fill="#e8f1ff"/>
          <circle cx="13" cy="13" r="3" fill="#c6d9f1"/>
          <circle cx="23" cy="13" r="3" fill="#c6d9f1"/>
          <circle cx="33" cy="13" r="3" fill="#c6d9f1"/>
          <rect x="-8" y="70" width="126" height="7" rx="3" fill="#e8f1ff" stroke="#c6d9f1" stroke-width="1.5"/>
        </g>
        <g class="pair-badge pair-badge-1" transform="translate(207,127)" opacity="0">
          <rect x="0" y="0" width="66" height="20" rx="10" fill="#2f78e6"/>
          <path d="M8 10l3 3 5-6" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <text x="20" y="14" font-family="DM Mono, monospace" font-size="9" fill="white" letter-spacing="0.04em">Paired</text>
        </g>

        <g transform="translate(46,188)">
          <rect x="0" y="0" width="44" height="76" rx="7" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1.5"/>
          <rect x="4" y="10" width="36" height="52" rx="3" fill="#e8f1ff"/>
          <rect x="14" y="66" width="16" height="3" rx="1.5" fill="#c6d9f1"/>
          <rect x="16" y="4" width="12" height="3" rx="1.5" fill="#c6d9f1"/>
        </g>
        <g class="pair-badge pair-badge-2" transform="translate(24,276)" opacity="0">
          <rect x="0" y="0" width="66" height="20" rx="10" fill="#2f78e6"/>
          <path d="M8 10l3 3 5-6" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <text x="20" y="14" font-family="DM Mono, monospace" font-size="9" fill="white" letter-spacing="0.04em">Paired</text>
        </g>

        <g transform="translate(338,185)">
          <rect x="0" y="0" width="72" height="52" rx="5" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1.5"/>
          <rect x="4" y="4" width="64" height="40" rx="3" fill="#e8f1ff"/>
          <rect x="28" y="52" width="16" height="10" rx="2" fill="#e8f1ff" stroke="#c6d9f1" stroke-width="1.5"/>
          <rect x="20" y="62" width="32" height="5" rx="2" fill="#e8f1ff" stroke="#c6d9f1" stroke-width="1.5"/>
        </g>
        <g class="pair-badge pair-badge-3" transform="translate(330,258)" opacity="0">
          <rect x="0" y="0" width="66" height="20" rx="10" fill="#2f78e6"/>
          <path d="M8 10l3 3 5-6" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <text x="20" y="14" font-family="DM Mono, monospace" font-size="9" fill="white" letter-spacing="0.04em">Paired</text>
        </g>

        <g transform="translate(192,355)">
          <rect x="0" y="0" width="90" height="64" rx="8" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1.5"/>
          <rect x="5" y="5" width="78" height="54" rx="4" fill="#e8f1ff"/>
          <rect x="83" y="27" width="5" height="10" rx="2.5" fill="#c6d9f1"/>
          <circle cx="3" cy="32" r="2" fill="#c6d9f1"/>
        </g>
        <g class="pair-badge pair-badge-4" transform="translate(205,428)" opacity="0">
          <rect x="0" y="0" width="66" height="20" rx="10" fill="#2f78e6"/>
          <path d="M8 10l3 3 5-6" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <text x="20" y="14" font-family="DM Mono, monospace" font-size="9" fill="white" letter-spacing="0.04em">Paired</text>
        </g>

        <g class="pair-p2p-label" transform="translate(197,222)" opacity="0">
          <rect x="0" y="0" width="86" height="20" rx="10" fill="#e8f1ff" stroke="#2f78e6" stroke-width="1"/>
          <text x="43" y="14" font-family="DM Mono, monospace" font-size="9" fill="#2f78e6"
                text-anchor="middle" letter-spacing="0.04em">P2P Mesh</text>
        </g>

        <g class="pair-shield" transform="translate(215,200)">
          <path d="M25 4 L46 13 L46 28 C46 39 25 48 25 48 C25 48 4 39 4 28 L4 13 Z"
                fill="#2f78e6" opacity="0.15" stroke="#2f78e6" stroke-width="1.5"/>
          <rect x="17" y="26" width="16" height="12" rx="3" fill="#2f78e6"/>
          <path d="M20 26 L20 22 C20 18.7 30 18.7 30 22 L30 26"
                stroke="#2f78e6" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="25" cy="31" r="2.5" fill="white" opacity="0.8"/>
          <rect x="23.5" y="31" width="3" height="4" rx="1" fill="white" opacity="0.8"/>
        </g>
      </svg>
      <div class="showcase-caption">
        <strong>${t('cap_pair_strong')}</strong> — ${t('cap_pair_body')}
      </div>
    </div>

    <div class="showcase-panel" id="showcase-panel-sync"
         role="tabpanel" aria-labelledby="showcase-tab-sync" hidden>
      <svg class="showcase-svg" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="240" cy="240" rx="180" ry="130" fill="#dbe9ff" opacity="0.4"/>

        <g transform="translate(60,185)">
          <rect x="0" y="0" width="60" height="104" rx="9" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1.5"/>
          <rect x="5" y="14" width="50" height="72" rx="4" fill="#e8f1ff"/>
          <rect x="20" y="90" width="20" height="4" rx="2" fill="#c6d9f1"/>
          <rect x="22" y="5" width="16" height="4" rx="2" fill="#c6d9f1"/>
          <rect x="22" y="34" width="16" height="14" rx="3" fill="#3f8efc" opacity="0.3"/>
          <path d="M26 34 L26 31 C26 28.7 34 28.7 34 31 L34 34" stroke="#3f8efc" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.7"/>
        </g>

        <g transform="translate(320,162)">
          <rect x="0" y="0" width="110" height="70" rx="5" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1.5"/>
          <rect x="5" y="5" width="100" height="60" rx="3" fill="#e8f1ff"/>
          <circle cx="13" cy="13" r="3" fill="#c6d9f1"/>
          <circle cx="23" cy="13" r="3" fill="#c6d9f1"/>
          <circle cx="33" cy="13" r="3" fill="#c6d9f1"/>
          <rect x="46" y="28" width="18" height="16" rx="3" fill="#3f8efc" opacity="0.3"/>
          <path d="M50 28 L50 24 C50 21.3 60 21.3 60 24 L60 28" stroke="#3f8efc" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.7"/>
          <rect x="-8" y="70" width="126" height="7" rx="3" fill="#e8f1ff" stroke="#c6d9f1" stroke-width="1.5"/>
        </g>

        <rect class="sync-channel" x="122" y="222" width="196" height="30" rx="15"
              fill="#e8f1ff" stroke="#3f8efc" stroke-width="1" opacity="0"/>
        <g class="sync-p2p-label" opacity="0">
          <rect x="182" y="228" width="116" height="18" rx="9" fill="#2f78e6"/>
          <text x="240" y="241" font-family="DM Mono, monospace" font-size="9" fill="white"
                text-anchor="middle" letter-spacing="0.04em">Direct P2P</text>
        </g>

        <g class="sync-relay-path" opacity="0">
          <line x1="120" y1="256" x2="120" y2="320" stroke="#c6d9f1" stroke-width="1" stroke-dasharray="3 3"/>
          <line x1="320" y1="232" x2="320" y2="320" stroke="#c6d9f1" stroke-width="1" stroke-dasharray="3 3"/>
          <line x1="120" y1="320" x2="320" y2="320" stroke="#c6d9f1" stroke-width="1.5" stroke-dasharray="4 3"/>
          <rect x="210" y="309" width="60" height="22" rx="5" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1"/>
          <text x="240" y="324" font-family="DM Mono, monospace" font-size="8" fill="#6f8fb5"
                text-anchor="middle" letter-spacing="0.03em">Relay</text>
          <text x="240" y="350" font-family="DM Sans, sans-serif" font-size="8" fill="#6f8fb5"
                text-anchor="middle" opacity="0.7">optional</text>
        </g>

        <g class="sync-packet sync-packet-ltr-a">
          <rect x="0" y="0" width="30" height="18" rx="4" fill="#2f78e6"/>
          <path d="M8 9 l4 4 6-7" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <rect x="19" y="5" width="7" height="8" rx="1.5" fill="white" opacity="0.3"/>
        </g>
        <g class="sync-packet sync-packet-ltr-b">
          <rect x="0" y="0" width="30" height="18" rx="4" fill="#2f78e6"/>
          <path d="M8 9 l4 4 6-7" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <rect x="19" y="5" width="7" height="8" rx="1.5" fill="white" opacity="0.3"/>
        </g>
        <g class="sync-packet sync-packet-rtl-a">
          <rect x="0" y="0" width="30" height="18" rx="4" fill="#3f8efc" opacity="0.85"/>
          <path d="M8 9 l4 4 6-7" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <rect x="19" y="5" width="7" height="8" rx="1.5" fill="white" opacity="0.3"/>
        </g>
        <g class="sync-packet sync-packet-rtl-b">
          <rect x="0" y="0" width="30" height="18" rx="4" fill="#3f8efc" opacity="0.85"/>
          <path d="M8 9 l4 4 6-7" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <rect x="19" y="5" width="7" height="8" rx="1.5" fill="white" opacity="0.3"/>
        </g>

        <g class="sync-label-center" opacity="0">
          <rect x="176" y="264" width="128" height="20" rx="10" fill="#e8f1ff" stroke="#c6d9f1" stroke-width="1"/>
          <text x="240" y="278" font-family="DM Mono, monospace" font-size="9" fill="#3f6490"
                text-anchor="middle" letter-spacing="0.04em">E2E Encrypted</text>
        </g>
      </svg>
      <div class="showcase-caption">
        <strong>${t('cap_sync_strong')}</strong> — ${t('cap_sync_body')}
      </div>
    </div>

    <div class="showcase-panel" id="showcase-panel-autofill"
         role="tabpanel" aria-labelledby="showcase-tab-autofill" hidden>
      <svg class="showcase-svg" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-popup" x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow dx="0" dy="-4" stdDeviation="8" flood-color="#1b3f6d" flood-opacity="0.12"/>
          </filter>
          <clipPath id="clip-user">
            <rect class="autofill-clip-user" x="76" y="92" width="0" height="28"/>
          </clipPath>
        </defs>

        <g transform="translate(80,60)">
          <rect x="0" y="0" width="320" height="280" rx="10" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1.5"/>
          <rect x="0" y="0" width="320" height="34" rx="10" fill="#e8f1ff"/>
          <rect x="0" y="24" width="320" height="10" fill="#e8f1ff"/>
          <circle cx="18" cy="17" r="5" fill="#ff6b6b" opacity="0.7"/>
          <circle cx="34" cy="17" r="5" fill="#ffd93d" opacity="0.7"/>
          <circle cx="50" cy="17" r="5" fill="#6bcb77" opacity="0.7"/>
          <rect x="68" y="9" width="200" height="16" rx="4" fill="#dbe9ff" stroke="#c6d9f1" stroke-width="1"/>
          <text x="168" y="21" font-family="DM Mono, monospace" font-size="9" fill="#6f8fb5" text-anchor="middle">vaultmesh.app/login</text>
          <line x1="0" y1="34" x2="320" y2="34" stroke="#c6d9f1" stroke-width="1"/>

          <rect x="60" y="54" width="200" height="170" rx="8" fill="white" stroke="#c6d9f1" stroke-width="1"/>
          <text x="160" y="82" font-family="DM Sans, sans-serif" font-size="13" font-weight="600" fill="#1b3f6d" text-anchor="middle">Sign in</text>

          <rect x="76" y="92" width="168" height="28" rx="5" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1"/>
          <text x="84" y="103" font-family="DM Sans, sans-serif" font-size="8" fill="#6f8fb5">Username</text>
          <text class="autofill-text-user" x="84" y="115" font-family="DM Mono, monospace" font-size="9" fill="#1b3f6d" clip-path="url(#clip-user)">jon@example.com</text>
          <rect class="autofill-sweep-user" x="76" y="92" width="168" height="28" rx="5" fill="#3f8efc" opacity="0"/>

          <rect x="76" y="130" width="168" height="28" rx="5" fill="#f2f7ff" stroke="#c6d9f1" stroke-width="1"/>
          <text x="84" y="141" font-family="DM Sans, sans-serif" font-size="8" fill="#6f8fb5">Password</text>
          <g class="autofill-pwd-dots" opacity="0">
            <circle cx="89"  cy="149" r="3" fill="#1b3f6d"/>
            <circle cx="98"  cy="149" r="3" fill="#1b3f6d"/>
            <circle cx="107" cy="149" r="3" fill="#1b3f6d"/>
            <circle cx="116" cy="149" r="3" fill="#1b3f6d"/>
            <circle cx="125" cy="149" r="3" fill="#1b3f6d"/>
            <circle cx="134" cy="149" r="3" fill="#1b3f6d"/>
            <circle cx="143" cy="149" r="3" fill="#1b3f6d"/>
            <circle cx="152" cy="149" r="3" fill="#1b3f6d"/>
          </g>
          <rect class="autofill-sweep-pwd" x="76" y="130" width="168" height="28" rx="5" fill="#3f8efc" opacity="0"/>

          <rect class="autofill-btn-pulse" x="76" y="170" width="168" height="32" rx="6" fill="#2f78e6"/>
          <text x="160" y="191" font-family="DM Sans, sans-serif" font-size="11" font-weight="500" fill="white" text-anchor="middle">Sign In</text>
        </g>

        <g class="autofill-popup" transform="translate(80,420)">
          <rect x="0" y="0" width="320" height="72" rx="10" fill="white" stroke="#c6d9f1" stroke-width="1.5"
                filter="url(#shadow-popup)"/>
          <rect x="0" y="0" width="320" height="4" rx="2" fill="#2f78e6"/>
          <rect x="14" y="14" width="28" height="28" rx="6" fill="#2f78e6" opacity="0.12"/>
          <path d="M28 18 L35 21 L35 28 C35 32 28 36 28 36 C28 36 21 32 21 28 L21 21 Z" fill="#2f78e6" opacity="0.7"/>
          <text x="50" y="26" font-family="DM Mono, monospace" font-size="10" font-weight="500" fill="#1b3f6d">VaultMesh</text>
          <text x="50" y="40" font-family="DM Sans, sans-serif" font-size="9" fill="#6f8fb5">Fill credentials for vaultmesh.app?</text>
          <rect x="240" y="20" width="64" height="26" rx="5" fill="#2f78e6"/>
          <text x="272" y="37" font-family="DM Sans, sans-serif" font-size="9" font-weight="500" fill="white" text-anchor="middle">Autofill</text>
        </g>
      </svg>
      <div class="showcase-caption">
        <strong>${t('cap_auto_strong')}</strong> — ${t('cap_auto_body')}
      </div>
    </div>

  </div>
</section>

<div class="divider"></div>

<section class="section" id="features">
  <div class="section-label">${t('ft_label')}</div>
  <h2 class="section-title">${t('ft_title_1')}<br>${t('ft_title_2')}</h2>
  <p class="section-sub">${t('ft_sub')}</p>

  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M6 9l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="feature-title">${t('ft_zk_t')}</div>
      <div class="feature-desc">${t('ft_zk_d')}</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M6 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.5"/></svg></div>
      <div class="feature-title">${t('ft_local_t')}</div>
      <div class="feature-desc">${t('ft_local_d')}</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 9a6 6 0 1 1 12 0A6 6 0 0 1 3 9z" stroke="currentColor" stroke-width="1.5"/><path d="M9 6v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
      <div class="feature-title">${t('ft_cf_t')}</div>
      <div class="feature-desc">${t('ft_cf_d')}</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg></div>
      <div class="feature-title">${t('ft_indep_t')}</div>
      <div class="feature-desc">${t('ft_indep_d')}</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 2l2.5 5H17l-4 3.5 1.5 5.5L9 13l-5.5 3L5 10.5 1 7h5.5L9 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></div>
      <div class="feature-title">${t('ft_pair_t')}</div>
      <div class="feature-desc">${t('ft_pair_d')}</div>
    </div>
    <div class="feature-card">
      <div class="feature-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
      <div class="feature-title">${t('ft_ext_t')}</div>
      <div class="feature-desc">${t('ft_ext_d')}</div>
    </div>
  </div>
</section>

<div class="divider"></div>

<section class="section" id="how-it-works">
  <div class="section-label">${t('hw_label')}</div>
  <h2 class="section-title">${t('hw_title_1')}<br>${t('hw_title_2')}</h2>
  <p class="section-sub">${t('hw_sub')}</p>

  <div class="steps-wrapper">
    <div class="step-card"><div class="step-num">01</div><div class="step-title">${t('hw_s1_t')}</div><div class="step-desc">${t('hw_s1_d')}</div></div>
    <div class="step-card"><div class="step-num">02</div><div class="step-title">${t('hw_s2_t')}</div><div class="step-desc">${t('hw_s2_d')}</div></div>
    <div class="step-card"><div class="step-num">03</div><div class="step-title">${t('hw_s3_t')}</div><div class="step-desc">${t('hw_s3_d')}</div></div>
    <div class="step-card"><div class="step-num">04</div><div class="step-title">${t('hw_s4_t')}</div><div class="step-desc">${t('hw_s4_d')}</div></div>
  </div>
</section>

<div class="divider"></div>

<section class="section" id="download">
  <div class="section-label">${t('dl_label')}</div>
  <h2 class="section-title">${t('dl_title_1')}<br>${t('dl_title_2')}</h2>
  <p class="section-sub">${t('dl_sub')}</p>

  <div class="download-wrapper">
    <div class="dl-group dl-group-mobile">
      <div class="dl-group-header">
        <div class="dl-group-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="4" y="1" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="12" r="1" fill="currentColor"/></svg></div>
        <div>
          <div class="dl-group-title">${t('dl_mob_t')}</div>
          <div class="dl-group-sub">${t('dl_mob_s')}</div>
        </div>
      </div>
      <div class="mobile-row">
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">${t('dl_ios_n')}</div><div class="dl-item-meta">Apple App Store</div></div>
          <a href="https://apps.apple.com/app/vaultmesh/id6761998890" class="dl-btn">App Store</a>
        </div>
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">${t('dl_and_n')}</div><div class="dl-item-meta">${t('dl_and_m')}</div></div>
          <a href="#download" class="dl-btn">${t('dl_and_btn')}</a>
        </div>
      </div>
    </div>

    <div class="dl-group">
      <div class="dl-group-header">
        <div class="dl-group-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1" y="2" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 14h6M8 11v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
        <div>
          <div class="dl-group-title">${t('dl_dt_t')}</div>
          <div class="dl-group-sub">${t('dl_dt_s')}</div>
        </div>
      </div>
      <div class="dl-list">
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">Windows</div><div class="dl-item-meta">${t('dl_meta_chrome')}</div></div>
          <a href="../downloads/desktop/windows-VaultMesh_1.0.0_x64-setup.exe" class="dl-btn">${t('dl_btn_dl')}</a>
        </div>
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">macOS App Store</div><div class="dl-item-meta">${t('dl_meta_safari')}</div></div>
          <a href="https://apps.apple.com/app/vaultmesh/id6761998890" class="dl-btn">App Store</a>
        </div>
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">macOS Universal DMG</div><div class="dl-item-meta">${t('dl_meta_chrome')}</div></div>
          <a href="../downloads/desktop/macos-universal-VaultMesh_1.1.7_universal.dmg" class="dl-btn">${t('dl_btn_dl')}</a>
        </div>
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">Linux</div><div class="dl-item-meta">${t('dl_meta_chrome')}</div></div>
          <a href="../downloads/desktop/linux-VaultMesh_1.1.7_amd64.AppImage" class="dl-btn">${t('dl_btn_dl')}</a>
        </div>
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">Linux (.deb)</div><div class="dl-item-meta">${t('dl_meta_chrome')}</div></div>
          <a href="../downloads/desktop/linux-VaultMesh_1.1.7_amd64.deb" class="dl-btn">${t('dl_btn_dl')}</a>
        </div>
      </div>
    </div>

    <div class="dl-group">
      <div class="dl-group-header">
        <div class="dl-group-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div>
        <div>
          <div class="dl-group-title">${t('dl_ext_t')}</div>
          <div class="dl-group-sub">${t('dl_ext_s')}</div>
        </div>
      </div>
      <div class="dl-list">
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">${t('dl_chrome_n')}</div><div class="dl-item-meta">Chrome Web Store</div></div>
          <a href="https://chrome.google.com/webstore/detail/kjclabfepakhhbakbookhbfokimkjbec" class="dl-btn">Chrome</a>
        </div>
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">${t('dl_ff_n')}</div><div class="dl-item-meta">Firefox Add-ons</div></div>
          <a href="https://addons.mozilla.org/addon/vaultmesh/" class="dl-btn">Firefox</a>
        </div>
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">${t('dl_edge_n')}</div><div class="dl-item-meta">Microsoft Edge Add-ons</div></div>
          <a href="https://microsoftedge.microsoft.com/addons/detail/vaultmesh/jfldligmihojmcmbnojjljhgdnfkecfm" class="dl-btn">Edge</a>
        </div>
        <div class="dl-item">
          <div class="dl-item-info"><div class="dl-item-name">${t('dl_cli_n')}</div><div class="dl-item-meta">${t('dl_cli_m')}</div></div>
          <a href="../downloads/cli/" class="dl-btn">${t('dl_cli_btn')}</a>
        </div>
      </div>
    </div>

    <div style="grid-column: 1 / -1;">
      <div class="relay-banner">
        <div class="relay-banner-text">
          <h3>${t('rb_t')}</h3>
          <p>${t('rb_d')}</p>
        </div>
        <a href="../relay.html" class="btn-primary">${t('rb_cta')}</a>
      </div>
    </div>
  </div>

  <div style="margin-top: 20px; text-align: right;">
    <a href="../downloads/checksums.txt" class="mono-link">checksums.txt</a>
  </div>
</section>

<footer class="site-footer">
  <div class="footer-inner">
    <div>
      <div class="footer-brand-name">VaultMesh</div>
      <div class="footer-brand-desc">${t('foot_desc')}</div>
      <div class="crypto-chips">
        <span class="chip">Argon2id</span>
        <span class="chip">XChaCha20</span>
        <span class="chip">X25519</span>
        <span class="chip">Ed25519</span>
      </div>
    </div>
    <div>
      <div class="footer-col-title">${t('foot_product')}</div>
      <ul class="footer-links">
        <li><a href="#features">${t('nav_features')}</a></li>
        <li><a href="#how-it-works">${t('nav_how')}</a></li>
        <li><a href="#download">${t('nav_download')}</a></li>
        <li><a href="../relay.html">${t('nav_relay')}</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">${t('foot_resources')}</div>
      <ul class="footer-links">
        <li><a href="../blog/">Blog</a></li>
        <li><a href="../downloads/checksums.txt">${t('foot_cs')}</a></li>
        <li><a href="../downloads/desktop/">${t('foot_desktop')}</a></li>
        <li><a href="../downloads/relay/">${t('foot_relay')}</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-col-title">${t('foot_legal')}</div>
      <ul class="footer-links">
        <li><a href="../privacy.html">${t('foot_privacy')}</a></li>
        <li><a href="mailto:vaultmesh.support@gmail.com">${t('foot_contact')}</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span class="footer-copy">${t('foot_copy')}</span>
    <span class="footer-copy"><a href="mailto:vaultmesh.support@gmail.com" style="color:inherit;text-decoration:none;">vaultmesh.support@gmail.com</a></span>
  </div>
</footer>

<script>
(function () {
  'use strict';
  var CYCLE_MS = 4000;
  var tabs = Array.from(document.querySelectorAll('.showcase-tab'));
  var panels = Array.from(document.querySelectorAll('.showcase-panel'));
  var progressBar = document.querySelector('.showcase-progress-bar');
  var cycleTimer = null;
  var currentIdx = 0;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function activateTab(idx) {
    tabs.forEach(function (tab, i) { var on = i === idx; tab.classList.toggle('active', on); tab.setAttribute('aria-selected', on ? 'true' : 'false'); });
    panels.forEach(function (panel, i) { var on = i === idx; panel.classList.toggle('active', on); if (on) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', ''); });
    currentIdx = idx;
    if (!prefersReducedMotion && progressBar) { progressBar.classList.remove('is-cycling'); void progressBar.offsetWidth; progressBar.classList.add('is-cycling'); }
  }
  function startCycle() { if (prefersReducedMotion) return; clearInterval(cycleTimer); cycleTimer = setInterval(function () { activateTab((currentIdx + 1) % tabs.length); }, CYCLE_MS); }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(i); startCycle(); });
    tab.addEventListener('keydown', function (e) {
      var n = -1;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft')  n = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End')  n = tabs.length - 1;
      if (n >= 0) { e.preventDefault(); activateTab(n); tabs[n].focus(); startCycle(); }
    });
  });
  var canvas = document.querySelector('.showcase-canvas');
  if (canvas) { canvas.addEventListener('mouseenter', function () { clearInterval(cycleTimer); }); canvas.addEventListener('mouseleave', startCycle); }
  activateTab(0); startCycle();
})();
</script>

<script>
(function () {
  try {
    var toggle = document.querySelector('.lang-toggle');
    var menu = document.querySelector('.lang-menu');
    if (toggle && menu) {
      function close() { toggle.setAttribute('aria-expanded', 'false'); menu.hidden = true; }
      function open() { toggle.setAttribute('aria-expanded', 'true'); menu.hidden = false; }
      toggle.addEventListener('click', function (e) { e.stopPropagation(); (menu.hidden ? open : close)(); });
      document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target) && e.target !== toggle) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { close(); toggle.focus(); } });
    }
    document.querySelectorAll('[data-lang-switch]').forEach(function (a) {
      a.addEventListener('click', function () {
        try { localStorage.setItem('vm-lang', a.getAttribute('data-lang-switch')); } catch (e) {}
      });
    });
  } catch (e) {}
})();
</script>

</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Write all locale files
// ---------------------------------------------------------------------------
let written = 0;
for (const [seg, htmlLang, native] of LOCALES) {
  const dir = resolve(ROOT, seg);
  mkdirSync(dir, { recursive: true });
  const html = pageHtml(seg, htmlLang, native);
  writeFileSync(resolve(dir, 'index.html'), html, 'utf8');
  console.log(`wrote ${seg}/index.html (${html.length} bytes)`);
  written++;
}
console.log(`\n${written} locale page(s) written.`);
