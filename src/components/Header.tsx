import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useEditorStore } from "../stores/editorStore";
import Toolbar from "./Toolbar";
import {
	Sun,
	Moon,
	Check,
	Clock,
	Save,
	Maximize2,
	Minimize2,
} from "lucide-react";
import logo from "@/assets/icons8-markdown-96.png";

interface HeaderProps {
	className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
	const { theme, toggleTheme } = useTheme();
	const { isFullscreen, setIsFullscreen, saveStatus, lastSaved } =
		useEditorStore();

	return (
		<div
			className={`sticky top-0 z-50 border-b p-4 transition-colors duration-200 ${
				theme === "dark"
					? "bg-slate-800 border-slate-700"
					: "bg-gray-100 border-gray-300"
			} ${className}`}>
			<div className="flex justify-between items-center mb-3">
				<div className="flex items-center gap-2">
					<img src={logo} alt="markdown logo" width={30} />
					<h1
						className={`text-xl font-bold transition-colors duration-200 ${
							theme === "dark" ? "text-white" : "text-gray-800"
						}`}>
						Markdown Editor
					</h1>
				</div>

				{/* Save Status */}
				<div className="flex items-center gap-2">
					{saveStatus === "saving" && (
						<>
							<Clock className="w-4 h-4 animate-spin text-blue-500" />
							<span className="text-blue-500 text-sm font-medium">
								Saving...
							</span>
						</>
					)}
					{saveStatus === "saved" && lastSaved && (
						<>
							<Check className="w-4 h-4 text-green-500" />
							<span className="text-green-500 text-sm font-medium">
								Saved{" "}
								{lastSaved.toLocaleTimeString("en-US", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</>
					)}
					{saveStatus === "unsaved" && (
						<>
							<Save className="w-4 h-4 text-orange-500" />
							<span className="text-orange-500 text-sm font-medium">
								Unsaved
							</span>
						</>
					)}
				</div>

				<div className="flex gap-2 items-center">
					<button
						onClick={toggleTheme}
						className={`px-3 py-2 rounded-md transition-colors ${
							theme === "dark"
								? "bg-slate-700 text-amber-400 hover:bg-slate-600"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
						title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}>
						{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
					</button>

					<button
						onClick={() => setIsFullscreen(!isFullscreen)}
						className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
							isFullscreen
								? "bg-red-500 text-white hover:bg-red-600"
								: "bg-purple-500 text-white hover:bg-purple-600"
						}`}
						title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
						{isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
						{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
					</button>
				</div>
			</div>

			{/* Toolbar - only show when not in fullscreen mode */}
			{!isFullscreen && (
				<div
					className={`pt-2 transition-colors duration-200 ${
						theme === "dark" ? "border-slate-600" : "border-gray-200"
					}`}>
					<Toolbar />
				</div>
			)}
		</div>
	);
};

export default Header;
