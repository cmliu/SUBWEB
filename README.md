# SUBWEB

一个面向 ACL4SSR / Subconverter 生态的现代化在线订阅转换前端。

[![Use EdgeOne Pages to deploy](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Fcmliu%2FSUBWEB&install-command=npm%20install&build-command=npm%20run%20build&output-directory=dist)

## 项目简介

`SUBWEB` 的核心职责很简单：在浏览器里收集订阅链接、目标客户端、规则配置和附加参数，然后拼装出最终可用的订阅转换链接。

它本身不是订阅转换后端，也不会在前端直接完成节点解析或规则转换。真正执行转换的是你选择的后端服务，例如兼容 `subconverter` 参数格式的服务端。

这也意味着：

- 项目主体是静态站点，适合部署到 Cloudflare Pages、EdgeOne Pages、Netlify、Vercel 等静态托管平台。
- 即使不启用任何 Serverless API，页面的主功能也可以正常工作。
- 后端是否可用、规则文件是否可访问、转换速度是否稳定，取决于你选用的转换服务。

## 功能特性

- 响应式界面，适配桌面端与移动端。
- 支持亮色、暗色、跟随系统三种主题。
- 支持单条或多条原始订阅链接输入。
- 支持常见目标客户端格式：
  `Clash`、`ClashR`、`Sing-Box`、`Surge`、`Quantumult`、`Quantumult X`、`Surfboard`、`V2Ray`、`SS`、`SSR`、`SSD`、`Loon` 等。
- 内置多组远程规则配置，包含 ACL4SSR、CM 规则和通用规则。
- 支持自定义远程配置 URL。
- 支持常用筛选参数：
  `include`、`exclude`、`filename`、`emoji`、`append_type`、`append_info`、`scv`、`udp`、`list`、`sort`、`fdn`、`insert`。
- 自动探测预置后端可用性和响应时间，并优先选择可用后端。
- 支持手动填写自定义后端地址，并自动补全常见 `/sub?` 形式。
- 生成结果后可直接复制。
- 支持二维码展示。
- 支持 `clash://install-config` 导入。

## 项目结构

```text
.
├─ public/
│  ├─ index.html          # 页面骨架
│  ├─ favicon.ico
│  └─ qrcode.min.js
├─ src/
│  ├─ index.js            # 主逻辑，表单处理、URL 生成、后端探测、二维码等
│  ├─ config.js           # 目标客户端、后端列表、规则配置
│  └─ assets/css/
│     ├─ main.css         # 主要样式
│     └─ index.less
├─ functions/
│  ├─ _middleware.js
│  └─ api/
│     ├─ create.js
│     └─ [id].js
├─ webpack.config.js
├─ wrangler.toml
└─ package.json
```

## 技术栈

- JavaScript
- Webpack 5
- Babel
- Tailwind CSS
- jQuery
- Cloudflare Pages Functions（仓库内有原型代码，但不是主流程依赖）

## 快速开始

### 环境要求

- Node.js 18 或更高版本
- npm 9 或更高版本

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run serve
```

### 生产构建

```bash
npm run build
```

构建完成后，静态文件会输出到 `dist/` 目录。

## 工作原理

页面会把你输入的参数组装成类似下面这样的链接：

```text
https://your-backend.example/sub?url=...&target=clash&config=...&emoji=true...
```

因此请注意两点：

- 这个仓库只负责生成链接，不负责替代后端转换服务。
- 如果你部署的是公开页面，建议优先使用你自己维护的转换后端，而不是完全依赖公共后端。

### SubConverter-Extended 后端

页面会通过 `/version` 识别 [SubConverter-Extended](https://github.com/Aethersailor/SubConverter-Extended)，
并在后端列表中标注 `[Extended vX.Y.Z]`。

当后端为 Extended v1.10.4 及以上、输出为 Clash 时，可以使用「订阅 UA」：

- 「订阅 UA」输入框：为所有未指定 UA 的 http(s) 订阅加上 `ua:` 前缀；
- 单个订阅可在行首手写 `ua:Shadowrocket/2.2,https://...` 覆盖，页面会自动编码 UA（含逗号的 UA 需手动预先编码）。

原版 subconverter 不支持 `ua:` 前缀，选择原版后端时页面会拒绝生成带 UA 的链接。详细说明见 [`docs/EXTENDED.md`](./docs/EXTENDED.md)。

## 自定义与二次开发

### 1. 修改目标客户端、默认后端、规则配置

编辑 [`src/config.js`](./src/config.js)。

这里维护了：

- `targetConfig`：目标客户端列表
- `backendConfig`：后端列表
- `externalConfig`：规则配置列表

### 2. 修改链接生成逻辑

链接拼接在 [`src/suburl.js`](./src/suburl.js) 的 `buildSubUrl`（纯函数，测试见 `tests/suburl.test.mjs`，运行 `npm test`），
页面交互在 [`src/index.js`](./src/index.js) 中的 `generateSubUrl`。

如果你需要：

- 增加新的查询参数
- 调整默认参数
- 改造复制、二维码、导入逻辑

都应该从这里入手。

### 3. 修改页面结构

编辑 [`public/index.html`](./public/index.html)。

### 4. 修改样式

编辑 [`src/assets/css/main.css`](./src/assets/css/main.css)。

## Cloudflare Pages 部署

Cloudflare Pages 是这个仓库最自然的部署目标，因为仓库里已经使用了 Cloudflare Pages 的 `functions/` 目录约定。

### 方案一：Git 集成部署

这是最推荐的方式。

1. 将仓库推送到 GitHub 或 GitLab。
2. 登录 Cloudflare Dashboard，进入 Workers & Pages。
3. 选择 `Create application > Pages > Connect to Git`。
4. 选择仓库并授权。
5. 在构建配置里填写：
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: 留空，使用仓库根目录
6. 建议在环境变量中补充：
   - `NODE_VERSION=18`
7. 点击 `Save and Deploy`。

这个方案的优点：

- 推送代码后自动触发构建和部署。
- 支持生产环境和预览环境。
- 仓库根目录下的 `functions/` 可以随项目一起部署。

### 方案二：Wrangler 直接上传

适合本地手动部署，或者接入你自己的 CI/CD。

```bash
npm install
npm run build
npx wrangler pages project create
npx wrangler pages deploy dist
```

如果你只是上传纯静态资源，也可以使用 Cloudflare Dashboard 的拖拽上传；但如果你希望同时部署 `functions/` 目录，就不要用拖拽上传，应该使用 Wrangler。

### 自定义域名

部署完成后可在项目后台添加自定义域名：

1. 进入 Workers & Pages。
2. 选择对应项目。
3. 打开 `Custom domains`。
4. 点击 `Set up a domain`。
5. 按控制台提示完成域名接入。

如果是 apex 根域，通常需要把域名托管到 Cloudflare；如果是子域名，则按提示添加 CNAME 即可。

### 可选：启用 Pages Functions / 短链接原型

仓库中包含 [`functions/api/create.js`](./functions/api/create.js) 和 `functions/api/[id].js`，它们依赖 `env.DB`，也就是 Cloudflare D1 绑定。

但基于当前代码结构，我的判断是：

- 这部分更像“预留/原型功能”，不是当前页面主流程的必要依赖。
- 前端主流程没有直接调用 `/api/create`。
- 如果你准备正式启用这套短链接能力，建议先自行联调并确认路由、返回链接和数据库模型是否符合你的实际需求。

如果你仍想启用这部分能力，至少需要补齐 D1 绑定和表结构。

#### 1. 创建 D1 数据库

```bash
npx wrangler d1 create subweb
```

#### 2. 将数据库绑定为 `DB`

你可以二选一：

- 在 Cloudflare Dashboard 的 `Settings > Bindings` 中添加 D1 绑定，变量名填 `DB`
- 或者在 `wrangler.toml` / `wrangler.json(c)` 中声明 D1 绑定

如果使用 Wrangler 配置文件，最关键的是保证绑定名为 `DB`。

#### 3. 初始化表结构

示例 SQL：

```sql
CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  slug TEXT NOT NULL,
  ip TEXT,
  status INTEGER DEFAULT 1,
  ua TEXT,
  create_time TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_links_slug ON links(slug);
CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);

CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  slug TEXT NOT NULL,
  ip TEXT,
  referer TEXT,
  ua TEXT,
  create_time TEXT
);

CREATE INDEX IF NOT EXISTS idx_logs_slug ON logs(slug);
```

#### 4. 本地调试 Functions

```bash
npm run build
npx wrangler pages dev dist --d1 DB=<YOUR_DATABASE_ID>
```

## EdgeOne Pages 部署

这个项目的主功能全部运行在浏览器端，所以部署到 EdgeOne Pages 作为静态站点没有问题。

### 方案一：导入 Git 仓库

这是最省事的方式。

1. 将代码推送到 GitHub。
2. 登录 EdgeOne Pages 控制台。
3. 选择“导入 Git 仓库”。
4. 授权 GitHub，并选择当前仓库。
5. 在构建配置中填写：
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: 仓库根目录
6. 选择合适的加速区域后开始部署。

完成后，后续推送到部署分支会自动触发重新部署。

### 方案二：EdgeOne CLI / 本地部署

适合手动部署和 CI/CD。

#### 1. 安装 CLI

```bash
npm install -g edgeone
```

#### 2. 登录

```bash
edgeone login
```

#### 3. 在仓库根目录直接部署

```bash
edgeone pages deploy -n subweb
```

预览环境示例：

```bash
edgeone pages deploy -n subweb -e preview
```

如果你已经手动构建好静态文件，也可以上传构建产物：

```bash
npm run build
edgeone pages deploy ./dist -n subweb
```

### 自定义域名

在 EdgeOne Pages 后台进入项目的“域名管理”页面即可添加自定义域名。

需要注意：

- 如果你选择的是中国大陆可用区或包含中国大陆的全球可用区，自定义域名通常需要先完成备案。
- 按控制台提示完成所有权校验与 CNAME 配置后才能生效。

### 关于 Functions 兼容性

这里要单独说明：

- 当前仓库中的 `functions/` 目录是 Cloudflare Pages 的目录约定。
- EdgeOne Pages Functions 使用的不是这套目录结构。
- 因此，把本仓库原样部署到 EdgeOne Pages 时，可以稳定使用静态前端主功能，但不要假设 `functions/` 里的 Cloudflare 代码会直接可用。

如果你想把短链接 API 也迁移到 EdgeOne Pages，建议按 EdgeOne CLI 当前初始化出来的函数目录结构重新组织，再逐个迁移接口逻辑。

## 已知限制

- 本项目不是转换后端，后端不可用时页面无法替你完成转换。
- 公共后端、公共规则文件随时可能失效、变慢或被限流。
- 仓库内的 Pages Functions 更适合视为预留原型，而不是当前版本的核心卖点。
- 远程规则链接如果发生变更，页面中的预设配置也需要同步更新。

## 常见问题

### 1. 为什么我部署到静态平台后也能用？

因为页面的主流程只是生成转换链接，计算量几乎都在浏览器端完成。

### 2. 为什么生成的链接打不开？

通常不是前端页面本身的问题，而是：

- 你选择的后端服务不可用
- 订阅源失效
- 规则配置 URL 不可访问
- 目标客户端参数不兼容

### 3. 是否必须部署 `functions/`？

不必须。主功能不依赖 `functions/`。

### 4. EdgeOne 和 Cloudflare 哪个更适合这个仓库？

如果你只想最低成本上线页面，两个都可以。

- 选 Cloudflare Pages：仓库内 `functions/` 目录更贴近原生约定。
- 选 EdgeOne Pages：静态站点部署很顺手，国内外访问策略更灵活。

## 参考文档

### Cloudflare 官方文档

- Git 集成：https://developers.cloudflare.com/pages/configuration/git-integration/
- 构建配置：https://developers.cloudflare.com/pages/configuration/build-configuration/
- Direct Upload / Wrangler：https://developers.cloudflare.com/pages/get-started/direct-upload/
- Pages Functions：https://developers.cloudflare.com/pages/functions/
- Pages Functions 配置：https://developers.cloudflare.com/pages/functions/wrangler-configuration/
- D1 绑定：https://developers.cloudflare.com/pages/functions/bindings/
- 自定义域名：https://developers.cloudflare.com/pages/configuration/custom-domains/

### EdgeOne 官方文档

- 导入 Git 仓库：https://pages.edgeone.ai/zh/document/importing-a-git-repository
- 直接上传：https://pages.edgeone.ai/zh/document/direct-upload
- EdgeOne CLI：https://pages.edgeone.ai/document/edgeone-cli
- Pages Functions 概览：https://pages.edgeone.ai/zh/document/pages-functions-overview
- Node Functions：https://pages.edgeone.ai/document/node-functions
- 自定义域名：https://pages.edgeone.ai/document/custom-domain
- Deploy Button：https://pages.edgeone.ai/document/deploy-button
