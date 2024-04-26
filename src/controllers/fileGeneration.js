const printService = require('../services/fileGeneration');
const financialService = require('../services/financial');

exports.generateFile = async (req, res) => {
    try {
        const flag = req.query.all;
        const workAddress = req.query.workAddress;
        const paymentMethod = req.query.paymentMethod;
        let unpayedEmployeesInformation;
        if (flag === 'true') {
            unpayedEmployeesInformation = await financialService.allUnpayedEmployees(workAddress, paymentMethod);
        } else {
            unpayedEmployeesInformation = await financialService.unpayedEmployees(workAddress, paymentMethod);
        }
        if (unpayedEmployeesInformation.error) {
            return res.status(404).json({ error: unpayedEmployeesInformation.error });
        }
        const filePath = await printService.xlxsGeneration(paymentMethod, unpayedEmployeesInformation);
        res.download(filePath);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
