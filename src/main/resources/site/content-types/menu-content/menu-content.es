/* eslint-disable no-param-reassign */
//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs
//──────────────────────────────────────────────────────────────────────────────
import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {
    get as getContentByKey,
    query as queryContent
} from '/lib/xp/content';
import {
    attachmentUrl as getAttachmentUrl,
    getContent as getCurrentContent,
    getSite as getCurrentSite,
    getSiteConfig as getCurrentSiteConfig,
    pageUrl as getPageUrl
} from '/lib/xp/portal';


//──────────────────────────────────────────────────────────────────────────────
// App libs
//──────────────────────────────────────────────────────────────────────────────
import {CT_MENU} from 'content-types.es';
import {decendantOf} from '/lib/app-menu/query.es';
import {getLinkTarget} from '/mixins/app-menu-link-target/app-menu-link-target.es';


//──────────────────────────────────────────────────────────────────────────────
// Private functions
//──────────────────────────────────────────────────────────────────────────────
function buildMenuItemsFromContent(content) {
    return forceArray(content.data.menuItemSet).map((item) => {
        log.info(`item:${toStr(item)}`);
        let href = null;
        let labelText = '';
        let target = null;
        const selected = item.linkOptionSet._selected;
        const option = item.linkOptionSet[selected];
        if (selected === 'content') {
            const itemContent = getContentByKey({key: option.content});
            href = getPageUrl({
                id: itemContent._id,
                type: option.type || 'server'
            });
            labelText = option.labelText || itemContent.displayName || '';
            target = getLinkTarget(option.linkTarget);
        } else if (selected === 'url') {
            href = option.url;
            labelText = option.labelText || '';
            target = getLinkTarget(option.linkTarget);
        }
        return {
            href,
            icon: item.svgIcon ? getAttachmentUrl({
                id: item.svgIcon,
                type: 'server'
            }) : null,
            labelText,
            target
        };
    });
} // function buildMenuItemsFromContent


//──────────────────────────────────────────────────────────────────────────────
// Exports
//──────────────────────────────────────────────────────────────────────────────
export function getMenuItems({
    content = null,
    key = null
} = {}) {
    if (content && key) {
        log.warning(`getMenuObj called with both content:${content._id} and key:${key}, key ignored.`);
        key = null;
    }
    if (content && content.type !== CT_MENU) {
        const msg = `getMenuObj called with content not of type:${CT_MENU}! path:${content._path}`;
        log.error(msg);
        throw new Error(msg);
    }
    if (key) {
        content = getContentByKey({key});
        if (content.type !== CT_MENU) {
            const msg = `getMenuObj called with key:${key} of content not of type:${CT_MENU}! path:${content._path}`;
            log.error(msg);
            throw new Error(msg);
        }
    }
    if (!content) {
        if (!key) {
            key = getCurrentSiteConfig().menuContent; // Still null if not selected in siteConfig.
        }
        if (!key) { // No key or content passed, also not selected in siteConfig.
            content = getCurrentContent(); // Perhaps we are directly on a menu
            if (content.type !== CT_MENU) { // No key or content passed, nor siteConfig, nor on menu content.
                const currentSite = getCurrentSite();
                const queryRes = queryContent({ // Look for menu content
                    contentTypes: [CT_MENU],
                    count: 2,
                    query: decendantOf(`/content${currentSite._path}`) // _path starts with a slash
                });
                if (queryRes.count === 0) {
                    throw new Error(`No content of type:${CT_MENU} found in site:${currentSite._path}`);
                } else if (queryRes.count > 1) {
                    log.warning(`Multiple content of type:${CT_MENU} found in site:${currentSite._path}`);
                }
                content = queryRes.hits[0]; // eslint-disable-line prefer-destructuring
            }
        }
    }
    log.info(`content path:${content._path} id:${content._id}`);
    return buildMenuItemsFromContent(content);
} // export function getMenuItems
