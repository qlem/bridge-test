import { Transaction } from './Transaction';

interface Account {
    acc_number: string;
    amount: number;
    transactions: Transaction[];
}

export { Account };
