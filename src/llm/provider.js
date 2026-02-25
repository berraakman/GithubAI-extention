// LLM Service Layer (Async Module running in Ext Background)
export const LLMProvider = {
    async generate(payload) {
        const { prompt, config } = payload;
        let provider = config.provider;

        try {
            console.log(`[GithubAI] Attempting LLM call via ${provider}...`);

            switch (provider) {
                case 'ollama_local':
                    return await this.callOllama(config.endpoints.ollama_local, config.models.ollama_local, prompt, config.limits.requestTimeoutMs);
                case 'ollama_cloud':
                    return await this.callOllama(config.endpoints.ollama_cloud, config.models.ollama_cloud, prompt, config.limits.requestTimeoutMs);
                case 'openai':
                    return await this.callOpenAI(config.endpoints.openai, config.keys.openai, config.models.openai, prompt, config.limits.requestTimeoutMs);
                case 'oss_cloud':
                    return await this.callOpenAI(config.endpoints.oss_cloud, config.keys.oss_cloud, config.models.oss_cloud, prompt, config.limits.requestTimeoutMs);
                default:
                    throw new Error("Invalid Provider Configuration.");
            }
        } catch (e) {
            console.warn(`[GithubAI] Call failed for provider ${provider}:`, e.message);

            // Fallback Strategy: If local Ollama fails but OpenAI key is configured, fallback automatically
            if (provider !== 'openai' && config.keys.openai && config.keys.openai.startsWith('sk-')) {
                console.log(`[GithubAI] Triggering Fallback to OpenAI...`);
                return await this.callOpenAI(config.endpoints.openai, config.keys.openai, config.models.openai, prompt, config.limits.requestTimeoutMs);
            }

            throw new Error(`Model Error (${provider}): ${e.message}`);
        }
    },

    async callOllama(endpoint, model, prompt, timeoutMs) {
        const controller = new AbortController();
        const timerId = setTimeout(() => controller.abort(new Error("Timeout: Modelin yanıt vermesi " + (timeoutMs / 1000) + " saniyeyi aştı.")), timeoutMs);

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false
            }),
            signal: controller.signal
        });

        clearTimeout(timerId);

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        return data.response.trim();
    },

    async callOpenAI(endpoint, key, model, prompt, timeoutMs) {
        if (!key) throw new Error("OpenAI Fallback failed: API Key missing.");
        const controller = new AbortController();
        const timerId = setTimeout(() => controller.abort(new Error("Timeout: Modelin yanıt vermesi " + (timeoutMs / 1000) + " saniyeyi aştı.")), timeoutMs);

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: model, // GPT-3.5-turbo or alternative
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3
            }),
            signal: controller.signal
        });

        clearTimeout(timerId);

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim();
        }
        throw new Error("Invalid OpenAI Response Format");
    }
};
