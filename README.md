# Ribera Visual Engine · V3

Mesa de trabajo de celuloide para editar imágenes con estética digital + analógica. La V3 mantiene Supabase de la V2, pero agranda el motor de edición: más color, RGB real, HSL selectivo, revelado químico simulado, overlays físicos y una interfaz de laboratorio visual.

## Qué incluye

### Editor de imagen
- Carga de PNG, JPG y WEBP.
- Preview con Canvas.
- Comparador antes/después.
- Exportación PNG.
- Formatos: original, 1:1, 4:5, 9:16, 16:9, 3:2, 2:3 y 21:9.

### Presets incluidos
- Ribera Cover III
- Celluloid 400T
- Dirty Contact Sheet
- Urban Asphalt
- Neon Bleed
- B&W Hard Proof
- VHS Scanner
- Clean Grade Pro

### Controles nuevos de V3

#### Luz / densidad
- Exposición
- Brillo
- Contraste
- Gamma
- Punto negro
- Punto blanco

#### Tonos / curva simulada
- Altas luces
- Sombras
- Blancos
- Negros
- Medios tonos
- Claridad local
- Dehaze

#### Color global
- Saturación
- Vibrance
- Temperatura
- Tinte
- Rotación de tono
- Contraste cromático
- Lavado de color
- Sepia
- Monocromo

#### RGB técnico
- Rojo global
- Verde global
- Azul global
- Rojo/verde/azul en sombras
- Rojo/verde/azul en luces

#### Color corrector
- Cyan ↔ Rojo
- Magenta ↔ Verde
- Amarillo ↔ Azul

#### Mezclador HSL
- Rojos, naranjas, amarillos, verdes, cyan, azules y magentas
- Saturación selectiva
- Luminosidad en rojos/naranjas

#### Film stock / químico
- Fade
- Matte print
- Bleach bypass
- Cross process
- Luces cálidas
- Sombras frías
- Mancha química
- Quemado de bordes

#### Textura analógica
- Grano
- Tamaño de grano
- Color de grano
- Polvo
- Scratches
- Fuga de luz
- Viñeta
- Bloom
- Halation
- Aberración cromática

#### Video / scanner damage
- Scanlines
- Banding horizontal
- Gate weave
- Posterize
- Threshold / Xerox

#### Detalle / óptica
- Soft blur
- Sharpness

### Capas físicas
- Marco film
- Fecha fake
- Textura activa
- Nitidez segura
- Perforaciones de celuloide
- Código de rollo
- Borde químico
- Scanlines

### Presets propios
- Crear presets desde el estado actual del editor.
- Guardar presets localmente.
- Sincronizar presets con Supabase si hay sesión iniciada.
- Importar/exportar recetas visuales JSON.

### Supabase
- Auth con email/contraseña.
- Guardado de proyectos.
- Guardado de presets cloud.
- Guardado de exportaciones.
- Supabase Storage privado por usuario.
- Fallback local si no hay configuración cloud.

## Instalación rápida

1. Subí estos archivos a GitHub Pages, Netlify o cualquier hosting estático.
2. Creá un proyecto en Supabase.
3. Ejecutá `schema.sql` completo desde el SQL Editor de Supabase.
4. Completá `config.js` con tus claves públicas:

```js
window.RVE_CONFIG = {
  SUPABASE_URL: 'https://TU-PROYECTO.supabase.co',
  SUPABASE_ANON_KEY: 'TU_ANON_PUBLIC_KEY',
  STORAGE_BUCKET: 'ribera-visual-engine',
  CLOUD_ENABLED: true
};
```

No uses la service role key en el front-end.

## Modo local

Si `CLOUD_ENABLED` está en `false` o no completás Supabase, la app sigue funcionando con:

- presets locales en `localStorage`
- exportaciones en `IndexedDB`
- descarga directa de PNG

## Notas técnicas

- La app no usa IA.
- La edición se procesa con Canvas en navegador.
- V3 sigue enfocada en imagen. Video debería ir en una V4 con pipeline propio por frames y exportación controlada; meterlo acá sería técnicamente desordenado.
- En imágenes pesadas, el render se limita por `MAX_RENDER_DIMENSION` para no matar celulares.

## Archivos

- `index.html`: interfaz principal.
- `styles.css`: diseño celuloide/laboratorio.
- `app.js`: motor visual, presets, Supabase, historial y exportación.
- `config.js`: credenciales públicas de Supabase.
- `config.example.js`: plantilla de configuración.
- `schema.sql`: base de datos, RLS y Storage.
