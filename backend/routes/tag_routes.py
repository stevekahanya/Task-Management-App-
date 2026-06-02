from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.models import db, Tag

tags_bp = Blueprint('tags', __name__)


@tags_bp.route('/', methods=['GET'])
@jwt_required()
def get_tags():
    tags = Tag.query.all()
    return jsonify({'tags': [t.to_dict() for t in tags]}), 200


@tags_bp.route('/', methods=['POST'])
@jwt_required()
def create_tag():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'Tag name is required'}), 400

    if Tag.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Tag already exists'}), 409

    tag = Tag(name=data['name'], color=data.get('color', '#6366f1'))
    db.session.add(tag)
    db.session.commit()
    return jsonify({'tag': tag.to_dict(), 'message': 'Tag created'}), 201


@tags_bp.route('/<int:tag_id>', methods=['PUT'])
@jwt_required()
def update_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    data = request.get_json()
    if 'name' in data:
        tag.name = data['name']
    if 'color' in data:
        tag.color = data['color']
    db.session.commit()
    return jsonify({'tag': tag.to_dict()}), 200


@tags_bp.route('/<int:tag_id>', methods=['DELETE'])
@jwt_required()
def delete_tag(tag_id):
    tag = Tag.query.get_or_404(tag_id)
    db.session.delete(tag)
    db.session.commit()
    return jsonify({'message': 'Tag deleted'}), 200
