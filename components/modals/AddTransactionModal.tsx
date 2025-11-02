import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAppContext } from '../../context/AppContext';
import { TransactionType, Transaction } from '../../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType.INCOME | TransactionType.EXPENSE;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, type }) => {
  const { state, dispatch } = useAppContext();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !accountId || !categoryId) return;

    const newTransaction: Transaction = {
      id: new Date().toISOString(),
      type,
      amount: parseFloat(amount),
      date,
      description,
      accountId,
      categoryId,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    onClose();
    // Reset form
    setAmount('');
    setDescription('');
    setAccountId('');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
  };
  
  const relevantCategories = state.categories.filter(c => c.type === type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={type === TransactionType.INCOME ? 'Añadir Ingreso' : 'Añadir Gasto'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-white" step="0.01"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
            <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cuenta</label>
            <select id="account" value={accountId} onChange={e => setAccountId(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-white">
              <option value="">Selecciona una cuenta</option>
              {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
            <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-white">
              <option value="">Selecciona una categoría</option>
              {relevantCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 dark:text-white" />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600">Guardar</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;