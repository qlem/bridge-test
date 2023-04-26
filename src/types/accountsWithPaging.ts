import { PagingData } from './pagingData';

interface AccountData {
    acc_number: string;
    amount: number;
    currency: string;
}

interface AccountsWithPaging {
    accounts: AccountData[];
    links: PagingData;
}

export { AccountsWithPaging, AccountData };
