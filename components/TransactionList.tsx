import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { IncomeIcon } from './icons/IncomeIcon';
import { ExpenseIcon } from './icons/ExpenseIcon';
import { TransferIcon } from './icons/TransferIcon';
import MonthlyChart from './MonthlyChart';
import { useTheme } from '../context/ThemeContext';

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

const CurrentMonthSummary: React.FC = () => {
    const { state } = useAppContext();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = state.transactions.filter(tx => {
        const txDate = new Date(tx.date + 'T00:00:00');
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    const income = monthlyTransactions.filter(tx => tx.type === TransactionType.INCOME).reduce((sum, tx) => sum + tx.amount, 0);
    const expense = monthlyTransactions.filter(tx => tx.type === TransactionType.EXPENSE).reduce((sum, tx) => sum + tx.amount, 0);
    const balance = income - expense;

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Resumen del Mes</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(income)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gastos</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(expense)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                    <p className={`text-lg font-bold ${balance >= 0 ? 'text-gray-800 dark:text-gray-200' : 'text-red-600'}`}>{formatCurrency(balance)}</p>
                </div>
            </div>
        </div>
    );
};

const HistoricalChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null); // Using any for Chart.js instance
    const { theme } = useTheme();

    useEffect(() => {
        if (!chartRef.current) return;

        const data = Array(6).fill(0).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return { month: d.getMonth(), year: d.getFullYear(), income: 0, expense: 0 };
        }).reverse();

        transactions.forEach(tx => {
            const txDate = new Date(tx.date + 'T00:00:00');
            const month = txDate.getMonth();
            const year = txDate.getFullYear();
            const monthData = data.find(d => d.month === month && d.year === year);
            if (monthData) {
                if (tx.type === TransactionType.INCOME) monthData.income += tx.amount;
                if (tx.type === TransactionType.EXPENSE) monthData.expense += tx.amount;
            }
        });

        const labels = data.map(d => new Date(d.year, d.month).toLocaleString('es-ES', { month: 'short' }));
        const incomeData = data.map(d => d.income);
        const expenseData = data.map(d => d.expense);

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const isDark = theme === 'dark';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? '#E5E7EB' : '#374151';

        chartInstanceRef.current = new (window as any).Chart(chartRef.current, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'Ingresos', data: incomeData, backgroundColor: 'rgba(16, 185, 129, 0.6)' },
                    { label: 'Gastos', data: expenseData, backgroundColor: 'rgba(239, 68, 68, 0.6)' }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };

    }, [transactions, theme]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Historial (Últimos 6 meses)</h3>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

const TransactionList: React.FC = () => {
    const { state } = useAppContext();
    const sortedTransactions = [...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getAccountName = (id: string) => state.accounts.find(a => a.id === id)?.name || 'N/A';
    const getCategoryName = (id: string) => state.categories.find(c => c.id === id)?.name || 'N/A';

    return (
        <div className="p-4 md:p-6 space-y-6">
            <CurrentMonthSummary />
            <HistoricalChart transactions={state.transactions} />
            <MonthlyChart />

             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 p-4 border-b border-gray-200 dark:border-gray-700">Todas las Transacciones</h3>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedTransactions.length > 0 ? sortedTransactions.map(tx => (
                        <li key={tx.id} className="p-4 flex items-center justify-between flex-wrap">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                                    <TransactionIcon type={tx.type} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{tx.description || tx.type}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {tx.type === TransactionType.TRANSFER ? 
                                            `Desde: ${getAccountName(tx.accountId)} | A: ${getAccountName(tx.toAccountId!)}` :
                                            `Cuenta: ${getAccountName(tx.accountId)} | Cat: ${tx.categoryId ? getCategoryName(tx.categoryId) : 'N/A'}`
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="text-right mt-2 sm:mt-0">
                                <p className={`font-bold text-lg ${tx.type === TransactionType.INCOME ? 'text-green-600' : tx.type === TransactionType.EXPENSE ? 'text-red-600' : 'text-gray-800 dark:text-gray-200'}`}>
                                     {tx.type === TransactionType.INCOME ? '+' : tx.type === TransactionType.EXPENSE ? '-' : ''}{formatCurrency(tx.amount)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(tx.date)}</p>
                            </div>
                        </li>
                    )) : (
                        <li className="p-6 text-center text-gray-500 dark:text-gray-400">No hay transacciones para mostrar.</li>
                    )}
                </ul>
             </div>
        </div>
    );
};

export default TransactionList;