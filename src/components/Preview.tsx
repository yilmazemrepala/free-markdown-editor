import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
	oneDark,
	oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import mermaid from "mermaid";
import ABCJS from "abcjs";
import { useTheme } from "../contexts/ThemeContext";
import { useEditorStore } from "../stores/editorStore";

interface PreviewProps {
	className?: string;
}

const Preview: React.FC<PreviewProps> = ({ className = "" }) => {
	const { theme } = useTheme();
	const { markdown } = useEditorStore();

	// Mermaid configuration
	useEffect(() => {
		mermaid.initialize({
			startOnLoad: true,
			theme: theme === "dark" ? "dark" : "default",
			securityLevel: "loose",
			fontFamily: "inherit",
			logLevel: "error",
			flowchart: {
				htmlLabels: true,
				useMaxWidth: true,
			},
		});
	}, [theme]);

	// Render Mermaid diagrams
	useEffect(() => {
		const renderMermaidDiagrams = async () => {
			const mermaidElements = document.querySelectorAll(".mermaid-diagram");
			mermaidElements.forEach(async (element, index) => {
				try {
					let graphDefinition = element.textContent || "";
					
					// Clean up Turkish characters and common issues
					graphDefinition = graphDefinition
						.replace(/[çÇ]/g, 'c')
						.replace(/[ğĞ]/g, 'g')
						.replace(/[ıİ]/g, 'i')
						.replace(/[öÖ]/g, 'o')
						.replace(/[şŞ]/g, 's')
						.replace(/[üÜ]/g, 'u')
						.replace(/[^\x20-\x7E]/g, ''); // Remove non-printable ASCII characters
					
					const { svg } = await mermaid.render(
						`mermaid-${index}`,
						graphDefinition
					);
					(element as HTMLElement).innerHTML = svg;
				} catch (error) {
					console.error("Mermaid render error:", error);
					const errorMessage = error instanceof Error ? error.message : String(error);
					(
						element as HTMLElement
					).innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded bg-red-50 dark:bg-red-900/20">
						<strong>Mermaid Diagram Error:</strong><br/>
						${errorMessage}<br/><br/>
						<small>Tip: Avoid using Turkish characters (ç, ğ, ı, ö, ş, ü) in Mermaid diagrams. Use English characters instead.</small>
					</div>`;
				}
			});
		};

		const timer = setTimeout(renderMermaidDiagrams, 100);
		return () => clearTimeout(timer);
	}, [markdown]);

	// Render ABC.js music notation
	useEffect(() => {
		const renderABCMusic = () => {
			const abcElements = document.querySelectorAll(".abc-music");
			abcElements.forEach((element) => {
				try {
					const abcText = element.textContent || "";
					(element as HTMLElement).innerHTML = "";
					ABCJS.renderAbc(element as HTMLElement, abcText, {
						responsive: "resize",
						staffwidth: 400,
					});
				} catch (error) {
					console.error("ABC.js render error:", error);
					(
						element as HTMLElement
					).innerHTML = `<div class="text-red-500">ABC music notation error: ${error}</div>`;
				}
			});
		};

		const timer = setTimeout(renderABCMusic, 100);
		return () => clearTimeout(timer);
	}, [markdown]);

	return (
		<div
			className={`flex-1 overflow-y-auto p-4 transition-colors duration-200 ${
				theme === "dark"
					? "bg-slate-800 text-slate-100"
					: "bg-gray-50 text-gray-900"
			} ${className}`}
			style={{
				scrollbarWidth: "thin",
				scrollbarColor:
					theme === "dark" ? "#475569 #1e293b" : "#d1d5db #f9fafb",
			}}>
			<div className="max-w-none">
				<ReactMarkdown
					remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
					rehypePlugins={[rehypeKatex]}
					components={{
						code: ({ className, children, ...props }) => {
							const match = /language-(\w+)/.exec(className || "");
							const language = match ? match[1] : "";
							const isInline = !match;

							if (language === "mermaid") {
								return (
									<div className="mermaid-diagram my-4 text-center">
										{String(children).replace(/\n$/, "")}
									</div>
								);
							}

							if (language === "abc") {
								return (
									<div className="abc-music my-4 text-center">
										{String(children).replace(/\n$/, "")}
									</div>
								);
							}

							return !isInline ? (
								<SyntaxHighlighter
									style={theme === "dark" ? oneDark : oneLight}
									language={language}
									PreTag="div"
									className="rounded-md">
									{String(children).replace(/\n$/, "")}
								</SyntaxHighlighter>
							) : (
								<code
									className={`px-1 py-0.5 rounded text-sm font-mono ${
										theme === "dark"
											? "bg-slate-700 text-slate-200"
											: "bg-gray-200 text-gray-800"
									}`}
									style={{ whiteSpace: 'pre-wrap' }}
									{...props}>
									{children}
								</code>
							);
						},
						pre: ({ children }) => (
							<div
								className={`rounded-md overflow-hidden my-4 ${
									theme === "dark" ? "bg-slate-900" : "bg-gray-100"
								}`}
								style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
								{children}
							</div>
						),
						h1: ({ children }) => (
							<h1
								className={`text-3xl font-bold mb-4 pb-2 border-b ${
									theme === "dark"
										? "text-slate-100 border-slate-600"
										: "text-gray-900 border-gray-300"
								}`}>
								{children}
							</h1>
						),
						h2: ({ children }) => (
							<h2
								className={`text-2xl font-semibold mb-3 mt-6 pb-1 border-b ${
									theme === "dark"
										? "text-slate-100 border-slate-700"
										: "text-gray-900 border-gray-200"
								}`}>
								{children}
							</h2>
						),
						h3: ({ children }) => (
							<h3
								className={`text-xl font-semibold mb-2 mt-5 ${
									theme === "dark" ? "text-slate-100" : "text-gray-900"
								}`}>
								{children}
							</h3>
						),
						h4: ({ children }) => (
							<h4
								className={`text-lg font-medium mb-2 mt-4 ${
									theme === "dark" ? "text-slate-200" : "text-gray-800"
								}`}>
								{children}
							</h4>
						),
						h5: ({ children }) => (
							<h5
								className={`text-base font-medium mb-1 mt-3 ${
									theme === "dark" ? "text-slate-200" : "text-gray-800"
								}`}>
								{children}
							</h5>
						),
						h6: ({ children }) => (
							<h6
								className={`text-sm font-medium mb-1 mt-2 ${
									theme === "dark" ? "text-slate-300" : "text-gray-700"
								}`}>
								{children}
							</h6>
						),
						p: ({ children }) => (
							<p
								className={`mb-4 leading-relaxed ${
									theme === "dark" ? "text-slate-200" : "text-gray-700"
								}`}>
								{children}
							</p>
						),
						blockquote: ({ children }) => (
							<blockquote
								className={`border-l-4 pl-4 py-2 my-4 italic ${
									theme === "dark"
										? "border-slate-500 bg-slate-800 text-slate-300"
										: "border-gray-400 bg-gray-50 text-gray-600"
								}`}>
								{children}
							</blockquote>
						),
						a: ({ href, children }) => (
							<a
								href={href}
								className={`underline transition-colors ${
									theme === "dark"
										? "text-blue-400 hover:text-blue-300"
										: "text-blue-600 hover:text-blue-800"
								}`}
								target="_blank"
								rel="noopener noreferrer">
								{children}
							</a>
						),
						// Table elements
						table: ({ children }) => (
							<div className="overflow-x-auto my-4">
								<table
									className={`min-w-full border-collapse border ${
										theme === "dark" ? "border-slate-600" : "border-gray-300"
									}`}>
									{children}
								</table>
							</div>
						),
						thead: ({ children }) => (
							<thead
								className={`${
									theme === "dark" ? "bg-slate-700" : "bg-gray-100"
								}`}>
								{children}
							</thead>
						),
						tbody: ({ children }) => <tbody>{children}</tbody>,
						tr: ({ children }) => (
							<tr
								className={`border-b ${
									theme === "dark"
										? "border-slate-600 hover:bg-slate-800"
										: "border-gray-200 hover:bg-gray-50"
								} transition-colors`}>
								{children}
							</tr>
						),
						th: ({ children }) => (
							<th
								className={`px-4 py-2 text-left font-semibold border-r ${
									theme === "dark"
										? "text-slate-100 border-slate-600"
										: "text-gray-900 border-gray-300"
								}`}>
								{children}
							</th>
						),
						td: ({ children }) => (
							<td
								className={`px-4 py-2 border-r ${
									theme === "dark"
										? "text-slate-200 border-slate-600"
										: "text-gray-700 border-gray-300"
								}`}>
								{children}
							</td>
						),
						// List elements
						ul: ({ children }) => (
							<ul
								className={`list-disc list-inside mb-4 space-y-1 ${
									theme === "dark" ? "text-slate-200" : "text-gray-700"
								}`}>
								{children}
							</ul>
						),
						ol: ({ children }) => (
							<ol
								className={`list-decimal list-inside mb-4 space-y-1 ${
									theme === "dark" ? "text-slate-200" : "text-gray-700"
								}`}>
								{children}
							</ol>
						),
						li: ({ children }) => (
							<li className="mb-1 leading-relaxed">{children}</li>
						),
						// Horizontal rule
						hr: () => (
							<hr
								className={`my-6 border-t ${
									theme === "dark" ? "border-slate-600" : "border-gray-300"
								}`}
							/>
						),
						// Inline code
						strong: ({ children }) => (
							<strong
								className={`font-bold ${
									theme === "dark" ? "text-slate-100" : "text-gray-900"
								}`}>
								{children}
							</strong>
						),
						em: ({ children }) => (
							<em
								className={`italic ${
									theme === "dark" ? "text-slate-200" : "text-gray-700"
								}`}>
								{children}
							</em>
						),
					}}>
					{markdown}
				</ReactMarkdown>
			</div>
		</div>
	);
};

export default Preview;
