"""
Seed script - run with: python seed.py
Populates the database with sample data for development/testing.
"""
from app import create_app
from models.models import db, User, Task, Tag
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app('development')

with app.app_context():
    # Drop and recreate all tables
    db.drop_all()
    db.create_all()

    print("🌱 Seeding database...")

    # --- Tags ---
    tags_data = [
        {'name': 'frontend', 'color': '#3b82f6'},
        {'name': 'backend', 'color': '#10b981'},
        {'name': 'urgent', 'color': '#ef4444'},
        {'name': 'design', 'color': '#8b5cf6'},
        {'name': 'bug', 'color': '#f59e0b'},
        {'name': 'feature', 'color': '#06b6d4'},
    ]
    tags = []
    for t in tags_data:
        tag = Tag(**t)
        db.session.add(tag)
        tags.append(tag)
    db.session.flush()

    # --- Users ---
    alice = User(
        username='alice',
        email='alice@example.com',
        password_hash=generate_password_hash('password123')
    )
    bob = User(
        username='bob',
        email='bob@example.com',
        password_hash=generate_password_hash('password123')
    )
    db.session.add_all([alice, bob])
    db.session.flush()

    # --- Tasks for Alice (One-to-Many) ---
    tasks_alice = [
        Task(
            title='Set up React project structure',
            description='Initialize with Vite, configure Router and Context',
            status='done',
            priority='high',
            user_id=alice.id,
            due_date=datetime.utcnow() - timedelta(days=2),
            tags=[tags[0], tags[5]]  # frontend, feature
        ),
        Task(
            title='Build authentication UI',
            description='Login and Register pages with form validation',
            status='in_progress',
            priority='high',
            user_id=alice.id,
            due_date=datetime.utcnow() + timedelta(days=1),
            tags=[tags[0], tags[2]]  # frontend, urgent
        ),
        Task(
            title='Fix mobile navbar overlap bug',
            description='Hamburger menu overlaps content on small screens',
            status='todo',
            priority='medium',
            user_id=alice.id,
            due_date=datetime.utcnow() + timedelta(days=3),
            tags=[tags[0], tags[4]]  # frontend, bug
        ),
        Task(
            title='Design dashboard mockups',
            description='Figma wireframes for task board and analytics',
            status='todo',
            priority='low',
            user_id=alice.id,
            tags=[tags[3]]  # design
        ),
    ]

    # --- Tasks for Bob (One-to-Many) ---
    tasks_bob = [
        Task(
            title='Implement JWT authentication',
            description='Setup Flask-JWT-Extended with login/register endpoints',
            status='done',
            priority='high',
            user_id=bob.id,
            tags=[tags[1], tags[5]]  # backend, feature
        ),
        Task(
            title='Write API documentation',
            description='Document all endpoints using Swagger/OpenAPI',
            status='in_progress',
            priority='medium',
            user_id=bob.id,
            due_date=datetime.utcnow() + timedelta(days=5),
            tags=[tags[1]]  # backend
        ),
        Task(
            title='Fix database migration error',
            description='Alembic migration failing on production PostgreSQL',
            status='todo',
            priority='high',
            user_id=bob.id,
            due_date=datetime.utcnow() + timedelta(days=1),
            tags=[tags[1], tags[2], tags[4]]  # backend, urgent, bug
        ),
    ]

    db.session.add_all(tasks_alice + tasks_bob)
    db.session.commit()

    print(f"✅ Created {len(tags_data)} tags")
    print(f"✅ Created 2 users (alice@example.com / bob@example.com, password: password123)")
    print(f"✅ Created {len(tasks_alice) + len(tasks_bob)} tasks with tag relationships")
    print("\n🎉 Seed complete!")
