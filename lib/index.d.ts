declare module "prs-lib" {
  interface PRSConfigOpts {
    env?: string;
    debug?: boolean;
    address?: string;
    token?: string;
    privateKey?: string;
    host?: string;
    onApiError?(err: Error, res: any): any | Promise<any>;
    onApiSuccess?(res: any): any | Promise<any>;
  }

  interface PRSConfig extends PRSConfigOpts {
    getHost(): string;
  }

  interface KeyStore {
    new (config: PRSConfig): KeyStore;
    loginByEmail(email: string, password: string): Promise<any>;
    loginByPhone(phone: string, code: string): Promise<any>;
  }

  interface User {
    new (config: PRSConfig): User;
    getByAddress(address: string): Promise<any>;
    editProfile(proffile: object): Promise<any>;
    uploadAvatar(avatarBase64String: string): Promise<any>;
  }

  interface PageOpt {
    offset?: number;
    limit?: number;
  }

  interface Subscription {
    new (config: PRSConfig): Subscription;
    getSubscriptionJson(
      address: string,
      options?: {
        limit?: number;
        offset?: number;
        asCount?: boolean;
        isPersonal?: boolean | string;
        accountType?: string;
      }
    ): Promise<any>;
    getSubscriptions(
      address: string,
      options?: {
        limit?: number;
        offset?: number;
        asCount?: boolean;
        isPersonal?: boolean | string;
        accountType?: string;
      }
    ): Promise<any>;
    getSubscribers(address: string, options?: PageOpt): Promise<any>;
    getRecommendationJson(options?: PageOpt): Promise<any>;
    getRecommendations(options?: PageOpt): Promise<any>;
    subscribe(address: string): Promise<any>;
    unsubscribe(address: string): Promise<any>;
    checkSubscription(
      subscriberAddress: string,
      publisherAddress: string
    ): Promise<any>;
  }

  interface Finance {
    new (config: PRSConfig): Finance;
    getWallet(): Promise<any>;
    getTransactions(options?: PageOpt): Promise<any>;
    withdraw(amount: number, options?: { header: object }): Promise<any>;
    recharge(amount: number): Promise<any>;
  }

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

  interface SuperAgentUploadEvent {
    total: number;
    uploaded: number;
    percent: number;
  }

  interface File {
    new (config: PRSConfig): File;
    signByFileReader(
      data: FileData,
      onUploadProgress?: (event: SuperAgentUploadEvent) => any,
      onHashProgress?: (percent: number) => any
    ): Promise<any>;
    signByStream(data: FileData, meta: object): Promise<any>;
    signByBuffer(data: FileData, meta: object): Promise<any>;
    getByRId(
      rId: string,
      options?: { rewardersLimit?: number; withUser?: boolean }
    ): Promise<any>;
    getByMsghash(
      msghash: string,
      options?: { rewardersLimit?: number; withUser?: boolean }
    ): Promise<any>;
    reward(
      rId: string,
      amount: number,
      options?: { memo?: string; comment?: string; header?: object }
    ): Promise<any>;
    getFeeds(
      address: string,
      options?: { limit?: number; offset?: number; [key: string]: any }
    ): Promise<any>;
  }

  interface Block {
    new (config: PRSConfig): Block;
    getByRIds(rIds: [string], options?: { withDetail: boolean }): Promise<any>;
  }

  interface DraftContent {
    title: string;
    content: string;
    mimeType: string;
    source?: string;
    originUrl?: string;
    projectId?: string;
  }

  interface Draft {
    new (config: PRSConfig): Draft;
    create(draft: DraftContent): Promise<any>;
    update(id: string, draft: DraftContent): Promise<any>;
    delete(id: string): Promise<any>;
    getById(id: string): Promise<any>;
    getDrafts(options?: PageOpt): Promise<any>;
  }

  interface Contract {
    new (config: PRSConfig): Contract;
    getTemplates(type: string): Promise<any>;
    create(code: string, hashAlg: string): Promise<any>;
    bind(
      data: {
        contractRId: string;
        fileRId: string;
        beneficiaryAddress: string;
      },
      hashAlg: string
    ): Promise<any>;
    getByRId(rId: string): Promise<any>;
    getContracts(options?: PageOpt): Promise<any>;
  }

  interface Order {
    new (config: PRSConfig): Contract;
    create(data: {
      contractRId: string;
      fileRId: string;
      licenseType: string;
    }): Promise<any>;
    getOrdersByContractRId(
      contractRId: string,
      options?: PageOpt
    ): Promise<any>;
    getPurchasedOrders(options?: {
      offset?: number;
      limit?: number;
      type?: string;
    }): Promise<any>;
    getOrderByRId(rId: string): Promise<any>;
  }

  interface DappContent {
    name: string;
    description?: string;
    redirectUrl?: string;
    url?: string;
    logo?: string;
  }
  interface Dapp {
    new (config: PRSConfig): Dapp;
    isNameExist(name: string): Promise<any>;
    create(dapp: DappContent): Promise<any>;
    update(address: string, dapp: DappContent): Promise<any>;
    delete(address: string): Promise<any>;
    getByAddress(
      address: string,
      options?: { withDeveloper: boolean }
    ): Promise<any>;
    getDApps(): Promise<any>;
    getAuthorizeUrl(appAddress: string): Promise<any>;
    webAuthorize(appAddress: string, hashAlg: string): Promise<any>;
    authByCode(
      code: string,
      appAddress: string,
      appPrivateKey: string
    ): Promise<any>;
    authenticate(
      appAddress: string,
      authAddress: string,
      hashAlg: string
    ): Promise<any>;
    deauthenticate(
      appAddress: string,
      authAddress: string,
      hashAlg: string
    ): Promise<any>;
    listAuthorized(): Promise<any>;
  }

  interface AuthHeader {
    [name: string]: string | string[];
    "Content-Type": string;
    "X-Po-Auth-Address": string;
    "X-Po-Auth-Sig": string;
    "X-Po-Auth-Msghash": string;
  }
  interface SignUtil {
    signByToken(data: any, token: string, host: string): Promise<any>;
    hashByFileReader(file: any, cb: (progress: number) => void): Promise<any>;
    hashByReadableStream(stream: any): Promise<any>;
    hashByPassword(email: string, password: string): string;
    hashRequest(path: string, payload: object): string;
    signRequest(
      path: string,
      payload: object,
      privateKey: string
    ): { hash: string; signature: string };
    getAuthHeader(
      path: string,
      payload: object,
      privateKey: string
    ): AuthHeader;
  }

  interface PRSLib {
    new (config?: PRSConfigOpts): PRSLib;
    config: PRSConfig;
    keystore: KeyStore;
    user: User;
    subscription: Subscription;
    finance: Finance;
    file: File;
    block: Block;
    draft: Draft;
    contract: Contract;
    order: Order;
    dapp: Dapp;
    util: SignUtil;
  }

  var PRS: PRSLib;

  export = PRS;
}

