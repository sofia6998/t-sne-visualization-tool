import logging


class ServiceLogger:
  def __init__(self, service_name: str):
    logging.basicConfig(
        format="%(asctime)s:%(levelname)s - %(message)s",
        level=logging.DEBUG,
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    self._service_name: str = service_name

  def debug(self, msg: str) -> None:
    logging.debug(f"{self._service_name}: {msg}")

  def info(self, msg: str) -> None:
    logging.info(f"{self._service_name}: {msg}")

  def error(self, msg: str) -> None:
    logging.error(f"{self._service_name}: {msg}")

  def warning(self, msg: str) -> None:
    logging.warning(f"{self._service_name}: {msg}")
