# Instrucciones para cargar datos de prueba

Este documento explica cómo cargar datos de prueba en tu base de datos Supabase para probar la aplicación de seguimiento de candidaturas.

## Requisitos previos

- Node.js instalado
- Acceso a tu proyecto de Supabase
- Estar autenticado en la aplicación

## Pasos para cargar los datos de prueba

### 1. Obtener las credenciales de Supabase

Para ejecutar el script, necesitarás la URL y la clave anónima de tu proyecto Supabase:

1. Inicia sesión en tu [Dashboard de Supabase](https://app.supabase.io)
2. Selecciona tu proyecto
3. Ve a "Settings" (Configuración) > "API"
4. Copia la "Project URL" y la "anon public" key

### 2. Configurar las credenciales

Tienes tres opciones para proporcionar las credenciales:

#### Opción 1: Usar el archivo .env (recomendado)

Crea o edita el archivo `.env` en la raíz del proyecto y añade las siguientes líneas:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anónima
```

Reemplaza los valores con tus credenciales reales.

#### Opción 2: Usar variables de entorno en la línea de comandos

Ejecuta el script pasando las variables de entorno directamente:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co VITE_SUPABASE_ANON_KEY=tu-clave-anónima node get_user_id.js
```

#### Opción 3: Editar el script

Alternativamente, puedes editar el archivo `get_user_id.js` y reemplazar estas líneas:

```javascript
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";
```

Por tus credenciales reales:

```javascript
const supabaseUrl = "https://tu-proyecto.supabase.co";
const supabaseKey = "tu-clave-anónima";
```

### 3. Ejecutar el script

Una vez configuradas las credenciales, ejecuta:

```bash
node get_user_id.js
```

Si el script se ejecuta correctamente, verás mensajes como:

```
Conectando a Supabase...
ID de usuario: tu-id-de-usuario
Archivo SQL actualizado guardado en: /ruta/a/seed_data_updated.sql
Ahora puedes ejecutar este archivo en tu base de datos Supabase.
```

### 4. Cargar los datos en Supabase

Hay dos formas de cargar los datos:

#### Opción 1: Usando el Editor SQL de Supabase

1. En tu Dashboard de Supabase, ve a la sección "SQL Editor"
2. Crea un nuevo query
3. Copia y pega el contenido de `seed_data_updated.sql`
4. Ejecuta el query

#### Opción 2: Usando la CLI de Supabase

Si tienes la CLI de Supabase instalada:

```bash
supabase db execute -f seed_data_updated.sql
```

## Verificación

Una vez cargados los datos, deberías poder ver 10 aplicaciones de ejemplo en tu aplicación:

- 6 aplicaciones activas con diferentes estados
- 2 aplicaciones rechazadas
- 2 aplicaciones archivadas

## Notas adicionales

- Si ya existe una tabla `applications`, el script no la recreará, solo insertará los datos.
- Si necesitas modificar los datos de ejemplo, edita el archivo `seed_data.sql` y vuelve a ejecutar el proceso.
- Para eliminar todos los datos de prueba, puedes ejecutar: `DELETE FROM applications WHERE user_id = 'TU_ID_DE_USUARIO';`
