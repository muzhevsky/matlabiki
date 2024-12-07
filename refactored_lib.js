function NewBlock(headers, idPrefixes, rowNamesFunc, varNamesFunc) {
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
    while (rowNameSpan !== "") {
        let row = document.createElement("tr");
        let nameCell = document.createElement("td");
        nameCell.append(rowNameSpan);
        row.appendChild(nameCell);

        for (let columnIndex = 0; columnIndex < idPrefixes.length; columnIndex++) {
            let valueCell = document.createElement("td");

            let input = document.createElement("input");
            input.id = `${idPrefixes[columnIndex]}_${rowIndex}`;
            input.type = "number";

            let container = document.createElement("div")
            container.style.display = "inline-flex";
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
        let inputs = [...table.querySelectorAll('input[type="number"]')].sort();
        let data = new Array();
        for (let i = 0; i < table.rows.length; i++) {
            data[i] = new Array()
        }
        for (let i = 0; i < inputs.length; i++) {
            let splt = inputs[i].id.split("_");
            idx = splt[1];
            data[idx].push(Number(inputs[i].value));
        }

        return data;
    }

    return {
        block: table,
        getData: getData
    }
}

function RowNameWithIndex(name, index) {
    let result = document.createElement("span");
    result.innerHTML = `${name}<sub>${index}</sub>`
    return result
}

function PolynomicCellName(name, index, power) {
    let result;

    if (power > 0) {
        result = document.createElement("span");
        result.innerHTML = `${name}<sub>${index}</sub>(t)`;
    }

    if (power > 1) {
        result.innerHTML += `<sup>${power}</sup>`
    }

    if (!result) {
        return " "
    }
    return result;
}

function saveJSONToFile(data) {
    let json = JSON.stringify(data)
    const blob = new Blob([json], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function loadFromJsonHelp(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function (e) {
        let obj = e.target.result;
    };

    reader.readAsText(file);
}

function loadJSONFromFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = loadFromJsonHelp;
    fileInput.style.width = 0;
    document.body.appendChild(fileInput);
    fileInput.click();

    return
};
