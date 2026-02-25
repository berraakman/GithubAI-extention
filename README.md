# 🤖 GitHub AI Code Assistant

A Chrome extension that integrates a powerful AI assistant directly into GitHub's interface. Seamlessly analyze your repositories and understand code without ever leaving your browser. 

Designed with a modular architecture in **Vanilla JS** (Manifest V3) and offering a clean, native GitHub look-and-feel.

## 🌟 Features

### 1. File Mode (Code Analysis)
When viewing any code file on GitHub, a draggable, lightweight AI panel appears on the right. You get instant access to four key actions:
- **🔍 Explain Code**: Instantly get a brief summary of what the code does.
- **📊 Code Quality Score**: Receive a score out of 100 with readability and maintainability assessments.
- **🛡 Security Check**: Quickly identify critical security risks in the file.
- **🔧 Refactor Suggestion**: Get 2-3 actionable tips to improve the code.

### 2. Repo Mode (Repository Analysis)
On the homepage of any repository, use the **🔎 Analyze Repository** button to get a quick overview:
- Project type & overall quality score.
- Key strengths and weaknesses extracted dynamically from the file tree.
- A fast summary based on a dynamic sampling of repository files, keeping processing light and fast.

## 🚀 Model Integrations
The extension is built to be flexible and supports multiple AI providers:
- **Ollama Local**: Run the extension entirely locally on your machine with zero latency (e.g. `llama3` or `gpt-oss:120b-cloud`).
- **Ollama Cloud / Open OSS**: Use cloud-hosted open-source models via platforms like OpenRouter.
- **OpenAI (Fallback)**: Seamlessly fall back to OpenAI API if your local server is unreachable.

## 🛠️ Installation

1. Clone or download this repository to your local machine:
   ```bash
   git clone https://github.com/berraakman/GithubAI-extention.git
   ```
2. Open Chrome (or any Chromium-based browser like Brave/Edge) and go to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the folder containing this extension.
5. You're ready! Go to GitHub and look for the new buttons.

## 🔧 Configuration
You can customize the model limits, keys, and providers by editing the `src/config/config.js` file:
- Select your default `provider` (`ollama_local`, `ollama_cloud`, `openai`, `oss_cloud`).
- Set your **OpenAI** or **OpenRouter API Key** if needed.
- Define what local Ollama model to invoke (e.g. `gpt-oss:120b-cloud`).

> **Note for Local Ollama**: If you are using `ollama_local`, be sure to start your Ollama server with CORS permissions enabled:
> \`\`\`bash
> OLLAMA_ORIGINS="*" ollama serve
> \`\`\`

## 🎨 UI/UX Highlights
- **Draggable Panel**: Move the File Mode panel anywhere on your screen.
- **Minimize & Expand**: Click the chevron (\`^\` / \`v\`) to shrink the panel out of your way when reading.
- **Markdown Rendering**: Beautiful rendering of AI answers equipped with inline code blocks, bold headings, and lists.
- **Hover & Click Reactions**: Delightful micro-animations and color changes perfectly blended into GitHub's native style.

## 📄 License
MIT License
