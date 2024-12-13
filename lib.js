function NewBlock(headers, idPrefix, rowNamesFunc, varNamesFunc) {
    let table = document.createElement("table");
    let headerRow = document.createElement("tr");

    for (let i = 0; i < headers.length; i++) {
        let nameHeader = document.createElement("th");
        nameHeader.innerHTML = headers[i];
        headerRow.appendChild(nameHeader);
    }

    table.appendChild(headerRow);

    let rowIndex = 0;
    let rowNameSpan = rowNamesFunc(rowIndex);
    let rows = new Array()
    while (rowNameSpan !== "") {
        let row = document.createElement("tr");
        let nameCell = document.createElement("td");
        nameCell.append(rowNameSpan);
        row.appendChild(nameCell);
        rows.push(row);

        for (let columnIndex = 0; columnIndex < headers.length - 1; columnIndex++) {
            let valueCell = document.createElement("td");

            let input = document.createElement("input");
            input.id = `${idPrefix}_${rowIndex}_${columnIndex}`;
            input.type = "number";
            input.value = 0;

            let container = document.createElement("div")
            container.classList.add("cell")
            container.append(input);
            container.append(varNamesFunc(rowIndex, columnIndex))

            valueCell.append(container);
            row.appendChild(valueCell);
        }

        table.appendChild(row);

        rowIndex++;
        rowNameSpan = rowNamesFunc(rowIndex);
    }

    getData = function () {
        let inputs = [...table.querySelectorAll('input[type="number"]')];
        let data = new Array(0);
        for (let i = 0; i < table.rows.length - 1; i++) {
            data[i] = new Array(0)
        }
        for (let i = 0; i < inputs.length; i++) {
            let splt = inputs[i].id.split("_");
            idx = splt[1];
            data[idx].push(Number(inputs[i].value));
        }

        return data;
    }

    setData = function (data) {
        let inputs = [...table.querySelectorAll('input[type="number"]')];
        let inputMap = new Map();
        for (let i = 0; i < inputs.length; i++) {
            inputMap.set(inputs[i].id, inputs[i]);
        }

        let entries = Object.entries(data); // можно сделать оптимальнее, но мне пофиг
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            let key = entry[0];
            let value = entry[1];
            for (let j = 0; j < value.length; j++) {
                for (let k = 0; k < value[j].length; k++) {
                    let input = inputMap.get(`${key}_${j}_${k}`)
                    if (!input) continue;

                    input.value = value[j][k].toFixed(2)
                }
            }
        }
    }

    fillRandom = function (chance) {
        for (let i = 0; i < rows.length; i++) {
            let inputs = [...rows[i].querySelectorAll('input[type="number"]')];
            let filled = false;
            for (let j = 0; j < inputs.length; j++) {
                if (Math.random() < chance) {
                    inputs[j].value = randn_bm().toFixed(2)
                    filled = true;
                } else {
                    inputs[j].value = 0;
                }
            }

            if (!filled) {
                let randInput = Math.ceil(Math.random() * (inputs.length - 1))
                console.log(randInput)
                inputs[randInput].value = randn_bm()
            }
        }
    }

    return {
        block: table,
        getData: getData,
        setData: setData,
        fillRandom: fillRandom
    }
}

function RowNameWithIndex(name, index) {
    let result = document.createElement("div");
    result.classList.add("cell")

    let funcNameSpan = document.createElement("span");
    funcNameSpan.innerHTML = `${name}<sub>${index}</sub>`

    let equalitySpan = document.createElement("span");
    equalitySpan.innerHTML = " ="

    result.append(funcNameSpan)
    result.append(equalitySpan)

    return result
}

function PolynomicCellName(funcName, index, funcArg, power, def) {
    let result = document.createElement("span")
    if (power == 0) {
        result.innerHTML = def ? def : ""
        return result;
    }
    result.append(NameWithIndex(funcName, index))
    result.append(NameWithPower(funcArg, power))

    let plusSpan = document.createElement("span")
    plusSpan.innerText = " +"
    result.append(plusSpan)

    return result;
}

function NameWithIndex(name, index) {
    let result = document.createElement("span");
    result.innerHTML = `${name}<sub>${index}</sub>`;

    return result
}

function NameWithPower(name, power) {
    let result = document.createElement("span");

    if (power > 0) {
        result.innerHTML = `${name}`;
    }

    if (power > 1) {
        result.innerHTML += `<sup>${power}</sup>`
    }

    return result
}

function saveJSONToFile(data) {
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function loadJSONFromFile() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                reject(new Error('No file selected'));
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    resolve(reader.result);
                } catch (error) {
                    reject(new Error('Invalid JSON file'));
                }
            };
            reader.onerror = () => reject(new Error('File reading error'));
            reader.readAsText(file);
        };

        input.click();
    });
}

function postData(route, body, succsessCallback, errorCallback, callback) {
    fetch(new Request(route, {
        method: "POST",
        body: body,
        headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
        },
    })).then(response => {
        if (response.status != 200) {
        }
        succsessCallback()
    }).catch(function () {
        errorCallback()
    }).finally(function () {
        callback()
    })
}

function randn_bm() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) return randn_bm()
    return num
}