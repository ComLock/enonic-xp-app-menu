import {serviceUrl as getServiceUrl} from '/lib/xp/portal';


export const SN_MENU = 'menu-service';


export function getMenuServiceUrl() {
    return getServiceUrl({service: SN_MENU});
}
