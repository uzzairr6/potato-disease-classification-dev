import sqlite3
import os
import hashlib
import secrets
import base64

# Simple password hashing with salt using SHA256
def hash_password(password: str, salt: str = None) -> dict:
    """Hash password with salt using SHA256"""
    if salt is None:
        salt = secrets.token_hex(16)
    
    # Combine salt and password
    salted_password = salt + password
    # Hash with SHA256
    hash_result = hashlib.sha256(salted_password.encode('utf-8')).hexdigest()
    
    return {
        'hash': hash_result,
        'salt': salt
    }

def verify_password(password: str, salt: str, stored_hash: str) -> bool:
    """Verify password against stored hash and salt"""
    salted_password = salt + password
    computed_hash = hashlib.sha256(salted_password.encode('utf-8')).hexdigest()
    return computed_hash == stored_hash

class Database:
    def __init__(self, db_path=None):
        # Use data directory in Docker, current directory in development
        if db_path is None:
            import os
            if os.path.exists('/app/data'):
                self.db_path = '/app/data/users.db'
            else:
                self.db_path = 'users.db'
        else:
            self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        """Initialize database and create tables if they don't exist"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create users table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Check if salt column exists, if not alter table
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'salt' not in columns:
            cursor.execute('ALTER TABLE users ADD COLUMN salt TEXT')
            # Set default empty string for existing records
            cursor.execute('UPDATE users SET salt = "" WHERE salt IS NULL')
        
        conn.commit()
        conn.close()
    
    def create_user(self, email: str, password: str):
        """Create a new user with hashed password"""
        # Hash password with salt
        hashed_data = hash_password(password)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                "INSERT INTO users (email, password_hash, salt) VALUES (?, ?, ?)",
                (email, hashed_data['hash'], hashed_data['salt'])
            )
            conn.commit()
            user_id = cursor.lastrowid
        except sqlite3.IntegrityError:
            raise ValueError("User with this email already exists")
        finally:
            conn.close()
        
        return user_id
    
    def authenticate_user(self, email: str, password: str):
        """Authenticate user and return user ID if valid"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, password_hash, salt FROM users WHERE email = ?",
            (email,)
        )
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            return None
        
        user_id, stored_hash, salt = result
        
        # Handle transition from old hashes (without salt) to new system
        if not salt:  # Empty salt indicates old password hash
            # For now, reject authentication for old-style hashes
            # In production, you might want to rehash the password
            return None
        
        if verify_password(password, salt, stored_hash):
            return user_id
        
        return None
    
    def get_user(self, user_id: int):
        """Get user by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, email, created_at FROM users WHERE id = ?",
            (user_id,)
        )
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return {
                "id": result[0],
                "email": result[1],
                "created_at": result[2]
            }
        return None

# Global database instance
db = Database()