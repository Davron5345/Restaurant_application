< !DOCTYPE html><html><head><meta charset="UTF-8"><title>КассаФ</title><script src="https://code.jquery.com/jquery-3.6.0.min.js"></script><link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" /><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script><style> :root {
    --base-font-size: 18px;
    --input-height: 56px !important;
    --border-color: #CCC;
    --cell-padding: 2px;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #ccc;
    font-family: 'Roboto Condensed', sans-serif;
    font-size: var(--base-font-size);
    color: black;
    overflow: auto;
}

.fixed-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background: #fff;
    z-index: 1200;
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
}

.header-balances {
    display: flex;
    align-items: center;
    gap: 15px;
    border-radius: 6px;
}

.header-balances label {
    font-weight: bold;
}

.header-balances input {
    height: 30px;
    padding: 4px;
    border: 1px solid var(--border-color);
    background: #f8fafc;
    color: black;
    font-size: var(--base-font-size);
}

.date-selection {
    display: flex;
    align-items: center;
    gap: 5px;
}

.date-selection label {
    font-weight: bold;
}

.stepper-container {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-right: 20px;
}

.stepper {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 8px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    list-style: none;
    margin: 0;
    cursor: pointer;
}

.stepper li {
    display: flex;
    align-items: center;
    color: #6b7280;
}

.stepper li.active {
    color: #2563eb;
    font-weight: bold;
}

.stepper li span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 4px;
    font-size: 10px;
    border: 1px solid #fff;
    border-radius: 50%;
    flex-shrink: 0;
    color: #fff;
}

.stepper li.active span {
    border-color: #fff;
    color: #fff;
}

#contentContainer {
    position: absolute;
    top: 40px;
    bottom: 20px;
    left: 0;
    right: 0;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 6px;
}

.step {
    width: 100%;
    display: none;
}

.step.active {
    display: block;
}

#progressModal {
    display: none;
    position: fixed;
    z-index: 1300;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

#progressModal .modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #f9f9f9;
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    width: 80%;
    max-width: 400px;
    text-align: center;
}

#progressMessage {
    font-weight: bold;
    margin-bottom: 5px;
}

#progressBarContainer {
    width: 100%;
    background-color: #ddd;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
}

#progressBar {
    height: 100%;
    width: 0%;
    background-color: #2563eb;
    border-radius: 4px;
    transition: width 0.3s;
}

.tableContainer {
    width: 100%;
    margin-bottom: 10px;
}

table {
    border-collapse: collapse;
    width: 100%;
    table-layout: auto;
    margin-top: 31px;
    margin-bottom: 20px;
}

th,
td {
    border: 1px solid var(--border-color);
    padding: var(--cell-padding);
    text-align: left;
}

th {
    text-align: center;
    background: #f1f1f1;
}

th:first-child,
td:first-child {
    text-align: center;
    width: 5%;
}

table input,
table select {
    width: 100%;
    height: var(--input-height);
    border: 1px solid var(--border-color);
    padding: 16px;
    box-sizing: border-box;
    background: #fff;
    color: black;
    font-family: inherit;
    font-size: var(--base-font-size);
    border-radius: 6px;
}

input:focus,
select:focus {
    border-color: #2563eb;
}

button.squareBtn {
    width: var(--input-height);
    height: var(--input-height);
    padding: 0;
    font-size: var(--base-font-size);
    cursor: pointer;
    border-radius: 4px;
    border: none;
}

button.primaryBtn {
    padding: 0 20px;
    height: var(--input-height);
    cursor: pointer;
    border-radius: 4px;
    border: none;
    background-color: #2563eb;
    color: #ffffff;
    margin: 5px 0;
    font-size: var(--base-font-size);
}

button.primaryBtn:disabled {
    cursor: not-allowed;
}

.totals {
    margin-right: 25px;
    text-align: right;
    margin-top: 25px;
    font-weight: bold;
}

input[type="date"]:disabled {
    background-color: #ccc;
    color: #999;
    border: 1px solid #ccc;
    box-shadow: none;
    cursor: not-allowed;
    -webkit-text-fill-color: #999;
}

input[type="date"]:disabled::-webkit-calendar-picker-indicator {
    display: none;
}

.select2-container--default .select2-selection--single {
    height: var(--input-height) !important;
    line-height: var(--input-height) !important;
    min-height: var(--input-height) !important;
    box-sizing: border-box;
}

.select2-container--default .select2-selection--single .select2-selection__rendered {
    line-height: var(--input-height);
    font-size: var(--base-font-size);
}

.select2-container--default .select2-selection--single .select2-selection__arrow {
    height: var(--input-height);
}

.select2-container .select2-selection--single {
    border-radius: 6px;
    height: var(--input-height) !important;
    line-height: var(--input-height) !important;
    min-height: var(--input-height) !important;
    box-sizing: border-box;
}

@keyframes blink-border {
    0% {
        border-color: initial;
    }

    50% {
        border-color: #2563eb;
    }

    100% {
        border-color: initial;
    }
}

.blink-border {
    animation: blink-border 0.5s ease-in-out 4;
}

#scrollToTopBtn {
    display: none;
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: var(--input-height);
    height: var(--input-height);
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: var(--base-font-size);
    cursor: pointer;
}

</style><script>var incomeOptions=[];
var expenseOptions=[];
var submitted=false;
var progress=0;
var progressInterval;
var currentStep=1;
var startBalanceValue=0;
var endBalanceValue=0;

function getColorForValue(val) {
    var hash=0;

    for (var i=0; i < val.length; i++) {
        hash=val.charCodeAt(i)+((hash << 5) - hash);
    }

    var hue=Math.abs(hash) % 360;
    return "hsl("+hue+", 70%, 50%)";
}

function formatArticleOption(state) {
    if ( !state.id) {
        return state.text;
    }

    var color=getColorForValue(state.text);
    var $state =$('<span style="display: inline-flex; align-items: center;">' + '<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:' + color + '; margin-right:5px;"></span>' + state.text + '</span>'
    );
    return $state;
}

function scrollToBottom() {
    var container=document.getElementById("contentContainer");
    container.scrollTop=container.scrollHeight;
}

function scrollToTop() {
    var container=document.getElementById("contentContainer");
    container.scrollTop=0;
}

function formatNumberWithSpacesAndComma(val) {
    if ( !val) return "";
    val=val.toString().replace(/\s+/g, '').replace('.', ',');
    var parts=val.split(',');
    var intPart=parts[0];
    var decPart=parts[1] ? parts[1]: "";

    intPart=intPart.replace(/\B(?=(\d {
                    3
                })+(? !\d))/g, ' ');
    return decPart ? intPart+','+decPart : intPart;
}

function parseNumberForCalculation(val) {
    if ( !val) return 0;
    val=val.toString().replace(/\s+/g, '').replace(',', '.');
    var num=parseFloat(val);
    return isNaN(num) ? 0: num;
}

function showStep(step) {
    currentStep=step;

    document.querySelectorAll(".step").forEach(function(s) {
            s.classList.remove("active");
        });
    var target=document.getElementById("step" + step);

    if (target) {
        target.classList.add("active");
    }

    document.querySelectorAll(".stepper li").forEach(function(li, idx) {
            li.classList.toggle("active", (idx + 1)===step);
        });
}

function confirmAndSave() {
    if (submitted) return;
    var dateVal=document.getElementById("dateInput").value;

    if ( !dateVal) {
        alert("Заполните дату");
        return;
    }

    var expenseTbody=document.getElementById("expenseTbody");

    for (var j=0; j < expenseTbody.rows.length; j++) {
        var row=expenseTbody.rows[j];
        var articleElem=row.cells[1].querySelector("input, select");

        if (articleElem && articleElem.value.trim().toLowerCase()==="поставщики") {
            var toElem=row.cells[2].querySelector("input, select");

            if ( !toElem || toElem.value.trim()==="") {
                $(toElem).addClass("blink-border");

                setTimeout(function() {
                        $(toElem).removeClass("blink-border");
                    }

                    , 2000);
                alert("Выберите поставщика из списка");
                return;
            }
        }
    }

    document.getElementById("progressModal").style.display="block";
    document.getElementById("progressMessage").innerText="Запись началась";
    document.getElementById("progressBar").style.width="0%";
    progress=0;

    progressInterval=setInterval(function() {
            if (progress < 90) {
                progress +=2;
                document.getElementById("progressBar").style.width=progress + "%";
            }

            else {
                clearInterval(progressInterval);
            }
        }

        , 100);

    var formData=gatherFormData();
    var dateFormatted=formData.date.split('-').reverse().join('.');

    if ( !formData.incomeRecords.length && !formData.expenseRecords.length) {
        alert("Нет данных для записи");
        document.getElementById("progressModal").style.display="none";
        return;
    }

    saveFormData(formData, dateFormatted);
}

function updateTotals() {
    var totalIncome=0,
    totalIncomeSummary=0;
    var incomeTbody=document.getElementById("incomeTbody");

    for (var i=0; i < incomeTbody.rows.length; i++) {
        var row=incomeTbody.rows[i];
        var articleElem=row.cells[1].querySelector("input, select");
        var article=articleElem ? articleElem.value.trim().toLowerCase(): "";
        var amtInput=row.cells[3].querySelector("input");
        var amt=parseNumberForCalculation(amtInput.value);

        if (article==="сумма на начало") {
            totalIncomeSummary+=amt;
        }

        totalIncome+=amt;
    }

    startBalanceValue=totalIncomeSummary;
    document.getElementById("incomeSum").innerText=formatNumberWithSpacesAndComma(totalIncome.toFixed(2));

    var totalExpense=0,
    totalExpenseSummary=0;
    var expenseTbody=document.getElementById("expenseTbody");

    for (var j=0; j < expenseTbody.rows.length; j++) {
        var row=expenseTbody.rows[j];
        var articleElem=row.cells[1].querySelector("input, select");
        var article=articleElem ? articleElem.value.trim().toLowerCase(): "";
        var amtInput=row.cells[3].querySelector("input");
        var amt=parseNumberForCalculation(amtInput.value);

        if (article==="сумма на конец") {
            totalExpenseSummary+=amt;
        }

        totalExpense+=amt;
    }

    endBalanceValue=totalExpenseSummary;
    document.getElementById("expenseSum").innerText=formatNumberWithSpacesAndComma(totalExpense.toFixed(2));

    document.getElementById("startBalance").value=formatNumberWithSpacesAndComma(startBalanceValue.toFixed(2));
    document.getElementById("endBalance").value=formatNumberWithSpacesAndComma(endBalanceValue.toFixed(2));

    var incomeRows=incomeTbody.rows.length;
    var expenseRows=expenseTbody.rows.length;
    document.getElementById("scrollToTopBtn").style.display=(incomeRows + expenseRows > 12) ? "block" : "none";
}

function populateIncomeTable(options) {
    var tbody=document.getElementById("incomeTbody");
    tbody.innerHTML="";
    var defaults=["Излишка",
    "Савдо сотилган овкатдан",
    "Сумма на начало"];

    for (var i=0; i < defaults.length; i++) {
        var article=defaults[i];
        var row=tbody.insertRow();

        row.innerHTML=` <td>$ {
            i+1
        }

        </td><td><select style="width:100%" onchange="incomeArticleChanged(this)" disabled><option value="${article}">$ {
            article
        }

        </option></select></td><td><input type="text" placeholder="От кого" /></td><td><input type="text" placeholder="Приход сумма"
        oninput="this.value=this.value.replace(/[^\\d,]/g,'');"
        onblur="this.value=formatNumberWithSpacesAndComma(this.value); updateTotals();"

        $ {
            ["излишка",
            "савдо сотилган овкатдан"].includes(article.toLowerCase()) ? 'readonly': ''
        }

        /></td><td><input type="text" placeholder="Комментарии" /></td><td></td>`;
        var sel=row.cells[1].querySelector("select");

        $(sel).select2({
            dropdownParent: $('body'),
            templateResult: formatArticleOption,
            templateSelection: formatArticleOption
        });
    incomeArticleChanged(sel);
}

addIncomeRow(); // Добавляем одну пустую строку (пункт 6)
updateTotals();
}

function populateExpenseTable(options) {
    var tbody=document.getElementById("expenseTbody");
    tbody.innerHTML="";
    var defaults=["Недостача",
    "Дивидент хужайинларга",
    "Сумма на конец"];

    for (var i=0; i < defaults.length; i++) {
        var article=defaults[i];
        var row=tbody.insertRow();

        row.innerHTML=` <td>$ {
            i+1
        }

        </td><td><select style="width:100%" onchange="expenseArticleChanged(this)" disabled><option value="${article}">$ {
            article
        }

        </option></select></td><td><input type="text" placeholder="Кому" /></td><td><input type="text" placeholder="Расход сумма"
        oninput="this.value=this.value.replace(/[^\\d,]/g,'');"
        onblur="this.value=formatNumberWithSpacesAndComma(this.value); updateTotals();"

        $ {
            article.toLowerCase()==="недостача" ? 'readonly': ''
        }

        /></td><td><input type="text" placeholder="Комментарии" /></td><td></td>`;
        var sel=row.cells[1].querySelector("select");

        $(sel).select2({
            dropdownParent: $('body'),
            templateResult: formatArticleOption,
            templateSelection: formatArticleOption
        });
    expenseArticleChanged(sel);
}

addExpenseRow(); // Добавляем одну пустую строку (пункт 6)
updateTotals();
}

function addIncomeRow() {
    var tbody=document.getElementById("incomeTbody");
    var rowCount=tbody.rows.length;
    var row=tbody.insertRow();
    var selectHTML='<select style="width:100%" onchange="incomeArticleChanged(this); updateTotals();">';
    selectHTML+='<option value="">Выберите статью</option>';

    for (var i=0; i < incomeOptions.length; i++) {
        selectHTML+='<option value="'+incomeOptions[i]+'">'+incomeOptions[i]+'</option>';
    }

    selectHTML+='</select>';
    row.innerHTML='<td>'+(rowCount+1)+'</td>'+'<td>'+selectHTML+'</td>'+'<td><input type="text" placeholder="От кого"></td>'+'<td><input type="text" placeholder="Приход сумма" oninput="this.value=this.value.replace(/[^\\d,]/g,\'\');" onblur="this.value=formatNumberWithSpacesAndComma(this.value); updateTotals();" /></td>'+'<td><input type="text" placeholder="Комментарии"></td>'+'<td><button onclick="removeIncomeRow(this)" class="squareBtn">–</button></td>';

    $(row.cells[1].querySelector("select")).select2({
        dropdownParent: $('body'),
        templateResult: formatArticleOption,
        templateSelection: formatArticleOption
    });
incomeArticleChanged(row.cells[1].querySelector("select"));
updateTotals();
scrollToBottom();
}

function removeIncomeRow(btn) {
    var tbody=document.getElementById("incomeTbody");

    if (tbody.rows.length > 4) {
        // Оставляем 3 обязательные + 1 пустую
        var row=btn.parentElement.parentElement;
        row.parentElement.removeChild(row);
        updateRowNumbers(tbody);
        updateTotals();
    }
}

function addExpenseRow() {
    var tbody=document.getElementById("expenseTbody");
    var rowCount=tbody.rows.length;
    var row=tbody.insertRow();
    var selectHTML='<select style="width:100%" onchange="expenseArticleChanged(this); updateTotals();">';
    selectHTML+='<option value="">Выберите статью</option>';

    for (var i=0; i < expenseOptions.length; i++) {
        selectHTML+='<option value="'+expenseOptions[i]+'">'+expenseOptions[i]+'</option>';
    }

    selectHTML+='</select>';
    row.innerHTML='<td>'+(rowCount+1)+'</td>'+'<td>'+selectHTML+'</td>'+'<td><input type="text" placeholder="Кому"></td>'+'<td><input type="text" placeholder="Расход сумма" oninput="this.value=this.value.replace(/[^\\d,]/g,\'\');" onblur="this.value=formatNumberWithSpacesAndComma(this.value); updateTotals();" /></td>'+'<td><input type="text" placeholder="Комментарии"></td>'+'<td><button onclick="removeExpenseRow(this)" class="squareBtn">–</button></td>';

    $(row.cells[1].querySelector("select")).select2({
        dropdownParent: $('body'),
        templateResult: formatArticleOption,
        templateSelection: formatArticleOption
    });
expenseArticleChanged(row.cells[1].querySelector("select"));
updateTotals();
scrollToBottom();
}

function removeExpenseRow(btn) {
    var tbody=document.getElementById("expenseTbody");

    if (tbody.rows.length > 4) {
        // Оставляем 3 обязательные + 1 пустую
        var row=btn.parentElement.parentElement;
        row.parentElement.removeChild(row);
        updateRowNumbers(tbody);
        updateTotals();
    }
}

function updateRowNumbers(tbody) {
    for (var i=0; i < tbody.rows.length; i++) {
        tbody.rows[i].cells[0].innerText=i+1;
    }
}

function incomeArticleChanged(el) {
    var val=el.value.trim().toLowerCase();
    var row=el.parentElement.parentElement;
    var fromCell=row.cells[2];
    var amtInput=row.cells[3].querySelector("input");

    if (val==="банкдан") {
        google.script.run.withSuccessHandler(function(options) {
                var select=document.createElement("select");
                select.style.width="100%";
                var html='<option value="">Выберите банк</option>';

                for (var i=0; i < options.length; i++) {
                    html +='<option value="' + options[i] + '">' + options[i] + '</option>';
                }

                select.innerHTML=html;
                fromCell.innerHTML="";
                fromCell.appendChild(select);

                $(select).select2({
                    dropdownParent: $('body')
                });
            updateTotals();
        }).getBankOptions();
}

else {
    if (fromCell.querySelector("select")) {
        fromCell.innerHTML='<input type="text" placeholder="От кого">';
    }
}

if (val==="излишка" || val==="савдо сотилган овкатдан") {
    amtInput.setAttribute("readonly", "readonly");
}

else {
    amtInput.removeAttribute("readonly");
}

updateTotals();
}

function expenseArticleChanged(el) {
    var val=el.value.trim().toLowerCase();
    var row=el.parentElement.parentElement;
    var toCell=row.cells[2];
    var amtInput=row.cells[3].querySelector("input");

    if (val==="поставщики") {
        google.script.run.withSuccessHandler(function(options) {
                var select=document.createElement("select");
                select.style.width="100%";
                var html='<option value="">Выберите поставщика</option>';

                for (var i=0; i < options.length; i++) {
                    html +='<option value="' + options[i] + '">' + options[i] + '</option>';
                }

                select.innerHTML=html;
                toCell.innerHTML="";
                toCell.appendChild(select);

                $(select).select2({
                    dropdownParent: $('body')
                });
            updateTotals();
        }).getKassaSuppliers();
}

else if (val==="коммуналка") {
    google.script.run.withSuccessHandler(function(options) {
            var select=document.createElement("select");
            select.style.width="100%";
            var html='<option value="">Оплата за</option>';

            for (var i=0; i < options.length; i++) {
                html +='<option value="' + options[i] + '">' + options[i] + '</option>';
            }

            select.innerHTML=html;
            toCell.innerHTML="";
            toCell.appendChild(select);

            $(select).select2({
                dropdownParent: $('body')
            });
        updateTotals();
    }).getCommunalOptions();
}

else {
    if (toCell.querySelector("select")) {
        toCell.innerHTML='<input type="text" placeholder="Кому">';
    }
}

if (val==="недостача") {
    amtInput.setAttribute("readonly", "readonly");
}

else {
    amtInput.removeAttribute("readonly");
}

updateTotals();
}

function gatherFormData() {
    var incomeRecords=[];
    var incomeTbody=document.getElementById("incomeTbody");

    for (var i=0; i < incomeTbody.rows.length; i++) {
        var row=incomeTbody.rows[i];
        var article=row.cells[1].querySelector("input, select").value;
        var from=row.cells[2].querySelector("input, select").value;
        var amount=row.cells[3].querySelector("input").value;
        var comment=row.cells[4].querySelector("input").value;

        incomeRecords.push({
            article: article, from: from, amount: amount, comment: comment
        });
}

var expenseRecords=[];
var expenseTbody=document.getElementById("expenseTbody");

for (var j=0; j < expenseTbody.rows.length; j++) {
    var row=expenseTbody.rows[j];
    var article=row.cells[1].querySelector("input, select").value;
    var to=row.cells[2].querySelector("input, select").value;
    var amount=row.cells[3].querySelector("input").value;
    var comment=row.cells[4].querySelector("input").value;

    expenseRecords.push({
        article: article, to: to, amount: amount, comment: comment
    });
}

return {
    date: document.getElementById("dateInput").value,
        incomeRecords: incomeRecords,
        expenseRecords: expenseRecords,
        startBalance: document.getElementById("startBalance").value,
        endBalance: document.getElementById("endBalance").value
}

;
}

function saveFormData(formData, dateFormatted) {
    submitted=true;

    google.script.run.withSuccessHandler(function() {
            completeProgressBarAndReset(dateFormatted);

        }).withFailureHandler(function(err) {
            document.getElementById("progressMessage").innerText="Ошибка записи: " + err;
            document.getElementById("submitButton").disabled=false;
            clearInterval(progressInterval);
        }).processKassaData(formData);
}

function completeProgressBarAndReset(dateFormatted) {
    clearInterval(progressInterval);
    document.getElementById("progressBar").style.width="100%";
    document.getElementById("progressMessage").innerText="Данные за дату "+dateFormatted+" записаны";

    setTimeout(function() {
            document.getElementById("progressModal").style.display="none";
            resetForm();
            submitted=false;
        }

        , 2000);
}

function resetForm() {
    document.getElementById("dateInput").value="";
    populateIncomeTable(incomeOptions);
    populateExpenseTable(expenseOptions);
    updateTotals();
}

window.onload=function() {
    showStep(1);
    var dateInput=document.getElementById("dateInput");
    var today=new Date();
    var dd=String(today.getDate()).padStart(2, '0');
    var mm=String(today.getMonth()+1).padStart(2, '0');
    var yyyy=today.getFullYear();
    dateInput.setAttribute("max", yyyy+'-' +mm+'-' +dd);
    var pastDate=new Date();
    pastDate.setDate(today.getDate()-7);
    var pdd=String(pastDate.getDate()).padStart(2, '0');
    var pmm=String(pastDate.getMonth()+1).padStart(2, '0');
    var pyyyy=pastDate.getFullYear();
    dateInput.setAttribute("min", pyyyy+'-' +pmm+'-' +pdd);

    google.script.run.withSuccessHandler(function(opt) {
            incomeOptions=opt;
            populateIncomeTable(opt);
        }).getIncomeOptions();

    google.script.run.withSuccessHandler(function(opt) {
            expenseOptions=opt;
            populateExpenseTable(opt);
        }).getExpenseOptions();

    $('#contentContainer').on('change blur', 'input, select', function() {
            if ($(this).val().trim() !=="") {
                $(this).css("background-color", "#e0e0e0");
            }

            else {
                $(this).css("background-color", "#fff");
            }
        });

    document.addEventListener('keydown', function(event) {
            var activeElement=document.activeElement;
            var tbody=activeElement.closest('tbody');
            if ( !tbody) return;

            if (event.key==="Enter" && !event.ctrlKey) {
                event.preventDefault();
                var row=activeElement.closest('tr');
                var inputs=Array.from(row.querySelectorAll('input, select'));
                var currentIndex=inputs.indexOf(activeElement);

                if (currentIndex===1 || currentIndex===3) {
                    // Статья или Сумма
                    if ( !activeElement.value.trim()) return;
                }

                if (currentIndex < inputs.length - 2) {
                    // Не включая кнопку удаления
                    inputs[currentIndex + 1].focus();
                }

                else if (tbody.id==="incomeTbody") {
                    addIncomeRow();
                    tbody.lastElementChild.cells[1].querySelector('select').focus();
                }

                else if (tbody.id==="expenseTbody") {
                    addExpenseRow();
                    tbody.lastElementChild.cells[1].querySelector('select').focus();
                }
            }

            if (event.ctrlKey && event.key==="Enter") {
                event.preventDefault();
                confirmAndSave();
            }

            if (event.ctrlKey && (event.key==="<" || event.key==="," || event.key==="б")) {
                event.preventDefault();

                if (tbody.rows.length > 4) {
                    tbody.deleteRow(tbody.rows.length - 1);
                    updateRowNumbers(tbody);
                    updateTotals();
                }
            }

            if (event.ctrlKey && (event.key===">" || event.key==="." || event.key==="ю")) {
                event.preventDefault();
                if (tbody.id==="incomeTbody") addIncomeRow();
                else if (tbody.id==="expenseTbody") addExpenseRow();
            }
        });
}

</script></head><body><div id="progressModal"><div class="modal-content"><div id="progressMessage"></div><div id="progressBarContainer"><div id="progressBar"></div></div></div></div><div class="fixed-header"><div class="header-balances"><div><label>MAHALLA 90 СНН:</label><input type="text" id="startBalance" style="border-radius:6px;" readonly /></div><div><label>СНК:</label><input type="text" id="endBalance" style="border-radius:6px;" readonly /></div><div class="date-selection"><label>Дата:</label><input type="date" id="dateInput" style="border-radius: 6px; width: 150px;" /></div></div><div class="stepper-container"><ol class="stepper"><li class="active" onclick="showStep(1)"><span>1</span>Приход</li><li onclick="showStep(2)"><span>2</span>Расход</li><li onclick="confirmAndSave()"><span>3</span>Записать</li></ol></div></div><div id="contentContainer"><div id="step1" class="step active"><div class="tableContainer"><table><tbody id="incomeTbody"></tbody></table><div style="display:flex; justify-content:right;margin-right: 25px;"><button onclick="addIncomeRow()" class="squareBtn" style="background-color:#2563eb; color:white">+</button></div><div class="totals">Итого приход: <span id="incomeSum">0,
00</span></div></div></div><div id="step2" class="step"><div class="tableContainer"><table><tbody id="expenseTbody"></tbody></table><div style="display:flex; justify-content:right;margin-right: 25px;"><button onclick="addExpenseRow()" class="squareBtn" style="background-color:#2563eb; color:white">+</button></div><div class="totals">Итого расход: <span id="expenseSum">0,
00</span></div></div></div></div><button id="scrollToTopBtn" onclick="scrollToTop()">↑</button></body></html>