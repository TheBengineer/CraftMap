chrome.action.onClicked.addListener((tab) => {
    console.log('loading');
    if (tab.url.includes('neal.fun/infinite-craft/')) {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["main.js"],
        })
    } else {
        console.log('Wrong page:' + tab.url);
    }
});
