
console.log(window,'in script',window.localStorage.getItem('urlFilter'))

function modifyResponse(response) {
    var urlFilter=window.localStorage.getItem('urlFilter');
    var original_response, modified_response;
    if (this.readyState === 4&& this.requestURL.includes(urlFilter)) {
        // 使用在 openBypass 中保存的相关参数判断是否需要修改
        if (true||this.requestUrl  && this.requestMethod ) {
            Object.defineProperty(this, "responseText", {writable: true});
            Object.defineProperty(this, "status", {writable: true});
            // 根据 sendBypass 中保存的数据修改响应内容
            // '{"rules":[{"proxy_url":"login","target_url":"login","mockJson":{"message":"success","data":{"id":1,"type":1}}}]}';
            this.responseText='123';
            this.status=200
        }
        console.log('check response',this)
        return true;
    }
}

function openBypass(original_function) {

    return function(method, url, async) {
        // 保存请求相关参数
        this.requestMethod = method;
        this.requestURL = url;
        console.log('check request',url,method);
        this.addEventListener("readystatechange", modifyResponse);
        this.addEventListener('onload',e=>console.log(e))
        return original_function.apply(this, arguments);
    };

}

function sendBypass(original_function) {
    return function(data) {
        // 保存请求相关参数
        this.requestData = data;
        return original_function.apply(this, arguments);
    };
}
function onloadBypass(original_function){
    return function(data){
        return original_function.apply(this, arguments);
    }
}

XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
XMLHttpRequest.prototype.send = sendBypass(XMLHttpRequest.prototype.send);
// XMLHttpRequest.prototype.onload=