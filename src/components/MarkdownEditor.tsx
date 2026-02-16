import React from "react";
import { useEditorStore } from "../stores/editorStore";
import Preview from "./Preview";
import WYSIWYGEditor from "./WYSIWYGEditor";
import StatusBar from "./StatusBar";

interface MarkdownEditorProps {
	className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ className = "" }) => {
	const { isFullscreen } = useEditorStore();

	return (
		<div
			className={`flex flex-col h-full ${className} markdown-editor-container`}>
			<div className="flex-1 flex overflow-hidden">
				{isFullscreen ? (
					<Preview className="w-full h-full overflow-y-auto" />
				) : (
					// Split view: WYSIWYG + Divider + Preview
					<WYSIWYGEditor className="w-full h-full" />
				)}
			</div>
			<StatusBar />
		</div>
	);
};

export default MarkdownEditor;
