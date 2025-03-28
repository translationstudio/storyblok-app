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
const StoryblokAppConfigration = {
    URL: process.env["TRANSLATIONSTUDIO_URL"] ?? "https://storyblok.translationstudio.tech",
    EXTENSION_URL: process.env["EXTENSION_URL"] ?? "",
    EXTENSION_APP_ID: process.env["NEXT_PUBLIC_EXTENSION_APP_ID"] ?? "",
    EXTENSION_CLIENT_ID: process.env["EXTENSION_CLIENT_ID"] ?? "",
    EXTENSION_CLIENT_SECRET: process.env["EXTENSION_CLIENT_SECRET"] ?? "",
    EXTENSION_SLUG: process.env["NEXT_PUBLIC_EXTENSION_SLUG"] ?? "",
    APP_ORIGIN: "https://app.storyblok.com",

    OAUTH_REDIRECT: {
        permanent: false,
        destination: (process.env["EXTENSION_URL"] ?? "") + '/api/connect/storyblok',
    },
};

export default StoryblokAppConfigration;