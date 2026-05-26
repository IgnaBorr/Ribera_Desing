'use strict';

const RVE_VERSION = '2.0.0';
const MAX_RENDER_DIMENSION = 1800;
const DB_NAME = 'ribera-visual-engine-v2';
const DB_VERSION = 1;
const EXPORT_STORE = 'exports';

const DEFAULT_SETTINGS = {
  exposure: 0,
  contrast: 0,
  brightness: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  fade: 0,
  grain: 0,
  dust: 0,
  scratches: 0,
  vignette: 0,
  bloom: 0,
  halation: 0,
  chromatic: 0,
  blur: 0,
  sharpness: 0
};

const CONTROL_GROUPS = [
  {
    title: 'Base digital',
    controls: [
      ['exposure', 'Exposición', -100, 100, 1],
      ['brightness', 'Brillo', -100, 100, 1],
      ['contrast', 'Contraste', -100, 100, 1],
      ['saturation', 'Saturación', -100, 100, 1]
    ]
  },
  {
    title: 'Color grading',
    controls: [
      ['temperature', 'Temperatura', -100, 100, 1],
      ['tint', 'Tinte', -100, 100, 1],
      ['highlights', 'Altas luces', -100, 100, 1],
      ['shadows', 'Sombras', -100, 100, 1]
    ]
  },
  {
    title: 'Acabado film',
    controls: [
      ['fade', 'Matte / Fade', 0, 100, 1],
      ['grain', 'Grano', 0, 100, 1],
      ['vignette', 'Viñeta', 0, 100, 1],
      ['bloom', 'Bloom', 0, 100, 1]
    ]
  },
  {
    title: 'Defectos analógicos',
    controls: [
      ['dust', 'Polvo', 0, 100, 1],
      ['scratches', 'Scratches', 0, 100, 1],
      ['halation', 'Halation', 0, 100, 1],
      ['chromatic', 'Aberración', 0, 100, 1]
    ]
  },
  {
    title: 'Detalle',
    controls: [
      ['blur', 'Soft blur', 0, 25, 1],
      ['sharpness', 'Sharpness', 0, 100, 1]
    ]
  }
];

const BUILT_IN_PRESETS = [
  {
    id: 'ribera-cover',
    name: 'Ribera Cover',
    category: 'Ribera',
    usage: 'Portada',
    description: 'Negros profundos, piel cálida, contraste urbano y textura editorial para portadas web.',
    settings: { exposure: 6, brightness: -4, contrast: 28, saturation: -8, temperature: 12, tint: 4, highlights: -18, shadows: 16, fade: 12, grain: 24, dust: 8, scratches: 3, vignette: 28, bloom: 10, halation: 16, chromatic: 5, blur: 0, sharpness: 18 },
    flags: { border: false, dateStamp: false, texture: true, safeSharpen: true }
  },
  {
    id: 'analog-35',
    name: 'Analog 35',
    category: 'Analog',
    usage: 'Foto',
    description: 'Película 35mm cálida, grano visible y sombras levantadas.',
    settings: { exposure: 4, brightness: 2, contrast: 16, saturation: -4, temperature: 18, tint: -3, highlights: -10, shadows: 12, fade: 22, grain: 38, dust: 12, scratches: 6, vignette: 20, bloom: 8, halation: 18, chromatic: 4, blur: 0, sharpness: 8 },
    flags: { border: true, dateStamp: false, texture: true, safeSharpen: true }
  },
  {
    id: 'dirty-film',
    name: 'Dirty Film',
    category: 'Film',
    usage: 'Experimental',
    description: 'Contraste roto, grano agresivo, defectos y energía de rollo vencido.',
    settings: { exposure: -3, brightness: -7, contrast: 35, saturation: -18, temperature: 8, tint: 10, highlights: -24, shadows: 22, fade: 30, grain: 68, dust: 42, scratches: 38, vignette: 36, bloom: 15, halation: 24, chromatic: 18, blur: 1, sharpness: 4 },
    flags: { border: true, dateStamp: true, texture: true, safeSharpen: false }
  },
  {
    id: 'urban-grit',
    name: 'Urban Grit',
    category: 'Urban',
    usage: 'Campaña',
    description: 'Cemento, calle, textura seca y contraste comercial sin perder crudeza.',
    settings: { exposure: 0, brightness: -8, contrast: 42, saturation: -22, temperature: -8, tint: 3, highlights: -30, shadows: 8, fade: 8, grain: 30, dust: 10, scratches: 8, vignette: 32, bloom: 4, halation: 6, chromatic: 8, blur: 0, sharpness: 22 },
    flags: { border: false, dateStamp: false, texture: true, safeSharpen: true }
  },
  {
    id: 'vhs-raw',
    name: 'VHS Raw',
    category: 'Analog',
    usage: 'Experimental',
    description: 'Color desplazado, aberración, blur y ruido de cinta.',
    settings: { exposure: 2, brightness: -2, contrast: 10, saturation: 12, temperature: -12, tint: 18, highlights: -8, shadows: 8, fade: 18, grain: 52, dust: 18, scratches: 14, vignette: 14, bloom: 20, halation: 10, chromatic: 46, blur: 2, sharpness: 0 },
    flags: { border: false, dateStamp: true, texture: true, safeSharpen: false }
  },
  {
    id: 'bw-doc',
    name: 'B&N Documentary',
    category: 'Mono',
    usage: 'Foto',
    description: 'Blanco y negro documental, contraste duro y grano controlado.',
    settings: { exposure: 0, brightness: -3, contrast: 48, saturation: -100, temperature: 0, tint: 0, highlights: -18, shadows: 20, fade: 10, grain: 34, dust: 8, scratches: 4, vignette: 26, bloom: 4, halation: 0, chromatic: 0, blur: 0, sharpness: 24 },
    flags: { border: false, dateStamp: false, texture: true, safeSharpen: true }
  },
  {
    id: 'neon-decay',
    name: 'Neon Decay',
    category: 'Urban',
    usage: 'Campaña',
    description: 'Nocturno, magenta, luces sucias y brillo de cartel viejo.',
    settings: { exposure: 4, brightness: -6, contrast: 26, saturation: 20, temperature: -18, tint: 30, highlights: -20, shadows: 18, fade: 14, grain: 28, dust: 8, scratches: 8, vignette: 34, bloom: 42, halation: 30, chromatic: 18, blur: 0, sharpness: 10 },
    flags: { border: false, dateStamp: false, texture: true, safeSharpen: true }
  },
  {
    id: 'editorial-sucio',
    name: 'Editorial Sucio',
    category: 'Ribera',
    usage: 'Campaña',
    description: 'Base premium con imperfección controlada. Sirve para campañas y portraits.',
    settings: { exposure: 8, brightness: -2, contrast: 22, saturation: -10, temperature: 6, tint: -2, highlights: -16, shadows: 14, fade: 8, grain: 20, dust: 6, scratches: 2, vignette: 18, bloom: 8, halation: 12, chromatic: 2, blur: 0, sharpness: 20 },
    flags: { border: false, dateStamp: false, texture: true, safeSharpen: true }
  },
  {
    id: 'clean-digital',
    name: 'Clean Digital',
    category: 'Digital',
    usage: 'Foto',
    description: 'Corrección prolija, contraste moderado y sin suciedad visual.',
    settings: { exposure: 4, brightness: 2, contrast: 12, saturation: 8, temperature: 2, tint: 0, highlights: -8, shadows: 10, fade: 0, grain: 0, dust: 0, scratches: 0, vignette: 6, bloom: 3, halation: 0, chromatic: 0, blur: 0, sharpness: 22 },
    flags: { border: false, dateStamp: false, texture: false, safeSharpen: true }
  },
  {
    id: 'mini-dv',
    name: 'MiniDV',
    category: 'Analog',
    usage: 'Experimental',
    description: 'Baja definición intencional, color frío, ruido y borde digital.',
    settings: { exposure: -2, brightness: -4, contrast: 8, saturation: -6, temperature: -20, tint: 8, highlights: -6, shadows: 10, fade: 14, grain: 44, dust: 15, scratches: 4, vignette: 8, bloom: 6, halation: 2, chromatic: 28, blur: 3, sharpness: 0 },
    flags: { border: false, dateStamp: true, texture: true, safeSharpen: false }
  }
];

const state = {
  originalImage: null,
  originalName: '',
  naturalWidth: 0,
  naturalHeight: 0,
  settings: { ...DEFAULT_SETTINGS },
  flags: { border: false, dateStamp: false, texture: true, safeSharpen: true },
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
  return { border: false, dateStamp: false, texture: true, safeSharpen: true, ...(flags || {}) };
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
    alert('No se pudo guardar el proyecto en Supabase. Revisá que hayas ejecutado el schema V2 completo.');
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
  els.controlsContainer.innerHTML = CONTROL_GROUPS.map((group) => `
    <div class="control-group">
      <div class="control-group-title"><span>${group.title}</span></div>
      ${group.controls.map(([key, label, min, max, step]) => `
        <div class="slider-row">
          <label for="ctrl_${key}"><span>${label}</span><span class="value-pill" id="value_${key}">${state.settings[key]}</span></label>
          <input id="ctrl_${key}" data-control="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state.settings[key]}" />
        </div>
      `).join('')}
    </div>
  `).join('');

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
  els.toggleBorder.checked = Boolean(state.flags.border);
  els.toggleDateStamp.checked = Boolean(state.flags.dateStamp);
  els.toggleTexture.checked = Boolean(state.flags.texture);
  els.toggleSafeSharpen.checked = Boolean(state.flags.safeSharpen);
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
  state.flags = { border: false, dateStamp: false, texture: true, safeSharpen: true };
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
    alert('La V2 acepta imágenes PNG, JPG o WEBP. Video queda para una versión posterior, con pipeline específico.');
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

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.filter = state.settings.blur > 0 ? `blur(${state.settings.blur * 0.36}px)` : 'none';
  ctx.drawImage(state.originalImage, 0, 0, width, height);
  ctx.restore();

  let imageData = ctx.getImageData(0, 0, width, height);
  imageData = applyBaseAdjustments(imageData, state.settings);
  if (state.settings.sharpness > 0 && state.flags.safeSharpen) {
    imageData = applySharpen(imageData, state.settings.sharpness / 100);
  }
  if (state.settings.chromatic > 0) {
    imageData = applyChromatic(imageData, Math.round(state.settings.chromatic / 12));
  }
  ctx.putImageData(imageData, 0, 0);

  if (state.settings.bloom > 0) applyBloom(ctx, width, height, state.settings.bloom);
  if (state.settings.halation > 0) applyHalation(ctx, width, height, state.settings.halation);
  if (state.flags.texture && state.settings.grain > 0) applyGrain(ctx, width, height, state.settings.grain);
  if (state.flags.texture && state.settings.dust > 0) applyDust(ctx, width, height, state.settings.dust);
  if (state.flags.texture && state.settings.scratches > 0) applyScratches(ctx, width, height, state.settings.scratches);
  if (state.settings.vignette > 0) applyVignette(ctx, width, height, state.settings.vignette);
  if (state.flags.border) applyFilmBorder(ctx, width, height);
  if (state.flags.dateStamp) applyDateStamp(ctx, width, height);

  updateControlValues();
  updateCompareClip();
  setStatus(`Listo · ${state.activePresetName || 'Ajuste manual'}`);
}

function applyBaseAdjustments(imageData, settings) {
  const data = imageData.data;
  const exposureFactor = Math.pow(2, settings.exposure / 80);
  const brightnessAdd = settings.brightness * 1.75;
  const contrastValue = settings.contrast * 1.8;
  const contrastFactor = (259 * (contrastValue + 255)) / (255 * (259 - contrastValue));
  const saturationFactor = 1 + settings.saturation / 100;
  const temp = settings.temperature * 0.42;
  const tint = settings.tint * 0.32;
  const hl = settings.highlights / 100;
  const sh = settings.shadows / 100;
  const fade = settings.fade / 100;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    r *= exposureFactor;
    g *= exposureFactor;
    b *= exposureFactor;

    r += brightnessAdd;
    g += brightnessAdd;
    b += brightnessAdd;

    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    r += temp;
    b -= temp;
    g += tint;
    r -= tint * 0.28;
    b -= tint * 0.28;

    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const highlightMask = smoothstep(132, 255, lum);
    const shadowMask = 1 - smoothstep(0, 135, lum);
    const hlAmount = hl * 42 * highlightMask;
    const shAmount = sh * 52 * shadowMask;
    r += hlAmount + shAmount;
    g += hlAmount + shAmount;
    b += hlAmount + shAmount;

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + (r - gray) * saturationFactor;
    g = gray + (g - gray) * saturationFactor;
    b = gray + (b - gray) * saturationFactor;

    if (fade > 0) {
      const shadowLift = (1 - smoothstep(55, 220, gray)) * fade * 42;
      r = r * (1 - fade * 0.08) + shadowLift;
      g = g * (1 - fade * 0.08) + shadowLift;
      b = b * (1 - fade * 0.08) + shadowLift;
    }

    data[i] = clamp(r);
    data[i + 1] = clamp(g);
    data[i + 2] = clamp(b);
  }
  return imageData;
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function applySharpen(imageData, amount) {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const out = new Uint8ClampedArray(src);
  const strength = Math.min(1.15, amount * 1.15);

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
  const effectiveShift = Math.min(10, shift);

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

function applyBloom(ctx, width, height, value) {
  const temp = document.createElement('canvas');
  temp.width = width;
  temp.height = height;
  const tctx = temp.getContext('2d');
  tctx.drawImage(els.processedCanvas, 0, 0);
  ctx.save();
  ctx.globalAlpha = value / 180;
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = `blur(${Math.max(2, value / 7)}px) brightness(1.15)`;
  ctx.drawImage(temp, 0, 0);
  ctx.restore();
}

function applyHalation(ctx, width, height, value) {
  const temp = document.createElement('canvas');
  temp.width = width;
  temp.height = height;
  const tctx = temp.getContext('2d');
  tctx.drawImage(els.processedCanvas, 0, 0);
  ctx.save();
  ctx.globalAlpha = value / 230;
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = `blur(${Math.max(1, value / 8)}px) sepia(1) saturate(1.7) hue-rotate(-18deg)`;
  ctx.drawImage(temp, 0, 0);
  ctx.restore();
}

function applyGrain(ctx, width, height, value) {
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = width;
  grainCanvas.height = height;
  const gctx = grainCanvas.getContext('2d');
  const imageData = gctx.createImageData(width, height);
  const data = imageData.data;
  const intensity = value * 1.4;
  for (let i = 0; i < data.length; i += 4) {
    const noise = 128 + (Math.random() - 0.5) * intensity;
    data[i] = noise;
    data[i + 1] = noise;
    data[i + 2] = noise;
    data[i + 3] = value * 1.12;
  }
  gctx.putImageData(imageData, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(grainCanvas, 0, 0);
  ctx.restore();
}

function applyDust(ctx, width, height, value) {
  const count = Math.round((width * height / 110000) * value);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 1.8 + 0.4;
    const alpha = Math.random() * 0.28 + 0.05;
    ctx.fillStyle = `rgba(255,245,220,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function applyScratches(ctx, width, height, value) {
  const count = Math.round(value / 8);
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const len = height * (Math.random() * 0.28 + 0.08);
    const alpha = Math.random() * 0.18 + 0.05;
    ctx.strokeStyle = `rgba(255,235,205,${alpha})`;
    ctx.lineWidth = Math.random() * 1.2 + 0.35;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + Math.random() * 8 - 4, y + len * 0.3, x + Math.random() * 8 - 4, y + len * 0.7, x + Math.random() * 8 - 4, y + len);
    ctx.stroke();
  }
  ctx.restore();
}

function applyVignette(ctx, width, height, value) {
  const radius = Math.max(width, height) * 0.72;
  const gradient = ctx.createRadialGradient(width / 2, height / 2, radius * 0.22, width / 2, height / 2, radius);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(0.7, `rgba(0,0,0,${value / 520})`);
  gradient.addColorStop(1, `rgba(0,0,0,${value / 145})`);
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function applyFilmBorder(ctx, width, height) {
  const border = Math.max(18, Math.round(Math.min(width, height) * 0.035));
  ctx.save();
  ctx.strokeStyle = 'rgba(10, 10, 10, .92)';
  ctx.lineWidth = border;
  ctx.strokeRect(border / 2, border / 2, width - border, height - border);
  ctx.strokeStyle = 'rgba(255,255,255,.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(border + 2, border + 2, width - border * 2 - 4, height - border * 2 - 4);
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

  [els.toggleBorder, els.toggleDateStamp, els.toggleTexture, els.toggleSafeSharpen].forEach((input) => {
    input.addEventListener('change', () => {
      state.flags = {
        border: els.toggleBorder.checked,
        dateStamp: els.toggleDateStamp.checked,
        texture: els.toggleTexture.checked,
        safeSharpen: els.toggleSafeSharpen.checked
      };
      state.activePresetId = null;
      state.activePresetName = 'Ajuste manual';
      renderPresetGrid();
      updateControlValues();
      queueRender();
    });
  });

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
