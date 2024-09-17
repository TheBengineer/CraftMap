function parsePairResult(first, second, result) {
    let data = JSON.parse(result);
    let resultElementName = data.result;
    map[resultElementName] = {first: first, second: second};
    console.log(first.text + " + " + second.text + " => " + resultElementName);
    elements.push({text: resultElementName, emoji: data.emoji, discovered: data.isNew});
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
    fetchCombination(first, second);
}


function main() {
    fetchRandom()
    saveData();
    if (Date.now() - lastSaved > 10000) {
        console.log("Saving data to local storage");
        console.log("Elements:", elements);
        saveData();
        lastSaved = Date.now();
    }
}

function saveData() {
    let localDataRaw = localStorage['infinite-craft-data'];
    let localData = [];
    if (localDataRaw === undefined || localDataRaw === null) {
        localData = {elements: []};
    } else {
        localData = JSON.parse(localDataRaw);
    }
    localData.elements.concat(elements.filter(e => !localData.elements.includes(e)));
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
    let result2 = localStorage['infinite-craft-data-custom'];
    if (result === undefined || result === null) {
        result = [];
    } else {
        result = JSON.parse(result).elements;
    }
    console.log("Loading existing elements:\n", result);
    return result;
}

if (typeof elements === 'undefined') {
    elements = loadData();
}
if (typeof map === 'undefined') {
    map = loadMap();
}
if (typeof lastSaved === 'undefined') {
    lastSaved = Date.now();
}

main();