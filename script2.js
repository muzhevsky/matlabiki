window.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById("main")
    let saveToJsonButton = document.getElementById("saveJsonButton")
    let loadToJsonButton = document.getElementById("loadJsonButton")
    let postDataButton = document.getElementById("postDataButton")
    let fillRandomButton = document.getElementById("fillRandomButton")
    let varBlock = createVarBlock();
    let funcBlock = createFuncBlock();
    let eFuncBlock = createEFuncBlock();

    let jsonData = localStorage.getItem("jsonData2")
    if (jsonData) {
        data = convertJsonToData(jsonData)
        varBlock.setData(data)
        funcBlock.setData(data)
        eFuncBlock.setData(data)
    }

    container.append(varBlock.block, funcBlock.block, eFuncBlock.block)

    saveToJsonButton.onclick = () => {
        saveJSONToFile(convertDataToJson(varBlock, funcBlock, eFuncBlock))
    }

    loadToJsonButton.onclick = () => {
        loadJSONFromFile()
            .then((result) => {
                let data = convertJsonToData(result)
                varBlock.setData(data)
                funcBlock.setData(data)
                eFuncBlock.setData(data)
            })
            .catch((e) => console.log(e))
    }

    postDataButton.onclick = () => {
        postDataButton.disabled = true
        let body = convertDataToJson(varBlock, funcBlock, eFuncBlock)
        localStorage.setItem("jsonData2", body)
        postData("http://194.147.149.181:9090/calcAndDraw_car", body,
            () => {
                document.querySelectorAll('#imageGallery .plot').forEach(img => {
                    img.src += '?t=' + new Date().getTime();
                });
            },
            () => { },
            () => postDataButton.disabled = false)
    }

    fillRandomButton.onclick = () => {
        varBlock.fillRandom(0.5)
        funcBlock.fillRandom(0.5)
        eFuncBlock.fillRandom(0.5)
    }
});

function createVarBlock() {
    let varNames = [
        "Общее количество ДТП в РФ (в год)",
        "Количество погибших в ДТП",
        "Количество раненых в ДТП",
        "Тяжесть последствий ДТП (кол-во погибших на 100 пострадавших)",
        "Количество погибших на 10 000 транспортных средств",
        "Количество пострадавших на 100000 жителей",
        "Количество ДТП из-за нарушения ПДД водителями",
        "Количество ДТП по вине нетрезвых водителей",
        "Количество ДТП по вине пешеходов",
        "Количество ДТП с участием детей",
        "Количество ДТП по вине технически неисправных транспортных средств",
        "Количество ДТП из-за неудовлетворительного состояния улиц и дорог",
        "Количество ДТП с тяжкими последствиями"
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

    return NewBlock(["Название переменной", "Начальное значение", "Предельное значение"], "var", rowNameFunc, cellNameFunc)
}

function createFuncBlock() {
    let flArray = new Array();
    flArray.push(7, 8, 9, 10, 11, 12, 4, 5, 8, 9, 11, 6, 7, 8, 9, 10, 11, 12, 13, 2, 5, 7, 8, 9, 11, 2, 4, 7, 8, 11, 3, 7, 8, 9, 10, 11, 13, 1, 8, 13, 2, 5, 10, 1, 7, 9, 11, 12, 1, 10, 11, 12, 2, 3, 1, 7, 8, 9, 13, 2, 3, 1, 8, 12, 1, 7, 8, 11, 1, 2, 3, 4, 5, 6, 7, 8);
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

function createEFuncBlock() {
    let varNames = [
        "E1(t) - Количество транспортных средств старше 10 лет",
        "E2(t) – Степень износа транспортных средств",
        "E3(t) – Количество комплексов фото-видео фиксации нарушений",
        "E4(t) – Количество выданных водительских удостоверений",
        "E5(t) – Протяженность участков дорог",
        "E6(t) – Средний штраф за нарушение ПДД",
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

        if (j == 0) { return NameWithIndex("k", i + 1) }
        if (j == 1) { return NameWithIndex("b", i + 1) }
    }

    return NewBlock(["Функция", "", ""], "efunc", rowNameFunc, cellNameFunc)
}

// todo можно вынести в либу и переиспользовать, но так лень пипец
function convertDataToJson(varBlock, funcBlock, eFuncBlock) {
    let result = {
        start: new Array(0),
        max_values: new Array(0),
        k: new Array(0),
        b: new Array(0),
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

    data = eFuncBlock.getData()
    for (let i = 0; i < data.length; i++) {
        result.k.push(data[i][0])
        result.b.push(data[i][1])
    }

    return JSON.stringify(result)
}

function convertJsonToData(jsonString) {
    let data = {
        var: new Array(),
        x: new Array(),
        efunc: new Array()
    }

    let parsedJson = JSON.parse(jsonString)
    for (let i = 0; i < parsedJson.start.length; i++) {
        data.var.push([parsedJson.start[i], parsedJson.max_values[i]])
    }

    for (let i = 0; i < parsedJson.coef.length; i++) {
        data.x.push(parsedJson.coef[i])
    }

    for (let i = 0; i < parsedJson.k.length; i++) {
        data.efunc.push([parsedJson.k[i], parsedJson.b[i]])
    }

    return data
}

