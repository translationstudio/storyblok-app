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
import GetAppInformation from "@/app/GetAppInformation";
import { GetSpaceAccessToen, GetSpaceInfo } from "@/app/GetSpaceInfo";
import StoryblokAppConfigration from "@/StoryblokAppConfiguration";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest)
{
    try{
        const elementuid = request?.nextUrl?.searchParams.get("element");
        if (typeof elementuid !== "string" || elementuid === "")
            return NextResponse.json({ message: "Invalid element"}, { status: 400 }); 

        const headersList = headers()
        const spaceid = headersList.get('X-spaceid') ?? "";
        const spaceToken = GetSpaceAccessToen(spaceid);

        if (!spaceToken)
            return NextResponse.json({ message: "cannot obtain space token"}, { status: 400 }); 

        const space = await GetSpaceInfo(spaceToken);
        if (!space)
            return NextResponse.json({ message: "cannot obtain space info"}, { status: 400 }); 

        const appInfo = await GetAppInformation(spaceid, space.ownerAccessToken);
        if (appInfo === null || !appInfo.license)
            return NextResponse.json({ message: "cannot obtain license"}, { status: 400 }); 
       
        const res = await fetch(StoryblokAppConfigration.URL + "/translationstudio/history/element", {
            method: "POST",
            headers: {
                "X-license": appInfo.license,
                "X-element": elementuid
            }
        });

        if (res.status === 404)
            return NextResponse.json([]);

        if (res.ok)
            return NextResponse.json(await res.json());

        if (!res.ok)
        {
            const json = await res.json();
            throw new Error(json.message ?? "Could not fetch history");
        }
    }
    catch (err:any)
    {
        console.warn(err.message ?? err);
    }
    
    return NextResponse.json({ message: "Could not fetc history"}, { status: 500 });
}