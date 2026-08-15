/**
 * Servidor Web App - Consulta de Calificaciones Bosques del Paraíso
 */

// Renderiza la interfaz HTML principal
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Consulta de Calificaciones - Bosques del Paraíso')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// 1. Obtiene los nombres de todas las pestañas de la hoja (Grados)
function obtenerGrados() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hojas = ss.getSheets();
  var nombresHojas = [];
  
  for (var i = 0; i < hojas.length; i++) {
    nombresHojas.push(hojas[i].getName());
  }
  return nombresHojas;
}

// 2. Busca al alumno por ID y procesa las estadísticas por cada rubro de evaluación
function buscarAlumno(grado, idAlumno) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(grado);
  
  if (!hoja) {
    return { exito: false, mensaje: "La hoja '" + grado + "' no existe." };
  }
  
  var datos = hoja.getDataRange().getValues();
  
  // Validar que existan las filas mínimas: Fila 1 (Fechas), Fila 2 (Rubros), Fila 3+ (Alumnos)
  if (datos.length <= 2) { 
    return { exito: false, mensaje: "La hoja seleccionada no contiene suficientes datos." };
  }
  
  var filaFechas = datos[0]; // Fila 1: Encabezados superiores o fechas
  var filaRubros = datos[1]; // Fila 2: Nombres de las columnas / Rubros de evaluación
  
  // Palabras clave de columnas que NO deben contabilizarse como tareas/rubros
  var columnasIgnoradas = ["ID", "APELLIDO", "NOMBRE", "KPI", "CHROMEBOOK #", "CHROMEBOOK", "TOTAL DÍA", "TOTAL DIA", "FINAL"];
  
  // Recorrer filas de alumnos a partir de la Fila 3 (Índice 2)
  for (var i = 2; i < datos.length; i++) {
    var idFila = datos[i][0] ? datos[i][0].toString().trim() : "";
    
    if (idFila === idAlumno.toString().trim()) {
      // Información del alumno encontrado
      var apellido = datos[i][1] ? datos[i][1].toString().trim() : "";
      var nombre = datos[i][2] ? datos[i][2].toString().trim() : "";
      var nombreCompleto = (apellido + " " + nombre).trim() || "Alumno ID: " + idFila;
      
      var infoAlumno = {
        id: idFila,
        nombre: nombreCompleto
      };
      
      var acumuladorRubros = {};
      
      // Recorrer columnas desde la columna C/D en adelante (Índice 1 en adelante)
      for (var j = 1; j < filaRubros.length; j++) {
        var nombreRubro = filaRubros[j] ? filaRubros[j].toString().trim() : "";
        var grupoSuperior = filaFechas[j] ? filaFechas[j].toString().trim().toUpperCase() : "";
        
        if (!nombreRubro) continue;
        
        var rubroUpper = nombreRubro.toUpperCase();
        
        // Omitir columnas informativas y de resumen general / acumulados
        if (columnasIgnoradas.indexOf(rubroUpper) !== -1 || grupoSuperior.indexOf("TOTAL") !== -1) {
          continue;
        }
        
        // Crear el rubro en el acumulador si no existe
        if (!acumuladorRubros[nombreRubro]) {
          acumuladorRubros[nombreRubro] = {
            totalEvaluaciones: 0,
            hechas: 0,
            noHechas: 0,
            sumaNotas: 0,
            conteoNotas: 0,
            asistencias: 0
          };
        }
        
        acumuladorRubros[nombreRubro].totalEvaluaciones++;
        
        var valorCelda = datos[i][j];
        
        // Verificar si la entrega se encuentra vacía / nula
        if (valorCelda === "" || valorCelda === null || valorCelda === undefined) {
          acumuladorRubros[nombreRubro].noHechas++;
        } else {
          acumuladorRubros[nombreRubro].hechas++;
          
          var valStr = valorCelda.toString().trim().toUpperCase();
          
          // Registrar asistencias o calificaciones numéricas
          if (valStr === 'A') {
            acumuladorRubros[nombreRubro].asistencias++;
          } else if (!isNaN(parseFloat(valStr))) {
            acumuladorRubros[nombreRubro].sumaNotas += parseFloat(valStr);
            acumuladorRubros[nombreRubro].conteoNotas++;
          }
        }
      }
      
      // Estructurar los resultados finales redondeados
      var resumenFinal = {};
      for (var rubro in acumuladorRubros) {
        var stat = acumuladorRubros[rubro];
        var promedioCalculado = stat.conteoNotas > 0 
          ? (stat.sumaNotas / stat.conteoNotas).toFixed(2) 
          : "N/A";
          
        resumenFinal[rubro] = {
          total: stat.totalEvaluaciones,
          hechas: stat.hechas,
          noHechas: stat.noHechas,
          promedio: promedioCalculado,
          asistencias: stat.asistencias
        };
      }
      
      return { 
        exito: true, 
        alumno: infoAlumno, 
        resumen: resumenFinal 
      };
    }
  }
  
  return { exito: false, mensaje: "No se encontró un alumno con el ID: " + idAlumno + " en " + grado };
}
