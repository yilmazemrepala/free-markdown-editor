import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import { useTheme } from "../contexts/ThemeContext";
import { useEditorStore } from "../stores/editorStore";

interface WYSIWYGEditorProps {
	className?: string;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ className = "" }) => {
	const { theme } = useTheme();
	const {
		markdown,
		handleMarkdownChange,
		setWysiwygRef,
		insertBold,
		insertItalic,
		insertLink,
		insertHeading1,
		insertHeading2,
		insertHeading3,
		insertHeading4,
		insertHeading5,
		insertHeading6,
	} = useEditorStore();

	const wysiwygRef = useRef<HTMLDivElement>(null);
	const previewRef = useRef<HTMLDivElement>(null);

	// Store ref in store
	useEffect(() => {
		if (wysiwygRef.current) {
			setWysiwygRef(wysiwygRef.current);
		}
	}, [setWysiwygRef]);

	// Sync markdown to WYSIWYG content
	useEffect(() => {
		if (wysiwygRef.current && wysiwygRef.current.innerText !== markdown) {
			wysiwygRef.current.innerText = markdown;
		}
	}, [markdown]);

	// Handle content changes
	const handleInput = () => {
		if (wysiwygRef.current) {
			const newMarkdown = wysiwygRef.current.innerText;
			handleMarkdownChange(newMarkdown);
		}
	};

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key) {
					case "b":
						e.preventDefault();
						insertBold();
						break;
					case "i":
						e.preventDefault();
						insertItalic();
						break;
					case "k":
						e.preventDefault();
						insertLink();
						break;
					case "1":
						e.preventDefault();
						insertHeading1();
						break;
					case "2":
						e.preventDefault();
						insertHeading2();
						break;
					case "3":
						e.preventDefault();
						insertHeading3();
						break;
					case "4":
						e.preventDefault();
						insertHeading4();
						break;
					case "5":
						e.preventDefault();
						insertHeading5();
						break;
					case "6":
						e.preventDefault();
						insertHeading6();
						break;
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		insertBold,
		insertItalic,
		insertLink,
		insertHeading1,
		insertHeading2,
		insertHeading3,
		insertHeading4,
		insertHeading5,
		insertHeading6,
	]);

	return (
		<div className={`flex h-full overflow-hidden ${className}`}>
			{/* WYSIWYG Editor */}
			<div className="w-1/2 flex flex-col border-r border-gray-300 dark:border-slate-600">
				<div
					ref={wysiwygRef}
					contentEditable
					onInput={handleInput}
					className={`flex-1 p-4 outline-none resize-none font-mono text-sm leading-relaxed transition-colors duration-200 overflow-y-auto ${
						theme === "dark"
							? "bg-slate-900 text-slate-100"
							: "bg-white text-gray-900"
					}`}
					data-placeholder="Write your Markdown here..."
					style={{
						height: "100%",
						scrollbarWidth: "thin",
						scrollbarColor:
							theme === "dark" ? "#475569 #1e293b" : "#d1d5db #f9fafb",
					}}
					suppressContentEditableWarning={true}
				/>
			</div>

			{/* Live Preview */}
			<div className="w-1/2 flex flex-col">
				<div
					ref={previewRef}
					className={`flex-1 p-4 overflow-y-auto transition-colors duration-200 ${
						theme === "dark"
							? "bg-slate-800 text-slate-100"
							: "bg-gray-50 text-gray-900"
					}`}
					style={{
						scrollbarWidth: "thin",
						scrollbarColor:
							theme === "dark" ? "#475569 #1e293b" : "#d1d5db #f9fafb",
					}}>
					<ReactMarkdown
						remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
						rehypePlugins={[rehypeKatex]}
						components={{
							code: ({
								className,
								children,
								...props
							}: React.HTMLProps<HTMLElement>) => {
								const match = /language-(\w+)/.exec(className || "");
								return match ? (
									<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
										<pre className="text-sm">
											<code className={className}>{children}</code>
										</pre>
									</div>
								) : (
									<code
										className={`px-1 py-0.5 rounded text-sm font-mono ${
											theme === "dark"
												? "bg-slate-700 text-slate-200"
												: "bg-gray-200 text-gray-800"
										}`}
										{...props}>
										{children}
									</code>
								);
							},
							h1: ({ children }) => (
								<h1
									className={`text-3xl font-bold mb-4 mt-6 pb-2 border-b ${
										theme === "dark"
											? "text-slate-100 border-slate-700"
											: "text-gray-900 border-gray-200"
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
							p: ({ children }) => (
								<p
									className={`mb-4 leading-relaxed ${
										theme === "dark" ? "text-slate-200" : "text-gray-700"
									}`}>
									{children}
								</p>
							),
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
							blockquote: ({ children }) => (
								<blockquote
									className={`border-l-4 pl-4 py-2 my-4 italic ${
										theme === "dark"
											? "border-slate-600 bg-slate-800 text-slate-300"
											: "border-gray-300 bg-gray-50 text-gray-600"
									}`}>
									{children}
								</blockquote>
							),
						}}>
						{markdown || "*Markdown önizlemesi burada görünecek...*"}
					</ReactMarkdown>
				</div>
			</div>
		</div>
	);
};

export default WYSIWYGEditor;
