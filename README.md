# Request - Video Editing Marketplace

A professional marketplace connecting talented video editors with clients seeking high-quality video editing services.

## Features

### Balance System
- Real-time balance tracking
- Multiple withdrawal methods (Bank, PayPal, Cryptocurrency)
- Transaction history
- Automated balance calculations
- Withdrawal validation and security checks

### Quest System
- Diverse range of video editing projects
- Multiple difficulty levels
- Detailed quest requirements and descriptions
- Real-time status updates
- Filtering and sorting capabilities

### Testing
- Comprehensive test suite for critical functionality
- Balance calculation tests
- Withdrawal validation tests
- Transaction handling tests

## Architecture

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Real-time updates using React hooks

### Components
- `Balance.tsx`: Handles balance display and withdrawal functionality
- `App.tsx`: Main application component
- Additional utility components for quests and user interface

### Utilities
- `balanceUtils.ts`: Balance calculation and validation functions
- `types/index.ts`: TypeScript type definitions
- `data/quests.ts`: Quest data and management

## API Documentation

### Balance Endpoints
- GET `/api/balance`: Retrieve user balance
- POST `/api/withdraw`: Process withdrawal request
- GET `/api/transactions`: Get transaction history

### Quest Endpoints
- GET `/api/quests`: Retrieve available quests
- POST `/api/quests/:id/accept`: Accept a quest
- POST `/api/quests/:id/complete`: Complete a quest

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  balance DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Quests Table
```sql
CREATE TABLE quests (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward DECIMAL NOT NULL,
  difficulty TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Known Issues and Solutions

1. Balance Update Delay
   - Issue: Balance updates may have a slight delay after quest completion
   - Solution: Implemented optimistic updates with proper error handling

2. Withdrawal Validation
   - Issue: Edge cases in withdrawal amount validation
   - Solution: Added comprehensive validation checks and error messages

3. Quest Filtering Performance
   - Issue: Slow performance with many active filters
   - Solution: Optimized filtering logic and added pagination

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npm test
   ```