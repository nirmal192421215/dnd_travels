#!/usr/bin/env python3
"""
Execution Script: Search Flights
Deterministic script to search flights between origins and destinations on specified dates.
Outputs results to output/flights.json.
"""

import argparse
import sys
import os
import json
from datetime import datetime

# Attempt to load dotenv for local development environment variables, fallback gracefully if not installed
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

def log(msg, level="INFO"):
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    levels = {"DEBUG": 0, "INFO": 1, "WARNING": 2, "ERROR": 3}
    if levels.get(level.upper(), 1) >= levels.get(log_level, 1):
        print(f"[{level}] {msg}")

def search_mock_flights(origin, destination, departure_date, return_date=None):
    """
    Returns mock flight data based on input parameters.
    In a real scenario, this would query a flight service API (e.g. Amadeus/Skyscanner).
    """
    log(f"Searching flights from {origin} to {destination} on {departure_date}...", "DEBUG")
    
    # Simple algorithm to generate reproducible mock flights based on characters of inputs
    base_price = 150 + (ord(origin[0]) + ord(destination[0])) % 200
    
    flights = [
        {
            "flight_number": "TR-101",
            "carrier": "Antigravity Air",
            "origin": origin,
            "destination": destination,
            "departure_time": f"{departure_date}T08:30:00",
            "arrival_time": f"{departure_date}T11:45:00",
            "duration_minutes": 195,
            "price_usd": base_price,
            "stops": 0
        },
        {
            "flight_number": "TR-202",
            "carrier": "Sola Airways",
            "origin": origin,
            "destination": destination,
            "departure_time": f"{departure_date}T14:15:00",
            "arrival_time": f"{departure_date}T19:50:00",
            "duration_minutes": 335,
            "price_usd": int(base_price * 0.85),
            "stops": 1
        },
        {
            "flight_number": "TR-303",
            "carrier": "Apex Travel",
            "origin": origin,
            "destination": destination,
            "departure_time": f"{departure_date}T18:00:00",
            "arrival_time": f"{departure_date}T20:45:00",
            "duration_minutes": 165,
            "price_usd": int(base_price * 1.3),
            "stops": 0
        }
    ]
    
    # Sort flights by price
    flights.sort(key=lambda x: x["price_usd"])
    return flights

def main():
    parser = argparse.ArgumentParser(description="Deterministic Flight Search Executor")
    parser.add_argument("--origin", required=True, help="3-letter airport code (e.g., NYC)")
    parser.add_argument("--destination", required=True, help="3-letter airport code (e.g., LON)")
    parser.add_argument("--departure-date", required=True, help="Departure date YYYY-MM-DD")
    parser.add_argument("--return-date", help="Return date YYYY-MM-DD (optional)")
    args = parser.parse_args()

    # Inputs validation
    if len(args.origin) != 3 or len(args.destination) != 3:
        print("Error: Origin and Destination must be 3-letter IATA airport codes.", file=sys.stderr)
        sys.exit(2)
        
    try:
        datetime.strptime(args.departure_date, "%Y-%m-%d")
        if args.return_date:
            datetime.strptime(args.return_date, "%Y-%m-%d")
    except ValueError:
        print("Error: Dates must be formatted as YYYY-MM-DD.", file=sys.stderr)
        sys.exit(2)

    try:
        output_dir = os.getenv("OUTPUT_DIR", "./output")
        os.makedirs(output_dir, exist_ok=True)
        
        # Verify API configuration if available
        api_key = os.getenv("TRAVEL_API_KEY")
        if not api_key:
            log("TRAVEL_API_KEY not found. Operating in simulation mode with mock data.", "WARNING")
        else:
            log("TRAVEL_API_KEY loaded. Operating in live API search mode (simulated endpoint).", "INFO")
            
        # Search flights
        flights = search_mock_flights(
            origin=args.origin.upper(),
            destination=args.destination.upper(),
            departure_date=args.departure_date,
            return_date=args.return_date
        )
        
        output_path = os.path.join(output_dir, "flights.json")
        result = {
            "search_criteria": {
                "origin": args.origin.upper(),
                "destination": args.destination.upper(),
                "departure_date": args.departure_date,
                "return_date": args.return_date,
                "timestamp": datetime.now().isoformat()
            },
            "status": "success",
            "results_count": len(flights),
            "flights": flights
        }
        
        with open(output_path, "w") as f:
            json.dump(result, f, indent=2)
            
        log(f"Search successful. Saved results to {output_path}", "INFO")
        print(json.dumps({"success": True, "output_file": output_path, "results_count": len(flights)}))
        sys.exit(0)

    except Exception as e:
        print(f"Error executing flight search: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
