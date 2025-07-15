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
import React from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import { isAppSessionQuery } from '@storyblok/app-extension-auth';
import { appSessionCookies } from '@/auth';
import { getTranslationstudioConfiguration } from '@/utils/serverSideProps'

import { TSConfiguration } from "@/interfaces_types";
import { NotifyMessage as NotifyMessageType } from '@/interfaces_types';
import { requestCMSData } from '@/utils/storyblok'
import { NotifyMessage } from "@/components"

import { Button, Box, LinearProgress, TextField, Typography, Grid } from '@mui/material'
import { ChevronBackIcon } from "@storyblok/mui";
import StoryblokAppConfigration from "@/StoryblokAppConfiguration";
import TranslationstudioLogo, { TranslationstudioLoading } from "@/utils/Logo";
import { SaveRounded } from "@mui/icons-material";
import { useAutoHeight } from "@/hooks";

const Configuration = (props: { translationStudioConfiguration: TSConfiguration } & { accessToken: string, spaceId: string, userId: string, sbOwnerToken: string } & { setLocale: Function }) => {
	const { push } = useRouter();

	const [license, setLicense] = useState("");
	const [licensePrev, setLicensePrev] = useState("");
	const [licenseValid, setLicenseValid] = useState(false)
	const [savingConfig, setSavingConfig] = useState<boolean>(false);
	const [notifyMessages, setNotifyMessages] = useState<NotifyMessageType[]>([]);
	const [loader, setLoader] = useState(false);
	const [pending, setPending] = useState(true);

	/*
		USE EFFECT
	*/
	useEffect(() => {

		fetch("/api/translationstudio/props", {
			method: "GET",
			headers: {
				"X-translationstudio": "storyblok",
				"X-spaceid": props.spaceId
			}
		})
			.then(res => {
				if (res.ok)
					return res.json();

				throw new Error("Could not read configuration")
			})
			.then(licenseData => {
				if (licenseData?.license !== "") {
					setLicenseValid(true);
					setLicense(licenseData.license);
					setLicensePrev(licenseData.license);
				}
			})
			.catch(console.warn)
			.finally(() => setPending(false));
	}, [setLicense, setLicenseValid, setLicensePrev, setPending]);

	/*
		FORM HANDLER
	*/
	const closeConfiguration = async () => {
		setLoader(true);
		push('/home?spaceId=' + props.spaceId + '&userId=' + props.userId);
	}
	const saveValues = () => {
		if (!license || license === licensePrev)
			return;

		setPending(true);
		setSavingConfig(true);
		setNotifyMessages([]);
		fetch("/api/translationstudio/license", {
			headers: {
				"X-license": license,
				"X-translationstudio": "storyblok"
			}
		})
			.then((res) => {
				if (!res.ok)
					throw new Error("License is invalid");

				return fetch("/api/translationstudio/props", {
					method: "POST",
					headers: {
						"X-spaceid": props.spaceId,
						"X-translationstudio": "storyblok"
					},
					body: JSON.stringify({ license: license })
				});
			})
			.then(res => {
				if (res.ok)
					return true;

				return res.json();
			})
			.then(val => {
				if (val === true)
				{
					setLicenseValid(true);
					setLicensePrev(license);
					setNotifyMessages([{ type: 'success', message: "License updated successfully" }]);
				}
				else if (typeof val.message === "string")
					throw new Error(val.message)
			})
			.catch((e) => {
				const msg = typeof e.message === "string" && e.message ? e.message : "Error by creating/updating of datasource entry";
				setNotifyMessages([{ type: 'error', message: msg }]);
			})
			.finally(() => {
				setSavingConfig(false)
				setPending(false);
			});
	}

	useAutoHeight();
	
	return (
		<>
			<Head>
				<title>TranslationStudio plugin for Storyblok - Configuration</title>
				<meta name="description" content="Plugin to handle translation requests from Storyblok CMS to TranslationStudio" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main style={{ padding: "2em" }}>
				<Grid container rowGap={2}>
					{loader ?
						<TranslationstudioLoading text="Loading license" />
						:
						<TranslationstudioLogo />
					}
					<Grid item xs={12} style={{ position: "relative" }}>
						{licenseValid && (<ChevronBackIcon onClick={() => { closeConfiguration(); }} sx={{ position: 'absolute', left: '0', cursor: 'pointer' }} />)}
						<Typography variant="h2" gutterBottom style={{ paddingLeft: licenseValid ? "30px" : "0" }}>{"Configuration"}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ pb: 2 }}>
							<Box
								component="form"
								noValidate
								autoComplete="off"
							>
								<TextField
									required
									label={"translationstudio license"}
									placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
									fullWidth
									variant="filled"
									multiline
									rows={3}
									disabled={pending || loader}
									value={license}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLicense(event.target.value.trim())}
								/>
							</Box>
						</Box>

						<Box sx={{ pb: 2 }}>
							{notifyMessages.length > 0 && notifyMessages.map((item, idx) => <Box sx={{ mt: 2 }} key={"n" + idx}>
								<NotifyMessage notifyMessage={item} />
							</Box>
							)}

							<Box sx={{ mt: 6 }}>
								<Button disabled={!license || license === licensePrev || savingConfig || loader } type="button"
								 onClick={() => saveValues()} variant="contained" 
								 size="small" startIcon={<SaveRounded />}>
									{licensePrev === "" ? "Save license" : "Update license"}
								</Button>
							</Box>

							{savingConfig && <Box sx={{ mt: 6 }}><LinearProgress /></Box>}
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="caption">If you do not yet have a license, please visit your account at <a href="https://account.translationstudio.tech" target="_blank">account.translationstudio.tech</a>. Additional information can be found at <a href="https://translationstudio.tech" target="_blank">translationstudio.tech</a>.</Typography>
					</Grid>
				</Grid>
			</main>
		</>
	);
}

export default Configuration;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { query } = context;

	if (!isAppSessionQuery(query)) {
		return {
			redirect: StoryblokAppConfigration.OAUTH_REDIRECT,
		};
	}

	const sessionStore = appSessionCookies(context);
	const appSession = await sessionStore.get(query);

	if (!appSession) {
		return {
			redirect: StoryblokAppConfigration.OAUTH_REDIRECT,
		};
	}

	const { accessToken, spaceId, userId } = appSession;

	// load space data
	const space = await requestCMSData(accessToken, { key: 'GET_SPACE_INFO' });

	// load translationstudio configuration values form storyblock datasource
	const translationStudioConfiguration = await getTranslationstudioConfiguration(spaceId, space.space.owner.access_token);

	return {
		props: { translationStudioConfiguration, accessToken, spaceId, userId, sbOwnerToken: space.space.owner.access_token },
	};
};
