# Expense Tracker — MERN Stack

A full-stack expense & income tracker: JWT auth, a dashboard with charts,
searchable/filterable/paginated transaction lists, daily/weekly/monthly/yearly
reports, CSV/PDF export, profile management, and dark/light mode.

## Folder structure

```
expense-tracker-mern/
├── client/                          React (Vite) + Tailwind CSS
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                  routes
│       ├── index.css                Tailwind + design tokens + component classes
│       ├── api/
│       │   └── axios.js             axios instance, auth header, 401 handling
│       ├── context/
│       │   ├── AuthContext.jsx      login/register/logout, remember me
│       │   └── ThemeContext.jsx     dark/light mode
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useTheme.js
│       │   └── useDebounce.js
│       ├── utils/
│       │   ├── formatCurrency.js
│       │   ├── categories.js        category/payment-method lists + colors
│       │   └── exportCSV.js         CSV export + browser-print PDF export
│       ├── components/
│       │   ├── AppLayout.jsx, Sidebar.jsx, Topbar.jsx, Navbar.jsx, Footer.jsx
│       │   ├── ProtectedRoute.jsx, Loader.jsx, ScrollTop.jsx
│       │   ├── DashboardCard.jsx, TransactionTable.jsx, Pagination.jsx
│       │   ├── SearchFilterBar.jsx, Modal.jsx, ConfirmDialog.jsx
│       │   ├── ExpenseFormModal.jsx, IncomeFormModal.jsx
│       │   └── IncomeExpenseChart.jsx, CategoryPieChart.jsx, TrendLineChart.jsx
│       └── pages/
│           ├── Landing.jsx, Login.jsx, Register.jsx
│           ├── Dashboard.jsx, Expenses.jsx, Income.jsx, Reports.jsx
│           ├── Profile.jsx, Settings.jsx, NotFound.jsx
│
├── server/                          Node + Express + MongoDB
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config/db.js
│   ├── models/
│   │   ├── User.js                  bcrypt password hashing
│   │   ├── Expense.js               category + payment method enums
│   │   └── Income.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   ├── incomeController.js
│   │   ├── userController.js
│   │   └── reportController.js      dashboard summary + period reports
│   ├── routes/
│   │   ├── authRoutes.js, expenseRoutes.js, incomeRoutes.js
│   │   ├── userRoutes.js, reportRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js        JWT verification (protect)
│   │   └── errorMiddleware.js       404 + centralized error handler
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── asyncHandler.js
│   └── seed/
│       └── seedData.js              sample user + transactions
│
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB — local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Start the API:

```bash
npm run dev
```

### Load sample data (optional but recommended)

```bash
npm run seed
```

This creates a demo account you can log in with immediately:

```
Email:    demo@example.com
Password: demo1234
```

It also inserts ~10 sample expenses and 3 income entries spread across the
last 5 months, so the dashboard and charts have something to show.
Run `npm run seed:destroy` to remove it again.

## 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api/*` to
`http://localhost:5000` (see `vite.config.js`), so no CORS config is needed
locally.

## 3. Production build

```bash
cd client
npm run build      # outputs static files to client/dist
```

Deploy `client/dist` to any static host (Vercel, Netlify) and `server/` to
a Node host (Render, Railway, Fly.io). Set `MONGO_URI`, `JWT_SECRET`, and
`CLIENT_ORIGIN` (your deployed frontend URL) as environment variables on
the server host, and `VITE_API_URL` (your deployed backend URL) on the
frontend host.

## API reference

All `/api/*` routes except `/api/auth/register` and `/api/auth/login`
require `Authorization: Bearer <token>`.

| Method | Route                     | Description                          |
|--------|---------------------------|---------------------------------------|
| POST   | `/api/auth/register`      | Create account, returns token + user  |
| POST   | `/api/auth/login`         | Login (`rememberMe` extends token)    |
| POST   | `/api/auth/logout`        | Logout (client discards token)        |
| GET    | `/api/auth/me`            | Current authenticated user            |
| GET    | `/api/expenses`           | List (search, category, date range, sort, pagination) |
| GET    | `/api/expenses/:id`       | Get one expense                       |
| POST   | `/api/expenses`           | Create expense                        |
| PUT    | `/api/expenses/:id`       | Update expense                        |
| DELETE | `/api/expenses/:id`       | Delete expense                        |
| GET    | `/api/expenses/meta/options` | Category + payment method lists    |
| GET    | `/api/income`             | List (search, date range, sort, pagination) |
| POST   | `/api/income`             | Create income                         |
| PUT    | `/api/income/:id`         | Update income                         |
| DELETE | `/api/income/:id`         | Delete income                         |
| PUT    | `/api/users/profile`      | Update name / email / currency        |
| PUT    | `/api/users/avatar`       | Update avatar (base64 image)          |
| PUT    | `/api/users/password`     | Change password                       |
| DELETE | `/api/users/account`      | Delete account + all data             |
| GET    | `/api/reports/dashboard`  | Totals, monthly savings, recent transactions, category + 6-month series |
| GET    | `/api/reports?period=daily\|weekly\|monthly\|yearly&date=YYYY-MM-DD` | Period report: totals, category breakdown, raw transactions |

All responses follow `{ success, data }` (or `{ success, message }` on
error) with standard HTTP status codes (`400` validation, `401` auth,
`404` not found, `500` server error).

## Design notes

- **Auth**: JWT stored in `localStorage` (Remember Me) or `sessionStorage`
  (session-only); axios attaches it automatically and force-logs-out on a
  `401` response.
- **Passwords**: hashed with bcrypt (`models/User.js`), never returned by
  default queries (`select: false`).
- **Avatar upload**: stored as a base64 data URL directly on the user
  document for simplicity. Swap for S3/Cloudinary in a real deployment to
  keep the database lean.
- **CSV export**: generated client-side, no extra dependency.
- **PDF export**: uses the browser's native print-to-PDF dialog on a
  clean, print-only layout — also dependency-free.
- **Dark mode**: Tailwind `class` strategy, toggled via `ThemeContext`,
  persisted in `localStorage`.
- **Accessibility**: labeled form fields, `aria-invalid`/`aria-describedby`
  on validation errors, keyboard-dismissible modals, focus-visible states.
