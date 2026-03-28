const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const video = document.getElementById("video");

let stream;
let intervalId;



startBtn.onclick = async () => {
  try {

    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    console.log("Camera on");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  intervalId = setInterval(async () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const res = await fetch("http://127.0.0.1:8000/detect", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.detected) {
        console.log("Animal detected:", data.animal);

        clearInterval(intervalId);
        stream.getTracks().forEach(track => track.stop());

        alert(`Animal detected: ${data.animal}`);
      }
    } catch (err) {
      console.error("API Error:", err);
    }

  }, 1000);
  } catch (err) {
    console.error("Camera Access Error:", err);
    alert("Camera access failed: " + err.message);
  }
};

endBtn.onclick = () => {
  if (stream) {
    clearInterval(intervalId);
    
    stream.getTracks().forEach(track => track.stop());
    
    video.srcObject = null;
    
    stream = null;
    
    console.log("Camera on");
    alert("Camera off!");
  } else {
    alert("Camera is off");
  }
};
