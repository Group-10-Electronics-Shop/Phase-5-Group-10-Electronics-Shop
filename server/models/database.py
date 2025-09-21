import psycopg2
from psycopg2.extras import RealDictCursor
import os

connection_pool = None

def init_db(database_url: str) -> None:
    """Initialize database connection and create tables"""
    global connection_pool
    try:
        connection_pool = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
        create_tables()
        create_default_admin()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization error: {e}")
        raise e

def get_db_connection():
    """Get database connection"""
    global connection_pool
    if not connection_pool or connection_pool.closed:
        database_url = os.getenv('DATABASE_URL', 'postgresql://username:password@localhost/electronics_shop')
        connection_pool = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
    return connection_pool

def create_tables() -> None:
    """Create users table"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(80) UNIQUE NOT NULL,
            email VARCHAR(120) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(80) NOT NULL,
            last_name VARCHAR(80) NOT NULL,
            role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
            address TEXT,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
 
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)")
    conn.commit()
    cursor.close()

def create_default_admin() -> None:
    """Create default admin user if it doesn't exist"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username = 'admin' OR role = 'admin'")
    if cursor.fetchone():
        cursor.close()
        return
    
    # I Imported here to avoid circular imports
    from server.models.user import User
    
    try:
        admin_user = User.create(
            username='admin',
            email='admin@electronicsshop.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            role='admin'
        )
        if admin_user:
            print(f"Default admin user created: {admin_user.username}")
        else:
            print("Failed to create default admin user")
    except Exception as e:
        print(f"Admin user creation failed: {e}")
    finally:
        cursor.close()

def drop_tables() -> None:
    """Drop all tables (for testing)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DROP TABLE IF EXISTS users CASCADE")
    
    conn.commit()
    cursor.close()

def reset_database() -> None:
    """Reset database (for testing)"""
    drop_tables()
    create_tables()
    create_default_admin() 