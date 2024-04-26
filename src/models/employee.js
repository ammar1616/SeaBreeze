const mongoose = require('mongoose');

const financialTransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        set: value => Math.round(value * 100) / 100
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
    }
});

const employeeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    ssn: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    workAddress: {
        type: String,
        required: true
    },
    baseSalary: {
        type: Number,
        required: true,
        set: value => Math.round(value * 100) / 100
    },
    dailySalary: {
        type: Number,
        required: true,
        set: value => Math.round(value * 100) / 100
    },
    shift: {
        inShift: {
            type: Boolean,
            required: true,
            default: false
        },
        currentShift: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shift',
            default: null
        }
    },
    daysWorked: {
        type: Number,
        required: true,
        default: 0
    },
    loans: {
        totalLoans: {
            type: Number,
            required: true,
            default: 0,
            set: value => Math.round(value * 100) / 100
        },
        loansDetails: [financialTransactionSchema]
    },
    bonuses: {
        days: {
            type: Number,
            required: true,
            default: 0
        },
        totalBonuses: {
            type: Number,
            required: true,
            default: 0,
            set: value => Math.round(value * 100) / 100
        },
        bonusesDetails: [financialTransactionSchema]
    },
    deductions: {
        days: {
            type: Number,
            required: true,
            default: 0
        },
        totalDeductions: {
            type: Number,
            required: true,
            default: 0,
            set: value => Math.round(value * 100) / 100
        },
        deductionsDetails: [financialTransactionSchema]
    },
    compensations: {
        totalCompensations: {
            type: Number,
            required: true,
            default: 0,
            set: value => Math.round(value * 100) / 100
        },
        compensationsDetails: [financialTransactionSchema]
    },
    payments: [{
        date: {
            type: Date,
        },
        payedAmount: {
            type: Number,
            set: value => Math.round(value * 100) / 100
        },
        paymentMethod: {
            type: String,
        },
        delayedAmount: {
            type: Number,
            set: value => Math.round(value * 100) / 100
        },
        daysWorked: {
            type: Number,
        },
        bonusDays: {
            type: Number,
        },
        deductionDays: {
            type: Number,
        },
        totalBonuses: {
            type: Number,
        },
        totalDeductions: {
            type: Number,
        },
        totalCompensations: {
            type: Number,
        },
        totalLoans: {
            type: Number,
        }
    }],
    totalSalary: {
        type: Number,
        required: true,
        set: value => Math.round(value * 100) / 100
    },
    delayedSalary: {
        type: Number,
        required: true,
        default: 0,
        set: value => Math.round(value * 100) / 100
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'cash'
    },
    paymentMethodDetails: {
        bank: {
            accountNumber: {
                type: String,
                default: null
            },
            bankName: {
                type: String,
                default: null
            }
        },
        wallet: {
            phoneNumber: {
                type: String,
                default: null
            },
            walletName: {
                type: String,
                default: null
            }
        },
        postal: {
            ssn: {
                type: String,
                default: null
            },
            name: {
                type: String,
                default: null
            }
        },
        payroll: {
            accountNumber: {
                type: String,
                default: null
            }
        }
    }
}, {
    timestamps: true,
    collection: 'employees'
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
