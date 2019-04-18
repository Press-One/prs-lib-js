# PRS Lib

是对 PRS REST API 的封装，开发者可以直接调用与 PRS 服务进行通信。

PRS 目前提供了两个环境供开发者使用：

- 正式环境，域名是 https://press.one 。
- 测试环境，域名是 https://beta.press.one 。

目前对 DApp 开放的接口有：

- DApp 创建和维护。
- 用户授权。
- 签名。
- 签名文件相关。(签名文件、获取文件)
- 合约相关。（创建合约、绑定合约、查询合约）
- 合约交易相关。（购买合约、合约交易记录）
- 区块信息查询。
- 钱包相关。（查询钱包、查询交易历史、充值、提现）

## 快速开始

### 注册账号

1. 开发者前往 PRS 官网注册账号。(正式环境：https://press.one，测试环境：https://beta.press.one )
2. 登录成功后进入[开发者设置](https://beta.press.one/developer/settings)、[我的 DApp](https://beta.press.one/developer/apps)，完善开发者信息以及创建 DApp。
3. 在项目中安装此 [Lib](https://github.com/Press-One/prs-lib-js) .
4. DApp 在合适的时候引导用户进行授权。
5. 授权成功后即可进行签名发布文件、创建合约等操作。

[PRS SDK](https://github.com/Press-One/prs-sdk-js) 中有不同场景的使用示例，开发者可前往下载，配合 [API](API.md) 文档进行阅读。更多信息，请参考[开发者网站](https://developer.press.one)。

### 安装

通过 npm 安装:

```bash
npm install prs-lib --save
```

### 初始化

在代码中通过 require 获得 SDK 的引用，之后创建 client:

```javascript
const PRS = require('prs-lib');
// 初始化 client。
const client = new PRS({ env: 'env', debug: true, address: authAddress, token: token });
```

- env: 设置开发环境。正式环境为'prod', 开发环境为'dev'.
- debug: 开启调试日志，开启后 SDK 会把网络请求、错误消息等信息输出到IDE的日志窗口。
- address: 授权用户的 address.
- token: 授权用户的 access token.
- privateKey: 授权用户的 privateKey.

### 示例代码

以下代码根据块的 id 从链上对块内容进行获取

```javascript
const PRS = require('prs-lib');

const client = new PRS({ env: 'env', debug: true });
const res = client.block.getByRIds(['ba03bd584d69b89615ce8db22b4c593342a5ec09b343a7859044a8e4d389c4c2', '65163724a98d29506b1031dc68fa62fb5a7a11fe631fb723a723b2a19e9bb65c'])
console.log(res.body);
```

## API

prs-lib 暴露一个 PRS 类，开发者通过创建 PRS 实例，来对 REST API 进行交互。

请参考[API.md](API.md)