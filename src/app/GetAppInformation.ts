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
import StoryblokAppConfigration from "../StoryblokAppConfiguration";

export function GetAppId()
{
    return StoryblokAppConfigration.EXTENSION_APP_ID;
}

export default async function GetAppInformation(spaceid:string, token:string)
{
    const appid = GetAppId();
    if (appid === "")
    {
        console.warn("No app id set");
        return null;
    }
    
    const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${spaceid}/app_provisions/${appid}`, {
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        }
    });

    if (res.status === 200)
    {
        const json = await res.json();
        if (json.app_provision?.slug && json.app_provision?.space_level_settings?.license)
        {
            return {
                slug: json.app_provision.slug,
                id: json.app_provision.app_id,
                license: json.app_provision.space_level_settings.license,
            }
        }
    }

    return null;
}