const { Invoice, Patient, Doctor, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getAllInvoices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      paymentStatus = '',
      patientId = '',
      doctorId = '',
      date = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      // Patients can only see their own invoices
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (!patient) {
        return res.status(404).json({
          success: false,
          error: 'Patient profile not found'
        });
      }
      whereClause.patientId = patient.id;
    } else if (req.user.role === 'doctor') {
      // Doctors can only see their own invoices
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor profile not found'
        });
      }
      whereClause.doctorId = doctor.id;
    }
    // Admin can see all invoices (no additional filtering)

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { invoiceId: { [Op.iLike]: `%${search}%` } },
        { notes: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (paymentStatus) {
      whereClause.paymentStatus = paymentStatus;
    }

    if (patientId && req.user.role === 'admin') {
      whereClause.patientId = patientId;
    }

    if (doctorId && (req.user.role === 'admin' || req.user.role === 'doctor')) {
      whereClause.doctorId = doctorId;
    }

    if (date) {
      whereClause.invoiceDate = date;
    }

    // Simplified query without complex associations to avoid errors
    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['invoiceDate', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all invoices error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching invoices'
    });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password'] }
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password'] }
            }
          ]
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: { invoice }
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching invoice'
    });
  }
};

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private (Admin)
const createInvoice = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      prescriptionId,
      invoiceDate,
      dueDate,
      items,
      subtotal,
      taxAmount,
      taxRate,
      discountAmount,
      discountPercentage,
      insuranceAmount,
      insuranceCoverage,
      totalAmount,
      notes,
      terms,
      billingAddress,
      shippingAddress,
      isUrgent,
      isRecurring,
      recurringFrequency
    } = req.body;

    // Generate invoice ID
    const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate amounts if not provided
    const calculatedSubtotal = subtotal || 0;
    const calculatedTaxAmount = taxAmount || (calculatedSubtotal * (taxRate || 0) / 100);
    const calculatedDiscountAmount = discountAmount || (calculatedSubtotal * (discountPercentage || 0) / 100);
    const calculatedInsuranceAmount = insuranceAmount || (calculatedSubtotal * (insuranceCoverage || 0) / 100);
    const calculatedTotalAmount = totalAmount || (calculatedSubtotal + calculatedTaxAmount - calculatedDiscountAmount - calculatedInsuranceAmount);

    // Create invoice
    const invoice = await Invoice.create({
      invoiceId,
      patientId,
      doctorId,
      appointmentId,
      prescriptionId,
      invoiceDate,
      dueDate,
      items,
      subtotal: calculatedSubtotal,
      taxAmount: calculatedTaxAmount,
      taxRate,
      discountAmount: calculatedDiscountAmount,
      discountPercentage,
      insuranceAmount: calculatedInsuranceAmount,
      insuranceCoverage,
      totalAmount: calculatedTotalAmount,
      balanceAmount: calculatedTotalAmount,
      notes,
      terms,
      billingAddress,
      shippingAddress,
      isUrgent,
      isRecurring,
      recurringFrequency
    });

    // Fetch created invoice with associations
    const createdInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: { invoice: createdInvoice }
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating invoice'
    });
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private (Admin)
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    // Update invoice
    await invoice.update(updateData);

    // Fetch updated invoice with associations
    const updatedInvoice = await Invoice.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: { invoice: updatedInvoice }
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating invoice'
    });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private (Admin)
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }

    await invoice.destroy();

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting invoice'
    });
  }
};

// @desc    Get invoice statistics
// @route   GET /api/invoices/stats
// @access  Private (Admin)
const getInvoiceStats = async (req, res) => {
  try {
    const totalInvoices = await Invoice.count();
    const paidInvoices = await Invoice.count({ where: { paymentStatus: 'paid' } });
    const pendingInvoices = await Invoice.count({ where: { paymentStatus: 'pending' } });
    const overdueInvoices = await Invoice.count({ where: { paymentStatus: 'overdue' } });

    // Calculate total revenue
    const totalRevenue = await Invoice.sum('totalAmount', {
      where: { paymentStatus: 'paid' }
    });

    // Calculate pending amount
    const pendingAmount = await Invoice.sum('totalAmount', {
      where: { paymentStatus: 'pending' }
    });

    // Get invoices by status
    const invoicesByStatus = await Invoice.findAll({
      attributes: ['status'],
      group: ['status'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        totalRevenue: totalRevenue || 0,
        pendingAmount: pendingAmount || 0,
        invoicesByStatus
      }
    });
  } catch (error) {
    console.error('Get invoice stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching invoice statistics'
    });
  }
};

module.exports = {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceStats
};
