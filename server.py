from flask import Flask, request, jsonify, send_from_directory
import serial
import time

app = Flask(__name__, static_folder=".", static_url_path="")

# ==== Serial config – adjust if needed ====
SERIAL_PORT = "/dev/tty.usbmodem201301"  # <- change if your port name is different
BAUDRATE = 9600                          # you said baud is 9600

ser = None

def init_serial():
    """Open the serial port to the SAMD21 board."""
    global ser
    try:
        ser = serial.Serial(SERIAL_PORT, BAUDRATE, timeout=1)
        print(f"Opened serial port {SERIAL_PORT} at {BAUDRATE}")
    except Exception as e:
        print("Could not open serial port:", e)
        ser = None

# Try opening once at startup
init_serial()

# Simple in-memory status for the LED/mode
current_status = {
    "mode": "OFF"  # OFF, ON, SOS, HTMAA, STAY
}

def send_to_board(message: str):
    """
    Send a single line command to the board.
    Automatically tries to reopen the serial port if it's closed.
    """
    global ser
    if ser is None or not ser.is_open:
        print("Serial not available, trying to reopen...")
        init_serial()

    if ser is None or not ser.is_open:
        print("Still no serial connection, dropping:", message)
        return

    line = (message.strip() + "\n").encode("utf-8")
    ser.write(line)
    ser.flush()
    print("Sent to board:", message)

# ===== Routes =====

@app.route("/")
def index():
    # Serve the UI page
    return send_from_directory(".", "Light_UI.html")

@app.route("/api/command", methods=["POST"])
def api_command():
    """
    Expects JSON like: { "command": "ON" }
    Allowed commands: ON, OFF, SOS, HTMAA, STAY
    """
    data = request.get_json(force=True) or {}
    command = data.get("command", "").upper()

    if command not in ["ON", "OFF", "SOS", "HTMAA", "STAY"]:
        return jsonify({"error": "Unknown command"}), 400

    # Update status
    current_status["mode"] = command

    # Send to board over serial
    send_to_board(command)

    return jsonify({"ok": True, "status": current_status})

@app.route("/api/status", methods=["GET"])
def api_status():
    """Return current mode so the UI can show it."""
    return jsonify(current_status)

if __name__ == "__main__":
    # Run on http://127.0.0.1:8080/
    app.run(host="0.0.0.0", port=8080, debug=True)
