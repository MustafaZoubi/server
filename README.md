# 🎮 Aracadia Server (Express + MongoDB)

This is the **backend** for the **Arcadia** gaming platform. It provides APIs for **user authentication**, **profile management**, **games browsing (with RAWG images)**, **achievements**, **cart**, **wishlist**, and **admin dashboard CRUD** (users, games, achievements).

---

## 🏗️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Authorization**: Role-based access (User / Admin)
- **External API**: RAWG Video Games Database (game images)
- **Utilities**: `dotenv`, `cors`

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure Environment Variables
# Create a .env file in the root directory and add:

PORT=5000
MONGO_URI=mongodb://localhost:27017/gamevault
JWT_SECRET=your_super_secret_key
RAWG_API_KEY=your_rawg_api_key

# 3. Start the server
npm start

```
## 🗂️ Project Structure

```bash
GameVault_Server/
├── config/
│   └── db.js                         # MongoDB connection (Mongoose)
├── controllers/
│   ├── authController.js             # Signup & Login logic
│   ├── userController.js             # Profile get/update
│   ├── gameController.js             # Public games + RAWG images + similar games
│   ├── achievementController.js      # Achievements by game
│   ├── cartController.js             # Cart CRUD (per-user)
│   ├── wishlistController.js         # Wishlist CRUD (per-user)
│   ├── adminUserController.js        # Admin manage users
│   ├── adminGameController.js        # Admin manage games
│   └── adminAchievementController.js # Admin manage achievements
├── middleware/
│   └── authMiddleware.js             # protect (JWT) + adminOnly
├── models/
│   ├── User.js
│   ├── Game.js
│   ├── Achievement.js
│   ├── Cart.js
│   └── Wishlist.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── gameRoutes.js
│   ├── achievementRoutes.js
│   ├── cartRoutes.js
│   ├── wishlistRoutes.js
│   └── adminRoutes.js
├── services/
│   └── rawgService.js                # RAWG API integration
├── app.js                            # Express app + middleware + route mounting
├── server.js                         # Entry point + connectDB + listen
└── package.json
```
## 📡 API Endpoints

The API runs on: `http://localhost:5000`

Base prefix for all endpoints in this server is:

```bash
/api
```

## 🔐 Authentication / Authorization (How Guards Work)

---

## ✅ Protected Routes (🔒 Token)

Any route marked 🔒 **Token** requires an `Authorization` header:

```bash
Authorization: Bearer <JWT_TOKEN>
```

The `protect` middleware:

- Reads the Bearer token
- Verifies it using `JWT_SECRET`
- Loads the user from MongoDB (password removed)
- Attaches the user to `req.user`

---

## ✅ Admin Routes (🔐 Admin)

Any route marked 🔐 **Admin** requires:

- Valid token (protected)
- `req.user.role === "admin"`

If user is not admin, server returns:

```json
{
  "message": "Admins only"
}
```
## 🔐 Auth Routes

**Base URL:** `/api/auth`

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| POST | `/signup` | Register a new user account | Public |
| POST | `/login` | Login and receive JWT token | Public |

---

## 🔸 POST /api/auth/signup

### What it does

Creates a new user in MongoDB:

- Validates username, email, password
- Prevents duplicate emails and usernames
- Hashes the password using bcrypt
- Assigns role (`user` by default; `admin` allowed only if sent and validated in controller)
- Returns a signed JWT token

---

### Request Body

```json
{
  "username": "player1",
  "email": "player1@example.com",
  "password": "securepassword123"
}
```

Optional (allowed by your controller):

```json
{
  "role": "admin"
}
```

---

### Success Response (201)

```json
{
  "message": "User registered",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "65f0c1...",
    "username": "player1",
    "email": "player1@example.com",
    "role": "user"
  }
}
```

---

### Common Errors

**400 — missing fields**

```json
{
  "message": "username, email, password are required"
}
```

**409 — email exists**

```json
{
  "message": "Email already exists"
}
```

**409 — username exists**

```json
{
  "message": "Username already exists"
}
```

---

## 🔸 POST /api/auth/login

### What it does

Logs in an existing user:

- Validates email and password
- Checks user exists
- Compares password using bcrypt
- Returns JWT token and user info

---

### Request Body

```json
{
  "email": "player1@example.com",
  "password": "securepassword123"
}
```

---

### Success Response (200)

```json
{
  "message": "Login success",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "65f0c1...",
    "username": "player1",
    "email": "player1@example.com",
    "role": "user"
  }
}
```

---

### Common Errors

**400 — missing fields**

```json
{
  "message": "email and password are required"
}
```

**401 — invalid credentials**

```json
{
  "message": "Invalid credentials"
}
```
## 👤 User Routes

**Base URL:** `/api/user`

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| GET | `/profile` | Get logged-in user's profile | 🔐 Token |
| PUT | `/profile` | Update logged-in user's profile | 🔐 Token |

---

## 🔸 GET /api/user/profile

### What it does

Returns information about the authenticated user (`req.user`), including role.

---

### Headers

```bash
Authorization: Bearer <token>
```

---

### Success Response (200)

```json
{
  "id": "65f0c1...",
  "username": "player1",
  "email": "player1@example.com",
  "role": "user",
  "status": "Active"
}
```

---

### Common Errors

**401 — no or invalid token**

```json
{ "message": "Not authorized, no token" }
```

or

```json
{ "message": "Token invalid" }
```

---

## 🔸 PUT /api/user/profile

### What it does

Updates the authenticated user's information:

- Can update username
- Can update email
- Can update password (bcrypt hashed) if provided and not empty

---

### Headers

```bash
Authorization: Bearer <token>
```

---

### Request Body  
(any of these fields)

```json
{
  "username": "player1_new",
  "email": "player1_new@example.com",
  "password": "newSecurePassword123"
}
```

---

### Success Response (200)

```json
{
  "message": "Profile updated",
  "user": {
    "id": "65f0c1...",
    "username": "player1_new",
    "email": "player1_new@example.com",
    "role": "user"
  }
}
```

---

### Common Errors

**404 — user not found**

```json
{ "message": "User not found" }
```

---

**500 — server failure**

```json
{ "message": "Failed to update profile" }
```
## 🎮 Game Routes

**Base URL:** `/api/games`

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| GET | `/` | Get all games (enriched with RAWG images) | Public |
| GET | `/:id` | Get a single game by MongoDB id (enriched) | Public |
| GET | `/:id/similar` | Get up to 2 similar games by shared genres | Public |

---

✅ Your controller enriches games by calling RAWG with `rawgId` and returns:

```json
images: {
  background,
  screenshots
}
```

---

## 🔸 GET /api/games

### What it does

- Reads all games from MongoDB
- For each game, calls RAWG to fetch images (background + additional images)
- Returns the enriched games array

---

### Example Response (200)

```json
[
  {
    "_id": "65f1a0...",
    "title": "Elden Ring",
    "price": 69.99,
    "platforms": ["PC", "PS5"],
    "genres": ["RPG", "Action"],
    "rawgId": 326243,
    "images": {
      "background": "https://media.rawg.io/media/...",
      "screenshots": ["https://media.rawg.io/media/..."]
    }
  }
]
```

---

### Notes

If RAWG fails for a game, the backend returns:

```json
"images": {
  "background": null,
  "screenshots": []
}
```

---

## 🔸 GET /api/games/:id

### What it does

- Finds one game by MongoDB `_id`
- Enriches the game with RAWG images
- Returns the full game object including images

---

### Example Request

```bash
GET /api/games/65f1a0...
```

---

### Example Response (200)

```json
{
  "_id": "65f1a0...",
  "title": "Cyberpunk 2077",
  "price": 59.99,
  "platforms": ["PC", "PS5"],
  "genres": ["RPG", "Action"],
  "rawgId": 41494,
  "images": {
    "background": "https://media.rawg.io/media/...",
    "screenshots": []
  }
}
```

---

### Common Errors

**404 — not found**

```json
{ "message": "Game not found" }
```

---

## 🔸 GET /api/games/:id/similar

### What it does

- Loads the requested game
- Finds other games with overlapping genres
- Returns up to 2 similar games
- Each game is enriched with RAWG images

---

### Example Request

```bash
GET /api/games/65f1a0.../similar
```

---

### Example Response (200)

```json
[
  {
    "_id": "65f1a8...",
    "title": "The Witcher 3",
    "genres": ["RPG", "Action"],
    "rawgId": 3328,
    "images": {
      "background": "https://media.rawg.io/media/...",
      "screenshots": []
    }
  },
  {
    "_id": "65f1aa...",
    "title": "Skyrim",
    "genres": ["RPG"],
    "rawgId": 5679,
    "images": {
      "background": "https://media.rawg.io/media/...",
      "screenshots": []
    }
  }
]
```

---

### Common Errors

**404 — base game not found**

```json
{ "message": "Game not found" }
```
## 🏆 Achievement Routes

**Base URL:** `/api/achievements`

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| GET | `/game/:gameId` | Get all achievements for a specific game | Public |

---

## 🔸 GET /api/achievements/game/:gameId

### What it does

- Finds achievements where `achievement.game === gameId`
- Returns the achievement list

---

### Example Request

```bash
GET /api/achievements/game/65f1a0...
```

---

### Example Response (200)

```json
[
  {
    "_id": "65f2b1...",
    "game": "65f1a0...",
    "title": "First Blood",
    "description": "Defeat your first enemy",
    "unlockedPercent": 100,
    "createdAt": "2026-01-20T10:15:30.000Z",
    "updatedAt": "2026-01-20T10:15:30.000Z"
  }
]
```

---

### Common Errors

**500 — fetch failure**

```json
{ "message": "Failed to fetch achievements" }
```
## 🛒 Cart Routes

**Base URL:** `/api/cart`

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| GET | `/` | Get the logged-in user’s cart (auto-create if missing) | 🔐 Token |
| POST | `/add` | Add a game to cart (or increase quantity) | 🔐 Token |
| PATCH | `/update/:gameId` | Set cart item quantity (1–99) | 🔐 Token |
| DELETE | `/remove/:gameId` | Remove a game from cart | 🔐 Token |
| DELETE | `/clear` | Clear all items in cart | 🔐 Token |

---

## 🔸 GET /api/cart

### What it does

- Finds cart for the logged-in user
- If no cart exists, creates an empty cart
- Populates games inside items
- Returns computed values:
  - `subtotal`
  - `totalItems`
  - `lineTotal` per item

---

### Headers

```bash
Authorization: Bearer <token>
```

---

### Example Response (200)

```json
{
  "_id": "65f300...",
  "user": "65f0c1...",
  "items": [
    {
      "game": {
        "_id": "65f1a0...",
        "title": "Elden Ring",
        "price": 69.99,
        "platforms": ["PC", "PS5"]
      },
      "quantity": 2,
      "lineTotal": 139.98
    }
  ],
  "subtotal": 139.98,
  "totalItems": 2
}
```

---

## 🔸 POST /api/cart/add

### What it does

- Validates `gameId`
- Checks that the game exists
- Creates cart if missing
- Adds item or increases quantity
- Quantity is clamped between **1 and 99**

---

### Request Body

```json
{
  "gameId": "65f1a0...",
  "quantity": 2
}
```

---

### Example Success Response (200)

```json
{
  "_id": "65f300...",
  "items": [
    {
      "game": {
        "_id": "65f1a0...",
        "title": "Elden Ring",
        "price": 69.99,
        "platforms": ["PC", "PS5"]
      },
      "quantity": 2,
      "lineTotal": 139.98
    }
  ],
  "subtotal": 139.98,
  "totalItems": 2
}
```

---

### Common Errors

**400 — missing gameId**

```json
{ "message": "gameId is required" }
```

---

**404 — game not found**

```json
{ "message": "Game not found" }
```

---

## 🔸 PATCH /api/cart/update/:gameId

### What it does

- Sets the quantity for an existing cart item
- Quantity must be between **1 and 99**

---

### Example Request

```bash
PATCH /api/cart/update/65f1a0...
```

---

### Request Body

```json
{
  "quantity": 5
}
```

---

### Errors

**400 — invalid quantity**

```json
{ "message": "quantity must be 1-99" }
```

---

**404 — cart not found**

```json
{ "message": "Cart not found" }
```

---

**404 — item not in cart**

```json
{ "message": "Item not found in cart" }
```

---

## 🔸 DELETE /api/cart/remove/:gameId

### What it does

- Removes a single game from the cart

---

### Example Request

```bash
DELETE /api/cart/remove/65f1a0...
```

---

### Response (200)

Returns the updated cart object  
(same format as **GET /api/cart**).

---

## 🔸 DELETE /api/cart/clear

### What it does

- Removes all items from the user’s cart

---

### Example Request

```bash
DELETE /api/cart/clear
```

---

### Response (200)

Returns an empty cart response:

```json
{
  "items": [],
  "subtotal": 0,
  "totalItems": 0
}
```
## ❤️ Wishlist Routes

**Base URL:** `/api/wishlist`

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| GET | `/` | Get logged-in user wishlist (auto-create if missing) | 🔐 Token |
| POST | `/toggle` | Add or remove a game from wishlist | 🔐 Token |
| DELETE | `/:gameId` | Remove a game from wishlist | 🔐 Token |

---

## 🔸 GET /api/wishlist

### What it does

- Finds the user wishlist
- If none exists, creates one
- Populates game details
- Returns a simple list of wishlist games

---

### Example Response (200)

```json
{
  "_id": "65f400...",
  "items": [
    {
      "game": {
        "_id": "65f1a0...",
        "title": "Elden Ring",
        "price": 69.99,
        "platforms": ["PC", "PS5"]
      }
    }
  ]
}
```

---

## 🔸 POST /api/wishlist/toggle

### What it does

- If the game already exists in wishlist → removes it
- If the game is not present → adds it
- Validates that the game exists

---

### Request Body

```json
{
  "gameId": "65f1a0..."
}
```

---

### Example Response (200)

Returns the updated wishlist:

```json
{
  "_id": "65f400...",
  "items": []
}
```

---

### Common Errors

**400 — missing gameId**

```json
{ "message": "gameId required" }
```

---

**404 — game not found**

```json
{ "message": "Game not found" }
```

---

## 🔸 DELETE /api/wishlist/:gameId

### What it does

- Removes the game from the wishlist (if it exists)

---

### Example Request

```bash
DELETE /api/wishlist/65f1a0...
```

---

### Errors

**404 — wishlist not found**

```json
{ "message": "Wishlist not found" }
```
## 🛠️ Admin Routes

**Base URL:** `/api/admin`  
**Access:** 🔒 Admin only (requires `protect` + `adminOnly`)

---

## 👥 Admin User Management

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| GET | `/users` | Get all users (without passwords) | 🔒 Admin |
| POST | `/users` | Create a user | 🔒 Admin |
| PUT | `/users/:id` | Update user info | 🔒 Admin |
| PATCH | `/users/:id/role` | Toggle user role (user ↔ admin) | 🔒 Admin |
| DELETE | `/users/:id` | Delete user | 🔒 Admin |

---

## 🔸 GET /api/admin/users

### What it does

- Returns all users
- Password field is excluded

---

### Example Response (200)

```json
[
  {
    "_id": "65f0c1...",
    "username": "player1",
    "email": "player1@example.com",
    "role": "user"
  },
  {
    "_id": "65f0c2...",
    "username": "admin1",
    "email": "admin@example.com",
    "role": "admin"
  }
]
```

---

## 🔸 POST /api/admin/users

### What it does

- Creates a new user
- Requires username, email, password
- Hashes password using bcrypt
- Role defaults to `user` if not provided

---

### Request Body

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "pass123",
  "role": "user"
}
```

---

### Success Response (201)

```json
{
  "_id": "65f9...",
  "username": "newuser",
  "email": "newuser@example.com",
  "role": "user"
}
```

---

### Errors

**400 — missing fields**

```json
{ "message": "Missing required fields" }
```

---

**400 — user already exists**

```json
{ "message": "User already exists" }
```

---

## 🔸 PUT /api/admin/users/:id

### What it does

- Updates a user
- Can update:
  - username
  - email
  - role
- If password is provided → hashes and updates it

---

### Example Request Body

```json
{
  "username": "updatedUser",
  "email": "updated@example.com",
  "password": "newPass123",
  "role": "admin"
}
```

---

### Errors

**404 — user not found**

```json
{ "message": "User not found" }
```

---

## 🔸 PATCH /api/admin/users/:id/role

### What it does

- Toggles user role:
  - admin → user
  - user → admin

---

### Response (200)

```json
{
  "_id": "65f0c1...",
  "username": "player1",
  "email": "player1@example.com",
  "role": "admin"
}
```

---

## 🔸 DELETE /api/admin/users/:id

### What it does

- Deletes a user by id

---

### Response (200)

```json
{ "message": "User deleted" }
```

---

# 🎮 Admin Game Management

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| GET | `/games` | Get all games (admin view) | 🔒 Admin |
| POST | `/games` | Create a new game | 🔒 Admin |
| PUT | `/games/:id` | Update a game | 🔒 Admin |
| DELETE | `/games/:id` | Delete a game | 🔒 Admin |

---

⚠️ Game fields used by controllers:

- title
- price
- platforms
- genres
- rawgId

(Add additional fields if your Game schema includes more.)

---

## 🔸 GET /api/admin/games

### What it does

- Returns all games
- Sorted newest first (`createdAt` descending)

---

### Example Response (200)

```json
[
  {
    "_id": "65f1a0...",
    "title": "Elden Ring",
    "price": 69.99,
    "platforms": ["PC", "PS5"],
    "genres": ["RPG", "Action"],
    "rawgId": 326243
  }
]
```

---

## 🔸 POST /api/admin/games

### What it does

- Creates a new game using `req.body`

---

### Example Request Body

```json
{
  "title": "Hades",
  "price": 24.99,
  "platforms": ["PC", "Switch"],
  "genres": ["Rogue-like", "Action"],
  "rawgId": 274755
}
```

---

### Success Response (201)

```json
{
  "_id": "65f1b0...",
  "title": "Hades",
  "price": 24.99,
  "platforms": ["PC", "Switch"],
  "genres": ["Rogue-like", "Action"],
  "rawgId": 274755
}
```

---

## 🔸 PUT /api/admin/games/:id

### What it does

- Updates an existing game using `findByIdAndUpdate`

---

### Example Request Body

```json
{
  "price": 19.99,
  "platforms": ["PC", "PS5", "Switch"]
}
```

---

### Errors

**404 — game not found**

```json
{ "message": "Game not found" }
```

---

## 🔸 DELETE /api/admin/games/:id

### What it does

- Deletes a game by id

---

### Response (200)

```json
{ "message": "Game deleted" }
```
## 🏆 Admin Achievement Management

| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| GET | `/achievements` | Get all achievements (with populated game) | 🔒 Admin |
| POST | `/achievements` | Create achievement for a game | 🔒 Admin |
| PUT | `/achievements/:id` | Update achievement | 🔒 Admin |
| DELETE | `/achievements/:id` | Delete achievement | 🔒 Admin |

---

## 🔸 GET /api/admin/achievements

### What it does

- Returns all achievements
- Populates the related game reference

---

### Example Response (200)

```json
[
  {
    "_id": "65f2b1...",
    "title": "First Blood",
    "description": "Defeat your first enemy",
    "unlockedPercent": 100,
    "game": {
      "_id": "65f1a0...",
      "title": "Elden Ring"
    }
  }
]
```

---

## 🔸 POST /api/admin/achievements

### What it does

- Creates a new achievement
- Requires `title`, `description`, and `game`
- Verifies the game exists in MongoDB
- `unlockedPercent` defaults to **100** (immutable)

---

### Request Body

```json
{
  "title": "Master Explorer",
  "description": "Discover all hidden areas",
  "game": "65f1a0..."
}
```

---

### Success Response (201)

```json
{
  "_id": "65f2c9...",
  "title": "Master Explorer",
  "description": "Discover all hidden areas",
  "game": "65f1a0...",
  "unlockedPercent": 100
}
```

---

### Errors

**400 — missing fields**

```json
{ "message": "All fields are required" }
```

---

**404 — game not found**

```json
{ "message": "Game not found" }
```

---

## 🔸 PUT /api/admin/achievements/:id

### What it does

- Updates achievement fields:
  - title
  - description
  - game

---

### Example Request Body

```json
{
  "title": "Master Explorer (Updated)",
  "description": "Discover ALL hidden areas"
}
```

---

### Errors

**404 — achievement not found**

```json
{ "message": "Achievement not found" }
```

---

## 🔸 DELETE /api/admin/achievements/:id

### What it does

- Deletes an achievement by id

---

### Response (200)

```json
{ "message": "Achievement deleted" }
```

---

# 🌐 RAWG API Integration (Images)

The server enriches game responses by calling RAWG using each game's `rawgId`.

---

### Returned format added to responses

```json
"images": {
  "background": "https://...",
  "screenshots": ["https://..."]
}
```

---

### Fallback behavior (if RAWG fails)

```json
"images": {
  "background": null,
  "screenshots": []
}
```

---


