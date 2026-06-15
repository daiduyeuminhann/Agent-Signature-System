const BASE = process.env.SIGNATURE_SERVICE_URL ?? "http://localhost:8000";

async function post(path, body) {
  const res  = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json?.detail ?? json));
  return json;
}

export const createSignature  = (projectName) =>
  post("/signature/create", { project_name: projectName }).then(r => r.data);

export const mergeSignature   = (base, patch) =>
  post("/signature/merge",  { base, patch }).then(r => r.data);

export const saveSignature    = (signature, path = "output/signature.json") =>
  post("/signature/save",   { signature, path });

export const validateSignature = (signature) =>
  post("/signature/validate", { signature });