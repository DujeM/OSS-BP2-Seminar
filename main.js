var selectedExample;
let relationsClosures = [];
let cancidateKeys = [];
let primeAttributes = [];
let nonPrimeAttributes = [];
let minimalCandidateKey = [];
let minimalComposedCandidateKey = [];
let minimalDependencies = [];
let minimalCoverSetSplitRhs = [];
let minimalCoverSet = [];
let derivedFds = [];
let isRelationInThirdNf = false;
let isRelationinBcnf = false;
let decomposed3nf = [];

window.addEventListener("load", init);

function init() {
    selectedExample = null;
    let select = document.getElementById('select-example');

    db.forEach((example, i) => {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = `Example ${i}`;
        select.appendChild(option);
    });
}

function reset() {
    relationsClosures = [];
    cancidateKeys = [];
    primeAttributes = [];
    nonPrimeAttributes = [];
    minimalCandidateKey = [];
    minimalComposedCandidateKey = [];
    minimalDependencies = [];
    minimalCoverSet = [];
    derivedFds = [];
    isRelationInThirdNf = false;
    isRelationinBcnf = false;
    decomposed3nf = [];
    document.getElementById('result').innerHTML = "";
}

function loadExample(selectedValue) {
    reset();
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

function insertResult(res) {
    let container = document.createElement('div');
	container.innerHTML = res;
    document.getElementById('result').appendChild(container);
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
    let closureSize = attribute.length;
    let currentClosure = attribute;

    while (true) {
        for (let i = 0; i < leftSide.length; i++) {
            const lhs = leftSide[i];
            if (lhs.every(val => currentClosure.includes(val))) {
                if (rightSide[i]) {
                    currentClosure = Array.from(new Set([...currentClosure, ...rightSide[i] ]));
                }
            }
        }

        if (currentClosure.length > closureSize) {
            closureSize = currentClosure.length;
            continue;
        } else {
            break;
        }
    }

    return currentClosure;
}

function findPrimaryKeys() {
    document.getElementById('result').innerHTML = "";
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

            if (!minimalCandidateKey.length && (minimalComposedCandidateKey.length && minimalComposedCandidateKey[0].length === attr.length) || !minimalComposedCandidateKey.length) {
                minimalComposedCandidateKey.push(attr);
            }

            cancidateKeys.push(attr);
        }
        relationsClosures.push({ lhs: attr, rhs: closure });
    });

    console.log("Relation closures -> ", relationsClosures);
    console.log("CANDIDATE KEYS: -> ", cancidateKeys);
    console.log("Minimal candidate key -> ", minimalCandidateKey)
    console.log("Minimal composed candidate key -> ", minimalComposedCandidateKey)

    primeAttributes = minimalCandidateKey.length ? minimalCandidateKey : Array.from(new Set(minimalComposedCandidateKey.flat()));
    nonPrimeAttributes = allAttributes.filter(attr => !primeAttributes.includes(attr));

    console.log("Prime attributes -> ", primeAttributes);
    console.log("Non-Prime attributes -> ", nonPrimeAttributes);

    minimalCoverSetSplitRhs = findMinimalCoverSet(leftSide, rightSide);
    minimalCoverSet = findNecessaryLhsAttributes(minimalCoverSetSplitRhs);
    minimalDependencies = findMinimalDependencies(minimalCoverSet);
    derivedFds = calculateDerivedFds(relationsClosures);

    const result = minimalCandidateKey.length ? `Minimal candidate key: ${minimalCandidateKey[0]}` : `Minimal composite candidate keys: ${minimalComposedCandidateKey.map(mck => mck.join(",")).join("; ")}`;
    insertResult(result);
}

function isLhsAttributeNecessary(lhs, attr) {
    const closure = relationsClosures.find(cl => cl.lhs.length === lhs.length && lhs.every(l => cl.lhs.includes(l)));
    return (closure && !closure.rhs.includes(attr))
}

function findMinimalCoverSet(leftSide, rightSide) {
    let fdMin = [];

    for (let i = 0; i < rightSide.length; i++) {
        const rhs = rightSide[i];
        
        if (rhs.length === 1) {
            fdMin.push({ lhs: leftSide[i], rhs: rhs});
            continue;
        }

        fdMin = [...fdMin, ...rhs.flatMap(r => { return { lhs: leftSide[i], rhs: Array.from(JSON.parse(JSON.stringify(r))) } })]
    }

    console.log("Splitting RHS attributes -> ", fdMin);
    return fdMin;
}

function findNecessaryLhsAttributes(coverSet) {
    let currentFds = JSON.parse(JSON.stringify(coverSet))
    const finalFdMin = [];

    for (let i = 0; i < currentFds.length; i++) {
        const lhs = currentFds[i].lhs;

        if (lhs.length > 1) {
            const essential = [];
            const nonEssential = [];
            lhs.forEach(e => {
                if (isLhsAttributeNecessary(lhs.filter(l => l !== e && !nonEssential.includes(l)), currentFds[i].rhs[0])) {
                    essential.push(e);
                } else {
                    nonEssential.push(e);
                }
            });

            finalFdMin.push({ lhs: essential, rhs: currentFds[i].rhs});

            continue;
        }

        finalFdMin.push({ lhs: lhs, rhs: currentFds[i].rhs});
    }
    console.log("Splitting LHS attributes, final minimal cover set -> ", finalFdMin);

    return finalFdMin;
}

function findMinimalDependencies(coverSet) {
    const minimalDependencies = [];
    let finalMinimalDependecies = [];
    let minCover = JSON.parse(JSON.stringify(coverSet));
    const minLhs = minCover.map(md => md.lhs);
    const minRhs = minCover.map(md => md.rhs);
    let blocked = new Array(minCover.length).fill(0);

    minCover.forEach((minD, i) => {
        const tempRhs = [];
        const tempLhs = [];

        for (let j = 0; j < minRhs.length; j++) {
            if (j != i && blocked[j] == 0) {
                tempRhs.push(minRhs[j]);
            }            
        }

        for (let j = 0; j < minLhs.length; j++) {
            if (j != i && blocked[j] == 0) {
                tempLhs.push(minLhs[j]);
            }            
        }

        const closure = findClosure(minD.lhs, tempLhs, tempRhs)

        if (!closure.includes(minRhs[i][0])) {
            minimalDependencies.push(minD);
        } else {
            blocked[i] = 1;
        }
    });

    finalMinimalDependecies = minimalDependencies.reduce((acc, curr) => {
        const { lhs, rhs } = curr;
        const findObj = acc.find((o) => o.lhs.length === lhs.length && lhs.every(l => o.lhs.includes(l)));

        if (!findObj) {
          acc.push({ lhs, rhs });
        } else {
          findObj.rhs.push(...rhs);
        }

        return acc;
    }, []);

    console.log("Minimal fds -> ", finalMinimalDependecies);
    return finalMinimalDependecies;
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

function isTrivial(fd) {
    let trivial = true;

    for (const i in fd.rhs) {
        const r = fd.rhs[i];

        if (!fd.lhs.includes(r)) {
            trivial = false;
            break;
        }
    }

    return trivial;
}

function isSuperKey(val) {
    return cancidateKeys.find(ck => val.length === ck.length && val.every(v => ck.includes(v))) ? true : false;
}

function isPrimeAttribute(val) {
    return primeAttributes.includes(val);
}
 
function calculateNormalForms() {
    document.getElementById('result').innerHTML = "";
    insertResult("Relation is assumed to be in 1NF, each attribute is assumed to contain only one value per row.");
    calculateSecondNf();
    isRelationInThirdNf = calculateThirdNf();
    isRelationinBcnf = calculateBcnf();
}

function calculateSecondNf() { 
    let isSecondNf = true;
    let fdsNotInSecondNf = [];

    if (minimalCandidateKey.length) {
        insertResult("Relation is in 2NF because there are no composite minimum keys");
        return isSecondNf;
    }

    minimalDependencies.forEach(mc => {
        if (nonPrimeAttributes.includes(mc.rhs[0])) {
            if (mc.lhs.every(l => primeAttributes.includes(l)) && mc.lhs.length < primeAttributes.length) {
                isSecondNf = false;
                fdsNotInSecondNf.push(mc);
            }
        }
    });

    if (!isSecondNf) {
        insertResult("Relation is not in 2NF because there are non prime attributes functionally determined by a proper subset of a composite minimum key.", fdsNotInSecondNf);
        return isSecondNf;
    }

    insertResult("Relation is in 2NF");
    return isSecondNf;
}

/**
 * 
 * (1) The right-hand side is a subset of the left hand side, 
 * (2) the left-hand side is a superkey (or minimum key) of the relation, or 
 * (3) the right-hand side is (or is a part of) some minimum key of the relation
 */

function calculateThirdNf() {
    if (isRelationInThirdNf) {
        insertResult("Relation is already in 3NF.");
        return;
    }

    let is3nf = true;
    let fdsNotInThirdNf = [];

    for (let i = 0; i < minimalDependencies.length; i++) {
        const mc = minimalDependencies[i];


        is3nf = isDependencyIn3nf(mc);

        if (!is3nf) {
            fdsNotInThirdNf.push(mc);
        }
    }

    if (!fdsNotInThirdNf.length) {
        insertResult("Relation is in 3NF.");
        return true;
    }

    insertResult(`Relation is not in 3NF because not all functional dependecies satisfy at least one of the conditions needed for 3NF. \n Failed dependencies: ${fdsNotInThirdNf.map(fd => `${fd.lhs.join(', ')} -> ${fd.rhs.join(', ')}`).join("; ")}`);
    return false;
}

function isDependencyIn3nf(fd) {
    return isTrivial(fd) || isSuperKey(fd.lhs) || isPrimeAttribute(...fd.rhs);
}

function calculateBcnf() {
    if (isRelationinBcnf) {
        insertResult("Relation is already in BCNF.");
        return;
    }

    let isBncf = true;
    let failedFds = [];

    for (const i in minimalDependencies) {
        const fd = minimalDependencies[i];

        isBncf = isDependencyInBcnf(fd);

        if (!isBncf) {
            failedFds.push(fd);
        }
    }

    if (!failedFds.length) {
        insertResult("Relation is in BCNF");
        return;
    }

    insertResult(`Relation is not in BCNF because not all functional dependecies satisfy at least one of the conditions needed for BCNF. \n Failed dependencies: ${failedFds.map(fd => `${fd.lhs.join(', ')} -> ${fd.rhs.join(', ')}`).join("; ")}`);
}

function isDependencyInBcnf(fd) {
    return isTrivial(fd) || isSuperKey(fd.lhs);
}

function isSubset(first, second) {
    return first.every(val => second.includes(val));
}

function decomposeThirdNf() {
    document.getElementById('result').innerHTML = "";
    let decomposed = [];

    for (const i in minimalDependencies) {
        const md = minimalDependencies[i];
        const combined = [...md.lhs, ...md.rhs];

        if (!isSubset(combined, decomposed)) {
            decomposed.push({ relation: combined, fd: md});
            continue;
        }

        if (minimalCandidateKey.length && !isSubset(minimalCandidateKey, decomposed)) {
            decomposed.push({ relation: combined, fd: md});
            continue;
        }

        if (minimalComposedCandidateKey.length && !minimalComposedCandidateKey.some(mc => isSubset(mc, decomposed))) {
            decomposed.push({ relation: combined, fd: md});
            continue;
        }
    }

    insertResult("Decomposing relation into 3NF relations:");
    decomposed.forEach(d => {
        insertResult(`Relation: ${d.relation.join(', ')}`);
        insertResult(`FD(s): ${d.fd.lhs.join(', ')} -> ${d.fd.rhs.join(', ')}`)
        insertResult("----------------");
    });

    return decomposed;
}
