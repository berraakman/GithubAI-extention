// Background Worker
import { LLMProvider } from './llm/provider.js';

console.log("[GithubAI] Background Service Worker Initialized");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'call_llm') {

        LLMProvider.generate(request.payload)
            .then(result => {
                sendResponse({ success: true, data: result });
            })
            .catch(err => {
                console.error("[GithubAI] LLM Exception:", err);
                sendResponse({ success: false, error: err.message });
            });

        // Return true ensures the message channel stays open for async resolution
        return true;
    }
});
