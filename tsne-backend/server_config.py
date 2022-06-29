import os
from enum import Enum
from dataclasses import dataclass
from dotenv import load_dotenv
from common.disk_op_utils import DiskOpUtils
from typing import Optional, Union, Any

load_dotenv()


class EnvVariableType(Enum):
  STRING = 1
  INTEGER = 2
  POSITIVE_INTEGER = 3
  FLOAT = 4
  POSITIVE_FLOAT = 5
  FULL_DIR_PATH = 6


def get_env_variable(
    key: str,
    var_type: EnvVariableType,
    float_ndigits: Optional[int] = 2
) -> Union[None, str, int, float]:
  env_var: Any = DiskOpUtils.load_env_var_by_key(key=key)

  if env_var is None:
    return None
  if var_type == EnvVariableType.STRING:
    return env_var
  if var_type == EnvVariableType.INTEGER:
    return int(env_var)
  if var_type == EnvVariableType.POSITIVE_INTEGER:
    return abs(int(env_var))
  if var_type == EnvVariableType.FLOAT:
    return round(float(env_var), 2)
  if var_type == EnvVariableType.POSITIVE_FLOAT:
    return round(abs(float(env_var)), 2)
  if var_type == EnvVariableType.FULL_DIR_PATH:
    return DiskOpUtils.make_full_path(
        DiskOpUtils.get_root_path(),
        env_var
    )


@dataclass
class ServerConfig:
  host: str = get_env_variable(key="HOST", var_type=EnvVariableType.STRING)
  port: int = get_env_variable(key="PORT", var_type=EnvVariableType.INTEGER)
  api_version: int = get_env_variable(key="API_VERSION", var_type=EnvVariableType.INTEGER)
  tmp_dir_path: str = get_env_variable(key="TMP_DIRNAME", var_type=EnvVariableType.FULL_DIR_PATH)
