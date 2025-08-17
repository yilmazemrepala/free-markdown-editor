import React from "react";
import { useEditorStore } from "../stores/editorStore";
import Editor from "./Editor";
import Preview from "./Preview";
import StatusBar from "./StatusBar";

interface MarkdownEditorProps {
	className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ className = "" }) => {
	const { isPreview } = useEditorStore();

	return (
		<div className={`flex flex-col h-full ${className}`}>
			<div className="flex-1 flex overflow-hidden">
				{isPreview ? (
					<Preview className="w-full h-full overflow-y-auto" />
				) : (
					<Editor className="w-full h-full" />
				)}
			</div>
			<StatusBar />
		</div>
	);
};

export default MarkdownEditor;
