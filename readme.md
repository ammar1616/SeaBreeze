# SeaBreeze Management System

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
    - [User Authentication](#user-authentication)
    - [Managing Employee Shifts](#managing-employee-shifts)
    - [Managing Employee Debts](#managing-employee-debts)
    - [Generating Files](#generating-files)
7. [Testing](#testing)
8. [Contributing](#contributing)


## Overview

SeaBreeze is an employee management system designed to streamline the process of managing shifts and debts for employees.


## Features

1. **User Authentication:**
   - Allow users to register accounts and log in securely.
   - Implement JWT token-based authentication for secure access to user-specific features.

2. **Managing Employee Shifts:**
   - Enable managers to create, view, update, and delete employee shifts.
   - Support features like assigning employees to shifts and managing shift schedules.

3. **Managing Employee Debts:**
   - Allow tracking of employee debts, such as loans or advances.
   - Enable managers to record and manage employee debts, including repayment schedules.

4. **Generating Files:**
   - Provide functionality to generate reports or files based on employee data.


## Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB database


## Getting Started

Follow these steps to set up and run the SeaBreeze app locally:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ammar1616/SeaBreeze
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   - Create a `.env` file based on the `.env.example` template.
   - Update the `.env` file with your configuration details.

4. **Start the Server:**
   ```bash
   npm start
   ```

5. **Access the App:**
   - Open your web browser and go to `http://localhost:3000` to access the SeaBreeze app.


## Project Structure

The project follows a modular structure:

- **configurations:** Contains environment-specific configuration files.
- **controllers:** Handle business logic for different routes.
- **middlewares:** Custom middleware functions, including authentication and error handling.
- **models:** Define data schemas and interact with the database.
- **services:** Implement core business logic and interact with controllers and models.
- **validations:** Perform data validation using libraries like Joi.
- **routes:** Define API routes for managing authentication, shifts, debts, and file generation.


## Usage

### User Authentication

- **Description:** Register new users and authenticate existing ones.
- **Endpoints:**
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in an existing user.
- **Authorization:** Not required.
- **Request (`req`) Object:**
  - For registration:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password"
    }
    ```
  - For login:
    ```json
    {
      "email": "john@example.com",
      "password": "password"
    }
    ```
- **Response (`res`) Object:**  
  - **Status Code:** 200 OK
  - **Body (on successful login):**
    ```json
    {
      "token": "your_jwt_token_here"
    }
    ```

### Managing Employee Shifts

- **Description:** Allow managers to manage employee shifts.
- **Endpoints:**
  - `POST /api/shifts`: Create a new shift.
  - `GET /api/shifts`: View all shifts.
  - `GET /api/shifts/:shiftId`: View a specific shift.
  - `PUT /api/shifts/:shiftId`: Update a shift.
  - `DELETE /api/shifts/:shiftId`: Delete a shift.
- **Authorization:** Required (JWT token).
- **Request (`req`) Object:**
  - For creating a shift:
    ```json
    {
      "employeeId": "employee_id_here",
      "startTime": "2024-04-27T09:00:00Z",
      "endTime": "2024-04-27T17:00:00Z",
      "description": "Shift description here"
    }
    ```
  - For updating a shift:
    ```json
    {
      "startTime": "2024-04-27T09:00:00Z",
      "endTime": "2024-04-27T18:00:00Z",
      "description": "Updated shift description"
    }
    ```
- **Response (`res`) Object:**  
  - **Status Code:** 200 OK
  - **Body (on successful operation):**
    ```json
    {
      "message": "Shift created/updated/deleted successfully!"
    }
    ```

### Managing Employee Debts

- **Description:** Allow managers to manage employee debts.
- **Endpoints:**
  - `POST /api/debts`: Create a new debt record.
  - `GET /api/debts`: View all debt records.
  - `GET /api/debts/:debtId`: View a specific debt record.
  - `PUT /api/debts/:debtId`: Update a debt record.
  - `DELETE /api/debts/:debtId`: Delete a debt record.
- **Authorization:** Required (JWT token).
- **Request (`req`) Object:**
  - For creating a debt record:
    ```json
    {
      "employeeId": "employee_id_here",
      "amount": 1000,
      "description": "Debt description here"
    }
    ```
  - For updating a debt record:
    ```json
    {
      "amount": 1500,
      "description": "Updated debt description"
    }
    ```
- **Response (`res`) Object:**  
  - **Status Code:** 200 OK
  - **Body (on successful operation):**
    ```json
    {
      "message": "Debt record created/updated/deleted successfully!"
    }
    ```

### Generating Files

- **Description:** Provide functionality to generate reports or files based on employee data.
- **Endpoints:**
  - `GET /api/generate/file`: Generate a file based on employee data.
- **Authorization:** Required (JWT token).
- **Response (`res`) Object:**  
  - **Status Code:** 200 OK
  - **Body (on successful operation):** The generated file.


## Testing

To run tests, execute the following command:

```bash
npm test
```

The testing suite includes unit tests for individual components and integration tests for API endpoints, ensuring reliability and functionality.


## Contributing

We welcome contributions from the community! Follow these guidelines to contribute to the SeaBreeze project:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit.
4. Submit a pull request.

Thank you for contributing to make SeaBreeze better!