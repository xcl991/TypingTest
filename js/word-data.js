/**
 * Word Data for KeyTyping
 * Contains words in multiple languages and difficulty levels
 */

const WORD_DATA = {
    // Indonesian Words
    id: {
        easy: [
            'dan', 'di', 'ini', 'itu', 'yang', 'untuk', 'pada', 'dengan', 'ada', 'dari',
            'ke', 'akan', 'tidak', 'juga', 'bisa', 'atau', 'lebih', 'saya', 'kami', 'kita',
            'anda', 'dia', 'mereka', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh',
            'apa', 'siapa', 'kapan', 'mana', 'bagaimana', 'baru', 'baik', 'besar', 'kecil', 'lama',
            'makan', 'minum', 'tidur', 'jalan', 'duduk', 'berdiri', 'pergi', 'datang', 'pulang', 'kerja',
            'rumah', 'sekolah', 'kantor', 'toko', 'pasar', 'jalan', 'mobil', 'motor', 'bus', 'kereta',
            'ayah', 'ibu', 'kakak', 'adik', 'anak', 'cucu', 'paman', 'bibi', 'nenek', 'kakek',
            'pagi', 'siang', 'sore', 'malam', 'hari', 'minggu', 'bulan', 'tahun', 'jam', 'menit',
            'merah', 'biru', 'hijau', 'kuning', 'putih', 'hitam', 'coklat', 'ungu', 'pink', 'abu',
            'suka', 'cinta', 'senang', 'sedih', 'marah', 'takut', 'berani', 'malu', 'bangga', 'lelah'
        ],
        medium: [
            'meskipun', 'walaupun', 'namun', 'tetapi', 'karena', 'sebab', 'akibat', 'oleh', 'untuk', 'supaya',
            'pekerjaan', 'pendidikan', 'kesehatan', 'keluarga', 'masyarakat', 'pemerintah', 'pembangunan', 'ekonomi', 'politik', 'budaya',
            'teknologi', 'komputer', 'internet', 'telepon', 'aplikasi', 'program', 'sistem', 'jaringan', 'data', 'informasi',
            'mengetik', 'menulis', 'membaca', 'berbicara', 'mendengar', 'melihat', 'merasakan', 'menyentuh', 'mencium', 'mengecap',
            'kemudian', 'selanjutnya', 'sebelumnya', 'pertama', 'kedua', 'terakhir', 'akhirnya', 'mulanya', 'awalnya', 'seterusnya',
            'perjalanan', 'petualangan', 'pengalaman', 'pelajaran', 'pengetahuan', 'keterampilan', 'kemampuan', 'keahlian', 'prestasi', 'pencapaian',
            'membangun', 'mengembangkan', 'meningkatkan', 'memperbaiki', 'mengubah', 'menyesuaikan', 'menyiapkan', 'menyelesaikan', 'mengatasi', 'menghadapi',
            'komunikasi', 'organisasi', 'administrasi', 'manajemen', 'perencanaan', 'pelaksanaan', 'pengawasan', 'evaluasi', 'koordinasi', 'kerjasama',
            'professional', 'produktif', 'efektif', 'efisien', 'kreatif', 'inovatif', 'kompetitif', 'responsif', 'adaptif', 'proaktif',
            'berkembang', 'bertumbuh', 'berubah', 'berinovasi', 'berkreasi', 'berprestasi', 'bersaing', 'bekerjasama', 'berkomunikasi', 'berinteraksi'
        ],
        hard: [
            'implementasi', 'transformasi', 'optimalisasi', 'standardisasi', 'sinkronisasi', 'harmonisasi', 'digitalisasi', 'modernisasi', 'globalisasi', 'industrialisasi',
            'infrastruktur', 'suprastruktur', 'mikrostruktur', 'makrostruktur', 'ultrastruktur', 'arsitektur', 'manufaktur', 'agrikultur', 'aquakultur', 'silvicultur',
            'kontekstualisasi', 'konseptualisasi', 'operasionalisasi', 'institusionalisasi', 'profesionalisasi', 'desentralisasi', 'demokratisasi', 'liberalisasi', 'privatisasi', 'nasionalisasi',
            'bertanggungjawab', 'berkesinambungan', 'berkelanjutan', 'berkeadilan', 'berketahanan', 'berkepribadian', 'berkemampuan', 'berpengetahuan', 'berpengalaman', 'berkompetensi',
            'pengembangan', 'pemberdayaan', 'peningkatan', 'penguatan', 'percepatan', 'pemantapan', 'pendalaman', 'perluasan', 'penyempurnaan', 'pembaharuan',
            'mengimplementasikan', 'mengoptimalkan', 'menstandarisasi', 'mensinkronkan', 'mengharmonisasi', 'mendigitalisasi', 'memodernisasi', 'mengglobalisasi', 'mengindustrialisasi', 'mentransformasi',
            'internasional', 'interdisipliner', 'intergenerasi', 'interkoneksi', 'interdependensi', 'interoperabilitas', 'interaktivitas', 'intervensi', 'interpretasi', 'interpolasi',
            'kewirausahaan', 'kepemimpinan', 'kenegarawanan', 'kebangsawanan', 'kemasyarakatan', 'kemanusiaan', 'kebudayaan', 'perekonomian', 'pemerintahan', 'kemerdekaan',
            'pertanggungjawaban', 'keberlangsungan', 'ketidakpastian', 'ketidakseimbangan', 'ketidakadilan', 'ketidakpuasan', 'ketidakmampuan', 'ketidaktahuan', 'ketidakhadiran', 'ketidaksepakatan',
            'mengkomunikasikan', 'mengorganisasikan', 'mengadministrasikan', 'mengkoordinasikan', 'mengintegrasikan', 'mengkonsolidasikan', 'mengaktualisasikan', 'mengkonseptualisasikan', 'menginternalisasikan', 'mengeksternalisasikan'
        ]
    },

    // English Words
    en: {
        easy: [
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
            'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
            'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
            'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
            'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
            'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
            'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
            'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
            'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
            'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'word'
        ],
        medium: [
            'about', 'above', 'across', 'after', 'again', 'against', 'almost', 'along', 'already', 'always',
            'another', 'around', 'because', 'become', 'before', 'begin', 'behind', 'believe', 'below', 'between',
            'both', 'bring', 'build', 'business', 'called', 'change', 'children', 'city', 'close', 'come',
            'company', 'computer', 'consider', 'continue', 'control', 'country', 'course', 'create', 'develop', 'different',
            'each', 'early', 'education', 'either', 'enough', 'environment', 'every', 'example', 'experience', 'family',
            'feeling', 'final', 'finally', 'follow', 'found', 'friend', 'general', 'government', 'great', 'group',
            'happen', 'health', 'help', 'history', 'home', 'however', 'human', 'idea', 'important', 'include',
            'increase', 'information', 'interest', 'keep', 'kind', 'large', 'later', 'leader', 'learn', 'least',
            'level', 'life', 'light', 'little', 'live', 'local', 'long', 'many', 'market', 'matter',
            'might', 'money', 'month', 'more', 'morning', 'mother', 'move', 'much', 'music', 'must'
        ],
        hard: [
            'absolutely', 'accomplish', 'achievement', 'acknowledge', 'acquisition', 'administration', 'advertisement', 'agricultural', 'approximately', 'architecture',
            'authorization', 'automatically', 'availability', 'beautiful', 'bibliography', 'breakthrough', 'bureaucracy', 'calculation', 'categorize', 'characteristic',
            'circumstances', 'collaboration', 'comfortable', 'communication', 'compatibility', 'comprehensive', 'concentration', 'configuration', 'congratulations', 'consciousness',
            'consequently', 'considerable', 'constitutional', 'contemporary', 'contribution', 'controversial', 'convenience', 'correspondence', 'cybersecurity', 'demonstrate',
            'determination', 'development', 'differentiate', 'disappointment', 'discrimination', 'distinguished', 'distribution', 'documentation', 'efficiency', 'electromagnetic',
            'embarrassment', 'encouragement', 'engineering', 'entertainment', 'enthusiastic', 'environmental', 'establishment', 'evaluation', 'examination', 'exceptional',
            'extraordinary', 'fascinating', 'flexibility', 'furthermore', 'globalization', 'government', 'grandfather', 'grandmother', 'headquarters', 'hospitality',
            'identification', 'illustration', 'imagination', 'immediately', 'implementation', 'improvement', 'independence', 'infrastructure', 'innovation', 'institution',
            'intelligence', 'international', 'interpretation', 'investigation', 'justification', 'knowledge', 'legislation', 'maintenance', 'management', 'manufacturing',
            'mathematical', 'measurement', 'methodology', 'microprocessor', 'misunderstanding', 'modification', 'negotiation', 'neighborhood', 'nevertheless', 'notification'
        ]
    },

    // Programming keywords
    programming: {
        easy: [
            'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
            'break', 'continue', 'return', 'function', 'class', 'new', 'this', 'true', 'false', 'null',
            'try', 'catch', 'throw', 'async', 'await', 'import', 'export', 'from', 'default', 'extends',
            'public', 'private', 'static', 'void', 'int', 'string', 'bool', 'float', 'double', 'char',
            'array', 'object', 'map', 'set', 'list', 'dict', 'tuple', 'enum', 'struct', 'interface'
        ],
        medium: [
            'function', 'parameter', 'argument', 'variable', 'constant', 'expression', 'statement', 'condition', 'iteration', 'recursion',
            'algorithm', 'datatype', 'operator', 'operand', 'assignment', 'declaration', 'definition', 'initialization', 'instantiation', 'invocation',
            'constructor', 'destructor', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'interface', 'implementation', 'exception', 'handling',
            'debugging', 'testing', 'deployment', 'compilation', 'interpretation', 'execution', 'optimization', 'refactoring', 'documentation', 'versioning'
        ],
        hard: [
            'encapsulation', 'polymorphism', 'inheritance', 'abstraction', 'serialization', 'deserialization', 'authentication', 'authorization', 'middleware', 'microservices',
            'asynchronous', 'synchronous', 'concurrent', 'parallelism', 'multithreading', 'multiprocessing', 'deadlock', 'semaphore', 'mutex', 'singleton',
            'dependency', 'injection', 'inversion', 'repository', 'factory', 'observer', 'decorator', 'adapter', 'facade', 'strategy',
            'configuration', 'environment', 'production', 'development', 'staging', 'deployment', 'containerization', 'orchestration', 'virtualization', 'infrastructure'
        ]
    }
};

// Common sentence patterns for generating text
const SENTENCE_PATTERNS = {
    id: [
        'Saya sedang belajar mengetik dengan cepat.',
        'Latihan membuat sempurna dalam segala hal.',
        'Komputer adalah alat yang sangat berguna.',
        'Teknologi terus berkembang setiap hari.',
        'Pendidikan adalah kunci kesuksesan.',
        'Kesehatan adalah harta yang paling berharga.',
        'Kerjasama tim menghasilkan hasil terbaik.',
        'Komunikasi yang baik sangat penting.',
        'Kreativitas tidak memiliki batasan.',
        'Masa depan dimulai dari hari ini.'
    ],
    en: [
        'The quick brown fox jumps over the lazy dog.',
        'Practice makes perfect in everything you do.',
        'Technology continues to advance every day.',
        'Education is the key to a successful future.',
        'Communication skills are essential for success.',
        'Creativity has no boundaries or limits.',
        'Teamwork makes the dream work together.',
        'Hard work always pays off in the end.',
        'Learning something new is always rewarding.',
        'Every journey begins with a single step.'
    ]
};

// Freeze data to prevent modifications
Object.freeze(WORD_DATA);
Object.freeze(SENTENCE_PATTERNS);
