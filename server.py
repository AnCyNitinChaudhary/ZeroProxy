from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import io
from PIL import Image
import json
app = Flask(__name__)

# Load known faces
print("Loading known faces...")
rahi_image = face_recognition.load_image_file("9921103145.jpg")
rahi_face_encoding = face_recognition.face_encodings(rahi_image)[0]

biden_image = face_recognition.load_image_file("9921103163.jpg")
biden_face_encoding = face_recognition.face_encodings(biden_image)[0]

known_face_encodings = [rahi_face_encoding, biden_face_encoding]
known_face_names = ["9921103145", "9921103163"]
print("Known faces loaded.")

@app.route('/validate', methods=['POST'])
def validate_image():
    print("Received request for validation.")
    if 'image' not in request.files:
        print("No image file found in the request.")
        return jsonify({"error": "No image file found in the request"}), 400

    file = request.files['image']
    print(f"Received image file: {file.filename}")

    try:
        # Read image from request
        image_stream = io.BytesIO(file.read())
        image = Image.open(image_stream)

        # Convert to RGB format
        if image.mode != 'RGB':
            image = image.convert('RGB')

        image = np.array(image)
    except Exception as e:
        print(f"Error processing the image file: {e}")
        return jsonify({"error": "Error processing the image file"}), 400

    print("Image file successfully read and converted to RGB.")

    # Perform face recognition
    try:
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]

            if name != "Unknown":
                face_names.append(name)
            if len(face_names) > 0:
                break

        print(f"Face recognition completed. Detected faces: {face_names}")

        output_json = json.dumps({"face_name": face_names if face_names else ['1234567890']})
        return output_json

    except Exception as e:
        print(f"Error during face recognition: {e}")
        return jsonify({"error": "Error during face recognition"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
