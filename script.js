// script.js

const apiKey = "live_skpnIwDlq5V9ajmdGoYbQUZ3Yku1k6BL2dsqP160rORTk8v5DVDh22yttnn0rPlV";
const apiUrl = "https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1";
const canvas = document.getElementById("processedCanvas");
const processingTimeElement = document.getElementById("processingTime");
const apiAccessCountElement = document.getElementById("apiAccessCount");

function processImage() {
  const startTime = new Date().getTime();

  fetch(apiUrl, {
    headers: {
      "x-api-key": apiKey
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("JSON from API:", data);

    const image = new Image();

    // Adăugăm un eveniment de încărcare pentru a ne asigura că imaginea este complet încărcată
    image.onload = () => {
      const context = canvas.getContext("2d");

      // Procesare pe jumătatea stângă a imaginii
      context.drawImage(image, 0, 0, image.width / 2, image.height, 0, 0, canvas.width / 2, canvas.height);

      // Convertirea la Gray-Scale
      const imageData = context.getImageData(0, 0, canvas.width / 2, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      context.putImageData(imageData, 0, 0);

      const endTime = new Date().getTime();
      const processingTime = endTime - startTime;
      console.log("Processing time:", processingTime, "ms");
      processingTimeElement.textContent = `Timp de procesare: ${processingTime} ms`;

      // Afiseaza numarul de accesari API
      apiAccessCountElement.textContent = `Numar de accesari API: ${data[0].access_count}`;
    };

    // Creăm o imagine locală pentru a evita problemele CORS
    const localImage = new Image();
    localImage.crossOrigin = "anonymous";
    localImage.src = "local_image.jpg"; // Numele imaginii locale

    // Setăm src după ce am adăugat evenimentul onload
    image.src = localImage.src;
  })
  .catch(error => {
    console.error("Error:", error);
  });
}
