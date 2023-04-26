import differenceBy from 'lodash/differenceBy';
import { Account, AccountData, PagingData } from '../types';
import { pageLimit, pageAccountPattern } from '../constants';
import { getTransactions } from './transaction';
import { client } from '../http';

interface PagedAccounts {
    accounts: AccountData[];
    links: PagingData;
}

function getNextPage(pageInfo: string): number {
    const result = pageAccountPattern.exec(pageInfo);
    return Number(result[1]);
}

async function fetchAccountPage(page: number): Promise<PagedAccounts> {
    try {
        console.log(`[ACCOUNTS] GET /accounts?page=${page}`);
        const response = await client.get<PagedAccounts>(`/accounts?page=${page}`);
        return response.data;
    } catch (err) {
        console.error(`[ACCOUNTS] GET /accounts?page=${page} - Unexpected error`)
    }
}

async function getAccounts(): Promise<Account[]> {
    try {
        let page = 1;
        const result: Account[] = [];
        const accountsData: AccountData[] = [];
        while (page < pageLimit) {
            const pagedAccounts = await fetchAccountPage(page);
            const filteredAccounts = differenceBy(pagedAccounts.accounts, accountsData, ({acc_number}) => acc_number);

            const promises = filteredAccounts.map(({ acc_number }) => getTransactions(acc_number));
            const accountsWithTransactions = await Promise.all(promises);

            filteredAccounts.forEach((account) => {
                const { transactions } = accountsWithTransactions.find(({ acc_number }) => acc_number === account.acc_number)
                result.push({
                    acc_number: account.acc_number,
                    amount: account.amount,
                    transactions: transactions.map(({ label, amount, currency }) => ({
                        label,
                        amount,
                        currency,
                    })),
                })
            })

            accountsData.push(...filteredAccounts);
            if (pagedAccounts.links.next != '') {
                page = getNextPage(pagedAccounts.links.next);
            } else {
                return result;
            }
        }

        return result;
    } catch (err) {
        console.error('[ACCOUNTS] Unexpected error')
    }
}

export { getAccounts };
