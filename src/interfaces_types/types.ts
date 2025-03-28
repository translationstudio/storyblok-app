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
import { Languages } from "./translationstudio";

export type Story = {
	name: string;
	updated_at: string;
	content: unknown;
	published: boolean;
	slug: string;
	id: number;
	// partial type definition
};

export type ToolContext = {
	action: 'get-context';
	language: string;
	story: Story;
};

export type User = {
	id: number,
	friendly_name: string
};

export type UserInfo = {
	user: User;
	email?: string;
collaborators: any
};

export type Language = {
	code:string, 
	name: string
}

export type Space = {		
	id:number,
	languages: [Language],
	owner: {
		id: number,
		email: string,
		access_token: string
	}	
}

export type Collaborator = {
	user_id: number,
	user: {
		userid: string
	}
}

export type Collaborators = {
	collaborators: [Collaborator]
}

export type Datasource = {
	id: number,
	name: string,
	slug: string,

}

export type Datasources = {
	datasources: Datasource[]
}

export type DatasourceEntry = {
	id: number,
	name: string,
	value: string
}

export type DatasourceEntries = {
	datasource_entries: DatasourceEntry[]
}


export type LanguageMapping = {
	"connector-id": string;	
	"display-name": string;
	"id": string;
	"source-language": string;
	"target-languages":	[string];
}

export type TSConfiguration = {	
	slug: string;
	id: string;
	conf: string;
}

export type HomeProps = {
	userInfo: UserInfo;	
	space: Space;
	spaceId: string;
	userId: string;
	isAdmin: boolean;
	license: string;				
	tsLanguageMappings: Languages[];
	setLocale: Function;
};

export type RequestKey = {
	key: string,
	params?: {},
	requestType?: 'GET'|'POST'|'PUT',
	payload?: {}
};

export type NotifyMessage = {
	type?: 'info'|'success'|'warning'|'error';
	withIcon?: boolean;
	message?: string;
}|undefined
