from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import os

# Securely get API key from environment variable
API_KEY = os.getenv("AIzaSyA4f1LK9oMxH5HPEDzeu0JGJGVMHYs8e5A")
if not API_KEY:
    raise ValueError("❌ ERROR: GEMINI_API_KEY is not set in environment variables.")

genai.configure(api_key=API_KEY)

app = Flask(__name__)

# Home page route
@app.route("/")
def home():
    return render_template("app.html")

# Chatbot API route
@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"reply": "Please enter a message."})

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content("what is difference between college and university")
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
