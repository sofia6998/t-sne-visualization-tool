from flask_restful import Resource
from common.logger import ServiceLogger
from endpoint.ping import Ping
from endpoint.run_tsne import RunTsne
from endpoint.get_tsne_result import GetTsneResult
from typing import Dict


class ServerInitializer:
  def __init__(self):
    self._logger = ServiceLogger(service_name=self.__class__.__name__)

  def make_endpoints(self) -> Dict[str, Resource]:
    self._logger.debug(msg="make_endpoints")
    return {
      "ping": Ping,
      "run_tsne": RunTsne,
      "get_tsne_result": GetTsneResult,
    }
