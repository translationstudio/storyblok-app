import { useEffect, useState } from 'react';
import { ToolContext } from '@/interfaces_types';
import StoryblokAppConfigration from '@/StoryblokAppConfiguration';

export function useToolContext() 
{
	const [context, setContext] = useState<ToolContext | undefined>(undefined);
	const handleContext = ({ data }: MessageEvent<ToolContext>) => {		
		setContext(data);	
	};	
	const triggerContextUpdate = () => {						
		window.parent.postMessage(
			{
				action: 'tool-changed',
				tool: StoryblokAppConfigration.EXTENSION_SLUG,
				event: 'getContext',
			},
			StoryblokAppConfigration.APP_ORIGIN,
		);
	}

	useEffect(() => {
		triggerContextUpdate();
		window.addEventListener('message', handleContext);

		return () => {
				window.removeEventListener('message', handleContext);
		};
	}, [setContext]);

	return context;
}
