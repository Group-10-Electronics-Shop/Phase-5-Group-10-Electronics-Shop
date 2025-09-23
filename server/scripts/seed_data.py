"""
seed_data.py

Idempotent seeding script:
 - Initializes DB using server.models.database.init_db(db_url)
 - Ensures admin user exists (defers to User.create logic)
 - Ensures a sample customer user exists
 - Optionally seeds categories/products if those tables exist

Usage:
  # either provide DB URL explicitly
  python server/scripts/seed_data.py --db-url postgresql://postgres:postgres@localhost:5432/test_db

  # or set env var and run without args
  export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_db
  python server/scripts/seed_data.py
"""
import os
import argparse

def main(db_url: str | None):
  
    if db_url:
        os.environ["DATABASE_URL"] = db_url

    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise SystemExit("No DATABASE_URL provided. Use --db-url or set DATABASE_URL environment variable.")

    # Initialize DB => creates tables if not exist
    try:
        from server.models.database import init_db, get_db_connection
        print("Initializing DB...")
        init_db(db_url)
        conn = get_db_connection()
        print("Database initialized.")
    except Exception as e:
        print("Failed to initialize DB:", e)
        raise

    # Import User model
    try:
        from server.models.user import User
    except Exception as e:
        print("User model import failed, skipping user seeds:", e)
        User = None

    if User:
        try:
            if not User.find_by_username("admin") and not User.find_by_email("admin@electronicsshop.com"):
                print("Creating admin user...")
                User.create(
                    username="admin",
                    email="admin@electronicsshop.com",
                    password="admin123",
                    first_name="Admin",
                    last_name="User",
                    role="admin",
                )
                print("Admin created.")
            else:
                print("Admin already exists - skipping.")
        except Exception as e:
            print("Admin creation failed (non-fatal):", e)

        try:
            if not User.find_by_username("testuser") and not User.find_by_email("test@example.com"):
                print("Creating sample customer user...")
                User.create(
                    username="testuser",
                    email="test@example.com",
                    password="password123",
                    first_name="Test",
                    last_name="User",
                    role="customer",
                )
                print("Sample user created.")
            else:
                print("Sample user already exists - skipping.")
        except Exception as e:
            print("Sample user creation failed (non-fatal):", e)

   
    try:
        cur = conn.cursor()
        try:
            cur.execute(
                "INSERT INTO categories (name, description) VALUES (%s,%s) ON CONFLICT (name) DO NOTHING",
                ("Phones", "Smartphones and feature phones")
            )
            cur.execute(
                "INSERT INTO categories (name, description) VALUES (%s,%s) ON CONFLICT (name) DO NOTHING",
                ("Laptops", "Portable computers")
            )
      
            cur.execute(
                "INSERT INTO products (name, price, stock, description, category_id) VALUES (%s,%s,%s,%s,%s) ON CONFLICT (name) DO NOTHING",
                ("Sample Product", 9.99, 100, "Sample seeded product", 1)
            )
            conn.commit()
            print("Optional categories/products seeded (if tables exist).")
        except Exception as e:
            conn.rollback()
            print("Optional product/category seed skipped or failed (likely tables missing):", e)
        finally:
            cur.close()
    except Exception as e:
        print("Skipping optional SQL seeds (cursor error):", e)

    print("Seeding complete.")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--db-url", help="Database URL (optional if DATABASE_URL set)", default=None)
    args = p.parse_args()
    main(args.db_url)