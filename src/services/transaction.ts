import differenceBy from 'lodash/differenceBy';
import { PagingData, TransactionData } from '../types';
import { pageLimit, pageTransactionsPattern} from '../constants';
import { client } from '../http';

interface AccountWithTransactions {
    acc_number: string;
    transactions: TransactionData[];
}

interface PagedTransactions {
    transactions: TransactionData[];
    links: PagingData;
}

function getNextPage(pageInfo: string): number {
    const result = pageTransactionsPattern.exec(pageInfo);
    return Number(result[1]);
}

async function fetchTransactionPage(accountId: string, page: number): Promise<PagedTransactions> {
    try {
        console.log(`[TRANSACTIONS] GET /accounts/${accountId}/transactions?page=${page}`);
        const { data } = await client.get<PagedTransactions>(`/accounts/${accountId}/transactions?page=${page}`);
        return data;
    } catch (err) {
        console.error(`[TRANSACTIONS] GET /accounts/${accountId}/transactions?page=${page} - Unexpected error`)
    }
}

async function getTransactions(accountId: string): Promise<AccountWithTransactions> {
    try {
        let page = 1;
        const transactions: TransactionData[] = [];
        while (page < pageLimit) {
            const pagedTransactions = await fetchTransactionPage(accountId, page);
            const filteredTransactions = differenceBy(pagedTransactions.transactions, transactions, ({id}) => id);
            transactions.push(...filteredTransactions);
            if (pagedTransactions.links.next != '') {
                page = getNextPage(pagedTransactions.links.next);
            } else {
                return {
                    acc_number: accountId,
                    transactions,
                };
            }
        }
        return {
            acc_number: accountId,
            transactions,
        };
    } catch (err) {
        console.error(`[TRANSACTIONS] Unexpected error`)
    }
}

export { getTransactions };
