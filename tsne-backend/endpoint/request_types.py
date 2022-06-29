from dataclasses import dataclass


@dataclass
class FileRequestParam:
  field_name: str = ''
  required_extension: str = ''
