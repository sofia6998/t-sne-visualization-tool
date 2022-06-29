import os
import shutil
import glob
import checksumdir
from common.logger import ServiceLogger
from typing import List, Optional, IO, Any, Callable

_logger = ServiceLogger(service_name="DiskOpUtils")


class DiskOpUtils:
  @staticmethod
  def load_env_var_by_key(key: str) -> Optional[str]:
    return os.environ.get(key)

  @staticmethod
  def get_root_path() -> str:
    return os.getcwd()

  @staticmethod
  def make_full_path(root_path: str, *other_paths: str) -> str:
    return os.path.join(root_path, *other_paths)

  @staticmethod
  def get_path_basename(path: str) -> str:
    return os.path.basename(path)

  @staticmethod
  def get_file_extension(filename: str) -> str:
    return os.path.splitext(filename)[1]

  @staticmethod
  def get_filename_without_extension(filename: str) -> str:
    return os.path.splitext(filename)[0]

  @staticmethod
  def make_directory(folder_path: str) -> Optional[str]:
    try:
      os.mkdir(folder_path)
      _logger.debug(f"Directory created: '{folder_path}'")
      return folder_path
    except Exception as e:
      _logger.error(str(e))
      return None

  @staticmethod
  def list_directory(folder_path: str) -> List[str]:
    try:
      return os.listdir(folder_path)
    except Exception as e:
      _logger.error(str(e))
      return []

  @staticmethod
  def copy_folder(
      src_folder_path: str,
      dest_folder_path: str,
      patterns_to_ignore: List[str] = []
  ) -> Optional[str]:
    try:
      shutil.copytree(
          src=src_folder_path,
          dst=dest_folder_path,
          ignore=shutil.ignore_patterns(*patterns_to_ignore)
      )
      _logger.debug(f"Folder copied: '{src_folder_path}' => '{dest_folder_path}'")
      return dest_folder_path
    except Exception as e:
      _logger.error(str(e))
      return None

  @staticmethod
  def is_file_exists(file_path: str) -> bool:
    return os.path.exists(path=file_path)

  @staticmethod
  def copy_file(src_file_path: str, dest_file_path: str) -> Optional[str]:
    try:
      shutil.copyfile(src=src_file_path, dst=dest_file_path)
      _logger.debug(f"File copied: '{src_file_path}' => '{dest_file_path}'")
      return dest_file_path
    except Exception as e:
      _logger.error(str(e))
      return None

  @staticmethod
  def work_with_file(file_path: str, mode: str, work_func: Callable[[IO[Any]], None]) -> bool:
    try:
      with open(file_path, mode) as f:
        work_func(f)
      return True
    except Exception as e:
      _logger.error(str(e))
      return False

  @staticmethod
  def remove_directory(folder_path: str) -> bool:
    try:
      shutil.rmtree(path=folder_path)
      _logger.debug(f"Directory removed: '{folder_path}'")
      return True
    except Exception as e:
      _logger.error(str(e))
      return False

  @staticmethod
  def remove_file(file_path: str) -> bool:
    try:
      os.remove(file_path)
      _logger.debug(f"File removed: '{file_path}'")
      return True
    except Exception as e:
      _logger.error(str(e))
      return False

  @staticmethod
  def create_hash_for_directory(folder_path: str) -> str:
    _logger.debug(f"Create hash from '{folder_path}' directory")
    return checksumdir.dirhash(folder_path)

  @staticmethod
  def find_dir_files_with_extension(folder_path: str, extension: str) -> List[str]:
    _logger.debug(f"Find '{extension}' files in '{folder_path}'")
    all_files_from_dir: List[str] = os.listdir(folder_path)
    files_with_ext: List[str] = list(filter(lambda f_name: f_name.endswith(extension), all_files_from_dir))
    _logger.debug(f"Found '{len(files_with_ext)}' files.")
    return files_with_ext
