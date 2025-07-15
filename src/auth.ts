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
import { authHandler, AuthHandlerParams, sessionCookieStore } from '@storyblok/app-extension-auth';
import StoryblokAppConfigration from './StoryblokAppConfiguration';


(function(){ 
    const vars = [
        'EXTENSION_URL', 
        'NEXT_PUBLIC_EXTENSION_SLUG', 
        'NEXT_PUBLIC_EXTENSION_APP_ID',
        'EXTENSION_CLIENT_ID', 
        'EXTENSION_CLIENT_SECRET'
    ];
    
    const missing:string[] = [];

    vars.forEach((key) => 
    {
        if (!process.env[key])
            missing.push(key)
    });

    if (missing.length > 0)
        throw new Error("Environment variables missing: " + missing.join(", "));

    console.info("All env variables present.");
})();

const cookieName = 'auth';
export const authParams: AuthHandlerParams = {
	clientId: StoryblokAppConfigration.EXTENSION_CLIENT_ID,
	clientSecret: StoryblokAppConfigration.EXTENSION_CLIENT_SECRET,
	baseUrl: StoryblokAppConfigration.EXTENSION_URL,
	cookieName,
	successCallback: '/',
	errorCallback: '/401',
	endpointPrefix: '/api/connect',
};

export const appSessionCookies = sessionCookieStore(authParams);
export const handleConnect = authHandler(authParams);
