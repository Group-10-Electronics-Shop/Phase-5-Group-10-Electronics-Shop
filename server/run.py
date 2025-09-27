"""
Production-ready Flask application runner
"""

import os
from server.app import create_app
from server.config import config_by_name

# Get the environment from environment variable
config_name = os.environ.get('FLASK_ENV', 'production')

# Create the Flask application
app = create_app(config_name)

if __name__ == '__main__':
    # For development, use the built-in server
    if config_name == 'development':
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        # For production, this will be handled by a WSGI server like Gunicorn
        app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

        