window.addEventListener("DOMContentLoaded", function () {
    funcNumber = 28;
    const shitMap = new Map([["var", "max"], ["limit", "limits"]])
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

    funcBlock.append(createFuncBlock(funcNumber))
    varBlock.append(createConstTable(["название переменной", "значение", "лимит"], varNames, ["var_", "limit_"]))
    varBlock.append(createControlBlock("http://http://194.147.149.181:8081/calcAndDraw", shitMap, funcNumber))

    fillInputsWithValues()
});


