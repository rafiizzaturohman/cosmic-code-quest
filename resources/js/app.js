// ==================== CONFIG & STATE ====================
const defaultConfig = {
  game_title: "Cosmic Code Quest",
  world_unlock_points: "50",
  max_rounds: "20",
  primary_color: "#8b5cf6",
  secondary_color: "#1e1b4b",
  text_color: "#e0e7ff",
  accent_color: "#10b981",
  background_color: "#0a0118",
};

let config = { ...defaultConfig };

// Player Skills
const skills = [
  {
    id: "frontend",
    name: "💻 Frontend Dev",
    desc: "+3 poin per jawaban CSS benar",
    emoji: "💻",
    bonus: (type) => (type === "CSS" ? 3 : 0),
  },
  {
    id: "architect",
    name: "📄 HTML Architect",
    desc: "Bebas 1 penalti per ronde",
    emoji: "📄",
    power: "penalti",
  },
  {
    id: "designer",
    name: "🎨 UI Designer",
    desc: "Reroll soal 1x per ronde",
    emoji: "🎨",
    power: "reroll",
  },
  {
    id: "speedcoder",
    name: "⚡ Speed Coder",
    desc: "Bonus +5 poin di soal timed",
    emoji: "⚡",
    bonus: (type, timed) => (timed ? 5 : 0),
  },
];

// Worlds Configuration
const worlds = [
  {
    id: "html-galaxy",
    name: "🌐 HTML Galaxy",
    desc: "Pelajari dasar-dasar HTML",
    emoji: "🌐",
    difficulty: "easy",
    unlockPoints: 0,
    bossTopic: "HTML Semantic",
    color: "#10b981",
  },
  {
    id: "css-nebula",
    name: "🎨 CSS Nebula",
    desc: "Kuasai styling dengan CSS",
    emoji: "🎨",
    difficulty: "medium",
    unlockPoints: 200, // ✅ Medium = 200 pts
    bossTopic: "CSS Selectors & Specificity",
    color: "#3b82f6",
  },
  {
    id: "layout-dimension",
    name: "🧩 Layout Dimension",
    desc: "Master Flexbox & Grid",
    emoji: "🧩",
    difficulty: "hard",
    unlockPoints: 400, // ✅ Hard = 400 pts
    bossTopic: "Flexbox & Grid Layout",
    color: "#8b5cf6",
  },
];

// Game State
let gameState = {
  players: [],
  currentPlayerIndex: 0,
  round: 1,
  maxRounds: 15,
  currentWorld: null,
  worldProgress: {
    "html-galaxy": { unlocked: true, completed: false, highScore: 0 },
  },
  diceRolled: false,
  selectedDiceType: "normal",
  eventQueue: [],
};

let selectedPlayerCount = 2;
const playerTokens = ["🚀", "🛸", "🌟", "⭐"];
const playerColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

// Board configurations for each world
const worldBoards = {
  "html-galaxy": [
    { pos: 0, type: "start", label: "START", icon: "🚀" },
    {
      pos: 1,
      type: "question",
      label: "TAG",
      icon: "🏷️",
      category: "HTML",
    },
    { pos: 2, type: "bonus", label: "BONUS", icon: "⭐" },
    {
      pos: 3,
      type: "question",
      label: "HEADING",
      icon: "📰",
      category: "HTML",
    },
    { pos: 4, type: "event", label: "EVENT", icon: "🌀" },
    {
      pos: 5,
      type: "question",
      label: "LINK",
      icon: "🔗",
      category: "HTML",
    },
    { pos: 6, type: "jail", label: "DEBUG", icon: "🐛" },
    {
      pos: 7,
      type: "question",
      label: "IMAGE",
      icon: "🖼️",
      category: "HTML",
    },
    { pos: 8, type: "bonus", label: "BONUS", icon: "💎" },
    {
      pos: 9,
      type: "question",
      label: "LIST",
      icon: "📋",
      category: "HTML",
    },
    { pos: 10, type: "event", label: "EVENT", icon: "☄️" },
    {
      pos: 11,
      type: "question",
      label: "TABLE",
      icon: "📊",
      category: "HTML",
    },
    { pos: 12, type: "boss", label: "BOSS", icon: "👾" },
    {
      pos: 13,
      type: "question",
      label: "FORM",
      icon: "📝",
      category: "HTML",
    },
    { pos: 14, type: "bonus", label: "BONUS", icon: "🎁" },
    {
      pos: 15,
      type: "question",
      label: "ATTR",
      icon: "🔖",
      category: "HTML",
    },
    { pos: 16, type: "event", label: "EVENT", icon: "✨" },
    {
      pos: 17,
      type: "question",
      label: "TEXT",
      icon: "✍️",
      category: "HTML",
    },
    { pos: 18, type: "jail", label: "DEBUG", icon: "🐛" },
    {
      pos: 19,
      type: "question",
      label: "DIV",
      icon: "📦",
      category: "HTML",
    },
    { pos: 20, type: "bonus", label: "BONUS", icon: "🌟" },
    {
      pos: 21,
      type: "question",
      label: "INPUT",
      icon: "⌨️",
      category: "HTML",
    },
    { pos: 22, type: "event", label: "EVENT", icon: "🎪" },
    {
      pos: 23,
      type: "question",
      label: "META",
      icon: "📌",
      category: "HTML",
    },
  ],
  "css-nebula": [
    { pos: 0, type: "start", label: "START", icon: "🚀" },
    {
      pos: 1,
      type: "question",
      label: "COLOR",
      icon: "🎨",
      category: "CSS",
    },
    { pos: 2, type: "bonus", label: "BONUS", icon: "⭐" },
    {
      pos: 3,
      type: "question",
      label: "FONT",
      icon: "🔤",
      category: "CSS",
    },
    { pos: 4, type: "event", label: "EVENT", icon: "🌀" },
    {
      pos: 5,
      type: "question",
      label: "SELECTOR",
      icon: "🎯",
      category: "CSS",
    },
    { pos: 6, type: "jail", label: "DEBUG", icon: "🐛" },
    {
      pos: 7,
      type: "question",
      label: "BOX",
      icon: "📦",
      category: "CSS",
    },
    { pos: 8, type: "bonus", label: "BONUS", icon: "💎" },
    {
      pos: 9,
      type: "question",
      label: "MARGIN",
      icon: "↔️",
      category: "CSS",
    },
    { pos: 10, type: "event", label: "EVENT", icon: "☄️" },
    {
      pos: 11,
      type: "question",
      label: "BORDER",
      icon: "🖼️",
      category: "CSS",
    },
    { pos: 12, type: "boss", label: "BOSS", icon: "👾" },
    {
      pos: 13,
      type: "question",
      label: "BG",
      icon: "🌈",
      category: "CSS",
    },
    { pos: 14, type: "bonus", label: "BONUS", icon: "🎁" },
    {
      pos: 15,
      type: "question",
      label: "CLASS",
      icon: "🏷️",
      category: "CSS",
    },
    { pos: 16, type: "event", label: "EVENT", icon: "��" },
    {
      pos: 17,
      type: "question",
      label: "POSITION",
      icon: "📍",
      category: "CSS",
    },
    { pos: 18, type: "jail", label: "DEBUG", icon: "🐛" },
    {
      pos: 19,
      type: "question",
      label: "DISPLAY",
      icon: "👁️",
      category: "CSS",
    },
    { pos: 20, type: "bonus", label: "BONUS", icon: "🌟" },
    {
      pos: 21,
      type: "question",
      label: "SHADOW",
      icon: "🌑",
      category: "CSS",
    },
    { pos: 22, type: "event", label: "EVENT", icon: "🎪" },
    {
      pos: 23,
      type: "question",
      label: "HOVER",
      icon: "👆",
      category: "CSS",
    },
  ],
  "layout-dimension": [
    { pos: 0, type: "start", label: "START", icon: "🚀" },
    {
      pos: 1,
      type: "question",
      label: "FLEX",
      icon: "🧩",
      category: "CSS",
    },
    { pos: 2, type: "bonus", label: "BONUS", icon: "⭐" },
    {
      pos: 3,
      type: "question",
      label: "GRID",
      icon: "⚡",
      category: "CSS",
    },
    { pos: 4, type: "event", label: "EVENT", icon: "🌀" },
    {
      pos: 5,
      type: "question",
      label: "ALIGN",
      icon: "⬆️",
      category: "CSS",
    },
    { pos: 6, type: "jail", label: "DEBUG", icon: "🐛" },
    {
      pos: 7,
      type: "question",
      label: "JUSTIFY",
      icon: "⚖️",
      category: "CSS",
    },
    { pos: 8, type: "bonus", label: "BONUS", icon: "💎" },
    {
      pos: 9,
      type: "question",
      label: "GAP",
      icon: "↕️",
      category: "CSS",
    },
    { pos: 10, type: "event", label: "EVENT", icon: "☄️" },
    {
      pos: 11,
      type: "question",
      label: "WRAP",
      icon: "🔄",
      category: "CSS",
    },
    { pos: 12, type: "boss", label: "BOSS", icon: "👾" },
    {
      pos: 13,
      type: "question",
      label: "ORDER",
      icon: "🔢",
      category: "CSS",
    },
    { pos: 14, type: "bonus", label: "BONUS", icon: "🎁" },
    {
      pos: 15,
      type: "question",
      label: "GROW",
      icon: "📈",
      category: "CSS",
    },
    { pos: 16, type: "event", label: "EVENT", icon: "✨" },
    {
      pos: 17,
      type: "question",
      label: "TEMPLATE",
      icon: "🗂️",
      category: "CSS",
    },
    { pos: 18, type: "jail", label: "DEBUG", icon: "🐛" },
    {
      pos: 19,
      type: "question",
      label: "AREA",
      icon: "🗺️",
      category: "CSS",
    },
    { pos: 20, type: "bonus", label: "BONUS", icon: "🌟" },
    {
      pos: 21,
      type: "question",
      label: "COLUMN",
      icon: "📊",
      category: "CSS",
    },
    { pos: 22, type: "event", label: "EVENT", icon: "🎪" },
    {
      pos: 23,
      type: "question",
      label: "ROW",
      icon: "➡️",
      category: "CSS",
    },
  ],
};

const positionToGrid = {
  0: [0, 0],
  1: [0, 1],
  2: [0, 2],
  3: [0, 3],
  4: [0, 4],
  5: [0, 5],
  6: [0, 6],
  7: [1, 6],
  8: [2, 6],
  9: [3, 6],
  10: [4, 6],
  11: [5, 6],
  12: [6, 6],
  13: [6, 5],
  14: [6, 4],
  15: [6, 3],
  16: [6, 2],
  17: [6, 1],
  18: [6, 0],
  19: [5, 0],
  20: [4, 0],
  21: [3, 0],
  22: [2, 0],
  23: [1, 0],
};

// Questions Database (Enhanced)
const questions = {
  HTML: {
    easy: [
      {
        q: "Tag HTML untuk membuat paragraf adalah?",
        options: ["<p>", "<paragraph>", "<text>", "<para>"],
        answer: 0,
      },
      {
        q: "Tag untuk membuat heading terbesar?",
        options: ["<h6>", "<h1>", "<heading>", "<head>"],
        answer: 1,
      },
      {
        q: "Tag untuk membuat link?",
        options: ["<link>", "<href>", "<a>", "<url>"],
        answer: 2,
      },
      {
        q: "Tag untuk menampilkan gambar?",
        options: ["<image>", "<pic>", "<photo>", "<img>"],
        answer: 3,
      },
      {
        q: "Tag untuk membuat list tidak berurutan?",
        options: ["<ul>", "<ol>", "<li>", "<list>"],
        answer: 0,
      },
      {
        q: "Atribut untuk memberikan teks alternatif pada gambar?",
        options: ["title", "alt", "src", "text"],
        answer: 1,
      },
      {
        q: "Tag untuk membuat tabel?",
        options: ["<tb>", "<tbl>", "<table>", "<tab>"],
        answer: 2,
      },
      {
        q: "Tag untuk input form?",
        options: ["<textbox>", "<field>", "<entry>", "<input>"],
        answer: 3,
      },
      {
        q: "Tag untuk membuat baris tabel?",
        options: ["<tr>", "<row>", "<trow>", "<line>"],
        answer: 0,
      },
      {
        q: "Struktur dasar HTML dimulai dengan tag?",
        options: ["<body>", "<html>", "<head>", "<start>"],
        answer: 1,
      },
      {
        q: "Tag untuk membuat button?",
        options: ["<btn>", "<click>", "<button>", "<input>"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat list item?",
        options: ["<item>", "<li>", "<list>", "<l>"],
        answer: 1,
      },
      {
        q: "Tag untuk membuat horizontal line?",
        options: ["<line>", "<hr>", "<hline>", "<break>"],
        answer: 1,
      },
      {
        q: "Atribut untuk menentukan sumber gambar?",
        options: ["source", "link", "src", "href"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat list berurutan?",
        options: ["<ul>", "<list>", "<ol>", "<order>"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat textarea?",
        options: ["<text>", "<area>", "<input>", "<textarea>"],
        answer: 3,
      },
      {
        q: "Tag untuk membuat dropdown menu?",
        options: ["<dropdown>", "<menu>", "<select>", "<option>"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat checkbox?",
        options: ["<check>", "<input type='checkbox'>", "<checkbox>", "<box>"],
        answer: 1,
      },
      {
        q: "Tag untuk membuat radio button?",
        options: ["<radio>", "<input type='radio'>", "<button>", "<circle>"],
        answer: 1,
      },
      {
        q: "Tag untuk label form?",
        options: ["<text>", "<name>", "<label>", "<title>"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat header dokumen?",
        options: ["<header>", "<top>", "<head>", "<title>"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat title halaman?",
        options: ["<heading>", "<name>", "<title>", "<header>"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat comment di HTML?",
        options: ["<!-- -->", "// comment", "/* */", "# comment"],
        answer: 0,
      },
      {
        q: "Tag untuk embed video?",
        options: ["<movie>", "<media>", "<video>", "<film>"],
        answer: 2,
      },
      {
        q: "Atribut untuk menentukan URL link?",
        options: ["url", "link", "src", "href"],
        answer: 3,
      },
      {
        q: "Tag untuk membuat kolom tabel?",
        options: ["<column>", "<col>", "<td>", "<cell>"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat header tabel?",
        options: ["<header>", "<head>", "<th>", "<title>"],
        answer: 2,
      },
      {
        q: "Atribut untuk menentukan lebar elemen?",
        options: ["size", "width", "w", "wide"],
        answer: 1,
      },
      {
        q: "Atribut untuk menentukan tinggi elemen?",
        options: ["tall", "h", "height", "size"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat emphasis/italic?",
        options: ["<italic>", "<i>", "<em>", "<slant>"],
        answer: 2,
      },
      {
        q: "Tag untuk kode inline?",
        options: ["<pre>", "<script>", "<code>", "<program>"],
        answer: 2,
      },
      {
        q: "Tag untuk preformatted text?",
        options: ["<format>", "<pre>", "<code>", "<text>"],
        answer: 1,
      },
      {
        q: "Atribut untuk CSS class?",
        options: ["style", "class", "id", "name"],
        answer: 1,
      },
      {
        q: "Atribut untuk unique identifier?",
        options: ["name", "class", "id", "key"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat form?",
        options: ["<input>", "<form>", "<field>", "<submit>"],
        answer: 1,
      },
      {
        q: "Input type untuk password?",
        options: ["secret", "pass", "password", "hidden"],
        answer: 2,
      },
      {
        q: "Tag untuk break line?",
        options: ["<break>", "<newline>", "<br>", "<line>"],
        answer: 2,
      },
      {
        q: "Tag untuk bold text?",
        options: ["<bold>", "<strong>", "<b>", "<thick>"],
        answer: 2,
      },
      {
        q: "Atribut untuk inline styling?",
        options: ["css", "class", "style", "design"],
        answer: 2,
      },
      {
        q: "Tag untuk block quote?",
        options: ["<quote>", "<q>", "<blockquote>", "<cite>"],
        answer: 2,
      },
    ],
    medium: [
      {
        q: "Tag untuk membuat teks tebal?",
        options: ["<bold>", "<thick>", "<strong>", "<b>"],
        answer: 2,
      },
      {
        q: "Tag untuk line break?",
        options: ["<break>", "<lb>", "<newline>", "<br>"],
        answer: 3,
      },
      {
        q: "Atribut untuk membuka link di tab baru?",
        options: ["target='_blank'", "new='tab'", "window='new'", "open='tab'"],
        answer: 0,
      },
      {
        q: "Tag semantic untuk navigation?",
        options: ["<menu>", "<nav>", "<navigation>", "<links>"],
        answer: 1,
      },
      {
        q: "Tag semantic untuk footer?",
        options: ["<bottom>", "<end>", "<footer>", "<foot>"],
        answer: 2,
      },
      {
        q: "Input type untuk email?",
        options: ["text", "mail", "email", "e-mail"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat span?",
        options: ["<div>", "<span>", "<inline>", "<text>"],
        answer: 1,
      },
      {
        q: "Tag untuk membuat division/container?",
        options: ["<container>", "<box>", "<div>", "<section>"],
        answer: 2,
      },
      {
        q: "Tag untuk menebalkan teks (alternatif)?",
        options: ["<b>", "<bold>", "<strong>", "<thick>"],
        answer: 0,
      },
      {
        q: "Tag untuk teks miring?",
        options: ["<italic>", "<i>", "<slant>", "<em>"],
        answer: 3,
      },
      {
        q: "Tag untuk subscript?",
        options: ["<subscript>", "<down>", "<sub>", "<lower>"],
        answer: 2,
      },
      {
        q: "Tag untuk superscript?",
        options: ["<super>", "<up>", "<sup>", "<power>"],
        answer: 2,
      },
      {
        q: "Tag semantic untuk artikel?",
        options: ["<content>", "<article>", "<post>", "<text>"],
        answer: 1,
      },
      {
        q: "Tag semantic untuk aside content?",
        options: ["<sidebar>", "<side>", "<aside>", "<extra>"],
        answer: 2,
      },
      {
        q: "Atribut untuk placeholder di input?",
        options: ["hint", "placeholder", "default", "example"],
        answer: 1,
      },
      {
        q: "Atribut untuk membuat input readonly?",
        options: ["locked", "readonly", "disabled", "fixed"],
        answer: 1,
      },
      {
        q: "Tag untuk membuat canvas?",
        options: ["<draw>", "<graphic>", "<canvas>", "<paint>"],
        answer: 2,
      },
      {
        q: "Tag untuk inline quote?",
        options: ["<quote>", "<q>", "<cite>", "<blockquote>"],
        answer: 1,
      },
      {
        q: "Atribut untuk disable input?",
        options: ["readonly", "locked", "disabled", "inactive"],
        answer: 2,
      },
      {
        q: "Input type untuk angka?",
        options: ["integer", "number", "numeric", "digit"],
        answer: 1,
      },
      {
        q: "Input type untuk tanggal?",
        options: ["calendar", "datetime", "date", "day"],
        answer: 2,
      },
      {
        q: "Tag untuk membuat fieldset?",
        options: ["<group>", "<set>", "<fieldset>", "<formgroup>"],
        answer: 2,
      },
      {
        q: "Tag untuk legend fieldset?",
        options: ["<title>", "<label>", "<legend>", "<caption>"],
        answer: 2,
      },
      {
        q: "Atribut untuk auto focus input?",
        options: ["focus", "autofocus", "auto", "selected"],
        answer: 1,
      },
      {
        q: "Input type untuk URL?",
        options: ["link", "url", "website", "address"],
        answer: 1,
      },
      {
        q: "Input type untuk telepon?",
        options: ["phone", "tel", "telephone", "mobile"],
        answer: 1,
      },
      {
        q: "Tag untuk menggabungkan sel tabel?",
        options: ["merge", "colspan", "combine", "join"],
        answer: 1,
      },
      {
        q: "Atribut untuk max length input?",
        options: ["max", "limit", "maxlength", "length"],
        answer: 2,
      },
      {
        q: "Tag untuk option dalam select?",
        options: ["<item>", "<choice>", "<option>", "<value>"],
        answer: 2,
      },
      {
        q: "Atribut untuk selected option?",
        options: ["checked", "default", "selected", "active"],
        answer: 2,
      },
    ],
    hard: [
      {
        q: "Atribut untuk disable autocomplete?",
        options: [
          "autocomplete='off'",
          "noautocomplete",
          "disable-auto",
          "auto='false'",
        ],
        answer: 0,
      },
      {
        q: "Tag untuk mendefinisikan data dalam list?",
        options: ["<data>", "<dd>", "<dt>", "<info>"],
        answer: 1,
      },
      {
        q: "Atribut untuk validasi form?",
        options: ["validate", "check", "required", "must"],
        answer: 2,
      },
      {
        q: "Tag untuk definition term dalam list?",
        options: ["<term>", "<dt>", "<def>", "<title>"],
        answer: 1,
      },
      {
        q: "Tag untuk figure caption?",
        options: ["<caption>", "<figcaption>", "<title>", "<label>"],
        answer: 1,
      },
      {
        q: "Tag untuk progress bar?",
        options: ["<bar>", "<loading>", "<progress>", "<meter>"],
        answer: 2,
      },
      {
        q: "Tag untuk meter/gauge?",
        options: ["<progress>", "<gauge>", "<meter>", "<scale>"],
        answer: 2,
      },
      {
        q: "Atribut untuk multiple file upload?",
        options: ["many", "multi", "multiple", "files"],
        answer: 2,
      },
      {
        q: "Tag untuk details/summary disclosure?",
        options: ["<accordion>", "<expand>", "<details>", "<dropdown>"],
        answer: 2,
      },
      {
        q: "Tag untuk time element?",
        options: ["<datetime>", "<time>", "<date>", "<clock>"],
        answer: 1,
      },
      {
        q: "Atribut untuk pattern validation?",
        options: ["regex", "pattern", "format", "match"],
        answer: 1,
      },
      {
        q: "Tag untuk audio player?",
        options: ["<sound>", "<music>", "<audio>", "<player>"],
        answer: 2,
      },
      {
        q: "Tag untuk definition list?",
        options: ["<deflist>", "<dlist>", "<dl>", "<list>"],
        answer: 2,
      },
      {
        q: "Tag untuk figure element?",
        options: ["<fig>", "<image>", "<figure>", "<picture>"],
        answer: 2,
      },
      {
        q: "Atribut untuk content editable?",
        options: ["editable", "edit", "contenteditable", "input"],
        answer: 2,
      },
      {
        q: "Tag untuk mark/highlight text?",
        options: ["<highlight>", "<marker>", "<mark>", "<yellow>"],
        answer: 2,
      },
      {
        q: "Tag untuk deleted text?",
        options: ["<remove>", "<delete>", "<del>", "<strike>"],
        answer: 2,
      },
      {
        q: "Tag untuk inserted text?",
        options: ["<add>", "<insert>", "<ins>", "<new>"],
        answer: 2,
      },
      {
        q: "Input type untuk range slider?",
        options: ["slider", "range", "slide", "scale"],
        answer: 1,
      },
      {
        q: "Input type untuk warna?",
        options: ["color", "colour", "picker", "rgb"],
        answer: 0,
      },
      {
        q: "Atribut untuk spellcheck?",
        options: ["spell", "check", "spellcheck", "grammar"],
        answer: 2,
      },
      {
        q: "Tag untuk keyboard input?",
        options: ["<key>", "<keyboard>", "<kbd>", "<input>"],
        answer: 2,
      },
      {
        q: "Tag untuk sample output?",
        options: ["<output>", "<result>", "<samp>", "<sample>"],
        answer: 2,
      },
      {
        q: "Tag untuk variable programming?",
        options: ["<variable>", "<v>", "<var>", "<value>"],
        answer: 2,
      },
      {
        q: "Atribut untuk data custom?",
        options: ["custom-*", "data-*", "attr-*", "meta-*"],
        answer: 1,
      },
      {
        q: "Tag untuk template HTML?",
        options: ["<tmpl>", "<tpl>", "<template>", "<pattern>"],
        answer: 2,
      },
    ],
    boss: [
      {
        q: "Semantic HTML: Tag yang tepat untuk konten utama halaman?",
        options: ["<content>", "<body>", "<main>", "<primary>"],
        answer: 2,
      },
      {
        q: "Elemen mana yang tidak semantic?",
        options: ["<article>", "<div>", "<section>", "<aside>"],
        answer: 1,
      },
      {
        q: "Tag untuk mengelompokkan konten terkait?",
        options: ["<group>", "<section>", "<container>", "<block>"],
        answer: 1,
      },
      {
        q: "Tag untuk header section?",
        options: ["<top>", "<head>", "<header>", "<banner>"],
        answer: 2,
      },
      {
        q: "Atribut ARIA untuk accessibility label?",
        options: ["aria-name", "aria-label", "aria-text", "aria-title"],
        answer: 1,
      },
      {
        q: "Tag untuk embedded content?",
        options: ["<embed>", "<object>", "<iframe>", "Semua benar"],
        answer: 3,
      },
      {
        q: "Meta tag untuk viewport mobile?",
        options: [
          "<meta viewport>",
          "<meta name='viewport'>",
          "<viewport>",
          "<mobile>",
        ],
        answer: 1,
      },
      {
        q: "Tag untuk web component slot?",
        options: ["<placeholder>", "<slot>", "<insert>", "<component>"],
        answer: 1,
      },
      {
        q: "Atribut untuk lazy loading image?",
        options: ["lazy", "defer", "loading='lazy'", "async"],
        answer: 2,
      },
      {
        q: "Tag untuk dialog/modal?",
        options: ["<modal>", "<popup>", "<dialog>", "<window>"],
        answer: 2,
      },
    ],
  },
  CSS: {
    easy: [
      {
        q: "Property untuk mengubah warna teks?",
        options: ["color", "text-color", "font-color", "foreground"],
        answer: 0,
      },
      {
        q: "Property untuk mengubah ukuran font?",
        options: ["text-size", "font-size", "size", "font-width"],
        answer: 1,
      },
      {
        q: "Selector untuk memilih elemen dengan class 'box'?",
        options: ["#box", "box", ".box", "*box"],
        answer: 2,
      },
      {
        q: "Property untuk mengubah warna background?",
        options: ["bg-color", "back-color", "color-bg", "background-color"],
        answer: 3,
      },
      {
        q: "Property untuk mengatur jarak di dalam elemen?",
        options: ["padding", "margin", "spacing", "gap"],
        answer: 0,
      },
      {
        q: "Property untuk mengatur jarak di luar elemen?",
        options: ["padding", "margin", "spacing", "outer"],
        answer: 1,
      },
      {
        q: "Selector untuk memilih elemen dengan id 'header'?",
        options: [".header", "header", "#header", "*header"],
        answer: 2,
      },
      {
        q: "Property untuk mengatur lebar border?",
        options: [
          "border-size",
          "border-style",
          "border-color",
          "border-width",
        ],
        answer: 3,
      },
      {
        q: "Property untuk mengatur lebar elemen?",
        options: ["size", "wide", "width", "w"],
        answer: 2,
      },
      {
        q: "Property untuk mengatur font family?",
        options: ["font", "font-family", "typeface", "font-type"],
        answer: 1,
      },
      {
        q: "Property untuk membuat teks center?",
        options: [
          "align: center",
          "text-align: center",
          "center: text",
          "text: center",
        ],
        answer: 1,
      },
      {
        q: "Value untuk display none?",
        options: ["hide", "invisible", "none", "hidden"],
        answer: 2,
      },
      {
        q: "Property untuk font weight bold?",
        options: ["font-bold", "bold", "font-weight", "weight"],
        answer: 2,
      },
      {
        q: "Property untuk text decoration underline?",
        options: ["underline", "text-line", "text-decoration", "decoration"],
        answer: 2,
      },
      {
        q: "Unit untuk pixel?",
        options: ["p", "px", "pt", "pix"],
        answer: 1,
      },
      {
        q: "Property untuk opacity?",
        options: ["transparent", "visibility", "opacity", "alpha"],
        answer: 2,
      },
      {
        q: "Property untuk cursor pointer?",
        options: ["mouse", "pointer", "cursor", "hand"],
        answer: 2,
      },
      {
        q: "Property untuk overflow hidden?",
        options: ["hide", "overflow", "clip", "scroll"],
        answer: 1,
      },
      {
        q: "Property untuk background image?",
        options: ["bg-image", "image", "background-image", "back-img"],
        answer: 2,
      },
      {
        q: "Property untuk border style solid?",
        options: ["border-type", "border", "border-style", "style"],
        answer: 2,
      },
      {
        q: "Unit untuk percentage?",
        options: ["%", "pct", "percent", "pc"],
        answer: 0,
      },
      {
        q: "Property untuk text transform uppercase?",
        options: ["transform", "text-case", "text-transform", "uppercase"],
        answer: 2,
      },
      {
        q: "Selector untuk semua elemen?",
        options: ["all", "*", "everything", "**"],
        answer: 1,
      },
      {
        q: "Property untuk float left?",
        options: ["align", "position", "float", "side"],
        answer: 2,
      },
      {
        q: "Property untuk clear float?",
        options: ["clear", "reset", "unfloat", "none"],
        answer: 0,
      },
      {
        q: "Value untuk border none?",
        options: ["0", "hidden", "none", "invisible"],
        answer: 2,
      },
      {
        q: "Property untuk max width?",
        options: ["width-max", "maximum-width", "max-width", "width-limit"],
        answer: 2,
      },
      {
        q: "Property untuk min height?",
        options: ["height-min", "minimum-height", "min-height", "height-limit"],
        answer: 2,
      },
      {
        q: "Unit untuk em?",
        options: ["e", "em", "m", "emm"],
        answer: 1,
      },
      {
        q: "Property untuk display block?",
        options: ["show", "visible", "display", "block"],
        answer: 2,
      },
      {
        q: "Property untuk border color?",
        options: ["border-paint", "border-color", "color-border", "border"],
        answer: 1,
      },
      {
        q: "Selector untuk child element?",
        options: [
          "parent > child",
          "parent child",
          "parent + child",
          "parent ~ child",
        ],
        answer: 1,
      },
      {
        q: "Property untuk font style italic?",
        options: ["style", "font-style", "italic", "slant"],
        answer: 1,
      },
      {
        q: "Property untuk list style none?",
        options: ["list-type", "list", "list-style", "bullet"],
        answer: 2,
      },
      {
        q: "Value untuk text align right?",
        options: ["right", "end", "align-right", "justify"],
        answer: 0,
      },
    ],
    medium: [
      {
        q: "Property untuk membuat sudut rounded?",
        options: ["border-radius", "corner-radius", "round", "curve"],
        answer: 0,
      },
      {
        q: "Value untuk menyembunyikan elemen?",
        options: ["hidden", "none", "invisible", "hide"],
        answer: 1,
      },
      {
        q: "Property untuk mengatur posisi elemen?",
        options: ["location", "place", "position", "pos"],
        answer: 2,
      },
      {
        q: "Property untuk mengatur tinggi elemen?",
        options: ["size", "length", "tall", "height"],
        answer: 3,
      },
      {
        q: "Selector untuk pseudo-class hover?",
        options: [":hover", "::hover", ".hover", "#hover"],
        answer: 0,
      },
      {
        q: "Property untuk text alignment?",
        options: ["align", "text-align", "align-text", "alignment"],
        answer: 1,
      },
      {
        q: "Property untuk box shadow?",
        options: ["shadow", "box-shadow", "drop-shadow", "element-shadow"],
        answer: 1,
      },
      {
        q: "Property untuk text shadow?",
        options: ["shadow", "font-shadow", "text-shadow", "letter-shadow"],
        answer: 2,
      },
      {
        q: "Property untuk letter spacing?",
        options: ["letter-space", "spacing", "letter-spacing", "char-spacing"],
        answer: 2,
      },
      {
        q: "Property untuk line height?",
        options: ["line-height", "height", "spacing", "line-space"],
        answer: 0,
      },
      {
        q: "Property untuk transform?",
        options: ["change", "modify", "transform", "move"],
        answer: 2,
      },
      {
        q: "Property untuk transition?",
        options: ["animate", "transition", "animation", "change"],
        answer: 1,
      },
      {
        q: "Selector untuk first child?",
        options: [":first", ":first-child", "::first", ":child(1)"],
        answer: 1,
      },
      {
        q: "Selector untuk last child?",
        options: [":last", ":last-child", "::last", ":child(last)"],
        answer: 1,
      },
      {
        q: "Property untuk list style?",
        options: ["list", "list-style", "bullet", "marker"],
        answer: 1,
      },
      {
        q: "Property untuk vertical align?",
        options: ["v-align", "vertical", "vertical-align", "align-v"],
        answer: 2,
      },
      {
        q: "Property untuk word spacing?",
        options: ["word-space", "spacing", "word-spacing", "word-gap"],
        answer: 2,
      },
      {
        q: "Property untuk white space nowrap?",
        options: ["nowrap", "space", "white-space", "wrap"],
        answer: 2,
      },
      {
        q: "Selector untuk nth child?",
        options: [":nth(n)", ":child(n)", ":nth-child(n)", ":n-child"],
        answer: 2,
      },
      {
        q: "Property untuk outline?",
        options: ["border-outer", "outer-border", "outline", "external-border"],
        answer: 2,
      },
      {
        q: "Property untuk background size cover?",
        options: ["bg-size", "size", "background-size", "cover"],
        answer: 2,
      },
      {
        q: "Property untuk background position?",
        options: ["bg-position", "position", "background-position", "bg-pos"],
        answer: 2,
      },
      {
        q: "Pseudo-element untuk before?",
        options: [":before", "::before", ".before", "#before"],
        answer: 1,
      },
      {
        q: "Pseudo-element untuk after?",
        options: [":after", "::after", ".after", "#after"],
        answer: 1,
      },
      {
        q: "Property untuk pointer events none?",
        options: ["pointer", "mouse-events", "pointer-events", "click"],
        answer: 2,
      },
      {
        q: "Property untuk user select none?",
        options: ["select", "user-select", "selection", "text-select"],
        answer: 1,
      },
      {
        q: "Property untuk box sizing border box?",
        options: ["sizing", "border-box", "box-sizing", "size-type"],
        answer: 2,
      },
      {
        q: "Unit untuk viewport width?",
        options: ["vw", "vp", "view", "vwidth"],
        answer: 0,
      },
      {
        q: "Unit untuk viewport height?",
        options: ["vh", "vp", "view", "vheight"],
        answer: 0,
      },
      {
        q: "Property untuk filter blur?",
        options: ["blur", "effect", "filter", "opacity"],
        answer: 2,
      },
    ],
    hard: [
      {
        q: "Property untuk membuat flexbox?",
        options: ["flex: box", "layout: flex", "display: flex", "box: flex"],
        answer: 2,
      },
      {
        q: "Property untuk z-index order?",
        options: ["z-order", "layer", "z-index", "depth"],
        answer: 2,
      },
      {
        q: "Selector specificity tertinggi?",
        options: ["class", "id", "inline style", "element"],
        answer: 2,
      },
      {
        q: "Property untuk CSS Grid?",
        options: [
          "display: table",
          "display: grid",
          "layout: grid",
          "grid: on",
        ],
        answer: 1,
      },
      {
        q: "Property untuk animation duration?",
        options: ["animation-time", "duration", "animation-duration", "time"],
        answer: 2,
      },
      {
        q: "Property untuk animation timing function?",
        options: ["timing", "easing", "animation-timing-function", "speed"],
        answer: 2,
      },
      {
        q: "Property untuk object-fit?",
        options: ["fit", "image-fit", "object-fit", "contain"],
        answer: 2,
      },
      {
        q: "Property untuk backdrop filter?",
        options: ["background-filter", "blur", "backdrop-filter", "filter-bg"],
        answer: 2,
      },
      {
        q: "Property untuk clip-path?",
        options: ["clip", "path", "clip-path", "mask"],
        answer: 2,
      },
      {
        q: "Property untuk CSS variable?",
        options: ["--variable", "$variable", "@variable", "var()"],
        answer: 0,
      },
      {
        q: "Function untuk CSS calc?",
        options: ["calculate()", "math()", "calc()", "compute()"],
        answer: 2,
      },
      {
        q: "Property untuk aspect ratio?",
        options: ["ratio", "proportion", "aspect-ratio", "dimension"],
        answer: 2,
      },
      {
        q: "Property untuk will change?",
        options: ["optimize", "preload", "will-change", "prepare"],
        answer: 2,
      },
      {
        q: "Property untuk scroll behavior smooth?",
        options: ["smooth-scroll", "scroll", "scroll-behavior", "behavior"],
        answer: 2,
      },
      {
        q: "Property untuk overscroll behavior?",
        options: [
          "scroll-bounce",
          "bounce",
          "overscroll-behavior",
          "scroll-limit",
        ],
        answer: 2,
      },
      {
        q: "Property untuk mix blend mode?",
        options: ["blend", "mix", "mix-blend-mode", "blend-mode"],
        answer: 2,
      },
      {
        q: "Property untuk isolation isolate?",
        options: ["separate", "layer", "isolation", "context"],
        answer: 2,
      },
      {
        q: "Property untuk writing mode vertical?",
        options: ["direction", "orientation", "writing-mode", "text-direction"],
        answer: 2,
      },
      {
        q: "Property untuk text orientation?",
        options: ["direction", "rotate", "text-orientation", "orientation"],
        answer: 2,
      },
      {
        q: "Property untuk object position?",
        options: [
          "image-position",
          "position",
          "object-position",
          "fit-position",
        ],
        answer: 2,
      },
      {
        q: "Property untuk resize both?",
        options: ["resizable", "scale", "resize", "size"],
        answer: 2,
      },
      {
        q: "Property untuk columns count?",
        options: ["column-count", "columns", "col-count", "multi-column"],
        answer: 1,
      },
      {
        q: "Property untuk column gap?",
        options: ["gap", "col-gap", "column-gap", "gutter"],
        answer: 2,
      },
      {
        q: "Property untuk break inside avoid?",
        options: ["no-break", "keep", "break-inside", "page-break"],
        answer: 2,
      },
      {
        q: "Property untuk mask image?",
        options: ["mask", "clip-image", "mask-image", "image-mask"],
        answer: 2,
      },
      {
        q: "Property untuk shape outside?",
        options: ["wrap", "text-wrap", "shape-outside", "float-shape"],
        answer: 2,
      },
    ],
    boss: [
      {
        q: "Flexbox: Property untuk align items vertikal?",
        options: [
          "align-items",
          "vertical-align",
          "align-vertical",
          "justify-items",
        ],
        answer: 0,
      },
      {
        q: "Grid: Property untuk definisi kolom?",
        options: [
          "columns",
          "grid-columns",
          "grid-template-columns",
          "column-template",
        ],
        answer: 2,
      },
      {
        q: "Mana yang bukan flex property?",
        options: ["flex-grow", "flex-shrink", "flex-align", "flex-basis"],
        answer: 2,
      },
      {
        q: "Flexbox: Property untuk justify content?",
        options: [
          "justify-content",
          "align-content",
          "content-justify",
          "justify",
        ],
        answer: 0,
      },
      {
        q: "Grid: Property untuk gap antara grid items?",
        options: ["spacing", "gap", "margin", "gutter"],
        answer: 1,
      },
      {
        q: "Property untuk align self dalam flex?",
        options: ["self-align", "align-self", "flex-align", "item-align"],
        answer: 1,
      },
      {
        q: "Flexbox: Property untuk flex direction column?",
        options: ["direction", "flex-flow", "flex-direction", "orientation"],
        answer: 2,
      },
      {
        q: "Grid: Property untuk grid auto flow?",
        options: ["flow", "auto-flow", "grid-flow", "grid-auto-flow"],
        answer: 3,
      },
      {
        q: "Flexbox: Property untuk flex wrap?",
        options: ["wrap", "flex-wrap", "line-wrap", "multi-line"],
        answer: 1,
      },
      {
        q: "Grid: Property untuk grid area?",
        options: ["area", "grid-area", "cell", "position"],
        answer: 1,
      },
    ],
  },
};

// Events
const events = [
  {
    emoji: "☄️",
    title: "CSS Bug Attack!",
    desc: "Skip 1 giliran",
    effect: "skip",
    value: 1,
  },
  {
    emoji: "🛠️",
    title: "Debug Mode Activated",
    desc: "Bebas 1 penalti berikutnya",
    effect: "shield",
    value: 1,
  },
  {
    emoji: "✨",
    title: "Clean Code Bonus",
    desc: "+10 poin!",
    effect: "points",
    value: 10,
  },
  {
    emoji: "🌀",
    title: "Warp Jump",
    desc: "Pindah ke petak acak",
    effect: "warp",
    value: 0,
  },
  {
    emoji: "⚡",
    title: "Speed Boost",
    desc: "Lempar dadu 2x giliran ini",
    effect: "double",
    value: 0,
  },
  {
    emoji: "🎁",
    title: "Mystery Box",
    desc: "+5 sampai +15 poin acak",
    effect: "mystery",
    value: 0,
  },
];

// ==================== UTILITY FUNCTIONS ====================
function generateStars() {
  const container = document.getElementById("stars-container");
  container.innerHTML = "";
  for (let i = 0; i < 150; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.width = Math.random() * 3 + 1 + "px";
    star.style.height = star.style.width;
    star.style.animationDelay = Math.random() * 3 + "s";
    container.appendChild(star);
  }
}

function addLog(message) {
  const log = document.getElementById("game-log");
  const entry = document.createElement("div");
  entry.className = "py-1 border-b border-violet-500/20 fade-in";
  entry.textContent = `[R${gameState.round}] ${message}`;
  log.insertBefore(entry, log.firstChild);
  if (log.children.length > 20) log.lastChild.remove();
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  const colors = {
    info: "from-blue-600 to-indigo-600",
    success: "from-emerald-600 to-teal-600",
    error: "from-red-600 to-rose-600",
    warning: "from-amber-600 to-orange-600",
  };
  toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl bg-gradient-to-r ${colors[type]} text-white font-medium shadow-2xl transform transition-all duration-300`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(-20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== START SCREEN ====================
function setPlayerCount(count) {
  selectedPlayerCount = count;
  document.querySelectorAll(".player-count-btn").forEach((btn) => {
    if (parseInt(btn.dataset.count) === count) {
      btn.classList.add("bg-violet-600", "border-violet-400");
      btn.classList.remove("bg-slate-800");
    } else {
      btn.classList.remove("bg-violet-600", "border-violet-400");
      btn.classList.add("bg-slate-800");
    }
  });
  renderPlayerInputs();
}

function renderPlayerInputs() {
  const container = document.getElementById("player-inputs");
  container.innerHTML = "";
  for (let i = 0; i < selectedPlayerCount; i++) {
    const div = document.createElement("div");
    div.className = "flex items-center gap-3";
    div.innerHTML = `
          <span class="text-3xl">${playerTokens[i]}</span>
          <input type="text" id="player-name-${i}" placeholder="Nama Pemain ${
      i + 1
    }" 
                 class="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-violet-500/30 text-white placeholder-violet-400/50 focus:outline-none focus:border-violet-400 transition-all"
                 maxlength="15">
        `;
    container.appendChild(div);
  }
}

function showSkillSelection() {
  const players = [];
  for (let i = 0; i < selectedPlayerCount; i++) {
    const input = document.getElementById(`player-name-${i}`);
    const name = input.value.trim() || `Pemain ${i + 1}`;
    players.push({
      id: i,
      name: name,
      token: playerTokens[i],
      color: playerColors[i],
      position: 0,
      score: 0,
      skipTurns: 0,
      skill: null,
      combo: 0,
      powers: {},
      stats: {
        htmlCorrect: 0,
        htmlWrong: 0,
        cssCorrect: 0,
        cssWrong: 0,
        totalQuestions: 0,
      },
    });
  }
  gameState.players = players;

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("skill-screen").classList.remove("hidden");
  renderSkillSelection();
}

function renderSkillSelection() {
  const container = document.getElementById("skill-selection-container");
  container.innerHTML = "";

  gameState.players.forEach((player, idx) => {
    const div = document.createElement("div");
    div.className =
      "bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-violet-500/30";
    div.innerHTML = `
          <h3 class="text-xl font-bold text-white mb-4">${player.token} ${
      player.name
    }</h3>
          <div class="grid md:grid-cols-2 gap-3">
            ${skills
              .map(
                (skill, i) => `
              <div class="skill-card p-4 rounded-lg bg-slate-800 border-2 border-violet-500/30 cursor-pointer hover:border-violet-400 transition-all" 
                   onclick="selectSkill(${idx}, '${skill.id}')">
                <div class="text-3xl mb-2">${skill.emoji}</div>
                <div class="text-white font-bold text-sm mb-1">${skill.name
                  .split(" ")
                  .slice(1)
                  .join(" ")}</div>
                <div class="text-violet-300/70 text-xs">${skill.desc}</div>
              </div>
            `
              )
              .join("")}
          </div>
          <div id="selected-skill-${idx}" class="mt-3 text-center text-emerald-400 text-sm font-medium hidden"></div>
        `;
    container.appendChild(div);
  });
}

function selectSkill(playerIdx, skillId) {
  const skill = skills.find((s) => s.id === skillId);
  gameState.players[playerIdx].skill = skill;

  const display = document.getElementById(`selected-skill-${playerIdx}`);
  display.textContent = `✓ Dipilih: ${skill.name}`;
  display.classList.remove("hidden");

  document.querySelectorAll(".skill-card").forEach((card, i) => {
    const parent = card.parentElement.parentElement;
    if (parent === display.parentElement) {
      card.classList.remove("border-violet-400", "bg-violet-600/20");
      if (card.textContent.includes(skill.name.split(" ").slice(1).join(" "))) {
        card.classList.add("border-violet-400", "bg-violet-600/20");
      }
    }
  });
}

function startGameWithSkills() {
  const allSelected = gameState.players.every((p) => p.skill !== null);
  if (!allSelected) {
    showToast("Semua pemain harus memilih skill!", "warning");
    return;
  }

  document.getElementById("skill-screen").classList.add("hidden");
  showWorldSelection();
}

// ==================== WORLD SELECTION ====================
function showWorldSelection() {
  document.getElementById("world-screen").classList.remove("hidden");
  renderWorldSelection();
}

function renderWorldSelection() {
  const container = document.getElementById("world-selection-container");
  container.innerHTML = "";

  worlds.forEach((world, idx) => {
    const progress = gameState.worldProgress[world.id] || {
      unlocked: false,
      completed: false,
      highScore: 0,
    };
    const isLocked = !progress.unlocked;

    const div = document.createElement("div");
    div.className = `bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border-2 transition-all ${
      isLocked
        ? "world-locked border-slate-700"
        : "border-violet-500/50 cursor-pointer hover:border-violet-400 hover:scale-105"
    }`;

    if (!isLocked) {
      div.onclick = () => startWorld(world.id);
    }

    div.innerHTML = `
          <div class="text-center">
            <div class="text-6xl mb-3 ${isLocked ? "opacity-50" : ""}">${
      world.emoji
    }</div>
            <h3 class="font-title text-xl text-white mb-2">${world.name}</h3>
            <p class="text-violet-300 text-sm mb-4">${world.desc}</p>
            
            ${
              isLocked
                ? `
              <div class="inline-block px-4 py-2 rounded-full bg-red-600/30 text-red-300 text-sm">
                🔒 Butuh ${world.unlockPoints} poin
              </div>
            `
                : `
              <div class="space-y-2">
                ${
                  progress.completed
                    ? `
                  <div class="inline-block px-4 py-2 rounded-full bg-emerald-600/30 text-emerald-300 text-sm">
                    ✓ Selesai | High: ${progress.highScore} pts
                  </div>
                `
                    : `
                  <div class="inline-block px-4 py-2 rounded-full bg-violet-600/30 text-violet-300 text-sm">
                    Difficulty: ${world.difficulty.toUpperCase()}
                  </div>
                `
                }
                <div class="text-amber-400 text-xs">👾 Boss: ${
                  world.bossTopic
                }</div>
              </div>
            `
            }
          </div>
        `;

    container.appendChild(div);
  });
}

function startWorld(worldId) {
  gameState.currentWorld = worlds.find((w) => w.id === worldId);
  gameState.round = 1;
  gameState.maxRounds = parseInt(config.max_rounds) || 15;
  gameState.diceRolled = false;

  // Reset player positions and stats for new world
  gameState.players.forEach((p) => {
    p.position = 0;
    p.skipTurns = 0;
    p.combo = 0;
    p.powers = {};
  });

  document.getElementById("world-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  renderBoard();
  renderPlayerScores();
  updateCurrentPlayerDisplay();
  addLog(`Memasuki ${gameState.currentWorld.name}`);
}

function backToWorldSelect() {
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("world-complete-modal").classList.add("hidden");
  showWorldSelection();
}

// ==================== BOARD RENDERING ====================
function renderBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  const boardConfig = worldBoards[gameState.currentWorld.id];

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = document.createElement("div");
      const cellConfig = boardConfig.find((c) => {
        const [r, c2] = positionToGrid[c.pos];
        return r === row && c2 === col;
      });

      if (cellConfig) {
        const typeClasses = {
          start: "start-cell",
          question: "question-cell",
          bonus: "bonus-cell",
          jail: "jail-cell",
          event: "event-cell",
          boss: "boss-cell",
        };

        cell.className = `board-cell ${
          typeClasses[cellConfig.type]
        } rounded-lg p-1 md:p-2 flex flex-col items-center justify-center relative cursor-pointer`;
        cell.dataset.position = cellConfig.pos;
        cell.innerHTML = `
              <span class="text-base md:text-2xl">${cellConfig.icon}</span>
              <span class="text-[7px] md:text-[10px] text-white/80 font-bold">${cellConfig.label}</span>
              <div id="cell-players-${cellConfig.pos}" class="absolute -top-1 -right-1 flex flex-wrap gap-0.5 max-w-full"></div>
            `;
      } else {
        cell.className =
          "rounded-lg bg-slate-800/20 flex items-center justify-center";
        if (row === 3 && col === 3) {
          cell.innerHTML = `<span class="text-3xl md:text-5xl opacity-40">${gameState.currentWorld.emoji}</span>`;
        }
      }

      board.appendChild(cell);
    }
  }

  updateAllPlayerPositions();

  document.getElementById("world-name-display").textContent =
    gameState.currentWorld.name;
}

function updateAllPlayerPositions() {
  for (let i = 0; i < 24; i++) {
    const container = document.getElementById(`cell-players-${i}`);
    if (container) container.innerHTML = "";
  }

  gameState.players.forEach((player) => {
    const container = document.getElementById(
      `cell-players-${player.position}`
    );
    if (container) {
      const token = document.createElement("span");
      token.className = "player-token text-sm md:text-base";
      token.textContent = player.token;
      token.title = player.name;
      container.appendChild(token);
    }
  });
}

function renderPlayerScores() {
  const container = document.getElementById("player-scores");
  container.innerHTML = "";

  gameState.players.forEach((player, index) => {
    const isCurrentPlayer = index === gameState.currentPlayerIndex;
    const div = document.createElement("div");
    div.className = `flex items-center justify-between p-2 rounded-lg transition-all ${
      isCurrentPlayer
        ? "bg-violet-600/30 border border-violet-400/50"
        : "bg-slate-800/50"
    }`;
    div.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-lg">${player.token}</span>
            <div>
              <div class="text-white font-medium text-sm">${player.name}</div>
              ${
                player.combo > 1
                  ? `<div class="text-orange-400 text-xs streak-fire">🔥 ${player.combo}x</div>`
                  : ""
              }
            </div>
          </div>
          <div class="text-right">
            <div class="text-amber-400 font-bold">${player.score}</div>
            ${
              Object.keys(player.powers).length > 0
                ? `<div class="text-xs text-emerald-400">⚡${
                    Object.keys(player.powers).length
                  }</div>`
                : ""
            }
          </div>
        `;
    container.appendChild(div);
  });
}

function updateCurrentPlayerDisplay() {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  document.getElementById(
    "current-player-name"
  ).textContent = `${currentPlayer.token} ${currentPlayer.name}`;
  document.getElementById("player-skill-display").textContent =
    currentPlayer.skill.name;
  document.getElementById("round-display").textContent = gameState.round;
  document.getElementById("max-round-display").textContent =
    gameState.maxRounds;

  // Combo display
  const comboDisplay = document.getElementById("combo-display");
  if (currentPlayer.combo > 1) {
    comboDisplay.classList.remove("hidden");
    document.getElementById("combo-count").textContent = currentPlayer.combo;
  } else {
    comboDisplay.classList.add("hidden");
  }

  // Powers display
  const powersDisplay = document.getElementById("powerups-display");
  powersDisplay.innerHTML = "";
  if (Object.keys(currentPlayer.powers).length > 0) {
    Object.entries(currentPlayer.powers).forEach(([power, count]) => {
      const powerDiv = document.createElement("div");
      powerDiv.className =
        "flex items-center justify-between bg-emerald-600/20 px-2 py-1 rounded text-emerald-300";
      powerDiv.innerHTML = `<span>${
        power === "shield"
          ? "🛡️ Shield"
          : power === "double"
          ? "⚡ Double"
          : "��� Power"
      }</span><span>x${count}</span>`;
      powersDisplay.appendChild(powerDiv);
    });
  }

  document
    .getElementById("roll-btn")
    .classList.toggle(
      "hidden",
      gameState.diceRolled || currentPlayer.skipTurns > 0
    );
  document
    .getElementById("next-turn-btn")
    .classList.toggle(
      "hidden",
      !gameState.diceRolled && currentPlayer.skipTurns === 0
    );
  document
    .getElementById("dice-selection")
    .classList.toggle(
      "hidden",
      gameState.diceRolled || currentPlayer.skipTurns > 0
    );

  renderPlayerScores();
}

// ==================== DICE & MOVEMENT ====================
function selectDiceType(type) {
  gameState.selectedDiceType = type;
  document.querySelectorAll(".dice-type-btn").forEach((btn) => {
    if (btn.dataset.type === type) {
      btn.classList.add("bg-violet-600", "border-violet-400");
      btn.classList.remove("bg-slate-800");
    } else {
      btn.classList.remove("bg-violet-600", "border-violet-400");
      btn.classList.add("bg-slate-800");
    }
  });
}

function rollDice() {
  if (gameState.diceRolled) return;

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (currentPlayer.skipTurns > 0) {
    currentPlayer.skipTurns--;
    addLog(`${currentPlayer.name} skip giliran`);
    showToast(`${currentPlayer.name} skip giliran!`, "warning");
    nextTurn();
    return;
  }

  const dice = document.getElementById("dice");
  dice.classList.add("dice-rolling");

  let rollCount = 0;
  const rollInterval = setInterval(() => {
    const maxValue = gameState.selectedDiceType === "risk" ? 8 : 6;
    dice.textContent = Math.floor(Math.random() * maxValue) + 1;
    rollCount++;

    if (rollCount >= 12) {
      clearInterval(rollInterval);
      let result =
        Math.floor(
          Math.random() * (gameState.selectedDiceType === "risk" ? 8 : 6)
        ) + 1;

      // Smart dice: reroll if 1
      if (gameState.selectedDiceType === "smart" && result === 1) {
        result = Math.floor(Math.random() * 6) + 1;
        showToast("Smart dice reroll!", "info");
      }

      // Risk dice: chance of penalty
      if (gameState.selectedDiceType === "risk" && Math.random() < 0.2) {
        showToast("Risk dice penalty! -5 poin", "error");
        currentPlayer.score = Math.max(0, currentPlayer.score - 5);
      }

      dice.textContent = result;
      dice.classList.remove("dice-rolling");

      // Check double power
      if (currentPlayer.powers.double) {
        result *= 2;
        currentPlayer.powers.double--;
        if (currentPlayer.powers.double === 0)
          delete currentPlayer.powers.double;
        showToast("Double dice activated! ⚡", "success");
      }

      movePlayer(currentPlayer, result);
    }
  }, 80);
}

function movePlayer(player, steps) {
  gameState.diceRolled = true;
  addLog(`${player.name} melempar ${steps}`);

  let currentStep = 0;
  const moveInterval = setInterval(() => {
    if (currentStep < steps) {
      player.position = (player.position + 1) % 24;
      updateAllPlayerPositions();

      const container = document.getElementById(
        `cell-players-${player.position}`
      );
      if (container && container.querySelector(".player-token")) {
        container.querySelector(".player-token").classList.add("player-moving");
        setTimeout(() => {
          const token = container.querySelector(".player-token");
          if (token) token.classList.remove("player-moving");
        }, 400);
      }

      currentStep++;
    } else {
      clearInterval(moveInterval);
      handleCellLanding(player);
    }
  }, 350);

  updateCurrentPlayerDisplay();
}

function handleCellLanding(player) {
  const boardConfig = worldBoards[gameState.currentWorld.id];
  const cellConfig = boardConfig.find((c) => c.pos === player.position);

  if (!cellConfig) return;

  addLog(`${player.name} di ${cellConfig.label}`);

  switch (cellConfig.type) {
    case "start":
      player.score += 5;
      showToast(`${player.name} +5 poin (START)`, "success");
      addLog(`${player.name} +5 poin`);
      break;

    case "question":
      const difficulty = gameState.currentWorld.difficulty;
      showQuestion(player, cellConfig.category, difficulty, false, false);
      break;

    case "bonus":
      const bonus = Math.floor(Math.random() * 10) + 5;
      player.score += bonus;
      showToast(`${player.name} +${bonus} bonus! ⭐`, "success");
      addLog(`${player.name} +${bonus} poin (BONUS)`);
      break;

    case "jail":
      showToast(`🐛 ${player.name} masuk Debug Room!`, "warning");
      const qCount = Math.random() > 0.6 ? 2 : 1;
      showQuestion(
        player,
        "HTML",
        gameState.currentWorld.difficulty,
        true,
        false,
        qCount
      );
      break;

    case "event":
      triggerEvent(player);
      break;

    case "boss":
      showToast("👾 BOSS CHALLENGE!", "error");
      showBossChallenge(player);
      break;
  }
}

// ==================== QUESTION SYSTEM ====================
let currentQuestionState = {
  player: null,
  questions: [],
  currentIndex: 0,
  correctCount: 0,
  isJail: false,
  isBoss: false,
  isTimed: false,
  timeLeft: 10,
  timerInterval: null,
};

function showQuestion(
  player,
  category,
  difficulty,
  isJail,
  isTimed,
  count = 1
) {
  let questionPool = questions[category]?.[difficulty] || questions.HTML.easy;

  const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffled
    .slice(0, count)
    .map((q) => ({ ...q, category }));

  currentQuestionState = {
    player: player,
    questions: selectedQuestions,
    currentIndex: 0,
    correctCount: 0,
    isJail: isJail,
    isBoss: false,
    isTimed: isTimed,
    timeLeft: 10,
    timerInterval: null,
  };

  renderCurrentQuestion();
  showQuestionModal();
}

function showBossChallenge(player) {
  const bossQuestions =
    questions[gameState.currentWorld.id === "html-galaxy" ? "HTML" : "CSS"]
      .boss || [];

  if (bossQuestions.length === 0) {
    showToast("Boss challenge tidak tersedia!", "error");
    return;
  }

  const shuffled = [...bossQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3).map((q) => ({
    ...q,
    category: gameState.currentWorld.id === "html-galaxy" ? "HTML" : "CSS",
  }));

  currentQuestionState = {
    player: player,
    questions: selected,
    currentIndex: 0,
    correctCount: 0,
    isJail: false,
    isBoss: true,
    isTimed: false,
    timeLeft: 10,
    timerInterval: null,
  };

  renderCurrentQuestion();

  const modal = document.getElementById("boss-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function renderCurrentQuestion() {
  const { questions, currentIndex, isJail, isBoss, isTimed } =
    currentQuestionState;
  const question = questions[currentIndex];

  const modalToUse = isBoss ? "boss-modal" : "question-modal";
  const containerToUse = isBoss
    ? "boss-question-container"
    : "question-container";

  if (!isBoss) {
    document.getElementById("question-emoji").textContent = isJail
      ? "🐛"
      : "🔮";
    document.getElementById("question-title").textContent = isJail
      ? "Debug Room Challenge!"
      : "Code Challenge!";
    document.getElementById("question-subtitle").textContent = `Soal ${
      currentIndex + 1
    }/${questions.length} | ${question.category}`;

    if (isTimed) {
      document.getElementById("timer-display").classList.remove("hidden");
      startQuestionTimer();
    } else {
      document.getElementById("timer-display").classList.add("hidden");
    }
  }

  const container = document.getElementById(containerToUse);

  // Clear container first
  container.innerHTML = "";

  // Create question text
  const questionDiv = document.createElement("div");
  questionDiv.className = `bg-slate-800/50 rounded-xl p-4 mb-4 ${
    isJail ? "border-2 border-red-500/50 glitch-effect" : ""
  }`;
  questionDiv.innerHTML = `<p class="text-white text-base md:text-lg font-medium">${question.q}</p>`;
  container.appendChild(questionDiv);

  // Create options container
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "space-y-2";
  optionsContainer.id = `answer-options-${isBoss ? "boss" : "normal"}`;

  // Create each option button separately
  question.options.forEach((opt, i) => {
    const button = document.createElement("button");
    button.className =
      "answer-option w-full py-3 px-4 rounded-xl bg-slate-800 border-2 border-violet-500/30 hover:bg-violet-600/30 hover:border-violet-400 transition-all text-left flex items-center";
    button.onclick = () => submitAnswer(i);

    const label = document.createElement("span");
    label.className =
      "inline-block w-7 h-7 rounded-full bg-violet-600/50 text-center leading-7 text-sm mr-3 font-bold text-white flex-shrink-0";
    label.textContent = String.fromCharCode(65 + i);

    const text = document.createElement("span");
    text.className = "font-medium text-white flex-1";
    text.textContent = opt;

    button.appendChild(label);
    button.appendChild(text);
    optionsContainer.appendChild(button);
  });

  container.appendChild(optionsContainer);

  // Add reroll button if applicable
  if (
    !isBoss &&
    currentQuestionState.player.skill.id === "designer" &&
    !currentQuestionState.rerollUsed
  ) {
    const rerollBtn = document.createElement("button");
    rerollBtn.className =
      "w-full mt-3 py-2 rounded-lg bg-cyan-600/50 text-cyan-200 hover:bg-cyan-600 transition-all text-sm";
    rerollBtn.onclick = () => rerollQuestion();
    rerollBtn.textContent = "🔄 Reroll Soal (Skill)";
    container.appendChild(rerollBtn);
  }
}

function rerollQuestion() {
  currentQuestionState.rerollUsed = true;
  const { questions, currentIndex } = currentQuestionState;
  const category = questions[currentIndex].category;
  const difficulty = gameState.currentWorld.difficulty;

  const questionPool = questions[category]?.[difficulty] || questions.HTML.easy;
  const newQ = questionPool[Math.floor(Math.random() * questionPool.length)];
  currentQuestionState.questions[currentIndex] = { ...newQ, category };

  showToast("Soal di-reroll! 🔄", "info");
  renderCurrentQuestion();
}

function startQuestionTimer() {
  currentQuestionState.timeLeft = 10;
  document.getElementById("timer-count").textContent =
    currentQuestionState.timeLeft;

  currentQuestionState.timerInterval = setInterval(() => {
    currentQuestionState.timeLeft--;
    document.getElementById("timer-count").textContent =
      currentQuestionState.timeLeft;

    if (currentQuestionState.timeLeft <= 0) {
      clearInterval(currentQuestionState.timerInterval);
      submitAnswer(-1);
    }
  }, 1000);
}

function submitAnswer(selectedIndex) {
  const { player, questions, currentIndex, isJail, isBoss, isTimed } =
    currentQuestionState;
  const question = questions[currentIndex];
  const isCorrect = selectedIndex === question.answer;

  if (currentQuestionState.timerInterval) {
    clearInterval(currentQuestionState.timerInterval);
  }

  const optionsId = isBoss ? "answer-options-boss" : "answer-options-normal";
  const buttons = document.querySelectorAll(`#${optionsId} .answer-option`);
  buttons.forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
  });

  if (question.answer >= 0 && question.answer < buttons.length) {
    buttons[question.answer].classList.add(
      "bg-emerald-600/50",
      "border-emerald-400"
    );
  }
  if (!isCorrect && selectedIndex >= 0 && selectedIndex < buttons.length) {
    buttons[selectedIndex].classList.add("bg-red-600/50", "border-red-400");
  }

  if (isCorrect) {
    currentQuestionState.correctCount++;
    let points = isBoss ? 20 : 10;

    // Apply skill bonuses
    if (player.skill.bonus) {
      const bonus = player.skill.bonus(question.category, isTimed);
      points += bonus;
    }

    // Combo bonus
    player.combo++;
    if (player.combo >= 2) {
      const comboBonus = Math.min(player.combo, 5) * 2;
      points += comboBonus;
      showToast(`🔥 Combo ${player.combo}x! +${comboBonus} bonus`, "success");
    }

    player.score += points;
    addLog(`${player.name} BENAR! +${points} poin`);

    // Stats
    if (question.category === "HTML") player.stats.htmlCorrect++;
    else player.stats.cssCorrect++;
  } else {
    player.combo = 0;
    addLog(`${player.name} SALAH`);

    if (question.category === "HTML") player.stats.htmlWrong++;
    else player.stats.cssWrong++;
  }

  player.stats.totalQuestions++;

  setTimeout(() => {
    currentQuestionState.currentIndex++;

    if (currentQuestionState.currentIndex < questions.length) {
      renderCurrentQuestion();
    } else {
      finishQuestionSession();
    }
  }, 1500);
}

function finishQuestionSession() {
  const { player, questions, correctCount, isJail, isBoss } =
    currentQuestionState;

  if (isBoss) {
    document.getElementById("boss-modal").classList.add("hidden");
    document.getElementById("boss-modal").classList.remove("flex");

    if (correctCount === questions.length) {
      showToast("🎉 Boss dikalahkan!", "success");
      player.score += 50;
      addLog(`${player.name} kalahkan boss! +50 poin`);
      completeWorld();
    } else {
      showToast(
        `Boss belum terkalahkan. ${correctCount}/${questions.length} benar`,
        "warning"
      );
    }
  } else if (isJail) {
    const wrongCount = questions.length - correctCount;

    // Check shield power
    if (wrongCount > 0 && player.powers.shield) {
      player.powers.shield--;
      if (player.powers.shield === 0) delete player.powers.shield;
      showToast(`🛡️ Shield melindungi dari penalti!`, "success");
      addLog(`${player.name} terlindungi shield`);
    } else if (wrongCount > 0) {
      player.skipTurns = wrongCount;
      showToast(`${player.name} skip ${wrongCount} giliran!`, "error");
      addLog(`${player.name} penalti: skip ${wrongCount}`);
    } else {
      showToast(`${player.name} lolos dari Debug Room! 🎉`, "success");
    }

    hideQuestionModal();
  } else {
    if (correctCount > 0) {
      showToast(`${correctCount}/${questions.length} benar!`, "success");
    }
    hideQuestionModal();
  }

  renderPlayerScores();
}

function showQuestionModal() {
  const modal = document.getElementById("question-modal");
  const content = document.getElementById("question-content");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  setTimeout(() => {
    content.classList.remove("scale-95", "opacity-0");
    content.classList.add("scale-100", "opacity-100");
  }, 50);
}

function hideQuestionModal() {
  const modal = document.getElementById("question-modal");
  const content = document.getElementById("question-content");
  content.classList.add("scale-95", "opacity-0");
  content.classList.remove("scale-100", "opacity-100");

  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }, 300);
}

// ==================== EVENT SYSTEM ====================
function triggerEvent(player) {
  const event = events[Math.floor(Math.random() * events.length)];

  document.getElementById("event-emoji").textContent = event.emoji;
  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-description").textContent = event.desc;

  const modal = document.getElementById("event-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  switch (event.effect) {
    case "skip":
      player.skipTurns += event.value;
      break;
    case "shield":
      player.powers.shield = (player.powers.shield || 0) + event.value;
      break;
    case "points":
      player.score += event.value;
      break;
    case "warp":
      player.position = Math.floor(Math.random() * 24);
      updateAllPlayerPositions();
      break;
    case "double":
      player.powers.double = (player.powers.double || 0) + 1;
      break;
    case "mystery":
      const mysteryPoints = Math.floor(Math.random() * 11) + 5;
      player.score += mysteryPoints;
      document.getElementById(
        "event-description"
      ).textContent = `+${mysteryPoints} poin!`;
      break;
  }

  addLog(`${player.name}: ${event.title}`);
  renderPlayerScores();
}

function closeEventModal() {
  document.getElementById("event-modal").classList.add("hidden");
  document.getElementById("event-modal").classList.remove("flex");
}

// ==================== TURN & WORLD MANAGEMENT ====================
function nextTurn() {
  gameState.diceRolled = false;
  gameState.currentPlayerIndex =
    (gameState.currentPlayerIndex + 1) % gameState.players.length;

  if (gameState.currentPlayerIndex === 0) {
    gameState.round++;
    addLog(`📅 Ronde ${gameState.round}`);

    if (gameState.round > gameState.maxRounds) {
      completeWorld();
      return;
    }
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  if (currentPlayer.skipTurns > 0) {
    currentPlayer.skipTurns--;
    addLog(`${currentPlayer.name} skip`);
    updateCurrentPlayerDisplay();
    setTimeout(() => nextTurn(), 1000);
    return;
  }

  selectDiceType("normal");
  updateCurrentPlayerDisplay();
}

function completeWorld() {
  const worldId = gameState.currentWorld.id;
  const highScore = Math.max(...gameState.players.map((p) => p.score));

  if (!gameState.worldProgress[worldId]) {
    gameState.worldProgress[worldId] = {
      unlocked: true,
      completed: false,
      highScore: 0,
    };
  }

  gameState.worldProgress[worldId].completed = true;
  gameState.worldProgress[worldId].highScore = Math.max(
    gameState.worldProgress[worldId].highScore,
    highScore
  );

  // Unlock next world
  const currentWorldIndex = worlds.findIndex((w) => w.id === worldId);
  if (currentWorldIndex < worlds.length - 1) {
    const nextWorldId = worlds[currentWorldIndex + 1].id;
    if (!gameState.worldProgress[nextWorldId]) {
      gameState.worldProgress[nextWorldId] = {
        unlocked: false,
        completed: false,
        highScore: 0,
      };
    }

    // Check unlock condition
    const totalScore = gameState.players.reduce((sum, p) => sum + p.score, 0);
    const nextWorld = worlds[currentWorldIndex + 1];
    const requiredPoints = nextWorld.unlockPoints;

    if (totalScore >= requiredPoints || highScore >= requiredPoints) {
      gameState.worldProgress[nextWorldId].unlocked = true;
      showToast(`🌍 World ${nextWorld.name} terbuka!`, "success");
    } else {
      showToast(
        `🔒 Butuh ${requiredPoints} poin untuk membuka ${nextWorld.name}`,
        "warning"
      );
    }
  }

  showWorldCompleteModal();
}

function showWorldCompleteModal() {
  const sortedPlayers = [...gameState.players].sort(
    (a, b) => b.score - a.score
  );
  const winner = sortedPlayers[0];

  document.getElementById("world-complete-content").innerHTML = `
        <div class="text-5xl mb-3">${winner.token}</div>
        <p class="text-xl text-white font-bold mb-2">${winner.name} Menang!</p>
        <p class="text-violet-300 mb-4">Skor: ${winner.score} poin</p>
        
        <div class="bg-slate-800/50 rounded-xl p-4">
          <h3 class="text-emerald-300 font-bold mb-2">🏆 Peringkat</h3>
          ${sortedPlayers
            .map(
              (p, i) => `
            <div class="flex justify-between py-1 ${
              i === 0 ? "text-amber-400" : "text-violet-200"
            }">
              <span>${i + 1}. ${p.token} ${p.name}</span>
              <span class="font-bold">${p.score}</span>
            </div>
          `
            )
            .join("")}
        </div>
      `;

  const currentWorldIndex = worlds.findIndex(
    (w) => w.id === gameState.currentWorld.id
  );
  const hasNextWorld = currentWorldIndex < worlds.length - 1;
  const nextWorldId = hasNextWorld ? worlds[currentWorldIndex + 1].id : null;
  const nextWorldUnlocked =
    nextWorldId && gameState.worldProgress[nextWorldId]?.unlocked;

  document
    .getElementById("next-world-btn")
    .classList.toggle("hidden", !nextWorldUnlocked);

  const modal = document.getElementById("world-complete-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function nextWorld() {
  const currentWorldIndex = worlds.findIndex(
    (w) => w.id === gameState.currentWorld.id
  );
  if (currentWorldIndex < worlds.length - 1) {
    const nextWorldId = worlds[currentWorldIndex + 1].id;
    document.getElementById("world-complete-modal").classList.add("hidden");
    startWorld(nextWorldId);
  }
}

function restartGame() {
  location.reload();
}

// ==================== SDK INTEGRATION ====================
async function onConfigChange(newConfig) {
  config = { ...defaultConfig, ...newConfig };

  const mainTitle = document.getElementById("main-title");
  if (mainTitle)
    mainTitle.textContent = config.game_title || defaultConfig.game_title;

  const gameTitleDisplay = document.getElementById("game-title-display");
  if (gameTitleDisplay)
    gameTitleDisplay.textContent =
      config.game_title || defaultConfig.game_title;

  if (gameState.players.length > 0) {
    gameState.maxRounds = parseInt(config.max_rounds) || 20;
    document.getElementById("max-round-display").textContent =
      gameState.maxRounds;
  }
}

function mapToCapabilities(cfg) {
  return {
    recolorables: [
      {
        get: () => cfg.background_color || defaultConfig.background_color,
        set: (value) => {
          cfg.background_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ background_color: value });
        },
      },
      {
        get: () => cfg.secondary_color || defaultConfig.secondary_color,
        set: (value) => {
          cfg.secondary_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ secondary_color: value });
        },
      },
      {
        get: () => cfg.text_color || defaultConfig.text_color,
        set: (value) => {
          cfg.text_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ text_color: value });
        },
      },
      {
        get: () => cfg.primary_color || defaultConfig.primary_color,
        set: (value) => {
          cfg.primary_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ primary_color: value });
        },
      },
      {
        get: () => cfg.accent_color || defaultConfig.accent_color,
        set: (value) => {
          cfg.accent_color = value;
          if (window.elementSdk)
            window.elementSdk.setConfig({ accent_color: value });
        },
      },
    ],
    borderables: [],
    fontEditable: undefined,
    fontSizeable: undefined,
  };
}

function mapToEditPanelValues(cfg) {
  return new Map([
    ["game_title", cfg.game_title || defaultConfig.game_title],
    [
      "world_unlock_points",
      cfg.world_unlock_points || defaultConfig.world_unlock_points,
    ],
    ["max_rounds", cfg.max_rounds || defaultConfig.max_rounds],
  ]);
}

// ==================== INITIALIZATION ====================
function init() {
  generateStars();
  setPlayerCount(2);

  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange,
      mapToCapabilities,
      mapToEditPanelValues,
    });
  }
}

init();

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'9bb94e58314adfe3',t:'MTc2ODAxODAzMS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
