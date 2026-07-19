mdui.setTheme('auto');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
$(window).one('pointerdown touchstart click', function() {
    if (audioCtx.state !== 'running') {
        audioCtx.resume();
    };
});

var data = {
    col: 2,
    row: 3,
    items: [
        { text: 'Xter1', buffer: null, src: './Xter1.wav', enable: true },
        { text: 'Xter2', buffer: null, src: './Xter2.wav', enable: true },
        { text: 'Hydra1', buffer: null, src: './Hydra1.wav', enable: true },
        { text: 'Hydra2', buffer: null, src: './Hydra2.wav', enable: true },
        { text: '<img style="height: 100px;" src="./神秘按钮.gif" />', buffer: null, src: '', enable: false },
        { text: '<img style="height: 100px;" src="./神秘动作.gif" />', buffer: null, src: '', enable: false }
    ]
};

function loadAudio(url) {
    if (!url) return Promise.resolve(null);
    return fetch(url)
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
        .catch(() => null);
};

function playBuffer(buffer) {
    if (!buffer) return;
    var doPlay = function() {
        var source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
    };
    if (audioCtx.state !== 'running') {
        audioCtx.resume().then(doPlay);
    } else {
        doPlay();
    };
};

data.items.forEach(item => {
    if (item.src) {
        loadAudio(item.src).then(buf => item.buffer = buf);
    };
});

function render_items(){
    $('.pad').css('grid-template-columns', `repeat(${data.col}, 1fr)`);
    $('.pad').css('grid-template-rows', `repeat(${data.row}, 1fr)`);
    $('.pad').html('');
    data.items.map((item, index) => {
        let ele = $(`<div class="pad-item ${item.enable ? '' : 'disabled'}" >
            ${item.text}
        </div>`);
        ele.on('pointerdown', ()=>{
            if($('mdui-top-app-bar > mdui-switch').prop('checked')){
                open_edit(index);
            } else if(item.enable && item.buffer){
                playBuffer(item.buffer);
            };
        });
        $('.pad').append(ele);
    });
};
render_items();

$('mdui-top-app-bar > mdui-button-icon').on('click',()=>{
    $('.settings').attr('open', true);
});
$('.settings > div > :nth-child(2)').val(data.row);
$('.settings > div > :nth-child(3)').val(data.col);
$('.settings > div > :nth-child(4)').on('click',()=>{
    let new_row = $('.settings > div > :nth-child(2)').val();
    let new_col = $('.settings > div > :nth-child(3)').val();
    if(!new_row || !new_col || new_row < 1 || new_col < 1){
        mdui.snackbar({
            message: '行数或列数不能小于1',
            closeable: true,
            autoCloseDelay: 1500
        });
        return;
    };
    data.row = new_row;
    data.col = new_col;
    if(data.row * data.col > data.items.length){
        while (data.items.length < data.row * data.col) {
            data.items.push({ text: '', buffer: null, src: '', enable: false });
        }
    } else if(data.row * data.col < data.items.length){ 
        data.items = data.items.slice(0, data.row * data.col);
    };
    render_items();
    $('.settings').removeAttr('open');
});

var editing_index = -1;
function open_edit(index){
    let item = data.items[index];
    editing_index = index;
    $('.editing > div > :nth-child(1)').val(item.text);
    $('.editing > div > :nth-child(2)').val('ori');
    $('.editing > div > :nth-child(3)').val('');
    $('.editing > div > :nth-child(4)').text('选择或拖动文件'); selecting_file = null;
    $('.editing > div > :nth-child(5) > mdui-switch').attr('checked', item.enable);
    $('.editing').attr('open', true);
};
$('mdui-radio-group').on('change',(e)=>{
    $('.editing > div > :nth-child(3)').hide();
    $('.editing > div > :nth-child(4)').hide();
    switch(e.target.value){
        case 'url':
            $('.editing > div > :nth-child(3)').show();
            break;
        case 'file':
            $('.editing > div > :nth-child(4)').show();
            break;
        case 'none':
        case 'ori':
            break;
    };
});
$('.editing > div > :nth-child(3)').hide();
$('.editing > div > :nth-child(4)').hide();
var selecting_file = null;
function handleAudioFile(file) {
    if (!file || !file.type.startsWith('audio/')) return;
    selecting_file = file;
    $('.editing > div > :nth-child(4)').text(file.name);
}
$('.editing > div > :nth-child(4)').on('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
        handleAudioFile(e.target.files[0]);
    };
    input.click();
});
$('.editing > div > :nth-child(4)').on('dragover', (e) => { e.preventDefault(); e.stopPropagation(); });
$('.editing > div > :nth-child(4)').on('drop', (e) => {
    e.preventDefault(); e.stopPropagation();
    handleAudioFile(e.originalEvent.dataTransfer.files[0]);
});

$('.editing > div > :nth-child(6)').on('click', () => {
    const item = data.items[editing_index];
    const mode = $('mdui-radio-group').val();
    item.text = $('.editing > div > :nth-child(1)').val();
    item.enable = $('.editing > div > :nth-child(5) > mdui-switch').prop('checked');
    var promise = Promise.resolve();
    switch (mode) {
        case 'url':
            const url = $('.editing > div > :nth-child(3)').val();
            if(url){
                item.src = url;
                promise = loadAudio(url).then(buf => { item.buffer = buf; });
            } else {
                item.buffer = null;
                item.src = '';
            };
            break;
        case 'file':
            if(selecting_file){
                promise = new Promise((resolve) => {
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        audioCtx.decodeAudioData(e.target.result).then(buf => {
                            item.buffer = buf;
                            item.src = 'file';
                            resolve();
                        }).catch(() => {
                            item.buffer = null;
                            resolve();
                        });
                    };
                    reader.readAsArrayBuffer(selecting_file);
                });
            } else {
                item.buffer = null;
                item.src = '';
            };
            break;
        case 'none':
            item.buffer = null;
            item.src = '';
            break;
        case 'ori':
        default:
            break;
    };
    promise.then(() => {
        data.items[editing_index] = item;
        selecting_file = null;
        editing_index = -1;
        render_items();
        $('.editing').removeAttr('open');
    });
});