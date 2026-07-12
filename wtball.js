import { LitElement, html, css } from 'https://cdn.jsdmirror.com/npm/lit@3.1.2/+esm';

const ICON = {
    expand: html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
    home: html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    hide: html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
    collapse: html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
};

const COOKIE_NAME = 'wtball_hidden';
const COOKIE_DAYS = 30;

function projectPath() {
    return location.pathname.replace(/[^/]*$/, '') || '/';
};

function getCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
    return m ? m[1] : null;
};

function setCookie(name, value, days, path) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = name + '=' + value + '; path=' + path + '; max-age=' + maxAge;
};

class WtBall extends LitElement {
    static styles = css`
        :host {
            all: initial;
            -webkit-tap-highlight-color: transparent;
        }
        .wrap {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            align-items: stretch;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            -webkit-tap-highlight-color: transparent;
        }
        .bar {
            width: 20px;
            min-height: 64px;
            border: none;
            cursor: pointer;
            color: #fff;
            background: rgba(20, 20, 30, 0.35);
            backdrop-filter: blur(4px);
            border-radius: 8px 0 0 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
        }
        .bar:hover { background: rgba(20, 20, 30, 0.6); }
        .bar svg {
            width: 15px;
            height: 15px;
            transition: transform 0.3s cubic-bezier(0.3, 0.35, 0, 1.00);
        }
        .bar.open svg { transform: rotate(180deg); }
        .panel {
            width: auto;
            max-width: calc(100vw - 40px);
            box-sizing: border-box;
            margin-right: 5px;
            padding: 13px 14px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            align-items: flex-start;
            color: #eee;
            background: rgba(20, 20, 30, 0.82);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
            transform: translateX(0);
            opacity: 1;
            will-change: transform, opacity;
            transition: transform 0.3s cubic-bezier(0.3, 0.35, 0, 1.00), opacity 0.25s cubic-bezier(0.3, 0.35, 0, 1.00);
            -webkit-tap-highlight-color: transparent;
        }
        .panel.closed {
            transform: translateX(115%);
            opacity: 0;
            pointer-events: none;
        }
        .desc {
            margin: 0;
            font-size: 14px;
            line-height: 1.55;
            color: #e6e8ef;
            white-space: normal;
            overflow-wrap: break-word;
        }
        .icon-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            color: #fff;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.08);
            transition: background 0.2s;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
        }
        .icon-btn:hover { background: rgba(255, 255, 255, 0.18); }
        .icon-btn svg { width: 16px; height: 16px; }
        .btn-row {
            display: flex;
            gap: 8px;
            align-self: center;
        }
    `;

    static properties = {
        expanded: { type: Boolean },
        hidden: { type: Boolean }
    };

    constructor() {
        super();
        this.expanded = false;
        this.hidden = false;
        this.isZh = (navigator.languages[0] || navigator.language || '').toLowerCase().startsWith('zh');
        this.t = this.isZh
            ? { desc: '本项目是WebTooys的一部分', home: 'WebTooys 首页', hide: '隐藏此条', collapse: '收起面板' }
            : { desc: 'This project is part of WebTooys', home: 'WebTooys Home', hide: 'Hide this bar', collapse: 'Collapse panel' };
        this.homeUrl = location.origin + '/';
    }

    connectedCallback() {
        super.connectedCallback();
        if (getCookie(COOKIE_NAME) === '1') this.hidden = true;
    }

    toggle() {
        this.expanded = !this.expanded;
    }

    collapse() {
        this.expanded = false;
    }

    hideBar() {
        setCookie(COOKIE_NAME, '1', COOKIE_DAYS, projectPath());
        this.hidden = true;
    }

    render() {
        if (this.hidden) return html``;
        return html`
            <div class="wrap">
                <div class="panel ${this.expanded ? 'open' : 'closed'}">
                    <p class="desc">${this.t.desc}</p>
                    <div class="btn-row">
                        <a class="icon-btn" href="${this.homeUrl}" target="_blank" rel="noopener" title="${this.t.home}" aria-label="${this.t.home}">${ICON.home}</a>
                        <button class="icon-btn" @click="${this.hideBar}" title="${this.t.hide}" aria-label="${this.t.hide}">${ICON.hide}</button>
                    </div>
                </div>
                <button class="bar ${this.expanded ? 'open' : ''}" @click="${this.toggle}" aria-label="toggle panel">${ICON.expand}</button>
            </div>
        `;
    }
};

customElements.define('wt-ball', WtBall);

if (!document.querySelector('wt-ball') && document.body) {
    document.body.appendChild(document.createElement('wt-ball'));
};
