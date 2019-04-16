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

[PRS SDK](https://github.com/Press-One/prs-sdk-js) 中有不同场景的使用示例，开发者可前往下载。具体的使用方法，请参考[开发文档](https://developer.press.one)。

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

### PRS

> const prs = new PRS(options)

- options.env: 设置开发环境。正式环境为'prod', 开发环境为'dev'.
- options.debug: 开启调试日志，开启后 SDK 会把网络请求、错误消息等信息输出到IDE的日志窗口。
- options.address: 授权用户的 address.
- options.token: 授权用户的 access token.
- options.privateKey: 授权用户的 privateKey.

### prs.dapp

在创建 prs 实例后，可以使用 prs.dapp 进行对 dapp 接口的交互

#### create

创建接口，调用接口进行 dapp 的创建，为了避免名称冲突，另外还提供了 dapp 名称的查询接口： `isNameExist`。

```javascript
const dapp = {};
const name = 'test dapp' + Date.now();
const nameAvailable = await prs.dapp.isNameExist(name).then(res => res.body);
console.log(nameAvailable)
if (nameAvailable) {
  const createRes = await prs.dapp.create(dapp);
  console.log(createRes)
}
```

> prs.dapp.isNameExist(name)

- params:
  - name: string
- returns: Promise
  - res.data
    - isExist: boolean

> prs.dapp.create(dapp)

- params:
  - dapp.name: string
  - dapp.description: string
  - dapp.url: string
  - dapp.redirectUrl: string
  - dapp.logo: string
- returns: Promise
  - res.data
    - address: string
    - privateKey: string
    - other meta data

注意，传入参数 name，description，url 和 redirectUrl 存在长度 < 255 的限制，超过时会被截断。logo 参数为图片的 base64 的字符串。

#### update

更新接口，更新 dapp 信息

```javascript
const updatedRes = await prs.dapp.update(address, dapp)
  .then(res => res.body)
console.log(updatedRes)
```

- params:
  - address: string
  - dapp(同 create 参数)
- returns: Promise(同 create 返回)

#### delete

```javascript
const deleteRes = await prs.dapp.delete(address)
  .then(res => res.body)
console.log(deleteRes)
```

- params:
  - address: string
- returns: Promise
  - res.data
    - deletedAt: string(UTC时间)

#### getByAddress

```javascript
const dappRes = await prs.dapp.getByAddress(createRes.address)
  .then(res => res.body)
console.log(dappRes)
```

- params:
  - address: string
- returns: Promise(同 create 返回)

#### getAuthorizeUrl

```javascript
// 引导用户使用浏览器访问，进行授权
const authorizeUrl = prs.dapp.getAuthorizeUrl(createRes.address)
console.log(authorizeUrl)
```

- params:
  - address: string
- returns: string

#### webAuthorize

```javascript
// 这里的例子是自己向刚刚创建的 dapp 授权，实际可以传入其他 dapp 的地址进行授权
const webAuthRes = await prs.dapp.webAuthorize(createRes.address)
  .then(res => res.body)
console.log(webAuthRes)
```

- params:
  - address: string
- returns: Promise
  - res.data
    - code: string
    - redirectUrl: string

#### authByCode

```javascript
// 这里需要使用 dapp 的身份进行操作
const dappClient = new PRS({
  env: 'env', debug: true, privateKey: dappRes.privateKey, address: createRes.address
})
const authRes = await dappClient.dapp.authByCode(webAuthRes.code, createRes.address, dappClient.config.privateKey)
  .then(res => res.body)
console.log(authRes)
```

- params:
  - code: string
  - address: string (dapp 的 address)
  - privateKey: string (dapp 的 private key)
- returns: Promise
  - res.data
    - token: string
    - appAuthentication
      - userAddress: string
      - signature: string
      - appAddress: string
      - authAddress: string

#### deauthenticate

取消对 dapp 的授权

```javascript
// 解除授权
const deAuthRes = await prs.dapp.deauthenticate(appAddress, authAddress)
  .then(res => res.body)
console.log(deAuthRes)

```

- params:
  - appAddress: string
  - authAddress: string
- returns: Promise
  - res.data
    - appAuthentication
      - status: 'CANCELED'
      - other meta data
