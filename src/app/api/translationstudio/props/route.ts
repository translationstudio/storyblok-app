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
import GetAppInformation, { GetAppId } from '@/app/GetAppInformation';
import { GetSpaceAccessToen, GetSpaceInfo } from '@/app/GetSpaceInfo';
import Logger from '@/utils/Logger';
import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server';

export async function GET()
{
    try
    {
        const headersList = await headers()
        const spaceid = headersList.get('X-spaceid') ?? "";
        const spaceToken = await GetSpaceAccessToen(spaceid);
        if (!spaceToken)
            return NextResponse.json({ message: "cannot obtain space token"}, { status: 400 }); 

        const space = await GetSpaceInfo(spaceToken);
        if (!space)
            return NextResponse.json({ message: "cannot obtain space info"}, { status: 400 }); 

        const appInfo = await GetAppInformation(spaceid, space.ownerAccessToken);
        if (appInfo)
        {
            const license = appInfo.license ?? "";
            return NextResponse.json({ license: license });
        }
    }
    catch (err:any)
    {
        Logger.warn("Cannot obtain ts license",err.message ?? err);
    }

    return NextResponse.json({ message: "Cannot get configuration data"}, { status: 500 });
}


export async function POST(req:Request)
{
    try{
        const headersList = await headers()
        const spaceid = headersList.get('X-spaceid') ?? "";

        const cookieStore = await cookies()
        const oauthToken = cookieStore.get("auth")?.value ?? "";
        
        const spaceToken = await GetSpaceAccessToen(spaceid);
        if (!spaceToken)
            return NextResponse.json({ message: "cannot obtain space token"}, { status: 400 }); 

        const space = await GetSpaceInfo(spaceToken);
        if (!space)
            return NextResponse.json({ message: "cannot obtain space info"}, { status: 400 }); 

        const appInfo = GetAppId();

        const payload = await req.json();
        const license = payload.license;
        if (!license)
            return NextResponse.json({ message: "license is missing"}, { status: 400 }); 

        const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${spaceid}/app_provisions/${appInfo}`, {
            method: "PUT",
            headers: {
                "Authorization": space.ownerAccessToken ?? oauthToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                app_provision: {
                    space_level_settings: {
                        "license": license
                    }
                }
            })
        });
        
        if (res.ok)
            return new NextResponse(null, { status: 204 });

        const errorMessage = "Could not save license: " + res.status;
        const err = await res.json();
        if (Array.isArray(err))
            throw new Error(errorMessage + ": " + err.join("."));

        throw new Error(errorMessage + (err.message ?? err));
    }
    catch (err:any)
    {
        Logger.error("Could not save configuration. ", err.message ?? err);
    }

    return NextResponse.json({ message: "cannot get data"}, { status: 500 });
}