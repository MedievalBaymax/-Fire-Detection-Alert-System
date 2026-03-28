import cv2
from ultralytics import YOLO
import datetime

# Load your trained model
model = YOLO(r"C:\Users\mohit\runs\detect\train\weights\best.pt")

cap = cv2.VideoCapture(0)

print("🔥 Fire Detection Started (LOCAL MODEL)...")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Camera Error")
        break

    frame = cv2.resize(frame, (640, 480))

    # Run inference locally
    results = model(frame)[0]

    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        confidence = float(box.conf[0]) * 100
        cls = int(box.cls[0])

        label = f"{model.names[cls]} {confidence:.2f}%"

        # Draw box
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv2.putText(frame, label, (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                    (0, 0, 255), 2)

        print(f"{label} DETECTED")

        # Save image
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"fire_detected_{timestamp}.jpg"
        cv2.imwrite(filename, frame)

    cv2.imshow("Fire Detection (Local)", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("Program Terminated.")