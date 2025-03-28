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
import { cookies } from "next/headers";

export async function GetSpaceInfo(oauthToken:string)
{
    if (!oauthToken)
    {
        console.warn("No oauth token provided");
        return null;
    }
    
    const response = await fetch("https://api.storyblok.com/oauth/space_info", {
        headers: {
            Authorization: `Bearer ${oauthToken}`,
        },
    });

    if (!response.ok)
    {
        console.warn("Cannot get space data");
        return null;
    }

    const json = await response.json();
    const spaceid = json?.space?.id ? "" + json?.space?.id : "";
    const name = json?.space?.name ?? ""
    const ownerAccessToken = json?.space?.owner.access_token ?? "";

    return {
        id: spaceid,
        name: name,
        ownerAccessToken: ownerAccessToken
    }
}

export function GetSpaceAccessToen(spaceid:string) : string
{
    const cookieStore = cookies()
    const oauthToken = cookieStore.get("auth")?.value ?? "";
    if (!oauthToken)
    {
        console.warn("Cannot get auth from cookie");
        return "";
    }
       
    try
    {
        if (!spaceid)
            return "";

        const parts = oauthToken.split(".");
        if (parts.length !== 3)
            return "";
    
        const data = Buffer.from(parts[1], "base64").toString("utf-8");
        if (!data)
            return "";

        const json = JSON.parse(data)
        if (!json.data?.sessions || !Array.isArray(json.data.sessions) || json.data.sessions.length === 0)
            return "";

        for (let el of json.data.sessions)
        {
            if (el.spaceId + "" === spaceid && el.accessToken)
                return el.accessToken;
        }

        throw new Error("Cannot find access token");
    }
    catch (err:any)
    {
        console.error(err.message ?? err)
    }

    return "";
}