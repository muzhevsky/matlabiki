const funcNumber = 28;
const varNumber = 15;
window.addEventListener("DOMContentLoaded", function () {
    funcBlock = document.getElementById("leftBlock")
    varBlock = document.getElementById("rightBlock")
    varNames = [
        "Летальность",
        "Численность инфицированных",
        "Численность населения региона",
        "Численность госпитализированных",
        "Изолированность",
        "Скорость распространения",
        "Доступность лекарства",
        "Тяжесть симптомов",
        "Количество умерших от заболевания",
        "Уровень медицины",
        "Длительность инкубационного периода",
        "Длительность периода полного развития болезни",
        "Длительность реабилитационного периода",
        "Устойчивость вируса к лекарствам",
        "Степень осложнений заболевания"
    ]

    funcBlock.append(createFuncBlock())
    varBlock.append(createVarBlock(varNames))
    varBlock.append(createControlBlock())

    fillInputsWithValues()

});


function createFuncBlock() {
    let block = document.createElement("div");

    let header = document.createElement("h2");
    header.innerText = "Функции";
    header.classList.add("func-header");
    block.appendChild(header);

    for (let i = 0; i < funcNumber; i++) {
        let funcBlock = document.createElement("div");
        funcBlock.classList.add("func-block");

        let nameSpan = document.createElement("span");
        nameSpan.innerText = `F${i + 1} = `;
        funcBlock.append(nameSpan);

        let vars = ["x³ + ", "x² + ", "x + ", ""];
        for (let j = 0; j < vars.length; j++) {
            let input = document.createElement("input");
            input.type = "number";
            input.id = `f_${i}_${j}`; // Устанавливаем уникальный id для каждого поля
            input.classList.add("func-input"); // Добавляем класс для поля ввода
            funcBlock.append(input);

            let span = document.createElement("span");
            span.innerText = vars[j];
            funcBlock.append(span);
        }

        block.append(funcBlock);
    }

    return block;
}


function createVarBlock(names) {
    // Создаем таблицу
    let table = document.createElement("table");
    table.classList.add("var-table");

    // Создаем заголовок таблицы
    let headerRow = document.createElement("tr");

    let nameHeader = document.createElement("th");
    nameHeader.innerText = "Имя переменной";
    headerRow.appendChild(nameHeader);

    let valueHeader = document.createElement("th");
    valueHeader.innerText = "Значение";
    headerRow.appendChild(valueHeader);

    let limitHeader = document.createElement("th");
    limitHeader.innerText = "Лимит";
    headerRow.appendChild(limitHeader);

    // Добавляем строку заголовков в таблицу
    table.appendChild(headerRow);

    // Создаем строки для каждой переменной
    for (let i = 0; i < names.length; i++) {
        let row = document.createElement("tr");

        // Ячейка для имени переменной
        let nameCell = document.createElement("td");
        nameCell.innerText = names[i];
        row.appendChild(nameCell);

        // Ячейка для ввода значения
        let valueCell = document.createElement("td");
        let input = document.createElement("input");
        input.id = `var_${i}`;
        input.type = "number";
        input.classList.add("value-input");
        valueCell.appendChild(input);
        row.appendChild(valueCell);

        // Ячейка для ввода лимита
        let limitCell = document.createElement("td");
        let limitInput = document.createElement("input");
        limitInput.id = `limit_${i}`;
        limitInput.type = "number";
        limitInput.classList.add("value-input");
        limitCell.appendChild(limitInput);
        row.appendChild(limitCell);

        // Добавляем строку в таблицу
        table.appendChild(row);
    }

    // Возвращаем таблицу
    return table;
}

function createControlBlock() {
    // Создаем блок управления
    let controlBlock = document.createElement("div");
    controlBlock.classList.add("control-block"); // Добавляем класс для стилизации

    // Создаем кнопку
    let calculateButton = document.createElement("button");
    calculateButton.innerText = "Расчитать";
    calculateButton.classList.add("post-button");

    calculateButton.onclick = function () {
        calculateButton.disabled = true;
        let values = collectValues();
        let data = JSON.stringify(values);
        console.log(data);

        postData(data, function () {
            calculateButton.disabled = false;
        });
    };

    // Добавляем кнопку в блок управления
    controlBlock.appendChild(calculateButton);

    let saveButton = document.createElement("button");
    saveButton.innerText = "Сохранить";
    saveButton.classList.add("post-button");

    saveButton.onclick = function () {
        saveJSONToFile()
    };
    controlBlock.appendChild(saveButton);

    // Добавляем кнопку в блок управления
    controlBlock.appendChild(calculateButton);

    let loadButton = document.createElement("button");
    loadButton.innerText = "Загрузить";
    loadButton.classList.add("post-button");

    loadButton.onclick = function () {
        loadJSONFromFile()
    };
    controlBlock.appendChild(loadButton);
    return controlBlock; // Возвращаем блок с кнопкой
}



function postData(data, callback) {
    fetch(new Request("http://194.147.149.181/:9090/calcAndDraw", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
        },
    })).then(response => {
        if (response.status != 200){
            return
        }
        document.querySelectorAll('#imageGallery .plot').forEach((img, index) => {
            console.log(img.src)
            img.src += '?t=' + new Date().getTime();
            console.log(img.src)
        });
    }).catch(function () {

    }).finally(function () {
        callback()
    })
}

function fillInputsWithValues() {
    inputs = collectInputs();
    console.log(inputs.length)
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = 0;
    }
}

function collectInputs() {
    return document.querySelectorAll('input[type="number"]');
}

function collectValues() {
    let inputs = collectInputs();
    let funcs = new Array(funcNumber);
    for (let i = 0; i < funcNumber; i++) {
        funcs[i] = new Array(4)
    }

    let vars = new Array(varNumber)
    let limits = new Array(varNumber)

    inputs.forEach(input => {
        let splt = input.id.split('_');
        switch (splt[0]) {
            case "f":
                funcs[Number(splt[1])][Number(splt[2])] = Number(input.value)
                break
            case "var":
                vars[Number(splt[1])] = Number(input.value)
                break
            case "limit":
                limits[Number(splt[1])] = Number(input.value)
                break
        }
    });

    return {
        coef: funcs,
        start: vars,
        max_values: limits
    };
}

function saveJSONToFile() {
            // Преобразуем объект в JSON строку
            const jsonData = JSON.stringify(collectValues(), null, 2);

            // Создаем Blob и ссылку для скачивания
            const blob = new Blob([jsonData], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            // Создаем временную ссылку и инициируем скачивание
            const a = document.createElement("a");
            a.href = url;
            a.download = "data.json"; // Название файла
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
}


function loadFromJsonHelp(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const jsonData = JSON.parse(e.target.result);

        let inputs = collectInputs();
    
        inputs.forEach(input => {
            let splt = input.id.split('_');
            switch (splt[0]) {
                case "f":
                    input.value = jsonData.coef[Number(splt[1])][Number(splt[2])]
                    break
                case "var":
                    input.value = jsonData.start[Number(splt[1])]
                    break
                case "limit":
                    input.value = jsonData.max_values[Number(splt[1])]
                    break
            }
        });

        
        event.target.remove();
    };

    reader.readAsText(file);
}

function loadJSONFromFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = loadFromJsonHelp;
    fileInput.style.width = 0;
    document.body.appendChild(fileInput); 
    fileInput.click();
};
