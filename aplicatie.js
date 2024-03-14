// Functie pentru preluarea JSON-ului asincron
async function fetchJSON(jsonPath) 
{
    const response = await fetch(jsonPath);
    const jsonData = await response.json();
    return jsonData;
}

// Functie pentru afisarea componentelor JSON in browser
function displayJSONInfo(jsonData) 
{
    const jsonInfoDiv = document.getElementById('json-info');
    const htmlString = `
        <p>Message: ${jsonData.message}</p>
        <p>Status: ${jsonData.status}</p>
    `;
    jsonInfoDiv.innerHTML = htmlString;
}

// Functie pentru desenarea imaginii originale pe canvas 
async function drawImageOnOriginalCanvas(imageURL) 
{
    return new Promise((resolve, reject) => {
        const canvas = document.getElementById('original-canvas');
        const context = canvas.getContext('2d');
        const image = new Image();

        image.crossOrigin = "anonymous";

        image.onload = () => {
            console.log('Original image loaded successfully');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve();
        };

        image.onerror = (error) => {
            console.error('Error loading original image:', error);
            reject(error);
        };

        image.src = imageURL;
    });
}

// Functie pentru desenarea si procesarea imaginii pe canvas-ul procesat
async function processAndDisplayImage(imageURL) {
    const canvas = document.getElementById('processed-canvas');
    const context = canvas.getContext('2d');
    canvas.style.display = 'none';

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageURL;

    image.onload = async () => {
        console.log('Processing image');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        await convertToGrayScale(canvas);
        mirrorImage(canvas);
        canvas.style.display = 'block';
    };

    image.onerror = (error) => {
        console.error('Error processing image:', error);
    };
}

// Listener pentru butonul de procesare
document.getElementById('process-button').addEventListener('click', async () => {
    try {
        const jsonData = await fetchJSON("aplicatie.json");
        displayJSONInfo(jsonData);
        await measureExecutionTime(() => drawImageOnOriginalCanvas(jsonData.message), 'Afișare imagine originală');
        await measureExecutionTime(() => processAndDisplayImage(jsonData.message), 'Aplicare mirror & tonuri gri');
    } catch (error) {
        console.error('Error processing image:', error);
    }
});

// Functie pentru conversia imaginii la scala de gri
async function convertToGrayScale(canvas) {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        let gray = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        pixels[i] = gray;
        pixels[i + 1] = gray;
        pixels[i + 2] = gray;
    }

    context.putImageData(imageData, 0, 0);
}

// Functie pentru aplicarea efectului de oglinda
function mirrorImage(canvas) {
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width / 2; x++) {
            const index = (y * width + x) * 4;
            const mirrorIndex = (y * width + (width - x - 1)) * 4;
            for (let c = 0; c < 4; c++) {
                const temp = pixels[index + c];
                pixels[index + c] = pixels[mirrorIndex + c];
                pixels[mirrorIndex + c] = temp;
            }
        }
    }

    context.putImageData(imageData, 0, 0);
}

// Functie pentru măsurarea timpului de execuție
async function measureExecutionTime(asyncFunc, stageName) {
    const startTime = performance.now();
    await asyncFunc();
    const endTime = performance.now();
    const execTime = `${stageName} executed in ${endTime - startTime} milliseconds`;

    // Afisarea timpului pe pagina
    const execTimeDiv = document.getElementById('execution-time');
    execTimeDiv.innerText = execTime;

    // Afisarea timpului in consola
    console.log(execTime);
}


// Initializarea si încarcarea imaginii originale la deschiderea paginii
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const jsonData = await fetchJSON("aplicatie.json");
        displayJSONInfo(jsonData);
        await measureExecutionTime(() => drawImageOnOriginalCanvas(jsonData.message), 'Afișare imagine originală');
    } catch (error) {
        console.error('Error loading initial image:', error);
    }
});

// Listener pentru butonul de procesare
document.getElementById('process-button').addEventListener('click', async () => {
    try {
        const jsonData = await fetchJSON("aplicatie.json");
        await measureExecutionTime(() => processAndDisplayImage(jsonData.message), 'Aplicare mirror & tonuri gri');
    } catch (error) {
        console.error('Error processing image:', error);
    }
});

// Listener pentru butonul care duce la pagina  Contact
document.getElementById('contact-button').addEventListener('click', () => {
    window.location.href = 'contact.html'; 
});