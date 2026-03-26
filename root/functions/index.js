export async function onRequest(content) {
    const { request } = content;
    const url = new URL(request.url);
    if (url.pathname == '/') {

        const ua = request.headers.get("User-Agent")?.toLowerCase() || "";
        const isBot = ua.includes("bot");

        if (isBot) {
            return await fetch(`%{url.origin}/index.html`);
        }

        const supported = new Set(['en-US', 'zh-CN', 'zh-TW']);

        const cookieLang = request.headers.get('cookie')?.match(/lang=(\w+)/)?.[1];
        if (cookieLang && supported.has(cookieLang)) {
            return Response.redirect(new URL(`/${cookieLang}/`, url), 302);
        }
        
        const acceptLangHeader = request.headers.get('accept-language') || '';
        const langs = acceptLangHeader.split(',').map(l => l.split(';')[0].trim());

        let target = 'en-US';
        for(const l of langs) {
            if (supported.has(l)) {
                target = `${l}`;
                break;
            }
        }

        return new Response(null, {
            status: 302,
            headers: {
                Location: `/${target}/`,
                "Set-Cookie": `lang=${target}; path=/; max-age=2592000`
            }
        });
    }
    return request.next();
}