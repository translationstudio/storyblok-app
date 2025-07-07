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
import { isAppSessionQuery } from '@storyblok/app-extension-auth';
import { appSessionCookies } from '@/auth';
import { isAdmin, requestCMSData } from '@/utils';
import { Collaborators, Collaborator, UserInfo, Space } from '@/interfaces_types';
import GetAppInformation from '@/app/GetAppInformation';
import StoryblokAppConfigration from '@/StoryblokAppConfiguration';

export const getServerSideProps: GetServerSideProps = async (context) => {		
	const { query } = context;

	if (!isAppSessionQuery(query)) {
		return {
			redirect: StoryblokAppConfigration.OAUTH_REDIRECT
		};
	}

	const sessionStore = appSessionCookies(context);
	const appSession = await sessionStore.get(query);

	if (!appSession) {
		return {
			redirect: StoryblokAppConfigration.OAUTH_REDIRECT,
		};
	}

	const { accessToken, spaceId, userId } = appSession;
	try {
		// load space data
		const space = await requestCMSData(accessToken, {key: 'GET_SPACE_INFO'});

		// load translationstudio configuration values form storyblock datasource	
		const license = await getTranslationstudioConfiguration(spaceId, space.space.owner.access_token);		
		if (!license)
			throw("License missing");
	
		// load languageMappings from translationstudio	
		const tsLanguageMappings = await getLanguageMapping(license);
				
		// load userinfo (email is not included in userinfo)
		const userInfo:UserInfo = await requestCMSData(accessToken, {key: 'GET_USER_INFO'});

		// get email from owner or collaborator and add it to userinfo 	
		await setCurrentUserEmail(userId, space.space, userInfo, accessToken);	

		return {
			props: { userInfo, ...space, "region": appSession.region, spaceId, license, tsLanguageMappings, userId, isAdmin: isAdmin(appSession) },
		};	
	}
	catch (err) {
		console.warn("Could not initiate serverSideProps. Possible wrong/missing CMS configuration");
        console.error(err);	
		
		// let´s redirect to configuration page
		return {
			redirect: {
				permanent: false,
				destination: "/configuration?spaceId=" + spaceId + "&userId=" + userId + "&noRedirect=true"
			}
		}	
	}
};


const setCurrentUserEmail = async (userId: number, space: Space, userInfo: UserInfo, accessToken:string) => {			
	if (space.owner.id === userId) {
		userInfo['email'] = space.owner.email;
	}
	else {	
		const collaborators:Collaborators = await requestCMSData(accessToken, {key: 'GET_COLLABORATORS', params: {":space_id": space.id}})??"";	
		collaborators.collaborators.forEach((collaborator:Collaborator) => {			
			if (collaborator.user_id === userId) {
				userInfo['email'] = collaborator.user.userid;
			}			
		});
	}
}

const getLanguageMapping = async function(license:string)
{
	if (!license)
		return [];
	
	try
    {
        const res = await fetch(StoryblokAppConfigration.URL + "/translationstudio/mappings", {
            headers: {
                "X-license": license
            }
        });

        if (res.status === 200)
            return await res.json();
        
        const json = await res.json();
        if (json.message)
            console.warn(json.message);
    }
    catch (err:any)
    {
        console.warn(err.message ?? err);
    }

	return [];
}

export const getTranslationstudioConfiguration = async (stack_id:number, stack_management_token:string) => {	
	try {
		const data = await GetAppInformation(""+stack_id, stack_management_token);
		if (data)
			return data.license;
	}
	catch (e) {
		console.error(e);
	}

	return "";
};