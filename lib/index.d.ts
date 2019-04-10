declare module 'prs-lib';

interface PRSConfigOpts {
  env?: string;
  debug?: boolean;
  address?: string;
  token?: string;
  privateKey?: string;
}

interface PRSConfig extends PRSConfigOpts {
  getHost(): string;
}

interface KeyStore {
  new(config: PRSConfig): KeyStore;
  getByEmail(email: string, password: string): Promise<any>;
  getByPhone(phone: string, code: string): Promise<any>;
}

interface User {
  new(config: PRSConfig): User;
  getByAddress(address: string): Promise<any>;
  editProfile(proffile: object): Promise<any>;
  uploadAvatar(avatarBase64String: string): Promise<any>;
}

interface Subscription {
  new(config: PRSConfig): Subscription;
  getSubscriptionJson(address: string, offset: number, limit: number):
    Promise<any>;
  getSubscriptions(address: string, offset: number, limit: number):
    Promise<any>;
  getSubscribers(address: string, offset: number, limit: number): Promise<any>;
  getRecommendationJson(offset: number, limit: number): Promise<any>;
  getRecommendations(offset: number, limit: number): Promise<any>;
  subscribe(address: string): Promise<any>;
  unsubscribe(address: string): Promise<any>;
  checkSubscription(subscriberAddress: string, publisherAddress: string):
    Promise<any>;
}

interface PageOpt {
  offset: number, limit: number
}

interface Finance {
  new(config: PRSConfig): Finance;
  getWallet(): Promise<any>;
  getTransactions(opt: PageOpt): Promise<any>;
  withdraw(amount: number): Promise<any>;
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
interface File {
  new(config: PRSConfig): File;
  signByFileReader(data: FileData, meta: object): Promise<any>;
  signByStream(data: FileData, meta: object): Promise<any>;
  signByBuffer(data: FileData, meta: object): Promise<any>;
  getByRId(rId: string): Promise<any>;
  getByMsghash(msghash: string): Promise<any>;
  reward(rId: string, amount: number, comment: string): Promise<any>;
  getFilesByAddress(address: string, opt: PageOpt): Promise<any>;
}

interface Block {
  new(config: PRSConfig): Block;
  getByRIds(rIds: [string]): Promise<any>;
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
  new(config: PRSConfig): Draft;
  create(draft: DraftContent): Promise<any>;
  update(id: string, draft: DraftContent): Promise<any>;
  delete(id: string): Promise<any>;
  getById(id: string): Promise<any>;
  getDrafts(): Promise<any>;
}

interface Contract {
  new(config: PRSConfig): Contract;
  getTemplates(type: string): Promise<any>;
  create(code: string): Promise<any>;
  bind(contractRId: string, fileRId: string, beneficiaryAddress: string):
    Promise<any>;
  getByRId(rId: string): Promise<any>;
  getContracts(opt: PageOpt): Promise<any>;
  createOrder(contractRId: string, fileRId: string, licenseType: string):
    Promise<any>;
  getOrdersByContractRId(contractRId: string, opt: PageOpt): Promise<any>;
  getPurchasedOrders(opt: PageOpt): Promise<any>;
}

interface DappContent {
  name: string;
  description?: string;
  redirectUrl?: string;
  url?: string;
  logo?: string;
}
interface Dapp {
  new(config: PRSConfig): Dapp;
  isNameExist(name: string): Promise<any>;
  create(dapp: DappContent): Promise<any>;
  update(address: string, dapp: DappContent): Promise<any>;
  delete(address: string): Promise<any>;
  getByAddress(address: string): Promise<any>;
  getDApps(): Promise<any>;
  getAuthorizeUrl(appAddress: string): Promise<any>;
  webAuthorize(appAddress: string): Promise<any>;
  authByCode(code: string, appAddress: string, appPrivateKey: string):
    Promise<any>;
  authenticate(appAddress: string, authAddress: string): Promise<any>;
  deauthenticate(appAddress: string, authAddress: string): Promise<any>;
}

interface SignUtil {
  signByToken(data: any, token: string, host: string): Promise<any>;
  hashByFileReader(file: any, cb: (progress: number) => void): Promise<any>;
  hashByReadableStream(stream: any): Promise<any>;
  hashByPassword(email: string, password: string): string;
}

interface PRSLib {
  new(config?: PRSConfigOpts): PRSLib;
  config: PRSConfig;
  keystore: KeyStore;
  user: User;
  subscription: Subscription;
  finance: Finance;
  file: File;
  block: Block;
  draft: Draft;
  contract: Contract;
  dapp: Dapp;
  util: SignUtil;
}

export declare var PRS: PRSLib;

export default PRS;
