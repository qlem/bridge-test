import { client } from './client';
import { AccountsWithPaging, AccountData } from '../types';

async function Accounts(): Promise<AccountData[]> {
    try {
        const accounts: AccountData[] = [];
        const { data } = await client.get<AccountsWithPaging>('/accounts');
        accounts.push(...data.accounts);
        return accounts;
    } catch (err) {
        console.error('[ACCOUNTS] Unexpected error')
    }
}

export { Accounts };
