from flask import jsonify
from typing import Dict, Union, Any


class ApiResponse:
  def __init__(self, code: int, status: str, message: str):
    self._code = code
    self._status = status
    self._message = message

    self._aditional_fields: Dict[str, Any] = {}

  @staticmethod
  def success(message: str) -> Dict[str, Union[str, int]]:
    return jsonify({
        "code": 200,
        "status": "OK",
        "message": message
    })

  @staticmethod
  def bad_request(error_msg: str) -> Dict[str, Union[str, int]]:
    return jsonify({
        "code": 400,
        "status": "Bad request",
        "message": error_msg
    })

  @staticmethod
  def unauthorized(error_msg: str) -> Dict[str, Union[str, int]]:
    return jsonify({
        "code": 401,
        "status": "Unauthorized",
        "message": error_msg
    })

  @staticmethod
  def internal_server_error(error_msg: str) -> Dict[str, Union[str, int]]:
    return jsonify({
        "code": 500,
        "status": "Internal server error",
        "message": error_msg
    })

  def add_one_field(self, key: str, value: Any) -> None:
    self._aditional_fields[key] = value

  def add_many_fields(self, resp_fields: Dict[str, Any]) -> None:
    self._aditional_fields = {**self._aditional_fields, **resp_fields}

  def own_api_response(self) -> Dict[str, Union[str, int]]:
    response_data = {
        "code": self._code,
        "status": self._status,
        "message": self._message,
    }

    return jsonify({**response_data, **self._aditional_fields})
