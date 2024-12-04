window.addEventListener("DOMContentLoaded", function () {
    let funcBlock = document.getElementById("leftBlock")
    let varBlock = document.getElementById("rightBlock")
    let controlBlock = document.getElementById("controlBlock")
    let funcNumber = 132;
    let shitMap = new Map([["var", "start"], ["limit", "max_values"], ["q", "q"], ["b", "b"]]);
    let varNames = [
        "эффективность функционирования хранилища данных",
        "качество программного обеспечения (ПО)",
        "корректность ПО",
        "надежность программного обеспечения",
        "доступность программного обеспечения",
        "возможность интенсивного использования ПО",
        "прослеживаемость ПО",
        "функциональная полнота ПО",
        "обеспечение требуемой последовательности работ при проектировании хранилища",
        "практичность ПО",
        "устойчивость к ошибкам данных программного обеспечения",
        "эффективность выполнения транзакций",
        "степень мотивации персонала, осуществляющего эксплуатацию хранилища данных",
        "удобство тестирования ПО"
    ]

    funcBlock.append(createFuncBlock(funcNumber))
    varBlock.append(createConstTable(["название переменной", "значение", "лимит"], varNames, ["var", "limit"]))
    varBlock.append(createConstTable(["функция", "x3[i]", "x2[i]", "x[i]", "b[i]"], ["q1","q2","q3","q4","q5"], ["q_0", "q_1", "q_2", "q_3"]))
    // controlBlock.append(createControlBlock("http://194.147.149.181:9090/calcAndDraw_hdd", shitMap, funcNumber))
    controlBlock.append(createControlBlock("http://localhost:9090/calcAndDraw_hdd", shitMap, funcNumber))

    fillInputsWithValues()
});
