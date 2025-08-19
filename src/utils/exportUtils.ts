// HTML conversion function
export const convertMarkdownToHTML = (markdownText: string): string => {
	// Simple markdown-to-HTML converter
	let html = markdownText
		// Headings
		.replace(/^### (.*$)/gim, "<h3>$1</h3>")
		.replace(/^## (.*$)/gim, "<h2>$1</h2>")
		.replace(/^# (.*$)/gim, "<h1>$1</h1>")
		// Bold and italic
		.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
		.replace(/\*(.*?)\*/gim, "<em>$1</em>")
		// Code blocks
		.replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
		.replace(/`(.*?)`/gim, "<code>$1</code>")
		// Links
		.replace(
			/\[([^\]]+)\]\(([^)]+)\)/gim,
			'<a href="$2" target="_blank">$1</a>'
		)
		// Lists
		.replace(/^\* (.*$)/gim, "<li>$1</li>")
		.replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
		// Horizontal rule
		.replace(/^---$/gim, "<hr>")
		// Blockquote
		.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
		// Line breaks
		.replace(/\n/gim, "<br>");

	// Add list wrappers
	html = html.replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>");

	// Advanced conversion for tables
	const lines = html.split("<br>");
	const processedLines: string[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i].trim();

		// Check for table start
		if (line.match(/^\|.*\|$/)) {
			const tableRows: string[] = [];
			let isFirstRow = true;

			// Collect table rows
			while (i < lines.length && lines[i].trim().match(/^\|.*\|$/)) {
				const currentLine = lines[i].trim();

				// Skip separator line (|---|---|)
				if (!currentLine.match(/^\|[\s\-|:]+\|$/)) {
					const cells = currentLine
						.replace(/^\|/, "")
						.replace(/\|$/, "")
						.split("|")
						.map((cell: string) => cell.trim());
					const cellTag = isFirstRow ? "th" : "td";
					const cellsHtml = cells
						.map((cell: string) => `<${cellTag}>${cell}</${cellTag}>`)
						.join("");
					tableRows.push(`<tr>${cellsHtml}</tr>`);
					isFirstRow = false;
				}
				i++;
			}

			// Create table
			if (tableRows.length > 0) {
				const hasHeader = tableRows[0].includes("<th>");
				if (hasHeader) {
					const headerRow = tableRows[0];
					const bodyRows = tableRows.slice(1);
					processedLines.push(
						`<table><thead>${headerRow}</thead><tbody>${bodyRows.join(
							""
						)}</tbody></table>`
					);
				} else {
					processedLines.push(
						`<table><tbody>${tableRows.join("")}</tbody></table>`
					);
				}
			}
			i--; // Because i++ will happen at the end of the loop
		} else {
			processedLines.push(line);
		}
		i++;
	}

	html = processedLines.join("<br>");

	return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/abcjs@6.2.3/dist/abcjs-basic-min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
        }
        h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 8px; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 8px; }
        h3 { font-size: 1.25em; }
        p { margin-bottom: 16px; }
        ul, ol { margin-bottom: 16px; padding-left: 30px; }
        li { margin-bottom: 4px; }
        pre {
            background: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 16px 0;
        }
        code {
            background: #f6f8fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            margin: 16px 0;
            padding-left: 16px;
            color: #6a737d;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }
        th, td {
            border: 1px solid #dfe2e5;
            padding: 8px 12px;
            text-align: left;
        }
        th {
            background-color: #f6f8fa;
            font-weight: 600;
        }
        hr {
            border: none;
            border-top: 1px solid #eee;
            margin: 24px 0;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .math-block {
            margin: 20px 0;
            text-align: center;
        }
        .math-inline {
            display: inline;
        }
        .mermaid-diagram {
            margin: 20px 0;
            text-align: center;
        }
        .abc-music {
            margin: 20px 0;
            text-align: center;
        }
    </style>
</head>
<body>
    ${html}
    <script>
        // KaTeX render
        document.addEventListener("DOMContentLoaded", function() {
            if (typeof renderMathInElement !== 'undefined') {
                renderMathInElement(document.body, {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "$", right: "$", display: false}
                    ]
                });
            }
            
            // Mermaid render
            if (typeof mermaid !== 'undefined') {
                mermaid.initialize({ startOnLoad: true });
            }
            
            // ABC.js render
            if (typeof ABCJS !== 'undefined') {
                const abcElements = document.querySelectorAll('code[class*="language-abc"]');
                abcElements.forEach(element => {
                    const abcText = element.textContent;
                    const renderDiv = document.createElement('div');
                    renderDiv.className = 'abc-music';
                    element.parentNode.replaceWith(renderDiv);
                    ABCJS.renderAbc(renderDiv, abcText);
                });
            }
        });
    </script>
</body>
</html>`;
};

// Export functions
export const exportAsMarkdown = (
	markdown: string,
	setShowExportMenu: (show: boolean) => void
) => {
	const blob = new Blob([markdown], { type: "text/markdown" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "document.md";
	a.click();
	URL.revokeObjectURL(url);
	setShowExportMenu(false);
};

export const exportAsHTML = (
	markdown: string,
	setShowExportMenu: (show: boolean) => void
) => {
	const htmlContent = convertMarkdownToHTML(markdown);
	const blob = new Blob([htmlContent], { type: "text/html" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "document.html";
	a.click();
	URL.revokeObjectURL(url);
	setShowExportMenu(false);
};

export const exportAsPDF = (
	markdown: string,
	setShowExportMenu: (show: boolean) => void
) => {
	const printWindow = window.open("", "_blank");
	if (printWindow) {
		const htmlContent = convertMarkdownToHTML(markdown);
		printWindow.document.write(htmlContent);
		printWindow.document.close();
		printWindow.focus();
		setTimeout(() => {
			printWindow.print();
		}, 1000);
	}
	setShowExportMenu(false);
};

// File import
export const importMarkdownFile = (
	handleMarkdownChange: (content: string) => void
) => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".md,.txt";
	input.onchange = (e) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const content = e.target?.result as string;
				handleMarkdownChange(content);
			};
			reader.readAsText(file);
		}
	};
	input.click();
};
