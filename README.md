# 💸 Split App Backend

This is a backend system built for managing group expenses — inspired by apps like Splitwise — where users can add expenses, track balances, and settle who owes whom.

---

## 🚀 Features

✅ Add, view, update, delete expenses  
✅ Automatic balance and settlement calculations  
✅ Handles equal splits among participants  
✅ Error handling and input validation  
✅ RESTful API with MongoDB (via Mongoose)  
✅ Postman collection for testing

---

## 🧰 Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas 
- **Deployment**: Render
- **API Testing**: Postman
---

## 🔗 Live API URL 
  https://splitwise-19el.onrender.com


## 📘 API Endpoints

### 📂 Expense Management

| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| GET    | `/expenses`        | List all expenses         |
| POST   | `/expenses`        | Add a new expense         |
| PUT    | `/expenses/:id`    | Update an expense         |
| DELETE | `/expenses/:id`    | Delete an expense         |

### 🔄 Settlement & Balances

| Method | Endpoint           | Description                              |
|--------|--------------------|------------------------------------------|
| GET    | `/people`          | List all people involved in expenses     |
| GET    | `/balances`        | Get current balance for each person      |
| GET    | `/settlements`     | Get simplified settlement summary        |

---

## 📦 Sample Payload

### ➕ Add Expense (`POST /expenses`)
```json
{
  "amount": 600,
  "description": "Dinner",
  "paid_by": "Shantanu",
  "participants": ["Shantanu", "Sanket", "Om"]
}

## 📐 Settlement Calculation Logic

The backend automatically calculates balances and suggests the simplest way for group members to settle up.

1. *Equal Splits Only*  
   Each expense is divided equally among all listed participants.

2. *Balance Calculation*  
   For each person:
        Net Balance = Total Amount Paid - Fair Share

        
- A *positive balance* means the person is *owed money*.
- A *negative balance* means the person *owes money*.

3. *Example Calculation*  
Suppose these expenses were added:
- Dinner (₹600, paid by Shantanu, split among 3)
- Groceries (₹450, paid by Sanket, split among 3)
- Petrol (₹350, paid by Om, split among 3)

Balances might look like this:
```json
{
  "Shantanu": 200,
  "Sanket": 50,
  "Om": -250
}

4.Optimized Settlement Summary
The app then minimizes the number of transactions. From the above:
[
  { "from": "Om", "to": "Shantanu", "amount": 200 },
  { "from": "Om", "to": "Sanket", "amount": 50 }
]

So Om pays ₹200 to Shantanu and ₹50 to Sanket to settle all debts.


⚠ Known Limitations & Assumptions :

❗ Only equal splits are supported
No support yet for custom percentages or exact amount splits.

❗ Single shared group
The system assumes one common group. No multi-group or event-wise tracking.

❗ No authentication
Anyone can use the API — there's no user login or security layer.

❗ Paid-by not cross-validated
The paid_by field is accepted as-is. There's no check if the name matches a known participant.

⚠ Floating point rounding issues
Small precision errors (like 0.01) may occur in settlements; these are rounded to two decimals using toFixed(2).

❗ No currency or timezone support
All expenses are assumed in one currency. Timezone/locale are not handled.