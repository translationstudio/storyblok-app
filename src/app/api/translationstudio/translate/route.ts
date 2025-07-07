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
import { TranslationRequest, Translations } from "@/interfaces_types/translationstudio";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Logger from "@/utils/Logger";

type TranslationRequestTranslations = {
	"source": string,
	"target": string,
	"connector-id": string,
	"connector-project-id": string
}

function getConnectorProject(input: string) {
	const parts = input.split(".");
	return {
		id: parts[0],
		projectid: parts[1] ?? ""
	}
}

const createTranslationsPayload = function(list:Translations[])
{
    const res:TranslationRequestTranslations[] = [];

    for (let elem of list)
    {
        const con = getConnectorProject(elem["connector-project"]);
        res.push({
            source: elem.source,
            target: elem.target,
            "connector-id": con.id,
            "connector-project-id": con.projectid
        })

    }

    return res;
}

export async function POST(req:Request)
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
        if (appInfo === null || !appInfo.license)
            return NextResponse.json({ message: "cannot obtain license"}, { status: 400 }); 

        const payload:TranslationRequest = await req.json();
        if (!payload.title || !payload.entry_uid || !payload.translations || !Array.isArray(payload.translations) || payload.translations.length === 0)
            throw new Error("Invalid payload");

        const translationPayload = {
            spaceid: spaceid,
            space_title: space.name,
            entry_uid: payload.entry_uid,
            title: payload.title,
            urgent: payload.urgent === true,
            duedate: payload.duedate,
            email: payload.notifyUser === false ? "" : payload.email,
            translations: createTranslationsPayload(payload.translations)
        }
        
        const res = await fetch(StoryblokAppConfigration.URL + "/translationstudio/translate", {
            method: "POST",
            headers: {
                "X-license": appInfo.license,
                "Content-type": "application/json"
            },
            body: JSON.stringify(translationPayload)
        });

        if (res.ok)
            return new NextResponse(null, { status: 204 });

        const json = await res.json();
        if (json.message)
            return NextResponse.json(json, { status: res.status });
    }
    catch (err:any)
    {
        Logger.warn("Cannot obtain ts license",err.message ?? err);
    }

    return NextResponse.json({ message: "Cannot submit translation request"}, { status: 500 });
}