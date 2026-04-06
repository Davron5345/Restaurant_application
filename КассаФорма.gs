// GS код (Code.gs) для ресторана Махалла 90 с дублированием отчетов и записью А.Т. ойлик

function doGet() {
  var output = HtmlService.createHtmlOutputFromFile('КассаФ')
    .setWidth(1600)
    .setHeight(1000)
    .setTitle('💰 Кассовый отчёт');
    output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return output;
}

function showKassaFormDialog() {
  var html = HtmlService.createHtmlOutputFromFile('КассаФ')
    .setWidth(1600)
    .setHeight(1000);
  SpreadsheetApp.getUi().showModalDialog(html, '💰 Кассовый отчёт');
}

function processKassaData(formData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var date = new Date(formData.date);
  var formattedDate = Utilities.formatDate(date, "GMT+3", "dd.MM.yyyy");
  
  // Ищем сумму терминала, А.Т. ойлик и оплаты поставщикам в расходах
  var terminalAmount = 0;
  var terminalData = null; // Данные для записи терминала
  var atOylikData = []; // Массив для хранения всех записей А.Т. ойлик
  var suppliersPayments = []; // Массив для хранения оплат поставщикам
  
  for (var j = 0; j < formData.expenseRecords.length; j++) {
    var rec = formData.expenseRecords[j];
    var articleLower = rec.article ? rec.article.trim().toLowerCase() : "";
    
    if (articleLower === "терминал") {
      terminalAmount = parseFloat(rec.amount.toString().replace(/\s/g, '').replace(',', '.')) || 0;
      if (terminalAmount > 0) {
        terminalData = {
          date: formattedDate,
          restaurant: "Махалла 90", // Для ресторана Махалла 90
          type: "Терминал",
          amount: terminalAmount
        };
      }
    }
    
    // Проверяем на А.Т. ойлик
    if (articleLower === "а.т. ойлик" || articleLower === "а.т.ойлик" || articleLower === "ат ойлик") {
      var amount = parseFloat(rec.amount.toString().replace(/\s/g, '').replace(',', '.')) || 0;
      if (amount > 0) {
        // Берем текст из поля комментарий, если пусто - оставляем пустым или ставим дефолтное значение
        var description = rec.comment ? rec.comment.toString().trim() : "Ишлатишга";
        atOylikData.push({
          date: formattedDate,
          restaurant: "Махалла 90", // Для ресторана Махалла 90
          description: description, // Используем только комментарий
          amount: amount
        });
      }
    }
    
    // Проверяем на оплату поставщикам
    if (articleLower === "поставщики") {
      var amount = parseFloat(rec.amount.toString().replace(/\s/g, '').replace(',', '.')) || 0;
      var supplier = rec.to ? rec.to.toString().trim() : "";
      if (amount > 0 && supplier) {
        suppliersPayments.push({
          date: formattedDate,
          restaurant: "Махалла 90", // Для ресторана Махалла 90
          supplier: supplier,
          amount: amount
        });
      }
    }
  }

  function writeData(sheet) {
    if (!sheet) {
      sheet.appendRow(["№", "Дата", "Тип операции", "Статья операции", "От кого / Кому", "Приход сумма", "Расход сумма", "Коментарии прихода", "Коментарии расхода"]);
    }

    var currentLastRow = sheet.getLastRow();
    var incomeStartRow = currentLastRow + 1;

    var incomeRecords = formData.incomeRecords;
    var specialIncome = ["излишка", "недостача", "савдо сотилган овкатдан", "сумма на начало"];
    for (var i = 0; i < incomeRecords.length; i++) {
      var rec = incomeRecords[i];
      var article = rec.article ? rec.article.trim() : "";
      var amount = parseFloat(rec.amount.toString().replace(/\s/g, '').replace(',', '.')) || 0;
      if (!article || (specialIncome.indexOf(article.toLowerCase()) === -1 && amount === 0)) continue;
      sheet.appendRow([
        "",
        formattedDate,
        "Приход",
        rec.article,
        rec.from,
        rec.amount,
        "",
        rec.comment,
        ""
      ]);
      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).setBackground("#d9ead3");
      sheet.getRange(lastRow, 6).setNumberFormat("#,##0.00");
    }
    var incomeEndRow = sheet.getLastRow();

    var expenseStartRow = incomeEndRow + 1;
    var expenseRecords = formData.expenseRecords;
    var specialExpense = ["излишка", "недостача", "савдо сотилган овкатдан", "сумма на конец"];
    for (var j = 0; j < expenseRecords.length; j++) {
      var rec = expenseRecords[j];
      var article = rec.article ? rec.article.trim() : "";
      var amount = parseFloat(rec.amount.toString().replace(/\s/g, '').replace(',', '.')) || 0;
      if (!article || (specialExpense.indexOf(article.toLowerCase()) === -1 && amount === 0)) continue;
      sheet.appendRow([
        "",
        formattedDate,
        "Расход",
        rec.article,
        rec.to,
        "",
        rec.amount,
        "",
        rec.comment
      ]);
      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).setBackground("#f4cccc");
      sheet.getRange(lastRow, 7).setNumberFormat("#,##0.00");
    }
    var expenseEndRow = sheet.getLastRow();

    if (incomeStartRow <= expenseEndRow) {
        for (var r = incomeStartRow; r <= expenseEndRow; r++) {
            sheet.getRange(r, 1).setValue(r - incomeStartRow + 1);
        }
    }

    sheet.appendRow(["", formattedDate, "", "", "", "", "", "", ""]);
    var summaryRow = sheet.getLastRow();

    var startBalance = parseFloat(formData.startBalance.toString().replace(/\s/g, '').replace(',', '.')) || 0;
    var endBalance = parseFloat(formData.endBalance.toString().replace(/\s/g, '').replace(',', '.')) || 0;

    sheet.getRange(summaryRow, 4).setValue("Остаток на начало: " + formatNumberWithSpacesAndComma(startBalance.toFixed(2)));
    sheet.getRange(summaryRow, 5).setValue("Остаток на конец: " + formatNumberWithSpacesAndComma(endBalance.toFixed(2)));

    if (incomeEndRow >= incomeStartRow) {
      var incomeFormula = "=SUM(F" + incomeStartRow + ":F" + incomeEndRow + ")";
      sheet.getRange(summaryRow, 6).setFormula(incomeFormula)
           .setNumberFormat("#,##0.00");
    } else {
       sheet.getRange(summaryRow, 6).setValue(0).setNumberFormat("#,##0.00");
    }
    if (expenseEndRow >= expenseStartRow) {
      var expenseFormula = "=SUM(G" + expenseStartRow + ":G" + expenseEndRow + ")";
      sheet.getRange(summaryRow, 7).setFormula(expenseFormula)
           .setNumberFormat("#,##0.00");
    } else {
       sheet.getRange(summaryRow, 7).setValue(0).setNumberFormat("#,##0.00");
    }

    var differenceFormula = "=G" + summaryRow + " - F" + summaryRow;
    sheet.getRange(summaryRow, 8).setFormula(differenceFormula)
         .setNumberFormat("#,##0.00");

    sheet.getRange(summaryRow, 1, 1, sheet.getLastColumn())
         .setBackground("#2563eb")
         .setFontColor("#ffffff");

    var newRowsCount = sheet.getLastRow() - currentLastRow;
    if (newRowsCount > 0) {
      sheet.getRange(currentLastRow + 1, 1, newRowsCount, sheet.getLastColumn())
           .setFontFamily("Roboto Condensed")
           .setFontSize(12)
           .setFontColor("black")
           .setFontWeight("normal");
    }
  }

  var sheetName2 = "Касса-1";
  var sheet2 = ss.getSheetByName(sheetName2);
  if (!sheet2) {
    sheet2 = ss.insertSheet(sheetName2);
  }
  writeData(sheet2);

  // Записываем А.Т. ойлик в отдельный файл
  if (atOylikData.length > 0) {
    try {
      writeATOylikToExternalSheet(atOylikData);
      Logger.log("А.Т. ойлик успешно записан в внешний файл");
    } catch (e) {
      Logger.log("Ошибка при записи А.Т. ойлик во внешний файл: " + e);
    }
  }
  
  // Записываем Терминал в отдельный файл
  if (terminalData) {
    try {
      writeTerminalToExternalSheet(terminalData);
      Logger.log("Терминал успешно записан в внешний файл");
    } catch (e) {
      Logger.log("Ошибка при записи Терминала во внешний файл: " + e);
    }
  }
  
  // Записываем оплаты поставщикам в отдельный файл
  if (suppliersPayments.length > 0) {
    try {
      writeSuppliersPaymentsToExternalSheet(suppliersPayments);
      Logger.log("Оплаты поставщикам успешно записаны в внешний файл");
    } catch (e) {
      Logger.log("Ошибка при записи оплат поставщикам во внешний файл: " + e);
    }
  }

  try {
    // Основное уведомление о сохранении
    var notificationMessage = "✅ Махалла 90. Кассовый отчет за " + formattedDate + " успешно записан.";
    sendTelegramNotification(notificationMessage);
    
    // Отправляем сумму терминала в отдельный топик, если она есть
    if (terminalAmount > 0) {
      var terminalMessage = "Отчет по \"Махалла 90\" за " + formattedDate + "\n" +
                           "Терминал: " + formatNumberWithSpacesAndComma(terminalAmount.toFixed(2));
      sendTelegramNotificationToTopic(terminalMessage);
    }
    
    // Отправляем текстовый отчет
    sendTextReport(formData, formattedDate);
    
  } catch (e) {
    Logger.log("Не удалось отправить уведомление Telegram: " + e);
  }

  return "Данные успешно записаны!";
}

// Новая функция для записи А.Т. ойлик во внешний файл
function writeATOylikToExternalSheet(atOylikData) {
  // ID внешнего файла Google Sheets
  var externalSpreadsheetId = "1-JuXg-pAX1Ts-fNWE0P8V8ktAf6kcYa8wTkij9kEGYQ";
  
  try {
    // Открываем внешний файл
    var externalSS = SpreadsheetApp.openById(externalSpreadsheetId);
    
    // Ищем лист "АТ расходы"
    var atSheet = externalSS.getSheetByName("АТ расходы");
    
    // Если листа нет, создаем его
    if (!atSheet) {
      atSheet = externalSS.insertSheet("АТ расходы");
      // Добавляем заголовки
      atSheet.appendRow(["Дата", "Ресторан", "Описание", "Сумма"]);
      // Форматируем заголовки
      atSheet.getRange(1, 1, 1, 4)
        .setBackground("#f1f1f1")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
    }
    
    // Проверяем наличие заголовков
    var lastRow = atSheet.getLastRow();
    if (lastRow === 0) {
      atSheet.appendRow(["Дата", "Ресторан", "Описание", "Сумма"]);
      atSheet.getRange(1, 1, 1, 4)
        .setBackground("#f1f1f1")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
    }
    
    // Записываем данные А.Т. ойлик
    for (var i = 0; i < atOylikData.length; i++) {
      var record = atOylikData[i];
      atSheet.appendRow([
        record.date,
        record.restaurant,
        record.description,
        record.amount
      ]);
      
      // Форматируем добавленную строку
      var newRow = atSheet.getLastRow();
      atSheet.getRange(newRow, 4).setNumberFormat("#,##0.00"); // Форматируем сумму
      atSheet.getRange(newRow, 1, 1, 4)
        .setFontFamily("Roboto Condensed")
        .setFontSize(11);
    }
    
    Logger.log("Записано " + atOylikData.length + " записей А.Т. ойлик во внешний файл");
    
  } catch (e) {
    Logger.log("Ошибка при работе с внешним файлом: " + e);
    throw e;
  }
}

// Новая функция для записи Терминала во внешний файл
function writeTerminalToExternalSheet(terminalData) {
  // ID внешнего файла Google Sheets
  var externalSpreadsheetId = "1-JuXg-pAX1Ts-fNWE0P8V8ktAf6kcYa8wTkij9kEGYQ";
  
  try {
    // Открываем внешний файл
    var externalSS = SpreadsheetApp.openById(externalSpreadsheetId);
    
    // Ищем лист "Продажа"
    var saleSheet = externalSS.getSheetByName("Продажа");
    
    // Если листа нет, создаем его
    if (!saleSheet) {
      saleSheet = externalSS.insertSheet("Продажа");
      // Добавляем заголовки
      saleSheet.appendRow(["Дата", "Ресторан", "Тип", "Сумма"]);
      // Форматируем заголовки
      saleSheet.getRange(1, 1, 1, 4)
        .setBackground("#f1f1f1")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
    }
    
    // Проверяем наличие заголовков
    var lastRow = saleSheet.getLastRow();
    if (lastRow === 0) {
      saleSheet.appendRow(["Дата", "Ресторан", "Тип", "Сумма"]);
      saleSheet.getRange(1, 1, 1, 4)
        .setBackground("#f1f1f1")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
    }
    
    // Записываем данные терминала
    saleSheet.appendRow([
      terminalData.date,
      terminalData.restaurant,
      terminalData.type,
      terminalData.amount
    ]);
    
    // Форматируем добавленную строку
    var newRow = saleSheet.getLastRow();
    saleSheet.getRange(newRow, 4).setNumberFormat("#,##0.00"); // Форматируем сумму
    saleSheet.getRange(newRow, 1, 1, 4)
      .setFontFamily("Roboto Condensed")
      .setFontSize(11);
    
    Logger.log("Терминал записан во внешний файл: " + terminalData.amount);
    
  } catch (e) {
    Logger.log("Ошибка при записи терминала во внешний файл: " + e);
    throw e;
  }
}

// Новая функция для записи оплат поставщикам во внешний файл
function writeSuppliersPaymentsToExternalSheet(suppliersPayments) {
  // ID внешнего файла Google Sheets
  var externalSpreadsheetId = "1-JuXg-pAX1Ts-fNWE0P8V8ktAf6kcYa8wTkij9kEGYQ";
  
  // Маппинг поставщиков
  var supplierMapping = {
    "гуруч - фарход ака": "Гуруч - Фарход ака",
    "думгаза - бахтиёр ака": "Думгаза - Бахтиёр ака",
    "писта ёг - элмурод ака": "Ёг - 'SANDIDA TREYD' Элмурод ака",
    "вагури - атхам ака": "Куй гушти - 'BUKHARA MEAT' Атхам ака",
    "куй гушти - жалил ака": "Куй гушти - Жалил ака",
    "мол гушти - мурод ака": "Мол гушти - 'CIBOS FOODSERVICE' Мурод ака",
    "от гушти - исроил ака": "От гушти - Исроил ака",
    "ун - абдушукур ака": "Ун - 'TASH MILL' Абдушукур ака",
    "чарви - абдулхамид": "Чарви - Абдулхамид",
    "шакар - элмурод ака": "Шакар - 'SANDIDA TREYD' Элмурод ака"
  };
  
  try {
    // Сначала получаем курс доллара из ОСНОВНОГО файла
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var usdRate = 1; // Дефолтное значение
    
    // Ищем лист "Курс доллара" в основном файле
    var currencySheet = ss.getSheetByName("Курс доллара");
    if (currencySheet) {
      var rate = currencySheet.getRange("B2").getValue();
      if (rate && !isNaN(rate)) {
        usdRate = parseFloat(rate);
        Logger.log("Курс доллара из основного файла: " + usdRate);
      }
    } else {
      Logger.log("Лист 'Курс доллара' не найден в основном файле");
    }
    
    // Получаем информацию о валюте поставщиков из БД
    var dbSheet;
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getName().startsWith("БД ")) {
        dbSheet = sheets[i];
        break;
      }
    }
    
    var suppliersCurrency = {}; // Объект для хранения информации о валюте
    if (dbSheet) {
      var lastRow = dbSheet.getLastRow();
      if (lastRow > 1) {
        // Читаем названия поставщиков (столбец D) и флаги валюты (столбец C)
        var suppliers = dbSheet.getRange("D2:D" + lastRow).getValues();
        var currencies = dbSheet.getRange("C2:C" + lastRow).getValues();
        
        for (var i = 0; i < suppliers.length; i++) {
          if (suppliers[i][0]) {
            var supplierName = suppliers[i][0].toString().trim().toLowerCase();
            var usesUSD = currencies[i][0] === true;
            suppliersCurrency[supplierName] = usesUSD;
            
            if (usesUSD) {
              Logger.log("Поставщик '" + suppliers[i][0] + "' работает в ДОЛЛАРАХ");
            }
          }
        }
      }
    }
    
    // Теперь открываем внешний файл для записи
    var externalSS = SpreadsheetApp.openById(externalSpreadsheetId);
    
    // Ищем лист "Оплата"
    var paymentSheet = externalSS.getSheetByName("Оплата");
    
    // Если листа нет, создаем его
    if (!paymentSheet) {
      paymentSheet = externalSS.insertSheet("Оплата");
      // Добавляем заголовки
      paymentSheet.appendRow(["Дата", "Ресторан", "Тип операции", "Поставщик", "Тип оплаты", "Сумма оплаты"]);
      // Форматируем заголовки
      paymentSheet.getRange(1, 1, 1, 6)
        .setBackground("#f1f1f1")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
    }
    
    // Проверяем наличие заголовков
    var lastRow = paymentSheet.getLastRow();
    if (lastRow === 0) {
      paymentSheet.appendRow(["Дата", "Ресторан", "Тип операции", "Поставщик", "Тип оплаты", "Сумма оплаты"]);
      paymentSheet.getRange(1, 1, 1, 6)
        .setBackground("#f1f1f1")
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
    }
    
    // Записываем данные оплат поставщикам
    for (var i = 0; i < suppliersPayments.length; i++) {
      var payment = suppliersPayments[i];
      var supplierLower = payment.supplier.toLowerCase();
      
      // Получаем правильное название поставщика из маппинга
      var mappedSupplier = supplierMapping[supplierLower] || payment.supplier;
      
      // Проверяем, работает ли поставщик с долларами
      var paymentAmount = payment.amount;
      if (suppliersCurrency[supplierLower] === true && usdRate > 0) {
        // Конвертируем сумму в доллары
        var originalAmount = payment.amount;
        paymentAmount = payment.amount / usdRate;
        Logger.log("Конвертация для '" + payment.supplier + "': " + 
                  originalAmount + " сум / " + usdRate + " = " + paymentAmount + " USD");
      } else {
        Logger.log("Поставщик '" + payment.supplier + "' работает в СУМАХ, сумма: " + paymentAmount);
      }
      
      paymentSheet.appendRow([
        payment.date,
        payment.restaurant,
        "Оплата",
        mappedSupplier,
        "Наличные",
        paymentAmount
      ]);
      
      // Форматируем добавленную строку
      var newRow = paymentSheet.getLastRow();
      paymentSheet.getRange(newRow, 6).setNumberFormat("#,##0.00"); // Форматируем сумму
      paymentSheet.getRange(newRow, 1, 1, 6)
        .setFontFamily("Roboto Condensed")
        .setFontSize(11);
    }
    
    Logger.log("Записано " + suppliersPayments.length + " оплат поставщикам во внешний файл");
    
  } catch (e) {
    Logger.log("Ошибка при записи оплат поставщикам во внешний файл: " + e);
    throw e;
  }
}

// Функция для отправки текстового отчета для Махалла 90 (параллельно в две группы)
function sendTextReport(formData, formattedDate) {
  var message = "📊 КАССОВЫЙ ОТЧЕТ за " + formattedDate + "\n\n";
  
  message += "💰 ПРИХОДЫ:\n";
  var incomeTotal = 0;
  var incomeCount = 0;
  
  for (var i = 0; i < formData.incomeRecords.length; i++) {
    var rec = formData.incomeRecords[i];
    var article = rec.article ? rec.article.toString().trim() : "";
    var amount = parseFloat(rec.amount.toString().replace(/\s/g, '').replace(',', '.')) || 0;
    var from = rec.from ? rec.from.toString().trim() : "";
    var comment = rec.comment ? rec.comment.toString().trim() : "";
    
    if (article && amount > 0) {
      incomeCount++;
      incomeTotal += amount;
      
      // Формируем название статьи с дополнительной информацией
      var itemName = article;
      var additionalInfo = "";
      
      if (from && comment) {
        additionalInfo = " (" + from + ", " + comment + ")";
      } else if (from) {
        additionalInfo = " (" + from + ")";
      } else if (comment) {
        additionalInfo = " (" + comment + ")";
      }
      
      message += incomeCount + ". " + itemName + additionalInfo + " - " + formatNumberWithSpacesAndComma(amount.toFixed(2)) + "\n";
    }
  }
  
  message += "ИТОГО ПРИХОД: " + formatNumberWithSpacesAndComma(incomeTotal.toFixed(2)) + "\n\n";
  
  message += "💸 РАСХОДЫ:\n";
  var expenseTotal = 0;
  var expenseCount = 0;
  
  for (var j = 0; j < formData.expenseRecords.length; j++) {
    var rec = formData.expenseRecords[j];
    var article = rec.article ? rec.article.toString().trim() : "";
    var amount = parseFloat(rec.amount.toString().replace(/\s/g, '').replace(',', '.')) || 0;
    var to = rec.to ? rec.to.toString().trim() : "";
    var comment = rec.comment ? rec.comment.toString().trim() : "";
    
    if (article && amount > 0) {
      expenseCount++;
      expenseTotal += amount;
      
      // Формируем название статьи с дополнительной информацией
      var itemName = article;
      var additionalInfo = "";
      
      if (to && comment) {
        additionalInfo = " (" + to + ", " + comment + ")";
      } else if (to) {
        additionalInfo = " (" + to + ")";
      } else if (comment) {
        additionalInfo = " (" + comment + ")";
      }
      
      message += expenseCount + ". " + itemName + additionalInfo + " - " + formatNumberWithSpacesAndComma(amount.toFixed(2)) + "\n";
    }
  }
  
  message += "ИТОГО РАСХОД: " + formatNumberWithSpacesAndComma(expenseTotal.toFixed(2)) + "\n\n";
  message += "Разница: " + formatNumberWithSpacesAndComma((incomeTotal - expenseTotal).toFixed(2));
  
  // Конфигурация для отправки в две группы параллельно
  var botToken = "7804555297:AAH7YFsNeJeSo5-fyVWybbAjut6VSnF96Sw";
  var apiUrl = "https://api.telegram.org/bot" + botToken + "/sendMessage";
  
  // Массив групп для отправки текстового отчета Махалла 90
  var targetGroups = [
    {
      chatId: "-1002786872448",  // Основная группа для Махалла 90
      topicId: 2              // Топик для текстового отчета
    },
    {
      chatId: "-1002836364736",     // Дополнительная группа для дублирования
      topicId: null             // Без топика (отправка в общий чат)
    }
  ];
  
  // Отправляем в каждую группу
  targetGroups.forEach(function(target, index) {
    var payload = {
      'chat_id': target.chatId,
      'text': message
    };
    
    // Добавляем топик только если он указан
    if (target.topicId !== null) {
      payload.message_thread_id = target.topicId;
    }

    var options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };

    try {
      var response = UrlFetchApp.fetch(apiUrl, options);
      Logger.log("Текстовый отчет Махалла 90 отправлен в группу " + (index + 1) + ". Response Code: " + response.getResponseCode());
      Logger.log("Response Body: " + response.getContentText());
    } catch (e) {
      Logger.log("Ошибка отправки текстового отчета Махалла 90 в группу " + (index + 1) + ": " + e);
    }
  });
}

// Функция для отправки сообщения в определенный топик (терминал для Махалла 90)
function sendTelegramNotificationToTopic(messageText) {
  var botToken = "7804555297:AAH7YFsNeJeSo5-fyVWybbAjut6VSnF96Sw";
  var chatId = "-1002786872448";  // Группа для Махалла 90
  var topicId = 7;                // Топик для терминала Махалла 90
  
  var apiUrl = "https://api.telegram.org/bot" + botToken + "/sendMessage";
  
  var payload = {
    'chat_id': chatId,
    'text': messageText,
    'message_thread_id': topicId,
    'parse_mode': 'HTML'
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  try {
    var response = UrlFetchApp.fetch(apiUrl, options);
    Logger.log("Telegram Response Code: " + response.getResponseCode());
    Logger.log("Telegram Response Body: " + response.getContentText());
  } catch (e) {
    Logger.log("Error sending Telegram message: " + e);
  }
}

// Основная функция отправки уведомлений (остается без изменений)
function sendTelegramNotification(messageText) {
  var botToken = "7737930529:AAHuwIYV9bHeSOzP_0MwKgx4Y0LpLZm9cac";
  var chatIds = ["885440903", "6011570762"];
  var apiUrl = "https://api.telegram.org/bot" + botToken + "/sendMessage";

  chatIds.forEach(function(chatId) {
    var payload = {
      'chat_id': chatId,
      'text': messageText
    };

    var options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };

    try {
      var response = UrlFetchApp.fetch(apiUrl, options);
      Logger.log("Telegram Response Code for chat_id " + chatId + ": " + response.getResponseCode());
      Logger.log("Telegram Response Body for chat_id " + chatId + ": " + response.getContentText());
    } catch (e) {
      Logger.log("Error sending Telegram message to chat_id " + chatId + ": " + e);
    }
  });
}

function formatNumberWithSpacesAndComma(numStr) {
  var parts = numStr.split('.');
  var intPart = parts[0];
  var decPart = parts[1] ? parts[1] : "";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return decPart ? intPart + ',' + decPart : intPart;
}

function getIncomeOptions() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet;
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().startsWith("БД ")) {
      sheet = sheets[i];
      break;
    }
  }
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  var values = sheet.getRange("T2:T" + lastRow).getValues();
  var options = [];
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString().trim() !== "") {
      options.push(values[i][0].toString());
    }
  }
  return options;
}

function getExpenseOptions() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet;
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().startsWith("БД ")) {
      sheet = sheets[i];
      break;
    }
  }
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  var values = sheet.getRange("U2:U" + lastRow).getValues();
  var options = [];
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString().trim() !== "") {
      options.push(values[i][0].toString());
    }
  }
  return options;
}

function getBankOptions() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet;
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().startsWith("БД ")) {
      sheet = sheets[i];
      break;
    }
  }
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  var values = sheet.getRange("V2:V" + lastRow).getValues();
  var options = [];
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString().trim() !== "") {
      options.push(values[i][0].toString());
    }
  }
  return options;
}

function getKassaSuppliers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet;
  var restaurantName;
  for (var i = 0; i < sheets.length; i++) {
    var sheetName = sheets[i].getName();
    if (sheetName.startsWith("БД ")) {
      sheet = sheets[i];
      restaurantName = sheetName.replace("БД ", "").trim();
      break;
    }
  }
  if (!sheet) return [];
  
  var headers = sheet.getRange("A1:R1").getValues()[0];
  var columnIndex;
  if (restaurantName === headers[15]) columnIndex = "P";
  else if (restaurantName === headers[16]) columnIndex = "Q";
  else if (restaurantName === headers[17]) columnIndex = "R";
  else return [];
  
  var lastRow = sheet.getLastRow();
  var suppliers = sheet.getRange("D2:D" + lastRow).getValues();
  var flags = sheet.getRange(columnIndex + "2:" + columnIndex + lastRow).getValues();
  var options = [];
  for (var i = 0; i < suppliers.length; i++) {
    if (suppliers[i][0] && suppliers[i][0].toString().trim() !== "" && flags[i][0] === true) {
      options.push(suppliers[i][0].toString());
    }
  }
  return options;
}

function getCommunalOptions() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet;
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().startsWith("БД ")) {
      sheet = sheets[i];
      break;
    }
  }
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  var values = sheet.getRange("Y2:Y" + lastRow).getValues();
  var options = [];
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString().trim() !== "") {
      options.push(values[i][0].toString());
    }
  }
  return options;
}