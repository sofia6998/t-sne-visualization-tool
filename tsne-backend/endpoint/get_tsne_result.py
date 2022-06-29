import json
from flask import request
from flask_restful import Resource
from endpoint.api_response import ApiResponse
from common.disk_op_utils import DiskOpUtils
from common.logger import ServiceLogger
from typing import List, Optional


class GetTsneResult(Resource):
  def __init__(self):
    self._logger: ServiceLogger = ServiceLogger(service_name=f"{self.__class__.__name__}Endpoint")

    self._required_fields: List[str] = [
        "json_file_path"
    ]

  def get(self):
    for req_field in self._required_fields:
      if not request.args.get(req_field):
        err_msg: str = f"Wrong request body: '{req_field}' is missing"
        self._logger.error(msg=err_msg)
        return ApiResponse.bad_request(error_msg=err_msg)

    try:
      json_file_path: str = str(request.args.get(self._required_fields[0]))

      if not DiskOpUtils.is_file_exists(file_path=json_file_path):
        err_msg: str = f"File '{json_file_path}' is not exists yet"
        self._logger.error(msg=err_msg)
        return ApiResponse.bad_request(error_msg=err_msg)

      json_data: Optional[str] = None
      with open(json_file_path, "r") as f:
        json_data = json.load(f)

      response = ApiResponse(code=200, status="OK", message="success")
      response.add_one_field(key="json_result", value=json_data)

      return response.own_api_response()
    except Exception as err:
      err_msg: str = f"Error: {str(err)}"
      self._logger.error(msg=err_msg)
      return ApiResponse.bad_request(error_msg=err_msg)
