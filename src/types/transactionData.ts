interface TransactionData {
    id: string;
    label: string;
    sign: 'DBT'|'CDT';
    amount: number;
    currency: string;
}

export { TransactionData };
