import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useEditorStore } from "../stores/editorStore";
import { Link } from "react-router-dom";
interface StatusBarProps {
	className?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ className = "" }) => {
	const { theme } = useTheme();
	const { markdown, saveStatus, lastSaved } = useEditorStore();

	const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
	const charCount = markdown.length;
	const lineCount = markdown.split("\n").length;

	const formatLastSaved = (date: Date | null) => {
		if (!date) return "Never saved";
		return `Last saved: ${date.toLocaleTimeString("en-US")}`;
	};

	return (
		<div
			className={`flex items-center justify-between px-4 py-2 text-xs border-t transition-colors duration-200 ${
				theme === "dark"
					? "bg-slate-800 text-slate-400 border-slate-600"
					: "bg-gray-50 text-gray-600 border-gray-200"
			} ${className}`}>
			<div className="flex items-center space-x-4">
				<span>{lineCount} lines</span>
				<span>{wordCount} words</span>
				<span>{charCount} characters</span>
			</div>

			<div>
				This project developed by{" "}
				<Link
					to="https://linkedin.com/in/yilmazemrepala"
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-500 hover:text-blue-600 underline"
					reloadDocument>
					Yilmaz Emre Pala
				</Link>
			</div>

			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-2">
					<div
						className={`w-2 h-2 rounded-full ${
							saveStatus === "saved"
								? "bg-green-500"
								: saveStatus === "saving"
								? "bg-yellow-500"
								: "bg-red-500"
						}`}
					/>
					<span className="capitalize">
						{saveStatus === "saved"
							? "Saved"
							: saveStatus === "saving"
							? "Saving..."
							: "Unsaved"}
					</span>
				</div>
				<span className="text-xs opacity-70">{formatLastSaved(lastSaved)}</span>
			</div>
		</div>
	);
};

export default StatusBar;
