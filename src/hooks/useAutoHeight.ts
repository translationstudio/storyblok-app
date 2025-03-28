import { useEffect } from 'react';
import StoryblokAppConfigration from '@/StoryblokAppConfiguration';

export function useAutoHeight() {
	useEffect(() => {
		const observer = new MutationObserver(() => {
			window.parent.postMessage(
				{
					action: 'tool-changed',
					tool: StoryblokAppConfigration.EXTENSION_SLUG,
					event: 'heightChange',
					height: document.body.scrollHeight,
				},
				StoryblokAppConfigration.APP_ORIGIN,
			);
		});

		observer.observe(document.body, {
			attributes: true,
			childList: true,
			subtree: true,
		});

		return () => {
			observer.disconnect();
		};
	}, []);
}
