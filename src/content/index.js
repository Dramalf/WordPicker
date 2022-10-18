
require('./index.scss')
let active = {};
let isEntering = false;
let enterType = ''
const translationWebUrl = 'https://dictionary.cambridge.org/dictionary/english-chinese-simplified/'
const input = document.createElement('input');
input.id = 'meaning-input';
input.placeholder = '回车添加，esc退出'



function handleKeypress(e) {
    const key = e.key.toLowerCase();
    if (isEntering) {
        if (key === 'enter') {
            if (enterType === 'meaning') {
                send("ADD_MEANING", input.value);
            } else {
                send("ADD_WORD", input.value);
            }

            closeInput()
        } else if (e.keyCode === 27) {
            closeInput()
        }
    } else {
        active[key] = true;
        const selectWord = window.getSelection().toString();
        if (active.a && active.f) {

            if (selectWord) {
                send("ADD_WORD", selectWord);
            } else {
                openInput('words')
            }
        } else if (active.e && active.f) {

            if (selectWord) {
                send("ADD_MEANING", selectWord)
            } else {
                openInput('meaning');
            }
        } else if (active.s && active.f) {
            window.open(translationWebUrl + selectWord || '')
        }
    }
    setTimeout(() => {
        active = {}
    }, 100);
}

function closeInput() {
    input.parentNode.removeChild(input)
    input.value = null
    isEntering = false;
}
function openInput(type) {
    document.body.appendChild(input);
    input.focus();
    isEntering = true;
    enterType = type;
}
function send(type, data='') {
    return chrome.runtime.sendMessage({ type: type, data: data })
}
function initConfig(){
    send("GET_CONFIG").then(res=>{console.log(res,'res')})
}
function start(){
    initConfig();
    document.addEventListener('keypress', handleKeypress)
    window.addEventListener('search-word', ({ url }) => {
        window.open(url)
    });
}
start()
