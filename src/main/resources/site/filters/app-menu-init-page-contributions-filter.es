export function initPageContributions(res) {
    if (!res.pageContributions) {
        res.pageContributions = {
            headBegin: [],
            headEnd: [],
            bodyBegin: [],
            bodyEnd: []
        };
    } else {
        ['headBegin', 'headEnd', 'bodyBegin', 'bodyEnd'].forEach((k) => {
            if (typeof res.pageContributions[k] === 'string') {
                res.pageContributions[k] = [res.pageContributions[k]];
            } else if (!Array.isArray(res.pageContributions[k])) {
                res.pageContributions[k] = [];
            }
        });
    }
} // initPageContributions


export function responseFilter(req, res) {
    initPageContributions(res);
    return res;
}
