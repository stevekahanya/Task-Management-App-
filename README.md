# TaskFlow — React + Flask Full Stack Project

A full-featured task management app built with React (Vite) and Flask, using JWT authentication, SQLite, and a clean Kanban board UI.

---

## Project Structure

```
taskflow/
├── backend/
│   ├── app.py                  # Flask app factory & entry point
│   ├── seed.py                 # Database seed script
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   │   └── config.py           # Dev/Prod config classes
│   ├── models/
│   │   └── models.py           # User, Task, Tag (with relationships)
│   └── routes/
│       ├── auth_routes.py      # /api/auth - register, login, logout, me
│       ├── task_routes.py      # /api/tasks - full CRUD
│       └── tag_routes.py       # /api/tags - CRUD
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── App.jsx             # Router + layout
        ├── main.jsx
        ├── index.css           # Global styles
        ├── context/
        │   └── AuthContext.jsx # JWT auth state
        ├── services/
        │   └── api.js          # Fetch wrapper for all endpoints
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── TaskCard.jsx
        │   └── TaskModal.jsx   # Create/Edit modal
        └── pages/
            ├── Home.jsx        # Landing page
            ├── Login.jsx
            ├── Register.jsx
            └── Dashboard.jsx   # Kanban board + list view
```

---

## Database Relationships

### One-to-Many (1:M)
> One **User** can have many **Tasks**

```python
class User(db.Model):
    tasks = db.relationship('Task', backref='owner', lazy=True, cascade='all, delete-orphan')

class Task(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
```

### Many-to-Many (M:M)
> Many **Tasks** can have many **Tags**

```python
task_tags = db.Table('task_tags',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Task(db.Model):
    tags = db.relationship('Tag', secondary=task_tags, backref=db.backref('tasks', lazy='dynamic'))
```

---

## Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your secrets

# Seed the database (creates tables + sample data)
python seed.py

# Run the server
python app.py
# → Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start dev server
npm run dev
# → Runs on http://localhost:5173
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/logout` | ✅ | Logout (client clears token) |

### Tasks (all protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | Get all user tasks (filter: `?status=todo&priority=high`) |
| POST | `/api/tasks/` | Create task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Tags (all protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags/` | Get all tags |
| POST | `/api/tags/` | Create tag |
| PUT | `/api/tags/:id` | Update tag |
| DELETE | `/api/tags/:id` | Delete tag |

---

## Authentication Flow

1. User registers/logs in → backend returns JWT token
2. Token stored in `localStorage`
3. Every API request includes `Authorization: Bearer <token>` header
4. Protected routes check `useAuth()` context → redirect to `/login` if no user
5. Backend routes use `@jwt_required()` decorator to validate token

---

## Features

- **Kanban board** — drag-style status cycling (To Do → In Progress → Done)
- **List view** — toggle between board and list
- **Task filtering** — by status and priority
- **Rich task form** — title, description, status, priority, due date, tags
- **Stats dashboard** — total, completed, remaining, high-priority counts
- **Overdue detection** — highlights past-due tasks
- **Responsive UI** — works on mobile

---

## Demo Credentials

After running `python seed.py`:

```
alice@example.com / password123
bob@example.com   / password123
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Vite |
| Backend | Flask 3, Flask-SQLAlchemy, Flask-JWT-Extended |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (JSON Web Tokens) |
| Styling | Custom CSS with CSS variables |
