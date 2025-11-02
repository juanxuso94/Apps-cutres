import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAppContext } from '../../context/AppContext';
import { TransactionType, Transaction } from '../../types';

interface AddTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransferModal: React.FC<AddTransferModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAppContext();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !fromAccountId || !toAccountId || fromAccountId === toAccountId) {
      alert("Por favor, rellena todos los campos y asegúrate de que las cuentas de origen y destino son diferentes.");
      return;
    }

    const newTransaction: Transaction = {
      id: new Date().toISOString(),
      type: TransactionType.TRANSFER,
      amount: parseFloat(amount),
      date,
      description,
      accountId: fromAccountId,
      toAccountId: toAccountId,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    onClose();
    // Reset form
    setAmount('');
    setDescription('');
    setFromAccountId('');
    setToAccountId('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Transferencia">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount-transfer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
            <input type="number" id="amount-transfer" value={amount} onChange={e => setAmount(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:text-white" step="0.01"/>
          </div>
          <div>
            <label htmlFor="description-transfer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
            <input type="text" id="description-transfer" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Desde la cuenta</label>
            <select id="fromAccount" value={fromAccountId} onChange={e => setFromAccountId(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:text-white">
              <option value="">Selecciona una cuenta</option>
              {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">A la cuenta</label>
            <select id="toAccount" value={toAccountId} onChange={e => setToAccountId(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:text-white">
              <option value="">Selecciona una cuenta</option>
              {state.accounts.filter(acc => acc.id !== fromAccountId).map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="date-transfer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
            <input type="date" id="date-transfer" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 dark:text-white" />
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

export default AddTransferModal;