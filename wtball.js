import { LitElement, html, css } from 'https://cdn.jsdmirror.com/npm/lit@3.1.2/+esm';

const ICON = {
    home: html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    hide: html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
    collapse: html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`
};

const COOKIE_NAME = 'wtball_hidden';
const COOKIE_DAYS = 30;
const PEEK = 20;
const DRAG_THRESHOLD = 6;

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
        .panel {
            width: auto;
            max-width: calc(100vw - 40px);
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: stretch;
            color: #eee;
            background: rgba(20, 20, 30, 0.75);
            backdrop-filter: blur(8px);
            border-radius: 16px 0 0 16px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
            transform: translateX(0);
            will-change: transform;
            transition: transform 0.3s cubic-bezier(0.3, 0.35, 0, 1.00), background 0.3s;
            -webkit-tap-highlight-color: transparent;
        }
        .panel.closed {
            transform: translateX(calc(100% - 20px));
            background: rgba(20, 20, 30, 0.45);
        }
        .grip {
            width: 20px;
            flex: none;
            border: none;
            padding: 0;
            background: transparent;
            cursor: pointer;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: none;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
        }
        .grip i {
            width: 2px;
            height: 16px;
            border-radius: 2px;
            background: rgba(255, 255, 255, 0.15);
            transition: background 0.2s;
        }
        .panel.open .grip i { background: rgba(255, 255, 255, 0.4); }
        .grip:hover i { background: rgba(255, 255, 255, 0.45); }
        .body {
            display: flex;
            flex-direction: column;
            gap: 14px;
            align-items: flex-start;
            padding: 13px 14px;
            min-width: 0;
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

    gripDown(e) {
        if (!e.isPrimary) return;
        const panel = this.renderRoot.querySelector('.panel');
        if (!panel) return;
        this._panel = panel;
        this._w = panel.offsetWidth;
        this._base = this.expanded ? 0 : this._w - PEEK;
        this._x0 = e.clientX;
        this._t = this._base;
        this._moved = false;
        this._skipClick = false;
        panel.style.transition = 'none';
        e.currentTarget.setPointerCapture(e.pointerId);
    }

    gripMove(e) {
        if (this._w == null) return;
        const dx = e.clientX - this._x0;
        if (!this._moved && Math.abs(dx) < DRAG_THRESHOLD) return;
        this._moved = true;
        this._t = Math.min(this._w - PEEK, Math.max(0, this._base + dx));
        this._panel.style.transform = 'translateX(' + this._t + 'px)';
    }

    gripUp() {
        if (this._w == null) return;
        if (this._moved) {
            this.expanded = this._t < (this._w - PEEK) / 2;
            this._skipClick = true;
        }
        this.gripReset();
    }

    gripCancel() {
        if (this._w == null) return;
        this.gripReset();
    }

    gripReset() {
        this._panel.style.transition = '';
        this._panel.style.transform = '';
        this._w = null;
    }

    gripClick() {
        if (this._skipClick) {
            this._skipClick = false;
            return;
        }
        this.toggle();
    }

    render() {
        if (this.hidden) return html``;
        return html`
            <div class="wrap">
                <div class="panel ${this.expanded ? 'open' : 'closed'}">
                    <button class="grip" type="button"
                        @pointerdown="${this.gripDown}" @pointermove="${this.gripMove}"
                        @pointerup="${this.gripUp}" @pointercancel="${this.gripCancel}"
                        @click="${this.gripClick}"
                        aria-label="toggle panel" aria-expanded="${this.expanded}"><i></i></button>
                    <div class="body">
                        <p class="desc">${this.t.desc}</p>
                        <div class="btn-row">
                            <a class="icon-btn" href="${this.homeUrl}" target="_blank" rel="noopener" title="${this.t.home}" aria-label="${this.t.home}">${ICON.home}</a>
                            <button class="icon-btn" @click="${this.hideBar}" title="${this.t.hide}" aria-label="${this.t.hide}">${ICON.hide}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

customElements.define('wt-ball', WtBall);

if (!document.querySelector('wt-ball') && document.body) {
    document.body.appendChild(document.createElement('wt-ball'));
};
