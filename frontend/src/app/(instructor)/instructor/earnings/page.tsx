// "use client";

// import React, { useState } from 'react';
// import { DollarSign, TrendingUp, Download, FileText, CreditCard, AlertCircle, CheckCircle, Clock, Filter, Search } from 'lucide-react';

// const EarningsDashboard = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [dateFilter, setDateFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Mock data - replace with actual API calls
//   const stats = {
//     totalEarnings: 12450.00,
//     pendingPayouts: 2340.00,
//     completedPayouts: 10110.00,
//     thisMonth: 3280.00
//   };

//   const earnings = [
//     { id: '1', courseName: 'React Masterclass', amount: 1200.00, currency: 'USD', status: 'completed', paymentId: 'PAY-123', date: '2025-10-01', students: 24 },
//     { id: '2', courseName: 'Advanced TypeScript', amount: 850.00, currency: 'USD', status: 'pending', paymentId: null, date: '2025-10-10', students: 17 },
//     { id: '3', courseName: 'Node.js Backend Development', amount: 290.00, currency: 'USD', status: 'processing', paymentId: 'PAY-124', date: '2025-10-12', students: 6 },
//     { id: '4', courseName: 'React Masterclass', amount: 450.00, currency: 'USD', status: 'completed', paymentId: 'PAY-125', date: '2025-09-28', students: 9 },
//   ];

//   const payoutRequests = [
//     { id: '1', amount: 5000.00, status: 'completed', requestDate: '2025-09-15', completedDate: '2025-09-20', method: 'Bank Transfer' },
//     { id: '2', amount: 3500.00, status: 'processing', requestDate: '2025-10-01', completedDate: null, method: 'PayPal' },
//     { id: '3', amount: 1610.00, status: 'pending', requestDate: '2025-10-10', completedDate: null, method: 'Bank Transfer' },
//   ];

//   const taxDocuments = [
//     { id: '1', type: '1099-MISC', year: 2024, amount: 45230.00, status: 'available', date: '2025-01-31' },
//     { id: '2', type: 'Earning Summary', year: 2024, amount: 45230.00, status: 'available', date: '2025-01-15' },
//     { id: '3', type: 'Tax Report Q3', year: 2024, amount: 12100.00, status: 'available', date: '2024-10-05' },
//   ];

//   const getStatusColor = (status: unknown) => {
//     switch(status) {
//       case 'completed': return 'text-green-600 bg-green-50';
//       case 'pending': return 'text-yellow-600 bg-yellow-50';
//       case 'processing': return 'text-blue-600 bg-blue-50';
//       case 'failed': return 'text-red-600 bg-red-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   const getStatusIcon = (status: unknown) => {
//     switch(status) {
//       case 'completed': return <CheckCircle className="w-4 h-4" />;
//       case 'pending': return <Clock className="w-4 h-4" />;
//       case 'processing': return <AlertCircle className="w-4 h-4" />;
//       default: return <AlertCircle className="w-4 h-4" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings & Payouts</h1>
//           <p className="text-gray-600">Manage your income, track payments, and access financial documents</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-gray-600 text-sm">Total Earnings</span>
//               <DollarSign className="w-5 h-5 text-blue-600" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
//             <p className="text-xs text-gray-500 mt-1">All time</p>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-gray-600 text-sm">This Month</span>
//               <TrendingUp className="w-5 h-5 text-green-600" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">${stats.thisMonth.toLocaleString()}</p>
//             <p className="text-xs text-green-600 mt-1">+12% from last month</p>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-gray-600 text-sm">Pending Payouts</span>
//               <Clock className="w-5 h-5 text-yellow-600" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">${stats.pendingPayouts.toLocaleString()}</p>
//             <p className="text-xs text-gray-500 mt-1">Available for withdrawal</p>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-gray-600 text-sm">Completed Payouts</span>
//               <CheckCircle className="w-5 h-5 text-green-600" />
//             </div>
//             <p className="text-2xl font-bold text-gray-900">${stats.completedPayouts.toLocaleString()}</p>
//             <p className="text-xs text-gray-500 mt-1">This year</p>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               {['overview', 'earnings', 'payouts', 'tax-documents', 'statements'].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-6 py-3 text-sm font-medium capitalize ${
//                     activeTab === tab
//                       ? 'border-b-2 border-blue-600 text-blue-600'
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   {tab.replace('-', ' ')}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'overview' && (
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Recent Earnings</h3>
//                   <div className="space-y-3">
//                     {earnings.slice(0, 3).map((earning) => (
//                       <div key={earning.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                         <div>
//                           <p className="font-medium text-gray-900">{earning.courseName}</p>
//                           <p className="text-sm text-gray-600">{earning.students} students • {earning.date}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-semibold text-gray-900">${earning.amount.toFixed(2)}</p>
//                           <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(earning.status)}`}>
//                             {getStatusIcon(earning.status)}
//                             <span className="capitalize">{earning.status}</span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <button className="flex items-center gap-3 p-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
//                       <CreditCard className="w-5 h-5" />
//                       <span className="font-medium">Request Payout</span>
//                     </button>
//                     <button className="flex items-center gap-3 p-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
//                       <Download className="w-5 h-5" />
//                       <span className="font-medium">Download Statement</span>
//                     </button>
//                     <button className="flex items-center gap-3 p-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
//                       <FileText className="w-5 h-5" />
//                       <span className="font-medium">View Tax Docs</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'earnings' && (
//               <div>
//                 <div className="flex flex-col md:flex-row gap-4 mb-6">
//                   <div className="flex-1 relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     <input
//                       type="text"
//                       placeholder="Search by course name..."
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <select
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                     className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Time</option>
//                     <option value="today">Today</option>
//                     <option value="week">This Week</option>
//                     <option value="month">This Month</option>
//                     <option value="year">This Year</option>
//                   </select>
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="completed">Completed</option>
//                     <option value="pending">Pending</option>
//                     <option value="processing">Processing</option>
//                   </select>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Course</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Students</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Amount</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Payment ID</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {earnings.map((earning) => (
//                         <tr key={earning.id} className="hover:bg-gray-50">
//                           <td className="px-4 py-4">
//                             <p className="font-medium text-gray-900">{earning.courseName}</p>
//                           </td>
//                           <td className="px-4 py-4 text-sm text-gray-600">{earning.date}</td>
//                           <td className="px-4 py-4 text-sm text-gray-600">{earning.students}</td>
//                           <td className="px-4 py-4 font-semibold text-gray-900">${earning.amount.toFixed(2)}</td>
//                           <td className="px-4 py-4">
//                             <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(earning.status)}`}>
//                               {getStatusIcon(earning.status)}
//                               <span className="capitalize">{earning.status}</span>
//                             </div>
//                           </td>
//                           <td className="px-4 py-4 text-sm text-gray-600">{earning.paymentId || 'N/A'}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'payouts' && (
//               <div>
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
//                     <div>
//                       <p className="font-medium text-blue-900">Available Balance: ${stats.pendingPayouts.toLocaleString()}</p>
//                       <p className="text-sm text-blue-700 mt-1">Minimum payout amount is $50. Payouts are processed within 3-5 business days.</p>
//                     </div>
//                   </div>
//                 </div>

//                 <button className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
//                   Request New Payout
//                 </button>

//                 <h3 className="text-lg font-semibold mb-4">Payout History</h3>
//                 <div className="space-y-4">
//                   {payoutRequests.map((payout) => (
//                     <div key={payout.id} className="border border-gray-200 rounded-lg p-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <div>
//                           <p className="font-semibold text-gray-900 text-lg">${payout.amount.toFixed(2)}</p>
//                           <p className="text-sm text-gray-600">{payout.method}</p>
//                         </div>
//                         <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(payout.status)}`}>
//                           {getStatusIcon(payout.status)}
//                           <span className="capitalize font-medium">{payout.status}</span>
//                         </div>
//                       </div>
//                       <div className="flex gap-6 text-sm text-gray-600">
//                         <div>
//                           <span className="font-medium">Requested:</span> {payout.requestDate}
//                         </div>
//                         {payout.completedDate && (
//                           <div>
//                             <span className="font-medium">Completed:</span> {payout.completedDate}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === 'tax-documents' && (
//               <div>
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
//                     <div>
//                       <p className="font-medium text-yellow-900">Tax Information</p>
//                       <p className="text-sm text-yellow-700 mt-1">Please consult with a tax professional for guidance on reporting your earnings. These documents are provided for your convenience.</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   {taxDocuments.map((doc) => (
//                     <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                           <div className="bg-blue-100 p-3 rounded-lg">
//                             <FileText className="w-6 h-6 text-blue-600" />
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-900">{doc.type} - {doc.year}</p>
//                             <p className="text-sm text-gray-600">Total: ${doc.amount.toLocaleString()} • Generated: {doc.date}</p>
//                           </div>
//                         </div>
//                         <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
//                           <Download className="w-4 h-4" />
//                           Download
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === 'statements' && (
//               <div>
//                 <div className="flex gap-4 mb-6">
//                   <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
//                     <option>Select Year</option>
//                     <option>2025</option>
//                     <option>2024</option>
//                     <option>2023</option>
//                   </select>
//                   <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
//                     <option>All Months</option>
//                     <option>January</option>
//                     <option>February</option>
//                     <option>March</option>
//                   </select>
//                   <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
//                     <Download className="w-4 h-4" />
//                     Export Statement
//                   </button>
//                 </div>

//                 <div className="bg-white border border-gray-200 rounded-lg p-6">
//                   <h3 className="text-xl font-bold mb-6">Financial Summary - October 2025</h3>
                  
//                   <div className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold text-gray-900 mb-3">Income Breakdown</h4>
//                       <div className="space-y-2">
//                         <div className="flex justify-between py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Course Sales</span>
//                           <span className="font-medium">$3,100.00</span>
//                         </div>
//                         <div className="flex justify-between py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Session Bookings</span>
//                           <span className="font-medium">$180.00</span>
//                         </div>
//                         <div className="flex justify-between py-2 font-semibold text-lg">
//                           <span>Total Income</span>
//                           <span className="text-blue-600">$3,280.00</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-gray-900 mb-3">Platform Fees</h4>
//                       <div className="space-y-2">
//                         <div className="flex justify-between py-2 border-b border-gray-100">
//                           <span className="text-gray-600">Transaction Fees (15%)</span>
//                           <span className="font-medium">-$492.00</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-green-50 p-4 rounded-lg">
//                       <div className="flex justify-between items-center">
//                         <span className="text-lg font-semibold text-gray-900">Net Earnings</span>
//                         <span className="text-2xl font-bold text-green-600">$2,788.00</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EarningsDashboard;

"use client";

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Download, FileText, CreditCard, AlertCircle, CheckCircle, Clock, Filter, Search } from 'lucide-react';

const EarningsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual API calls
  const stats = {
    totalEarnings: 12450.00,
    pendingPayouts: 2340.00,
    completedPayouts: 10110.00,
    thisMonth: 3280.00
  };

  const earnings = [
    { id: '1', courseName: 'React Masterclass', amount: 1200.00, currency: 'USD', status: 'completed', paymentId: 'PAY-123', date: '2025-10-01', students: 24 },
    { id: '2', courseName: 'Advanced TypeScript', amount: 850.00, currency: 'USD', status: 'pending', paymentId: null, date: '2025-10-10', students: 17 },
    { id: '3', courseName: 'Node.js Backend Development', amount: 290.00, currency: 'USD', status: 'processing', paymentId: 'PAY-124', date: '2025-10-12', students: 6 },
    { id: '4', courseName: 'React Masterclass', amount: 450.00, currency: 'USD', status: 'completed', paymentId: 'PAY-125', date: '2025-09-28', students: 9 },
  ];

  const payoutRequests = [
    { id: '1', amount: 5000.00, status: 'completed', requestDate: '2025-09-15', completedDate: '2025-09-20', method: 'Bank Transfer' },
    { id: '2', amount: 3500.00, status: 'processing', requestDate: '2025-10-01', completedDate: null, method: 'PayPal' },
    { id: '3', amount: 1610.00, status: 'pending', requestDate: '2025-10-10', completedDate: null, method: 'Bank Transfer' },
  ];

  const taxDocuments = [
    { id: '1', type: '1099-MISC', year: 2024, amount: 45230.00, status: 'available', date: '2025-01-31' },
    { id: '2', type: 'Earning Summary', year: 2024, amount: 45230.00, status: 'available', date: '2025-01-15' },
    { id: '3', type: 'Tax Report Q3', year: 2024, amount: 12100.00, status: 'available', date: '2024-10-05' },
  ];

  const getStatusColor = (status: unknown) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'processing': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
      case 'failed': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  const getStatusIcon = (status: unknown) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 px-6 pt-24 pb-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Earnings & Payouts</h1>
          <p className="text-gray-600 dark:text-zinc-400">Manage your income, track payments, and access financial documents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-zinc-400 text-sm">Total Earnings</span>
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">All time</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-zinc-400 text-sm">This Month</span>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.thisMonth.toLocaleString()}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% from last month</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-zinc-400 text-sm">Pending Payouts</span>
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.pendingPayouts.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">Available for withdrawal</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-zinc-400 text-sm">Completed Payouts</span>
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.completedPayouts.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">This year</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 dark:border-zinc-700">
            <nav className="flex -mb-px">
              {['overview', 'earnings', 'payouts', 'tax-documents', 'statements'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Earnings</h3>
                  <div className="space-y-3">
                    {earnings.slice(0, 3).map((earning) => (
                      <div key={earning.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{earning.courseName}</p>
                          <p className="text-sm text-gray-600 dark:text-zinc-400">{earning.students} students • {earning.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">${earning.amount.toFixed(2)}</p>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(earning.status)}`}>
                            {getStatusIcon(earning.status)}
                            <span className="capitalize">{earning.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center gap-3 p-4 border-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                      <CreditCard className="w-5 h-5" />
                      <span className="font-medium">Request Payout</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                      <Download className="w-5 h-5" />
                      <span className="font-medium">Download Statement</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">View Tax Docs</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by course name..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400"
                    />
                  </div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 dark:border-zinc-700 rounded-md">
                    <thead className="bg-gray-50 dark:bg-zinc-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-zinc-300 uppercase">Course</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-zinc-300 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-zinc-300 uppercase">Students</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-zinc-300 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-zinc-300 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-zinc-300 uppercase">Payment ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-600 ">
                      {earnings.map((earning) => (
                        <tr key={earning.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 ">
                          <td className="px-4 py-4">
                            <p className="font-medium text-gray-900 dark:text-white">{earning.courseName}</p>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-zinc-400">{earning.date}</td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-zinc-400">{earning.students}</td>
                          <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">${earning.amount.toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(earning.status)}`}>
                              {getStatusIcon(earning.status)}
                              <span className="capitalize">{earning.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-zinc-400">{earning.paymentId || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payouts' && (
              <div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-300">Available Balance: ${stats.pendingPayouts.toLocaleString()}</p>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">Minimum payout amount is $50. Payouts are processed within 3-5 business days.</p>
                    </div>
                  </div>
                </div>

                <button className="mb-6 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition">
                  Request New Payout
                </button>

                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payout History</h3>
                <div className="space-y-4">
                  {payoutRequests.map((payout) => (
                    <div key={payout.id} className="border border-gray-200 dark:border-none dark:bg-zinc-900 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">${payout.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 dark:text-zinc-400">{payout.method}</p>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(payout.status)}`}>
                          {getStatusIcon(payout.status)}
                          <span className="capitalize font-medium">{payout.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-6 text-sm text-gray-600 dark:text-zinc-400">
                        <div>
                          <span className="font-medium">Requested:</span> {payout.requestDate}
                        </div>
                        {payout.completedDate && (
                          <div>
                            <span className="font-medium">Completed:</span> {payout.completedDate}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tax-documents' && (
              <div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-300">Tax Information</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">Please consult with a tax professional for guidance on reporting your earnings. These documents are provided for your convenience.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {taxDocuments.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 dark:border-none dark:bg-zinc-900 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-500 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{doc.type} - {doc.year}</p>
                            <p className="text-sm text-gray-600 dark:text-zinc-400">Total: ${doc.amount.toLocaleString()} • Generated: {doc.date}</p>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'statements' && (
              <div>
                <div className="flex gap-4 mb-6">
                  <select className="px-4 py-2 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                    <option>Select Year</option>
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                    <option>All Months</option>
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                  </select>
                  <button className="ml-auto px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Statement
                  </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-none rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Financial Summary - October 2025</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Income Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-700">
                          <span className="text-gray-600 dark:text-zinc-400">Course Sales</span>
                          <span className="font-medium text-gray-900 dark:text-white">$3,100.00</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-700">
                          <span className="text-gray-600 dark:text-zinc-400">Session Bookings</span>
                          <span className="font-medium text-gray-900 dark:text-white">$180.00</span>
                        </div>
                        <div className="flex justify-between py-2 font-semibold text-lg">
                          <span className="text-gray-900 dark:text-white">Total Income</span>
                          <span className="text-blue-600 dark:text-blue-400">$3,280.00</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Platform Fees</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-zinc-700">
                          <span className="text-gray-600 dark:text-zinc-400">Transaction Fees (15%)</span>
                          <span className="font-medium text-gray-900 dark:text-white">-$492.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Net Earnings</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">$2,788.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;