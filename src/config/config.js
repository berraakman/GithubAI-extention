// Config Layer: Environment, Tokens, Provider Options
window.AIConfig = {
  provider: 'ollama_local', // Options: 'ollama_local', 'ollama_cloud', 'openai', 'oss_cloud'
  endpoints: {
    ollama_local: 'http://localhost:11434/api/generate',
    ollama_cloud: 'https://your-cloud-ollama.example.com/api/generate',
    openai: 'https://api.openai.com/v1/chat/completions',
    oss_cloud: 'https://api.openrouter.ai/api/v1/chat/completions'
  },
  keys: {
    openai: '',
    oss_cloud: ''
  },
  models: {
    ollama_local: 'gpt-oss:120b-cloud', // Kullanıcının Ollama'da çalışan modeli
    ollama_cloud: 'llama3',
    openai: 'gpt-3.5-turbo',
    oss_cloud: 'lizpreciatior/lzlv-70b-fp16-hf'
  },
  limits: {
    maxCharsPayload: 15000,
    requestTimeoutMs: 300000 // 5 dakika (Özellikle büyük/local modellerin ilk yüklenmesi uzun sürebilir)
  }
};
