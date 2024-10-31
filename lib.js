function createFuncBlock(funcNumber) {
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


function createConstTable(headers, names, idPrefixes) {
    // Создаем таблицу
    let table = document.createElement("table");
    table.classList.add("var-table");

    // Создаем заголовок таблицы
    let headerRow = document.createElement("tr");

    for (let i = 0; i < headers.length; i++){
        let nameHeader = document.createElement("th");
        nameHeader.innerText = headers[i];
        headerRow.appendChild(nameHeader);
    }

    // Добавляем строку заголовков в таблицу
    table.appendChild(headerRow);

    // Создаем строки для каждой переменной
    for (let i = 0; i < names.length; i++) {
        let row = document.createElement("tr");

        // Ячейка для имени переменной
        let nameCell = document.createElement("td");
        nameCell.innerText = names[i];
        row.appendChild(nameCell);

        for (let j = 0; j < idPrefixes.length; j++){
            let valueCell = document.createElement("td");
            let input = document.createElement("input");
            input.id = `${idPrefixes[j]}_${i}`;
            input.type = "number";
            input.classList.add("value-input");
            valueCell.appendChild(input);
            row.appendChild(valueCell);
        }

        // Добавляем строку в таблицу
        table.appendChild(row);
    }

    // Возвращаем таблицу
    return table;
}

function createControlBlock(formSubmitPath, map, funcNumber) {
    // Создаем блок управления
    let controlBlock = document.createElement("div");
    controlBlock.classList.add("control-block"); // Добавляем класс для стилизации

    // Создаем кнопку
    let calculateButton = document.createElement("button");
    calculateButton.innerText = "Расчитать";
    calculateButton.classList.add("post-button");

    calculateButton.onclick = function () {
        calculateButton.disabled = true;
        let values = collectValues(map, funcNumber);
        console.log(values);
        let data = JSON.stringify(Object.fromEntries(values));
        console.log(data);

        postData(formSubmitPath, data, function () {
            calculateButton.disabled = false;
        });
    };

    // Добавляем кнопку в блок управления
    controlBlock.appendChild(calculateButton);

    let saveButton = document.createElement("button");
    saveButton.innerText = "Сохранить";
    saveButton.classList.add("post-button");

    saveButton.onclick = function () {
        saveJSONToFile(map, funcNumber)
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



function postData(path, data, callback) {
    fetch(new Request(path, {
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
    return [...document.querySelectorAll('input[type="number"]')].sort();
}

function collectValues(shitMap, funcNumber) {
    let inputs = collectInputs();
    let funcs = new Array(funcNumber);
    for (let i = 0; i < funcNumber; i++) {
        funcs[i] = new Array(4)
    }

    var result = new Map()
    for (let [key, value] of shitMap) {
        console.log(key, ":", value)
        result.set(value, new Array())
    }

    inputs.forEach(input => {
        let splt = input.id.split('_');
        if (splt[0] == "f") {
            funcs[Number(splt[1])][Number(splt[2])] = Number(input.value)
            return
        }

        result.get(shitMap.get(splt[0])).push(input.value)
    });

    result.set('coef', funcs)
    return result;
}

function saveJSONToFile(map, funcNumber) {
    // Преобразуем объект в JSON строку
    const jsonData = JSON.stringify(collectValues(map, funcNumber), null, 2);

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
