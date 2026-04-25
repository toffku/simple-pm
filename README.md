# simple.pm

A lightweight project management system with a TypeScript React frontend and a Node.js backend.

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend:** Node.js, Prisma ORM  
**Database:** PostgreSQL

## Prerequisites

- Node.js **v20+**
- npm
- Git
- A running PostgreSQL instance

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/toffku/simple-pm.git
cd simple-pm
```

### 2. Install dependencies

**Frontend:**
```bash
cd client/simple-pm
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Configure environment variables

Copy the example env file in the server directory and fill in your database credentials:

```bash
cp server/.env.example server/.env
```

```env
DATABASE_URL=
```

### 4. Run database migrations

```bash
cd server
npx prisma migrate dev
```

### 5. Start the development servers

**Frontend:**
```bash
cd client/simple-pm
npm run dev
```

**Backend:**
```bash
cd server
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000` by default.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)