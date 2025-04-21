from fastapi import FastAPI
import uvicorn
import json
import os

app = FastAPI()

STATUS_FILE = "bluetooth_status.json"

def read_status():
    if os.path.exists(STATUS_FILE):
        with open(STATUS_FILE, "r") as f:
            return json.load(f)
    return {"connected": False}

@app.get("/status")
def get_status():
    status = read_status()
    print("📡 /status →", status)
    return status

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
