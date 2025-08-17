import React, { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useEditorStore } from "../stores/editorStore";

interface EditorProps {
	className?: string;
}

const Editor: React.FC<EditorProps> = ({ className = "" }) => {
	const { theme } = useTheme();
	const {
		markdown,
		handleMarkdownChange,
		setTextareaRef,
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

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Store ref in store
	useEffect(() => {
		setTextareaRef(textareaRef.current);
	}, [setTextareaRef]);

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
		<div className={`flex flex-col h-full overflow-hidden ${className}`}>
			<textarea
				ref={textareaRef}
				value={markdown}
				onChange={(e) => handleMarkdownChange(e.target.value)}
				className={`flex-1 p-4 border-0 outline-none resize-none font-mono text-sm leading-relaxed transition-colors duration-200 overflow-y-auto ${
					theme === "dark"
						? "bg-slate-900 text-slate-100 placeholder-slate-400"
						: "bg-white text-gray-900 placeholder-gray-400"
				}`}
				placeholder="Write your Markdown here..."
				spellCheck={false}
				style={{
					height: "100%",
					scrollbarWidth: "thin",
					scrollbarColor:
						theme === "dark" ? "#475569 #1e293b" : "#d1d5db #f9fafb",
				}}
			/>
		</div>
	);
};

export default Editor;
