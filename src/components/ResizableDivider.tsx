import React, { useCallback, useEffect } from "react";
import { useEditorStore } from "../stores/editorStore";

interface ResizableDividerProps {
	className?: string;
}

const ResizableDivider: React.FC<ResizableDividerProps> = ({
	className = "",
}) => {
	const { setLeftPanelWidth, setIsResizing, isResizing } = useEditorStore();

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			setIsResizing(true);
		},
		[setIsResizing]
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing) return;

			const container = document.querySelector(".markdown-editor-container");
			if (!container) return;

			const containerRect = container.getBoundingClientRect();
			const newWidth =
				((e.clientX - containerRect.left) / containerRect.width) * 100;

			setLeftPanelWidth(newWidth);
		},
		[isResizing, setLeftPanelWidth]
	);

	const handleMouseUp = useCallback(() => {
		setIsResizing(false);
	}, [setIsResizing]);

	useEffect(() => {
		if (isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			};
		}
	}, [isResizing, handleMouseMove, handleMouseUp]);

	return (
		<div
			className={`w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors duration-200 flex-shrink-0 ${className}`}
			onMouseDown={handleMouseDown}
			title="Panelleri yeniden boyutlandırmak için sürükleyin">
			<div className="w-full h-full flex items-center justify-center">
				<div className="w-0.5 h-8 bg-gray-400 dark:bg-gray-500 rounded-full" />
			</div>
		</div>
	);
};

export default ResizableDivider;
