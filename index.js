//elements
const e_tooltip = $('m3e-tooltip[for="menu-btn"]');
const e_sort = $('.sort');
const e_cate = $('.category');
const e_toollist = $('.tools');
const e_rand = $('#rand-btn');

//egg
var clk = 0;
var eggs = {
    3: '你怎么还在点',
    4: '我说了这个东西没用的，别点了',
    5: '你点了，我也不知道',
    6: '真的是……',
    7: '这么有能耐的话……',
    8: '你有本事点到第100次',
    9: '你就点吧，懒得告诉你点了多少下，你自己数去',
    50: '50下了，你还在点？',
    51: '给你一点缓冲，我是来告诉你现在在51~54下',
    55: '你就点吧，懒得告诉你点了多少下，你自己数去',
    95: '加油哦，就快到了，放慢点吧',
    100: '不是你真的这么无聊',
    101: '既然如此',
    102: '我喜欢你',
    103: '≧ ﹏ ≦',
    104: '100下是不是太少了（）',
    105: '写不动了，后面真的没了，除非你能点到一个及其大的数字',
    106: '再见~',
    110: '我是一个装饰按钮我是一个装饰按钮我是一个装饰按钮',
    520: '您已抵达：520下',
    530: '我是一个装饰按钮我是一个装饰按钮我是一个装饰按钮',
    721: '0721~',
    722: '我是一个装饰按钮我是一个装饰按钮我是一个装饰按钮',
    10086: '怎么点了10086下？',
    10087: '我是一个装饰按钮我是一个装饰按钮我是一个装饰按钮',
    114514: '114514+下了，嗯哼哼啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
    114520: '我是一个装饰按钮我是一个装饰按钮我是一个装饰按钮',
    33550336: '你是白厄吗？',
    33550337: '再次踏上轮回……',

};
const e_menu = $('#menu-btn');
e_menu.on('click',function(){
    clk++;
    if(eggs[clk]){
        e_tooltip.text(eggs[clk]);
    };
});
//random
e_rand.on('hover mouseenter touchstart mouseup',()=>{
    e_rand.attr('href', links[Math.floor(Math.random() * links.length)].url);
});

//trigger
e_sort.on('change',function(){
    if(e_sort[0].value === ''){
        e_sort[0].value = 'recommend';
    };
    show_tools(links, e_sort[0].value, e_cate[0].value);
});
e_cate.on('change',function(){
    if(e_cate[0].value === ''){
        e_cate[0].value = 'no';
    };
    show_tools(links, e_sort[0].value, e_cate[0].value);
});
show_tools(links, e_sort[0].value, e_cate[0].value);
print_rcm();

function show_tools(list, sort, cate) {
    if (!cate || !cate_order[cate]) {
        cate = 'no';
    }
    // prepare
    const categorized = {};
    if (cate === 'no') {
        categorized.no = [...list].sort((a, b) => 
            b.slot[sort] - a.slot[sort]
        );
    } else {
        list.forEach(item => {
            const categoryValue = item.slot[cate];
            if (!categorized[categoryValue]) {
                categorized[categoryValue] = [];
            };
            categorized[categoryValue].push(item);
        });
        Object.entries(categorized).forEach(([key, items]) => {
            items.sort((a, b) => 
                b.slot[sort] - a.slot[sort]
            );
        });
    };
    console.log(categorized);
    // show
    e_toollist.empty();
    if(cate === 'no'){
        for(let i=0;i<categorized.no.length;i++){
            let item = categorized.no[i];
            let card = $(`
                <m3e-card actionable href="${item.url}">
                    <div>
                        <m3e-icon name="${item.icon.replace('--outlined','')}" variant="outlined" class="item-icon"></m3e-icon>
                        <h1>${item.name}</h1>
                        <p>${item.desc}</p>
                        ${item.github ? `<m3e-assist-chip href="${item.github}" target="_blank">Source</m3e-assist-chip>` : ''}
                    </div>
                </m3e-card>`);
            e_toollist.append(card);
        };
    } else {
        let cate_list = cate_order[cate];
        for(let i=0;i<cate_list.length;i++){
            let key = cate_list[i][0];
            let name = cate_list[i][1];
            let items = categorized[key];
            if(items){
                let group = $(`<m3e-expansion-panel open>
                    <span slot="header">${name}</span>
                </m3e-expansion-panel>`);
                for(let j=0;j<items.length;j++){
                    let item = items[j];
                    let card = $(`
                        <m3e-card actionable href="${item.url}">
                            <div>
                                <m3e-icon name="${item.icon.replace('--outlined','')}" variant="outlined" class="item-icon"></m3e-icon>
                                <h1>${item.name}</h1>
                                <p>${item.desc}</p>
                                ${item.github ? `<m3e-assist-chip href="${item.github}" target="_blank">Github</m3e-assist-chip>` : ''}
                            </div>
                        </m3e-card>`);
                    group.append(card);
                };
                e_toollist.append(group);
            };
        };
    };
};

function print_rcm(){
    let rcm_list = [];
    for(let i=0;i<links.length;i++){
        let item = links[i];
        rcm_list.push({'name':item.name,'recommend':item.slot.recommend});
    };
    rcm_list.sort(function(a,b){
        return b.recommend - a.recommend;
    });
    console.log(rcm_list);
};
