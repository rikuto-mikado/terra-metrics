import os
import time
import random
import requests
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env file (searches parent directories too)
load_dotenv(find_dotenv())

# Read API_URL strictly from environment variables (.env)
API_URL = os.getenv("API_URL")
if not API_URL:
    raise ValueError("Error: 'API_URL' is not set. Please define it in your .env file.")

INTERVAL_SECONDS = int(os.getenv("INTERVAL_SECONDS", "5"))


def get_work_sensor_data():
    return {
        "temperature": round(random.uniform(15.0, 30.0), 1),
        "humidity": round(random.uniform(40.0, 70.0), 1),
        "soil_moisture": round(random.uniform(20.0, 50.0), 1),
    }


def main():
    print(f"Edge sensor started. Sending to {API_URL} every {INTERVAL_SECONDS}s...")
    try:
        while True:
            data = get_work_sensor_data()
            try:
                response = requests.post(API_URL, json=data, timeout=5)
                print(f"[Edge] Sent: {data} -> Status {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"[Edge] Waiting for backend ({e.__class__.__name__})...")
            time.sleep(INTERVAL_SECONDS)
    except KeyboardInterrupt:
        print("\n[Edge] Stopped.")


if __name__ == "__main__":
    main()
