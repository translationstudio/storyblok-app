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
import { GetAppId } from '@/app/GetAppInformation';
import { GetSpaceAccessToens, GetSpaceInfo } from '@/app/GetSpaceInfo';
import { GetTranslationstudioLicense } from '@/app/GetTranslationstudioLicense';
import Logger from '@/utils/Logger';
import { headers } from 'next/headers'
import { NextResponse } from 'next/server';

export async function GET()
{
    try
    {
        const license = await GetTranslationstudioLicense(null)
        return NextResponse.json({ license: license });
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

        const spaceToken = await GetSpaceAccessToens(spaceid);
        if (spaceToken.length === 0)
            return NextResponse.json({ message: "cannot obtain space token"}, { status: 400 }); 

        const space = await GetSpaceInfo(spaceToken[0]);
        if (!space)
            return NextResponse.json({ message: "cannot obtain space info"}, { status: 400 }); 

        const appInfo = GetAppId();

        const payload = await req.json();
        const license = payload.license;
        if (!license)
            return NextResponse.json({ message: "license is missing"}, { status: 400 });   

        for (let token of spaceToken)
        {
            const res = await fetch(`https://mapi.storyblok.com/v1/spaces/${spaceid}/app_provisions/${appInfo}`, {
                method: "PUT",
                cache: "no-cache",
                headers: {
                    "Authorization": "Bearer " + token,
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

            Logger.warn(`Could not save license at https://mapi.storyblok.com/v1/spaces/${spaceid}/app_provisions/${appInfo}. Status code is ${res.status}`);
        }

        throw new Error("Could not save license");
    }
    catch (err:any)
    {
        Logger.error(err.message ?? err);

        if (err.message)
            return NextResponse.json({ message: err.message}, { status: 500 });
        else
            return NextResponse.json({ message: "Could not save configuration"}, { status: 500 });
    }   
}