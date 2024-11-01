window.addEventListener("DOMContentLoaded", function () {
    let funcBlock = document.getElementById("leftBlock")
    let varBlock = document.getElementById("rightBlock")
    let controlBlock = document.getElementById("controlBlock")
    let funcNumber = 76;
    let shitMap = new Map([["var", "start"], ["limit", "max_values"], ["k", "k"], ["b", "b"]]);
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

    funcBlock.append(createFuncBlock(funcNumber))
    varBlock.append(createConstTable(["название переменной", "значение", "лимит"], varNames, ["var", "limit"]))
    varBlock.append(createConstTable(["функция", "k[i]", "b[i]"], ["E1","E2","E3","E4","E5","E6"], ["k", "b"]))
    controlBlock.append(createControlBlock("http://194.147.149.181:9090/calcAndDraw_car", shitMap, funcNumber))

    fillInputsWithValues()
});
