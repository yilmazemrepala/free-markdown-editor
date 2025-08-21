import React from "react";
import { useEditorStore } from "../stores/editorStore";
import Preview from "./Preview";
import WYSIWYGEditor from "./WYSIWYGEditor";
import ResizableDivider from "./ResizableDivider";
import StatusBar from "./StatusBar";

interface MarkdownEditorProps {
	className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ className = "" }) => {
	const { isFullscreen, leftPanelWidth } = useEditorStore();

	return (
		<div
			className={`flex flex-col h-full ${className} markdown-editor-container`}>
			<div className="flex-1 flex overflow-hidden">
				{isFullscreen ? (
					<Preview className="w-full h-full overflow-y-auto" />
				) : (
					// Split view: WYSIWYG + Divider + Preview
					<>
						<div
							className="h-full overflow-hidden"
							style={{ width: `${leftPanelWidth}%` }}>
							<WYSIWYGEditor className="w-full h-full" />
						</div>
						<ResizableDivider />
						<div
							className="h-full overflow-hidden"
							style={{ width: `${100 - leftPanelWidth}%` }}>
							<Preview className="w-full h-full overflow-y-auto" />
						</div>
					</>
				)}
			</div>
			<StatusBar />
		</div>
	);
};

export default MarkdownEditor;
