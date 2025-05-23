from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Get Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app)

# Preset questions and answers
PRESET_QA = {
    "what is dte emis": "DTE EMIS is the Directorate of Technical Education's Education Management Information System. Visit the official portal at https://emis.dtemaharashtra.gov.in/.",
    "how do i log in to dte emis": "Go to https://emis.dtemaharashtra.gov.in/ and use your assigned credentials to log in.",
    "where can i find the user manual": "The user manual is available on the DTE EMIS portal under the 'Help' or 'Documentation' section.",
    "who can i contact for support": "For support, contact the DTE EMIS helpdesk at emis.support@dtemaharashtra.gov.in.",
    "what is the official website for dte emis": "The official website is https://emis.dtemaharashtra.gov.in/."
}

genai.configure(api_key=GEMINI_API_KEY)

def get_gemini_response(message: str) -> str:
    """Get a concise response from Gemini AI for the given message."""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        prompt = (
            "You are a helpful assistant for the DTE EMIS government portal (https://emis.dtemaharashtra.gov.in/). "
            "Answer in 1-2 sentences, briefly and concisely: " + message
        )
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return "Sorry, I couldn't answer that at the moment. Please try again later."

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat endpoint for DTE EMIS government portal assistant."""
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "No message provided."}), 400

    message = data['message'].strip()
    normalized = message.lower()
    preset_answer = PRESET_QA.get(normalized)

    # Prefer preset answer, otherwise use Gemini
    if preset_answer:
        response = preset_answer
    else:
        response = get_gemini_response(message)

    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
