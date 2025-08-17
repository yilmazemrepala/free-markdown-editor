import MarkdownEditor from "@/components/MarkdownEditor";
import Header from "@/components/Header";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const Home: React.FC = () => {
	// Dynamic title management
	useDocumentMeta({
		title: "Markdown Editor",
		siteName: "Markdown Editor App",
		separator: "|",
	});

	return (
		<div className="h-screen flex flex-col overflow-hidden">
			<Header />
			<div className="flex-1 overflow-hidden">
				<MarkdownEditor />
			</div>
		</div>
	);
};

export default Home;
