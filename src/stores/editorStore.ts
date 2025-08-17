import { create } from "zustand";

interface EditorState {
	markdown: string;
	isPreview: boolean;
	showExportMenu: boolean;
	showEmojiMenu: boolean;
	selectedEmojiCategory: number;
	saveStatus: "saved" | "saving" | "unsaved";
	lastSaved: Date | null;
	textareaRef: HTMLTextAreaElement | null;

	// Actions
	setMarkdown: (markdown: string) => void;
	setIsPreview: (isPreview: boolean) => void;
	setShowExportMenu: (show: boolean) => void;
	setShowEmojiMenu: (show: boolean) => void;
	setSelectedEmojiCategory: (category: number) => void;
	setSaveStatus: (status: "saved" | "saving" | "unsaved") => void;
	setLastSaved: (date: Date | null) => void;
	setTextareaRef: (ref: HTMLTextAreaElement | null) => void;

	// Editor functions
	insertText: (before: string, after?: string, placeholder?: string) => void;
	handleMarkdownChange: (value: string) => void;

	// Toolbar functions
	insertBold: () => void;
	insertItalic: () => void;
	insertHeading1: () => void;
	insertHeading2: () => void;
	insertHeading3: () => void;
	insertHeading4: () => void;
	insertHeading5: () => void;
	insertHeading6: () => void;
	insertList: () => void;
	insertOrderedList: () => void;
	insertQuote: () => void;
	insertCode: () => void;
	insertCodeBlock: () => void;
	insertLink: () => void;
	insertImage: () => void;
	insertHorizontalRule: () => void;
	insertTable: () => void;
	insertMath: () => void;
	insertMermaidDiagram: () => void;
	insertABCMusic: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
	markdown: "",
	isPreview: false,
	showExportMenu: false,
	showEmojiMenu: false,
	selectedEmojiCategory: 0,
	saveStatus: "saved",
	lastSaved: null,
	textareaRef: null,

	setMarkdown: (markdown) => set({ markdown }),
	setIsPreview: (isPreview) => set({ isPreview }),
	setShowExportMenu: (show) => set({ showExportMenu: show }),
	setShowEmojiMenu: (show) => set({ showEmojiMenu: show }),
	setSelectedEmojiCategory: (category) =>
		set({ selectedEmojiCategory: category }),
	setSaveStatus: (status) => set({ saveStatus: status }),
	setLastSaved: (date) => set({ lastSaved: date }),
	setTextareaRef: (ref) => set({ textareaRef: ref }),

	insertText: (
		before: string,
		after: string = "",
		placeholder: string = ""
	) => {
		const { markdown, textareaRef, handleMarkdownChange } = get();
		if (!textareaRef) return;

		const start = textareaRef.selectionStart;
		const end = textareaRef.selectionEnd;
		const selectedText = markdown.substring(start, end);
		const textToInsert = selectedText || placeholder;

		const newText =
			markdown.substring(0, start) +
			before +
			textToInsert +
			after +
			markdown.substring(end);

		handleMarkdownChange(newText);

		// Set cursor position
		setTimeout(() => {
			if (textareaRef) {
				const newCursorPos = start + before.length + textToInsert.length;
				textareaRef.setSelectionRange(newCursorPos, newCursorPos);
				textareaRef.focus();
			}
		}, 0);
	},

	handleMarkdownChange: (value: string) => {
		set({ markdown: value, saveStatus: "saving" });

		setTimeout(() => {
			localStorage.setItem("markdown-editor-content", value);
			set({ saveStatus: "saved", lastSaved: new Date() });
		}, 500);
	},

	// Toolbar functions
	insertBold: () => get().insertText("**", "**", "bold text"),
	insertItalic: () => get().insertText("*", "*", "italic text"),
	insertHeading1: () => get().insertText("# ", "", "Heading 1"),
	insertHeading2: () => get().insertText("## ", "", "Heading 2"),
	insertHeading3: () => get().insertText("### ", "", "Heading 3"),
	insertHeading4: () => get().insertText("#### ", "", "Heading 4"),
	insertHeading5: () => get().insertText("##### ", "", "Heading 5"),
	insertHeading6: () => get().insertText("###### ", "", "Heading 6"),
	insertList: () => get().insertText("- ", "", "list item"),
	insertOrderedList: () => get().insertText("1. ", "", "numbered list item"),
	insertQuote: () => get().insertText("> ", "", "quote"),
	insertCode: () => get().insertText("`", "`", "code"),
	insertCodeBlock: () => get().insertText("```\n", "\n```", "code block"),
	insertLink: () => get().insertText("[", "](url)", "link text"),
	insertImage: () => get().insertText("![", "](image-url)", "image description"),
	insertHorizontalRule: () => get().insertText("\n---\n", "", ""),
	insertTable: () => {
		const tableText =
			"\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n";
		get().insertText(tableText, "", "");
	},
	insertMath: () => get().insertText("$$\n", "\n$$", "E = mc^2"),
	insertMermaidDiagram: () => {
		const mermaidText =
			"\n```mermaid\ngraph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Result 1]\n    B -->|No| D[Result 2]\n```\n";
		get().insertText(mermaidText, "", "");
	},
	insertABCMusic: () => {
		const abcText =
			"\n```abc\nX:1\nT:Simple Melody\nM:4/4\nL:1/4\nK:C\nC D E F | G A B c |\n```\n";
		get().insertText(abcText, "", "");
	},
}));

// Load data from localStorage
if (typeof window !== "undefined") {
	const savedMarkdown = localStorage.getItem("markdown-editor-content");
	if (savedMarkdown) {
		useEditorStore.setState({ markdown: savedMarkdown });
	}
}
