import test from 'node:test';
import assert from 'node:assert/strict';
import {
    splitSources, encodeUaPrefix, applyDefaultUa, validateUa,
    parseBackendVersion, buildSubUrl
} from '../src/suburl.js';

test('splitSources: CRLF/LF/CR lines, trims, drops empty, keeps | inside line', () => {
    assert.deepEqual(splitSources('a\r\nb\n\n c \rd|e'), ['a', 'b', 'c', 'd|e']);
    assert.deepEqual(splitSources(''), []);
    assert.deepEqual(splitSources(null), []);
});

test('encodeUaPrefix: encodes raw ua value, keeps others', () => {
    assert.equal(encodeUaPrefix('ua:clash-verge/v2.5.8,https://a.com/s?t=1'),
        'ua:clash-verge%2Fv2.5.8,https://a.com/s?t=1');
    assert.equal(encodeUaPrefix('provider:HK,ua:Shadowrocket/2.2 CFNetwork,https://a.com/s'),
        'provider:HK,ua:Shadowrocket%2F2.2%20CFNetwork,https://a.com/s');
});

test('encodeUaPrefix: already encoded value unchanged', () => {
    const s = 'ua:clash-verge%2Fv2.5.8,https://a.com/s';
    assert.equal(encodeUaPrefix(s), s);
});

test('encodeUaPrefix: non-prefixed or node links unchanged', () => {
    assert.equal(encodeUaPrefix('https://a.com/s?x=1,2'), 'https://a.com/s?x=1,2');
    assert.equal(encodeUaPrefix('vless://uuid@h:443#ua:x'), 'vless://uuid@h:443#ua:x');
});

test('applyDefaultUa: adds encoded ua before url, after other prefixes', () => {
    assert.equal(applyDefaultUa('https://a.com/s', 'clash.meta/1.19'), 'ua:clash.meta%2F1.19,https://a.com/s');
    assert.equal(applyDefaultUa('provider:A,https://a.com/s', 'X/1'), 'provider:A,ua:X%2F1,https://a.com/s');
});

test('applyDefaultUa: respects existing ua, skips node links and empty ua', () => {
    assert.equal(applyDefaultUa('ua:Y%2F2,https://a.com/s', 'X/1'), 'ua:Y%2F2,https://a.com/s');
    assert.equal(applyDefaultUa('vmess://abc', 'X/1'), 'vmess://abc');
    assert.equal(applyDefaultUa('https://a.com/s', ''), 'https://a.com/s');
});

test('validateUa: printable ascii, <=512, non-empty', () => {
    assert.equal(validateUa('clash-verge/v2.5.8'), '');
    assert.notEqual(validateUa('中文'), '');
    assert.notEqual(validateUa('a'.repeat(513)), '');
    assert.equal(validateUa(''), '');
});

test('parseBackendVersion: extended html and original text', () => {
    const ext = parseBackendVersion('<title>SubConverter-Extended</title> ... v1.10.3 ...');
    assert.deepEqual(ext, { extended: true, version: 'v1.10.3' });
    assert.deepEqual(parseBackendVersion('subconverter v0.9.9 backend\n'),
        { extended: false, version: 'subconverter v0.9.9 backend' });
    assert.equal(parseBackendVersion(''), null);
});

test('supportsUaPrefix: only extended >= v1.10.4', async () => {
    const { supportsUaPrefix } = await import('../src/suburl.js');
    assert.equal(supportsUaPrefix({ extended: true, version: 'v1.10.4' }), true);
    assert.equal(supportsUaPrefix({ extended: true, version: 'v1.11.0' }), true);
    assert.equal(supportsUaPrefix({ extended: true, version: 'v1.10.3' }), false);
    assert.equal(supportsUaPrefix({ extended: false, version: 'subconverter v0.9.9' }), false);
    assert.equal(supportsUaPrefix(null), false);
});

test('buildSubUrl: original behaviour kept, ua applied per line', () => {
    const base = {
        backend: 'http://h:25510/sub?', target: 'clash', config: 'config/X.ini',
        include: '', exclude: '', name: '', emoji: 'true', append_type: 'false',
        append_info: 'true', scv: 'true', udp: 'true', list: 'false', sort: 'false',
        fdn: 'false', insert: 'false'
    };
    const u1 = buildSubUrl({ ...base, url: 'https://a.com/s\r\nhttps://b.com/s' });
    assert.ok(u1.startsWith('http://h:25510/sub?&url=' + encodeURIComponent('https://a.com/s|https://b.com/s') + '&target=clash'));
    assert.ok(u1.includes('&config=config%2FX.ini'));
    assert.ok(u1.endsWith('&insert=false'));
    const u2 = buildSubUrl({ ...base, url: 'https://a.com/s\nua:Shadowrocket/2.2,https://b.com/s', ua: 'clash-verge/v2.5.8' });
    const src = decodeURIComponent(u2.match(/&url=([^&]*)/)[1]);
    assert.equal(src, 'ua:clash-verge%2Fv2.5.8,https://a.com/s|ua:Shadowrocket%2F2.2,https://b.com/s');
});
