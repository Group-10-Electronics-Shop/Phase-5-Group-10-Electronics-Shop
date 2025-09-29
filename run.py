import os
from server.app import create_app

config_name = os.environ.get('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == "__main__":
    app.run(debug=(config_name=='development'), host="0.0.0.0", port=5000)
