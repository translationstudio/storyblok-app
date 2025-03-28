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
export type ApiResponse<T> =
	Omit<Response, "json"> & {
			status: number;
			json: () => T | PromiseLike<T>;
	  };

export interface Languages {
	id: string;
	name: string;
	source: string;
	targets: Array<string>;
	connector: string;
	machine: boolean;
	quota: string;
	"limit-to-cms-projects": Array<string>;
}

export interface Translations {
	source: string;
	target: string;
	"connector-project": string;
}

export interface TranslationRequest {	
	email: string;
	duedate?: number;
	title: string;
	entry_uid: string;
	spaceid: string;
	urgent: boolean;
	translations: Translations[];
	notifyUser: boolean;
}

export interface History {
	element: string;
	type: number;
	"source-language": string;
	"target-language": string;
	"time-insert": number;
	"time-export": number;
	"time-intranslation": number;
	"time-translated": number;
}
