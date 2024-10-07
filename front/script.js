window.addEventListener("DOMContentLoaded", function(){
    body = document.getElementById("body")

    outer = createWrapper('column', '20px')

    block1 = createWrapper('row', '20px')
    createFuncBlock(block1, 28, 3)
    block2 = createWrapper('row', '10px')
    createTestVarBlock(block2, 16)

    outer.append(block1)
    outer.append(block2)

    body.append(outer)

    fillInputsWithValues()
    let map = collectValues()
    console.log(map)
    const mapAsObject = Array.from(map.entries()).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
    
    // Сериализуем объект в JSON
    const jsonString = JSON.stringify(mapAsObject);
    console.log(jsonString);
}); 

function createWrapper(direction, gap){
    let outer = document.createElement("div")
    outer.style.display = 'flex';
    outer.style.flexDirection = direction;
    outer.style.flexWrap = 'wrap';
    outer.style.gap = gap;
    outer.style.justifyContent = 'space-between';
    return outer;
}

function createFuncBlock(blockToAppend, funcNumber, varsNumber){
    for (let i = 0; i < funcNumber; i++){
        let wrapper = document.createElement("div")

        let wrapperHeader = document.createElement("div")
        wrapperHeader.innerText = `F${i+1}`
        wrapper.append(wrapperHeader)

        for (let j = 0; j < varsNumber; j++){
            wrapper.append(createVarBlock(`f${i}_${j}`,`a${j+1}`))
        }
        blockToAppend.append(wrapper)
    }
}

function createVarBlock(id, name){
    let outer = document.createElement("div")

    let header = document.createElement("div")
    header.innerText = name+":"
    header.style.display = 'inline-block';
    outer.append(header)

    let input = document.createElement("input");
    input.id = id;
    input.type = 'number';
    input.style.display = 'inline-block';
    outer.append(input);

    outer.style.height = '20px';

    return outer
}

function createTestVarBlock(blockToAppend, varsNumber){
    let grid = document.createElement('div')
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
    grid.style.gap = '10px'
    grid.style.alignContent = 'space-evenly'
    grid.style.width = '100%';
    for (let i = 1; i < varsNumber+1; i++){
        let wrapper = createWrapper()
        wrapper.append(createVarBlock(`L${i}_0`,`L${i}`))
        grid.append(wrapper)
    }

    blockToAppend.append(grid);
}

function fillInputsWithValues(){
    inputs = collectInputs();
    console.log(inputs.length)
    for (let i = 0; i < inputs.length; i++){
        inputs[i].value = Math.random() * 100;
    }
}

function collectInputs() {
    return document.querySelectorAll('input[type="number"]');
}

function collectValues() {
    let inputs = collectInputs();
    let valuesMap = new Map();

    inputs.forEach(input => {
        let [a, b] = input.id.split('_');
        let existing = valuesMap.get(a);
        
        if (!existing) { 
            existing = [];
            valuesMap.set(a, existing)
        }
        
        existing[b] = input.value, 10;
    });

    return valuesMap;
}