/* eslint-disable no-undef */
const { wordsDB } = require('./db')
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('BG GET==>', msg)
    const { type, data } = msg;
    switch (type) {
        case "INIT":
            init()
                .then(res => {
                    sendResponse(res)
                });
            break;
        case "GET_ALL_WORDS":
            wordsDB.get()
                .then(res => {
                    sendResponse(res);
                })
            break;
        case "ADD_WORD":
            addWord(data);
            break;
        case "ADD_MEANING":
            addMeaning(data)
            break;
        case "EDIT_MEANING":
            editMeaning(data)
            break;
        case "DELETE_WORD":
            deleteWord(data);
            break;
        case "SEARCH_WORD":
            searchWord(data);
            break;
        default:
            console.log('unknown type')
    }
    return true;
})
function addWord(data) {
    let word = { id: new Date().getTime(), word: data }
    wordsDB.set(word)
    chrome.storage.sync.set({ currentWord: { word: data } });
}
async function editMeaning(data) {
    wordsDB.set(data);
}
async function addMeaning(data) {
    const currentWord = (await chrome.storage.sync.get(['currentWord'])).currentWord;
    console.log(currentWord);
    currentWord.meaning = data;
    wordsDB.set(currentWord);
    chrome.storage.sync.set({ currentWord: currentWord });
}
async function deleteWord(v) {
    wordsDB.delete(v)
}
async function searchWord(v) {
    const tabId = await getTabId();
    console.log('search', v)
    chrome.scripting.excuteScript({
        target: { tabId: tabId },
        func: (url) => {
            const event = new CustomEvent('search-word', { url });
            window.dispatchEvent(event);
        },
        args: [v]
    })
}
async function init() {
    const res = await wordsDB.get()
    return res
}
async function getTabId() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab.id
} 