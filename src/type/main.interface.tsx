export interface IUserType {
  srno: number;
  userID: string;
  password: string;
  wallet1: number;
  upline: string;
  userType: number;
  status: number;
  createDate: Date;
  userGroup: string;
  minBet: number;
  maxBet: number;
  maxPayout: number;
  playerMinBet: number;
  playerMaxBet: number;
  isApiUser: number;
  apiToken: string;
  pMGWStatus: number;
  pMGWID: string;
  pMGWToken: string;
}

export interface IPlayerType {
  srno: number;
  companySrno: number;
  companyID: string;
  gPSrno: number;
  gPName: string;
  loginID: string;
  password: string;
  status: number;
  accountType: string;
  name: string;
  phone: string;
  remark1: string;
  remark2: string;
  remark3: string;
  createBy: string;
  balance: number;
  createDate: Date;
  updateDate: Date;
}

export interface IPaginationType {
  currentPage: number;
  perPage: number;
  total: number;
  totalPage: number;
}

export interface ITransactionType {
  srno: number;
  companySrno: number;
  mktSrno: number;
  mBank: string;
  iNValue: number;
  oUTValue: number;
  remark: string;
  bonusPer: number;
  bonus: number;
  cuci: number;
  status: number;
  createBy: string;
  createDate: Date;
  recordType: string;
  bankRecordSrno: number;
  bankDate: string;
  bankRemark: string;
  bankAmount: number;
  isManual: number;
  isLater: number;
  isFreeCredit: number;
  companyID: string;
  customerBank: string;
  customerBankAccName: string;
  customerBankAccNo: string;
  receiptUrl: string;
  toGame: string;
  toGameID: string;
  toName: string;
  toHpNo: string;
}

export interface IGameProviderType {
  srno: number;
  gameName: string;
  bOURL: string;
  playerUrl: string;
  status: number;
  createBy: string;
  createDate: Date;
  autoBot: number;
}

export interface IDeviceType {
  srno: number;
  code: string;
  item: string;
  status: number;
  createBy: string;
  createDate: Date;
  sort: number;
}

export interface ICompanyType {
  srno: number;
  companyID: string;
  spreedSheetID: string;
  googleSheetUrl: string;
  status: number;
  createBy: string;
  createDate: Date;
  botSrno: number;
}

export interface ICompanyBankType {
  srno: number;
  companyID: string;
  companySrno: number;
  bankCode: string;
  balance: number;
  createDate: Date;
  updateDate: Date;
}

export interface ICompanyGPType {
  srno: number;
  companyID: string;
  companySrno: number;
  balance: number;
  createDate: Date;
  gameName: string;
}
export interface IBankRecordMarketingType {
  srno: number;
  companyID: string;
  companySrno: number;
  bankCode: string;
  bankDate: string;
  bankRemark: string;
  bankAmount: number;
  debit: number;
  credit: number;
  status: number;
  createBy: number;
  receiptUrl: string;
  createDate: Date;
  gameName: string;
}
