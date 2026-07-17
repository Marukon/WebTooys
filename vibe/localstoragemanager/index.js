const App = {
    editingKey: null,
    jsonEditor: null,

    init() {
        this.initEditor();
        this.bindEvents();
        this.render();
    },

    initEditor() {
        const container = document.getElementById('jsoneditor-container');
        this.jsonEditor = new JSONEditor(container, {
            mode: 'code',
            modes: ['code', 'tree', 'text'],
            onChangeText: () => this.updateModeBadge(),
            onValidationError: () => {},
        });
    },

    bindEvents() {
        document.getElementById('btn-add').addEventListener('click', () => this.openEditor());
        document.getElementById('btn-export').addEventListener('click', () => this.exportData());
        document.getElementById('btn-import').addEventListener('click', () => document.getElementById('file-input').click());
        document.getElementById('file-input').addEventListener('change', (e) => this.importData(e));
        document.getElementById('btn-clear').addEventListener('click', () => this.clearAll());
        document.getElementById('search-input').addEventListener('input', () => this.render());

        document.getElementById('editor-save').addEventListener('click', () => this.saveEntry());
        document.getElementById('editor-cancel').addEventListener('click', () => this.closeEditor());
        document.getElementById('editor-close').addEventListener('click', () => this.closeEditor());
        document.getElementById('editor-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeEditor();
        });
        document.getElementById('editor-format').addEventListener('click', () => this.formatJson());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeEditor();
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (!document.getElementById('editor-overlay').classList.contains('hidden')) {
                    e.preventDefault();
                    this.saveEntry();
                }
            }
        });
    },

    getEntries() {
        const entries = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            entries.push({ key, value: localStorage.getItem(key) });
        }
        entries.sort((a, b) => a.key.localeCompare(b.key));
        return entries;
    },

    render() {
        const tbody = document.getElementById('table-body');
        const query = document.getElementById('search-input').value.trim().toLowerCase();
        let entries = this.getEntries();

        if (query) {
            entries = entries.filter(e => e.key.toLowerCase().includes(query));
        }

        document.getElementById('stats').textContent = `${entries.length} items`;

        if (entries.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="empty">${query ? 'No matching keys' : 'No data yet — click New to add an entry'}</td></tr>`;
            return;
        }

        tbody.innerHTML = entries.map(e => {
            const size = new Blob([e.value]).size;
            const sizeLabel = size < 1024 ? `${size} B` : `${(size / 1024).toFixed(1)} KB`;
            const displayValue = e.value.length > 140 ? e.value.slice(0, 140) + '...' : e.value;
            return `<tr>
                <td class="col-key" title="${this.esc(e.key)}">${this.esc(e.key)}</td>
                <td class="col-val" title="${this.esc(e.value)}">${this.esc(displayValue)}</td>
                <td class="col-size">${sizeLabel}</td>
                <td class="col-actions">
                    <button class="action-btn" data-action="edit" data-key="${this.esc(e.key)}">Edit</button>
                    <button class="action-btn danger" data-action="delete" data-key="${this.esc(e.key)}">Delete</button>
                </td>
            </tr>`;
        }).join('');

        tbody.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => this.openEditor(btn.dataset.key));
        });
        tbody.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', () => this.deleteEntry(btn.dataset.key));
        });
    },

    openEditor(key) {
        this.editingKey = key || null;
        const raw = key ? localStorage.getItem(key) : '';

        document.getElementById('editor-title').textContent = key ? 'Edit Entry' : 'New Entry';
        document.getElementById('editor-key').value = key || '';
        document.getElementById('editor-key').readOnly = !!key;

        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                this.jsonEditor.set(parsed);
            } catch {
                this.jsonEditor.setText(raw);
            }
        } else {
            this.jsonEditor.setText('');
        }

        this.updateModeBadge();
        document.getElementById('editor-overlay').classList.remove('hidden');
        document.getElementById('editor-key').focus();
    },

    closeEditor() {
        if (document.getElementById('editor-overlay').classList.contains('hidden')) return;
        document.getElementById('editor-overlay').classList.add('hidden');
        this.editingKey = null;
    },

    saveEntry() {
        const key = document.getElementById('editor-key').value.trim();
        if (!key) {
            alert('Please enter a key name');
            document.getElementById('editor-key').focus();
            return;
        }

        try {
            const value = this.jsonEditor.get();
            localStorage.setItem(key, JSON.stringify(value, null, 2));
        } catch {
            const text = this.jsonEditor.getText();
            if (!text && !this.editingKey) {
                alert('Please enter a value');
                return;
            }
            localStorage.setItem(key, text);
        }

        this.closeEditor();
        this.render();
    },

    deleteEntry(key) {
        if (!confirm(`Delete "${key}"?`)) return;
        localStorage.removeItem(key);
        this.render();
    },

    clearAll() {
        if (localStorage.length === 0) return;
        if (!confirm(`Clear all ${localStorage.length} items? This cannot be undone!`)) return;
        localStorage.clear();
        this.render();
    },

    formatJson() {
        try {
            const val = this.jsonEditor.get();
            this.jsonEditor.set(val);
        } catch {
            // not valid JSON, ignore
        }
    },

    updateModeBadge() {
        const badge = document.getElementById('editor-mode-badge');
        try {
            this.jsonEditor.get();
            badge.textContent = 'JSON';
            badge.style.background = 'rgba(34, 197, 94, 0.1)';
            badge.style.color = '#22C55E';
        } catch {
            badge.textContent = 'TEXT';
            badge.style.background = 'rgba(148, 163, 184, 0.15)';
            badge.style.color = '#94A3B8';
        }
    },

    exportData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const val = localStorage.getItem(key);
            try {
                data[key] = JSON.parse(val);
            } catch {
                data[key] = val;
            }
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `localstorage-${window.location.hostname}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = '';

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                    throw new Error('Root data must be an object');
                }

                const count = Object.keys(data).length;
                if (!confirm(`Import ${count} items? Existing keys will be overwritten. Continue?`)) return;

                for (const [key, value] of Object.entries(data)) {
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value, null, 2));
                }

                this.render();
                alert(`Successfully imported ${count} items`);
            } catch (err) {
                alert('Import failed: ' + err.message);
            }
        };
        reader.readAsText(file);
    },

    esc(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());
