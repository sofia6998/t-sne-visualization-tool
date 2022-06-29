from common.tsne_wrapper import TsneParams, TsneWrapper
from common.logger import ServiceLogger
from typing import List, Dict, Any


logger = ServiceLogger(service_name="test_image_analyzer")
DATA_FOlDER = "/Users/sofianagavkina/WebstormProjects/ITMO/tsne-visualization-tool/static-server/data/"
TMP_FOLDER: str = "tmp"

R_PATTERN_NET: List[str] = list(map(
    lambda index: f"r_digits{index}",
    [6, 10, 20, 30, 40, 45, 50, 60]
))

PATTERN_NET: List[str] = list(map(
    lambda index: f"digits{index}",
    [81, 75, 63, 53, 44]
))

IMG_FEATURES_NAMES: List[str] = [*PATTERN_NET]


def run_tsne(name: str):
    features_path: str = DATA_FOlDER + f"{name}.csv"

    tsne_params: TsneParams = TsneParams()
    tsne_wrapper: TsneWrapper = TsneWrapper(
        csv_file_path=features_path,
        tsne_params=tsne_params
    )

    result: List[Dict[str, float]] = tsne_wrapper.fit_transform()

    x_coords: List[float] = []
    y_coords: List[float] = []
    f: Any = open(DATA_FOlDER + name + "_dots.csv", "w")
    i: int = 0
    for row in result:
        x_coords.append(row["x"])
        y_coords.append(row["y"])
        f.write(str(row["x"]) + "," + str(row["y"]) + "\n")
        i += 1

    f.close()


if __name__ == "__main__":
    for f_name in IMG_FEATURES_NAMES:
        run_tsne(name=f_name)
