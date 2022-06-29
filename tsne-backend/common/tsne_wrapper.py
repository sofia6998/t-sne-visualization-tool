import pandas as pd
import numpy as np
from dataclasses import dataclass
from sklearn.manifold import TSNE
from common.logger import ServiceLogger
from typing import Dict, List


@dataclass
class TsneParams:
  init: str = "pca"
  learning_rate: str = "auto"
  n_components: int = 2
  verbose: int = 1
  perplexity: int = 40
  n_iter: int = 300


class TsneWrapper:
  def __init__(self, csv_file_path: str, tsne_params: TsneParams):
    self._logger = ServiceLogger(service_name=self.__class__.__name__)

    self._csv_file_path: str = csv_file_path
    self._tsne = TSNE(
        init=tsne_params.init,
        learning_rate=tsne_params.learning_rate,
        n_components=tsne_params.n_components,
        verbose=tsne_params.verbose,
        perplexity=tsne_params.perplexity,
        n_iter=tsne_params.n_iter
    )

    self._logger.debug(msg="TSNE initialized with params:")
    self._logger.debug(msg=f" - init method: {tsne_params.init}")
    self._logger.debug(msg=f" - n components: {tsne_params.n_components}")
    self._logger.debug(msg=f" - learning rate: {tsne_params.learning_rate}")
    self._logger.debug(msg=f" - verbose: {tsne_params.verbose}")
    self._logger.debug(msg=f" - perplexity: {tsne_params.perplexity}")
    self._logger.debug(msg=f" - n iterations: {tsne_params.n_iter}")

  def _read_csv_as_df(self) -> pd.DataFrame:
    self._logger.debug(msg=f"Read '{self._csv_file_path}' as dataframe...")
    df: pd.DataFrame = pd.read_csv(
      filepath_or_buffer=self._csv_file_path,
      header=None,
      engine="c",
      dtype='float32'
    )
    self._logger.debug(msg="Dropping NaN columns from dataframe...")
    df.dropna(axis=1, inplace=True)

    return df

  def _df_to_numpy(self, df: pd.DataFrame) -> np.ndarray:
    self._logger.debug(msg=f"Transform '{self._csv_file_path}' dataframe to numpy array...")
    return df.to_numpy()

  def _run_fit_transform(self, X: np.ndarray) -> np.ndarray:
    self._logger.debug(msg="Fit-transform TSNE...")
    return self._tsne.fit_transform(X=X)

  @staticmethod
  def _transform_handler(row: np.ndarray) -> Dict[str, float]:
    assert len(row) == 2
    return {"x": float(row[0]), "y": float(row[1])}

  def _transform_output_to_json(self, result: np.ndarray) -> List[Dict[str, float]]:
    self._logger.debug(msg="Transform TSNE result to JSON...")

    result_json: List[Dict[str, float]] = list(map(
        lambda row: self._transform_handler(row=row),
        result
    ))

    return result_json

  def fit_transform(self) -> List[Dict[str, float]]:
    df: pd.DataFrame = self._read_csv_as_df()
    X: np.ndarray = self._df_to_numpy(df=df)
    result: np.ndarray = self._run_fit_transform(X=X)

    return self._transform_output_to_json(result=result)
