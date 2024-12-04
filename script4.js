window.addEventListener("DOMContentLoaded", function () {
    let varBlock = document.getElementById("leftBlock")
    varBlock.style.flexDirection = "column";
    let controlBlock = document.getElementById("controlBlock")

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

    let shitMap = new Map([["lat", "lat"], ["mu", "mu"]]);
    controlBlock.append(createControlBlock("http://194.147.149.181:9090/calcAndDraw_pc", shitMap, funcNumber))
    // controlBlock.append(createControlBlock("http://localhost:9090/calcAndDraw_pc", shitMap, 0))

    fillInputsWithValues()
});

