window.addEventListener("DOMContentLoaded", function () {
    let varBlock = document.getElementById("leftBlock");
    let controlBlock = document.getElementById("controlBlock");
    controlBlock.style.flexDirection = "column";
    varBlock = controlBlock;

    // Создаем таблицу
    let table = document.createElement("table");
    table.classList.add("input-table"); // Добавляем класс для стилизации

    // Генерация строк для mu
    for (let i = 0; i < 3; i++) {
        let id = `mu_${i}`;
        let row = document.createElement("tr");

        let labelCell = document.createElement("td");
        labelCell.innerText = `Интенсивность потока восстановления компьютера ${i + 1}`; // Название поля
        row.append(labelCell);

        let inputCell = document.createElement("td");
        let input = document.createElement("input");
        input.type = "number";
        input.id = id;
        input.classList.add("func-input");
        inputCell.append(input);
        row.append(inputCell);

        table.append(row); // Добавляем строку в таблицу
    }

    // Генерация строк для lat
    for (let i = 0; i < 3; i++) {
        let id = `lat_${i}`;
        let row = document.createElement("tr");

        let labelCell = document.createElement("td");
        labelCell.innerText = `Интенсивность потока отказа компьютера ${i + 1}`; // Название поля
        row.append(labelCell);

        let inputCell = document.createElement("td");
        let input = document.createElement("input");
        input.type = "number";
        input.id = id;
        input.classList.add("func-input");
        inputCell.append(input);
        row.append(inputCell);

        table.append(row); // Добавляем строку в таблицу
    }

    // Добавляем таблицу в блок
    varBlock.append(table);

    // Создаем кнопку
    let butt = document.createElement("button");
    butt.innerText = "Рассчитать";


    butt.onclick = function () {
        butt.disabled = true;
        let values = function () {
            let inputs = [...varBlock.querySelectorAll('input[type="number"]')].sort();
            let values = {
                mu: new Array(),
                lat: new Array()
            }

            inputs.forEach(input => {
                splt = input.id.split("_");
                if (splt[0] == "mu") {
                    values.mu.push(Number(input.value))
                } else {
                    values.lat.push(Number(input.value))
                }
            })

            return values;
        }();
        let data = JSON.stringify(values);

        postData("http://194.147.149.181:9090/calcAndDraw_pc", data, function () {
            butt.disabled = false;
        });
    };

    controlBlock.append(butt);


    fillInputsWithValues()
});

