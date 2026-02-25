// Prompt Layer: All system and user prompts logic
window.AIPrompts = {
    getPrompt(type, payload) {
        const formatInstructionCheck = "STRICTLY output ONLY in the specified format without extra prefixes or markdown tags.";

        switch (type) {
            case 'explain':
                return `Explain the following code briefly. Do not write unnecessarily long analysis.\n\nCode:\n${payload}`;

            case 'quality':
                return `Analyze the code quality. ${formatInstructionCheck}
        
Overall Score: [0-100]
Readability: [Low / Medium / High]
Maintainability: [Low / Medium / High]
Main Issue: [brief explanation]

Code:
${payload}`;

            case 'security':
                return `Analyze the given code for security. Select ONLY the most critical risk. ${formatInstructionCheck}

Risk Level: [Low / Medium / High]
Main Risk: [brief explanation]

Code:
${payload}`;

            case 'refactor':
                return `Suggest 2-3 refactoring tips for this code. Provide short code snippets if needed, but DO NOT rewrite the entire file.

Code:
${payload}`;

            case 'repo':
                return `Analyze these repository metrics and provide a summary. STRICT LIMIT 150-200 words max. ${formatInstructionCheck}

Project Type: [Project Type]

Overall Quality: [0-100]

Strength:
- [point 1]
- [point 2]

Weakness:
- [point 1]
- [point 2]

Security Risk: [Low / Medium / High]

Metrics Extracted:
${payload}`;

            default:
                throw new Error("Unknown prompt type");
        }
    }
};
