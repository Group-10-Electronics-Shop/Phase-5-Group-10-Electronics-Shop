import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
from datetime import datetime
import os

connection_pool = None

def init_db(database_url):
    """Initialize database connection"""
    global connection_pool
    try:
        connection_pool = psycopg2.connect(database_url, cursor_factory=RealDictCursor)
        print("Database connection initialized successfully")
    except Exception as e:
        print(f"Database initialization error: {e}")
        raise e

def get_db_connection():
    """Get database connection"""
    global connection_pool
    if connection_pool.closed:
        connection_pool = psycopg2.connect(
            os.getenv('DATABASE_URL'), 
            cursor_factory=RealDictCursor
        )
    return connection_pool

class User:
    """User model with specified fields: id, name, email, role, created_at"""
    
    @staticmethod
    def create(name, email, password, role='customer'):
        """Create a new user"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Check if user already exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                raise ValueError("Email already exists")
            
            # Hash password and create user
            password_hash = hash_password(password)
            cursor.execute("""
                INSERT INTO users (name, email, password_hash, role)
                VALUES (%s, %s, %s, %s)
                RETURNING id, name, email, role, created_at
            """, (name, email, password_hash, role))
            
            user = cursor.fetchone()
            conn.commit()
            return dict(user)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT id, name, email, password_hash, role, created_at
                FROM users WHERE email = %s
            """, (email,))
            
            user = cursor.fetchone()
            return dict(user) if user else None
            
        finally:
            cursor.close()
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT id, name, email, role, created_at
                FROM users WHERE id = %s
            """, (user_id,))
            
            user = cursor.fetchone()
            return dict(user) if user else None
            
        finally:
            cursor.close()

def hash_password(password):
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, password_hash):
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))