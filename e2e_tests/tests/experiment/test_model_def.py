import pytest

from tests import config as conf
from tests import experiment as exp

@pytest.mark.e2e_cpu
def test_fetch_experiment_model_def() -> None:
    experiment_id = exp.run_basic_test(
        conf.fixtures_path("no_op/single-one-short-step.yaml"),
        conf.fixtures_path("no_op"),
        1,
    )
    files = exp.fetch_model_def_tree(experiment_id).to_json()["files"]
    assert len(files) > 0
    file = files[0]
    exp.fetch_model_def_file(experiment_id, file["path"])