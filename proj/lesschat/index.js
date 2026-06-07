mdui.setColorScheme('#0055bb');
document.querySelector('mdui-top-app-bar mdui-button-icon[icon="settings"]').addEventListener('click', ()=>{ 
    document.querySelector('mdui-navigation-drawer').open = !document.querySelector('mdui-navigation-drawer').open
});

const e_main = document.querySelector('.main');
const e_input = document.querySelector('.input > mdui-text-field');
const e_send = document.querySelector('.input > mdui-button');
const e_burl_cors = document.querySelector('.drawer-content > mdui-text-field:nth-child(1) > mdui-tooltip > mdui-button-icon');
const e_burl = document.querySelector('.drawer-content > mdui-text-field:nth-child(1)');
const e_key = document.querySelector('.drawer-content > mdui-text-field:nth-child(2)');
const e_model = document.querySelector('.drawer-content > mdui-text-field:nth-child(3)');
const e_streaming = document.querySelector('.drawer-content > .switch-line > mdui-switch');
const e_savecfg = document.querySelector('.drawer-content > mdui-button');

var historys = [];

document.querySelector('mdui-top-app-bar mdui-button-icon[icon="create"]').addEventListener('click', ()=>{
    historys = [];
    e_main.innerHTML = '';
    mdui.snackbar({
        message: "Cleared Chat History",
        closeable: true,
        placement: 'top'
    })
});
e_savecfg.addEventListener('click', ()=>{
    localStorage.setItem('lesschat', JSON.stringify({
        baseurl: e_burl.value,
        key: e_key.value,
        model: e_model.value,
        streaming: e_streaming.checked
    }))
    mdui.snackbar({
        message: "Saved Config",
        closeable: true,
        placement: 'top'
    })
});
if(localStorage.getItem('lesschat')){
    let ls = JSON.parse(localStorage.getItem('lesschat'));
    e_burl.value = ls.baseurl;
    e_key.value = ls.key;
    e_model.value = ls.model;
    e_streaming.checked = ls.streaming;
} else {
    e_burl.value = 'https://cj2api.forthezero.dpdns.org';
    e_key.value = 'sk-114514';
    e_model.value = 'llama3:8b';
    e_streaming.checked = false;
};

e_send.addEventListener('click', send_request);
e_input.addEventListener('keydown', (e)=>{if (e.key == 'Enter'){send_request();};});
    
async function send_request(){ 
    historys.push({role: 'user', content: e_input.value});
    e_main.insertAdjacentHTML('beforeend',`<mdui-card class="msg" clickable variant="outlined">${e_input.value}</mdui-card>`);
    e_input.value = '';
    e_send.disabled = true;
    e_send.loading = true;
    if(e_streaming.checked){
        let ele = document.createElement('mdui-card');
        ele.className = 'msg';
        ele.variant = 'filled';
        ele.clickable = true;
        ele.textContent = '';
        e_main.appendChild(ele);
        try {
            let res = await fetch(`${e_burl_cors.selected ? 'https://cors.forthezero.dpdns.org/?' : ''}${e_burl.value}/chat/completions`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + e_key.value,
                },
                body: JSON.stringify({
                    model: e_model.value,
                    stream: true,
                    messages: historys
                })
            });
            if (!res.ok) {
                e_send.disabled = false;
                e_send.loading = false;
                console.error(res);
                mdui.snackbar({
                    message: 'Request failed',
                    closeable: true,
                    placement: 'top'
                });
                return;
            };
            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            let fullContent = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop();
                for (const part of parts) {
                    if (!part.startsWith('data:')) continue;
                    const dataStr = part.slice(5).trim();
                    if (dataStr === '[DONE]') {
                        break;
                    };
                    try {
                        const json = JSON.parse(dataStr);
                        const delta = json.choices?.[0]?.delta?.content || '';
                        if (delta) {
                            fullContent += delta;
                            ele.textContent = fullContent;
                        };
                    } catch (err) {
                        console.warn('Parse streaming chunk error:', err, dataStr);
                    };
                };
            };
            historys.push({
                role: 'assistant',
                content: fullContent
            });
            e_send.disabled = false;
            e_send.loading = false;
        } catch (error) {
            e_send.disabled = false;
            e_send.loading = false;
            console.error(error);
            mdui.snackbar({
                message: 'Streaming request failed',
                closeable: true,
                placement: 'top'
            });
        };
    } else {
        try{
            let res = await fetch(`${e_burl_cors.selected ? 'https://cors.forthezero.dpdns.org/?' : ''}${e_burl.value}/chat/completions`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + e_key.value,
                },
                body: JSON.stringify({
                    model: e_model.value,
                    stream: false,
                    messages: historys
                })
            });
            if(!res.ok){
                e_send.disabled = false;
                e_send.loading = false;
                console.error(response);
                mdui.snackbar({
                    message: 'Request failed',
                    closeable: true,
                    placement: 'top'
                });
                return;
            };
            let json = await res.json();
            historys.push({
                role: 'assistant',
                content: json.choices[0].message.content
            });
            let ele = document.createElement('mdui-card');
            ele.className = 'msg';
            ele.variant = 'filled';
            ele.clickable = true;
            ele.textContent = json.choices[0].message.content;
            e_main.appendChild(ele);
            e_send.disabled = false;
            e_send.loading = false;
        }catch(error) { 
            e_send.disabled = false;
            e_send.loading = false;
            console.error(error);
            mdui.snackbar({
                message: 'Request failed',
                closeable: true,
                placement: 'top'
            });
        };
    };
};