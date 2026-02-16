// HTML conversion function
export const convertMarkdownToHTML = (markdownText: string): string => {
	// Simple markdown-to-HTML converter
	let html = markdownText
		// Headings - H1 to H6
		.replace(/^###### (.*$)/gim, "<h6>$1</h6>")
		.replace(/^##### (.*$)/gim, "<h5>$1</h5>")
		.replace(/^#### (.*$)/gim, "<h4>$1</h4>")
		.replace(/^### (.*$)/gim, "<h3>$1</h3>")
		.replace(/^## (.*$)/gim, "<h2>$1</h2>")
		.replace(/^# (.*$)/gim, "<h1>$1</h1>")
		// Bold and italic
		.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
		.replace(/\*(.*?)\*/gim, "<em>$1</em>")
		// Code blocks with language detection
		.replace(/```(\w+)?\n?([\s\S]*?)```/gim, (_, language, code) => {
			const lang = language || "text";
			return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
		})
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
		// Line breaks - only convert double line breaks to paragraph breaks
		.replace(/\n\n/gim, "</p><p>");

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

	html = processedLines.join("\n");

	// Wrap content in paragraphs and clean up
	html = `<p>${html}</p>`;

	// Clean up empty paragraphs and fix structure
	html = html
		.replace(/<p><\/p>/gim, "")
		.replace(/<p>(<h[1-6]>)/gim, "$1")
		.replace(/(<\/h[1-6]>)<\/p>/gim, "$1")
		.replace(/<p>(<ul>)/gim, "$1")
		.replace(/(<\/ul>)<\/p>/gim, "$1")
		.replace(/<p>(<ol>)/gim, "$1")
		.replace(/(<\/ol>)<\/p>/gim, "$1")
		.replace(/<p>(<pre>)/gim, "$1")
		.replace(/(<\/pre>)<\/p>/gim, "$1")
		.replace(/<p>(<blockquote>)/gim, "$1")
		.replace(/(<\/blockquote>)<\/p>/gim, "$1")
		.replace(/<p>(<table>)/gim, "$1")
		.replace(/(<\/table>)<\/p>/gim, "$1")
		.replace(/<p>(<hr>)/gim, "$1")
		.replace(/(<hr>)<\/p>/gim, "$1");

	return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/abcjs@6.2.3/dist/abcjs-basic-min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
            line-height: 1.7;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #ffffff;
            color: #1f2937;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            font-size: 16px;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 32px;
            margin-bottom: 16px;
            font-weight: 700;
            color: #111827;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            letter-spacing: -0.025em;
        }
        h1 { 
            font-size: 2.5em; 
            border-bottom: 3px solid #3b82f6; 
            color: #111827; 
            padding-bottom: 12px;
            margin-top: 0;
        }
        h2 { 
            font-size: 2em; 
            border-bottom: 2px solid #e5e7eb; 
            color: #374151; 
            padding-bottom: 8px;
        }
        h3 { 
            font-size: 1.5em; 
            color: #4b5563; 
            margin-top: 24px;
        }
        h4 { 
            font-size: 1.25em; 
            color: #6b7280; 
            margin-top: 20px;
        }
        h5 { 
            font-size: 1.125em; 
            color: #6b7280; 
            margin-top: 16px;
        }
        h6 { 
            font-size: 1em; 
            color: #9ca3af; 
            margin-top: 16px;
        }
        p { 
            color: #374151;
            margin-bottom: 16px;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            line-height: 1.8;
        }
        ul, ol { 
            margin-bottom: 20px;     
            padding-left: 24px; 
            color: #374151;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
        }
        li { 
            margin-bottom: 8px; 
            color: #374151;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            line-height: 1.6;
        }
        ul li {
            list-style-type: disc;
        }
        ol li {
            list-style-type: decimal;
        }
        pre {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            overflow-x: auto;
            margin: 24px 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: relative;
        }
        pre code {
            background: transparent;
            padding: 0;
            border-radius: 0;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
            line-height: 1.6;
            color: #1f2937;
        }
        code {
            background: #f1f5f9;
            padding: 3px 8px;
            border-radius: 6px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 13px;
            color: #1f2937;
        }
        /* Syntax highlighting for common languages */
        pre code .token.comment,
        pre code .token.prolog,
        pre code .token.doctype,
        pre code .token.cdata {
            color: #6b7280;
        }
        pre code .token.punctuation {
            color: #ccc;
        }
        pre code .token.property,
        pre code .token.tag,
        pre code .token.boolean,
        pre code .token.number,
        pre code .token.constant,
        pre code .token.symbol,
        pre code .token.deleted {
            color: #dc2626;
        }
        pre code .token.selector,
        pre code .token.attr-name,
        pre code .token.string,
        pre code .token.char,
        pre code .token.builtin,
        pre code .token.inserted {
            color: #059669;
        }
        pre code .token.operator,
        pre code .token.entity,
        pre code .token.url,
        pre code .language-css .token.string,
        pre code .style .token.string {
            color: #d97706;
        }
        pre code .token.atrule,
        pre code .token.attr-value,
        pre code .token.keyword {
            color: #2563eb;
        }
        pre code .token.function,
        pre code .token.class-name {
            color: #7c3aed;
        }
        pre code .token.regex,
        pre code .token.important,
        pre code .token.variable {
            color: #dc2626;
        }
        blockquote {
            border-left: 4px solid #3b82f6;
            margin: 24px 0;
            padding: 16px 20px;
            color: #6b7280;
            background-color: #f8fafc;
            border-radius: 0 8px 8px 0;
            font-style: italic;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 24px 0;
            table-layout: fixed;
            word-wrap: break-word;
            overflow-wrap: break-word;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        th, td {
            border: 1px solid #e5e7eb;
            padding: 12px 16px;
            text-align: left;
            color: #374151;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            max-width: 0;
        }
        th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #111827;
        }
        hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 32px 0;
        }
        a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            color: #1d4ed8;
            text-decoration: underline;
        }
        .math-block {
            margin: 24px 0;
            text-align: center;
            color: #374151;
            background-color: #f8fafc;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .math-inline {
            display: inline;
            color: #374151;
        }
        .mermaid-diagram {
            margin: 24px 0;
            text-align: center;
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .abc-music {
            margin: 24px 0;
            text-align: center;
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
            
            // Prism.js syntax highlighting
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
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
