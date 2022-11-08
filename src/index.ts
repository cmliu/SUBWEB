import './assets/css/index.less';
import ClipboardJS from 'clipboard';
import $ from 'jquery';

interface Options {
    'url': string,
    'target': string,
    'config': string,
    'backend': string,
    'include': string,
    'exclude': string,
    'name': string,
    'emoji': 'true' | undefined,
    'append_type': 'true' | undefined,
    'append_info': 'true' | undefined,
    'scv': 'true' | undefined,
    'udp': 'true' | undefined,
    'list': 'true' | undefined,
    'sort': 'true' | undefined,
    'fdn': 'true' | undefined,
    'insert': 'true' | undefined
}

let subUrl = '';

const targetConfig = [{
    label: 'Clash',
    value: 'clash'
}, {
    label: 'Clash新参数',
    value: 'clash&new_name=true'
}, {
    label: 'ClashR',
    value: 'clashr'
}, {
    label: 'ClashR新参数',
    value: 'clashr&new_name=true'
}, {
    label: 'Surge2',
    value: 'surge&ver=2'
}, {
    label: 'Surge3',
    value: 'surge&ver=3'
}, {
    label: 'Surge4',
    value: 'surge&ver=4'
}, {
    label: 'Quantumult',
    value: 'quan'
}, {
    label: 'QuantumultX',
    value: 'quanx'
}, {
    label: 'Surfboard',
    value: 'surfboard'
}, {
    label: 'V2Ray',
    value: 'v2ray'
}, {
    label: 'SS',
    value: 'ss'
}, {
    label: 'SSR',
    value: 'ssr'
}, {
    label: 'SSD',
    value: 'ssd'
}, {
    label: 'SSAndroid',
    value: 'sssub'
}, {
    label: 'Loon',
    value: 'loon'
}];
const backendConfig = [{
    label: 'localhost:25500(自建本地服务-推荐)',
    value: 'http://localhost:25500/sub?'
}, {
    label: 'sub.id9.cc(品云提供-稳定)',
    value: 'https://sub.id9.cc/sub?'

}, {
    label: 'sub.xeton.dev(subconverter作者提供-稳定)',
    value: 'https://sub.xeton.dev/sub?'

}, {
    label: 'api.dler.io(lhie1提供-稳定)',
    value: 'https://api.dler.io/sub?'
}, {
    label: 'sub.maoxiongnet.com(猫熊提供-稳定)',
    value: 'https://sub.maoxiongnet.com/sub?'
}];
const externalConfig = [{
    label: 'ACL4SSR',
    options: [{
        label: 'ACL4SSR_Online 默认版 分组比较全(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini'
    }, {
        label: 'ACL4SSR_Online_AdblockPlus 更多去广告(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini'
    }, {
        label: 'ACL4SSR_Online_MultiCountry 多国分组(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_MultiCountry.ini'
    }, {
        label: 'ACL4SSR_Online_NoAuto 无自动测速(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini'
    }, {
        label: 'ACL4SSR_Online_NoReject 无广告拦截规则(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini'
    }, {
        label: 'ACL4SSR_Online_Mini 精简版(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini'
    }, {
        label: 'ACL4SSR_Online_Mini_AdblockPlus.ini 精简版 更多去广告(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini'
    }, {
        label: 'ACL4SSR_Online_Mini_NoAuto.ini 精简版 不带自动测速(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini'
    }, {
        label: 'ACL4SSR_Online_Mini_Fallback.ini 精简版 带故障转移(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini'
    }, {
        label: 'ACL4SSR_Online_Mini_MultiMode.ini 精简版 自动测速、故障转移、负载均衡(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini'
    }, {
        label: 'ACL4SSR_Online_Mini_MultiCountry.ini 精简版 带港美日国家(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiCountry.ini'
    }, {
        label: 'ACL4SSR_Online_Full 全分组 重度用户使用(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini'
    }, {
        label: 'ACL4SSR_Online_Full_MultiMode.ini 全分组 多模式 重度用户使用(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_MultiMode.ini'
    }, {
        label: 'ACL4SSR_Online_Full_NoAuto.ini 全分组 无自动测速 重度用户使用(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini'
    }, {
        label: 'ACL4SSR_Online_Full_AdblockPlus 全分组 重度用户使用 更多去广告(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini'
    }, {
        label: 'ACL4SSR_Online_Full_Netflix 全分组 重度用户使用 奈飞全量(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini'
    }, {
        label: 'ACL4SSR_Online_Full_Google 全分组 重度用户使用 谷歌细分(与Github同步)',
        value: 'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Google.ini'
    }, {
        label: 'ACL4SSR 本地 默认版 分组比较全',
        value: 'config/ACL4SSR.ini'
    }, {
        label: 'ACL4SSR_Mini 本地 精简版',
        value: 'config/ACL4SSR_Mini.ini'
    }, {
        label: 'ACL4SSR_Mini_NoAuto.ini 本地 精简版+无自动测速',
        value: 'config/ACL4SSR_Mini_NoAuto.ini'
    }, {
        label: 'ACL4SSR_Mini_Fallback.ini 本地 精简版+fallback',
        value: 'config/ACL4SSR_Mini_Fallback.ini'
    }, {
        label: 'ACL4SSR_BackCN 本地 回国',
        value: 'config/ACL4SSR_BackCN.ini'
    }, {
        label: 'ACL4SSR_NoApple 本地 无苹果分流',
        value: 'config/ACL4SSR_NoApple.ini'
    }, {
        label: 'ACL4SSR_NoAuto 本地 无自动测速 ',
        value: 'config/ACL4SSR_NoAuto.ini'
    }, {
        label: 'ACL4SSR_NoAuto_NoApple 本地 无自动测速&无苹果分流',
        value: 'config/ACL4SSR_NoAuto_NoApple.ini'
    }, {
        label: 'ACL4SSR_NoMicrosoft 本地 无微软分流',
        value: 'config/ACL4SSR_NoMicrosoft.ini'
    }, {
        label: 'ACL4SSR_WithGFW 本地 GFW列表',
        value: 'config/ACL4SSR_WithGFW.ini'
    }]
}, {
    label: 'universal',
    options: [{
        label: 'No-Urltest',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/no-urltest.ini'
    }, {
        label: 'Urltest',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/urltest.ini'
    }]
}, {
    label: 'customized',
    options: [{
        label: 'Nirvana',
        value: 'https://raw.githubusercontent.com/Mazetsz/ACL4SSR/master/Clash/config/V2rayPro.ini'
    }, {
        label: 'V2Pro',
        value: 'https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/V2Pro.ini'
    }, {
        label: '史迪仔-自动测速',
        value: 'https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Stitch.ini'
    }, {
        label: '史迪仔-负载均衡',
        value: 'https://raw.githubusercontent.com/Mazeorz/airports/master/Clash/Stitch-Balance.ini'
    }, {
        label: 'Maying',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/maying.ini'
    }, {
        label: 'Ytoo',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ytoo.ini'
    }, {
        label: 'FlowerCloud',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/flowercloud.ini'
    }, {
        label: 'NyanCAT',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/nyancat.ini'
    }, {
        label: 'Nexitally',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/nexitally.ini'
    }, {
        label: 'SoCloud',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/socloud.ini'
    }, {
        label: 'ARK',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ark.ini'
    }, {
        label: 'ssrCloud',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ssrcloud.ini'
    }]
}, {
    label: 'Special',
    options: [{
        label: 'NeteaseUnblock(仅规则，No-Urltest)',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/netease.ini'
    }, {
        label: 'Basic(仅GEOIP CN + Final)',
        value: 'https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/basic.ini'
    }]
}];

function copyText(copyStr: string) {
    navigator.clipboard.writeText(copyStr).then(() => {
        layui.layer.msg('复制成功~', { icon: 1 });
    }, () => {
        layui.layer.msg('复制失败, 请手动选择复制', { icon: 2 });
    });
}

function generateSubUrl(data: Options) {
    const backend = data.backend;
    let originUrl = data.url;
    originUrl = encodeURIComponent(originUrl.replace(/(\n|\r|\n\r)/g, '|'));

    let newSubUrl = `${backend}&url=${originUrl}&target=${data.target}`;

    if (data.config) {
        newSubUrl += `&config=${encodeURIComponent(data.config)}`;
    }

    if (data.include) {
        newSubUrl += `&include=${encodeURIComponent(data.include)}`;
    }

    if (data.exclude) {
        newSubUrl += `&wxclude=${encodeURIComponent(data.exclude)}`;
    }

    if (data.name) {
        newSubUrl += `&filename=${encodeURIComponent(data.name)}`;
    }

    newSubUrl += `&emoji=${data.emoji || 'false'}&append_type=${data.append_type || 'false'}&append_info=${data.append_info || 'false'}&scv=${data.scv || 'false'}&udp=${data.udp || 'false'}&list=${data.list || 'false'}&sort=${data.sort || 'false'}&fdn=${data.fdn || 'false'}&insert=${data.insert || 'false'}`;
    subUrl = newSubUrl;
    $('#result').val(subUrl);
    copyText(subUrl);
}

layui.use(['form'], () => {
    const form = layui.form;

    let childrenHtml = '';
    targetConfig.forEach(option => {
        childrenHtml += `<option value="${option.value}">${option.label}</option>`;
    });
    $('#targetSelecter').append(childrenHtml);

    childrenHtml = '';
    externalConfig.forEach(group => {
        let html = '';
        group.options.forEach(option => {
            html += `<option value="${option.value}">${option.label}</option>`;
        });
        childrenHtml += `<optgroup label="${group.label}">${html}</optgroup>`;
    });
    $('#configSelecter').append(childrenHtml);

    childrenHtml = '';
    backendConfig.forEach(option => {
        childrenHtml += `<option value="${option.value}">${option.label}</option>`;
    });
    $('#backendSelecter').append(childrenHtml);
    form.render('select', 'optionsForm');


    form.on('submit(generate)', target => {
        const data = target.field as Options;
        generateSubUrl(data);
    });

    $('#importToClash').on('click', () => {
        if (!subUrl) { return layui.layer.msg('未生成新的订阅链接', { icon: 2 }); }
        const url = `clash://install-config?url=${encodeURIComponent(subUrl)}`;
        window.open(url);
    });
});


