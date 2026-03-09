export async function onRequest(content) {
    const { request } = content;
    const url = new URL(request.URL);
    if (url.pathname == '/') {
        const supported = new Set(['en-US', 'zh-CN', 'zh-TW']);

        const cookieLang = request.headers.get('cookie')?.match(/lang=(\w+)/)?.[1];
        if (cookieLang && supported.has(cookieLang)) {
            return Response.redirect(new URL(`/${cookieLang}/`, url), 302);
        }
        
        const acceptLangHeader = request.headers.get('accept-language') || '';
        const langs = acceptLangHeader.split(',').map(l => l.split(';')[0].trim());

        let target = '/en-US/';
        for(const l of langs) {
            if (supported.has(l)) {
                target = `/${l}/`;
                break;
            }
        }

        const response = Response.redirect(new URL(`/${target}/`, url), 302);
        response.headers.set('Set-Cookie', `lang=${target.slice(1,-1)}; path=/; max-age=31536000`);
        return response;
    }
    return request.next();
}