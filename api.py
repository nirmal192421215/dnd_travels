import os
from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS

# Import the mock flight search function from the execution folder
from execution.search_flights import search_mock_flights

app = Flask(__name__)
# Enable CORS so your frontend can call this API
CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "service": "Travels Automation Web Service",
        "endpoints": {
            "/api/flights": "GET flight data (requires origin, destination, date)"
        }
    }), 200

@app.route('/api/flights', methods=['GET'])
def get_flights():
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    departure_date = request.args.get('date')
    return_date = request.args.get('return_date')

    # Validation
    if not origin or not destination or not departure_date:
        return jsonify({"error": "Missing required parameters: origin, destination, and date are required."}), 400
        
    if len(origin) != 3 or len(destination) != 3:
        return jsonify({"error": "Origin and Destination must be 3-letter IATA airport codes."}), 400

    try:
        datetime.strptime(departure_date, "%Y-%m-%d")
        if return_date:
            datetime.strptime(return_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Dates must be formatted as YYYY-MM-DD."}), 400

    try:
        flights = search_mock_flights(
            origin=origin.upper(),
            destination=destination.upper(),
            departure_date=departure_date,
            return_date=return_date
        )
        
        return jsonify({
            "search_criteria": {
                "origin": origin.upper(),
                "destination": destination.upper(),
                "departure_date": departure_date,
                "return_date": return_date,
                "timestamp": datetime.now().isoformat()
            },
            "status": "success",
            "results_count": len(flights),
            "flights": flights
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
