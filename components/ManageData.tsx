import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Account, Category, TransactionType, AppState } from '../types';
import { useTheme } from '../context/ThemeContext';

const ManageData: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { theme, toggleTheme } = useTheme();
    const [accountName, setAccountName] = useState('');
    const [accountBalance, setAccountBalance] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState<TransactionType.INCOME | TransactionType.EXPENSE>(TransactionType.EXPENSE);

    const handleAddAccount = (e: React.FormEvent) => {
        e.preventDefault();
        if (!accountName.trim()) return;
        const newAccount: Account = {
            id: new Date().toISOString(),
            name: accountName,
            balance: parseFloat(accountBalance) || 0,
        };
        dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
        setAccountName('');
        setAccountBalance('');
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName.trim()) return;
        const newCategory: Category = {
            id: new Date().toISOString(),
            name: categoryName,
            type: categoryType,
        };
        dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
        setCategoryName('');
    };
    
    const handleExportData = () => {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `gestor-gastos-backup.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm("¿Estás seguro? Esto reemplazará todos tus datos actuales. Se recomienda exportar los datos actuales primero.")) {
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("El archivo no es texto plano");
                const importedState = JSON.parse(text) as AppState;
                
                if (importedState.accounts && importedState.categories && importedState.transactions) {
                    dispatch({ type: 'SET_STATE', payload: importedState });
                    alert("¡Datos importados con éxito!");
                } else {
                    throw new Error("Formato de archivo inválido.");
                }
            } catch (error) {
                console.error("Error al importar datos:", error);
                alert("Error al importar el archivo. Asegúrate de que es un archivo de exportación válido.");
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <div className="p-4 md:p-6 space-y-8">
            
            {/* Appearance */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Apariencia</h3>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Tema Oscuro</span>
                    <button onClick={toggleTheme} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Tools */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                 <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Herramientas de Datos</h3>
                 <p className="text-gray-600 dark:text-gray-400 mb-4">Guarda o carga todos los datos de tu aplicación.</p>
                 <div className="flex space-x-4">
                     <button onClick={handleExportData} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                         Exportar Datos
                     </button>
                     <input type="file" id="import-file" className="hidden" onChange={handleImportData} accept=".json" />
                     <label htmlFor="import-file" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                         Importar Datos
                     </label>
                 </div>
            </div>

            {/* Accounts */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Cuentas</h3>
                <ul className="mb-4 space-y-2 max-h-40 overflow-y-auto">
                    {state.accounts.map(acc => <li key={acc.id} className="p-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 rounded">{acc.name}</li>)}
                </ul>
                <form onSubmit={handleAddAccount} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-grow">
                        <label htmlFor="accName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la cuenta</label>
                        <input id="accName" type="text" value={accountName} onChange={e => setAccountName(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div>
                        <label htmlFor="accBalance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Balance inicial</label>
                        <input id="accBalance" type="number" value={accountBalance} onChange={e => setAccountBalance(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 dark:text-white" placeholder="0" />
                    </div>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md h-10">Añadir Cuenta</button>
                </form>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Categorías</h3>
                 <ul className="mb-4 space-y-2 max-h-40 overflow-y-auto">
                    {state.categories.map(cat => <li key={cat.id} className={`p-2 rounded ${cat.type === TransactionType.INCOME ? 'bg-green-50 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/50 dark:text-red-300'}`}>{cat.name} ({cat.type})</li>)}
                </ul>
                <form onSubmit={handleAddCategory} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-grow">
                        <label htmlFor="catName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la categoría</label>
                        <input id="catName" type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 dark:text-white" required />
                    </div>
                     <div>
                        <label htmlFor="catType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                        <select id="catType" value={categoryType} onChange={e => setCategoryType(e.target.value as any)} className="mt-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 h-10 bg-white dark:bg-gray-700 dark:text-white">
                            <option value={TransactionType.EXPENSE}>Gasto</option>
                            <option value={TransactionType.INCOME}>Ingreso</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md h-10">Añadir Categoría</button>
                </form>
            </div>
        </div>
    );
};

export default ManageData;