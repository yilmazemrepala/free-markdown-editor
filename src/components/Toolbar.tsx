import React, { useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useEditorStore } from "../stores/editorStore";
import { emojiCategories } from "../constants/toolbarConstants";
import {
	exportAsMarkdown,
	exportAsHTML,
	exportAsPDF,
	importMarkdownFile,
} from "../utils/exportUtils";

import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Table,
	Link,
	Code,
	Quote,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Heading6,
	Image,
	Minus,
	FileCode,
	FileDown,
	FileText,
	Globe,
	Printer,
	Upload,
	Calculator,
	Smile,
	Music,
} from "lucide-react";

interface ToolbarProps {
	className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ className = "" }) => {
	const { theme } = useTheme();
	const {
		markdown,
		showExportMenu,
		setShowExportMenu,
		showEmojiMenu,
		setShowEmojiMenu,
		selectedEmojiCategory,
		setSelectedEmojiCategory,
		insertBold,
		insertItalic,
		insertHeading1,
		insertHeading2,
		insertHeading3,
		insertHeading4,
		insertHeading5,
		insertHeading6,
		insertList,
		insertOrderedList,
		insertQuote,
		insertCode,
		insertCodeBlock,
		insertLink,
		insertImage,
		insertHorizontalRule,
		insertTable,
		insertMath,
		insertABCMusic,
		insertText,
		handleMarkdownChange,
	} = useEditorStore();

	const exportMenuRef = useRef<HTMLDivElement>(null);
	const emojiMenuRef = useRef<HTMLDivElement>(null);

	// Diagram types

	const insertEmoji = (emojiCode: string) => {
		insertText(emojiCode, "", "");
		setShowEmojiMenu(false);
	};

	// Click outside to close menus
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				exportMenuRef.current &&
				!exportMenuRef.current.contains(event.target as Node)
			) {
				setShowExportMenu(false);
			}
			if (
				emojiMenuRef.current &&
				!emojiMenuRef.current.contains(event.target as Node)
			) {
				setShowEmojiMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setShowExportMenu, setShowEmojiMenu]);

	return (
		<div
			className={`flex flex-wrap gap-1 border-t pt-3 justify-center items-center transition-colors duration-200 ${
				theme === "dark" ? "border-slate-600" : "border-gray-200"
			} ${className}`}>
			{/* Heading buttons */}
			<button
				onClick={insertHeading1}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Heading 1">
				<Heading1 size={16} />
			</button>
			<button
				onClick={insertHeading2}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Heading 2">
				<Heading2 size={16} />
			</button>
			<button
				onClick={insertHeading3}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Heading 3">
				<Heading3 size={16} />
			</button>
			<button
				onClick={insertHeading4}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Heading 4">
				<Heading4 size={16} />
			</button>
			<button
				onClick={insertHeading5}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Heading 5">
				<Heading5 size={16} />
			</button>
			<button
				onClick={insertHeading6}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Heading 6">
				<Heading6 size={16} />
			</button>

			{/* Text formatting buttons */}
			<button
				onClick={insertBold}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Bold">
				<Bold size={16} />
			</button>
			<button
				onClick={insertItalic}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Italic">
				<Italic size={16} />
			</button>
			<button
				onClick={insertCode}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Inline Code">
				<Code size={16} />
			</button>
			<button
				onClick={insertCodeBlock}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Code Block">
				<FileCode size={16} />
			</button>

			{/* List buttons */}
			<button
				onClick={insertList}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Bullet List">
				<List size={16} />
			</button>
			<button
				onClick={insertOrderedList}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Numbered List">
				<ListOrdered size={16} />
			</button>
			<button
				onClick={insertQuote}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Quote">
				<Quote size={16} />
			</button>

			{/* Media buttons */}
			<button
				onClick={insertLink}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Link">
				<Link size={16} />
			</button>
			<button
				onClick={insertImage}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Image">
				<Image size={16} />
			</button>
			<button
				onClick={insertTable}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Table">
				<Table size={16} />
			</button>
			<button
				onClick={insertHorizontalRule}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Horizontal Rule">
				<Minus size={16} />
			</button>

			{/* Advanced features */}
			<button
				onClick={insertMath}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="Math Formula">
				<Calculator size={16} />
			</button>

			<button
				onClick={insertABCMusic}
				className={`p-2 rounded transition-colors ${
					theme === "dark"
						? "hover:bg-slate-700 text-slate-200"
						: "hover:bg-gray-200 text-gray-700"
				}`}
				title="ABC Music Notation">
				<Music size={16} />
			</button>

			{/* Emoji Dropdown */}
			<div className="relative" ref={emojiMenuRef}>
				<button
					onClick={() => setShowEmojiMenu(!showEmojiMenu)}
					className={`p-2 rounded transition-colors ${
						theme === "dark"
							? "hover:bg-slate-700 text-slate-200"
							: "hover:bg-gray-200 text-gray-700"
					}`}
					title="Add Emoji">
					<Smile size={16} />
				</button>

				{showEmojiMenu && (
					<div
						className={`absolute top-full left-0 mt-2 border rounded-lg shadow-xl z-10 w-fit max-h-96 overflow-hidden transition-colors duration-200 ${
							theme === "dark"
								? "bg-slate-800 border-slate-600"
								: "bg-white border-gray-200"
						}`}>
						{/* Emoji categories */}
						<div
							className={`flex border-b ${
								theme === "dark" ? "border-slate-600" : "border-gray-200"
							}`}>
							{emojiCategories.map((category, index) => (
								<button
									key={index}
									onClick={() => setSelectedEmojiCategory(index)}
									className={`px-3 py-2 text-xs font-medium transition-colors ${
										selectedEmojiCategory === index
											? theme === "dark"
												? "bg-slate-700 text-blue-400 border-b-2 border-blue-400"
												: "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
											: theme === "dark"
											? "text-slate-300 hover:bg-slate-700"
											: "text-gray-600 hover:bg-gray-50"
									}`}>
									{category.name}
								</button>
							))}
						</div>

						{/* Emoji list */}
						<div className="p-3 max-h-64 overflow-y-auto">
							<div className="grid grid-cols-8 gap-1">
								{emojiCategories[selectedEmojiCategory].emojis.map(
									(emoji, index) => (
										<button
											key={index}
											onClick={() => insertEmoji(emoji.code)}
											className={`p-2 rounded text-lg hover:bg-opacity-20 transition-colors ${
												theme === "dark"
													? "hover:bg-slate-600"
													: "hover:bg-gray-200"
											}`}
											title={emoji.code}>
											{emoji.emoji}
										</button>
									)
								)}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Export Dropdown */}
			<button
				onClick={() => importMarkdownFile(handleMarkdownChange)}
				className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
					theme === "dark"
						? "bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600"
						: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
				}`}
				title="Import File">
				<Upload size={16} />
				<span className="text-sm font-medium">Import</span>
			</button>

			<div className="relative" ref={exportMenuRef}>
				<button
					onClick={() => setShowExportMenu(!showExportMenu)}
					className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
						theme === "dark"
							? "bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600"
							: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
					}`}
					title="Export">
					<FileDown size={16} />
					<span className="text-sm font-medium">Export</span>
				</button>

				{showExportMenu && (
					<div
						className={`absolute top-full right-0 mt-2 border rounded-lg shadow-xl z-10 min-w-[180px] transition-colors duration-200 ${
							theme === "dark"
								? "bg-slate-800 border-slate-600"
								: "bg-white border-gray-200"
						}`}>
						<div className="py-1">
							<button
								onClick={() => {
									exportAsMarkdown(markdown, setShowExportMenu);
								}}
								className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
									theme === "dark"
										? "hover:bg-slate-700 text-slate-200"
										: "hover:bg-gray-50 text-gray-700"
								}`}>
								<FileText size={16} className="text-blue-500" />
								<div>
									<div className="font-medium">Markdown</div>
									<div className="text-xs opacity-70">.md file</div>
								</div>
							</button>
							<button
								onClick={() => {
									exportAsHTML(markdown, setShowExportMenu);
								}}
								className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
									theme === "dark"
										? "hover:bg-slate-700 text-slate-200"
										: "hover:bg-gray-50 text-gray-700"
								}`}>
								<Globe size={16} className="text-green-500" />
								<div>
									<div className="font-medium">HTML</div>
									<div className="text-xs opacity-70">.html file</div>
								</div>
							</button>
							<button
								onClick={() => {
									exportAsPDF(markdown, setShowExportMenu);
								}}
								className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
									theme === "dark"
										? "hover:bg-slate-700 text-slate-200"
										: "hover:bg-gray-50 text-gray-700"
								}`}>
								<Printer size={16} className="text-red-500" />
								<div>
									<div className="font-medium">PDF</div>
									<div className="text-xs opacity-70">Print to PDF</div>
								</div>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Toolbar;
