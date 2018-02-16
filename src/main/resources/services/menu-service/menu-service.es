import {toStr} from '/lib/enonic/util';
import {RT_JSON} from 'content-types.es';
import {getMenuItems} from '/content-types/menu-content/menu-content.es';


export function get() {
    const menuItems = getMenuItems(); log.info(`menuItems:${toStr(menuItems)}`);
    return {
        body: {
            items: menuItems
        },
        contentType: RT_JSON
    };
} // function get


export function post() {
    return get();
}
