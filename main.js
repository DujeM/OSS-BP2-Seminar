var selectedExample;
let relationsClosures = [];
let cancidateKeys = [];
let primeAttributes = [];
let nonPrimeAttributes = [];
let minimalCandidateKey = [];
let minimalComposedCandidateKey = [];
let minimalDependencies = [];
let minimalCoverSet = [];
let derivedFds = [];

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
    if (selectedValue === "-1") {
        document.getElementById('dependencies').innerHTML = "";
        document.getElementById('relation').value = "";
        return;
    }

    document.getElementById('dependencies').innerHTML = "";
    selectedExample = db[selectedValue];
    document.getElementById('relation').value = selectedExample.relation;

    selectedExample.dependencies.forEach((d, i) => {
        createEmptyDependancyInput(i);
        document.getElementById(`lhs-${i}`).value = d.lhs;
		document.getElementById(`rhs-${i}`).value = d.rhs;
    });

    document.getElementById('key-button').disabled = false;
}

function createEmptyDependancyInput(i) {
    let container = document.createElement('div');
    container.classList.add('flex-row')
	container.innerHTML = `
        <input class="form-input" type="text" id="lhs-${i}">
        <div class="separator">--></div>
        <input class="form-input" type="text" id="rhs-${i}">
    `;
    document.getElementById('dependencies').appendChild(container);
}

function addEmptyDependency() {
    const leftSide = Array.from(document.querySelectorAll('[id^="lhs-"]'));
    const rightSide = Array.from(document.querySelectorAll('[id^="rhs-"]'));

    if (!leftSide.length || !rightSide.length) {
        return createEmptyDependancyInput(0);
    }

    if (leftSide[leftSide.length - 1].value === '' || rightSide[rightSide.length - 1].value === '') {
        return;
    }

    createEmptyDependancyInput(leftSide.length);
}

function getAllSubsets(arr) {
    const subsets = [[]];
    
    for (const el of arr) {
        const last = subsets.length-1;
        for (let i = 0; i <= last; i++) {
            subsets.push( [...subsets[i], el] );
        }
    }
    return subsets.slice(1);
}

function findClosure(attribute, leftSide, rightSide) {
    let startingClosure = [...attribute];
    let currentClosure = attribute;

    for (let i = 0; i < leftSide.length; i++) {
        const lhs = leftSide[i];
        if (lhs.every(val => startingClosure.includes(val))) {
            if (rightSide[i]) {
                currentClosure = Array.from(new Set([...currentClosure, ...rightSide[i] ]));
            }
        }
    }
    return currentClosure;
}

function findPrimaryKeys() {
    let allAttributes = document.getElementById('relation').value.split(',');
    let leftSide = Array.from(document.querySelectorAll('[id^="lhs-"]')).map(element => [...element.value.split(',')]);
    let rightSide = Array.from(document.querySelectorAll('[id^="rhs-"]')).map(element => [...element.value.split(',')]);
    let allSubsets = getAllSubsets(allAttributes);

    allSubsets.forEach(attr => {
        const closure = findClosure(attr, leftSide, rightSide);
        
        if (allAttributes.every(c => closure.includes(c))) {

            if (attr.length === 1) {
                minimalComposedCandidateKey = [];
                minimalCandidateKey = [...attr];
            }

            if (!minimalCandidateKey.length && (minimalComposedCandidateKey.length > attr.length || !minimalComposedCandidateKey.length)) {
                minimalComposedCandidateKey = [...attr]
            }

            cancidateKeys.push(attr);
        }
        relationsClosures.push({ lhs: attr, rhs: closure });
    });

    console.log("Relation closures -> ", relationsClosures);
    console.log("CANDIDATE KEYS: -> ", cancidateKeys);
    console.log("Minimal candidate key -> ", minimalCandidateKey)
    console.log("Minimal composed candidate key -> ", minimalComposedCandidateKey)

    primeAttributes = minimalCandidateKey.length ? minimalCandidateKey : minimalComposedCandidateKey;
    nonPrimeAttributes = allAttributes.filter(attr => !primeAttributes.includes(attr));

    console.log("Prime attributes -> ", primeAttributes);
    console.log("Non-Prime attributes -> ", nonPrimeAttributes);

    minimalCoverSet = findMinimalCoverSet(leftSide, rightSide);
    minimalDependencies = findMinimalDependencies(minimalCoverSet);
    derivedFds = calculateDerivedFds(relationsClosures);
}

function findMinimalCoverSet(leftSide, rightSide) {
    let fdMin = [];

    for (let i = 0; i < rightSide.length; i++) {
        const rhs = rightSide[i];

        if (rhs.length > 1) {
            rhs.forEach(e => {
                fdMin.push({ lhs: leftSide[i], rhs: [e]});
            });
            continue;
        }

        fdMin.push({ lhs: leftSide[i], rhs: rhs});
    }
    
    return fdMin;
}

function findMinimalDependencies(minCover) {
    const minimalDependencies = [];
    const minLhs = minCover.map(md => md.lhs);
    const minRhs = minCover.map(md => md.rhs);

    minCover.forEach((minD, i) => {
        const tempRhs = [...minRhs];
        tempRhs.splice(i, 1);
        const closure = findClosure(minD.lhs, minLhs, tempRhs)
        
        if (!closure.includes(minRhs[i][0])) {
            console.log("Necessary fd -> ", minD);
            minimalDependencies.push(minD);
        }
    });

    console.log("Minimal fds -> ", minimalDependencies);
    return minimalDependencies;
}

function calculateDerivedFds(closures) {
    const derivedFds = [];
    closures.forEach(c => {
        const rhs = [];
        c.rhs.forEach(attr => {
            if (!c.lhs.includes(attr)) {
                rhs.push(attr);
            }
        });

        if (rhs.length) {
            derivedFds.push({ lhs: c.lhs, rhs: rhs});
        }
    })
    console.log("Set of non trivial fds -> ", derivedFds);
    return derivedFds;
}

function calculateNormalForms() {

}

function calcSecondNf() { 
    if (minimalCandidateKey.length) {
        console.log("Relation is in 2NF because there are no composite minimum keys");
    }
}