const getHistoryMOCK_LIST = () => {
    const mockList = window.localStorage.getItem('MOCK_LIST')
    return mockList
}
const setNewMockRecord = (l) => {
    window.localStorage.setItem('MOCK_LIST', l)
}
const registerWindowEvent = (eventName, callback) => {
    window.addEventListener(eventName, callback);
}
const insertFunc = async ({func=()=>{},args=[],callback=()=>{}}) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: func,
        args: args
    },callback);
}
const sendMessage=(msg,callback=()=>{})=>{
    chrome.runtime.sendMessage(msg,callback);
}
export const popupUtil = {}
export const serviceWokerUtil = {}
popupUtil['getHistoryMOCK_LIST'] = getHistoryMOCK_LIST
popupUtil['setNewMockRecord'] = setNewMockRecord
popupUtil['registerWindowEvent'] = registerWindowEvent
popupUtil['insertFunc']=insertFunc
popupUtil['sendMessage']=sendMessage
serviceWokerUtil['insertFunc']=insertFunc
serviceWokerUtil['getHistoryMOCK_LIST'] = getHistoryMOCK_LIST