window.addEventListener("DOMContentLoaded", function () {
    let controlBlock = document.getElementById("test")

    varBlock = createVarBlock();
    funcBlock = createFuncBlock();
    controlBlock.append(varBlock.block);
    controlBlock.append(funcBlock.block);

    // controlBlock.append(createControlBlock("http://194.147.149.181:9090/calcAndDraw", shitMap, funcNumber))
    // controlBlock.append(createControlBlock("http://localhost:9090/calcAndDraw", shitMap, funcNumber))
    fillInputsWithValues()

    this.setTimeout(() => {
        let result = {
            start: new Array(),
            max_values: new Array()
        }

        var data = varBlock.getData()
        for (let i = 0; i < data.length; i++) {
            result.start.push(data[i][0])
            result.max_values.push(data[i][1])
        }

        loadJSONFromFile()
        // saveJSONToFile(result);
    }, 5000)
});

function createVarBlock() {
    let varNames = [
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

    let rowNameFunc = function (i) {
        if (i >= varNames.length) {
            return ""
        }

        return varNames[i];
    }

    let cellNameFunc = function (i, j) {
        if (i >= varNames.length) {
            return "";
        }

        return " ";
    }

    return NewBlock(["Название переменной", "Значение", "Лимит"], ["var", "limit"], rowNameFunc, cellNameFunc)
}

function createFuncBlock() {
    let flArray = new Array();
    flArray.push(3, 1, 4, 6, 7, 6, 10, 14, 5, 2, 6, 2, 14, 2, 13, 15, 9, 13, 15, 1, 7, 14, 12, 13, 7, 8, 12, 9);
    power = 3;

    rowNameFunc = function (i) {
        if (i >= flArray.length) {
            return "";
        }
        return RowNameWithIndex("F", i + 1)
    }

    cellNameFunc = function (i, j) {
        if (i >= flArray.length) {
            return "";
        }
        return PolynomicCellName("L", flArray[i], power - j)
    }

    return NewBlock(["Функции", "", "", "", ""], ["x3", "x2", "x1", "b"], rowNameFunc, cellNameFunc)
}