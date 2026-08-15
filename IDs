function reemplazarColumnaID() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  
  // Conectores / preposiciones a ignorar en nombres y apellidos
  var stopWords = ["DE", "DEL", "LA", "LAS", "LOS", "Y", "EL", "MC"];
  
  sheets.forEach(function(sheet) {
    var lastRow = sheet.getLastRow();
    if (lastRow < 3) return; // Si la hoja no tiene datos a partir de la fila 3, continuar
    
    // Obtener todos los datos de la hoja
    var data = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
    
    // 1. Detectar columnas de Apellido y Nombre buscando en las primeras 3 filas
    var apIndex = -1;
    var noIndex = -1;
    
    for (var r = 0; r < Math.min(3, data.length); r++) {
      var rowValues = data[r];
      for (var c = 0; c < rowValues.length; c++) {
        var cellText = rowValues[c] ? rowValues[c].toString().toUpperCase() : "";
        if (cellText.indexOf("APELLIDO") !== -1) apIndex = c;
        if (cellText.indexOf("NOMBRE") !== -1) noIndex = c;
      }
    }
    
    // Si no se encontraron por texto de encabezado, asumir Columna B (índice 1) y Columna C (índice 2)
    if (apIndex === -1) apIndex = 1;
    if (noIndex === -1) noIndex = 2;
    
    // 2. Procesar filas iniciando explícitamente desde la Fila 3 (índice 2)
    for (var i = 2; i < data.length; i++) {
      var realRowNum = i + 1; // Fila real en Google Sheets (3, 4, 5...)
      
      var origId = data[i][0]; // Número de lista o ID original de la columna A
      var apellido = data[i][apIndex] ? data[i][apIndex].toString() : "";
      var nombre = data[i][noIndex] ? data[i][noIndex].toString() : "";
      
      // Si la fila no tiene ni apellido ni nombre, omitir
      if (!apellido.trim() && !nombre.trim()) continue;
      
      // Limpiar acentos y pasar a mayúsculas
      var cleanAp = limpiarTexto(apellido);
      var cleanNo = limpiarTexto(nombre);
      
      // Filtrar palabras vacías o stopWords
      var apWords = cleanAp.split(/\s+/).filter(w => w && stopWords.indexOf(w) === -1);
      var noWords = cleanNo.split(/\s+/).filter(w => w && stopWords.indexOf(w) === -1);
      
      if (apWords.length === 0) apWords = cleanAp.split(/\s+/).filter(w => w);
      if (noWords.length === 0) noWords = cleanNo.split(/\s+/).filter(w => w);
      
      // Generar la combinación de 4 letras según la cantidad de palabras
      var letters = "";
      if (apWords.length >= 2 && noWords.length >= 2) {
        letters = apWords[0][0] + apWords[1][0] + noWords[0][0] + noWords[1][0];
      } else if (apWords.length >= 2 && noWords.length === 1) {
        var n1 = noWords[0];
        letters = apWords[0][0] + apWords[1][0] + n1[0] + (n1.length > 1 ? n1[1] : 'X');
      } else if (apWords.length === 1 && noWords.length >= 2) {
        var a1 = apWords[0];
        letters = a1[0] + (a1.length > 1 ? a1[1] : 'X') + noWords[0][0] + noWords[1][0];
      } else if (apWords.length === 1 && noWords.length === 1) {
        var a1 = apWords[0], n1 = noWords[0];
        letters = a1[0] + (a1.length > 1 ? a1[1] : 'X') + n1[0] + (n1.length > 1 ? n1[1] : 'X');
      } else {
        letters = (apWords.join("") + noWords.join("") + "XXXX").substring(0, 4);
      }
      
      // Formatear el número de lista con dos dígitos (ej. 1 -> 01)
      var numPadded = ("0" + origId).slice(-2);
      var newID = letters + numPadded;
      
      // Reemplazar directamente en la Celda A de esa fila
      sheet.getRange(realRowNum, 1).setValue(newID);
    }
  });
}

function limpiarTexto(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
}
