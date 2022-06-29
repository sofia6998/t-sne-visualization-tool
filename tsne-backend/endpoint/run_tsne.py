from flask_restful import Resource
from threading import Thread
from common.disk_op_utils import DiskOpUtils
from common.logger import ServiceLogger
from server_config import ServerConfig
from endpoint.api_response import ApiResponse
from common.run_tsne_process import run_tsne_process
from typing import List


class RunTsne(Resource):
  def __init__(self):
    self._logger: ServiceLogger = ServiceLogger(service_name=f"{self.__class__.__name__}Endpoint")
    self._config: ServerConfig = ServerConfig()
    self._f_extension: str = '.csv'

  def post(self):
    found_csv_files: List[str] = DiskOpUtils.find_dir_files_with_extension(
        folder_path=self._config.tmp_dir_path,
        extension=self._f_extension
    )

    if not found_csv_files or not len(found_csv_files):
      err_msg: str = f"No .csv files in '{self._config.tmp_dir_path}'"
      self._logger.error(msg=err_msg)
      return ApiResponse.bad_request(error_msg=err_msg)

    csv_filename: str = found_csv_files[0]
    csv_file_path: str = DiskOpUtils.make_full_path(
        self._config.tmp_dir_path,
        csv_filename
    )

    json_file_path: str = DiskOpUtils.make_full_path(
        self._config.tmp_dir_path,
        f"{DiskOpUtils.get_filename_without_extension(filename=csv_filename)}.json"
    )

    self._logger.debug(msg=f"Run TSNE on '{csv_file_path}' file...")
    tsne_thread: Thread = Thread(
        target=run_tsne_process,
        args=(csv_file_path, json_file_path,)
    )
    tsne_thread.start()

    response = ApiResponse(code=200, status="OK", message="success")
    response.add_one_field(key="csv_file", value=csv_file_path)
    response.add_one_field(key="json_file", value=json_file_path)

    return response.own_api_response()
