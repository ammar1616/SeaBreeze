const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    employeeId: {
        type: Number,
        required: true,
        ref: 'Employee'
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        default: null
    },
    duration: {
        type: Number,
        default: null
    },
    bonus: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee.bonuses.bonusesDetails',
            default: null
        },
        days: {
            type: Number,
            default: null
        },
        amount: {
            type: Number,
            default: null,
            set: value => Math.round(value * 100) / 100
        }
    },
    deduction: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee.deductions.deductionsDetails',
            default: null
        },
        days: {
            type: Number,
            default: null
        },
        amount: {
            type: Number,
            default: null,
            set: value => Math.round(value * 100) / 100
        }
    },
    salary: {
        type: Number,
        default: null,
        set: value => Math.round(value * 100) / 100
    },
    totalSalary: {
        type: Number,
        default: null,
        set: value => Math.round(value * 100) / 100
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    payed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'shifts'
});

module.exports = mongoose.model('Shift', shiftSchema);