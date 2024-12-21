# TrackR
A Screen Time Management App with  Predictive Modelling and Recommendation System for Time Allocation Strategies

## Setup Instructions

### Prerequisites
Make sure you have the following installed:
- Node.js and npm
- MySQL server
- Expo CLI (for React)

### Database Setup
1. Start your MySQL server.
2. Create a new database:
   ```sql
   CREATE DATABASE trackr_db;
   ```
3. Import the required tables:
   - Run the provided `trackr_db.sql` file in your MySQL client or command line:
     ```bash
     mysql -u root -p trackr_db < path/to/trackr_db.sql
     ```
   - This will create all the required tables automatically.

### Backend Setup
1. Navigate to the `trackr-backend` directory:
   ```bash
   cd trackr-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `trackr-backend` folder with the following content:
     ```
     DB_NAME=trackr_db
     DB_USER=root
     DB_PASSWORD=      # Leave this empty if no password
     DB_HOST=localhost
     DB_PORT=3306
     JWT_SECRET=your_secret_key
     ADMIN_JWT_SECRET=your_secret_key
     ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `trackr-frontend` directory:
   ```bash
   cd trackr-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo server:
   ```bash
   npm start
   ```
4. Scan the QR code with your device using the Expo Go app or run it on an emulator.




### License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

