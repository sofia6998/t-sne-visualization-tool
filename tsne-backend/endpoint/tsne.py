import uuid
from flask_restful import Resource
from flask import request
from endpoint.api_response import ApiResponse
from endpoint.request_types import FileRequestParam
from server_config import ServerConfig
from common.disk_op_utils import DiskOpUtils
from common.tsne_wrapper import TsneParams, TsneWrapper
from common.logger import ServiceLogger
from common.deprecated import deprecated
from typing import Dict, Any, List


@deprecated(reason="Old TSNE method")
class Tsne(Resource):
  def __init__(self):
    self._logger: ServiceLogger = ServiceLogger(service_name=f"{self.__class__.__name__}Endpoint")

    self._dataset_file_req_param: FileRequestParam = FileRequestParam()
    self._dataset_file_req_param.field_name = "csv_file"
    self._dataset_file_req_param.required_extension = ".csv"

    self._required_fields: List[str] = [
      "n_components",
      "perplexity",
      "n_iter"
    ]

  def post(self):
    for req_field in self._required_fields:
      if not request.args.get(req_field):
        err_msg: str = f"Wrong request body: '{req_field}' is missing"
        self._logger.error(msg=err_msg)
        return ApiResponse.bad_request(error_msg=err_msg)

    req_files: Dict[str, Any] = request.files
    if self._dataset_file_req_param.field_name not in req_files:
      err_msg: str = f"Wrong request body: '{self._dataset_file_req_param.field_name}' is missing"
      self._logger.error(msg=err_msg)
      return ApiResponse.bad_request(error_msg=err_msg)

    server_config: ServerConfig = ServerConfig()

    csv_file: Any = req_files[self._dataset_file_req_param.field_name]
    if not csv_file:
      err_msg: str = "Wrong request: empty file"
      self._logger.error(msg=err_msg)
      return ApiResponse.bad_request(error_msg=err_msg)

    file_ext: str = DiskOpUtils.get_file_extension(filename=csv_file.filename)
    if file_ext != self._dataset_file_req_param.required_extension:
      err_msg: str = f"Wrong request: file is not in '{self._dataset_file_req_param.required_extension}' format"
      self._logger.error(msg=err_msg)
      return ApiResponse.bad_request(error_msg=err_msg)

    try:
      csv_filename: str = f"{str(uuid.uuid4())}{file_ext}"
      csv_file_path: str = DiskOpUtils.make_full_path(
          server_config.tmp_dir_path,
          csv_filename
      )
      csv_file.save(csv_file_path)
      self._logger.debug(msg=f"CSV file was saved in '{csv_file_path}'")

      tsne_params: TsneParams = TsneParams()
      tsne_params.n_components = int(request.args.get(self._required_fields[0]))
      tsne_params.perplexity = int(request.args.get(self._required_fields[1]))
      tsne_params.n_iter = int(request.args.get(self._required_fields[2]))
      tsne_wrapper: TsneWrapper = TsneWrapper(
          csv_file_path=csv_file_path,
          tsne_params=tsne_params
      )
      json_result: List[Dict[str, float]] = tsne_wrapper.fit_transform()

      DiskOpUtils.remove_file(file_path=csv_file_path)

      return json_result
    except Exception as err:
      err_msg: str = f"Something went wrong with request, error: '{str(err)}'"
      self._logger.error(msg=err_msg)
      DiskOpUtils.remove_file(file_path=csv_file_path)

      return ApiResponse.internal_server_error(error_msg=err_msg)
