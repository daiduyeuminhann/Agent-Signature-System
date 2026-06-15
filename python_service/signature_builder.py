import json
import re
from datetime import datetime, timezone
from pathlib import Path


SCHEMA_PATH = Path(__file__).parent / "signature_schema.json"


class SignatureValidationError(Exception):
    pass


class SignatureBuilder:

    def __init__(self):
        with open(SCHEMA_PATH, "r") as f:
            self._schema = json.load(f)

    # ─────────────────────────────────────────
    # PUBLIC API
    # ─────────────────────────────────────────

    def create_empty_signature(
        self,
        project_name: str = "",
        generated_by: str = "ai-router-runtime"
    ) -> dict:
        """
        Return a blank signature that matches signature_schema.json.
        All fields are set to their zero-value equivalents.
        """
        now = datetime.now(timezone.utc).isoformat()

        return {
            "$schema_version": self._schema.get("$schema_version", "1.0"),

            "metadata": {
                "project_name": project_name,
                "generated_at": now,
                "updated_at": now,
                "generated_by": generated_by,
                "confidence": 0.0
            },

            "project": {
                "summary": "",
                "goals": []
            },

            "business": {
                "actors": [],
                "flows": [],
                "constraints": []
            },

            "architecture": {
                "style": "",
                "domains": [],
                "components": []
            },

            "domain_model": {
                "entities": [],
                "relationships": []
            },

            "rules": [],

            "decisions": [],

            "risks": [],

            "known_facts": [],

            "unknowns": [],

            "next_actions": []
        }

    def validate(self, signature: dict) -> dict:
        """
        Validate a signature dict against signature_schema.json rules.
        Raises SignatureValidationError with a list of problems if invalid.
        Returns the (unchanged) signature if valid.
        """
        errors = []

        # ── top-level keys ──────────────────────────────────────────
        required_top = [
            "metadata", "project", "business",
            "architecture", "domain_model", "rules",
            "decisions", "risks", "known_facts",
            "unknowns", "next_actions"
        ]
        for key in required_top:
            if key not in signature:
                errors.append(f"Missing top-level key: '{key}'")

        if errors:
            raise SignatureValidationError(errors)

        # ── metadata ────────────────────────────────────────────────
        meta = signature.get("metadata", {})
        for field in ["project_name", "generated_at", "updated_at",
                      "generated_by", "confidence"]:
            if field not in meta:
                errors.append(f"metadata.{field} is required")

        if "confidence" in meta:
            c = meta["confidence"]
            if not isinstance(c, (int, float)) or not (0.0 <= c <= 1.0):
                errors.append(
                    f"metadata.confidence must be a float in [0, 1], got {c!r}"
                )

        for dt_field in ["generated_at", "updated_at"]:
            val = meta.get(dt_field)
            if val and not self._is_iso_datetime(val):
                errors.append(
                    f"metadata.{dt_field} must be an ISO-8601 datetime, got {val!r}"
                )

        # ── typed list sections ──────────────────────────────────────
        list_of_str_paths = [
            ("project", "goals"),
            ("business", "actors"),
            ("business", "flows"),
            ("business", "constraints"),
            ("architecture", "domains"),
            ("architecture", "components"),
            ("domain_model", "entities"),
            ("domain_model", "relationships"),
        ]
        for parent, child in list_of_str_paths:
            val = signature.get(parent, {}).get(child)
            if val is not None and not self._is_list_of_str(val):
                errors.append(
                    f"{parent}.{child} must be a list of strings"
                )

        # root-level string arrays
        for key in ["rules", "known_facts", "unknowns", "next_actions"]:
            val = signature.get(key)
            if val is not None and not self._is_list_of_str(val):
                errors.append(f"'{key}' must be a list of strings")

        # ── decisions ───────────────────────────────────────────────
        decisions = signature.get("decisions", [])
        if not isinstance(decisions, list):
            errors.append("'decisions' must be a list")
        else:
            for i, d in enumerate(decisions):
                for f in ["id", "decision", "reason"]:
                    if f not in d:
                        errors.append(f"decisions[{i}] missing field '{f}'")

        # ── risks ───────────────────────────────────────────────────
        risks = signature.get("risks", [])
        if not isinstance(risks, list):
            errors.append("'risks' must be a list")
        else:
            for i, r in enumerate(risks):
                for f in ["name", "impact"]:
                    if f not in r:
                        errors.append(f"risks[{i}] missing field '{f}'")

        if errors:
            raise SignatureValidationError(errors)

        return signature

    def save(self, signature: dict, path: str | Path) -> Path:
        """
        Validate then write the signature to a JSON file.
        Returns the resolved Path.
        """
        self.validate(signature)

        out = Path(path)
        out.parent.mkdir(parents=True, exist_ok=True)

        with open(out, "w", encoding="utf-8") as f:
            json.dump(signature, f, indent=2, ensure_ascii=False)

        return out

    def merge(self, base: dict, patch: dict) -> dict:
        """
        Shallow-merge patch into base, updating 'updated_at'.
        Lists are replaced (not appended) by patch values.
        Returns a new dict.
        """
        merged = json.loads(json.dumps(base))   # deep copy via JSON

        for key, value in patch.items():
            if (
                key in merged
                and isinstance(merged[key], dict)
                and isinstance(value, dict)
            ):
                merged[key] = {**merged[key], **value}
            else:
                merged[key] = value

        if "metadata" in merged:
            merged["metadata"]["updated_at"] = (
                datetime.now(timezone.utc).isoformat()
            )

        return merged

    # ─────────────────────────────────────────
    # PRIVATE HELPERS
    # ─────────────────────────────────────────

    @staticmethod
    def _is_list_of_str(value) -> bool:
        return (
            isinstance(value, list)
            and all(isinstance(item, str) for item in value)
        )

    @staticmethod
    def _is_iso_datetime(value: str) -> bool:
        _ISO_RE = re.compile(
            r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}"
        )
        return bool(_ISO_RE.match(str(value)))
