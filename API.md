# API

prs-lib 暴露一个 PRS 类，PRS 主要对 REST API 进行了封装，方便开发者对资源进行操作。同时也对常用的加解密过程进行了封装，以静态方法的形式（`PRS.util`）暴露出来。

## PRS

> const prs = new PRS(options)

- options.env: 设置开发环境。正式环境为'prod', 开发环境为'dev'.
- options.debug: 开启调试日志，开启后 SDK 会把网络请求、错误消息等信息输出到IDE的日志窗口。
- options.address: 授权用户的 address.
- options.token: 授权用户的 access token.
- options.privateKey: 授权用户的 privateKey.

初始化完毕后，可以调用以下方法

- [`prs.config`](#prsconfig)
  - [getHost](#configgetHost)
- [`prs.draft`](#prsdraft)
  - [create](#draftcreate)
  - [update](#draftupdate)
  - [delete](#draftdelete)
  - [getById](#draftgetById)
  - [getDrafts](#draftgetDrafts)
- [`prs.dapp`](#prsdapp)
  - [create](#dappcreate)
  - [update](#dappupdate)
  - [delete](#dappdelete)
  - [getByAddress](#dappgetByAddress)
  - [getAuthorizeUrl](#dappgetAuthorizeUrl)
  - [webAuthorize](#dappwebAuthorize)
  - [authByCode](#dappauthByCode)
  - [deauthenticate](#dappdeauthenticate)
- [`prs.file`](#prsfile)
  - [signByFileReader](#filesignByFileReader)
  - [signByStream](#filesignByStream)
  - [signByBuffer](#filesignByBuffer)
  - [getByRId](#filegetByRId)
  - [getByMsghash](#filegetByMsghash)
  - [getFilesByAddress](#filegetFilesByAddress)
  - [reward](#filereward)
- [`prs.finance`](#prsfinance)
  - [getWallet](#financegetWallet)
  - [getTransactions](#financegetTransactions)
  - [recharge](#financerecharge)
  - [withdraw](#financewithdraw)
- [`prs.block`](#prsblock)
  - [getByRIds](#blockgetByRIds)
- [`prs.contract`](#prscontract)
  - [getTemplates](#contractgetTemplates)
  - [create](#contractcreate)
  - [getByRId](#contractgetByRId)
  - [bind](#contractbind)
- [`prs.order`](#prsorder)
  - [createOrder](#ordercreateOrder)
  - [getOrdersByContractRId](#ordergetOrdersByContractRId)
  - [getPurchasedOrders](#ordergetPurchasedOrders)
  - [getOrderByRId](#ordergetOrderByRId)
- [`prs.keystore`](#prskeystore)
  - [getByEmail](#keystoregetByEmail)
  - [getByPhone](#keystoregetByPhone)
- [`prs.user`](#prsuser)
  - [getByAddress](#usergetByAddress)
  - [editProfile](#usereditProfile)
  - [uploadAvatar](#useruploadAvatar)
- [`prs.subscription`](#prssubscription)
  - [getSubscriptions](#subscriptiongetSubscriptions)
  - [getSubscriptionJson](#subscriptiongetSubscriptionJson)
  - [getSubscribers](#subscriptiongetSubscribers)
  - [subscribe](#subscriptionsubscribe)
  - [checkSubscription](#subscriptioncheckSubscription)
  - [unsubscribe](#subscriptionunsubscribe)
  - [getRecommendations](#subscriptiongetRecommendations)
  - [getRecommendationJson](#subscriptiongetRecommendationJson)

另外 PRS 还存在静态方法

- [`PRS.util`](#PRSutil)
  - [signByToken](#utilsignByToken)
  - [hashByReadableStream](#utilhashByReadableStream)
  - [hashByFileReader](#utilhashByFileReader)
  - [hashByPassword](#utilhashByPassword)
  - [hashRequest](#utilhashRequest)
  - [signRequest](#utilsignRequest)
  - [getAuthHeader](#utilgetAuthHeader)

所有模块的示例都在 `prs-sdk/samples` 目录下给出，例如 `prs.dapp` 的示例文件对应为 `prs-sdk/samples/dapp.example.js`

`prs-lib` 和 `prs-utility` 均提供 type 文件，并且都是一层薄封装，推荐配合源码查看。

### prs.config

可访问当前 prs 实例创建时的身份信息，比如 `prs.config.env` 对应构造函数传入的 `options.env`。

另外提供了函数，获取 api 的 host

#### config.getHost

> getHost(): string;

- returns: string # PRS 的 host

### prs.draft

封装了对草稿的操作

#### draft.create

创建草稿操作

> create(draft: DraftContent): Promise

- params: Draft
  - Draft.title: string
  - Draft.content: string
  - Draft.mimeType: string
- returns: Promise<Response\>
  - Response.body
    - draftId: number

#### draft.update

更新草稿

> update(id: string, draft: DraftContent): Promise

- params:
  - draftId: number
  - draftNew: Draft
- returns: Promise<Response\>
  - Response.body: boolean

#### draft.delete

删除草稿

> delete(id: string): Promise

- params:
  - draftId: string
- returns: Promise<Response\>
  - Response.body: boolean

#### draft.getById

根据 id 获取草稿

> getById(id: string): Promise

- params:
  - draftId: string
- returns: Promise<Response\>
  - Response.body
    - file: object
      - id: string
      - other props..
    - user: object
      - address: string
      - name: string
      - avatar: string
      - other props..

#### draft.getDrafts

获取所有 draft

> getDrafts(): Promise

- returns: Promise<Response\>
  - Response.body
    - data: object
      - total: number
      - list: [Draft]

### prs.dapp

在创建 prs 实例后，可以使用 `prs.dapp` 进行对 dapp 接口的交互

#### dapp.create

创建接口，调用接口进行 dapp 的创建，为了避免名称冲突，另外还提供了 dapp 名称的查询接口： `isNameExist`。

> isNameExist(name: string): Promise

- returns: Promise<Response\>
  - Response.body
    - isExist: boolean

> create(dapp: DappContent): Promise

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

#### dapp.update

更新接口，更新 dapp 信息

> update(address: string, dapp: DappContent): Promise

- params:
  - address: string
  - dapp(同 create 参数)
- returns: Promise(同 create 返回)

#### dapp.delete

> delete(address: string): Promise

- params:
  - address: string
- returns: Promise<Response\>
  - Response.body
    - deletedAt: string(UTC时间)

#### dapp.getByAddress

> getByAddress(address: string): Promise

- params:
  - address: string
- returns: Promise(同 create 返回)

#### dapp.getAuthorizeUrl

引导用户使用浏览器访问，进行授权

> getAuthorizeUrl(appAddress: string): Promise

- params:
  - address: string
- returns: Promise<Response\>
  - Response.body: string

#### dapp.webAuthorize

向目标 dapp 进行授权，传入 dapp 地址，返回 code 和 redirectUrl。目标 dapp 通常会实现 `authByCode` 接受授权。

> webAuthorize(appAddress: string): Promise

- params:
  - address: string
- returns: Promise<Response\>
  - Response.body
    - code: string
    - redirectUrl: string

#### dapp.authByCode

dapp 通过 code 接受授权，获取代表用户身份的 token

> authByCode(code: string, appAddress: string, appPrivateKey: string)

- params:
  - code: string
  - address: string (dapp 的 address)
  - privateKey: string (dapp 的 private key)
- returns: Promise<Response\>
  - Response.body
    - token: string
    - appAuthentication
      - userAddress: string
      - signature: string
      - appAddress: string
      - authAddress: string

#### dapp.deauthenticate

取消对 dapp 的授权

> deauthenticate(appAddress: string, authAddress: string): Promise

- params:
  - appAddress: string
  - authAddress: string
- returns: Promise<Response\>
  - Response.body
    - appAuthentication
      - status: 'CANCELED'
      - other meta data

### prs.file

`prs.file` 封装了对文件的签名、获取、打赏等功能

#### file.signByFileReader

限定在浏览器中使用，使用 filereader 进行签名

> signByFileReader(data: FileData, meta: object): Promise

```typescript
interface FileData {
  file?: any;
  stream?: any;
  buffer?: any;
  filename?: string;
  source?: string;
  originUrl?: string;
  category?: string;
  projectId?: string | number;
}
```

#### file.signByStream

限定在 node 项目使用，对 Readable Streams 进行签名

> signByStream(data: FileData, meta: object): Promise

- params:
  - data
    - stream: Readable
    - filename: string
    - titlle: string
    - source (optional): string
    - originUrl (optional): string
    - category (optional): string
    - projectId (optional): string
  - meta: 任意结构化的数据，最终将会以 JSON 字符串的形式存储
- returns: Promise<Response\>
  - Response.body
    - cache
      - msghash: string
      - rId: string
      - address: string
      - 其他属性
    - block: object （参考[PRS 协议](https://developer.press.one/docs/0-4-block#%E6%96%87%E4%BB%B6%E7%AD%BE%E5%90%8D)）

#### file.signByBuffer

对 buffer 进行签名

> signByBuffer(data: FileData, meta: object): Promise

- params:
  - data
    - buffer: Buffer
    - filename: string
    - titlle: string
    - source (optional): string
    - originUrl (optional): string
    - category (optional): string
    - projectId (optional): string
- returns: Promise(同上)

#### file.getByRId

根据 id 查询文件记录

> getByRId(rId: string): Promise

- params:
  - id: string
- returns: Promise<Response\>
  - Response.body
    - block 同上
    - cache 同上
    - contracts: [Contract(详见下)]

#### file.getByMsghash

跟据 hash 查询文件记录

> getByMsghash(msghash: string): Promise

参数和返回结果同 `getByRId`

#### file.getFilesByAddress

根据用户的 address 获取该用户所有的文件记录

> getFilesByAddress(address: string, opt: PageOpt): Promise

```typescript
interface PageOpt {
  offset: number, limit: number
}
```

- params:
  - address: string
  - pageOpt:
    - limit: number
    - offset: number
- returns: Promise<Response\>
  - Response.body
    - author: object
      - name: string
      - url: string
      - avatar: string
    - items: array
      - id: string
      - title: string
      - url: string
      - ... 其他属性
    - _total: number

#### file.reward

打赏（注意这里是 PRS 站内行为，不上链）

> reward(rId: string, amount: number, comment: string): Promise

- params:
  - forFileRId: string
  - amount: number
  - comment: string
- returns: Promise<Response\>
  - Response.body
    - id: number
    - fromAddress: string
    - toAddress: string
    - amount: string
    - comment: string
    - status: string
    - provider: string
    - forFileRId: string
    - viewToken: string

### prs.finance

`prs.finance` 封装了对钱包的操作，包括充值、提取等。

#### finance.getWallet

获取钱包接口

> getWallet(): Promise

- returns: Promise<Response\>
  - Response.body
    - balance
      - income: string
      - expenditure: string
      - frozen: string
      - balance: string
      - available: string
    - summary
      - ALL: number
      - AWARD: number
      - WITHDRAW: number
      - BONUS: number
      - RECHARGE: number
      - TRANSFER: number
      - CONTRACT_LICENSE_PURCHASE: number
      - COUPON: number

#### finance.getTransactions

获取交易历史记录

> getTransactions(opt: PageOpt): Promise

- params:
  - offset: number
  - limit: number
- returns: Promise<Response\>
  - Response.body
    - list: array
      - fromAddress: string
      - toAddress: string
      - amount: string
      - other props...
    - total: number

#### finance.recharge

充值接口

> recharge(amount: number): Promise

- params:
  - amount: number
- returns: Promise<Response\>
  - Response.body
    - receipt: object
      - fromAddress: string
      - toAddress: string
      - amount: string
      - other props...

#### finance.withdraw

提现接口

> withdraw(amount: number): Promise

- params:
  - amount: number
- returns: Promise<Response\>
  - Response.body
    - receipt: object
      - fromAddress: string
      - toAddress: string
      - amount: string
      - other props...

### prs.block

`prs.block` 提供对区块的查询功能。

#### block.getByRIds

> getByRIds(rIds: [string], withDetail: boolean): Promise

- params:
  - ids: [string]
  - withDetail: boolean
- returns: Promise<Response\>
  - Response.body: [Block]

查询区块的信息，如果 withDetail 为 true，那么每个区块将会携带一些额外信息（比如用户名称、头像等）

### prs.contract

`prs.contract` 封装了对合约的操作，包括创建、绑定合约，交易授权等等。

#### contract.getTemplates

> getTemplates(type: string): Promise

- params:
  type: string
- returns: Promise<Response\>
  - Response.body
    - total: number
    - list: [Contract]
      - Contract.code: string
      - Contract.name: string
      - Contract.description: string
      - Contract.licenses: [License]
        - License.type: string
        - License.currency: string
        - License.termtext: string

#### contract.create

创建合约

> create(code: string): Promise

- params:
  - code: string
- returns: Promise<Response\>
  - Response.body
    - contract.rId: string

#### contract.getByRId

> getByRId(rId: string): Promise;

- params:
  rId: 合约 id
- returns: Promise

#### contract.bind

绑定合约，需要提供合约 id，文件 id，以及受益人的地址。

> bind(contractRId: string, fileRId: string, beneficiaryAddress: string): Promise;

绑定合约会在链上创建一个新块

- params
  - contractRId: 合约 id
  - fileRId: 文件 id
  - beneficiaryAddress: 受益人地址
- returns: Promise<Response\>
  - Response.body
    - rId: stirng
    - type: string ('RECEIVER')
    - address: string
    - fileMsgHash: string # 文件相关元信息
    - file: string # 传入的 fileRId
    - contract: string # 传入的 contractRId
    - receiver: string # 传入的 beneficiaryAddress
    - version: number

#### contract.getContracts

> getContracts(opt: PageOpt): Promise;

- params
  - opt.limit: number
  - opt.offset: number
- returns: Promise<Response\>
  - Response.body
    - total: number
    - list: [{file: File, contract: Contract, orderSummary: {total: number, amount: string}}]

### prs.order

封装了订单相关的操作

#### order.createOrder

> createOrder(contractRId: string, fileRId: string, licenseType: string): Promise

- returns: Promise<Response\>
  - Response.body
    - rId: string # 链上的标志，可以用于查询块
    - type: string # 'SENDER'
    - file: string # fileRId
    - fileMsghash: string
    - contract: string # contractRId
    - address: string
    - receiver: string
    - license: string
    - price: string
    - currency: string
    - sender: string
    - traceId: string
    - paymentSnapshotId: string
    - senderWalletId: string
    - receiverWalletId: string

#### order.getOrdersByContractRId

获取与合约相关的订单情况

> getOrdersByContractRId(contractRId: string, opt: PageOpt): Promise

- params
  - opt.limit: number
  - opt.offset: number
- returns: Promise<Response\>
  - Response.body
    - total: number
    - list: [Order]
      - Order: 同上创建返回的数据结构
    - orderSummary: object
      - total: number
      - amount: string # 数字字符串

#### order.getPurchasedOrders

获取当前身份已付款的订单情况

> getPurchasedOrders(opt: PageOpt): Promise;

- params
  - opt.limit: number
  - opt.offset: number
- returns: Promise<Response\>
  - Response.body
    - total: number
    - list: [{file: File, order: Order, contract: Contract}]

#### order.getOrderByRId

> getOrderByRId(rId: string): Promise;

- returns: Promise<Response\>
  - Response.body
    - order: Order

### prs.keystore

实际为 pressone 的登录接口，可以根据邮箱登录，或是手机号和验证码（需要前端获取）登录，均返回 token 和 keystore 信息。

#### keystore.getByEmail

> getByEmail(email: string, password: string): Promise

- returns: Promise<Response\>
  - Response.body
    - token: string
    - keystore: sting # json string

#### keystore.getByPhone

> getByPhone(phone: string, code: string): Promise;

- returns: Promise<Response\>
  - Response.body
    - token: string
    - keystore: sting # json string

### prs.user

对 pressone 站内的用户相关接口的操作，包括获取、编辑个人信息等

#### user.getByAddress

> getByAddress(address: string): Promise

- returns: Promise<Response\>
  - Response.body
    - address: string
    - avatar: string
    - title: string
    - 其他用户信息

#### user.editProfile

> editProfile(profile: Profile): Promise

- parmas: Profile
  - Profile.name: string
  - Profile.bio: string
  - Profile.title: string
- returns: 同上

#### user.uploadAvatar

> uploadAvatar(avatarBase64String: string): Promise;

返回值同上

### prs.subscription

封装了对订阅和推荐相关的操作

#### subscription.getSubscriptions

> getSubscriptions(address: string, offset: number, limit: number): Promise

- params:
  - address: 订阅者地址
- returns: Promise<Response\>
  - Response.body
    - total: number
    - list: [SubscrptionData]

#### subscription.getSubscriptionJson

功能和上述类似，返回格式为 JSONFeed

> getSubscriptionJson(address: string, offset: number, limit: number): Promise

- params:
  - address: 订阅者地址
- returns: Promise<Response\>
  - Response.body
    - version: string # json feed 的版本号
    - user_comment: string
    - title: string
    - home_page_url: string
    - feed_url: string
    - author: object
      - name: string
      - avater: string
      - urk: string
    - items: [SubscrptionData]
    - _total: number

#### subscription.getSubscribers

获取 address 的订阅者信息

> getSubscribers(address: string, offset: number, limit: number): Promise;

- params:
  - address: 发布者地址
- returns: Promise<Response\>
  - Response.body
    - total: number
    - list: [Subscriber]
      - Subscriber.name: string
      - Subscriber.avatar: string
      - Subscriber.subscriberAddress: string

#### subscription.subscribe

发起订阅

> subscribe(address: string): Promise

- params:
  - address: 发布者地址
- returns: Promise<Response\>
  - Response.body： empty

#### subscription.checkSubscription

检查订阅状态

> checkSubscription(subscriberAddress: string, publisherAddress: string): Promise

- returns: Promise<Response\>
  - Response.body
    - id: number
    - subscriberAddress: string
    - publisherAddress: string
    - createdAt: string # date string
    - updatedAt: string # date string

#### subscription.unsubscribe

取消订阅

> unsubscribe(address: string): Promise;

- params:
  - address: 发布者地址
- returns: Promise<Response\>
  - Response.body
    - fieldCount: number
    - affectedRows: number
    - insertId: number
    - info: string
    - serverStatus: number
    - warningStatus: number

#### subscription.getRecommendations

获取推荐列表

> getRecommendations(offset: number, limit: number): Promise

- returns: Promise<Response\>
  - Response.body: [Recommendation]
    - Recommendation.id: number
    - Recommendation.name: string
    - Recommendation.description: string
    - Recommendation.avatar: string
    - Recommendation.isOfficial: boolean
    - Recommendation.version: number

#### subscription.getRecommendationJson

功能和上述类似，返回格式为 JSONFeed

> getRecommendationJson(offset: number, limit: number): Promise

- returns: Promise<Response\>
  - Response.body
    - version: string # json feed 的版本号
    - user_comment: string
    - title: string
    - home_page_url: string
    - feed_url: string
    - author: object
      - name: string
      - avater: string
      - urk: string
    - items: [RecommendationJSON]
      - RecommendationJSON.id: string
      - RecommendationJSON.title: string
      - RecommendationJSON.url: string
      - RecommendationJSON.source: string
      - RecommendationJSON.content_text: string
      - RecommendationJSON.content_html: string
      - RecommendationJSON.summary: string
      - RecommendationJSON.date_published: string
      - RecommendationJSON._sig: string
      - RecommendationJSON._rId: string
      - RecommendationJSON._msghash: string
      - RecommendationJSON._author: object
        - address: string
        - name: string
        - avatar: string
        - bio: string
        - accountType: string
        - mixinAccountId: string
        - mixinClientId: string
        - rewardAllowed: number
        - rewardDescription: string
        - recommended: number
      - RecommendationJSON._recommended_at: string
      - RecommendationJSON._type: string

    - _total: number

### PRS.util

基于 `prs-utility`，封装了一些与 pressone 交互过程中涉及到的加解密过程。

#### util.signByToken

dapp 使用经用户授权的 token，对数据进行签名（dapp代表用户身份进行签名）

> signByToken(data: any, token: string, host: string): Promise

- params:
  - data: 需要签名的结构化数据
  - token: 用户授权后，dapp 获取到代表用户身份的 token
  - host: pressone 服务器
- returns: Promise<Response\>
  - Response.body
    - hash: string
    - signature: string

#### util.hashByReadableStream

对 Readable 的 Stream 进行 hash

> hashByReadableStream(stream: Readable): Promise

#### util.hashByFileReader

前段使用，对文件进行 hash 计算

> hashByFileReader(file: File, cb: (progress: number) => void): Promise

#### util.hashByPassword

计算 email 和 password 的 hash

> hashByPassword(email: string, password: string): string

#### util.hashRequest

> hashRequest(path: string, payload: object): string;

计算请求的 hash 值

#### util.signRequest

对请求进行签名

> signRequest(path: string, payload: object, privateKey: string): { hash: string, signature: string }

#### util.getAuthHeader

获取请求头

> getAuthHeader(path: string, payload: object, privateKey: string): AuthHeader

AuthHeader 例子如下：

```text
{
  'Content-Type': 'application/json',
  'X-Po-Auth-Address': 'xxx',
  'X-Po-Auth-Sig':'xxx',
  'X-Po-Auth-Msghash':'xxx'
}
```
