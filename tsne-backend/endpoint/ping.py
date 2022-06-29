from flask_restful import Resource
from endpoint.api_response import ApiResponse


class Ping(Resource):
  def get(self):
    return ApiResponse.success(message="Pong")
