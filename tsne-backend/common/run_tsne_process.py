import json
from common.tsne_wrapper import TsneParams, TsneWrapper
from common.disk_op_utils import DiskOpUtils
from common.logger import ServiceLogger
from typing import List, Dict, IO, Any


def run_tsne_process(in_file_path: str, out_file_path: str) -> None:
  _logger: ServiceLogger = ServiceLogger(service_name="run_tsne_process")
  _logger.debug(msg=f"Running on '{in_file_path}'...")

  try:
    tsne_params: TsneParams = TsneParams()
    tsne_wrapper: TsneWrapper = TsneWrapper(
        csv_file_path=in_file_path,
        tsne_params=tsne_params
    )
    json_result: List[Dict[str, float]] = tsne_wrapper.fit_transform()

    def _write_to_json_file(f: IO[Any]) -> None:
      json.dump(json_result, f, indent=2)

    DiskOpUtils.work_with_file(
        file_path=out_file_path,
        mode="w",
        work_func=_write_to_json_file
    )
    _logger.debug(msg=f"Success running TSNE, result path: {out_file_path}")
  except Exception as err:
    _logger.error(msg=f"Error: {str(err)}")
    return
