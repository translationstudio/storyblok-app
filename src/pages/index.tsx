/*
Storyblok - translationstudio extension
Copyright (C) 2025 I-D Media GmbH, idmedia.com

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, see https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
*/
import { GetServerSideProps } from 'next';
import { useRouter } from "next/navigation";
import { isAppSessionQuery } from '@storyblok/app-extension-auth';
import { appSessionCookies } from '@/auth';
import Head from 'next/head';
import { useEffect } from 'react';
import { useAutoHeight } from '@/hooks';
import { Loader } from '@/components';
import StoryblokAppConfigration from '@/StoryblokAppConfiguration';

const TSLoader = (props: {spaceId: string, userId: string}) => {			
    const { push } = useRouter();
    
    useEffect(() => {
        push('/home?spaceId=' + props.spaceId + '&userId=' + props.userId);
     }, []);

	useAutoHeight();

	return (
		<>			
			<Head>
				<title>TranslationStudio plugin for Storyblok</title>
				<meta name="description" content="Plugin to handle translation requests from Storyblok CMS to TranslationStudio" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main>				
				<Loader />
			</main>
		</>
	);
}
export default TSLoader;

export const getServerSideProps: GetServerSideProps = async (context) => {		
	const { query } = context;

	if (!isAppSessionQuery(query)) {
		return {
			redirect: StoryblokAppConfigration.OAUTH_REDIRECT,
		};
	}

	const sessionStore = appSessionCookies(context);
	const appSession = await sessionStore.get(query);

	if (!appSession) {
		return {
			redirect: StoryblokAppConfigration.OAUTH_REDIRECT,
		};
	}

	const { spaceId, userId } = appSession;
	return {
		props: { spaceId, userId },
	};	
};