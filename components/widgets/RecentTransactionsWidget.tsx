import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IncomeIcon } from '../icons/IncomeIcon';
import { ExpenseIcon } from '../icons/ExpenseIcon';
import { TransferIcon } from '../icons/TransferIcon';

const TransactionIcon = ({ type }: { type: TransactionType }) => {
    switch (type) {
        case TransactionType.INCOME:
            return <IncomeIcon className="h-5 w-5 text-green-500" />;
        case TransactionType.EXPENSE:
            return <ExpenseIcon className="h-5 w-5 text-red-500" />;
        case TransactionType.TRANSFER:
            return <TransferIcon className="h-5 w-5 text-blue-500" />;
        default:
            return null;
    }
};

const RecentTransactionsWidget: React.FC = () => {
    const { state } = useAppContext();
    const recentTransactions = [...state.transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const getAccountName = (id: string) => state.accounts.find(a => a.id === id)?.name || 'Cuenta desconocida';
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transacciones Recientes</h3>
            {recentTransactions.length > 0 ? (
                <ul className="space-y-4">
                    {recentTransactions.map(tx => (
                        <li key={tx.id} className="flex items-center space-x-4">
                            <div className="bg-gray-100 p-2 rounded-full">
                                <TransactionIcon type={tx.type} />
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-700">{tx.description || tx.type}</p>
                                <p className="text-sm text-gray-500">
                                    {tx.type === TransactionType.TRANSFER && tx.toAccountId ? 
                                        `${getAccountName(tx.accountId)} → ${getAccountName(tx.toAccountId)}` :
                                        getAccountName(tx.accountId)
                                    }
                                </p>
                            </div>
                            <div className="text-right">
                                 <p className={`font-semibold ${tx.type === TransactionType.INCOME ? 'text-green-600' : tx.type === TransactionType.EXPENSE ? 'text-red-600' : 'text-gray-800'}`}>
                                    {tx.type === TransactionType.INCOME ? '+' : tx.type === TransactionType.EXPENSE ? '-' : ''}{formatCurrency(tx.amount)}
                                 </p>
                                <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No hay transacciones recientes.</p>
            )}
        </div>
    );
};

export default RecentTransactionsWidget;
