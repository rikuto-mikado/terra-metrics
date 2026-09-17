# terra-metrics

## Project Overview

`terra-metrics` is a lightweight environmental monitoring system designed for agricultural applications. It periodically collects environmental metrics—such as ambient temperature, relative humidity, and soil moisture—to aggregate statistics and visualize agricultural indicators.

This project uses a monorepo architecture that unifies physical data acquisition on edge devices (Raspberry Pi), persistent storage and API processing on the backend, and visualization on a frontend dashboard.

> **Note:** Hardware sensors and physical edge devices are not connected in the current phase. The system architecture is fully constructed and verified using Python-based mock data generators.

---

## Objectives & Scope

The primary objective of the initial phase is to establish a robust and reliable data pipeline on a minimal scale:

- **Data Ingestion**: Fixed-point observations dispatched 3 times daily (Morning, Afternoon, Night) from edge devices to the backend API.
- **Statistics & Analytics**: Establishing foundations to calculate meaningful agricultural indices (e.g., Vapor Pressure Deficit / VPD, environmental stress scores) and trend visualizations rather than simply listing raw time-series records.
- **Small Start**: Complex device actuation (e.g., automated watering/solenoid valves) and real-time streaming protocols are intentionally kept out of scope for now. The focus is strictly on completing the core HTTP cycle: **Capture -> Store -> Analyze -> Visualize**.

---

## System Architecture & Tech Stack

The system is organized into three distinct tiers:

### 1. Edge (Data Acquisition & Ingestion)

- **Target Device**: Raspberry Pi (Simulated locally for development)
- **Language**: Python
- **Planned Sensors**:
  - BME280 (Temperature, Humidity, Barometric Pressure)
  - Capacitive Soil Moisture Sensor
- **Role**: Scheduled data acquisition (via cron/timers) dispatched to the backend API via HTTP POST. Simulates sensor readings with mock telemetry until physical hardware is deployed.

### 2. Backend (API & Persistence)

- **Language / Framework**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (running in Docker container)
- **Role**: Validates incoming edge payloads, stores records in PostgreSQL, derives indices, and exposes statistical REST endpoints for the frontend.

### 3. Frontend (Dashboard)

- **Language / Framework**: React, Vite, TypeScript
- **Styling**: Tailwind CSS (v4)
- **Role**: Visualizes historical trends, current readings, and key indices through UI charts and summary cards.

---

## Directory Structure

```text
terra-metrics/
├── docs/                # Project design and specification documents
├── frontend/            # Dashboard UI (Vite + React + Tailwind CSS)
├── backend/             # API server (Express + TypeScript)
├── edge/                # Data simulation and sensor scripts (Python)
└── docker-compose.yml   # Database and service container definitions
```
