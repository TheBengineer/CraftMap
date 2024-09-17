function parsePairResult(first, second, result) {
    let data = JSON.parse(result);
    let resultElementName = data.result;
    map[resultElementName] = {first: first, second: second};
    console.log(first.text + " + " + second.text + " => " + resultElementName);
    elements.push({text: resultElementName, emoji: data.emoji, discovered: data.isNew});
    console.log("Elements:", elements.length);
}

function fetchCombination(a, b) {
    let fetchUrl = `https://neal.fun/api/infinite-craft/pair?first=${a.text}&second=${b.text}`;
    fetch(fetchUrl, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": "https://neal.fun/infinite-craft/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "cr edentials": "include"
    }).then(response => response) // output the status and return response
        .then(response => response.text()) // send response body to next then chain
        .then(body => parsePairResult({text: a.text}, {text: b.text}, body)) // you can use response body here;
}

function fetchRandom() {
    let first = elements[Math.floor(Math.random() * elements.length)];
    let second = elements[Math.floor(Math.random() * elements.length)];
    setTimeout(() => {
        fetchCombination(first, second);
        saveData();
    }, Math.random() * 2000);
}


function main() {
    setInterval(fetchRandom, 1000);
}

function saveData() {
    let localDataRaw = localStorage['infinite-craft-data'];
    let localData = [];
    if (localDataRaw === undefined || localDataRaw === null) {
        localData = {elements: []};
    } else {
        localData = JSON.parse(localDataRaw);
    }
    let existingElements = localData.elements.map(e => e.text);
    for (let e of elements) {
        if (!existingElements.includes(e.text)) {
            localData.elements.push(e);
        }
    }
    console.log("Saving data to local storage:\n", localData);
    localStorage['infinite-craft-data'] = JSON.stringify(localData);
    localStorage['infinite-craft-data-backup'] = JSON.stringify(localData);

    let localMapRaw = localStorage['infinite-craft-map'];
    let localMap = {};
    if (localMapRaw === undefined || localMapRaw === null) {

        localMap = {};
    } else {
        localMap = JSON.parse(localMapRaw);
    }
    for (let key in map) {
        localMap[key] = map[key];
    }
    localStorage['infinite-craft-map'] = JSON.stringify(localMap);
}

function loadMap() {
    let result = localStorage['infinite-craft-map'];
    if (result === undefined || result === null) {
        result = {};
    } else {
        result = JSON.parse(result);
    }
    console.log("Loading exising element map:\n", result);
    return result;
}

function loadData() {
    let result = localStorage['infinite-craft-data'];
    let resultBackup = localStorage['infinite-craft-data-backup'];
    if (result === undefined || result === null) {
        result = [];
    } else {
        result = JSON.parse(result).elements;
    }
    if (resultBackup === undefined || resultBackup === null) {
        resultBackup = [];
    } else {
        resultBackup = JSON.parse(resultBackup).elements;
    }
    let existingElements = result.map(e => e.text);
    for (let e of resultBackup) {
        if (!existingElements.includes(e.text)) {
            result.push(e);
        }
    }
    result.concat(resultBackup.filter(e => !result.includes(e)));
    console.log("Loading existing elements:\n", result);
    return result;
}

if (typeof elements === 'undefined') {
    elements = loadData();
}
if (typeof map === 'undefined') {
    map = loadMap();
}
if (typeof chartElement === 'undefined') {
    chartElement = document.createElement("div");
    chartElement.id = "infinite-craft-chart";
    chartElement.innerHTML = "<h1>Elements</h1>";
    let body = document.getElementsByClassName("sidebar-controls")[0];
    body.insertBefore(chartElement, body.firstChild);
}

main();