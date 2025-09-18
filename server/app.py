from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
from dotenv import load_dotenv

# Import routes
from routes.auth import auth_bp
from models.database import init_db

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # Database configuration
    app.config['DATABASE_URL'] = os.getenv('DATABASE_URL', 'postgresql://username:password@localhost/electronics_shop')
    
    # Initialize extensions
    CORS(app, origins=['http://localhost:3000', 'https://your-frontend-domain.com'])
    jwt = JWTManager(app)
    
    # Initialize database
    init_db(app.config['DATABASE_URL'])
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Electronics Shop Auth API is running'}
    
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')