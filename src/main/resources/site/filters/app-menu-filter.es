import {nav, script} from 'render-js';

import {toStr} from '/lib/enonic/util';

import {getMenuServiceUrl} from 'services.es';
import {initPageContributions} from './app-menu-init-page-contributions-filter.es';


export function responseFilter(req, res) {
    initPageContributions(res);
    log.info(`pageContributions:${toStr(res.pageContributions)}`);

    const menuServiceUrl = getMenuServiceUrl(); log.info(`menuServiceUrl:${menuServiceUrl}`);

    res.pageContributions.headEnd.push(script({
        type: 'application/javascript'
    }, `/* ${menuServiceUrl} */`));

    res.pageContributions.bodyEnd.push(nav());

    return res;
}
