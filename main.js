var selectedExample;

window.addEventListener("load", init);

function init() {
    selectedExample = null;
    let select = document.getElementById('select-example');

    db.forEach((example, i) => {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = `Primjer ${i}`;
        select.appendChild(option);
    });
}

function loadExample(selectedValue) {
    document.getElementById('dependencies').innerHTML = "";
    selectedExample = db[selectedValue].example;
    document.getElementById('relation').value = selectedExample.R;

    selectedExample.FO.forEach((d, i) => {
        createEmptyDependancyInput(i);
        document.getElementById(`lhs-${i}`).value = d.lhs;
		document.getElementById(`rhs-${i}`).value = d.rhs;
    });

    document.getElementById('key-button').disabled = false;
}

function createEmptyDependancyInput(i)
{
    let container = document.createElement('div');
    container.classList.add('flex-row')
	container.innerHTML = `
        <input class="form-input" type="text" id="lhs-${i}">
        <div class="separator">--></div>
        <input class="form-input" type="text" id="rhs-${i}">
    `;
    document.getElementById('dependencies').appendChild(container);
}

function findCandidateKeys() {
    let allAttributes = selectedExample.R.split(' ');
    let rightSide = selectedExample.FO.map(d => d.rhs.split(' '));
    let leftSide = selectedExample.FO.map(d => d.lhs.split(' '));
    let potentionalKeys = [];
    let found = false;

    allAttributes.forEach(attr => {
        found = false;
        rightSide.forEach(r => {
            if (r.find(e => e === attr))
                found = true;
        })
        if (!found) {
            potentionalKeys.push(attr)
        }
    });

    displayCandidateKeys(potentionalKeys);
}

function minimize(attributes) {

}

function displayCandidateKeys(keys) {
    let result = document.getElementById('result');
    let container = document.createElement('ul');
    let li = document.createElement('li');

    result.innerHTML = '';
    li.innerHTML = `<span>${keys.join()}</span>`;
    container.appendChild(li)
    result.appendChild(container);
}