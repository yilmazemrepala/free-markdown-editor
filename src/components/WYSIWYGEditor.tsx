import React, { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useEditorStore } from "../stores/editorStore";
import ResizableDivider from "./ResizableDivider";
import Preview from "./Preview";

interface WYSIWYGEditorProps {
	className?: string;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ className = "" }) => {
	const { theme } = useTheme();
	const { leftPanelWidth } = useEditorStore();

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
				<div 
					className="flex flex-col border-r border-gray-300 dark:border-slate-600"
					style={{ width: `${leftPanelWidth}%` }}>
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

				<ResizableDivider />

				{/* Live Preview */}
				<div
					className="flex-1 overflow-hidden">
					<Preview className="w-full h-full overflow-y-auto" />
				</div>
			</div>
		);
};

export default WYSIWYGEditor;
