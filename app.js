'use strict';

const RVE_VERSION = '3.0.0';
const MAX_RENDER_DIMENSION = 1800;
const DB_NAME = 'ribera-visual-engine-v3';
const DB_VERSION = 1;
const EXPORT_STORE = 'exports';

const DEFAULT_SETTINGS = {
  exposure: 0,
  brightness: 0,
  contrast: 0,
  gamma: 0,
  blackPoint: 0,
  whitePoint: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  midtones: 0,
  clarity: 0,
  dehaze: 0,
  saturation: 0,
  vibrance: 0,
  temperature: 0,
  tint: 0,
  hueShift: 0,
  colorContrast: 0,
  colorWash: 0,
  sepia: 0,
  monochrome: 0,
  red: 0,
  green: 0,
  blue: 0,
  redShadows: 0,
  greenShadows: 0,
  blueShadows: 0,
  redHighlights: 0,
  greenHighlights: 0,
  blueHighlights: 0,
  cyanRed: 0,
  magentaGreen: 0,
  yellowBlue: 0,
  redSat: 0,
  redLum: 0,
  orangeSat: 0,
  orangeLum: 0,
  yellowSat: 0,
  greenSat: 0,
  cyanSat: 0,
  blueSat: 0,
  magentaSat: 0,
  fade: 0,
  matte: 0,
  bleachBypass: 0,
  crossProcess: 0,
  splitToneWarm: 0,
  splitToneCool: 0,
  grain: 0,
  grainSize: 1,
  grainColor: 0,
  dust: 0,
  scratches: 0,
  lightLeak: 0,
  vignette: 0,
  bloom: 0,
  halation: 0,
  chromatic: 0,
  scanlines: 0,
  banding: 0,
  gateWeave: 0,
  edgeBurn: 0,
  chemicalStain: 0,
  posterize: 0,
  threshold: 0,
  blur: 0,
  sharpness: 0
};

const CONTROL_GROUPS = [
  {
    title: 'Luz / Densidad',
    hint: 'Corrección primaria de negativo digital.',
    controls: [
      ['exposure', 'Exposición', -100, 100, 1],
      ['brightness', 'Brillo', -100, 100, 1],
      ['contrast', 'Contraste', -100, 100, 1],
      ['gamma', 'Gamma', -100, 100, 1],
      ['blackPoint', 'Punto negro', -100, 100, 1],
      ['whitePoint', 'Punto blanco', -100, 100, 1]
    ]
  },
  {
    title: 'Tonos / Curva simulada',
    hint: 'Sombras, luces, blancos, negros y microcontraste.',
    controls: [
      ['highlights', 'Altas luces', -100, 100, 1],
      ['shadows', 'Sombras', -100, 100, 1],
      ['whites', 'Blancos', -100, 100, 1],
      ['blacks', 'Negros', -100, 100, 1],
      ['midtones', 'Medios tonos', -100, 100, 1],
      ['clarity', 'Claridad local', -100, 100, 1],
      ['dehaze', 'Dehaze / niebla', -100, 100, 1]
    ]
  },
  {
    title: 'Color global',
    hint: 'Balance base de color y saturación.',
    controls: [
      ['saturation', 'Saturación', -100, 100, 1],
      ['vibrance', 'Vibrance', -100, 100, 1],
      ['temperature', 'Temperatura', -100, 100, 1],
      ['tint', 'Tinte', -100, 100, 1],
      ['hueShift', 'Rotación de tono', -180, 180, 1],
      ['colorContrast', 'Contraste cromático', -100, 100, 1],
      ['colorWash', 'Lavado de color', -100, 100, 1],
      ['sepia', 'Sepia', 0, 100, 1],
      ['monochrome', 'Monocromo', 0, 100, 1]
    ]
  },
  {
    title: 'RGB técnico',
    hint: 'Canales globales, sombras y luces por canal.',
    controls: [
      ['red', 'Rojo global', -100, 100, 1],
      ['green', 'Verde global', -100, 100, 1],
      ['blue', 'Azul global', -100, 100, 1],
      ['redShadows', 'Rojo en sombras', -100, 100, 1],
      ['greenShadows', 'Verde en sombras', -100, 100, 1],
      ['blueShadows', 'Azul en sombras', -100, 100, 1],
      ['redHighlights', 'Rojo en luces', -100, 100, 1],
      ['greenHighlights', 'Verde en luces', -100, 100, 1],
      ['blueHighlights', 'Azul en luces', -100, 100, 1]
    ]
  },
  {
    title: 'Color corrector',
    hint: 'Ejes tipo laboratorio: cyan/rojo, magenta/verde y amarillo/azul.',
    controls: [
      ['cyanRed', 'Cyan ↔ Rojo', -100, 100, 1],
      ['magentaGreen', 'Magenta ↔ Verde', -100, 100, 1],
      ['yellowBlue', 'Amarillo ↔ Azul', -100, 100, 1]
    ]
  },
  {
    title: 'Mezclador HSL',
    hint: 'Ajuste selectivo por familias de color.',
    controls: [
      ['redSat', 'Rojos · saturación', -100, 100, 1],
      ['redLum', 'Rojos · luminosidad', -100, 100, 1],
      ['orangeSat', 'Naranjas · saturación', -100, 100, 1],
      ['orangeLum', 'Naranjas · luminosidad', -100, 100, 1],
      ['yellowSat', 'Amarillos · saturación', -100, 100, 1],
      ['greenSat', 'Verdes · saturación', -100, 100, 1],
      ['cyanSat', 'Cyan · saturación', -100, 100, 1],
      ['blueSat', 'Azules · saturación', -100, 100, 1],
      ['magentaSat', 'Magentas · saturación', -100, 100, 1]
    ]
  },
  {
    title: 'Film stock / Químico',
    hint: 'Emulación estética de película y revelado.',
    controls: [
      ['fade', 'Fade de sombras', 0, 100, 1],
      ['matte', 'Matte print', 0, 100, 1],
      ['bleachBypass', 'Bleach bypass', 0, 100, 1],
      ['crossProcess', 'Cross process', -100, 100, 1],
      ['splitToneWarm', 'Luces cálidas', 0, 100, 1],
      ['splitToneCool', 'Sombras frías', 0, 100, 1],
      ['chemicalStain', 'Mancha química', 0, 100, 1],
      ['edgeBurn', 'Quemado de bordes', 0, 100, 1]
    ]
  },
  {
    title: 'Textura analógica',
    hint: 'Grano, polvo, rayas y errores físicos.',
    controls: [
      ['grain', 'Grano', 0, 100, 1],
      ['grainSize', 'Tamaño de grano', 1, 8, 1],
      ['grainColor', 'Color de grano', -100, 100, 1],
      ['dust', 'Polvo', 0, 100, 1],
      ['scratches', 'Scratches', 0, 100, 1],
      ['lightLeak', 'Fuga de luz', 0, 100, 1],
      ['vignette', 'Viñeta', 0, 100, 1],
      ['bloom', 'Bloom', 0, 100, 1],
      ['halation', 'Halation', 0, 100, 1],
      ['chromatic', 'Aberración cromática', 0, 100, 1]
    ]
  },
  {
    title: 'Video / Scanner Damage',
    hint: 'Errores de transferencia, cinta y escaneo.',
    controls: [
      ['scanlines', 'Scanlines', 0, 100, 1],
      ['banding', 'Banding horizontal', 0, 100, 1],
      ['gateWeave', 'Gate weave', 0, 100, 1],
      ['posterize', 'Posterize', 0, 90, 1],
      ['threshold', 'Threshold / Xerox', 0, 100, 1]
    ]
  },
  {
    title: 'Detalle / Óptica',
    hint: 'Suavidad, nitidez y acabado final.',
    controls: [
      ['blur', 'Soft blur', 0, 30, 1],
      ['sharpness', 'Sharpness', 0, 100, 1]
    ]
  }
];

const BUILT_IN_PRESETS = [
  {
    id: 'ribera-cover-3',
    name: 'Ribera Cover III',
    category: 'Ribera',
    usage: 'Portada',
    description: 'Portada editorial: negros sólidos, piel cálida, grano fino y halation controlado.',
    settings: { exposure: 7, brightness: -3, contrast: 24, gamma: -3, blackPoint: 6, whitePoint: -4, highlights: -18, shadows: 14, whites: 4, blacks: -10, midtones: 6, clarity: 12, dehaze: 8, saturation: -8, vibrance: 10, temperature: 12, tint: 4, hueShift: 0, colorContrast: 10, colorWash: 6, sepia: 4, monochrome: 0, red: 4, green: 0, blue: -5, redShadows: 2, greenShadows: 0, blueShadows: 6, redHighlights: 8, greenHighlights: 3, blueHighlights: -6, cyanRed: 4, magentaGreen: -2, yellowBlue: -6, redSat: 2, redLum: 2, orangeSat: 5, orangeLum: 4, yellowSat: -8, greenSat: -18, cyanSat: -10, blueSat: -14, magentaSat: -6, fade: 10, matte: 8, bleachBypass: 8, crossProcess: 4, splitToneWarm: 16, splitToneCool: 10, grain: 22, grainSize: 2, grainColor: 5, dust: 6, scratches: 2, lightLeak: 3, vignette: 24, bloom: 8, halation: 15, chromatic: 4, scanlines: 0, banding: 0, gateWeave: 0, edgeBurn: 8, chemicalStain: 0, posterize: 0, threshold: 0, blur: 0, sharpness: 20 },
    flags: { border: false, dateStamp: false, texture: true, safeSharpen: true, filmPerfs: false, filmCode: true, chemicalEdge: false, scanlines: false }
  },
  {
    id: 'celluloid-400t',
    name: 'Celluloid 400T',
    category: 'Film',
    usage: 'Foto',
    description: 'Tungsteno nocturno: sombras frías, luces cálidas, grano medio y bloom suave.',
    settings: { exposure: 2, brightness: -5, contrast: 18, gamma: 2, blackPoint: 2, whitePoint: -2, highlights: -16, shadows: 10, whites: 0, blacks: -6, midtones: 2, clarity: 6, dehaze: 4, saturation: -5, vibrance: 12, temperature: -12, tint: 8, hueShift: -3, colorContrast: 12, colorWash: -4, sepia: 0, monochrome: 0, red: 2, green: 0, blue: 8, redShadows: -4, greenShadows: 0, blueShadows: 18, redHighlights: 18, greenHighlights: 8, blueHighlights: -8, cyanRed: -2, magentaGreen: -2, yellowBlue: 10, redSat: 6, redLum: 0, orangeSat: 10, orangeLum: 2, yellowSat: -6, greenSat: -24, cyanSat: 8, blueSat: 14, magentaSat: 8, fade: 18, matte: 14, bleachBypass: 3, crossProcess: -6, splitToneWarm: 22, splitToneCool: 26, grain: 36, grainSize: 3, grainColor: 6, dust: 10, scratches: 4, lightLeak: 6, vignette: 22, bloom: 24, halation: 26, chromatic: 6, scanlines: 0, banding: 0, gateWeave: 1, edgeBurn: 8, chemicalStain: 0, posterize: 0, threshold: 0, blur: 0, sharpness: 8 },
    flags: { border: true, dateStamp: false, texture: true, safeSharpen: true, filmPerfs: true, filmCode: true, chemicalEdge: false, scanlines: false }
  },
  {
    id: 'dirty-contact-sheet',
    name: 'Dirty Contact Sheet',
    category: 'Analog',
    usage: 'Experimental',
    description: 'Hoja de contacto sucia: borde químico, rayas, polvo, fuga y rollo vencido.',
    settings: { exposure: -3, brightness: -9, contrast: 34, gamma: 4, blackPoint: 10, whitePoint: -8, highlights: -26, shadows: 24, whites: -4, blacks: -12, midtones: -2, clarity: 18, dehaze: 12, saturation: -22, vibrance: 4, temperature: 10, tint: 10, hueShift: 2, colorContrast: 14, colorWash: 18, sepia: 8, monochrome: 0, red: 8, green: -2, blue: -8, redShadows: 12, greenShadows: -8, blueShadows: 10, redHighlights: 18, greenHighlights: 4, blueHighlights: -12, cyanRed: 10, magentaGreen: 2, yellowBlue: -14, redSat: 8, redLum: 2, orangeSat: 10, orangeLum: 2, yellowSat: -14, greenSat: -36, cyanSat: -22, blueSat: -24, magentaSat: 4, fade: 28, matte: 24, bleachBypass: 12, crossProcess: 16, splitToneWarm: 24, splitToneCool: 14, grain: 70, grainSize: 4, grainColor: 12, dust: 46, scratches: 42, lightLeak: 34, vignette: 40, bloom: 10, halation: 22, chromatic: 14, scanlines: 0, banding: 6, gateWeave: 2, edgeBurn: 42, chemicalStain: 46, posterize: 0, threshold: 0, blur: 1, sharpness: 4 },
    flags: { border: true, dateStamp: true, texture: true, safeSharpen: false, filmPerfs: true, filmCode: true, chemicalEdge: true, scanlines: false }
  },
  {
    id: 'urban-asphalt',
    name: 'Urban Asphalt',
    category: 'Urban',
    usage: 'Campaña',
    description: 'Calle, cemento y contraste comercial. Sucio, pero vendible.',
    settings: { exposure: 0, brightness: -8, contrast: 46, gamma: -4, blackPoint: 12, whitePoint: -6, highlights: -30, shadows: 6, whites: 8, blacks: -18, midtones: 0, clarity: 28, dehaze: 22, saturation: -24, vibrance: 4, temperature: -7, tint: 3, hueShift: 0, colorContrast: 16, colorWash: -4, sepia: 0, monochrome: 0, red: 2, green: -4, blue: 2, redShadows: 2, greenShadows: -8, blueShadows: 10, redHighlights: 6, greenHighlights: 0, blueHighlights: -4, cyanRed: -4, magentaGreen: 0, yellowBlue: 4, redSat: -4, redLum: 0, orangeSat: -8, orangeLum: 0, yellowSat: -28, greenSat: -55, cyanSat: -30, blueSat: -20, magentaSat: -12, fade: 6, matte: 4, bleachBypass: 18, crossProcess: -2, splitToneWarm: 6, splitToneCool: 18, grain: 28, grainSize: 2, grainColor: -4, dust: 8, scratches: 6, lightLeak: 0, vignette: 34, bloom: 4, halation: 6, chromatic: 8, scanlines: 0, banding: 0, gateWeave: 0, edgeBurn: 10, chemicalStain: 0, posterize: 0, threshold: 0, blur: 0, sharpness: 28 },
    flags: { border: false, dateStamp: false, texture: true, safeSharpen: true, filmPerfs: false, filmCode: false, chemicalEdge: false, scanlines: false }
  },
  {
    id: 'neon-bleed',
    name: 'Neon Bleed',
    category: 'Urban',
    usage: 'Redes',
    description: 'Magenta/cyan nocturno, halation alto y luces que sangran.',
    settings: { exposure: 5, brightness: -5, contrast: 26, gamma: 0, blackPoint: 4, whitePoint: -4, highlights: -20, shadows: 18, whites: 6, blacks: -8, midtones: 2, clarity: 4, dehaze: 0, saturation: 18, vibrance: 22, temperature: -18, tint: 32, hueShift: -8, colorContrast: 28, colorWash: -16, sepia: 0, monochrome: 0, red: 10, green: -4, blue: 16, redShadows: 0, greenShadows: -8, blueShadows: 22, redHighlights: 24, greenHighlights: 0, blueHighlights: -8, cyanRed: -8, magentaGreen: -20, yellowBlue: 22, redSat: 14, redLum: 0, orangeSat: 4, orangeLum: 0, yellowSat: -20, greenSat: -20, cyanSat: 26, blueSat: 26, magentaSat: 32, fade: 12, matte: 8, bleachBypass: 4, crossProcess: -18, splitToneWarm: 12, splitToneCool: 28, grain: 24, grainSize: 2, grainColor: 0, dust: 6, scratches: 5, lightLeak: 14, vignette: 32, bloom: 48, halation: 40, chromatic: 20, scanlines: 0, banding: 8, gateWeave: 0, edgeBurn: 8, chemicalStain: 0, posterize: 0, threshold: 0, blur: 0, sharpness: 10 },
    flags: { border: false, dateStamp: false, texture: true, safeSharpen: true, filmPerfs: false, filmCode: true, chemicalEdge: false, scanlines: false }
  },
  {
    id: 'bw-hard-proof',
    name: 'B&W Hard Proof',
    category: 'Mono',
    usage: 'Editorial',
    description: 'Blanco y negro duro, textura documental y negros con peso.',
    settings: { exposure: 0, brightness: -4, contrast: 58, gamma: -5, blackPoint: 16, whitePoint: -8, highlights: -12, shadows: 18, whites: 16, blacks: -26, midtones: 0, clarity: 32, dehaze: 18, saturation: -100, vibrance: 0, temperature: 0, tint: 0, hueShift: 0, colorContrast: 0, colorWash: 0, sepia: 0, monochrome: 100, red: 0, green: 0, blue: 0, redShadows: 0, greenShadows: 0, blueShadows: 0, redHighlights: 0, greenHighlights: 0, blueHighlights: 0, cyanRed: 0, magentaGreen: 0, yellowBlue: 0, redSat: 0, redLum: 0, orangeSat: 0, orangeLum: 0, yellowSat: 0, greenSat: 0, cyanSat: 0, blueSat: 0, magentaSat: 0, fade: 8, matte: 5, bleachBypass: 24, crossProcess: 0, splitToneWarm: 0, splitToneCool: 0, grain: 42, grainSize: 3, grainColor: -100, dust: 10, scratches: 4, lightLeak: 0, vignette: 28, bloom: 2, halation: 0, chromatic: 0, scanlines: 0, banding: 0, gateWeave: 0, edgeBurn: 12, chemicalStain: 0, posterize: 0, threshold: 0, blur: 0, sharpness: 32 },
    flags: { border: false, dateStamp: false, texture: true, safeSharpen: true, filmPerfs: false, filmCode: true, chemicalEdge: false, scanlines: false }
  },
  {
    id: 'vhs-scanner',
    name: 'VHS Scanner',
    category: 'Analog',
    usage: 'Experimental',
    description: 'Transferencia degradada: scanlines, banding, aberración y color desplazado.',
    settings: { exposure: 2, brightness: -2, contrast: 12, gamma: 4, blackPoint: 0, whitePoint: -2, highlights: -8, shadows: 8, whites: -2, blacks: 0, midtones: 0, clarity: -10, dehaze: -8, saturation: 10, vibrance: 10, temperature: -15, tint: 18, hueShift: 4, colorContrast: 10, colorWash: -4, sepia: 0, monochrome: 0, red: 12, green: -4, blue: 10, redShadows: -6, greenShadows: 4, blueShadows: 14, redHighlights: 12, greenHighlights: -4, blueHighlights: -8, cyanRed: 8, magentaGreen: -6, yellowBlue: 10, redSat: 4, redLum: 0, orangeSat: 0, orangeLum: 0, yellowSat: -8, greenSat: -6, cyanSat: 12, blueSat: 20, magentaSat: 18, fade: 18, matte: 12, bleachBypass: 0, crossProcess: -10, splitToneWarm: 4, splitToneCool: 14, grain: 52, grainSize: 2, grainColor: 0, dust: 12, scratches: 8, lightLeak: 4, vignette: 12, bloom: 10, halation: 8, chromatic: 54, scanlines: 46, banding: 34, gateWeave: 6, edgeBurn: 0, chemicalStain: 0, posterize: 8, threshold: 0, blur: 2, sharpness: 0 },
    flags: { border: false, dateStamp: true, texture: true, safeSharpen: false, filmPerfs: false, filmCode: true, chemicalEdge: false, scanlines: true }
  },
  {
    id: 'clean-grade-pro',
    name: 'Clean Grade Pro',
    category: 'Digital',
    usage: 'Foto',
    description: 'Corrección limpia, profesional y exportable. Útil como base antes de ensuciar.',
    settings: { exposure: 4, brightness: 1, contrast: 12, gamma: -2, blackPoint: 2, whitePoint: -2, highlights: -10, shadows: 12, whites: 4, blacks: -4, midtones: 4, clarity: 10, dehaze: 4, saturation: 4, vibrance: 12, temperature: 2, tint: 0, hueShift: 0, colorContrast: 4, colorWash: 0, sepia: 0, monochrome: 0, red: 0, green: 0, blue: 0, redShadows: 0, greenShadows: 0, blueShadows: 0, redHighlights: 0, greenHighlights: 0, blueHighlights: 0, cyanRed: 0, magentaGreen: 0, yellowBlue: 0, redSat: 0, redLum: 0, orangeSat: 4, orangeLum: 2, yellowSat: 0, greenSat: 0, cyanSat: 0, blueSat: 0, magentaSat: 0, fade: 0, matte: 0, bleachBypass: 0, crossProcess: 0, splitToneWarm: 0, splitToneCool: 0, grain: 0, grainSize: 1, grainColor: 0, dust: 0, scratches: 0, lightLeak: 0, vignette: 4, bloom: 2, halation: 0, chromatic: 0, scanlines: 0, banding: 0, gateWeave: 0, edgeBurn: 0, chemicalStain: 0, posterize: 0, threshold: 0, blur: 0, sharpness: 20 },
    flags: { border: false, dateStamp: false, texture: false, safeSharpen: true, filmPerfs: false, filmCode: false, chemicalEdge: false, scanlines: false }
  }
];

const state = {
  originalImage: null,
  originalName: '',
  naturalWidth: 0,
  naturalHeight: 0,
  settings: { ...DEFAULT_SETTINGS },
  flags: deepFlags(),
  activePresetId: null,
  activePresetName: 'Ajuste manual',
  compare: 50,
  db: null,
  customPresets: [],
  cloudPresets: [],
  cloudProjects: [],
  cloudExports: [],
  renderQueued: false,
  supabase: null,
  cloudReady: false,
  session: null,
  user: null,
  activeProjectId: null,
  sourceFile: null,
  sourcePath: null,
  latestOutputPath: null
};

const $ = (id) => document.getElementById(id);

const els = {
  fileInput: $('fileInput'),
  btnPickFile: $('btnPickFile'),
  btnReset: $('btnReset'),
  btnSaveExport: $('btnSaveExport'),
  btnDownload: $('btnDownload'),
  btnSaveProject: $('btnSaveProject'),
  btnAuth: $('btnAuth'),
  btnLogout: $('btnLogout'),
  btnLogin: $('btnLogin'),
  btnSignup: $('btnSignup'),
  btnSyncPresets: $('btnSyncPresets'),
  btnMigrateLocalPresets: $('btnMigrateLocalPresets'),
  btnRefreshCloud: $('btnRefreshCloud'),
  btnRefreshGallery: $('btnRefreshGallery'),
  btnSavePreset: $('btnSavePreset'),
  btnZeroControls: $('btnZeroControls'),
  btnCopySettings: $('btnCopySettings'),
  btnLoadRecipe: $('btnLoadRecipe'),
  btnApplyRecipe: $('btnApplyRecipe'),
  btnClearGallery: $('btnClearGallery'),
  uploadCard: $('uploadCard'),
  dropZone: $('dropZone'),
  canvasStage: $('canvasStage'),
  emptyState: $('emptyState'),
  originalCanvas: $('originalCanvas'),
  processedCanvas: $('processedCanvas'),
  compareRange: $('compareRange'),
  beforeAfterToggle: $('beforeAfterToggle'),
  splitLine: $('splitLine'),
  fileMeta: $('fileMeta'),
  renderStatus: $('renderStatus'),
  activePresetLabel: $('activePresetLabel'),
  presetGrid: $('presetGrid'),
  presetCategory: $('presetCategory'),
  controlsContainer: $('controlsContainer'),
  controlSearch: $('controlSearch'),
  galleryGrid: $('galleryGrid'),
  galleryMode: $('galleryMode'),
  projectsGrid: $('projectsGrid'),
  recipeOutput: $('recipeOutput'),
  exportRatio: $('exportRatio'),
  presetName: $('presetName'),
  presetDescription: $('presetDescription'),
  presetNewCategory: $('presetNewCategory'),
  presetUsage: $('presetUsage'),
  projectTitle: $('projectTitle'),
  projectNotes: $('projectNotes'),
  cloudDot: $('cloudDot'),
  cloudStatusText: $('cloudStatusText'),
  cloudHint: $('cloudHint'),
  authDialog: $('authDialog'),
  authEmail: $('authEmail'),
  authPassword: $('authPassword'),
  authMessage: $('authMessage'),
  toggleBorder: $('toggleBorder'),
  toggleDateStamp: $('toggleDateStamp'),
  toggleTexture: $('toggleTexture'),
  toggleSafeSharpen: $('toggleSafeSharpen'),
  toggleFilmPerfs: $('toggleFilmPerfs'),
  toggleFilmCode: $('toggleFilmCode'),
  toggleChemicalEdge: $('toggleChemicalEdge'),
  toggleScanlines: $('toggleScanlines'),
  recipeDialog: $('recipeDialog'),
  recipeInput: $('recipeInput')
};

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function deepSettings(settings) {
  return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}

function deepFlags(flags) {
  return {
    border: false,
    dateStamp: false,
    texture: true,
    safeSharpen: true,
    filmPerfs: false,
    filmCode: false,
    chemicalEdge: false,
    scanlines: false,
    ...(flags || {})
  };
}

function getAllPresets() {
  return [...BUILT_IN_PRESETS, ...state.cloudPresets, ...state.customPresets];
}

function saveCustomPresets() {
  localStorage.setItem('rve_custom_presets', JSON.stringify(state.customPresets));
}

function loadCustomPresets() {
  try {
    const raw = localStorage.getItem('rve_custom_presets');
    state.customPresets = raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('No se pudieron cargar presets locales', err);
    state.customPresets = [];
  }
}

function initDB() {
  return new Promise((resolve) => {
    if (!('indexedDB' in window)) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(EXPORT_STORE)) {
        const store = db.createObjectStore(EXPORT_STORE, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

function dbTx(storeName, mode = 'readonly') {
  if (!state.db) return null;
  return state.db.transaction(storeName, mode).objectStore(storeName);
}

function addExportRecord(record) {
  return new Promise((resolve, reject) => {
    const store = dbTx(EXPORT_STORE, 'readwrite');
    if (!store) {
      reject(new Error('IndexedDB no disponible'));
      return;
    }
    const req = store.put(record);
    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

function getExportRecords() {
  return new Promise((resolve) => {
    const store = dbTx(EXPORT_STORE, 'readonly');
    if (!store) {
      resolve([]);
      return;
    }
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result.sort((a, b) => b.createdAt - a.createdAt));
    req.onerror = () => resolve([]);
  });
}

function clearExportRecords() {
  return new Promise((resolve) => {
    const store = dbTx(EXPORT_STORE, 'readwrite');
    if (!store) {
      resolve();
      return;
    }
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
  });
}


function getCloudConfig() {
  return window.RVE_CONFIG || {};
}

function isCloudConfigured() {
  const config = getCloudConfig();
  return Boolean(
    config.CLOUD_ENABLED !== false &&
    config.SUPABASE_URL &&
    /^https:\/\//i.test(config.SUPABASE_URL) &&
    config.SUPABASE_ANON_KEY &&
    config.SUPABASE_ANON_KEY.length > 20
  );
}

function setCloudMessage(message, mode = 'off') {
  if (!els.cloudStatusText || !els.cloudDot) return;
  els.cloudStatusText.textContent = message;
  els.cloudDot.classList.remove('cloud-on', 'cloud-off', 'cloud-error');
  els.cloudDot.classList.add(mode === 'on' ? 'cloud-on' : mode === 'error' ? 'cloud-error' : 'cloud-off');
}

function updateCloudUI() {
  const configured = Boolean(state.cloudReady && state.supabase);
  const logged = Boolean(state.user);
  if (!configured) {
    setCloudMessage('Modo local', 'off');
    if (els.cloudHint) els.cloudHint.innerHTML = 'Configurá Supabase en <code>config.js</code> para activar cuenta, proyectos, presets y assets.';
  } else if (!logged) {
    setCloudMessage('Cloud listo', 'off');
    if (els.cloudHint) els.cloudHint.textContent = 'Supabase está configurado. Iniciá sesión para sincronizar.';
  } else {
    setCloudMessage(state.user.email || 'Conectado', 'on');
    if (els.cloudHint) els.cloudHint.textContent = 'Cuenta conectada. Los proyectos, presets y exportaciones pueden guardarse en Supabase.';
  }

  if (els.btnAuth) els.btnAuth.classList.toggle('hidden', logged || !configured);
  if (els.btnLogout) els.btnLogout.classList.toggle('hidden', !logged);
  if (els.btnSyncPresets) els.btnSyncPresets.disabled = !logged;
  if (els.btnMigrateLocalPresets) els.btnMigrateLocalPresets.disabled = !logged || !state.customPresets.length;
  if (els.btnRefreshCloud) els.btnRefreshCloud.disabled = !logged;
  if (els.btnSaveProject) els.btnSaveProject.disabled = !state.originalImage || !logged;
}

function initSupabaseClient() {
  if (!isCloudConfigured()) {
    state.cloudReady = false;
    updateCloudUI();
    return;
  }
  if (!window.supabase || !window.supabase.createClient) {
    state.cloudReady = false;
    setCloudMessage('SDK no cargó', 'error');
    return;
  }
  const config = getCloudConfig();
  state.supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  state.cloudReady = true;
  updateCloudUI();
}

async function restoreSession() {
  if (!state.supabase) return;
  const { data, error } = await state.supabase.auth.getSession();
  if (error) {
    console.warn('No se pudo leer sesión Supabase', error);
    setCloudMessage('Error sesión', 'error');
    return;
  }
  state.session = data.session || null;
  state.user = state.session?.user || null;
  updateCloudUI();
  state.supabase.auth.onAuthStateChange((_event, session) => {
    state.session = session || null;
    state.user = session?.user || null;
    updateCloudUI();
    if (state.user) loadCloudData();
  });
  if (state.user) await loadCloudData();
}

async function login() {
  if (!state.supabase) return;
  const email = els.authEmail.value.trim();
  const password = els.authPassword.value;
  if (!email || !password) {
    els.authMessage.textContent = 'Completá email y contraseña.';
    return;
  }
  els.authMessage.textContent = 'Validando acceso...';
  const { data, error } = await state.supabase.auth.signInWithPassword({ email, password });
  if (error) {
    els.authMessage.textContent = error.message || 'No se pudo iniciar sesión.';
    return;
  }
  state.session = data.session;
  state.user = data.user;
  els.authDialog.close();
  updateCloudUI();
  await loadCloudData();
  setStatus('Sesión cloud iniciada');
}

async function signup() {
  if (!state.supabase) return;
  const email = els.authEmail.value.trim();
  const password = els.authPassword.value;
  if (!email || !password || password.length < 6) {
    els.authMessage.textContent = 'Usá un email válido y contraseña de 6 caracteres o más.';
    return;
  }
  els.authMessage.textContent = 'Creando cuenta...';
  const { data, error } = await state.supabase.auth.signUp({ email, password });
  if (error) {
    els.authMessage.textContent = error.message || 'No se pudo crear la cuenta.';
    return;
  }
  state.session = data.session || null;
  state.user = data.user || null;
  els.authMessage.textContent = state.session ? 'Cuenta creada e iniciada.' : 'Cuenta creada. Revisá si Supabase exige confirmación de email.';
  updateCloudUI();
  if (state.user) await loadCloudData();
}

async function logout() {
  if (!state.supabase) return;
  await state.supabase.auth.signOut();
  state.session = null;
  state.user = null;
  state.cloudPresets = [];
  state.cloudProjects = [];
  state.cloudExports = [];
  state.activeProjectId = null;
  updateCloudUI();
  renderPresetGrid();
  await renderGallery();
  renderProjects();
  setStatus('Sesión cerrada · modo local');
}

function getBucket() {
  return getCloudConfig().STORAGE_BUCKET || 'ribera-visual-engine';
}

function fileExtensionFromName(name, fallback = 'png') {
  const match = String(name || '').match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : fallback;
}

function safeSlug(value) {
  return String(value || 'ribera')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'ribera';
}

async function canvasToBlob(canvas, type = 'image/png', quality = 0.95) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('No se pudo crear el archivo PNG.')), type, quality);
  });
}

async function uploadBlobToStorage(blob, folder, filename, contentType) {
  if (!state.user || !state.supabase) throw new Error('Sesión cloud no disponible.');
  const random = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  const path = `${state.user.id}/${folder}/${Date.now()}-${random}-${safeSlug(filename)}`;
  const { error } = await state.supabase.storage.from(getBucket()).upload(path, blob, {
    cacheControl: '3600',
    contentType: contentType || blob.type || 'application/octet-stream',
    upsert: false
  });
  if (error) throw error;
  return path;
}

async function signedUrl(path, expiresIn = 3600) {
  if (!path || !state.supabase) return '';
  const { data, error } = await state.supabase.storage.from(getBucket()).createSignedUrl(path, expiresIn);
  if (error) {
    console.warn('No se pudo firmar URL', error);
    return '';
  }
  return data?.signedUrl || '';
}

async function ensureSourceUploaded() {
  if (!state.user || !state.sourceFile || state.sourcePath) return state.sourcePath;
  const ext = fileExtensionFromName(state.sourceFile.name, 'jpg');
  state.sourcePath = await uploadBlobToStorage(state.sourceFile, 'sources', `${state.originalName || 'source'}.${ext}`, state.sourceFile.type);
  return state.sourcePath;
}

async function loadCloudPresets() {
  if (!state.user || !state.supabase) return;
  const { data, error } = await state.supabase
    .from('rve_presets')
    .select('id,name,category,usage,description,settings,flags,is_shared,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  state.cloudPresets = (data || []).map((row) => ({
    id: `cloud_${row.id}`,
    cloudId: row.id,
    cloud: true,
    name: row.name,
    category: row.category || 'Ribera Cloud',
    usage: row.usage || 'Foto',
    description: row.description || 'Preset sincronizado desde Supabase.',
    settings: deepSettings(row.settings),
    flags: deepFlags(row.flags),
    createdAt: row.created_at
  }));
}

async function saveCloudPreset(preset) {
  if (!state.user || !state.supabase) return null;
  const payload = {
    owner_id: state.user.id,
    name: preset.name,
    category: preset.category || 'Ribera',
    usage: preset.usage || 'Foto',
    description: preset.description || '',
    settings: preset.settings || {},
    flags: preset.flags || {},
    is_shared: false
  };
  const { data, error } = await state.supabase.from('rve_presets').insert(payload).select('id').single();
  if (error) throw error;
  await loadCloudPresets();
  renderPresetGrid();
  return data?.id;
}

async function migrateLocalPresets() {
  if (!state.user) {
    els.authDialog.showModal();
    return;
  }
  if (!state.customPresets.length) {
    alert('No hay presets locales para subir.');
    return;
  }
  const ok = confirm(`Se van a subir ${state.customPresets.length} presets locales a Supabase. No se borran del navegador. ¿Continuar?`);
  if (!ok) return;
  try {
    for (const preset of state.customPresets) await saveCloudPreset(preset);
    setStatus('Presets locales subidos a Supabase');
  } catch (err) {
    console.error(err);
    alert('No se pudieron subir todos los presets. Revisá schema, policies y sesión de Supabase.');
  }
}

async function saveCloudProject() {
  if (!state.originalImage) return;
  if (!state.user) {
    if (state.cloudReady) els.authDialog.showModal();
    else alert('Supabase no está configurado. La app puede seguir en modo local.');
    return;
  }
  try {
    const title = els.projectTitle.value.trim() || `${state.originalName || 'Proyecto Ribera'} · ${state.activePresetName}`;
    const sourcePath = await ensureSourceUploaded();
    const payload = {
      owner_id: state.user.id,
      title,
      notes: els.projectNotes.value.trim(),
      source_filename: state.originalName || null,
      source_path: sourcePath || null,
      active_preset_id: getActiveCloudPresetId(),
      recipe: getRecipe(),
      updated_at: new Date().toISOString()
    };
    let result;
    if (state.activeProjectId) {
      result = await state.supabase.from('rve_projects').update(payload).eq('id', state.activeProjectId).select('id').single();
    } else {
      result = await state.supabase.from('rve_projects').insert(payload).select('id').single();
    }
    if (result.error) throw result.error;
    state.activeProjectId = result.data.id;
    await loadCloudProjects();
    renderProjects();
    setStatus('Proyecto guardado en Supabase');
  } catch (err) {
    console.error(err);
    alert('No se pudo guardar el proyecto en Supabase. Revisá que hayas ejecutado el schema V3 completo.');
  }
}

function getActiveCloudPresetId() {
  const preset = getAllPresets().find((item) => item.id === state.activePresetId);
  return preset?.cloudId || null;
}

async function saveCloudExport(record, outputCanvas) {
  if (!state.user || !state.supabase) return null;
  const blob = await canvasToBlob(outputCanvas, 'image/png');
  const outputPath = await uploadBlobToStorage(blob, 'exports', `${record.name}-${record.createdAt}.png`, 'image/png');
  state.latestOutputPath = outputPath;
  const payload = {
    owner_id: state.user.id,
    project_id: state.activeProjectId || null,
    preset_name: record.name,
    ratio: record.ratio,
    width: record.width,
    height: record.height,
    output_path: outputPath,
    recipe: record.recipe
  };
  const { data, error } = await state.supabase.from('rve_exports').insert(payload).select('id').single();
  if (error) throw error;
  return data?.id;
}

async function loadCloudExports() {
  if (!state.user || !state.supabase) return;
  const { data, error } = await state.supabase
    .from('rve_exports')
    .select('id,project_id,preset_name,ratio,width,height,output_path,recipe,created_at')
    .order('created_at', { ascending: false })
    .limit(60);
  if (error) throw error;
  state.cloudExports = data || [];
}

async function loadCloudProjects() {
  if (!state.user || !state.supabase) return;
  const { data, error } = await state.supabase
    .from('rve_projects')
    .select('id,title,notes,source_filename,source_path,recipe,created_at,updated_at')
    .order('updated_at', { ascending: false })
    .limit(40);
  if (error) throw error;
  state.cloudProjects = data || [];
}

async function loadCloudData() {
  if (!state.user) return;
  try {
    await Promise.all([loadCloudPresets(), loadCloudExports(), loadCloudProjects()]);
    renderPresetGrid();
    await renderGallery();
    renderProjects();
    updateCloudUI();
  } catch (err) {
    console.error(err);
    setCloudMessage('Error cloud', 'error');
  }
}

async function renderCloudGallery() {
  if (!state.user) {
    els.galleryGrid.innerHTML = '<p class="small-muted">Iniciá sesión para ver el historial cloud.</p>';
    return;
  }
  if (!state.cloudExports.length) await loadCloudExports();
  if (!state.cloudExports.length) {
    els.galleryGrid.innerHTML = '<p class="small-muted">Todavía no hay exportaciones en Supabase.</p>';
    return;
  }
  const cards = [];
  for (const record of state.cloudExports) {
    const url = await signedUrl(record.output_path, 3600);
    cards.push(`
      <article class="gallery-item">
        ${url ? `<img src="${url}" alt="${escapeHtml(record.preset_name)}" loading="lazy" />` : '<div class="empty-mark">RVE</div>'}
        <div class="gallery-item-body">
          <h3>${escapeHtml(record.preset_name || 'Export cloud')}</h3>
          <p class="cloud-meta">Supabase · ${new Date(record.created_at).toLocaleString('es-AR')} · ${escapeHtml(record.ratio)}</p>
          <div class="gallery-actions">
            ${url ? `<a href="${url}" download="ribera-cloud-${record.id}.png">Bajar</a>` : ''}
            <button type="button" data-cloud-recipe="${escapeHtml(record.id)}">Receta</button>
          </div>
        </div>
      </article>
    `);
  }
  els.galleryGrid.innerHTML = cards.join('');
  els.galleryGrid.querySelectorAll('[data-cloud-recipe]').forEach((button) => {
    button.addEventListener('click', () => {
      const record = state.cloudExports.find((item) => item.id === button.dataset.cloudRecipe);
      if (!record) return;
      els.recipeInput.value = JSON.stringify(record.recipe, null, 2);
      els.recipeDialog.showModal();
    });
  });
}

function renderProjects() {
  if (!els.projectsGrid) return;
  if (!state.user) {
    els.projectsGrid.innerHTML = '<p class="small-muted">Conectá Supabase para guardar y abrir proyectos.</p>';
    return;
  }
  if (!state.cloudProjects.length) {
    els.projectsGrid.innerHTML = '<p class="small-muted">Todavía no hay proyectos cloud.</p>';
    return;
  }
  els.projectsGrid.innerHTML = state.cloudProjects.map((project) => `
    <article class="project-card">
      <span class="cloud-tag">Cloud</span>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.source_filename || 'Sin archivo fuente')} · ${new Date(project.updated_at || project.created_at).toLocaleDateString('es-AR')}</p>
      <div class="mini-actions">
        <button class="ghost-btn" type="button" data-open-project="${escapeHtml(project.id)}">Abrir</button>
      </div>
    </article>
  `).join('');
  els.projectsGrid.querySelectorAll('[data-open-project]').forEach((button) => {
    button.addEventListener('click', () => openCloudProject(button.dataset.openProject));
  });
}

async function openCloudProject(projectId) {
  const project = state.cloudProjects.find((item) => item.id === projectId);
  if (!project) return;
  state.activeProjectId = project.id;
  els.projectTitle.value = project.title || '';
  els.projectNotes.value = project.notes || '';
  if (project.recipe?.settings) {
    state.settings = deepSettings(project.recipe.settings);
    state.flags = deepFlags(project.recipe.flags);
    state.activePresetId = null;
    state.activePresetName = project.recipe.name || 'Proyecto cloud';
    if (project.recipe.exportRatio) els.exportRatio.value = project.recipe.exportRatio;
  }
  updateControlValues();
  if (project.source_path) await loadImageFromStorage(project.source_path, project.source_filename || project.title || 'proyecto-ribera.png');
  renderPresetGrid();
  queueRender();
  setStatus('Proyecto cloud cargado');
}

async function loadImageFromStorage(path, filename) {
  const url = await signedUrl(path, 3600);
  if (!url) throw new Error('No se pudo abrir el archivo fuente.');
  const response = await fetch(url);
  if (!response.ok) throw new Error('No se pudo descargar el archivo fuente.');
  const blob = await response.blob();
  const file = new File([blob], filename, { type: blob.type || 'image/png' });
  await loadFile(file);
  state.sourcePath = path;
}

function renderControls() {
  const q = (els.controlSearch?.value || '').trim().toLowerCase();
  const groups = CONTROL_GROUPS.map((group) => {
    const controls = group.controls.filter((ctrl) => {
      if (!q) return true;
      return group.title.toLowerCase().includes(q) || ctrl[1].toLowerCase().includes(q) || ctrl[0].toLowerCase().includes(q);
    });
    return { ...group, controls };
  }).filter((group) => group.controls.length);

  els.controlsContainer.innerHTML = groups.map((group, index) => `
    <details class="control-group" ${index < 3 || q ? 'open' : ''}>
      <summary class="control-group-title">
        <span>${escapeHtml(group.title)}</span>
        <small>${escapeHtml(group.hint || '')}</small>
      </summary>
      ${group.controls.map(([key, label, min, max, step]) => `
        <div class="slider-row">
          <label for="ctrl_${key}"><span>${escapeHtml(label)}</span><span class="value-pill" id="value_${key}">${state.settings[key]}</span></label>
          <input id="ctrl_${key}" data-control="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state.settings[key]}" />
        </div>
      `).join('')}
    </details>
  `).join('') || '<p class="small-muted">No se encontraron controles con ese filtro.</p>';

  els.controlsContainer.querySelectorAll('[data-control]').forEach((input) => {
    input.addEventListener('input', () => {
      const key = input.dataset.control;
      state.settings[key] = Number(input.value);
      state.activePresetId = null;
      state.activePresetName = 'Ajuste manual';
      updateControlValues();
      renderPresetGrid();
      queueRender();
    });
  });
}

function updateControlValues() {
  Object.keys(DEFAULT_SETTINGS).forEach((key) => {
    const input = $(`ctrl_${key}`);
    const value = $(`value_${key}`);
    if (input) input.value = state.settings[key];
    if (value) value.textContent = state.settings[key];
  });
  if (els.toggleBorder) els.toggleBorder.checked = Boolean(state.flags.border);
  if (els.toggleDateStamp) els.toggleDateStamp.checked = Boolean(state.flags.dateStamp);
  if (els.toggleTexture) els.toggleTexture.checked = Boolean(state.flags.texture);
  if (els.toggleSafeSharpen) els.toggleSafeSharpen.checked = Boolean(state.flags.safeSharpen);
  if (els.toggleFilmPerfs) els.toggleFilmPerfs.checked = Boolean(state.flags.filmPerfs);
  if (els.toggleFilmCode) els.toggleFilmCode.checked = Boolean(state.flags.filmCode);
  if (els.toggleChemicalEdge) els.toggleChemicalEdge.checked = Boolean(state.flags.chemicalEdge);
  if (els.toggleScanlines) els.toggleScanlines.checked = Boolean(state.flags.scanlines);
  els.activePresetLabel.textContent = state.activePresetName || 'Ajuste manual';
  updateRecipeOutput();
}

function renderPresetCategories() {
  const current = els.presetCategory.value || 'all';
  const categories = [...new Set(getAllPresets().map((preset) => preset.category))].sort();
  els.presetCategory.innerHTML = '<option value="all">Todos</option>' + categories.map((cat) => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('');
  els.presetCategory.value = categories.includes(current) ? current : 'all';
}

function renderPresetGrid() {
  renderPresetCategories();
  const category = els.presetCategory.value;
  const presets = getAllPresets().filter((preset) => category === 'all' || preset.category === category);
  els.presetGrid.innerHTML = presets.map((preset) => {
    const isCustom = preset.custom === true;
    const isCloud = preset.cloud === true;
    return `
      <button class="preset-card ${state.activePresetId === preset.id ? 'active' : ''}" type="button" data-preset-id="${escapeHtml(preset.id)}">
        <div class="meta">
          <span class="badge">${escapeHtml(preset.category)}</span>
          <span class="badge">${escapeHtml(preset.usage || 'Foto')}</span>
          ${isCloud ? '<span class="badge cloud-meta">Cloud</span>' : isCustom ? '<span class="badge">Local</span>' : ''}
        </div>
        <h3>${escapeHtml(preset.name)} ${isCustom ? `<span class="delete-preset" data-delete-preset="${escapeHtml(preset.id)}" title="Eliminar preset">✕</span>` : ''}</h3>
        <p>${escapeHtml(preset.description || 'Preset visual personalizado.')}</p>
      </button>
    `;
  }).join('');

  els.presetGrid.querySelectorAll('[data-preset-id]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const deleteTarget = event.target.closest('[data-delete-preset]');
      if (deleteTarget) {
        event.stopPropagation();
        deleteCustomPreset(deleteTarget.dataset.deletePreset);
        return;
      }
      applyPreset(button.dataset.presetId);
    });
  });
}

function deleteCustomPreset(id) {
  const preset = state.customPresets.find((item) => item.id === id);
  if (!preset) return;
  const ok = confirm(`¿Eliminar el preset "${preset.name}"?`);
  if (!ok) return;
  state.customPresets = state.customPresets.filter((item) => item.id !== id);
  saveCustomPresets();
  if (state.activePresetId === id) {
    state.activePresetId = null;
    state.activePresetName = 'Ajuste manual';
  }
  renderPresetGrid();
}

function applyPreset(id) {
  const preset = getAllPresets().find((item) => item.id === id);
  if (!preset) return;
  state.settings = deepSettings(preset.settings);
  state.flags = deepFlags(preset.flags);
  state.activePresetId = preset.id;
  state.activePresetName = preset.name;
  updateControlValues();
  renderPresetGrid();
  queueRender();
}

function resetAll() {
  state.settings = { ...DEFAULT_SETTINGS };
  state.flags = deepFlags();
  state.activePresetId = null;
  state.activePresetName = 'Ajuste manual';
  updateControlValues();
  renderPresetGrid();
  queueRender();
}

function neutralizeControls() {
  state.settings = { ...DEFAULT_SETTINGS };
  state.activePresetId = null;
  state.activePresetName = 'Ajuste neutral';
  updateControlValues();
  renderPresetGrid();
  queueRender();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function enableEditing(enabled) {
  els.btnSaveExport.disabled = !enabled;
  els.btnSaveProject.disabled = !enabled || !state.user;
  els.btnDownload.disabled = !enabled;
  els.btnSavePreset.disabled = !enabled;
  els.btnZeroControls.disabled = !enabled;
  els.btnCopySettings.disabled = !enabled;
}

function setStatus(text) {
  els.renderStatus.textContent = text;
}

async function loadFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    alert('La V3 acepta imágenes PNG, JPG o WEBP. Video queda para una versión posterior con pipeline específico.');
    return;
  }

  state.sourceFile = file;
  state.sourcePath = null;
  state.latestOutputPath = null;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    state.originalImage = img;
    state.originalName = file.name;
    state.naturalWidth = img.naturalWidth;
    state.naturalHeight = img.naturalHeight;
    els.fileMeta.textContent = `${file.name} · ${img.naturalWidth}×${img.naturalHeight}px`;
    els.emptyState.classList.add('hidden');
    els.canvasStage.classList.remove('hidden');
    els.compareRange.classList.remove('hidden');
    enableEditing(true);
    updateCloudUI();
    drawOriginal();
    queueRender();
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    alert('No se pudo abrir la imagen. Probá con PNG, JPG o WEBP.');
  };
  img.src = url;
}

function computeCanvasSize(width, height) {
  const maxSide = Math.max(width, height);
  if (maxSide <= MAX_RENDER_DIMENSION) return { width, height };
  const ratio = MAX_RENDER_DIMENSION / maxSide;
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}

function drawOriginal() {
  if (!state.originalImage) return;
  const { width, height } = computeCanvasSize(state.naturalWidth, state.naturalHeight);
  [els.originalCanvas, els.processedCanvas].forEach((canvas) => {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  });
  const ctx = els.originalCanvas.getContext('2d', { willReadFrequently: true });
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(state.originalImage, 0, 0, width, height);
  syncOriginalLayerSize();
  updateCompareClip();
}

function syncOriginalLayerSize() {
  requestAnimationFrame(() => {
    const processedRect = els.processedCanvas.getBoundingClientRect();
    const stageRect = els.canvasStage.getBoundingClientRect();
    const left = processedRect.left - stageRect.left;
    const top = processedRect.top - stageRect.top;
    els.originalCanvas.style.left = `${left}px`;
    els.originalCanvas.style.top = `${top}px`;
    els.originalCanvas.style.width = `${processedRect.width}px`;
    els.originalCanvas.style.height = `${processedRect.height}px`;
    els.originalCanvas.style.right = 'auto';
    els.originalCanvas.style.bottom = 'auto';
    els.splitLine.style.left = `${left + processedRect.width * state.compare / 100}px`;
    els.splitLine.style.top = `${top}px`;
    els.splitLine.style.bottom = `${stageRect.height - top - processedRect.height}px`;
  });
}

function updateCompareClip() {
  state.compare = Number(els.compareRange.value);
  const enabled = els.beforeAfterToggle.checked && state.originalImage;
  els.originalCanvas.style.display = enabled ? 'block' : 'none';
  els.splitLine.style.display = enabled ? 'block' : 'none';
  els.compareRange.style.display = enabled ? 'block' : 'none';
  els.originalCanvas.style.clipPath = `inset(0 ${100 - state.compare}% 0 0)`;
  syncOriginalLayerSize();
}

function queueRender() {
  if (!state.originalImage) return;
  if (state.renderQueued) return;
  state.renderQueued = true;
  setStatus('Renderizando receta visual...');
  requestAnimationFrame(() => {
    state.renderQueued = false;
    renderImage();
  });
}

function renderImage() {
  if (!state.originalImage) return;
  const width = els.processedCanvas.width;
  const height = els.processedCanvas.height;
  const ctx = els.processedCanvas.getContext('2d', { willReadFrequently: true });
  const s = state.settings;

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  const weave = s.gateWeave > 0 ? Math.sin(Date.now() / 180) * Math.min(5, s.gateWeave / 10) : 0;
  ctx.filter = s.blur > 0 ? `blur(${s.blur * 0.34}px)` : 'none';
  ctx.drawImage(state.originalImage, weave, 0, width, height);
  ctx.restore();

  let imageData = ctx.getImageData(0, 0, width, height);
  imageData = applyBaseAdjustments(imageData, s);

  if (s.posterize > 0) imageData = applyPosterize(imageData, s.posterize);
  if (s.threshold > 0) imageData = applyThreshold(imageData, s.threshold);
  if (s.sharpness > 0 && state.flags.safeSharpen) imageData = applySharpen(imageData, Math.min(1, (s.sharpness + Math.max(0, s.clarity) * 0.35) / 100));
  if (s.chromatic > 0) imageData = applyChromatic(imageData, Math.round(s.chromatic / 12));
  ctx.putImageData(imageData, 0, 0);

  if (s.bloom > 0) applyBloom(ctx, width, height, s.bloom);
  if (s.halation > 0) applyHalation(ctx, width, height, s.halation);
  if (state.flags.texture && s.lightLeak > 0) applyLightLeak(ctx, width, height, s.lightLeak);
  if (state.flags.texture && s.chemicalStain > 0) applyChemicalStain(ctx, width, height, s.chemicalStain);
  if (state.flags.texture && s.grain > 0) applyGrain(ctx, width, height, s.grain, s.grainSize, s.grainColor);
  if (state.flags.texture && s.dust > 0) applyDust(ctx, width, height, s.dust);
  if (state.flags.texture && s.scratches > 0) applyScratches(ctx, width, height, s.scratches);
  if ((state.flags.scanlines || s.scanlines > 0) && s.scanlines > 0) applyScanlines(ctx, width, height, s.scanlines);
  if (s.banding > 0) applyBanding(ctx, width, height, s.banding);
  if (s.edgeBurn > 0 || state.flags.chemicalEdge) applyEdgeBurn(ctx, width, height, Math.max(s.edgeBurn, state.flags.chemicalEdge ? 22 : 0));
  if (s.vignette > 0) applyVignette(ctx, width, height, s.vignette);
  if (state.flags.border) applyFilmBorder(ctx, width, height);
  if (state.flags.filmPerfs) applyFilmPerforations(ctx, width, height);
  if (state.flags.filmCode) applyFilmCode(ctx, width, height);
  if (state.flags.dateStamp) applyDateStamp(ctx, width, height);

  updateControlValues();
  updateCompareClip();
  setStatus(`Listo · ${state.activePresetName || 'Ajuste manual'}`);
}

function applyBaseAdjustments(imageData, settings) {
  const data = imageData.data;
  const exposureFactor = Math.pow(2, settings.exposure / 80);
  const brightnessAdd = settings.brightness * 1.55;
  const contrastValue = clamp(settings.contrast * 1.75 + settings.dehaze * 0.7, -245, 245);
  const contrastFactor = (259 * (contrastValue + 255)) / (255 * (259 - contrastValue));
  const gamma = Math.pow(2, -settings.gamma / 100);
  const satBase = 1 + settings.saturation / 100;
  const vibrance = settings.vibrance / 100;
  const temp = settings.temperature * 0.46;
  const tint = settings.tint * 0.36;
  const fade = settings.fade / 100;
  const matte = settings.matte / 100;
  const bleach = settings.bleachBypass / 100;
  const cross = settings.crossProcess / 100;
  const mono = settings.monochrome / 100;
  const sepia = settings.sepia / 100;
  const colorContrast = settings.colorContrast / 100;
  const colorWash = settings.colorWash / 100;
  const bp = settings.blackPoint * 1.18;
  const wp = 255 - settings.whitePoint * 1.18;
  const range = Math.max(8, wp - bp);

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    r = ((r - bp) / range) * 255;
    g = ((g - bp) / range) * 255;
    b = ((b - bp) / range) * 255;

    r *= exposureFactor;
    g *= exposureFactor;
    b *= exposureFactor;

    r += brightnessAdd;
    g += brightnessAdd;
    b += brightnessAdd;

    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    if (gamma !== 1) {
      r = 255 * Math.pow(clamp(r) / 255, gamma);
      g = 255 * Math.pow(clamp(g) / 255, gamma);
      b = 255 * Math.pow(clamp(b) / 255, gamma);
    }

    let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const highlightMask = smoothstep(132, 255, lum);
    const shadowMask = 1 - smoothstep(0, 135, lum);
    const whiteMask = smoothstep(205, 255, lum);
    const blackMask = 1 - smoothstep(0, 70, lum);
    const midMask = 1 - Math.abs((lum - 128) / 128);

    const toneAdd =
      settings.highlights * 0.48 * highlightMask +
      settings.shadows * 0.52 * shadowMask +
      settings.whites * 0.55 * whiteMask +
      settings.blacks * 0.6 * blackMask +
      settings.midtones * 0.48 * midMask;
    r += toneAdd;
    g += toneAdd;
    b += toneAdd;

    r += temp - tint * 0.23;
    g += tint;
    b -= temp + tint * 0.23;

    r *= 1 + settings.red / 120;
    g *= 1 + settings.green / 120;
    b *= 1 + settings.blue / 120;

    r += settings.redShadows * 0.72 * shadowMask + settings.redHighlights * 0.72 * highlightMask;
    g += settings.greenShadows * 0.72 * shadowMask + settings.greenHighlights * 0.72 * highlightMask;
    b += settings.blueShadows * 0.72 * shadowMask + settings.blueHighlights * 0.72 * highlightMask;

    r += settings.cyanRed * 0.65;
    g += settings.magentaGreen * 0.65;
    b += settings.yellowBlue * 0.65;
    r -= settings.yellowBlue * 0.18;
    b -= settings.cyanRed * 0.18;

    if (cross !== 0) {
      r += cross * 22 * highlightMask;
      g += cross * -12 * midMask;
      b += cross * -22 * shadowMask;
    }

    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r += settings.splitToneWarm * 0.38 * highlightMask;
    g += settings.splitToneWarm * 0.16 * highlightMask;
    b -= settings.splitToneWarm * 0.25 * highlightMask;
    r -= settings.splitToneCool * 0.18 * shadowMask;
    g += settings.splitToneCool * 0.06 * shadowMask;
    b += settings.splitToneCool * 0.45 * shadowMask;

    let hsl = rgbToHsl(clamp(r), clamp(g), clamp(b));
    hsl.h = (hsl.h + settings.hueShift + 360) % 360;

    const chroma = hsl.s;
    const vibBoost = vibrance > 0 ? vibrance * (1 - chroma) * 0.65 : vibrance * 0.45;
    hsl.s = clamp01(hsl.s * satBase + vibBoost + colorContrast * (hsl.s - 0.35) * 0.42);

    hsl = applySelectiveHsl(hsl, settings);

    if (settings.clarity !== 0) {
      const c = settings.clarity / 100;
      hsl.l = clamp01(hsl.l + (hsl.l - 0.5) * c * 0.22);
    }

    if (settings.dehaze !== 0) {
      const d = settings.dehaze / 100;
      hsl.s = clamp01(hsl.s + d * 0.12);
      hsl.l = clamp01(hsl.l + (hsl.l - 0.5) * d * 0.14);
    }

    [r, g, b] = hslToRgb(hsl.h, hsl.s, hsl.l);

    if (bleach > 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = mix(r, gray + (r - gray) * 1.32, bleach * 0.82);
      g = mix(g, gray + (g - gray) * 1.32, bleach * 0.82);
      b = mix(b, gray + (b - gray) * 1.32, bleach * 0.82);
      const cf = 1 + bleach * 0.42;
      r = (r - 128) * cf + 128;
      g = (g - 128) * cf + 128;
      b = (b - 128) * cf + 128;
    }

    if (mono > 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = mix(r, gray, mono);
      g = mix(g, gray, mono);
      b = mix(b, gray, mono);
    }

    if (sepia > 0) {
      const sr = r * 0.393 + g * 0.769 + b * 0.189;
      const sg = r * 0.349 + g * 0.686 + b * 0.168;
      const sb = r * 0.272 + g * 0.534 + b * 0.131;
      r = mix(r, sr, sepia * 0.75);
      g = mix(g, sg, sepia * 0.75);
      b = mix(b, sb, sepia * 0.75);
    }

    if (colorWash !== 0) {
      const wash = Math.abs(colorWash);
      const wr = colorWash > 0 ? 175 : 90;
      const wg = colorWash > 0 ? 126 : 130;
      const wb = colorWash > 0 ? 82 : 170;
      r = mix(r, wr, wash * 0.10);
      g = mix(g, wg, wash * 0.10);
      b = mix(b, wb, wash * 0.10);
    }

    if (fade > 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const shadowLift = (1 - smoothstep(50, 220, gray)) * fade * 46;
      r = r * (1 - fade * 0.08) + shadowLift;
      g = g * (1 - fade * 0.08) + shadowLift;
      b = b * (1 - fade * 0.08) + shadowLift;
    }

    if (matte > 0) {
      r = mix(r, 132, matte * 0.10);
      g = mix(g, 126, matte * 0.10);
      b = mix(b, 112, matte * 0.10);
    }

    data[i] = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
  }
  return imageData;
}

function applySelectiveHsl(hsl, settings) {
  const h = hsl.h;
  const red = hueWeight(h, 0, 24) + hueWeight(h, 360, 24);
  const orange = hueWeight(h, 32, 26);
  const yellow = hueWeight(h, 58, 24);
  const green = hueWeight(h, 118, 46);
  const cyan = hueWeight(h, 185, 36);
  const blue = hueWeight(h, 230, 42);
  const magenta = hueWeight(h, 302, 48);
  hsl.s = clamp01(hsl.s + red * settings.redSat / 170 + orange * settings.orangeSat / 170 + yellow * settings.yellowSat / 170 + green * settings.greenSat / 170 + cyan * settings.cyanSat / 170 + blue * settings.blueSat / 170 + magenta * settings.magentaSat / 170);
  hsl.l = clamp01(hsl.l + red * settings.redLum / 260 + orange * settings.orangeLum / 260);
  return hsl;
}

function hueWeight(h, center, width) {
  const d = Math.min(Math.abs(h - center), 360 - Math.abs(h - center));
  return clamp(1 - d / width, 0, 1);
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}

function clamp01(value) { return Math.max(0, Math.min(1, value)); }
function mix(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function applyPosterize(imageData, amount) {
  const data = imageData.data;
  const levels = Math.max(2, Math.round(18 - amount / 6));
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step;
    data[i + 1] = Math.round(data[i + 1] / step) * step;
    data[i + 2] = Math.round(data[i + 2] / step) * step;
  }
  return imageData;
}

function applyThreshold(imageData, amount) {
  const data = imageData.data;
  const t = 128 + (amount - 50) * 2.1;
  const blend = Math.min(1, amount / 100);
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const v = lum > t ? 255 : 0;
    data[i] = mix(data[i], v, blend);
    data[i + 1] = mix(data[i + 1], v, blend);
    data[i + 2] = mix(data[i + 2], v, blend);
  }
  return imageData;
}

function applySharpen(imageData, amount) {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const out = new Uint8ClampedArray(src);
  const strength = Math.min(1.25, amount * 1.2);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        const center = src[idx + c] * (1 + 4 * strength);
        const top = src[((y - 1) * width + x) * 4 + c] * strength;
        const bottom = src[((y + 1) * width + x) * 4 + c] * strength;
        const left = src[(y * width + (x - 1)) * 4 + c] * strength;
        const right = src[(y * width + (x + 1)) * 4 + c] * strength;
        out[idx + c] = clamp(center - top - bottom - left - right);
      }
    }
  }
  return new ImageData(out, width, height);
}

function applyChromatic(imageData, shift) {
  if (shift <= 0) return imageData;
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const out = new Uint8ClampedArray(src);
  const effectiveShift = Math.min(12, shift);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const rX = clamp(x - effectiveShift, 0, width - 1);
      const bX = clamp(x + effectiveShift, 0, width - 1);
      out[idx] = src[(y * width + rX) * 4];
      out[idx + 2] = src[(y * width + bX) * 4 + 2];
    }
  }
  return new ImageData(out, width, height);
}

function snapshotCanvas() {
  const temp = document.createElement('canvas');
  temp.width = els.processedCanvas.width;
  temp.height = els.processedCanvas.height;
  temp.getContext('2d').drawImage(els.processedCanvas, 0, 0);
  return temp;
}

function applyBloom(ctx, width, height, value) {
  const temp = snapshotCanvas();
  ctx.save();
  ctx.globalAlpha = value / 175;
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = `blur(${Math.max(2, value / 7)}px) brightness(1.12)`;
  ctx.drawImage(temp, 0, 0);
  ctx.restore();
}

function applyHalation(ctx, width, height, value) {
  const temp = snapshotCanvas();
  ctx.save();
  ctx.globalAlpha = value / 210;
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = `blur(${Math.max(2, value / 7)}px) sepia(1) saturate(1.75) hue-rotate(-18deg)`;
  ctx.drawImage(temp, 0, 0);
  ctx.restore();
}

function applyGrain(ctx, width, height, value, size = 1, color = 0) {
  const grainCanvas = document.createElement('canvas');
  const block = Math.max(1, Number(size) || 1);
  grainCanvas.width = Math.ceil(width / block);
  grainCanvas.height = Math.ceil(height / block);
  const gctx = grainCanvas.getContext('2d');
  const imageData = gctx.createImageData(grainCanvas.width, grainCanvas.height);
  const data = imageData.data;
  const intensity = value * 1.55;
  const colorBias = color / 100;
  for (let i = 0; i < data.length; i += 4) {
    const n = 128 + (Math.random() - 0.5) * intensity;
    data[i] = clamp(n + 20 * colorBias);
    data[i + 1] = clamp(n + 4 * colorBias);
    data[i + 2] = clamp(n - 18 * colorBias);
    data[i + 3] = value * 1.05;
  }
  gctx.putImageData(imageData, 0, 0);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(grainCanvas, 0, 0, width, height);
  ctx.restore();
}

function applyDust(ctx, width, height, value) {
  const count = Math.round((width * height / 105000) * value);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 2.2 + 0.35;
    const alpha = Math.random() * 0.24 + 0.04;
    ctx.fillStyle = `rgba(255,245,220,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function applyScratches(ctx, width, height, value) {
  const count = Math.round(value / 5);
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const len = height * (Math.random() * 0.38 + 0.08);
    const alpha = Math.random() * 0.2 + 0.04;
    ctx.strokeStyle = `rgba(255,235,205,${alpha})`;
    ctx.lineWidth = Math.random() * 1.4 + 0.25;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + Math.random() * 12 - 6, y + len * 0.3, x + Math.random() * 12 - 6, y + len * 0.7, x + Math.random() * 12 - 6, y + len);
    ctx.stroke();
  }
  ctx.restore();
}

function applyLightLeak(ctx, width, height, value) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const x = Math.random() > 0.5 ? 0 : width;
  const gradient = ctx.createRadialGradient(x, height * 0.25, 0, x, height * 0.25, Math.max(width, height) * 0.78);
  gradient.addColorStop(0, `rgba(255, 92, 42, ${value / 120})`);
  gradient.addColorStop(0.32, `rgba(255, 190, 76, ${value / 380})`);
  gradient.addColorStop(1, 'rgba(255, 120, 30, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function applyChemicalStain(ctx, width, height, value) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const count = Math.max(1, Math.round(value / 18));
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.min(width, height) * (Math.random() * 0.22 + 0.12);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255, 210, 120, ${value / 560})`);
    gradient.addColorStop(0.46, `rgba(160, 70, 40, ${value / 900})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

function applyScanlines(ctx, width, height, value) {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  const step = Math.max(2, Math.round(8 - value / 18));
  ctx.fillStyle = `rgba(0,0,0,${value / 520})`;
  for (let y = 0; y < height; y += step) ctx.fillRect(0, y, width, 1);
  ctx.restore();
}

function applyBanding(ctx, width, height, value) {
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  for (let y = 0; y < height; y += 12) {
    const alpha = (Math.sin(y * 0.08) + 1) * value / 1700;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(0, y, width, 3);
  }
  ctx.restore();
}

function applyEdgeBurn(ctx, width, height, value) {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  const edge = Math.min(width, height) * 0.16;
  const g1 = ctx.createLinearGradient(0, 0, edge, 0);
  g1.addColorStop(0, `rgba(75, 24, 8, ${value / 140})`);
  g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, edge, height);
  const g2 = ctx.createLinearGradient(width, 0, width - edge, 0);
  g2.addColorStop(0, `rgba(75, 24, 8, ${value / 180})`);
  g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g2;
  ctx.fillRect(width - edge, 0, edge, height);
  ctx.restore();
}

function applyVignette(ctx, width, height, value) {
  const radius = Math.max(width, height) * 0.72;
  const gradient = ctx.createRadialGradient(width / 2, height / 2, radius * 0.22, width / 2, height / 2, radius);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.72, `rgba(0,0,0,${value / 560})`);
  gradient.addColorStop(1, `rgba(0,0,0,${value / 135})`);
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function applyFilmBorder(ctx, width, height) {
  const border = Math.max(18, Math.round(Math.min(width, height) * 0.034));
  ctx.save();
  ctx.strokeStyle = 'rgba(8, 7, 6, .95)';
  ctx.lineWidth = border;
  ctx.strokeRect(border / 2, border / 2, width - border, height - border);
  ctx.strokeStyle = 'rgba(255, 238, 190, .18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(border + 2, border + 2, width - border * 2 - 4, height - border * 2 - 4);
  ctx.restore();
}

function applyFilmPerforations(ctx, width, height) {
  const perfW = Math.max(10, Math.round(width * 0.018));
  const perfH = Math.max(22, Math.round(height * 0.055));
  const xPad = Math.max(10, Math.round(width * 0.018));
  const gap = perfH * 1.75;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.82)';
  ctx.strokeStyle = 'rgba(255,255,255,.08)';
  ctx.lineWidth = 1;
  for (let y = perfH * 0.65; y < height - perfH; y += gap) {
    roundedRect(ctx, xPad, y, perfW, perfH, 3);
    ctx.fill(); ctx.stroke();
    roundedRect(ctx, width - xPad - perfW, y, perfW, perfH, 3);
    ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function applyFilmCode(ctx, width, height) {
  const label = `RIBERA VISUAL ENGINE  ·  ${state.activePresetName || 'MANUAL'}  ·  ${new Date().getFullYear()}`.toUpperCase();
  const fontSize = Math.max(10, Math.round(width * 0.014));
  ctx.save();
  ctx.font = `800 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.fillStyle = 'rgba(245, 190, 87, .7)';
  ctx.shadowColor = 'rgba(0,0,0,.55)';
  ctx.shadowBlur = 4;
  ctx.fillText(label, Math.round(width * 0.04), Math.round(height * 0.045));
  ctx.restore();
}

function applyDateStamp(ctx, width, height) {
  const d = new Date();
  const stamp = `${String(d.getDate()).padStart(2, '0')} ${String(d.getMonth() + 1).padStart(2, '0')} '${String(d.getFullYear()).slice(-2)}`;
  const fontSize = Math.max(14, Math.round(width * 0.028));
  ctx.save();
  ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textBaseline = 'bottom';
  ctx.shadowColor = 'rgba(0,0,0,.55)';
  ctx.shadowBlur = 5;
  ctx.fillStyle = 'rgba(255, 128, 55, .88)';
  ctx.fillText(stamp, Math.round(width * 0.045), height - Math.round(height * 0.045));
  ctx.restore();
}

function getRecipe() {
  return {
    app: 'Ribera Visual Engine',
    version: RVE_VERSION,
    name: state.activePresetName || 'Ajuste manual',
    settings: { ...state.settings },
    flags: { ...state.flags },
    exportRatio: els.exportRatio.value
  };
}

function updateRecipeOutput() {
  if (!state.originalImage) {
    els.recipeOutput.textContent = 'Sin imagen cargada.';
    return;
  }
  els.recipeOutput.textContent = JSON.stringify(getRecipe(), null, 2);
}

function exportCanvasWithRatio() {
  const source = els.processedCanvas;
  const ratio = els.exportRatio.value;
  if (ratio === 'original') return source;

  const [rw, rh] = ratio.split(':').map(Number);
  const targetRatio = rw / rh;
  const currentRatio = source.width / source.height;
  let sx = 0;
  let sy = 0;
  let sw = source.width;
  let sh = source.height;

  if (currentRatio > targetRatio) {
    sw = Math.round(source.height * targetRatio);
    sx = Math.round((source.width - sw) / 2);
  } else {
    sh = Math.round(source.width / targetRatio);
    sy = Math.round((source.height - sh) / 2);
  }

  const temp = document.createElement('canvas');
  temp.width = sw;
  temp.height = sh;
  temp.getContext('2d').drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
  return temp;
}

function downloadCurrent() {
  if (!state.originalImage) return;
  const outputCanvas = exportCanvasWithRatio();
  const link = document.createElement('a');
  const baseName = (state.originalName || 'ribera-image').replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]+/gi, '-').toLowerCase();
  const presetName = (state.activePresetName || 'manual').replace(/[^a-z0-9_-]+/gi, '-').toLowerCase();
  link.download = `${baseName}-${presetName}-${Date.now()}.png`;
  link.href = outputCanvas.toDataURL('image/png');
  link.click();
}

async function saveExport() {
  if (!state.originalImage) return;
  const outputCanvas = exportCanvasWithRatio();
  const dataUrl = outputCanvas.toDataURL('image/png');
  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : `export_${Date.now()}`,
    createdAt: Date.now(),
    name: state.activePresetName || 'Ajuste manual',
    originalName: state.originalName,
    width: outputCanvas.width,
    height: outputCanvas.height,
    ratio: els.exportRatio.value,
    dataUrl,
    recipe: getRecipe()
  };

  let localSaved = false;
  let cloudSaved = false;

  try {
    await addExportRecord(record);
    localSaved = true;
  } catch (err) {
    console.error('No se pudo guardar local', err);
  }

  if (state.user && state.supabase) {
    try {
      if (!state.activeProjectId && (els.projectTitle.value.trim() || state.sourceFile)) {
        await saveCloudProject();
      }
      await saveCloudExport(record, outputCanvas);
      await loadCloudExports();
      cloudSaved = true;
    } catch (err) {
      console.error('No se pudo guardar cloud', err);
      alert('La versión se guardó localmente, pero falló el guardado cloud. Revisá Storage, policies y schema de Supabase.');
    }
  }

  await renderGallery();
  setStatus(cloudSaved ? 'Versión guardada local + Supabase' : localSaved ? 'Versión guardada en historial local' : 'No se pudo guardar la versión');
}
async function renderGallery() {
  if (els.galleryMode && els.galleryMode.value === 'cloud') {
    await renderCloudGallery();
    return;
  }
  const records = await getExportRecords();
  if (!records.length) {
    els.galleryGrid.innerHTML = '<p class="small-muted">Todavía no hay versiones guardadas en este navegador.</p>';
    return;
  }
  els.galleryGrid.innerHTML = records.map((record) => `
    <article class="gallery-item">
      <img src="${record.dataUrl}" alt="${escapeHtml(record.name)}" loading="lazy" />
      <div class="gallery-item-body">
        <span class="cloud-tag local-tag">Local</span>
        <h3>${escapeHtml(record.name)}</h3>
        <p>${new Date(record.createdAt).toLocaleString('es-AR')} · ${escapeHtml(record.ratio)}</p>
        <div class="gallery-actions">
          <a href="${record.dataUrl}" download="ribera-export-${record.createdAt}.png">Bajar</a>
          <button type="button" data-load-record="${escapeHtml(record.id)}">Receta</button>
        </div>
      </div>
    </article>
  `).join('');

  els.galleryGrid.querySelectorAll('[data-load-record]').forEach((button) => {
    button.addEventListener('click', async () => {
      const records = await getExportRecords();
      const record = records.find((item) => item.id === button.dataset.loadRecord);
      if (!record) return;
      els.recipeInput.value = JSON.stringify(record.recipe, null, 2);
      els.recipeDialog.showModal();
    });
  });
}

async function saveCurrentPreset() {
  const name = els.presetName.value.trim();
  if (!name) {
    alert('Definí un nombre para el preset.');
    return;
  }
  const category = els.presetNewCategory.value.trim() || 'Ribera';
  const preset = {
    id: `custom_${Date.now()}`,
    custom: true,
    name,
    category,
    usage: els.presetUsage.value,
    description: els.presetDescription.value.trim() || 'Preset creado desde el workspace de Ribera Visual Engine.',
    settings: { ...state.settings },
    flags: { ...state.flags },
    createdAt: Date.now()
  };
  state.customPresets.unshift(preset);
  saveCustomPresets();

  if (state.user && state.supabase) {
    try {
      const cloudId = await saveCloudPreset(preset);
      preset.cloudId = cloudId;
      setStatus(`Preset guardado local + Supabase · ${preset.name}`);
    } catch (err) {
      console.error(err);
      setStatus(`Preset guardado local · falló Supabase`);
    }
  } else {
    setStatus(`Preset guardado local · ${preset.name}`);
  }

  els.presetName.value = '';
  els.presetDescription.value = '';
  state.activePresetId = preset.id;
  state.activePresetName = preset.name;
  renderPresetGrid();
  updateControlValues();
  updateCloudUI();
}

function applyRecipeFromDialog() {
  try {
    const recipe = JSON.parse(els.recipeInput.value);
    if (!recipe.settings) throw new Error('La receta no tiene settings.');
    state.settings = deepSettings(recipe.settings);
    state.flags = deepFlags(recipe.flags);
    state.activePresetId = null;
    state.activePresetName = recipe.name || 'Receta importada';
    if (recipe.exportRatio) els.exportRatio.value = recipe.exportRatio;
    updateControlValues();
    renderPresetGrid();
    queueRender();
    els.recipeDialog.close();
  } catch (err) {
    alert('Receta inválida. Pegá un JSON exportado desde Ribera Visual Engine.');
  }
}

async function copyRecipe() {
  const recipe = JSON.stringify(getRecipe(), null, 2);
  try {
    await navigator.clipboard.writeText(recipe);
    setStatus('Receta copiada al portapapeles');
  } catch (_err) {
    els.recipeInput.value = recipe;
    els.recipeDialog.showModal();
  }
}

function handleDrop(event) {
  event.preventDefault();
  els.uploadCard.classList.remove('dragging');
  els.dropZone.classList.remove('dragging');
  const file = event.dataTransfer.files && event.dataTransfer.files[0];
  state.activeProjectId = null;
  loadFile(file);
}

function bindEvents() {
  els.btnPickFile.addEventListener('click', () => els.fileInput.click());
  els.fileInput.addEventListener('change', (event) => { state.activeProjectId = null; loadFile(event.target.files[0]); });
  els.btnReset.addEventListener('click', resetAll);
  els.btnZeroControls.addEventListener('click', neutralizeControls);
  els.btnDownload.addEventListener('click', downloadCurrent);
  els.btnSaveExport.addEventListener('click', saveExport);
  els.btnSaveProject.addEventListener('click', saveCloudProject);
  els.btnSavePreset.addEventListener('click', saveCurrentPreset);
  els.btnAuth.addEventListener('click', () => {
    els.authMessage.textContent = '';
    els.authDialog.showModal();
  });
  els.btnLogout.addEventListener('click', logout);
  els.btnLogin.addEventListener('click', login);
  els.btnSignup.addEventListener('click', signup);
  els.btnSyncPresets.addEventListener('click', async () => {
    await loadCloudPresets();
    renderPresetGrid();
    setStatus('Presets cloud sincronizados');
  });
  els.btnMigrateLocalPresets.addEventListener('click', migrateLocalPresets);
  els.btnRefreshCloud.addEventListener('click', loadCloudData);
  els.btnRefreshGallery.addEventListener('click', async () => {
    if (els.galleryMode.value === 'cloud') await loadCloudExports();
    await renderGallery();
  });
  els.galleryMode.addEventListener('change', renderGallery);
  els.presetCategory.addEventListener('change', renderPresetGrid);
  els.compareRange.addEventListener('input', updateCompareClip);
  els.beforeAfterToggle.addEventListener('change', updateCompareClip);
  els.exportRatio.addEventListener('change', updateRecipeOutput);
  els.btnCopySettings.addEventListener('click', copyRecipe);
  els.btnLoadRecipe.addEventListener('click', () => els.recipeDialog.showModal());
  els.btnApplyRecipe.addEventListener('click', applyRecipeFromDialog);
  els.btnClearGallery.addEventListener('click', async () => {
    const ok = confirm('¿Limpiar todo el historial local? Esta acción no borra archivos descargados.');
    if (!ok) return;
    await clearExportRecords();
    await renderGallery();
  });

  const flagInputs = [
    els.toggleBorder,
    els.toggleDateStamp,
    els.toggleTexture,
    els.toggleSafeSharpen,
    els.toggleFilmPerfs,
    els.toggleFilmCode,
    els.toggleChemicalEdge,
    els.toggleScanlines
  ].filter(Boolean);

  flagInputs.forEach((input) => {
    input.addEventListener('change', () => {
      state.flags = deepFlags({
        border: els.toggleBorder?.checked,
        dateStamp: els.toggleDateStamp?.checked,
        texture: els.toggleTexture?.checked,
        safeSharpen: els.toggleSafeSharpen?.checked,
        filmPerfs: els.toggleFilmPerfs?.checked,
        filmCode: els.toggleFilmCode?.checked,
        chemicalEdge: els.toggleChemicalEdge?.checked,
        scanlines: els.toggleScanlines?.checked
      });
      state.activePresetId = null;
      state.activePresetName = 'Ajuste manual';
      renderPresetGrid();
      updateControlValues();
      queueRender();
    });
  });

  if (els.controlSearch) {
    els.controlSearch.addEventListener('input', renderControls);
  }

  ['dragenter', 'dragover'].forEach((name) => {
    [els.uploadCard, els.dropZone].forEach((target) => {
      target.addEventListener(name, (event) => {
        event.preventDefault();
        els.uploadCard.classList.add('dragging');
        els.dropZone.classList.add('dragging');
      });
    });
  });

  ['dragleave', 'drop'].forEach((name) => {
    [els.uploadCard, els.dropZone].forEach((target) => {
      target.addEventListener(name, (event) => {
        if (name !== 'drop') event.preventDefault();
        els.uploadCard.classList.remove('dragging');
        els.dropZone.classList.remove('dragging');
      });
    });
  });

  els.uploadCard.addEventListener('drop', handleDrop);
  els.dropZone.addEventListener('drop', handleDrop);
  window.addEventListener('resize', syncOriginalLayerSize);
}

async function init() {
  loadCustomPresets();
  state.db = await initDB();
  initSupabaseClient();
  bindEvents();
  renderControls();
  renderPresetGrid();
  updateControlValues();
  enableEditing(false);
  renderProjects();
  await restoreSession();
  await renderGallery();
  updateCloudUI();
}

init();
