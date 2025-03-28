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
import { Languages } from '@/interfaces_types';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Typography } from '@mui/material'


type LanguageTargetCheckboxesProps = {
    handleTargetChange: (id:string, checked:boolean) => void;
    tsLanguageMappings: Languages[];
    targetLanguageChecked: { [key: string]: boolean };
}

const LanguageTargetCheckboxes = ({ handleTargetChange, tsLanguageMappings, targetLanguageChecked }: LanguageTargetCheckboxesProps) => {
    if (tsLanguageMappings.length === 0) {
        return <></>
    }

    return <Box component="section" sx={{ pb: 4 }}>
        <FormControl>
            <FormLabel id="checkbox-buttons-target-language-group-label">Translation settings</FormLabel>
            <Box sx={{ pl: 1 }}>
                <FormGroup>
                    {tsLanguageMappings.map((item, idx) => <FormControlLabel 
                            key={"target-language-option-" + idx} 
                            name={idx.toString()} 
                            label={item.name} 
                            control={
                                <Checkbox checked={targetLanguageChecked[item.id] === true}
                                    onChange={(e) => handleTargetChange(item.id, e.target.checked)} 
                                    inputProps={{ 'aria-label': 'controlled' }} 
                                />
                            } />
                    )}
                </FormGroup>
            </Box>
        </FormControl>
    </Box>
}

export default LanguageTargetCheckboxes;
