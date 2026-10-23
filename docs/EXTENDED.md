# SubConverter-Extended 支持（开发记录）

## 目标
在保留对原版 subconverter 兼容的前提下，让本前端可以生成适用于
[SubConverter-Extended](https://github.com/Aethersailor/SubConverter-Extended)（下称 Extended）的订阅链接，
重点是 Extended v1.10.4 起支持的「逐订阅 User-Agent」(`ua:` 来源前缀)。

## 背景
- Extended 在 `target=clash` 且订阅为 http(s) 时生成 proxy-provider，由客户端自行拉取机场订阅。
- provider 默认继承发起转换请求的客户端 UA；v1.10.4 起可用 `ua:` 前缀为单个订阅指定 UA：
  `provider:A,ua:ClientA%2F1.0,https://a.example/sub|provider:B,ua:ClientB%2F2.0,https://b.example/sub`
- UA 需先按 URI 组件编码，再将整段来源编码进 `url` 参数；仅允许可打印 ASCII，解码后不超过 512 字节。
- 原版 subconverter 不认识 `ua:` 前缀，会把整行当成无效地址，因此该功能只能在 Extended 后端使用。

## 范围
1. 后端识别：`/version` 响应包含 `SubConverter-Extended` 时判定为 Extended，并解析版本号；
   原版返回纯文本（如 `subconverter v0.9.9 backend`）。后端列表中显示版本，Extended 标注类型。
2. 订阅 UA 输入框（可选）：为所有未自带 `ua:` 的 http(s) 订阅加上 `ua:` 前缀。
   - 生成时若后端不是 Extended，提示并拒绝生成，避免产出原版无法使用的链接。
3. 手写前缀：订阅行中手动书写的 `ua:原始UA,https://...` 会被自动编码；已编码（含 `%XX`）的值保持不变。
   含逗号的 UA 必须手动预先编码。
4. 多行订阅拆分修正：`\r\n` 换行此前会产生空来源（`||`），改为逐行去空后用 `|` 连接。
5. 链接生成逻辑去重：表单提交与二维码两处重复的拼接代码合并为 `buildSubUrl()`。
6. 后端预设增加「自建 Extended 服务」(`http://localhost:25510/sub?`)。

不在范围：Extended 的其他专属参数（`provider_proxy_direct`、`expand` 等）界面化；需要时再迭代。

## 测试
- 纯函数位于 `src/suburl.js`，单元测试 `tests/suburl.test.mjs`，运行 `npm test`（Node 内置 test runner，无新依赖）。
- 手工验证：`npm run build` 后用真实 Extended / 原版后端分别生成链接并请求，检查 provider 的 `header.User-Agent`。

## 状态
| 日期 | 阶段 | 结果 |
|---|---|---|
| 2026-10-23 | 规划、测试、实现 | 单元测试 10/10 通过；`npm run build` 成功 |
| 2026-10-23 | 真实后端验证 | Extended v1.10.5：默认 UA 与逐行 `ua:` 分别写入对应 provider 的 `header.User-Agent`，并覆盖请求方 UA；v1.10.3 与原版正确判定为不支持；原版后端不带 UA 的链接正常 (200) |
