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


<p align="center">
  <img src="IMAGE_LINK_1" width="45%" />
  <img src="IMAGE_LINK_2" width="45%" />
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