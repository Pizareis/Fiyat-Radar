import numpy as np

from app.core.config import settings


def detect_anomaly(price_history: list[float]) -> tuple[bool, float, str]:
    """Rolling z-score on pct changes. price_history must end with the newest price.

    Returns (is_anomaly, zscore, direction).
    """
    window = settings.anomaly_window_size
    if len(price_history) < window + 1:
        return False, 0.0, ""

    recent = np.array(price_history[-(window + 1) :])
    pct_changes = np.diff(recent) / recent[:-1]

    baseline = pct_changes[:-1]
    latest_change = pct_changes[-1]

    std = baseline.std()
    if std == 0:
        return False, 0.0, ""

    zscore = (latest_change - baseline.mean()) / std
    is_anomaly = abs(zscore) >= settings.anomaly_zscore_threshold
    direction = "spike" if zscore > 0 else "drop"
    return is_anomaly, float(zscore), direction
