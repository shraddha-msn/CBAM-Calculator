# CBAM Calculator

A web-based calculator for the EU **Carbon Border Adjustment Mechanism (CBAM)**. It estimates direct, indirect, and total embedded emissions for imported goods (by product type and CN code) and converts the resulting carbon cost into the user's chosen currency.

Built as part of the Verofax PS-1 project.

---

## Tech stack

| Layer    | Stack                                              |
| -------- | -------------------------------------------------- |
| Frontend | React 18, Material UI, React Router, react-to-pdf  |
| Backend  | Node.js, Express, express-validator, axios         |
| Data     | Local JSON of CBAM emission factors (per CN code)  |
| External | `open.er-api.com` for live EUR currency rates      |

---

## Project structure

```
.
├── Backend/
│   ├── index.js              # Express entrypoint (port 3000)
│   └── src/
│       ├── routes/index.js   # /api/currency, /api/products, /api/result
│       └── data/data.json    # Emission factors per product / CN code
├── Frontend/                 # React app (Create React App)
│   ├── public/
│   └── src/
└── README.md
```

---

## Getting started

### Prerequisites
- Node.js 18+ and npm

### 1. Clone & install
```bash
git clone <your-repo-url>
cd "PS 1 - Verofax Project - CBAM Calc"
```

Install dependencies for backend and frontend separately:
```bash
cd Backend && npm install
cd ../Frontend && npm install
```

### 2. Run the backend
```bash
cd Backend
npm run dev          # nodemon, hot reload
# or
npm start            # plain node
```
Backend runs at **http://localhost:3000**.

### 3. Run the frontend
In a second terminal:
```bash
cd Frontend
npm start
```
Frontend runs at **http://localhost:3001** (CRA will offer an alt port since 3000 is taken by the backend).

---

## API endpoints

Base URL: `http://localhost:3000/api`

| Method | Path        | Description                                           |
| ------ | ----------- | ----------------------------------------------------- |
| GET    | `/currency` | List of supported currency codes (live, EUR base)     |
| GET    | `/products` | Full list of CBAM products and their CN sub-codes     |
| POST   | `/result`   | Compute embedded emissions and carbon cost            |

### `POST /api/result` — request body
```json
{
  "product":  "Iron and Steel",
  "code":     "7208",
  "weight":   1000,
  "unit":     "kg",
  "currency": "USD"
}
```

### Response
```json
{
  "diremission":  { "directEm":   "1.85", "unit": "tonne CO2e" },
  "indiremission":{ "indirectEm": "0.32", "unit": "tonne CO2e" },
  "totemission":  { "totEm":      "2.17", "unit": "tonne CO2e" },
  "carbonPrice":  { "price":   "210.45", "currency": "USD" }
}
```

Notes:
- `unit` accepts `kg`, `ton`, or `tonne` (kg is converted internally).
- Carbon price is currently fixed at **€90 / tonne CO2e** (placeholder; ICE live-price fetch is stubbed in code).

---

## Build

```bash
cd Frontend
npm run build       # outputs to Frontend/build
```

