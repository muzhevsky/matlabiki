window.addEventListener("DOMContentLoaded", function(){
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
    
    funcBlock.append(createFuncBlock(28))
    varBlock.append(createVarBlock(varNames))
    varBlock.append(createControlBlock())

    // fillInputsWithValues()

}); 


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
    let button = document.createElement("button");
    button.innerText = "Расчитать";
    button.classList.add("post-button");

    button.onclick = function () {
        button.disabled = true;
        let values = collectValues(28, 15);
        let data = JSON.stringify(values);
        console.log(data);

        postData(data, function () {
            button.disabled = false;
        });
    };

    // Добавляем кнопку в блок управления
    controlBlock.appendChild(button);
    return controlBlock; // Возвращаем блок с кнопкой
}



function postData(data, callback){
    fetch(new Request("http://localhost:9090/calcAndDraw", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
        },
    })).then(function(){
        // todo получить картинки
    }).catch(function(){

    }).finally(function(){
        callback()
    })
}

function fillInputsWithValues(){
    inputs = collectInputs();
    console.log(inputs.length)
    for (let i = 0; i < inputs.length; i++){
        inputs[i].value = 0;
    }
}

function collectInputs() {
    return document.querySelectorAll('input[type="number"]');
}

function collectValues(funcsNumber, varsNumber) {
    let inputs = collectInputs();
    let funcs = new Array(funcsNumber);
    for (let i = 0; i < funcsNumber; i++){
        funcs[i] = new Array(4)
    }

    let vars = new Array(varsNumber)
    let limits = new Array(varsNumber)

    inputs.forEach(input => {
        let splt = input.id.split('_');
        switch(splt[0]){
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