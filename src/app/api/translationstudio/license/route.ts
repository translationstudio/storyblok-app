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
import StoryblokAppConfigration from "@/StoryblokAppConfiguration";
import Logger from "@/utils/Logger";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET()
{
    const URL = StoryblokAppConfigration.URL + "/translationstudio/authorize"

    try
    {
        const headersList = await headers();
        const license = headersList.get("X-license") ?? "";

        if (!license)
            return NextResponse.json({ message: "license is invalid"}, { status: 400 }); 

        const res = await fetch(URL, {
            cache: "no-cache",
            method: "GET",
            headers: {
                "X-license": license
            }
        });

        if (res.ok)
            return new NextResponse(null, { status: 204 });

        Logger.warn("License validation failed: " + res.status);
    }
    catch (err:any)
    {
        Logger.warn(err.message ?? err);
    }

    return NextResponse.json({ message: "cannot validate license"}, { status: 500 });
}