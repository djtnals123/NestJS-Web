export function queryString(meta, page): string{
    const criteria: any = {page, limit:meta.itemsPerPage};
    if(meta.searchOption && meta.keyword){
        criteria.option = meta.searchOption;
        criteria.keyword = meta.keyword;
    }
    const queryString = Object.entries(criteria).map(e => e.join('=')).join('&');
    return '?' + queryString;
}