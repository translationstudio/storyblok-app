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
import { RequestKey } from '@/interfaces_types';

const REQUEST_URLS:any = {
    GET_COLLABORATORS:  	"https://app.storyblok.com/v1/spaces/:space_id/collaborators",	
	GET_USER_INFO:      	"https://api.storyblok.com/oauth/user_info",
	GET_SPACE_INFO:     	"https://api.storyblok.com/oauth/space_info",
	GET_DATASOURCES:		"https://app.storyblok.com/v1/spaces/:space_id/datasources?search=:datasource_search_string",
	GET_DATASOURCE_ENTRIES: "https://app.storyblok.com/v1/spaces/:space_id/datasource_entries?datasource_slug=:datasource_slug",
	
	POST_CREATE_DATASOURCE: 		"https://app.storyblok.com/v1/spaces/:space_id/datasources/",
	POST_CREATE_DATASOURCE_ENTRY: 	"https://app.storyblok.com/v1/spaces/:space_id/datasource_entries",
	PUT_UPDATE_DATASOURCE_ENTRY: 	"https://app.storyblok.com/v1/spaces/:space_id/datasource_entries/:datasource_entry_id"	
}

export const requestCMSData = async (accessToken: string, requestKey: RequestKey) => {
	try {
		if ( !REQUEST_URLS[requestKey.key] ) {
			throw new Error(`No URL registered for fetch-key: ${requestKey.key}`);
		}

		let requestUrl = REQUEST_URLS[requestKey.key];
		if (requestKey.params) {
			Object.entries(requestKey.params).forEach(([key, value]) => {
				requestUrl = requestUrl.replace(key, value);			
			});
		}

		let response:Response;				
		if ( requestKey.requestType === "POST" || requestKey.requestType === "PUT" ) {	
			response = await fetch(requestUrl, {
				method: requestKey.requestType,
				headers: {
				  Authorization: `Bearer ${accessToken}`,
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestKey.payload ?? {}),
			  });
		}
		else  {
			// default is a GET request
			response = await fetch(requestUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
		}

		if (!response.ok) {
			throw new Error(`Request failed to URL: ${requestUrl} with status: ${response.status}`);
		}

		if ( response.status === 204) {
			return true;
		}
		else {
			return await response.json();
		}		
	} catch (error) {
		console.error('Failed to request CMS data:', error);
	}

	return null;
};

