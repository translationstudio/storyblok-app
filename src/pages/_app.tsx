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
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { enUS, deDE } from '@mui/x-date-pickers/locales'

import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material'
import { lightTheme } from '@storyblok/mui'

const locales = ['en', 'en-GB', 'de'];
const localTextMapper = {"en": enUS, "en-GB": enUS, "de": deDE}
type LocaleKey = (typeof locales)[number];
export default function App({ Component, pageProps }: AppProps) {
	const [locale, setLocale] = useState<LocaleKey>('en');
	const [localeText, setLocaleText] = useState(localTextMapper['en'].components.MuiLocalizationProvider.defaultProps.localeText);

	const handleSetLocale = ( locale:string ) => {
		let tempLocale = "";
		if ( locales.includes(locale) ) {
			setLocale(locale);
			tempLocale=locale;
		} else if (locales.includes(locale.substring(0,2))) {
			setLocale(locale.substring(0,2));
			tempLocale=locale.substring(0,2);
		}
		if ( tempLocale !== "" && localTextMapper[tempLocale as keyof typeof localTextMapper] ) {
			setLocaleText(localTextMapper[tempLocale as keyof typeof localTextMapper].components.MuiLocalizationProvider.defaultProps.localeText);
		}
	}
	return <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale} localeText={localeText}>
				<ThemeProvider theme={lightTheme}>
					<CssBaseline />
					<GlobalStyles
						styles={{
							body: { backgroundColor: 'transparent' },
						}}
					/>
					<Component {...pageProps} setLocale={handleSetLocale}/>
				</ThemeProvider>
			</LocalizationProvider>;
}
