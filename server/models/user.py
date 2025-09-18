import bcrypt
from models.database import get_db_connection
from typing import Optional, Dict, Any
import re

class User:
    """User model for handling user data and operations"""
    
    def __init__(self, id=None, username=None, email=None, password_hash=None, 
                 first_name=None, last_name=None, role='customer', address=None, 
                 phone=None, created_at=None, updated_at=None):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.role = role
        self.address = address
        self.phone = phone
        self.created_at = created_at
        self.updated_at = updated_at
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password(password: str) -> tuple[bool, str]:
        """Validate password strength"""
        if len(password) < 6:
            return False, "Password must be at least 6 characters long"
        if not re.search(r'[A-Za-z]', password):
            return False, "Password must contain at least one letter"
        return True, ""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    
    @classmethod
    def create(cls, username: str, email: str, password: str, first_name: str, 
               last_name: str, address: Optional[str] = None, 
               phone: Optional[str] = None, role: str = 'customer') -> 'User':
        """Create a new user"""
        if not all([username, email, password, first_name, last_name]):
            raise ValueError("Missing required fields")
        
        if not cls.validate_email(email):
            raise ValueError("Invalid email format")
        
        is_valid, message = cls.validate_password(password)
        if not is_valid:
            raise ValueError(message)
        
        if cls.find_by_username(username) or cls.find_by_email(email):
            raise ValueError("Username or email already exists")
        
        password_hash = cls.hash_password(password)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, first_name, last_name, role, address, phone)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (username, email, password_hash, first_name, last_name, role, address, phone))
        
        user_data = cursor.fetchone()
        conn.commit()
        cursor.close()
        
        return cls(**user_data)
    
    @classmethod
    def find_by_id(cls, user_id: int) -> Optional['User']:
        """Find user by ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()
        cursor.close()
        
        if user_data:
            return cls(**user_data)
        return None
    
    @classmethod
    def find_by_username(cls, username: str) -> Optional['User']:
        """Find user by username"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user_data = cursor.fetchone()
        cursor.close()
        
        if user_data:
            return cls(**user_data)
        return None
    
    @classmethod
    def find_by_email(cls, email: str) -> Optional['User']:
        """Find user by email"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user_data = cursor.fetchone()
        cursor.close()
        
        if user_data:
            return cls(**user_data)
        return None
    
    @classmethod
    def authenticate(cls, username_or_email: str, password: str) -> Optional['User']:
        """Authenticate user with username/email and password"""
        user = cls.find_by_username(username_or_email)
        if not user:
            user = cls.find_by_email(username_or_email)
        
        if user and cls.verify_password(password, user.password_hash):
            return user
        return None
    
    def update_profile(self, first_name: Optional[str] = None, last_name: Optional[str] = None, 
                      address: Optional[str] = None, phone: Optional[str] = None) -> None:
        """Update user profile"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        update_fields = []
        update_values = []
        
        if first_name is not None:
            update_fields.append("first_name = %s")
            update_values.append(first_name)
            self.first_name = first_name
        
        if last_name is not None:
            update_fields.append("last_name = %s")
            update_values.append(last_name)
            self.last_name = last_name
        
        if address is not None:
            update_fields.append("address = %s")
            update_values.append(address)
            self.address = address
        
        if phone is not None:
            update_fields.append("phone = %s")
            update_values.append(phone)
            self.phone = phone
        
        if update_fields:
            update_values.append(self.id)
            query = f"""
                UPDATE users 
                SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """
            
            cursor.execute(query, update_values)
            conn.commit()
        
        cursor.close()
    
    def change_password(self, current_password: str, new_password: str) -> None:
        """Change user password"""
        if not self.verify_password(current_password, self.password_hash):
            raise ValueError("Current password is incorrect")
        
        is_valid, message = self.validate_password(new_password)
        if not is_valid:
            raise ValueError(message)
        
        new_password_hash = self.hash_password(new_password)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE users SET password_hash = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (new_password_hash, self.id))
        
        conn.commit()
        cursor.close()
        
        self.password_hash = new_password_hash
    
    def to_dict(self, include_sensitive: bool = False) -> Dict[str, Any]:
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'address': self.address,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_sensitive:
            data['password_hash'] = self.password_hash
        
        return data
    
    def __repr__(self):
        return f"<User {self.username}>"