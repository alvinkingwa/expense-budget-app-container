import { Account } from './account.entity';

export interface DepositResponse {
  account: Account;
  receiverName: string;
}
