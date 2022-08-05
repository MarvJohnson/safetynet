import React, { useState } from 'react';
import './styling.css'
import { Input as InputComponent } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { HelpText } from '@twilio-paste/core/help-text';
import { MoreIcon } from '@twilio-paste/icons/cjs/MoreIcon';
import { Menu as MenuComponent, MenuButton, MenuItem, useMenuState } from '@twilio-paste/core/menu';

export default function Input({ label, type, text="", placeholder="", helpText="", hasOptions=true, required=false, disabled=false, deleteInput }) {
    const [input, setState] = useState({
        labelDashed: label?.replace(' ', '-') || "",
        text
    });
    const menu = useMenuState();

    function handleChange(e) {
        e.preventDefault();
        const updatedInput = {
            ...input,
            text: e.target.value
        }

        setState(updatedInput);
    }
    
    return (
        <>
        {label && <Label htmlFor="message_title" required>{ label }</Label>}
        <InputComponent
            aria-describedby={ `${ input.labelDashed }_help_text` }
            id={ input.labelDashed }
            name={ input.labelDashed }
            type={ type }
            text={ input.text }
            onChange={ handleChange }
            placeholder={ placeholder }
            required={ required }
            disabled={ disabled }
            insertAfter={ hasOptions &&
            <>
            <MenuButton { ...menu } varient="destructive_secondary" size="small">
                <MoreIcon decorative={false} size="sizeIcon10" title="Get more options" />
            </MenuButton>
            <MenuComponent { ...menu }>
                <MenuItem { ...menu } onClick={(e) => {
                    e.preventDefault();
                    menu.hide();
                    deleteInput(label);
                }}>delete</MenuItem>
            </MenuComponent>
            </>
            }
        />
        {helpText && <HelpText id={ `${ input.labelDashed }_helptext`}>{ helpText }</HelpText>}
        </>
    )
}