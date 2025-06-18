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

import React, { useEffect, useState, useMemo } from 'react';
import { History as HistoryType } from "@/interfaces_types";
import { Box, Typography }  from '@mui/material'

type HistoryProps = {
    spaceId:string;
    entryId:string;
}

const dateToString = function(num:number)
{
    if (num === 0)
        return "";

    const date = new Date(num);
    return date.toLocaleString();
}

const DisplayHistory = function( { history }: { history:HistoryType[] })
{
    if (history.length === 0)
        return <></>;
    
    return <>
        {history.map((item, idx) => { 									                            
            const additionalInfo =	  item["time-translated"]    != 0   ? "translated on " + dateToString(item["time-translated"])
                                    : item["time-intranslation"] != 0   ? "in translation since " + dateToString(item["time-intranslation"])
                                    : item["time-export"]        != 0   ? "data exported on " + dateToString(item["time-export"])
                                    : item["time-insert"]        != 0   ? "translation job added on " + dateToString(item["time-insert"])
                                    : "unknown status";

            return <Typography key={"history-entry"+idx} variant="body1" gutterBottom>
                        {item["element"]} {additionalInfo}													
                </Typography> 
                                            
        })}
    </>;
}

const History = ( {spaceId, entryId }:HistoryProps ) => {
    const [history, setHistory] = useState<HistoryType[]>([]);

    useEffect(() => {
		fetch("/api/translationstudio/history?element=" + entryId, {
            headers: {
               "X-translationstudio": "storyblok",
               "X-spaceid": spaceId
            }
        })
        .then((data) => {
            if (data.ok)
                return data.json();
        })
        .then((list) => setHistory(list))
        .catch(console.error);

	}, [entryId, setHistory]);

    if (history.length === 0)
    {
        return <Box sx={{pb:4, pt: 2}}>
            <Typography variant="body1" gutterBottom>This entry has not been translated, yet.</Typography>
        </Box>
    }

    return <Box sx={{pb:4, pt: 2}}>
        <Typography variant="subtitle1" gutterBottom>Tranlsation history</Typography>
        <DisplayHistory history={history} />						
    </Box>;
}

export default History;
