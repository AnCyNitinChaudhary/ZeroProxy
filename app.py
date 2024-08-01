import sys
import face_recognition
import cv2
import numpy as np
import json

rahi_image = face_recognition.load_image_file("9921103145.jpg")
rahi_face_encoding = face_recognition.face_encodings(rahi_image)[0]

biden_image = face_recognition.load_image_file("9921103163.jpg")
biden_face_encoding = face_recognition.face_encodings(biden_image)[0]

known_face_encodings = [
    rahi_face_encoding,
    biden_face_encoding
]
known_face_names = [
    "9921103145",
    "9921103163"
]
video_capture = cv2.VideoCapture(0)

for i in range(1):
    ret, frame = video_capture.read()
    face_locations = face_recognition.face_locations(frame)
    # print(face_locations)
    face_encodings = face_recognition.face_encodings(frame, face_locations)

    face_names = []
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        # print(matches)
        name = "Unknown"
        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]
        
        if(name!="Unknown"):
            face_names.append(name)
        if(len(face_names)>0):
            break
    output_json = json.dumps({"face_name": face_names})
    if(len(face_names)<1):
        face_names.append('1234567890')
    print(output_json, flush=True)  


