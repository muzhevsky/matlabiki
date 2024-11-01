window.addEventListener("DOMContentLoaded", function () {
    let funcNumber = 28;
    let shitMap = new Map([["var", "start"], ["limit", "max_values"]])
    let funcBlock = document.getElementById("leftBlock")
    let varBlock = document.getElementById("rightBlock")
    let controlBlock = document.getElementById("controlBlock")
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

    funcBlock.append(createFuncBlock(funcNumber))
    varBlock.append(createConstTable(["название переменной", "значение", "лимит"], varNames, ["var", "limit"]))
    controlBlock.append(createControlBlock("http://194.147.149.181:9090/calcAndDraw", shitMap, funcNumber))

    fillInputsWithValues()
});


