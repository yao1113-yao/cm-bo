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
  mktDetailsSrno: number;
  mBank: string;
  iNValue: number;
  oUTValue: number;
  mktBankIn: number;
  mktBankOut: number;
  remark: string;
  bonusPer: number;
  bonus: number;
  credit: number;
  cuci: number;
  status: number;
  beforeBalance: number;
  afterBalance: number;
  createBy: string;
  sysRemark1: string;
  createDate: Date;
  recordType: string;
  bankRecordSrno: number;
  kioskErrorSrno: number;
  bankDate: string;
  bankRemark: string;
  bankAmount: number;
  isManual: number;
  isLater: number;
  isSeen: number;
  isFreeCredit: number;
  isEditing: number;
  companyID: string;
  customerBank: string;
  customerBankAccName: string;
  customerBankAccNo: string;
  receiptUrl: string;
  toGame: string;
  toGameID: string;
  toName: string;
  toHpNo: string;
  bankACcountStatus: number;
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
  balanceGP: number;
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

export interface IBankErrorType {
  srno: number;
  companyBankSrno: number;
  bankRecordSrno: number;
  type: string;
  staffID: string;
  amount: number;
  remark: string;
  createBy: string;
  createDate: Date;
  updateBy: string;
  UpdateDate: Date;
}

export interface ILogType {
  srno: number;
  companyGameProviderSrno: number;
  bankRecordSrno: number;
  type: string;
  staffID: string;
  beforeBalance: number;
  balance: number;
  afterBalance: number;
  mktSrno: number;
  remark: string;
  gameName: string;
  createBy: string;
  createDate: Date;
}

export interface ITeamCaseType {
  srno: number;
  companyID: string;
  totalCase: number;
  totalDepositCase: number;
  totalWithdrawCase: number;
}

export interface ITeamKioskBalance {
  srno: number;
  companyID: string;
  gpCount: number;
  gameName: string;
  balance: number;
  balanceGP: number;
}
export interface ITeamStaffSalesType {
  srno: number;
  companyID: string;
  userID: string;
  deposit: number;
  withdraw: number;
  totalCase: number;
}

export interface ITotalValueType {
  totalDeposit: number;
  totalWithdraw: number;
  totalProfit: number;
  totalBonus: number;
  totalMktBankIn: number;
  totalMktBankOut: number;
}
export interface ITeamSalesDetailsType {
  srno: number;
  companyID: string;
  userID: string;
  cashierDeposit: number;
  cashierWithdraw: number;
  marketingDeposit: number;
  marketingWithdraw: number;
}

export interface IKioskLogType {
  srno: number;
  companyID: string;
  gameName: string;
  gameID: string;
  beforeBalance: number;
  balance: number;
  afterBalance: number;
  remark: string;
  mktDetailsSrno: number;
  createDate: Date;
}

export interface ITeamErrorReportType {
  srno: number;
  companyID: string;
  userID: string;
  errorCount: number;
  errorAmount: number;
}
export interface ITeamErrorReportSummaryType {
  srno: number;
  companyID: string;
  userID: string;
  balance: number;
  createBy: string;
  createDate: Date;
  type: string;
  bankCode: string;
  remark: string;
  gameName: string;
}

export interface IPendingMarketingCountType {
  countDeposit: number;
  countWithdraw: number;
  countTransfer: number;
  countRekemen: number;
}

export interface IErrorKioskMarketingRecord {
  srno: number;
  companySrno: number;
  iNValue: number;
  remark: string;
  total: number;
  customerBank: string;
  bankCode: string;
  bankRemark: string;
  bankDate: string;
}
