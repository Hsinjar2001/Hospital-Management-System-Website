const { User, Appointment, Invoice, Prescription } = require('../models');
const { Op } = require('sequelize');

const getAllInvoices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      payment_status = '',
      patientId = '',
      doctorId = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (payment_status) whereClause.payment_status = payment_status;
    if (patientId) whereClause.patientId = patientId;
    if (doctorId) whereClause.doctorId = doctorId;

    if (search) {
      whereClause[Op.or] = [
        { invoice_number: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const invoices = await Invoice.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        },
        {
          model: Appointment,
          as: 'appointment',
          attributes: ['id', 'appointment_id', 'appointment_date', 'appointment_time']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['invoice_date', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        invoices: invoices.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(invoices.count / limit),
          totalItems: invoices.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty', 'qualification']
        },
        {
          model: Appointment,
          as: 'appointment',
          attributes: ['id', 'appointment_id', 'appointment_date', 'appointment_time', 'appointment_type']
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        status: 'error',
        message: 'Invoice not found'
      });
    }

    res.json({
      status: 'success',
      data: { invoice }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createInvoice = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointment_id,
      total_amount,
      description,
      due_date,
      tax_amount,
      discount_amount
    } = req.body;

    const patient = await User.findOne({ where: { id: patientId, role: 'patient' } });
    const doctor = await User.findOne({ where: { id: doctorId, role: 'doctor' } });

    if (!patient || !doctor) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid patient or doctor ID'
      });
    }

    if (appointment_id) {
      const appointment = await Appointment.findByPk(appointment_id);
      if (!appointment) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid appointment ID'
        });
      }
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const finalAmount = parseFloat(total_amount) + parseFloat(tax_amount || 0) - parseFloat(discount_amount || 0);

    const invoice = await Invoice.create({
      invoice_number: invoiceNumber,
      patientId,
      doctorId,
      appointment_id,
      total_amount: finalAmount,
      due_amount: finalAmount,
      description,
      due_date,
      tax_amount: tax_amount || 0,
      discount_amount: discount_amount || 0
    });

    const newInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        }
      ]
    });

    res.status(201).json({
      status: 'success',
      data: { invoice: newInvoice }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        status: 'error',
        message: 'Invoice not found'
      });
    }

    await invoice.update(req.body);

    const updatedInvoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        }
      ]
    });

    res.json({
      status: 'success',
      data: { invoice: updatedInvoice }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        status: 'error',
        message: 'Invoice not found'
      });
    }

    await invoice.destroy();

    res.json({
      status: 'success',
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const { payment_method, paid_amount } = req.body;
    const invoice = await Invoice.findByPk(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        status: 'error',
        message: 'Invoice not found'
      });
    }

    const amountToPay = paid_amount || invoice.total_amount;
    const newPaidAmount = parseFloat(invoice.paid_amount) + parseFloat(amountToPay);
    const newDueAmount = parseFloat(invoice.total_amount) - newPaidAmount;

    let paymentStatus = 'partial';
    if (newDueAmount <= 0) {
      paymentStatus = 'paid';
    } else if (newPaidAmount === 0) {
      paymentStatus = 'pending';
    }

    await invoice.update({
      paid_amount: newPaidAmount,
      due_amount: Math.max(0, newDueAmount),
      payment_status: paymentStatus,
      payment_method,
      paid_date: paymentStatus === 'paid' ? new Date().toISOString().split('T')[0] : invoice.paid_date
    });

    const updatedInvoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        }
      ]
    });

    res.json({
      status: 'success',
      data: { invoice: updatedInvoice }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const purchasePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const userId = req.user.id;

    const prescription = await Prescription.findByPk(prescriptionId, {
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    if (prescription.patientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to purchase this prescription'
      });
    }

    if (prescription.status === 'purchased') {
      return res.status(400).json({
        success: false,
        message: 'Prescription already purchased'
      });
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const invoice = await Invoice.create({
      invoice_number: invoiceNumber,
      patientId: userId,
      doctorId: prescription.doctorId,
      total_amount: prescription.cost || 0,
      paid_amount: prescription.cost || 0,
      outstanding_amount: 0,
      payment_status: 'paid',
      payment_method: 'cash',
      invoice_date: new Date(),
      payment_date: new Date(),
      description: `Prescription purchase - ${prescription.prescriptionId}`,
      notes: `Purchased prescription containing medications`
    });

    await prescription.update({
      status: 'purchased',
      purchaseDate: new Date()
    });

    const invoiceWithDetails = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Prescription purchased successfully',
      data: {
        invoice: invoiceWithDetails,
        prescription: prescription
      }
    });
  } catch (error) {
    console.error('Error purchasing prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase prescription'
    });
  }
};

const getPatientInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const invoices = await Invoice.findAndCountAll({
      where: { patientId: userId },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['invoice_date', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        invoices: invoices.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(invoices.count / limit),
          totalItems: invoices.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patient invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
};

const resetPrescriptionStatus = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const userId = req.user.id;

    const prescription = await Prescription.findByPk(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    if (prescription.patientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to reset this prescription'
      });
    }

    await prescription.update({
      status: 'active'
    });

    res.json({
      success: true,
      message: 'Prescription status reset to active',
      data: { prescription }
    });
  } catch (error) {
    console.error('Error resetting prescription status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset prescription status'
    });
  }
};

module.exports = {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markAsPaid,
  purchasePrescription,
  getPatientInvoices,
  resetPrescriptionStatus
};
