import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

const AccountSummaryWidget: React.FC = () => {
    const { state } = useAppContext();
    const totalBalance = state.accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div className="bg-primary dark:bg-primary-700 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-primary-100 dark:text-primary-200 mb-2">Balance Total</h3>
            <p className="text-4xl font-bold tracking-tight">{formatCurrency(totalBalance)}</p>
            <div className="mt-6">
                <h4 className="text-md font-semibold text-primary-100 dark:text-primary-200 mb-2">Cuentas</h4>
                {state.accounts.length > 0 ? (
                    <ul className="space-y-2">
                        {state.accounts.map(account => (
                            <li key={account.id} className="flex justify-between items-center">
                                <span className="text-primary-200">{account.name}</span>
                                <span className="font-semibold">{formatCurrency(account.balance)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-primary-200">No hay cuentas añadidas.</p>
                )}
            </div>
        </div>
    );
};

export default AccountSummaryWidget;