# Ribera Visual Engine · V2

Mesa de revelado visual para La Ribera. Permite cargar imágenes, aplicar presets digitales/analógicos, ajustar parámetros finos, crear presets propios, comparar antes/después, guardar versiones y exportar PNG.

La V2 agrega integración real con Supabase, pero mantiene fallback local. Si `config.js` no tiene credenciales, la app funciona igual con IndexedDB/localStorage.

## Qué incluye la V2

### Editor visual

- Carga de imágenes PNG, JPG y WEBP.
- Motor Canvas sin IA y sin APIs pagas.
- Comparación antes/después.
- Exportación PNG.
- Formatos:
  - Original
  - 1:1
  - 4:5
  - 9:16
  - 16:9
  - 3:2
- Sliders:
  - Exposición
  - Brillo
  - Contraste
  - Saturación
  - Temperatura
  - Tinte
  - Altas luces
  - Sombras
  - Matte / Fade
  - Grano
  - Polvo
  - Scratches
  - Viñeta
  - Bloom
  - Halation
  - Aberración cromática
  - Soft blur
  - Sharpness
- Capas:
  - Marco film
  - Fecha fake
  - Textura
  - Nitidez segura

### Presets incluidos

- Ribera Cover
- Analog 35
- Dirty Film
- Urban Grit
- VHS Raw
- B&N Documentary
- Neon Decay
- Editorial Sucio
- Clean Digital
- MiniDV

### V2 Cloud / Supabase

- Login y registro con Supabase Auth.
- Guardado de presets en Supabase.
- Migración de presets locales a Supabase.
- Guardado de proyectos:
  - título
  - notas
  - archivo fuente
  - receta activa
  - preset activo
- Guardado de exportaciones en Supabase Storage.
- Historial local y cloud con selector.
- Biblioteca de proyectos cloud.
- URLs firmadas para descargar assets privados.
- Row Level Security incluida.
- Storage privado por usuario.

## Archivos

- `index.html` — estructura de la app.
- `styles.css` — diseño responsive/mobile-first.
- `app.js` — motor visual, persistencia local y Supabase.
- `config.js` — configuración editable de Supabase.
- `config.example.js` — ejemplo de configuración.
- `schema.sql` — base de datos, policies y storage.
- `README.md` — este documento.

## Instalación local

Podés abrir `index.html` directo, pero para evitar restricciones del navegador conviene usar servidor local:

```bash
python -m http.server 8080
```

Después abrí:

```text
http://localhost:8080
```

## Deploy en GitHub Pages

1. Creá un repositorio, por ejemplo `ribera-visual-engine`.
2. Subí todos los archivos de esta carpeta.
3. En GitHub: Settings → Pages.
4. Seleccioná rama `main` y carpeta `/root`.
5. Guardá.

## Configurar Supabase

### 1. Crear proyecto

Creá un proyecto en Supabase.

### 2. Ejecutar schema

Abrí Supabase → SQL Editor → New query.

Pegá todo el contenido de:

```text
schema.sql
```

Ejecutalo completo.

Esto crea:

- `rve_profiles`
- `rve_presets`
- `rve_projects`
- `rve_exports`
- bucket privado `ribera-visual-engine`
- policies RLS
- policies de Storage

### 3. Completar config.js

En Supabase → Project Settings → API copiá:

- Project URL
- anon public key

Editá `config.js`:

```js
window.RVE_CONFIG = {
  SUPABASE_URL: 'https://TU-PROYECTO.supabase.co',
  SUPABASE_ANON_KEY: 'TU_ANON_PUBLIC_KEY',
  STORAGE_BUCKET: 'ribera-visual-engine',
  CLOUD_ENABLED: true
};
```

No pongas la service role key en el navegador. Eso sería un agujero de seguridad, no una feature.

### 4. Auth

En Supabase → Authentication podés decidir si exigís confirmación de email.

Para uso interno rápido, podés desactivar confirmación de email mientras testeás. Para producción, conviene activarla.

## Flujo de uso

1. Cargá una foto.
2. Aplicá un preset.
3. Ajustá sliders y capas.
4. Completá título y notas del proyecto.
5. Iniciá sesión.
6. Guardá proyecto.
7. Guardá versión.
8. Exportá PNG si necesitás el archivo final.

## Decisiones técnicas

- V2 sigue enfocada en imagen. Video no se metió porque requiere pipeline separado, procesamiento por frames y exportación pesada. Si se fuerza ahora, se rompe la experiencia mobile.
- La app usa Canvas y procesamiento local. No hay IA ni dependencia por créditos.
- Supabase se usa para persistencia, no para procesar la imagen.
- Storage es privado. La app genera signed URLs temporales.
- La app funciona aunque Supabase no esté configurado.

## Roadmap sugerido V3

- Roles admin/editor/viewer con gestión visual.
- Presets compartidos por equipo.
- Duplicar proyectos.
- Versionado por campaña.
- Tags por cliente/campaña.
- Exportación batch en varios formatos.
- Soporte de video corto con pipeline específico.
- IA asistida sólo como capa secundaria, no como núcleo.
