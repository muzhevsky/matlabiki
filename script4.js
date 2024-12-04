window.addEventListener("DOMContentLoaded", function () {
    let varBlock = document.getElementById("leftBlock")
    varBlock.style.flexDirection = "column";
    let controlBlock = document.getElementById("controlBlock");

    for (let i = 0; i < 3; i++) {
        let id = `mu_${i}`;
        let innerBlock = document.createElement("div");

        let span = document.createElement("span");
        span.innerText = id
        innerBlock.append(span);

        let input = document.createElement("input");
        input.type = "number";
        input.id = id;
        input.classList.add("func-input");
        innerBlock.append(input);

        varBlock.append(innerBlock)
    }

    for (let i = 0; i < 3; i++) {
        let id = `lat_${i}`;
        let innerBlock = document.createElement("div");

        let span = document.createElement("span");
        span.innerText = id;
        innerBlock.append(span);

        let input = document.createElement("input");
        input.type = "number";
        input.id = id;
        input.classList.add("func-input");
        innerBlock.append(input);

        varBlock.append(innerBlock)
    }

    butt = document.createElement("button")
    butt.innerText = "Рассчитать"

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
        console.log(values);
        let data = JSON.stringify(values);
        console.log(data);

        postData(formSubmitPath, data, function () {
            butt.disabled = false;
        });
    };

    controlBlock.append(butt);


    fillInputsWithValues()
});

