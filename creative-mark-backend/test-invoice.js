// Simple test script to verify invoice functionality
import mongoose from 'mongoose';
import Invoice from './models/Invoice.js';
import dotenv from 'dotenv';

dotenv.config();

const testInvoice = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creativemark-bms');
    console.log('Connected to MongoDB');

    // Create a test invoice
    const testInvoiceData = {
      createdBy: new mongoose.Types.ObjectId(), // Mock admin ID
      clientName: "Test Client",
      clientFullName: "Test Client Full Name",
      clientEmail: "test@example.com",
      clientPhone: "+1 234 567 8900",
      clientAddress: "123 Test Street",
      clientCity: "Test City",
      clientCountry: "Test Country",
      clientZipCode: "12345",
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "Pending",
      items: [
        {
          description: "Test Service",
          quantity: 1,
          unitPrice: 1000,
          total: 1000
        }
      ],
      subTotal: 1000,
      taxRate: 15,
      taxAmount: 150,
      discount: 0,
      grandTotal: 1150,
      paymentMethod: "Bank Transfer",
      installments: [
        {
          installmentNumber: 1,
          amount: 1150,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "Pending"
        }
      ],
      paidAmount: 0,
      remainingAmount: 1150,
      notes: "This is a test invoice"
    };

    const invoice = new Invoice(testInvoiceData);
    await invoice.save();
    
    console.log('Test invoice created successfully:', invoice.invoiceNumber);
    
    // Fetch the invoice
    const fetchedInvoice = await Invoice.findById(invoice._id);
    console.log('Invoice fetched successfully:', fetchedInvoice.clientName);
    
    // Clean up
    await Invoice.findByIdAndDelete(invoice._id);
    console.log('Test invoice deleted');
    
    console.log('All tests passed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

testInvoice();
