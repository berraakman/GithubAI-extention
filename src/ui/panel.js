// UI Layer: Dynamic DOM creation, Button Management, Loading States
window.UIPanel = {
    createFilePanel(callbacks) {
        if (document.getElementById('ai-github-file-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'ai-github-file-panel';
        panel.className = 'ai-panel-container';

        const iconUp = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        const iconDown = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';

        panel.innerHTML = `
      <h3 id="ai-github-file-panel-header">
        <span class="ai-header-title">🤖 GitHub AI Assistant</span>
        <button id="ai-github-file-panel-toggle" class="ai-toggle-btn" title="Minimize/Expand">${iconUp}</button>
      </h3>
      <div id="ai-github-file-panel-content">
        <div class="ai-actions"></div>
        <div id="ai-file-result-view" class="ai-result-view"></div>
      </div>
    `;

        const toggleBtn = panel.querySelector('#ai-github-file-panel-toggle');
        const contentDiv = panel.querySelector('#ai-github-file-panel-content');

        toggleBtn.onclick = (e) => {
            e.stopPropagation(); // Suruklemeyi baslatmasin
            if (contentDiv.style.display === 'none') {
                contentDiv.style.display = 'block';
                toggleBtn.innerHTML = iconUp;
                panel.classList.remove('ai-panel-minimized');
            } else {
                contentDiv.style.display = 'none';
                toggleBtn.innerHTML = iconDown;
                panel.classList.add('ai-panel-minimized');
            }
        };

        // Panel Sürükleme Mantığı (Draggable)
        const header = panel.querySelector('#ai-github-file-panel-header');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        header.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            // Eğer daha önceden transform varsa vs gibi sorunları önlemek için
            // Ekranda sağ taraftan olan offseti baz almak mantıklı:
            const rect = panel.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;

            // fixed pos, right, top default stillerini ignore edip left, top'a gecis yapmak
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            panel.style.transition = 'none'; // Sileriz ki suruklerken lag yapmasın

            // Tiklanilan andaki left, top offsetlerini set et (ziplamayi engeller)
            panel.style.left = rect.left + 'px';
            panel.style.top = rect.top + 'px';

            document.onmousemove = (moveEvent) => {
                if (!isDragging) return;
                moveEvent.preventDefault();

                // Fare koordinatlarindan baslangic ofsetini cikararak yeni kutu pozisyonunu bul
                const newLeft = moveEvent.clientX - initialX;
                const newTop = moveEvent.clientY - initialY;

                panel.style.left = newLeft + 'px';
                panel.style.top = newTop + 'px';
            };

            document.onmouseup = () => {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
                panel.style.transition = 'all 0.3s ease'; // Hover efektleri geri gelsin icin
            };
        };

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
