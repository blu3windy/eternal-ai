from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/index.html', methods=['GET'])
def handle_prompt():
    try:
        return "OK", 200
    except Exception as e:
        print(traceback.format_exc())
        return str(e), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True) 