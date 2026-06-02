from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.models import db, User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Username, email, and password are required'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409

    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'message': 'User registered successfully',
        'token': access_token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({'user': user.to_dict()}), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWT is stateless; client deletes the token
    return jsonify({'message': 'Logged out successfully'}), 200
