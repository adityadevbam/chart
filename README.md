# Node.js Project

This project contains two parts:
- **Frontend**: React-based client application
- **Backend**: Node.js/Express API server

---

## 📁 Project Structure

```
.
├── backend/
│   ├── .env
│   └── ...
└── frontend/
    ├── .env
    └── ...
```

---

## ⚙️ Environment Configuration

### `frontend/.env`
```
REACT_APP_BACKEND_URL=http://localhost:3000
```

### `backend/.env`
```
PORT=3000
```

---

**Install dependencies for both frontend and backend**
   ```bash
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

**Add `.env` files** in both `frontend/` and `backend/` directories using the example provided above

4. **Start both servers**
   - In two separate terminals:
     ```bash
     # Terminal 1 - Backend
     cd backend
     npm run start
     ```

     ```bash
     # Terminal 2 - Frontend
     cd frontend
     npm run start
     ```

---


- **Frontend**: React, JavaScript, MaterialUI
- **Backend**: Node.js, Express
- **Environment**: `.env` files managed per service

