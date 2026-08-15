# 🎓 Sistema de Consulta de Calificaciones - Bosques del Paraíso

Aplicación web desarrollada en **Google Apps Script** vinculada a **Google Sheets** que permite a estudiantes, padres de familia y docentes consultar el desempeño académico por alumno en tiempo real, visualizar entregas por rubro y analizar estadísticas interactivas.

---

## 🚀 Características Principales

* **Selección Dinámica de Grados:** Carga automáticamente la lista de pestañas/grados disponibles en la hoja de cálculo.
* **Búsqueda por ID Único:** Localiza el historial completo del alumno utilizando un código identificador personalizado (ej. `AVKV01`).
* **Generador Automático de IDs:** Script en segundo plano que estandariza e inserta identificadores únicos en la Columna A sin alterar los registros existentes.
* **Procesamiento Inteligente de Datos:** Omite encabezados, columnas informativas (`KPI`, `CHROMEBOOK #`, `TOTAL DÍA`, `FINAL`) y resúmenes para evitar duplicidad de datos.
* **Métricas por Rubro:** Calcula evaluaciones asignadas, tareas entregadas, pendientes, asistencias y promedios por cada rubro (*Asistencia, Liderazgo, Participación Activa, Trabajo en Equipo, Materiales, Indicaciones*, etc.).
* **Visualización Interactiva con Chart.js:**
* Gráfica de barras ajustada en escala de 0 a 10.
* **Semaforización de Barras:** Barras rojas para promedios menores a 5 y verdes para promedios de 5 a 10.
* **Alertas Visuales:** Indicadores numéricos superiores en color rojo si la nota o asistencia es 0.


* **Diseño Adaptativo (Responsive):** Interfaz construida con Bootstrap 5 optimizada para dispositivos móviles y computadoras de escritorio.

---

## 📁 Estructura del Proyecto

El repositorio consta de tres archivos fundamentales para su despliegue en Google Apps Script:

| Archivo | Tipo | Descripción |
| --- | --- | --- |
| **`Code.gs`** | Servidor | Lógica principal del backend (`doGet`, `obtenerGrados`, `buscarAlumno`). |
| **`IDs.gs`** | Servidor | Generador automático de IDs de 6 caracteres basado en nombres/apellidos. |
| **`Index.html`** | Cliente | Interfaz gráfica de usuario con Bootstrap 5, Chart.js y consumo de backend. |

---

## 🛠️ Tecnologías Utilizadas

* **Entorno:** [Google Apps Script](https://developers.google.com/apps-script)
* **Base de Datos / Backend:** [Google Sheets API](https://developers.google.com/sheets/api)
* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Framework CSS:** [Bootstrap 5.3](https://getbootstrap.com/)
* **Librería de Gráficas:** [Chart.js](https://www.chartjs.org/) + [Chart.js DataLabels Plugin](https://www.google.com/search?q=https://chartjs-plugin-datalabels.chartjs.org/)

---

## ⚙️ Configuración y Despliegue

### 1. Preparar la Hoja de Cálculo (Google Sheets)

1. Asegúrate de que la Fila 1 contenga los encabezados/fechas superiores y la Fila 2 los rubros de evaluación (*Asistencia, Liderazgo, Tareas*, etc.).
2. La Columna A debe contener los IDs de los alumnos a partir de la Fila 3.
3. Las Columnas B y C corresponden a *Apellido* y *Nombre*.

### 2. Crear el Proyecto en Apps Script

1. En tu hoja de cálculo, ve al menú superior: **Extensiones** > **Apps Script**.
2. Crea los tres archivos con los nombres exactos:
* `Code.gs`
* `IDs.gs`
* `Index.html`


3. Copia el código correspondiente a cada archivo.

### 3. Publicar como Web App

1. Haz clic en el botón **Implementar** (Deploy) > **Nueva implementación**.
2. Selecciona **Aplicación web**.
3. Configura los permisos:
* **Ejecutar como:** *Tu cuenta de correo*
* **Quién tiene acceso:** *Cualquier persona* (o restringido a tu organización).


4. Haz clic en **Implementar**, otorga los permisos necesarios y copia el enlace de la Aplicación Web.

---

## 📊 Reglas de Negocio para el Cálculo de Métricas

* **Lectura de Fechas y Grupos:** Si la Fila 1 contiene el término `TOTAL`, esa columna se ignora para no duplicar los promedios parciales.
* **Asistencias:** Se contabilizan valores registrados como `'A'` y se representan como `Asistencias / Total`.
* **Calificaciones:** Se extraen valores numéricos para promediar el rubro en escala `0-10`.
* **Estatus de Entregas:** Las celdas vacías se contabilizan como **Pendientes** y las celdas con registro como **Entregadas**.
