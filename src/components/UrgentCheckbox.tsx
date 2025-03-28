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
import  {Box, Checkbox, FormControlLabel }  from '@mui/material'


type UrgentCheckboxProps = {
    handleUrgentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    urgent: boolean;
    isMachineTranslation?: boolean
}

const UrgentCheckbox = ({handleUrgentChange, urgent, isMachineTranslation}:UrgentCheckboxProps) => {
    if (isMachineTranslation)
        return <></>;

    return <Box sx={{ pb:4, pl: 1 }}>
        <FormControlLabel 
            control={<Checkbox onChange={handleUrgentChange} 
            checked={urgent} 
            inputProps={{ 'aria-label': 'controlled' }}/>} 
            label="This is an urgent request" 
        />
    </Box>;
}

export default UrgentCheckbox;
