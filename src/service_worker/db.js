const TB = 'F_WORD_TB'
export const wordsDB = {
    set: async (v) => {
        let list = (await chrome.storage.local.get(TB))[TB] || [];
        const isInList = list.some(i => i.word === v.word);
        if (isInList) {
            list = list.map(i => {
                if (i.word === v.word) {
                    i = { ...i, ...v ,id:new Date().getTime()};
                }

                return i
            })
        } else {
            list.unshift({...v,id:new Date().getTime()});

        }
        await chrome.storage.local.set({
            'F_WORD_TB': list
        })
        return list;
    },
    get: async (r) => {
        const list = (await chrome.storage.local.get(TB))[TB]
        if (!!r) {
            return list.filter(i => Object.keys(r).every(key => r[key] === i[key]))
        } else {
            return list
        }
    },
    delete:async (v)=>{
        let list = (await chrome.storage.local.get(TB))[TB]
        list=list.filter(i=>i.word!==v.word);
        await chrome.storage.local.set({
            'F_WORD_TB': list
        })
        return list;
    }
}