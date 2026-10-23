// Pure helpers for building subscription conversion URLs.
// Shared by the form submit and QR code handlers; covered by tests/suburl.test.mjs.

const HTTP_RE = /^https?:\/\//i;
const PREFIX_RE = /^([A-Za-z_]+):([^,]*),/;
const ENCODED_RE = /%[0-9A-Fa-f]{2}/;
const UA_MIN_EXTENDED = [1, 10, 4];

// Split the textarea content into sources: one per line, trimmed, empty lines dropped.
export function splitSources(text) {
    if (!text) return [];
    return String(text).split(/\r\n|\n|\r/).map(s => s.trim()).filter(Boolean);
}

// Parse "key:value,key:value,https://..." into prefixes and the url part.
// Returns null when the source is not an http(s) subscription.
function parsePrefixed(source) {
    const prefixes = [];
    let rest = source;
    while (!HTTP_RE.test(rest)) {
        const m = rest.match(PREFIX_RE);
        if (!m) return null;
        prefixes.push({ key: m[1], value: m[2] });
        rest = rest.slice(m[0].length);
    }
    return { prefixes, url: rest };
}

function joinPrefixed(parsed) {
    return parsed.prefixes.map(p => `${p.key}:${p.value},`).join('') + parsed.url;
}

function encodeUaValue(value) {
    return ENCODED_RE.test(value) ? value : encodeURIComponent(value);
}

// Encode a raw "ua:" prefix value (Extended expects the UA URI-component encoded).
export function encodeUaPrefix(source) {
    const parsed = parsePrefixed(source);
    if (!parsed || !parsed.prefixes.some(p => p.key === 'ua')) return source;
    parsed.prefixes = parsed.prefixes.map(p => (p.key === 'ua' ? { key: p.key, value: encodeUaValue(p.value) } : p));
    return joinPrefixed(parsed);
}

// Add "<key>:<value>," to an http(s) source that has no such prefix yet (value used as given).
export function applyDefaultPrefix(source, key, value) {
    if (!value) return source;
    const parsed = parsePrefixed(source);
    if (!parsed || parsed.prefixes.some(p => p.key === key)) return source;
    parsed.prefixes.push({ key, value });
    return joinPrefixed(parsed);
}

// Add "ua:<ua>," to an http(s) source that has no ua prefix yet.
export function applyDefaultUa(source, ua) {
    return ua ? applyDefaultPrefix(source, 'ua', encodeURIComponent(ua)) : source;
}

// Returns '' when valid (or empty), otherwise an error message.
export function validateUa(ua) {
    if (!ua) return '';
    if (!/^[\x20-\x7E]+$/.test(ua)) return 'UA 只能包含可打印 ASCII 字符';
    if (ua.length > 512) return 'UA 长度不能超过 512 个字符';
    return '';
}

// Interpret the /version response. Extended serves an HTML page, the original a text line.
export function parseBackendVersion(text) {
    const body = (text || '').trim();
    if (!body) return null;
    if (body.includes('SubConverter-Extended')) {
        const m = body.match(/v\d+\.\d+\.\d+/);
        return { extended: true, version: m ? m[0] : 'Unknown' };
    }
    return { extended: false, version: body.split(/\r?\n/)[0].slice(0, 80) };
}

export function supportsUaPrefix(info) {
    if (!info || !info.extended) return false;
    const m = (info.version || '').match(/v(\d+)\.(\d+)\.(\d+)/);
    if (!m) return false;
    const v = m.slice(1).map(Number);
    for (let i = 0; i < 3; i++) {
        if (v[i] !== UA_MIN_EXTENDED[i]) return v[i] > UA_MIN_EXTENDED[i];
    }
    return true;
}

export function buildSubUrl(data) {
    let sources = splitSources(data.url).map(s => applyDefaultUa(encodeUaPrefix(s), data.ua));
    // Provider update interval is a SubConverter-Extended source prefix (interval:N,), not the
    // interval= query parameter (that one is the managed-config update interval).
    if (data.extended && data.interval) sources = sources.map(s => applyDefaultPrefix(s, 'interval', data.interval));
    let url = `${data.backend}&url=${encodeURIComponent(sources.join('|'))}&target=${data.target}`;
    if (data.config) url += `&config=${encodeURIComponent(data.config)}`;
    if (data.include) url += `&include=${encodeURIComponent(data.include)}`;
    if (data.exclude) url += `&exclude=${encodeURIComponent(data.exclude)}`;
    if (data.name) url += `&filename=${encodeURIComponent(data.name)}`;
    // emoji= overrides add_emoji/remove_emoji on both backends (emoji sets add=emoji, remove=true),
    // so when the fine-grained switches are used, emoji= is omitted and both are sent explicitly.
    const fineEmoji = data.add_emoji === 'true' || data.remove_emoji === 'true';
    const flags = ['emoji', 'append_type', 'append_info', 'scv', 'udp', 'list', 'sort', 'fdn', 'insert']
        .filter(f => !(fineEmoji && f === 'emoji'));
    url += flags.map(f => `&${f}=${data[f] || 'false'}`).join('');
    if (fineEmoji) url += `&add_emoji=${data.add_emoji === 'true'}&remove_emoji=${data.remove_emoji === 'true'}`;
    // Optional param supported by both backends: only sent when set.
    if (data.rename) url += `&rename=${encodeURIComponent(data.rename)}`;
    // SubConverter-Extended only.
    if (data.extended) {
        if (data.expand === 'true') url += '&expand=true';
        if (data.provider_proxy_direct === 'false') url += '&provider_proxy_direct=false';
    }
    return url;
}

// Returns '' when valid (or empty), otherwise an error message.
export function validateInterval(value) {
    if (!value) return '';
    return /^[1-9]\d*$/.test(value) ? '' : 'provider 更新间隔必须是正整数（秒）';
}

// True when any SubConverter-Extended-only option is set.
export function usesExtendedOptions(data) {
    return data.expand === 'true' || data.provider_proxy_direct === 'false' || !!data.interval;
}

// True when any source carries a ua prefix (explicit or via the default UA field).
export function usesUaPrefix(data) {
    if (data.ua) return splitSources(data.url).some(s => parsePrefixed(s) !== null);
    return splitSources(data.url).some(s => {
        const p = parsePrefixed(s);
        return p && p.prefixes.some(x => x.key === 'ua');
    });
}
