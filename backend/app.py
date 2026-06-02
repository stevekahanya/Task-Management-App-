from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models.models import db
from config.config import config
from routes.auth_routes import auth_bp
from routes.task_routes import tasks_bp
from routes.tag_routes import tags_bp
import os


def create_app(config_name=None):
    app = Flask(__name__)

    config_name = config_name or os.environ.get('FLASK_ENV', 'default')
    app.config.from_object(config[config_name])

    # Extensions
    db.init_app(app)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    app.register_blueprint(tags_bp, url_prefix='/api/tags')

    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'TaskFlow API running'}, 200

    return app


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
