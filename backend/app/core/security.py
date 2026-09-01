import hmac
import hashlib
from typing import Optional
from app.core.config import settings

def tokenize_pii(value: Optional[str], salt: Optional[str] = None) -> str:
    """
    Layer 1 Governance: Deterministic, source-side tokenization using salted HMAC-SHA256.
    Ensures identical PII (e.g. Phone 9876543210 or Bank A/C 918230918234) produces the
    exact same 64-character token across distinct NCRP complaints to enable graph linkage,
    while ensuring unencrypted PII never leaves the authorized boundary.
    """
    if not value:
        return ""
    clean_val = str(value).strip().replace("-", "").replace(" ", "").upper()
    active_salt = (salt or settings.PII_HASH_SALT).encode("utf-8")
    token = hmac.new(active_salt, clean_val.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"TOK_{token[:16].upper()}_{token[-8:].upper()}"

def mask_display(value: Optional[str], kind: str = "account") -> str:
    """
    Masks PII for authorized officer display while keeping last 4 digits visible.
    """
    if not value:
        return ""
    clean = str(value).strip()
    if kind == "aadhaar":
        return f"XXXX-XXXX-{clean[-4:]}"
    elif kind == "phone":
        return f"+91 XXXXX {clean[-5:]}" if len(clean) >= 5 else f"XXXXX{clean}"
    elif kind == "ip":
        parts = clean.split(".")
        return f"{parts[0]}.{parts[1]}.*.*" if len(parts) == 4 else clean
    return f"XXXX-XXXX-{clean[-4:]}" if len(clean) >= 4 else clean
