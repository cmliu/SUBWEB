export const targetConfig = [{
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
    label: '混合订阅（mixed）',
    value: 'mixed'
}, {
    label: 'Sing-Box',
    value: 'singbox'
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
export const backendConfig = [{
    label: 'subapi.cmliussss.net(CM提供-负载均衡后端)',
    value: 'https://subapi.cmliussss.net/sub?'
}, {
    label: 'v.id9.cc(品云提供-稳定后端)',
    value: 'https://v.id9.cc/sub?'
}, {
    label: 'url.v1.mk(肥羊提供-增强型后端)',
    value: 'https://url.v1.mk/sub?'
}, {
    label: 'sub.d1.mk(肥羊提供-备用后端)',
    value: 'https://sub.d1.mk/sub?'
}, {
    label: 'localhost:25500(自建本地服务)',
    value: 'http://localhost:25500/sub?'
}];
export const externalConfig = [{
    label: 'CM规则',
    options: [{
        label: 'CM_Online 默认版 识别港美地区(与Github同步)',
        value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online.ini'
    }, {
        label: 'CM_Online_MultiCountry 识别港美地区 负载均衡(与Github同步)',
        value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_MultiCountry.ini'
    }, {
        label: 'CM_Online_MultiCountry_CF 识别港美地区、CloudFlareCDN 负载均衡 Worker节点专用(与Github同步)',
        value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_MultiCountry_CF.ini'
    }, {
        label: 'CM_Online_Full 识别多地区分组(与Github同步)',
        value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full.ini'
    }, {
        label: 'CM_Online_Full_CF 识别多地区、CloudFlareCDN 分组 Worker节点专用(与Github同步)',
        value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_CF.ini'
    }, {
        label: 'CM_Online_Full_MultiMode 识别多地区 负载均衡(与Github同步)',
        value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode.ini'
    }, {
        label: 'CM_Online_Full_MultiMode_CF 识别多地区、CloudFlareCDN 负载均衡 Worker节点专用(与Github同步)',
        value: 'https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full_MultiMode_CF.ini'
    }]
},{
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
