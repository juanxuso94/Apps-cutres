import React from 'react';
import AccountSummaryWidget from './widgets/AccountSummaryWidget';
import QuickActionsWidget from './widgets/QuickActionsWidget';

const Dashboard: React.FC = () => {
    return (
        <div className="p-4 md:p-6 space-y-6 dark:bg-gray-900">
             <AccountSummaryWidget />
             <QuickActionsWidget />
        </div>
    );
};

export default Dashboard;