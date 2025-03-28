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
import  React, { useState } from "react";
import  { Box, FormControl, FormLabel, styled }  from '@mui/material'
import { DatePicker, DateValidationError, PickersLayout } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


type DueDatePickerProps = {
    handleDueDateChange: (dueDate: dayjs.Dayjs|null) => void;
    dueDate: number|undefined;
    isMachineTranslation?: boolean;
}

const DueDatePicker = ({handleDueDateChange, dueDate, isMachineTranslation}:DueDatePickerProps) => {

    const [error, setError] = useState(false);	
    const StyledPickersLayout:any = styled(PickersLayout)({
		'.MuiDayCalendar-root, .MuiPickersLayout-contentWrapper, .MuiDateCalendar-root': {
		  width: '250px',	
		  maxHeight: '290px',
		  height: '290px'	  
		}		
	})

    const handleError=(error: DateValidationError, value: dayjs.Dayjs|null)=>{    
        setError(!!(dueDate !== undefined && error));
    }

    if (isMachineTranslation)
        return <></>;

    return <Box component="section" sx={{ pb:4 }}>						
        <FormControl>															
            <FormLabel id="translation-date-label">Translation due date</FormLabel>
            <DatePicker 							
                value={dayjs.unix(Number(dueDate))}
                onChange={handleDueDateChange} 
                onError={handleError}
                slots={{layout: StyledPickersLayout}}  
                slotProps={{ 
                    textField: { 
                        size: 'small',                            
                        error: error
                        },	
                }} 
                disablePast={true} 	
            />
        </FormControl>
    </Box>;
}

export default DueDatePicker;
