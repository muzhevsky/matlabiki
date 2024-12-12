window.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById("main")
    let saveToJsonButton = document.getElementById("saveJsonButton")
    let loadToJsonButton = document.getElementById("loadJsonButton")
    let postDataButton = document.getElementById("postDataButton")
    let fillRandomButton = document.getElementById("fillRandomButton")
    let varBlock = createVarBlock();
    let funcBlock = createFuncBlock();

    let jsonData = localStorage.getItem("jsonData1")
    if (jsonData) {
        data = convertJsonToData(jsonData)
        varBlock.setData(data)
        funcBlock.setData(data)
    }

    container.append(varBlock.block);
    container.append(funcBlock.block);

    saveToJsonButton.onclick = () => {
        saveJSONToFile(convertDataToJson(varBlock, funcBlock))
    }

    loadToJsonButton.onclick = () => {
        loadJSONFromFile()
            .then((result) => {
                let data = convertJsonToData(result)
                varBlock.setData(data)
                funcBlock.setData(data)
            })
            .catch((e) => console.log(e))
    }

    postDataButton.onclick = () => {
        postDataButton.disabled = true
        let body = convertDataToJson(varBlock, funcBlock)
        localStorage.setItem("jsonData1", body)
        postData("http://194.147.149.181:9090/calcAndDraw", body,
            () => {
                document.querySelectorAll('#imageGallery .plot').forEach(img => {
                    img.src += '?t=' + new Date().getTime();
                });
            },
            () => { },
            () => postDataButton.disabled = false)
    }

    fillRandomButton.onclick = () => {
        varBlock.fillRandom()
        funcBlock.fillRandom()
    }
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

    return NewBlock(["Название переменной", "Начальное значение", "Лимит"], "var", rowNameFunc, cellNameFunc)
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
        return PolynomicCellName("L", flArray[i], "(t)", power - j)
    }

    return NewBlock(["Функции", "", "", "", ""], "x", rowNameFunc, cellNameFunc)
}

function convertDataToJson(varBlock, funcBlock) {
    let result = {
        start: new Array(0),
        max_values: new Array(0),
        coef: new Array(0)
    }

    var data = varBlock.getData()
    for (let i = 0; i < data.length; i++) {
        result.start.push(data[i][0])
        result.max_values.push(data[i][1])
    }

    data = funcBlock.getData();
    for (let i = 0; i < data.length; i++) {
        result.coef[i] = data[i]
    }

    return JSON.stringify(result)
}

function convertJsonToData(jsonString) {
    let data = {
        var: new Array(),
        x: new Array()
    }

    let parsedJson = JSON.parse(jsonString)
    for (let i = 0; i < parsedJson.start.length; i++) {
        data.var.push([parsedJson.start[i], parsedJson.max_values[i]])
    }

    for (let i = 0; i < parsedJson.coef.length; i++) {
        data.x.push(parsedJson.coef[i])
    }

    return data
}

