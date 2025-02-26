
from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# Load your Twitter API Bearer Token (store this in an environment variable)
TWITTER_BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAGr%2FzQEAAAAAFs%2BerSGsiJA4dhsFgLo7RRu7BCM%3DElyvsUH4H41atNGiLJVUHI1ZcKKFLXzCTdJ2yTbMtmOjYL9EEI"

def get_twitter_username(twitter_id):
    url = f"https://api.twitter.com/2/users/{twitter_id}"
    headers = {"Authorization": f"Bearer {TWITTER_BEARER_TOKEN}"}

    try:
        response = requests.get(url, headers=headers)

        # Handle rate limit error
        if response.status_code == 429:
            return "abcd"
        elif response.status_code == 500:
            return "pqrs"

        response.raise_for_status()  # Raise an error for 4xx/5xx responses

        data = response.json()
        return data.get("data", {}).get("username", "Unknown")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching Twitter username: {e}")
        return "abcd"

@app.route("/api/twitter-username", methods=["GET"])
def twitter_username():
    twitter_id = request.args.get("twitterId")

    if not twitter_id:
        return jsonify({"error": "Missing twitterId"}), 400

    username = get_twitter_username(twitter_id)
    return jsonify({"username": username})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
