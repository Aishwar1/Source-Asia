# Source Asia Backend Assignment

## Tech Stack

- Node.js
- Express.js
- UUID
- In-memory storage

---

# Setup

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm run dev
```

Server runs on:

```bash
http://localhost:3000
```
<p align="center"><img src="<img width="1851" height="1219" alt="image" src="https://github.com/user-attachments/assets/e66c06bb-ab12-4ac7-88c2-26a258f3a805" />
" width="45%" /></p>

<p align="center">
  <img src="<img width="2028" height="1332" alt="Create Product POST" src="https://github.com/user-attachments/assets/443acd96-0c87-45dc-8a7e-06f3de7eeec5" />
" width="45%" />
  <img src="<img width="2106" height="1583" alt="GET Product" src="https://github.com/user-attachments/assets/572cebb2-0069-4697-98ce-e8ab49246d4d" />
" width="45%" />
</p>

<p align="center">
  <img src="<img width="2096" height="1377" alt="GET stats" src="https://github.com/user-attachments/assets/99663298-9176-4d9c-802b-5d589158e3f8" />
" width="45%" />
  <img src="<img width="1729" height="1276" alt="POST check" src="https://github.com/user-attachments/assets/ec0d9f4c-1209-438c-b952-54816c342fcd" />
" width="45%" />
</p>

<p align="center">
  <img src="<img width="2162" height="1547" alt="GET Product by ID" src="https://github.com/user-attachments/assets/e65b6a89-d69b-4893-8f29-28a6892543ae" />
" width="45%" />
  <img src="<img width="2550" height="1587" alt="POST by Product ID" src="https://github.com/user-attachments/assets/4a65db88-7672-4697-9edd-721771fe509c" />
" width="45%" />
</p>

<p align="center">
  <img src="<img width="2541" height="1599" alt="New Product POST" src="https://github.com/user-attachments/assets/38f8f982-f557-40e4-8fc2-37ec59a16a70" />
" width="45%" />
  <img src="<img width="2555" height="1605" alt="Invalid URL status POST" src="https://github.com/user-attachments/assets/13e351e9-0eb1-4f1b-8554-004d52ac7e40" />
" width="45%" />
</p>

<p align="center">
  <img src="<img width="2515" height="1415" alt="Empty Set" src="https://github.com/user-attachments/assets/c794f241-9617-4432-ad06-b901de17315e" />
" width="45%" />
  <img src="<img width="2548" height="1581" alt="Last Check Request GET" src="https://github.com/user-attachments/assets/17851803-c8f0-4344-b80d-49f7e51cba76" />
" width="45%" />
</p>

---

# API Endpoints

## Part 1 - Rate Limited API

### POST /request

Request Body:

```json
{
  "user_id": "user1",
  "payload": {
    "data": "hello"
  }
}
```

Success Response:

```json
{
  "message": "Request accepted"
}
```

Rules:
- Max 5 requests per user
- Rolling 1-minute window
- Exceeding limit returns 429

---

### GET /stats

Returns accepted and rejected request counts per user.

Example:

```json
{
  "user1": {
    "accepted_requests": 5,
    "rejected_requests": 2
  }
}
```

---

## Part 2 - Product Catalog API

### POST /products

Request Body:

```json
{
  "name": "Widget A",
  "sku": "SKU-001",
  "image_urls": [
    "https://cdn.example.com/products/sku-001/img-1.jpg"
  ],
  "video_urls": [
    "https://cdn.example.com/products/sku-001/demo.mp4"
  ]
}
```

Validation:
- name required
- sku required and unique
- valid http/https URLs only
- max 20 URLs per request

---

### GET /products

Example:

```bash
/products?limit=10&offset=0
```

Returns lightweight product list with:
- id
- name
- sku
- image_count
- video_count
- thumbnail_url

Pagination:
- default limit = 10
- max limit = 50

---

### GET /products/:id

Returns full product details including all media URLs.

---

### POST /products/:id/media

Example:

```json
{
  "image_urls": [
    "https://cdn.example.com/products/sku-001/img-2.jpg"
  ]
}
```

Adds media URLs to existing product.

---

# Design Decisions

- Rolling window rate limiting used
- In-memory Maps used for storage
- Lightweight list endpoint for better performance
- Full media arrays only returned in detail endpoint

---

# Limitations

- Data resets on server restart
- Single-instance only
- No database persistence
- No authentication

---

# Production Improvements

- Redis for distributed rate limiting
- PostgreSQL for persistent storage
- CDN for media hosting
- Docker and automated tests
