from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# curl -X POST http://localhost:8000/inference -H "Content-Type: application/json" -d '{"input": "test"}'
@app.route("/inference", methods=["POST"])
def dummy_inference():
    """Dummy endpoint for model inference"""
    data = request.get_json()
    dummy_response = {
        "status": "success",
        "message": "Dummy inference endpoint.",
        "image_url": "https://i.imgur.com/UR1lC1V.png",
    }
    
    return jsonify(dummy_response), 200



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
