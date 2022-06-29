from flask import Flask
from flask_restful import Api, Resource
from server_config import ServerConfig
from server_initializer import ServerInitializer
from typing import Dict


def _make_full_api_path(config: ServerConfig, api_name: str) -> str:
  return f"/api/v{config.api_version}/{api_name}"


server_config: ServerConfig = ServerConfig()

server_initializer: ServerInitializer = ServerInitializer()
api_resources: Dict[str, Resource] = server_initializer.make_endpoints()

tsne_backend_server: Flask = Flask(__name__)
tsne_backend_server_api: Api = Api(tsne_backend_server)

for api_name, resource in api_resources.items():
  tsne_backend_server_api.add_resource(resource, _make_full_api_path(
      config=server_config,
      api_name=api_name
  ))

tsne_backend_server.run(host=server_config.host, port=server_config.port)
