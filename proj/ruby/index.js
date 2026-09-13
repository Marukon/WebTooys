
const $nav1 = $('m3e-nav-bar m3e-nav-item:nth-child(1)');
const $nav2 = $('m3e-nav-bar m3e-nav-item:nth-child(2)');
const $nav3 = $('m3e-nav-bar m3e-nav-item:nth-child(3)');
const $content1 = $('.content.quick');
const $content2 = $('.content.write');
const $content3 = $('.content.convert');
$('m3e-nav-bar').on('change',()=>{
    if($nav1.prop('selected')){
        $content1.addClass('active');
        $content2.removeClass('active');
        $content3.removeClass('active');
    }else if($nav2.prop('selected')){
        $content1.removeClass('active');
        $content2.addClass('active');
        $content3.removeClass('active');
    }else if($nav3.prop('selected')){
        $content1.removeClass('active');
        $content2.removeClass('active');
        $content3.addClass('active');
    }
});

const $q_rt = $('.content.quick > div > :nth-child(2) > input');
const $q_text = $('.content.quick > div > :nth-child(3) > input');
const $q_preview = $('.quick-preview');
const $q_code = $('#quick-code');
function copy(){
    navigator.clipboard.writeText($q_code.val());
};
function clear(){
    $q_rt.val('');
    $q_text.val('');
    update_preview();
};
function update_preview(){
    $q_preview.html(`<ruby>${$q_text.val()}<rt>${$q_rt.val()}</rt></ruby>`);
    $q_code.val(`<ruby>${$q_text.val()}<rt>${$q_rt.val()}</rt></ruby>`);
};
$('.content.quick > div > m3e-split-button > m3e-button').on('click',()=>{
    copy();
    clear();
});
$('#quick-actions > m3e-menu-item:nth-child(1)').on('click',()=>{
    copy();
});
$('#quick-actions > m3e-menu-item:nth-child(2)').on('click',()=>{
    clear();
});
$q_rt.on('input',()=>{
    update_preview();
});
$q_text.on('input',()=>{
    update_preview();
});

const $w_mode = $('#write-mode');
const $w_rt = $('.write-replace-ctrl > m3e-form-field > input');
const $w_btn = $('.write-replace-ctrl > m3e-button');
const $w_editor = $('.write > m3e-card > div');
let savedRange = null, constraining = false;
function closestSpan(node){
    let n = node;
    while(n && n !== $w_editor[0]){
        if(n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() === 'span') return n;
        n = n.parentNode;
    };
    return null;
};
function wrapTextNodes(node){
    Array.from(node.childNodes).forEach(child=>{
        if(child.nodeType === Node.TEXT_NODE){
            if(child.textContent !== ''){
                const span = document.createElement('span');
                span.textContent = child.textContent;
                node.replaceChild(span,child);
            };
        }else if(child.nodeType === Node.ELEMENT_NODE){
            const tag = child.tagName.toLowerCase();
            if(tag !== 'ruby' && tag !== 'rt' && tag !== 'span' && tag !== 'br') wrapTextNodes(child);
        };
    });
};
function serializeEditor(node){
    let out = '';
    Array.from(node.childNodes).forEach(child=>{
        if(child.nodeType === Node.TEXT_NODE){
            out += child.textContent;
        }else if(child.nodeType === Node.ELEMENT_NODE){
            const tag = child.tagName.toLowerCase();
            if(tag === 'br') out += '\n';
            else if(tag === 'div' || tag === 'p') out += '\n' + serializeEditor(child);
            else if(tag === 'span') out += serializeEditor(child);
            else out += child.outerHTML;
        };
    });
    return out;
};
$w_mode.on('change',()=>{
    const checked = $w_mode.prop('checked');
    savedRange = null;
    window.getSelection().removeAllRanges();
    if(checked){
        const source = $w_editor.text();
        const tmp = document.createElement('div');
        tmp.innerHTML = source.replace(/\n/g,'<br>');
        wrapTextNodes(tmp);
        $w_editor.attr('contenteditable','false');
        $w_editor.html(tmp.innerHTML);
        $w_rt.prop('disabled',false);
        $w_btn.prop('disabled',true);
    }else{
        const source = serializeEditor($w_editor[0]);
        $w_editor.attr('contenteditable','plaintext-only');
        $w_editor.text(source);
        $w_rt.val('');
        $w_rt.prop('disabled',true);
        $w_btn.prop('disabled',true);
    };
});
document.addEventListener('selectionchange',()=>{
    if(constraining) return;
    if(!$w_mode.prop('checked')) return;
    const sel = window.getSelection();
    if(!sel.rangeCount || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    if(!$w_editor[0].contains(range.commonAncestorContainer)) return;
    const anchorSpan = closestSpan(sel.anchorNode);
    const focusSpan = closestSpan(sel.focusNode);
    if(!anchorSpan || anchorSpan === focusSpan) return;
    const pos = anchorSpan.compareDocumentPosition(sel.focusNode);
    const focusAfter = !!(pos & Node.DOCUMENT_POSITION_FOLLOWING) || !!(pos & Node.DOCUMENT_POSITION_CONTAINED_BY);
    const newRange = document.createRange();
    if(focusAfter){
        newRange.setStart(sel.anchorNode,sel.anchorOffset);
        newRange.setEnd(anchorSpan,anchorSpan.childNodes.length);
    }else{
        newRange.setStart(anchorSpan,0);
        newRange.setEnd(sel.anchorNode,sel.anchorOffset);
    };
    constraining = true;
    sel.removeAllRanges();
    sel.addRange(newRange);
    constraining = false;
});
$w_editor.on('mouseup',()=>{
    if(!$w_mode.prop('checked')) return;
    const sel = window.getSelection();
    if(!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if(range.collapsed) return;
    if(!$w_editor[0].contains(range.commonAncestorContainer)) return;
    if(!closestSpan(sel.anchorNode) || !closestSpan(sel.focusNode)) return;
    savedRange = range.cloneRange();
    if($w_rt.val().trim() !== '') $w_btn.prop('disabled',false);
});
$w_rt.on('input',()=>{
    if($w_mode.prop('checked') && savedRange && $w_rt.val().trim() !== '') $w_btn.prop('disabled',false);
    else $w_btn.prop('disabled',true);
});
$w_rt.on('keydown',e=>{
    if(e.key === 'Enter' && !$w_btn.prop('disabled')) $w_btn.trigger('click');
});
$w_btn.on('click',()=>{
    if(!$w_mode.prop('checked') || !savedRange) return;
    const selectedText = savedRange.toString();
    const rtText = $w_rt.val();
    if(!selectedText || !rtText.trim()) return;
    const ruby = document.createElement('ruby');
    ruby.textContent = selectedText;
    const rt = document.createElement('rt');
    rt.textContent = rtText;
    ruby.appendChild(rt);
    savedRange.deleteContents();
    savedRange.insertNode(ruby);
    window.getSelection().removeAllRanges();
    savedRange = null;
    wrapTextNodes($w_editor[0]);
    $w_rt.val('');
    $w_btn.prop('disabled',true);
});
$w_editor.attr('contenteditable','plaintext-only');
$w_rt.prop('disabled',true);
$w_btn.prop('disabled',true);

const $c_mode = $('#convert-modes');
const $c_area = $('#convert-area');
const $c_btn = $('.convert-bar > m3e-split-button > m3e-button');
const $c_copy = $('.convert-bar > m3e-split-button > m3e-icon-button');
const c_2r = {
    '2r-1': [/\[([^\]]+)\]\(([^)]+)\)/g,'<ruby>$1<rt>$2</rt></ruby>'],
    '2r-2': [/\{([^}]+)\}\(([^)]+)\)/g,'<ruby>$1<rt>$2</rt></ruby>'],
    '2r-3': [/\[([^\]]+)\^([^\]]+)\]/g,'<ruby>$1<rt>$2</rt></ruby>'],
    '2r-4': [/\{([^}]+)\^([^}]+)\}/g,'<ruby>$1<rt>$2</rt></ruby>'],
    '2r-5': [/\[([^\]]+)\|([^\]]+)\]/g,'<ruby>$1<rt>$2</rt></ruby>'],
    '2r-6': [/\{([^}]+)\|([^}]+)\}/g,'<ruby>$1<rt>$2</rt></ruby>']
};
const c_r2_re = /<ruby>([\s\S]*?)<rt>([\s\S]*?)<\/rt><\/ruby>/g;
const c_r2 = {
    'r2-1': '[$1]($2)',
    'r2-2': '{$1}($2)',
    'r2-3': '[$1^$2]',
    'r2-4': '{$1^$2}',
    'r2-5': '[$1|$2]',
    'r2-6': '{$1|$2}'
};
$c_btn.on('click',()=>{
    const mode = $c_mode.val();
    const text = $c_area.val();
    if(c_2r[mode]){
        const [re,rep] = c_2r[mode];
        $c_area.val(text.replace(re,rep));
    }else if(c_r2[mode]){
        $c_area.val(text.replace(c_r2_re,c_r2[mode]));
    };
});
$c_copy.on('click',()=>{
    navigator.clipboard.writeText($c_area.val());
});