from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Temporary in-memory storage for sightings (in a real app, use a database like SQLite or PostgreSQL)
sightings = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/sightings', methods=['GET'])
def get_sightings():
    return jsonify(sightings)

@app.route('/api/sightings', methods=['POST'])
def add_sighting():
    data = request.json
    
    # Expected data format: {"location": "Karlsplatz", "line": "U4", "time": "14:30"}
    if not data or not data.get("location") or not data.get("line") or not data.get("time"):
        return jsonify({"error": "Missing required fields"}), 400

    new_sighting = {
        "id": len(sightings) + 1,
        "location": data.get("location"),
        "line": data.get("line"),
        "time": data.get("time"),
        "status": "active"
    }
    sightings.append(new_sighting)
    return jsonify({"message": "Sighting added successfully", "sighting": new_sighting}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
