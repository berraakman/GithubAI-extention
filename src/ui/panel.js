// UI Layer: Dynamic DOM creation, Button Management, Loading States
window.UIPanel = {
    createFilePanel(callbacks) {
        if (document.getElementById('ai-github-file-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'ai-github-file-panel';
        panel.className = 'ai-panel-container';

        panel.innerHTML = `
      <h3>🤖 GitHub AI Assistant</h3>
      <div class="ai-actions"></div>
      <div id="ai-file-result-view" class="ai-result-view"></div>
    `;

        const actionsContainer = panel.querySelector('.ai-actions');

        const buttons = [
            { id: 'btn-explain', text: '🔍 Explain Code', action: 'explain' },
            { id: 'btn-quality', text: '📊 Code Quality Score', action: 'quality' },
            { id: 'btn-security', text: '🛡 Security Check', action: 'security' },
            { id: 'btn-refactor', text: '🔧 Refactor Suggestion', action: 'refactor' }
        ];

        buttons.forEach(b => {
            const btn = document.createElement('button');
            btn.innerText = b.text;
            btn.className = 'ai-action-btn';
            btn.onclick = () => callbacks.onAction(b.action);
            actionsContainer.appendChild(btn);
        });

        document.body.appendChild(panel);
    },

    createRepoButton(callbacks) {
        if (document.getElementById('ai-github-repo-btn')) return;

        // Try finding main content area headers
        const targetContainer = document.querySelector('.Layout-main') || document.querySelector('#js-repo-pjax-container') || document.body;
        if (!targetContainer) return;

        const panel = document.createElement('div');
        panel.className = 'ai-repo-panel';
        panel.innerHTML = `
      <button id="ai-github-repo-btn" class="ai-action-btn ai-btn-primary">🔎 Analyze Repository</button>
      <div id="ai-repo-result-view" class="ai-result-view"></div>
    `;

        panel.querySelector('#ai-github-repo-btn').onclick = () => callbacks.onRepoAnalyze();

        targetContainer.prepend(panel);
    },

    showLoading(targetId) {
        const el = document.getElementById(targetId);
        if (el) el.innerHTML = '<div class="ai-loader">Processing... Please wait.</div>';
    },

    showResult(targetId, result) {
        const el = document.getElementById(targetId);
        if (el) {
            if (typeof marked !== 'undefined') {
                el.innerHTML = `<div class="ai-result-text ai-markdown-body">${marked.parse(result)}</div>`;
            } else {
                el.innerHTML = `<pre class="ai-result-text">${this.escapeHtml(result)}</pre>`;
            }
        }
    },

    showError(targetId, error) {
        const el = document.getElementById(targetId);
        if (el) {
            el.innerHTML = `<div class="ai-error"><strong>Error:</strong> ${this.escapeHtml(error)}</div>`;
        }
    },

    escapeHtml(unsafe) {
        return (unsafe || '').toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};
