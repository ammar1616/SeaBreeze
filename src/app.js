const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
require('dotenv').config();

const { connection } = require('./configurations/database');

const isAuthenticated = require('./middlewares/isAuthenticated');

const userService = require('./services/user');

const authenticationRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user');
const employeeRoutes = require('./routes/employee');
const financialRoutes = require('./routes/financial');
const shiftRoutes = require('./routes/shift');
const debtRoutes = require('./routes/debt');
const fileGenerationRoutes = require('./routes/fileGeneration');
const { notSecretary, isAdmin } = require('./middlewares/checkUser');

const error = require('./controllers/error');

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome To Sea Breeze' });
});

app.use('/auth', authenticationRoutes);
app.use('/users', isAuthenticated, isAdmin, userRoutes);
app.use('/employees', isAuthenticated, employeeRoutes);
app.use('/financials', isAuthenticated, notSecretary, financialRoutes);
app.use('/shifts', isAuthenticated, shiftRoutes);
app.use('/debts', isAuthenticated, notSecretary, debtRoutes);
app.use('/files', fileGenerationRoutes);
app.use(error.notFound);

connection().then(() => {
    app.listen(process.env.PORT, async () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        await userService.createSuperAdmin();
    });
}).catch((error) => {
    console.log(error);
    process.exit();
});
