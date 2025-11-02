import React, { useState } from 'react';
import { IncomeIcon } from '../icons/IncomeIcon';
import { ExpenseIcon } from '../icons/ExpenseIcon';
import { TransferIcon } from '../icons/TransferIcon';
import AddTransactionModal from '../modals/AddTransactionModal';
import AddTransferModal from '../modals/AddTransferModal';
import { TransactionType } from '../../types';

const QuickActionsWidget: React.FC = () => {
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <button onClick={() => setIsIncomeModalOpen(true)} className="flex flex-col items-center p-3 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700">
                        <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                            <IncomeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Ingreso</span>
                    </button>
                    <button onClick={() => setIsExpenseModalOpen(true)} className="flex flex-col items-center p-3 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700">
                        <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                            <ExpenseIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Gasto</span>
                    </button>
                    <button onClick={() => setIsTransferModalOpen(true)} className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                            <TransferIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Transferir</span>
                    </button>
                </div>
            </div>
            <AddTransactionModal 
                isOpen={isIncomeModalOpen} 
                onClose={() => setIsIncomeModalOpen(false)} 
                type={TransactionType.INCOME} 
            />
            <AddTransactionModal 
                isOpen={isExpenseModalOpen} 
                onClose={() => setIsExpenseModalOpen(false)} 
                type={TransactionType.EXPENSE} 
            />
            <AddTransferModal 
                isOpen={isTransferModalOpen} 
                onClose={() => setIsTransferModalOpen(false)} 
            />
        </>
    );
};

export default QuickActionsWidget;