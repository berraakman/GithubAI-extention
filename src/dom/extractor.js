// DOM Extraction Layer
window.DOMExtractor = {
    getPageType() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length === 2) return 'repo';
        if (pathParts.length > 3 && pathParts[2] === 'blob') return 'file';
        if (pathParts.length > 3 && pathParts[2] === 'tree') return 'repo';

        // GitHub new UI generic checks
        if (document.querySelector('table[data-hpc]') || document.querySelector('[data-testid="react-file-lines"]')) return 'file';
        if (document.querySelector('#repository-container-header')) return 'repo';

        return 'unknown';
    },

    getFileContent() {
        const lines = document.querySelectorAll('.react-file-line, .js-file-line, [data-testid="react-file-line"]');
        if (lines.length > 0) {
            return Array.from(lines).map(line => line.innerText).join('\n');
        }
        const textArea = document.querySelector('textarea#read-only-cursor-text-area');
        if (textArea) return textArea.value;

        return null;
    },

    getRepoMetrics() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const repoName = pathParts.length >= 2 ? `${pathParts[0]}/${pathParts[1]}` : 'Unknown';

        // Extracting files from the front page tree view
        let files = [];
        const fileRows = document.querySelectorAll('.react-directory-row');

        if (fileRows.length > 0) {
            fileRows.forEach((row, index) => {
                if (index >= 10) return; // Strict max 10 files limitation
                const nameNode = row.querySelector('.react-directory-truncate a');
                if (nameNode) files.push(nameNode.innerText);
            });
        } else {
            // Fallback old UI
            const rows = document.querySelectorAll('.js-navigation-item .css-truncate-target');
            rows.forEach((r, i) => { if (i < 10) files.push(r.innerText); });
        }

        return {
            repository: repoName,
            fileSampleCount: files.length,
            sampleFilesExtracted: files.join(', '),
            description: "Metrics extracted dynamically from DOM. Not the full repo."
        };
    }
};
