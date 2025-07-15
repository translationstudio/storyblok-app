import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";
import GetAppInformation from "./GetAppInformation";
import { GetSpaceAccessToen, GetSpaceInfo } from "./GetSpaceInfo";

export async function GetTranslationstudioLicense(headersList: ReadonlyHeaders|null)
{
    if (headersList === null)
        headersList = await headers()

    const spaceid = headersList.get('X-spaceid') ?? "";
    const spaceToken = await GetSpaceAccessToen(spaceid);
    if (!spaceToken)
        throw new Error("Cannot obtain space token");

    const space = await GetSpaceInfo(spaceToken);
    if (!space)
        throw new Error("cannot obtain space info");

    const appInfo = await GetAppInformation(spaceid, space.ownerAccessToken);
    if (appInfo?.license)
        return appInfo.license;

    return "";
}