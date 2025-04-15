import asyncio
from idun_guardian_sdk import GuardianClient
from status_server import update_status  # ✅ Import from status_server.py

async def main():
    client = GuardianClient()
    await client.search_device()  # This connects to the selected device
    update_status(True)  # ✅ Update status to connected
    battery_level = await client.check_battery()
    print(f"Battery Level: {battery_level}%")
    await client.stream_impedance(mains_freq_60hz=False)

    # (Optional) Disconnect logic or cleanup can go here
    # update_status(False)

asyncio.run(main())
