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
export { getServerSideProps } from '@/utils/serverSideProps';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { useAutoHeight, useToolContext } from '@/hooks';

import { HomeProps, Languages, NotifyMessage as NotifyMessageType, TranslationRequest, Translations } from '@/interfaces_types';

import { LanguageTargetCheckboxes, History, DueDatePicker, Loader, UrgentCheckbox, NotifyMessage } from "@/components"

import  {Button, Box, Typography, Checkbox, FormControlLabel }  from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import dayjs from 'dayjs';
import { SendRounded } from '@mui/icons-material';

type LanguageMap = {
	[id:string]:Languages
}

type ConnectorMap = {
	[id:string] : Languages
}

const CreateConnectorMap = function(langs: Languages[])
{
	const map:LanguageMap = { };
	for (let elem of langs)
		map[elem.id] = elem;

	return map;
}

const getTranslations = (connectors:{[id:string]:boolean}, connectorMap:ConnectorMap) => {			
	const trans:Translations[] = []

	Object.keys(connectors)
		.forEach((id) => {
			const connector = connectorMap[id];
			if (!connector)
				return;

			for (let lang of connector.targets)
			{
				trans.push({
					source: connector.source,
					target: lang,
					"connector-project": connector.connector
				});
			}
		});

	return trans;
};

const Home = (props: HomeProps) => {			
	const { push } = useRouter();
	const toolContext = useToolContext();
	
	const spaceId = props.spaceId;
	const connectorMap = CreateConnectorMap(props.tsLanguageMappings);

	const [entryId, setEntryId] = useState("");
	const [entryTitle, setEntryTitle] = useState("");
	
	const [targetLanguageChecked, setTargetLanguageChecked] = useState<{[id: string]: boolean }>({});	
	const [ignoreNonAISettings, setIgnoreNonAISettings] = useState(true);
	const [urgent, setUrgent] = useState(true);	
	const [dueDate, setDueDate] = useState<number|undefined>();
	const [enableSubmit, setEnableSubmit] = useState(false);
	const [notifyMessage, setNotifyMessage] = useState<NotifyMessageType|null>(null);
	const [receiveEmails, setReceiveEmails] = useState(typeof props.userInfo?.email === "string" && props.userInfo.email !== "");

	const [loader, setLoader] = useState(false);

	const handleTargetChange = (id:string, checked:boolean) => 
	{					
		if (!id)
			return;

		if (checked)
			targetLanguageChecked[id] = true;
		else if (targetLanguageChecked[id])
			delete targetLanguageChecked[id];

		let hasNonAi = false;
		for (let key in targetLanguageChecked)
		{
			if (connectorMap[key] && targetLanguageChecked[key] && !connectorMap[key].machine)
			{
				hasNonAi = true;
				break;
			}
		}

		const hasSelection = Object.keys(targetLanguageChecked).length > 0;
	
		setEnableSubmit(hasSelection);
		setTargetLanguageChecked({ ...targetLanguageChecked });
		
		if (!hasNonAi)
		{
			setUrgent(true);
			setDueDate(undefined);
			setIgnoreNonAISettings(true);
		}
		else
			setIgnoreNonAISettings(false);
	};

	const handleUrgentChange = (event: React.ChangeEvent<HTMLInputElement>) => setUrgent(event.target.checked);

	const handleDueDateChange = (dueDate: dayjs.Dayjs|null) => {
		const time = dayjs(dueDate).unix();
		setDueDate(time > Date.now() ? time : undefined)
	}

	const handleResetForm = () => {
		setTargetLanguageChecked({});				
		setDueDate(undefined);	
		setUrgent(true);
		setEnableSubmit(false);
		setNotifyMessage(null);
	}

	const handleSettings = () => {
		setLoader(true);
		push('/configuration?spaceId='+props.spaceId+'&userId='+props.userId);
	}

	useEffect(() => {		
		if (toolContext) {		
			setEntryId(toolContext.story.id.toString())
			setEntryTitle(toolContext.story.name);
			setLoader(false);
		}
	}, [toolContext, setEntryId, setEntryTitle, setLoader]);

	// actual TS request
	const handleSubmit = () => 
	{
		setNotifyMessage({type: 'info', withIcon: true, message: "Sending translation request..."});
		setEnableSubmit(false);

		const payload: TranslationRequest = {		
			entry_uid: entryId, // UID of the entry
			email: (props.userInfo.email ?? ""), // user email
			title: entryTitle, // entry title
			spaceid: spaceId,
			urgent: urgent,
			duedate: dueDate ?? 0,
			notifyUser: ignoreNonAISettings === false && receiveEmails,
			translations: getTranslations(targetLanguageChecked, connectorMap)
		};

		fetch("/api/translationstudio/translate", {
			method: "POST",
			headers: {
				"X-translationstudio": "storyblok",
				"X-spaceid": props.spaceId,
			},
			body: JSON.stringify(payload),
		})
		.then((res) => {
			if (!res.ok)
				throw new Error("Could not submit request");

			setNotifyMessage({type: 'success', withIcon: true, message: "Translation request sent successfully!"});
		})
		.catch(err => {
			console.error(err);
			setNotifyMessage({type: 'error', withIcon: true, message: "Could not submit request"});
		})
		.finally(() => setEnableSubmit(true));
	};

	useAutoHeight();

	if (!entryId || loader || !spaceId || !toolContext)
	{
		return <main>
			<Loader />
		</main>
	}

	if (props.tsLanguageMappings.length === 0)
	{
		return <main>
			<NotifyMessage notifyMessage={{ message: "translationstudio has not been setup yet.", type: "warning"}} />
		</main>
	}

	return (
		<>			
			<Head>
				<title>translationstudio</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>			
			<main>
				<Box component="section" sx={{ }}>
					<Box sx={{ pb:2 }}>							
						<SettingsIcon onClick={() => { handleSettings(); }} sx={{position:'absolute', right: '5px', cursor: 'pointer'}}/>
						<Typography sx={{ }} variant="body1" gutterBottom>Translate {entryTitle ? <b>{entryTitle}</b> : <></>} using</Typography>
					</Box>						

					<LanguageTargetCheckboxes handleTargetChange={handleTargetChange} 
						tsLanguageMappings={props.tsLanguageMappings}  
						targetLanguageChecked={targetLanguageChecked} 
					/>
					
					{!ignoreNonAISettings && (<>
						<DueDatePicker handleDueDateChange={handleDueDateChange} isMachineTranslation={false} dueDate={dueDate} />
						<UrgentCheckbox handleUrgentChange={handleUrgentChange} isMachineTranslation={false} urgent={urgent} />
						{props.userInfo?.email && <Box sx={{ pb:4, pl: 1 }}>
								<FormControlLabel
									control={<Checkbox onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReceiveEmails(event.target.checked)}
										checked={receiveEmails}
										inputProps={{ 'aria-label': 'controlled' }} />}
									label="Receive e-mail notifications"
								/>
							</Box>}
					</>)}

					<Box sx={{ pb:4 }}>
						{!notifyMessage && (
							<Button disabled={!enableSubmit} onClick={() => handleSubmit()} startIcon={<SendRounded />} type="button" variant="contained" size="small" sx={{ mt: 2, mr: 5 }}>
								{urgent ? "Translate immediately" : "Translate"}
							</Button>
						)}
						{notifyMessage && (<>
							<NotifyMessage notifyMessage={notifyMessage}/>								
							<Box sx={{display:"flex", justifyContent:"center", pr:2}}>
								<Button onClick={() => handleResetForm()} type="button" variant="contained" size="small" sx={{mt:2}}>Start new translation request</Button> 
							</Box>
						</>)}
					</Box>
					<History spaceId={spaceId} entryId={entryId} />
				</Box>
			</main>			
		</>
	);
}
export default Home;
