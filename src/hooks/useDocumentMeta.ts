import { useEffect } from "react";

interface DocumentMetaOptions {
	title: string;
	description?: string;
	keywords?: string[];
	favicon?: string;
	image?: string;
	siteName?: string;
	separator?: string;
}

export const useDocumentMeta = (options: DocumentMetaOptions): void => {
	const {
		title,
		description,
		keywords,
		favicon,
		image,
		siteName,
		separator = "|",
	} = options;

	useEffect(() => {
		// Set the document title
		if (title) {
			document.title = title;
		}

		if (siteName) {
			document.title = `${title} ${separator} ${siteName}`;
		}

		// Set the meta description
		if (description) {
			let metaDescription = document.querySelector('meta[name="description"]');
			if (!metaDescription) {
				metaDescription = document.createElement("meta");
				metaDescription.setAttribute("name", "description");
				document.head.appendChild(metaDescription);
			}
			metaDescription.setAttribute("content", description);
		}

		// Set the meta keywords
		if (keywords && keywords.length > 0) {
			let metaKeywords = document.querySelector('meta[name="keywords"]');
			if (!metaKeywords) {
				metaKeywords = document.createElement("meta");
				metaKeywords.setAttribute("name", "keywords");
				document.head.appendChild(metaKeywords);
			}
			metaKeywords.setAttribute("content", keywords.join(", "));
		}

		// Set the favicon
		if (favicon) {
			let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
			if (!link) {
				link = document.createElement("link");
				link.rel = "icon";
				document.head.appendChild(link);
			}
			link.href = favicon;
		}

		// Set the site image (og:image)
		if (image) {
			let metaImage = document.querySelector('meta[property="og:image"]');
			if (!metaImage) {
				metaImage = document.createElement("meta");
				metaImage.setAttribute("property", "og:image");
				document.head.appendChild(metaImage);
			}
			metaImage.setAttribute("content", image);
		}
	}, [title, description, keywords, favicon, image, siteName, separator]);
};
