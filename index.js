let form = document.querySelector(".form");
let output = document.querySelector(".output");
let copy = document.querySelector(".copy");
let adder = document.querySelector(".adder");
let message = document.querySelector(".message");
let reset = document.querySelector(".reset");

let component = document.querySelector("[name='component']");
let schemaId = document.querySelector("[name='schema_id']");
let schemaLabel = document.querySelector("[name='schema_label']");

let preceding_comman = document.querySelector("[name='preceding_comman']");
let trailing_comman = document.querySelector("[name='trailing_comman']");

let content = document.querySelector("[name='content']");
let schemaDefault = document.querySelector("[name='default']");
let maximum = document.querySelector("[name='max']");
let minimum = document.querySelector("[name='min']");
let step = document.querySelector("[name='step']");
let unit = document.querySelector("[name='unit']");
let limit = document.querySelector("[name='limit']");
let info = document.querySelector("[name='info']");
let option_container = document.querySelector(".option_container");

let allField = [component, schemaId, schemaLabel, content, schemaDefault, maximum, minimum, step, unit, info ,preceding_comman, trailing_comman];
let subFields = [content, schemaDefault, maximum, minimum, step, unit, limit, info, option_container];

allField.forEach(input=>{
    input.addEventListener("change", ()=>{
        builder();
    })
})

function updateField() {

    if (component.value == "header" || component.value == "paragraph") {
        subFields.forEach(item=>item.parentElement.classList.add("hidden"));
        [content, info].map(item=>item.parentElement.classList.remove("hidden"));
    } else if (component.value == "range") {
        subFields.forEach(item=>item.parentElement.classList.remove("hidden"));
        [content, limit, option_container].forEach(item=>item.parentElement.classList.add("hidden"));
    } else if (component.value == "radio" || component.value == "select") {
        subFields.forEach(item=>item.parentElement.classList.add("hidden"));
        [schemaDefault, info, option_container].map(item=>item.parentElement.classList.remove("hidden"));
    } else if (component.value == "product") {
        subFields.forEach(item=>item.parentElement.classList.add("hidden"));
        [info].map(item=>item.parentElement.classList.remove("hidden"));
    } else if (component.value == "product_list") {
        subFields.forEach(item=>item.parentElement.classList.add("hidden"));
        [limit, info].map(item=>item.parentElement.classList.remove("hidden"));
    } else if (component.value == "video") {
        subFields.forEach(item=>item.parentElement.classList.add("hidden"));
        [info].map(item=>item.parentElement.classList.remove("hidden"));
    } else {
        subFields.forEach(item=>item.parentElement.classList.add("hidden"));
        [schemaDefault, info].map(item=>item.parentElement.classList.remove("hidden"));
    }
}
function write(value) {
    output.innerHTML = value;
}
function builder() {
    if (component.value == "null") {
        subFields.forEach(field=>field.parentElement.classList.add("hidden"));
        output.innerHTML = "Your output will be here!";
        ["!bg-gray-500", "!cursor-not-allowed", "!text-white"].forEach(item=>copy.classList.add(item))
        return;
    } else {
        ["!bg-gray-500", "!cursor-not-allowed", "!text-white"].forEach(item=>copy.classList.remove(item))
    }

    updateField()

    let outputText = 
`<pre>`
    if (preceding_comman.checked) {
        outputText += `,`;
    }
    outputText += `
{
    "type": "${component.value}",`;

    if (component.value == "header" || component.value == "paragraph") {
        outputText += `
    "content": "${content.value}"`;
    } else {
        outputText += `
    "id": "${schemaId.value?schemaId.value.replace(/ /g, "_"):schemaLabel.value.replace(/ /g, "_")}",
    "label": "${schemaLabel.value}"`;

        if (schemaDefault.value) {
            if (component.value == "richtext") {
                outputText += `,
    "default": "&lt;p&gt;${schemaDefault.value}&lt;/p&gt;"`;
            } else if (component.value == "checkbox") {
                outputText += `,
    "default": ${schemaDefault.value == "true"?true:false}`;
            } else if (component.value == "link_list") {
                outputText += `,
    "default": "${schemaDefault.value == "main-menu"?"main-menu":schemaDefault.value == "footer"?"footer":""}"`;
            } else if (component.value != "range") {
                outputText += `,
    "default": "${schemaDefault.value}"`;
            }
        }
    }

    if (component.value == "range") {
        outputText += `,
    "max": ${maximum.value?parseFloat(maximum.value.replace(/[^0-9.]/g, '')):100},
    "min": ${minimum.value?parseFloat(minimum.value.replace(/[^0-9.]/g, '')):0},
    "step": ${step.value?parseFloat(step.value.replace(/[^0-9.]/g, '')):10},
    "default": ${schemaDefault.value?parseFloat(schemaDefault.value.replace(/[^0-9.]/g, '')):40}`;

        if (unit.value) {
            outputText += `,
    "unit": "${unit.value}"`;
        }
    }

    if (component.value == "select" || component.value == "radio") {
        outputText += `,
    "options": [`;
        option_container.querySelectorAll(".option_unit").forEach(item=>{
            outputText += `
        {"label": "${item.querySelector("[name='optionLabel']").value}", "value": "${item.querySelector("[name='optionValue']").value}"},`;
        })
        outputText = outputText.slice(0, -1);
        outputText += `
    ]`;
    }
    
    if (component.value == "product_list") {
        outputText += `,
    "limit": ${8}`;
    }
    
    if (component.value == "video_url") {
        outputText += `,
    "accept": ["youtube", "vimeo"]`;
    }
    
    if (info.value) {
        outputText += `,
    "info": "${info.value}"`;
    }

    outputText += `
}`
    if (trailing_comman.checked) {
        outputText += `,`;
    }
`</pre>`;
    write(outputText)
}

adder.addEventListener("click", ()=>{
    addField();
})

function addField() {
    let newField = document.createElement("div");
    ["flex", "gap-2", "mt-2", "option_unit"].forEach(item=>newField.classList.add(item));

    let newLabelContainer = document.createElement("div");
    ["flex", "gap-2", "flex-1"].forEach(item=>newLabelContainer.classList.add(item));
    let newLabelName = document.createElement("p");
    newLabelName.innerHTML = "Label -";
    ["whitespace-nowrap", "text-xs"].forEach(item=>newLabelName.classList.add(item));
    let newLabelField = document.createElement("input");
    newLabelField.name = "optionLabel";
    ["border", "border-black", "rounded", "px-2", "py-px", "w-20", "text-xs"].forEach(item=>newLabelField.classList.add(item));
    newLabelField.onchange = ()=>builder();
    [newLabelName, newLabelField].forEach(item=>newLabelContainer.appendChild(item));
    
    let newVlaueContainer = document.createElement("div");
    ["flex", "gap-2", "flex-1"].forEach(item=>newVlaueContainer.classList.add(item));
    let newValueName = document.createElement("p");
    newValueName.innerHTML = "Value -";
    ["whitespace-nowrap", "text-xs"].forEach(item=>newValueName.classList.add(item));
    let newValueField = document.createElement("input");
    newValueField.name = "optionValue";
    ["border", "border-black", "rounded", "px-2", "py-px", "w-20", "text-xs"].forEach(item=>newValueField.classList.add(item));
    newValueField.onchange = ()=>builder();
    [newValueName, newValueField].forEach(item=>newVlaueContainer.appendChild(item));

    [newLabelContainer, newVlaueContainer].forEach(item=>newField.appendChild(item))
 
    option_container.appendChild(newField)
}
addField();

copy.addEventListener("click", ()=>{
    if (component.value != "null") {
        let newTextarea = document.createElement("textarea");
        ["hidden"].forEach(item=>newTextarea.classList.add(item));
        newTextarea.value = output.children[0].innerHTML;
        document.body.appendChild(newTextarea);
        newTextarea.select();
        navigator.clipboard.writeText(newTextarea.value);
        newTextarea.remove();

        message.classList.remove("hidden");
        setTimeout(()=>message.classList.add("hidden"), 1500)
    }
})

reset.addEventListener("click", () => {
    allField.forEach(field=>{
        field.value = null;
        output.innerHTML = "Your output will be here!";
        subFields.forEach(elem=>elem.parentElement.classList.add("hidden"));
        [preceding_comman, trailing_comman].forEach(elem=>elem.checked = false);
    })
})