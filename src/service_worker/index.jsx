/* eslint-disable no-undef */
import { serviceWokerUtil } from '../util'
console.log('welcome')
const core = {
    "SET_PROXY_URL": (v) => {
        chrome.storage.sync.set({ 'proxy_url': v }, function () {
            console.log('Value is set to ' + v);
        });
    },


    "ENABLE_PROXY": (data) => {
        const { mockList } = data;
        const removeRuleIds = mockList.map((m, index) => index + 1);
        const addRules = mockList.map((m, index) => {
            const { urlFilter, targetUrl, id } = m;
            return {
                id: index + 1,
                priority: 1,
                condition: {
                    urlFilter,
                    resourceTypes: ["xmlhttprequest", "script"],
                },
                action: {
                    type: "redirect",
                    redirect: { url: targetUrl }
                }
            }
        })
        console.log('addRules=>>', removeRuleIds, addRules)
        const rules = {
            removeRuleIds,
            addRules
        };
        chrome.declarativeNetRequest.updateDynamicRules(rules, () => {
            chrome.declarativeNetRequest.getDynamicRules(rules => console.log("enabler rules", rules))
        }
        )
    },
    "REMOVE_RULE": (data) => {
        const { id } = data;
        const removeRuleIds = [id];
        const rules = {
            removeRuleIds
        };
        chrome.declarativeNetRequest.updateDynamicRules(rules)
        console.log('remove rule',id);
    }
}
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    console.log('BG get==>', msg)
    const { type, data } = msg
    if (type === 'GET_INIT_DATA') {
       
        serviceWokerUtil.insertFunc({
            func: serviceWokerUtil.getHistoryMOCK_LIST,
            callback: (storage) => {
                sendResponse(storage[0].result)
                console.log('in store', storage[0].result)
            }
        })
        const r= await chrome.storage.sync.get('mockList')
        console.log('storage',r)
    } else {
        core[type] && core[type](data)
    }
    // const { type, data } = msg;
    // core[type]&&core[type](data);
    return true;
})
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(
    (e) => console.log('rule match', e)
);

chrome.storage.onChanged.addListener((changes,namespace)=>{
    for (var key in changes) {
        var storageChange = changes[key];
        console.log(
                    key,
                    namespace,
                    storageChange.oldValue,
                    storageChange.newValue);
      }

})

