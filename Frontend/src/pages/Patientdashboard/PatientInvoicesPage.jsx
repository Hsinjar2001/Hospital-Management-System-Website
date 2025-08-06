import React, { useState, useEffect } from 'react';
import { invoicesAPI } from '../../services/api';

const PatientInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadInvoices();
  }, [currentPage]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoicesAPI.getPatientInvoices({
        page: currentPage,
        limit: 10
      });

      if (response.success) {
        setInvoices(response.data.invoices);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        console.error('Failed to load invoices:', response.message);
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const calculateStats = () => {
    const totalAmount = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.total_amount || 0), 0);
    const paidAmount = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.paid_amount || 0), 0);
    const outstandingAmount = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.outstanding_amount || 0), 0);
    const paidInvoices = invoices.filter(invoice => invoice.payment_status === 'paid').length;

    return {
      totalAmount: totalAmount.toFixed(2),
      paidAmount: paidAmount.toFixed(2),
      outstandingAmount: outstandingAmount.toFixed(2),
      paidInvoices,
      totalInvoices: invoices.length
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
          <p className="text-sm text-gray-600 mt-1">
            View your billing history and payment records
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">{stats.paidInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">${stats.paidAmount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">${stats.outstandingAmount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No invoices found.</p>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{invoice.invoice_number}</h3>
                  <p className="text-sm text-gray-600">
                    Dr. {invoice.doctor?.firstName} {invoice.doctor?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(invoice.invoice_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(invoice.payment_status)}`}>
                    {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{invoice.description || 'No description provided'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Total Amount</h5>
                  <p className="text-lg font-bold text-gray-900">${invoice.total_amount}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Paid Amount</h5>
                  <p className="text-lg font-bold text-green-600">${invoice.paid_amount}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Outstanding</h5>
                  <p className="text-lg font-bold text-red-600">${invoice.outstanding_amount}</p>
                </div>
              </div>

              {invoice.notes && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-1">Notes</h5>
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {invoice.payment_date && (
                    <span>Paid on: {new Date(invoice.payment_date).toLocaleDateString()}</span>
                  )}
                  {invoice.due_date && !invoice.payment_date && (
                    <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewDetails(invoice)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {showDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedInvoice.invoice_number}</h4>
                      <p className="text-sm text-gray-600">
                        Dr. {selectedInvoice.doctor?.firstName} {selectedInvoice.doctor?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(selectedInvoice.invoice_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedInvoice.payment_status)}`}>
                      {selectedInvoice.payment_status.charAt(0).toUpperCase() + selectedInvoice.payment_status.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-gray-700">{selectedInvoice.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Payment Information</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium">${selectedInvoice.total_amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid Amount:</span>
                        <span className="font-medium text-green-600">${selectedInvoice.paid_amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Outstanding:</span>
                        <span className="font-medium text-red-600">${selectedInvoice.outstanding_amount}</span>
                      </div>
                      {selectedInvoice.payment_method && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium">{selectedInvoice.payment_method}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Dates</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice Date:</span>
                        <span className="font-medium">{new Date(selectedInvoice.invoice_date).toLocaleDateString()}</span>
                      </div>
                      {selectedInvoice.due_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium">{new Date(selectedInvoice.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedInvoice.payment_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Date:</span>
                          <span className="font-medium">{new Date(selectedInvoice.payment_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedInvoice.notes && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedInvoice.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Download PDF
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientInvoicesPage;