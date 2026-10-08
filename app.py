from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)


@app.route("/ask", methods=["POST"])
def ask():

    data = request.json
    question = data.get("question", "")

    prompt = f"""
You are TouchGrass AI, a smart outdoor mission generator.

Create ONE personalized outdoor mission based on the user's information.

USER INFORMATION:
{question}

IMPORTANT:
- Generate a NEW activity every time.
- The activity must match the mood, time, budget and people.
- Do not always suggest a nature walk.
- The mission should be safe and realistic.
- Prefer free or low-cost activities.
- Do not invent specific events, businesses or clubs.

Return ONLY valid JSON.
Do not use markdown.
Do not write anything outside the JSON.

Use EXACTLY these keys:

{{
    "activity": "activity name",
    "duration": "available duration",
    "budget": "user budget",
    "people": "who they are with",
    "where": "general type of outdoor place",
    "why": "short reason",
    "challenge": "one fun phone-free outdoor challenge",
    "plan": [
        "step 1",
        "step 2",
        "step 3"
    ]
}}

Make sure EVERY key has a value.
The values for budget and people must match the user's information.
"""


    try:

        response = requests.post(
            "http://127.0.0.1:11434/api/generate",
            json={
                "model": "qwen3:4b",
                "prompt": prompt,
                "stream": False,
                "think": False,
                "format": "json",
                "options": {
                    "temperature": 0.8
                }
            },
            timeout=120
        )

        response.raise_for_status()

        result = response.json()

        answer = json.loads(result["response"])

        return jsonify(answer)


    except requests.RequestException as e:

        return jsonify({
            "error": f"AI server error: {str(e)}"
        }), 500


    except json.JSONDecodeError:

        return jsonify({
            "error": "AI returned invalid JSON."
        }), 500


if __name__ == "__main__":
    app.run(port=5050, debug=True)