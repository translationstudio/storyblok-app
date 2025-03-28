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
import { NotifyMessage as NotifyMessageType } from '@/interfaces_types';
import  {Box, Typography, }  from '@mui/material'
import { Done, ErrorOutline, WarningAmber, InfoOutlined } from '@mui/icons-material/';

type NotifyMessageProps = {
    notifyMessage: NotifyMessageType;
}

const Icon = function(props:{ notifyMessage:NotifyMessageType }) 
{        
    if (props.notifyMessage?.withIcon !== true)
        return

    switch(props.notifyMessage.type) {
        case "success":
            return <Done sx={{mr:2}}/>
        case "warning":
            return <WarningAmber sx={{mr:2}}/>
        case "error":
            return <ErrorOutline sx={{mr:2}}/>     
        default:
            return <InfoOutlined sx={{mr:2}}/>
    }
}
export default function NotifyMessage({notifyMessage}:NotifyMessageProps) 
{
    if ( !notifyMessage ) 
        return <></>    
    
    const customBgColor = notifyMessage.type ? notifyMessage.type + '.main' : "primary.main";
    return <Box color='white' sx={{display: notifyMessage.message ?  'flex' : 'none', mr:2, mb:2, pt:1, pl:2, pr:2, borderRadius: 1, bgcolor: customBgColor}}>                
        <Icon notifyMessage={notifyMessage} />
        <Typography  variant="body1" gutterBottom>{notifyMessage.message}</Typography>
    </Box>;
}
