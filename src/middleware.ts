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
"use server"

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isSecuredRoute = function (uri: string) {
    return uri.startsWith("/api/translationstudio");
}

const verifyApiRoutePreconditions = function(request: NextRequest)
{
    try
    {
        const head = request.headers;
        if (head?.get("X-translationstudio") !== "storyblok")
        {
            console.warn("X-translationstudio attribute is invalid");
            return false;
        }
    
    }
    catch (err)    
    {
        console.error(err);
    }
    return true;
}

const hasOauthSession = async function(request: NextRequest)
{
    try
    {
        const oauthToken = request.cookies?.get("auth")?.value ?? "";
        if (!oauthToken)
            return false;
           
        const parts = oauthToken.split(".");
        const data = parts.length !== 3 ? "" : Buffer.from(parts[1], "base64").toString("utf-8");
        if (!data)
            return false;

        const json = JSON.parse(data)
        return json.data?.sessions && Array.isArray(json.data.sessions) && json.data.sessions.length > 0;
    }
    catch (err)
    {
        /* ignore */
    }

    return false;
}

export async function middleware(request: NextRequest) {

    
    /** generic cross site scripting header evaluation to prevent CSRF calls to API */
    const uri = request.nextUrl.pathname.toLowerCase();
    if (!uri || !isSecuredRoute(uri))
        return NextResponse.next();

    if (!verifyApiRoutePreconditions(request))
        return NextResponse.json({ message: "Cannot grant access to api"}, { status: 401 });
        
    if (!await hasOauthSession(request))
        return NextResponse.json({ message: "Not a session-based request." }, { status: 401 });

    return NextResponse.next();
}