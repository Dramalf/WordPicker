
require('./index.scss')
let active = {};
let isEntering = false;
let enterType = ''
let words=[];
let lastWord=''
const translationWebUrl = 'https://dictionary.cambridge.org/dictionary/english-chinese-simplified/'
const input = document.createElement('input');
input.id = 'meaning-input';
input.placeholder = '回车添加，esc退出'


const ms = [ 
    'background:#f8ebd840',
    'padding:3px',
    'font-weight:700',
    'color:#6b5152',
    'border-radius:4px 0 0 4px'
  ].join(';')
  const ws=[
    'background:#ead0d180',
    'font-weight:700',
    'padding:3px',
    'color:#7a7281',
    'border-radius:0 4px 4px 0'
  ].join(';')
  const sws=[
    'background:#ead0d180',
    'font-weight:700',
    'padding:3px',
    'color:#7a7281',
    'border-radius:4px'
  ].join(';')
  // or

function checkExecute(e){
    let res=true;
    if(['input','textarea'].includes(e.target.type)){
        if(window.getSelection().toString()){
            res=true;
        }else{
            res=false
        }
    }
    return res;
}
function handleKeydown(e) {
    if(!checkExecute(e))return 
    const key = e.key.toLowerCase();
    if(key==='tab'){
        if(input.style.marginBottom){
            input.style.marginBottom='';
        }else{
            input.style.marginBottom='0';
        }
    }
    if (isEntering) {
        if (key === 'enter') {
            if (enterType === 'meaning') {
                send("ADD_MEANING", input.value);
                closeInput()
            } else if(enterType === 'words') {
                send("ADD_WORD", input.value);
                closeInput()
            }else if(enterType==='review'){
                let index=Math.round(Math.random()*(words.length-1));
                console.log('%c%s', sws,lastWord.word)
                lastWord=words[index]
                console.log('%c%s%c%s', ms,lastWord.meaning,ws,lastWord.word.substring(0,3))
                input.value=''
            }

           
        } else if (key === 'escape') {
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
        }else if (active.r && active.f){
            reviewWords()
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
    input.value=''
    input.focus();
    isEntering = true;
    enterType = type;
}
function send(type, data='') {
    return chrome.runtime.sendMessage({ type: type, data: data })
}
function initConfig(){
}
async function reviewWords(){
    words=await send("GET_ALL_WORDS");
    let index=Math.round(Math.random()*(words.length-1));
    lastWord=words[index]
    openInput('review')
    console.log('%c%s%c%s', ms,lastWord.meaning,ws,lastWord.word.substring(0,3))
}
function start(){
    initConfig();
    document.addEventListener('keydown', handleKeydown)
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        const {type,data}=request;
        if(type==='GET_ENABLE_STATE'){
            const res=localStorage.getItem('ENABLE_WORDPICKER')||'true';
            sendResponse(res)
        }
        if(type==='SET_ENABLE_STATE'){
            localStorage.setItem('ENABLE_WORDPICKER',data);
            if(data==='true'){
                document.removeEventListener('keydown',handleKeydown);
                document.addEventListener('keydown', handleKeydown);
            }else{
                document.removeEventListener('keydown',handleKeydown);
            }
        }
    
        });
}
start()
