const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    employeeId: {
        type: Number,
        ref: 'Employee',
        required: true
    },
    payments: [{
        amount: {
            type: Number,
        },
        date: {
            type: Date,
        },
        deductionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee.deductions.deductionsDetails',
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        default: this.amount
    }
}, {
    timestamps: true,
    collection: 'debts'
});

module.exports  = mongoose.model('Debt', debtSchema);