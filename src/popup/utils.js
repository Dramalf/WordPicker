
const translationWebUrl = 'https://dictionary.cambridge.org/dictionary/english-chinese-simplified/'
let active = {};

export const handleKeypress = (e) => {
    const key = e.key.toLowerCase();
    active[key] = true;
    const selectWord = window.getSelection().toString();
    if (active.s && active.f && selectWord) {
        chrome.runtime.sendMessage({
            type: 'SEARCH_WORD', data: translationWebUrl+selectWord
        });
    }

    setTimeout(() => {
        active = {}
    }, 100);
}
