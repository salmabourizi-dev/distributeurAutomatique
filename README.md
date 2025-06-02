# Vending Machine Application

A complete vending machine application with a Node.js backend and React frontend. This project demonstrates a clean architecture with proper separation of concerns.

## Features

- 🪙 Coin insertion with support for various denominations
- 📦 Product catalog with images, prices, and stock management
- 🛒 Product selection and purchase flow
- ❌ Transaction cancellation with proper refund handling
- 💰 Change calculation and dispensing
- 🧪 Comprehensive test coverage

## Architecture

The application follows the MVC (Model-View-Controller) architecture:

- **Models**: Product and Transaction models to represent the core entities
- **Services**: Business logic for product and transaction management
- **Controllers**: Handle HTTP requests and delegate to services
- **Views**: React frontend components

### Backend Structure

```
├── controllers/         # Request handlers
├── models/              # Data models
├── routes/              # API routes
├── services/            # Business logic
├── tests/               # Unit and integration tests
└── server.js            # Entry point
```

### Frontend Structure

```
├── public/
├── src/
│   ├── components/      # UI components
│   ├── services/        # API client services
│   ├── App.js           # Main application component
│   └── index.js         # Entry point
```

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm run install-all
   ```

### Running the Application

Start the development server (both backend and frontend):

```
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Running Tests

```
npm test
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `GET /api/products/:id/availability` - Check product availability

### Transactions

- `POST /api/transactions/start` - Start a new transaction
- `POST /api/transactions/insert-coin` - Insert a coin
- `POST /api/transactions/select-product` - Select a product
- `POST /api/transactions/complete` - Complete a transaction
- `POST /api/transactions/cancel` - Cancel a transaction
- `GET /api/transactions/:id` - Get transaction details

## Implementation Details

### Coin Insertion

The vending machine accepts the following coin denominations:
- 0.05€
- 0.10€
- 0.20€
- 0.50€
- 1.00€
- 2.00€

### Transaction Flow

1. User starts a new transaction
2. User inserts coins to increase balance
3. User selects products (if balance is sufficient)
4. User completes transaction or cancels it
5. If completed, change is calculated and returned
6. If cancelled, all inserted money is returned and selected products are restored to inventory

### Cancellation Scenarios

The application supports two cancellation scenarios:
1. Cancellation with no products selected - returns all inserted money
2. Cancellation with products selected - returns selected products to inventory and refunds all money

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: React, CSS
- **Testing**: Jest
- **API Communication**: Axios
- **Development**: Nodemon, Concurrently

## Production Deployment

To prepare for production deployment:

```
npm run build
```

This will create a production build of the React frontend and configure the Express server to serve the static files.