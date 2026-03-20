# Subscription Manager & Alert System — Backend

A production-grade REST API built with Node.js, Express, and MongoDB for managing subscriptions and sending automated renewal reminders via email.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken + bcryptjs) |
| Email Alerts | Nodemailer (Gmail SMTP) |
| Scheduled Jobs | node-cron |
| Validation | express-validator |
| Rate Limiting | express-rate-limit |
| Environment | dotenv |
| CORS | cors |

---

## Folder Structure

```
server/
├── config/
│   └── mongo.js                   # MongoDB connection
├── models/
│   ├── User.js                    # User schema
│   ├── Subscription.js            # Subscription schema
│   ├── Notification.js            # Notification schema
│   └── Log.js                     # Log schema
├── controllers/
│   ├── auth.controller.js         # Auth request handlers
│   ├── subscription.controller.js # Subscription request handlers
│   └── notification.controller.js # Notification request handlers
├── services/
│   ├── auth.service.js            # Auth business logic
│   ├── subscription.service.js    # Subscription business logic
│   ├── notification.service.js    # Notification orchestration
│   └── email.service.js           # Nodemailer email delivery
├── routes/
│   ├── auth.routes.js             # /api/auth
│   ├── subscription.routes.js     # /api/subscriptions
│   └── notification.routes.js     # /api/notifications
├── middleware/
│   ├── auth.middleware.js         # JWT verification
│   ├── validate.middleware.js     # express-validator error handler
│   └── rateLimiter.js             # API + auth rate limiters
├── validators/
│   ├── auth.validator.js          # Register / login / profile rules
│   ├── subscription.validator.js  # Subscription CRUD rules
│   └── notification.validator.js  # Notification query rules
├── jobs/
│   └── renewalChecker.js          # Cron: renewal alerts + expiry cleanup
├── .env.example                   # Environment variable template
└── app.js                         # App entry point
```

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd server
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see Environment Variables below).

### 3. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000` by default.

---

## Environment Variables

```env
# ─── SERVER ───────────────────────────────────────────────
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=*

# ─── JWT ──────────────────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# ─── MONGODB ──────────────────────────────────────────────
MONGO_URI=mongodb://localhost:27017/subscription_manager

# ─── NODEMAILER (Gmail) ───────────────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Subscription Manager <your_email@gmail.com>"

# ─── RATE LIMITING ────────────────────────────────────────
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=10

# ─── CRON ─────────────────────────────────────────────────
RENEWAL_CHECK_CRON=0 8 * * *
RENEWAL_ALERT_DAYS=7
```

> **Gmail setup**: Enable 2-Factor Authentication on your Google account, then generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) and use it as `EMAIL_PASS`.

---

## API Reference

All protected routes require:
```
Authorization: Bearer <token>
```

---

### Auth `/api/auth`

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "Priyanshu",
  "email": "priyanshu@example.com",
  "password": "SecurePass@1",
  "phone": "+919876543210"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Priyanshu",
      "email": "priyanshu@example.com",
      "phone": "+919876543210",
      "isVerified": false,
      "notificationPreferences": { "email": true, "sms": false }
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### POST `/api/auth/login`
Login and receive a JWT.

**Request Body:**
```json
{
  "email": "priyanshu@example.com",
  "password": "SecurePass@1"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### GET `/api/auth/profile` 🔒
Get the authenticated user's profile.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Priyanshu",
    "email": "priyanshu@example.com",
    "phone": "+919876543210",
    "notificationPreferences": { "email": true, "sms": false }
  }
}
```

---

#### PATCH `/api/auth/profile` 🔒
Update name, phone, or notification preferences.

**Request Body:**
```json
{
  "name": "Priyanshu Kumar",
  "phone": "+919876543210",
  "notificationPreferences": {
    "email": true,
    "sms": false
  }
}
```

---

### Subscriptions `/api/subscriptions` 🔒

#### POST `/api/subscriptions`
Create a new subscription.

**Request Body:**
```json
{
  "name": "Netflix",
  "amount": 649,
  "currency": "INR",
  "billingCycle": "monthly",
  "startDate": "2025-01-01",
  "reminderDays": 7,
  "notifyEmail": true,
  "notifySms": false,
  "category": "Entertainment",
  "websiteUrl": "https://netflix.com",
  "notes": "Family plan"
}
```

**Billing cycle options:** `monthly` `yearly` `weekly` `quarterly`

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Netflix",
    "amount": 649,
    "currency": "INR",
    "billingCycle": "monthly",
    "status": "active",
    "startDate": "2025-01-01T00:00:00.000Z",
    "nextRenewal": "2025-02-01T00:00:00.000Z",
    ...
  }
}
```

---

#### GET `/api/subscriptions`
Get all subscriptions with optional filters.

**Query Parameters:**

| Param | Type | Options |
|---|---|---|
| `status` | string | `active` `paused` `cancelled` `expired` |
| `category` | string | any |
| `sort` | string | `nextRenewal` `amount` `name` `createdAt` `status` |
| `order` | string | `asc` `desc` |
| `page` | number | default `1` |
| `limit` | number | default `20`, max `100` |

**Example:**
```
GET /api/subscriptions?status=active&sort=nextRenewal&order=asc&page=1&limit=10
```

**Response `200`:**
```json
{
  "success": true,
  "subscriptions": [ ... ],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

---

#### GET `/api/subscriptions/summary`
Get estimated monthly and yearly spend grouped by currency.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "INR",
      "totalSubscriptions": 4,
      "monthlyEstimate": 1897.50,
      "yearlyEstimate": 22770.00
    }
  ]
}
```

---

#### GET `/api/subscriptions/:id`
Get a single subscription by ID.

---

#### PUT `/api/subscriptions/:id`
Update a subscription. Only send the fields you want to change.

**Request Body:**
```json
{
  "name": "Netflix Premium",
  "amount": 799,
  "status": "active",
  "reminderDays": 5
}
```

---

#### DELETE `/api/subscriptions/:id`
Delete a subscription.

**Response `200`:**
```json
{
  "success": true,
  "data": { "deleted": true }
}
```

---

### Notifications `/api/notifications` 🔒

#### GET `/api/notifications`
Get all notifications with optional filters.

**Query Parameters:**

| Param | Type | Options |
|---|---|---|
| `type` | string | `renewal_reminder` `subscription_expired` `subscription_created` `subscription_cancelled` `test` |
| `status` | string | `pending` `sent` `failed` `skipped` |
| `isRead` | boolean | `true` `false` |
| `page` | number | default `1` |
| `limit` | number | default `20`, max `100` |

**Response `200`:**
```json
{
  "success": true,
  "notifications": [ ... ],
  "total": 10,
  "unreadCount": 3,
  "page": 1,
  "pages": 1
}
```

---

#### GET `/api/notifications/stats`
Get notification delivery stats grouped by type and status.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "renewal_reminder",
      "total": 8,
      "statuses": [
        { "status": "sent", "count": 7, "latest": "2025-03-20T08:00:00.000Z" },
        { "status": "failed", "count": 1, "latest": "2025-03-15T08:00:00.000Z" }
      ]
    }
  ]
}
```

---

#### GET `/api/notifications/:id`
Get a single notification by ID.

---

#### PATCH `/api/notifications/:id/read`
Mark a single notification as read.

---

#### PATCH `/api/notifications/mark-all-read`
Mark all notifications as read.

**Response `200`:**
```json
{
  "success": true,
  "data": { "updated": 3 }
}
```

---

#### DELETE `/api/notifications/:id`
Delete a notification.

---

### Health Check

#### GET `/health`
```json
{
  "success": true,
  "uptime": 3600.25,
  "timestamp": "2025-03-20T08:00:00.000Z",
  "environment": "development"
}
```

---

## Error Responses

All errors follow this shape:

```json
{
  "success": false,
  "message": "Human-readable error message."
}
```

**Validation errors `422`:**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Please provide a valid email." },
    { "field": "amount", "message": "Amount is required." }
  ]
}
```

**Common status codes:**

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `401` | Unauthorized / invalid token |
| `404` | Resource not found |
| `409` | Conflict (e.g. email already registered) |
| `422` | Validation failed |
| `429` | Too many requests |
| `500` | Internal server error |

---

## Cron Jobs

Two jobs run automatically after server start:

| Job | Schedule | Description |
|---|---|---|
| Renewal Alerts | `0 8 * * *` (configurable) | Sends email reminders for subscriptions renewing within `RENEWAL_ALERT_DAYS` days |
| Expiry Cleanup | `0 0 * * *` | Marks overdue active subscriptions as `expired` |

> The renewal alert fires once per day. A subscription will receive one reminder per day for each day it falls within the alert window. To receive only a single reminder, set `RENEWAL_ALERT_DAYS=1`.

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Hashed with bcrypt, never returned |
| `phone` | String | Optional, international format |
| `isVerified` | Boolean | Default `false` |
| `notificationPreferences` | Object | `{ email: true, sms: false }` |

### Subscription
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId | Ref: User |
| `name` | String | Required |
| `amount` | Number | Required, min 0 |
| `currency` | String | Default `INR` |
| `billingCycle` | Enum | `monthly` `yearly` `weekly` `quarterly` |
| `status` | Enum | `active` `paused` `cancelled` `expired` |
| `startDate` | Date | Required |
| `nextRenewal` | Date | Auto-calculated |
| `reminderDays` | Number | Default `7`, max `30` |
| `notifyEmail` | Boolean | Default `true` |
| `notifySms` | Boolean | Default `false` |
| `category` | String | Optional |
| `websiteUrl` | String | Optional |
| `notes` | String | Optional, max 1000 chars |

### Notification
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId | Ref: User |
| `subscriptionId` | ObjectId | Ref: Subscription |
| `type` | Enum | `renewal_reminder` etc. |
| `channel` | Enum | `email` `sms` `both` |
| `status` | Enum | `pending` `sent` `failed` `skipped` |
| `title` | String | Short summary |
| `message` | String | Full message body |
| `isRead` | Boolean | Default `false` |
| `deliveryResult` | Object | Per-channel messageId, sid, error, sentAt |
| `metadata` | Mixed | daysLeft, amount, renewalDate etc. |
---

## Security

- Passwords hashed with `bcryptjs` (12 salt rounds)
- JWT verified on every protected request
- User existence re-checked in DB on each request (handles deleted accounts)
- Request body capped at `10kb`
- CORS configurable via `CLIENT_ORIGIN`
- Stack traces hidden in production

---

## Scripts

```bash
npm run dev     # Start with nodemon (auto-reload)
npm start       # Start in production mode
```

---

## Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-rate-limit": "^7.1.5",
  "express-validator": "^7.0.1",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.0.3",
  "node-cron": "^3.0.3",
  "nodemailer": "^6.9.7"
}
```