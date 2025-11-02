import React from 'react';
import { useAppContext } from '../context/AppContext';
import { TransactionType } from '../types';
import { formatCurrency } from '../utils/formatters';

const MonthlyChart: React.FC = () => {
    const { state } = useAppContext();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = state.transactions.filter(tx => {
        const txDate = new Date(tx.date + 'T00:00:00');
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
        .filter(tx => tx.type === TransactionType.INCOME)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const expense = monthlyTransactions
        .filter(tx => tx.type === TransactionType.EXPENSE)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const total = income + expense;
    const incomePercent = total > 0 ? (income / total) * 100 : 0;
    const expensePercent = total > 0 ? (expense / total) * 100 : 0;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Gráfico Mensual (Ingresos vs Gastos)</h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Ingresos</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">{formatCurrency(income)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${incomePercent}%` }}></div>
                    </div>
                </div>
                <div>
                     <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">Gastos</span>
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">{formatCurrency(expense)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${expensePercent}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyChart;