import os
from flask import Flask, jsonify, request
from datetime import datetime


app = Flask(__name__)

# Basic metadata (optional)
START_TIME = datetime.utcnow().isoformat() + "Z"

@app.route("/health", methods=["GET"])
def health():
    """Simple health check used by CI smoke tests."""
    return jsonify({"status": "ok", "started_at": START_TIME}), 200

@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Electronics Shop API (skeleton)"}), 200

@app.route("/products", methods=["GET"])
def products():
    """
    In-memory paginated products endpoint (for local tests & demos).

    Query params:
      - page (int) default 1
      - per_page (int) default 10 (max 100)
    Response:
      {
        "items": [...],
        "meta": { "page": 1, "per_page": 10, "total": 100, "total_pages": 10 }
      }
    """
    # sample dataset (1..100)
    sample_products = [{"id": i, "name": f"Product {i}", "price": i * 10} for i in range(1, 101)]

    # Parse params with safe defaults
    try:
        page = int(request.args.get("page", 1))
    except (TypeError, ValueError):
        page = 1
    try:
        per_page = int(request.args.get("per_page", 10))
    except (TypeError, ValueError):
        per_page = 10

    if page < 1:
        page = 1
    per_page = max(1, min(100, per_page))

    total = len(sample_products)
    start = (page - 1) * per_page
    end = start + per_page
    items = sample_products[start:end]
    total_pages = (total + per_page - 1) // per_page

    return jsonify({
        "items": items,
        "meta": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": total_pages
        }
    }), 200

if __name__ == "__main__":
    host = os.environ.get("ENV_HOST", "0.0.0.0")
    port = int(os.environ.get("ENV_PORT", 5000))
    debug = os.environ.get("ENV_DEBUG", "False").lower() in ("1", "true", "yes")
    app.run(host=host, port=port, debug=debug)