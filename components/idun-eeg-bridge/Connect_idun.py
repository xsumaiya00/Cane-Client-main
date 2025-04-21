import asyncio
import json
from idun_guardian_sdk import GuardianClient

STATUS_FILE = "bluetooth_status.json"

def update_status(connected: bool):
    with open(STATUS_FILE, "w") as f:
        json.dump({"connected": connected}, f)

async def main():
    client = GuardianClient()

    try:
        device_address = await client.search_device()
        await client.connect_device()  # No args needed if already selected

        update_status(True)
        print("🔄 Updated status to True")

        battery_level = await client.check_battery()
        print(f"Battery Level: {battery_level}%")

        await client.stream_impedance(mains_freq_60hz=False)

    except Exception as e:
        print("Error:", e)

    finally:
        update_status(False)
        print("🔻 Updated status to False")

asyncio.run(main())
