from fastapi import FastAPI
import uvicorn

app = FastAPI()
bluetooth_status = {"connected": False}

@app.get("/status")
def get_status():
    return bluetooth_status

def update_status(connected: bool):
    bluetooth_status["connected"] = connected

# Run it
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
