"""
Signature micro-service
  POST /signature/create   → create empty signature
  POST /signature/validate → validate a signature dict
  POST /signature/save     → validate + write to disk
  POST /signature/merge    → merge patch into base
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path
from typing import Any
import uvicorn

from signature_builder import SignatureBuilder, SignatureValidationError

app = FastAPI(title="Signature Service", version="1.0.0")
builder = SignatureBuilder()


# ── request models ────────────────────────────────────────────────────────────

class CreateRequest(BaseModel):
    project_name: str = ""
    generated_by: str = "ai-router-runtime"


class ValidateRequest(BaseModel):
    signature: dict[str, Any]


class SaveRequest(BaseModel):
    signature: dict[str, Any]
    path: str = "output/signature.json"


class MergeRequest(BaseModel):
    base: dict[str, Any]
    patch: dict[str, Any]


# ── routes ────────────────────────────────────────────────────────────────────

@app.post("/signature/create")
def create(req: CreateRequest):
    sig = builder.create_empty_signature(
        project_name=req.project_name,
        generated_by=req.generated_by
    )
    return {"success": True, "data": sig}


@app.post("/signature/validate")
def validate(req: ValidateRequest):
    try:
        builder.validate(req.signature)
        return {"success": True, "valid": True}
    except SignatureValidationError as e:
        raise HTTPException(status_code=422, detail={"errors": e.args[0]})


@app.post("/signature/save")
def save(req: SaveRequest):
    try:
        out = builder.save(req.signature, req.path)
        return {"success": True, "saved_to": str(out)}
    except SignatureValidationError as e:
        raise HTTPException(status_code=422, detail={"errors": e.args[0]})


@app.post("/signature/merge")
def merge(req: MergeRequest):
    merged = builder.merge(req.base, req.patch)
    return {"success": True, "data": merged}


# ── entrypoint ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
