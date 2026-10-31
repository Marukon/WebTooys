var links = [
    {
        name: "Todo",
        icon: "task_alt--outlined",
        desc: "An imitative todo app, trigger ctx menu to del item",
        url: "./proj/todo/index.html",
        github: null,
        slot: {
            time: 1,
            recommend: -30,
            lang: "en",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "Zen",
        icon: "timer--outlined",
        desc: "<del>带记录功能的计时器……</del>一个Material3风格的简约专注网页，可显示一言句子，可以对专注计时进行统计",
        url: "./proj/zen/index.html",
        github: null,
        slot: {
            time: 2,
            recommend: -70,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "简单日历",
        icon: "date_range--outlined",
        desc: "简约的日历，就只由简单的日历功能",
        url: "./proj/calendar/index.html",
        github: null,
        slot: {
            time: 3,
            recommend: 340,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "震动测试",
        icon: "vibration--outlined",
        desc: "仅限带线性马达的手机，随便搞的，更新了2.0版本，但还是不如意……",
        url: "./vibe/playvib/1.html",
        github: null,
        slot: {
            time: 4,
            recommend: -420,
            lang: "zh",
            ai: "no",
            device: "mobile"
        }
    },
    {
        name: "QpenForm",
        icon: "question_answer--outlined",
        desc: "此处仅限前端部分",
        url: "./proj/form/index.html",
        github: "https://github.com/for-the-zero/QpenForm",
        slot: {
            time: 5,
            recommend: 50,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "TypeTo",
        icon: "keyboard--outlined",
        desc: "（仅限电脑使用，需要键盘）将键盘上的按键映射成其它字符，可以拿来整活",
        url: "./proj/typeto/index.html",
        github: null,
        slot: {
            time: 6,
            recommend: -50,
            lang: "zh",
            ai: "no",
            device: "desktop"
        }
    },
    {
        name: "Passkey",
        icon: "password",
        desc: "生成图像密文，不提供解密（懒）",
        url: "./proj/passkey/index.html",
        github: null,
        slot: {
            time: 7,
            recommend: -160,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "VisualVoice",
        icon: "voicemail",
        desc: "convert voice to color",
        url: "./vibe/vv/index.html",
        github: null,
        slot: {
            time: 8,
            recommend: -90,
            lang: "en",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "Taple",
        icon: "table_chart--outlined",
        desc: "A pretty simple table app based on canvas",
        url: "./proj/taple/index.html",
        github: "https://github.com/for-the-zero/Taple",
        slot: {
            time: 9,
            recommend: 980,
            lang: "en",
            ai: "enhance",
            device: "both"
        }
    },
    {
        name: "文本展示",
        icon: "smart_screen--outlined",
        desc: "将文本展示在屏幕上",
        url: "./proj/showon/index.html",
        github: null,
        slot: {
            time: 10,
            recommend: 540,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "UP主动态查看器",
        icon: "post_add",
        desc: "查看UP主的动态",
        url: "./proj/updyn/index.html",
        github: "https://github.com/for-the-zero/UpDyn",
        slot: {
            time: 11,
            recommend: 380,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    
    {
        name: "Alan Becker视频列表",
        icon: "video_library--outlined",
        desc: "免_获取Alan Becker的YouTube视频列表",
        url: "./proj/abvl/index.html",
        github: null,
        slot: {
            time: 12,
            recommend: 300,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "asak viewer",
        icon: "view_comfy_alt--outlined",
        desc: "To view asak config",
        url: "./proj/asak_viewer/index.html",
        github: null,
        slot: {
            time: 13,
            recommend: -280,
            lang: "en",
            ai: "enhance",
            device: "both"
        }
    },
    {
        name: "长链接生成器",
        icon: "link",
        desc: "(站外)生成你的长链接",
        url: "https://looooooooooooooooooooooooooooooooooooooooooooooooooooooooooog.forthezero.dpdns.org/",
        github: 'https://gist.github.com/for-the-zero/82cbed1e541a44ca84c46b34da1cc67d',
        slot: {
            time: 13.5,
            recommend: 420,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "AI记事本",
        icon: "auto_fix_normal--outlined",
        desc: "AI驱动的简易记事本",
        url: "./proj/aiime/index.html",
        github: null,
        slot: {
            time: 14,
            recommend: 0,
            lang: "zh",
            ai: "based",
            device: "desktop"
        }
    },
    {
        name: "Copic",
        icon: "content_paste_go",
        desc: "按下Ctrl+V保存图片",
        url: "./vibe/copic/index.html",
        github: null,
        slot: {
            time: 16,
            recommend: 820,
            lang: "zh",
            ai: "no",
            device: "desktop"
        }
    },
    {
        name: "FakeNET",
        icon: "social_distance",
        desc: "Can you imagine a network platform where you are the only human?",
        url: "./builts/fakenet/index.html",
        github: 'https://github.com/for-the-zero/FakeNET',
        slot: {
            time: 17,
            recommend: 560,
            lang: "both",
            ai: "based",
            device: "both"
        }
    },
    {
        name: "Fakaptcha",
        icon: "verified_user--outlined",
        desc: "Fake Cloudflare Turnstile Challenge (with a related egg)",
        url: "./vibe/fakaptcha/index.html",
        github: null,
        slot: {
            time: 18,
            recommend: 400,
            lang: "en",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "阅读器",
        icon: "menu_book",
        desc: "使用打字机或RSVP的方式阅读",
        url: "./vibe/reading/index.html",
        github: null,
        slot: {
            time: 19,
            recommend: 480,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "颜色抠图",
        icon: "image--outlined",
        desc: "选择颜色进行色度抠图",
        url: "./vibe/bgrm/index.html",
        github: null,
        slot: {
            time: 20,
            recommend: 580,
            lang: "zh",
            ai: "no",
            device: "desktop"
        }
    },
    {
        name: "QzReader",
        icon: "manage_search",
        desc: "浏览你的QQ空间",
        url: "./builts/qzreader/index.html",
        github: 'https://github.com/for-the-zero/QzReader',
        slot: {
            time: 21,
            recommend: 440,
            lang: "zh",
            ai: "no",
            device: "desktop"
        }
    },
    {
        name: "Kaomera",
        icon: "camera_enhance--outlined",
        desc: "把画面给AI生成颜文字吧",
        url: "./builts/kaomera/index.html",
        github: 'https://github.com/for-the-zero/kaomera',
        slot: {
            time: 22,
            recommend: 700,
            lang: "zh",
            ai: "based",
            device: "both"
        }
    },
    {
        name: "长图拼接",
        icon: "merge",
        desc: "简单的长图拼接工具",
        url: "./vibe/longpic/index.html",
        github: null,
        slot: {
            time: 23,
            recommend: 740,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "Selinkt",
        icon: "add_link",
        desc: "链接选择中转跳转器",
        url: "./builts/selinkt/",
        github: 'https://github.com/for-the-zero/practice.zip/tree/main/web/Selinkt',
        slot: {
            time: 24,
            recommend: 620,
            lang: "en",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "终末地提示词生成器",
        icon: "generating_tokens--outlined",
        desc: "生成最新版本关于工业配方的提示词",
        url: "./proj/efhp/index.html",
        github: null,
        slot: {
            time: 25,
            recommend: 280,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "LessChat",
        icon: "chat_bubble_outline",
        desc: "Simple AI Chat UI",
        url: "./proj/lesschat/index.html",
        github: null,
        slot: {
            time: 26,
            recommend: 660,
            lang: "en",
            ai: "based",
            device: "both"
        }
    },
    {
        name: "Oheya",
        icon: "local_library--outlined",
        desc: "AI知识图谱引擎 / AI Knowledge Graph Engine",
        url: "./builts/oheya/index.html",
        github: 'https://github.com/for-the-zero/Oheya',
        slot: {
            time: 27,
            recommend: 900,
            lang: "both",
            ai: "based",
            device: "both"
        }
    },
    {
        name: "LocalStorage Manager",
        icon: "storage--outlined",
        desc: "Manage localStorage of this site",
        url: "./vibe/localstoragemanager/index.html",
        github: null,
        slot: {
            time: 28,
            recommend: 290,
            lang: "en",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "打击垫模拟器",
        icon: "view_module--outlined",
        desc: "X X XXX",
        url: "./proj/xxxpad/index.html",
        github: null,
        slot: {
            time: 29,
            recommend: 550,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
    {
        name: "ruby标签创建器",
        icon: "insert_comment--outlined",
        desc: "快速生成html ruby标签",
        url: "./proj/ruby/index.html",
        github: null,
        slot: {
            time: 30,
            recommend: 555,
            lang: "zh",
            ai: "no",
            device: "both"
        }
    },
];

const cate_order = {
    lang: [['both','可切换 / Switchable'],['zh','中文'],['en','English']],
    ai: [
        ['based', "基于调用LLM的 / Based on LLM"],
        ['enhance', "作为增强功能 / As an Enhancement Function"],
        ['no', "无 / No"],
    ],
    device: [
        ['both','两者都适用 / Both'],
        ['desktop','桌面 / desktop'],
        ['mobile','移动 / mobile']
    ]
};