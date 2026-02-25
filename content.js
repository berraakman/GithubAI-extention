// Main Extension Injector / Orchestrator
(function () {
    const config = window.AIConfig;
    const dom = window.DOMExtractor;
    const prompts = window.AIPrompts;
    const ui = window.UIPanel;

    function callLLM(promptString, targetId) {
        ui.showLoading(targetId);

        try {
            chrome.runtime.sendMessage({
                action: 'call_llm',
                payload: { prompt: promptString, config: config }
            }, (response) => {
                if (chrome.runtime.lastError) {
                    ui.showError(targetId, "Extension connection Error: " + chrome.runtime.lastError.message);
                    return;
                }
                if (response && response.success) {
                    ui.showResult(targetId, response.data);
                } else {
                    ui.showError(targetId, response ? response.error : 'Unknown LLM Error');
                }
            });
        } catch (err) {
            ui.showError(targetId, err.message);
        }
    }

    function handleFileAction(actionName) {
        const code = dom.getFileContent();
        if (!code || code.length < 5) {
            ui.showError('ai-file-result-view', 'Could not read file content from page.');
            return;
        }

        // Token limit handler (truncate content)
        const maxLen = config.limits.maxCharsPayload;
        const safeCode = code.length > maxLen ? code.substring(0, maxLen) + '\n...[TRUNCATED BY EXTENSION]' : code;

        const promptString = prompts.getPrompt(actionName, safeCode);
        callLLM(promptString, 'ai-file-result-view');
    }

    function handleRepoAction() {
        const metricsMap = dom.getRepoMetrics();
        const metricsStr = JSON.stringify(metricsMap, null, 2);

        const promptString = prompts.getPrompt('repo', metricsStr);
        callLLM(promptString, 'ai-repo-result-view');
    }

    function initApp() {
        // Check if DOM is ready and what mode we are in
        const mode = dom.getPageType();

        if (mode === 'file') {
            ui.createFilePanel({ onAction: handleFileAction });
        } else if (mode === 'repo') {
            ui.createRepoButton({ onRepoAnalyze: handleRepoAction });
        }
    }

    // Handle SPA (Single Page Application) navigations in GitHub
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Delay to ensure GitHub DOM finishes building
            setTimeout(initApp, 1500);
        }
    }).observe(document, { subtree: true, childList: true });

    // Initial load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initApp, 1000));
    } else {
        setTimeout(initApp, 1000);
    }
})();
