import './styling.css'
import { Menu as MenuComponent, MenuButton, MenuItem, useMenuState } from '@twilio-paste/core/menu';
import { ChevronDownIcon } from '@twilio-paste/icons/cjs/ChevronDownIcon';

export default function Menu({ menuText, menuItems }) {
    const menu = useMenuState();
    return (
        <>
        <MenuButton {...menu} disabled={ menuItems.length === 0 }>
            { menuText } <ChevronDownIcon decorative />
        </MenuButton>
        <MenuComponent {...menu} aria-label="Actions">
            {menuItems.map((item, idx) => (
                <MenuItem key={ idx } {...menu} onClick={(e) => {
                    e.preventDefault();
                    menu.hide();

                    if(item.onClick)
                        item.onClick();
                }}>{ item.label }</MenuItem>
            ))}
        </MenuComponent>
        </>
    );
}