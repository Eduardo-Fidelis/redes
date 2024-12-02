let autoTestInterval;

document.getElementById("startTest").addEventListener("click", () => {
    startTest();
});

document.getElementById("autoTest").addEventListener("click", () => {
    if (autoTestInterval) {
        clearInterval(autoTestInterval);
        autoTestInterval = null;
        document.getElementById("autoTest").textContent = "Medição Automática";
    } else {
        autoTestInterval = setInterval(startTest, 5000);  // 5000 ms = 5 segundos
        document.getElementById("autoTest").textContent = "Parar Medição Automática";
    }
});

function startTest() {
    const downloadFileUrl = "https://tse3.mm.bing.net/th?id=OIG3.mOUCkdd8DzU12n3FfCs2&pid=ImgGn"; // URL de download
    const uploadFileBlob = new Blob(["A".repeat(10 * 1024 * 1024)]); // Arquivo fictício de 10MB para upload
    const fileSizeInBytes = 102400; // Aproximadamente 100 KB

    const statusElement = document.getElementById("status");
    const resultElement = document.getElementById("result");
    const container = document.querySelector(".container");

    statusElement.textContent = "Testando velocidade de download...";
    resultElement.textContent = "";

    // Limites de velocidade (Mbps)
    const goodSpeedLimit = 20;  // Boa conexão (> 20 Mbps)
    const mediumSpeedLimit = 5; // Conexão mediana (entre 5 Mbps e 20 Mbps)

    // Teste de Download
    const startDownloadTime = new Date().getTime();
    fetch(downloadFileUrl)
        .then(response => response.blob())
        .then(() => {
            const endDownloadTime = new Date().getTime();
            const durationDownload = (endDownloadTime - startDownloadTime) / 1000;
            const downloadSpeedMbps = ((fileSizeInBytes * 8) / (1024 * 1024)) / durationDownload;

            statusElement.textContent = "Testando velocidade de upload...";

            // Teste de Upload
            const startUploadTime = new Date().getTime();
            fetch("https://httpbin.org/post", {
                method: "POST",
                body: uploadFileBlob,
            })
                .then(() => {
                    const endUploadTime = new Date().getTime();
                    const durationUpload = (endUploadTime - startUploadTime) / 1000;
                    const uploadSpeedMbps = ((10 * 1024 * 1024 * 8) / (1024 * 1024)) / durationUpload;

                    statusElement.textContent = "Testando ping e jitter...";

                    // Teste de Ping e Jitter
                    testPingAndJitter().then(({ ping, jitter }) => {
                        statusElement.textContent = "Teste concluído!";

                        // Definir a cor da borda de acordo com a velocidade
                        if (downloadSpeedMbps >= goodSpeedLimit && uploadSpeedMbps >= goodSpeedLimit) {
                            container.style.border = "2px solid green"; // Borda verde (boa conexão)
                        } else if (downloadSpeedMbps >= mediumSpeedLimit && uploadSpeedMbps >= mediumSpeedLimit) {
                            container.style.border = "2px solid yellow"; // Borda amarela (conexão mediana)
                        } else {
                            container.style.border = "2px solid red"; // Borda vermelha (conexão ruim)
                        }

                        // Exibir os resultados
                        resultElement.innerHTML = `
                            <p><span>Velocidade de Download:</span> ${downloadSpeedMbps.toFixed(2)} Mbps</p>
                            <p><span>Velocidade de Upload:</span> ${uploadSpeedMbps.toFixed(2)} Mbps</p>
                            <p><span>Ping:</span> ${ping.toFixed(2)} ms</p>
                            <p><span>Jitter:</span> ${jitter.toFixed(2)} ms</p>
                        `;
                    });
                })
                .catch(() => {
                    statusElement.textContent = "Erro ao realizar o teste de upload.";
                });
        })
        .catch(() => {
            statusElement.textContent = "Erro ao realizar o teste de download.";
        });
}

// Função para testar Ping e Jitter
async function testPingAndJitter() {
    const numPings = 10;
    const server = "wss://echo.websocket.org"; // Servidor WebSocket para teste
    const pingTimes = [];

    return new Promise((resolve, reject) => {
        const ws = new WebSocket(server);

        ws.onopen = () => {
            let count = 0;

            const sendPing = () => {
                const startTime = performance.now();
                ws.send("ping");
                ws.onmessage = () => {
                    const endTime = performance.now();
                    pingTimes.push(endTime - startTime);
                    count++;
                    if (count < numPings) {
                        sendPing();
                    } else {
                        ws.close();
                        const ping = pingTimes.reduce((a, b) => a + b, 0) / pingTimes.length; // Média
                        const jitter = Math.sqrt(
                            pingTimes
                                .map(time => Math.pow(time - ping, 2))
                                .reduce((a, b) => a + b, 0) / pingTimes.length
                        ); // Desvio padrão
                        resolve({ ping, jitter });
                    }
                };
            };

            sendPing();
        };

        ws.onerror = () => {
            reject("Erro ao conectar ao servidor de WebSocket.");
        };
    });
}
let logs = []; // Array para armazenar os resultados

// Atualizar a função startTest com lógica de cores e exibição em "results"
function startTest() {
    const downloadFileUrl = "https://tse3.mm.bing.net/th?id=OIG3.mOUCkdd8DzU12n3FfCs2&pid=ImgGn";
    const uploadFileBlob = new Blob(["A".repeat(10 * 1024 * 1024)]);
    const fileSizeInBytes = 102400;

    const statusElement = document.getElementById("status");
    const resultElement = document.getElementById("result");

    statusElement.textContent = "Testando velocidade de download...";
    resultElement.textContent = "";

    const startDownloadTime = new Date().getTime();
    fetch(downloadFileUrl)
        .then(response => response.blob())
        .then(() => {
            const endDownloadTime = new Date().getTime();
            const durationDownload = (endDownloadTime - startDownloadTime) / 1000;
            const downloadSpeedMbps = ((fileSizeInBytes * 8) / (1024 * 1024)) / durationDownload;

            statusElement.textContent = "Testando velocidade de upload...";
            const startUploadTime = new Date().getTime();
            fetch("https://httpbin.org/post", {
                method: "POST",
                body: uploadFileBlob,
            })
                .then(() => {
                    const endUploadTime = new Date().getTime();
                    const durationUpload = (endUploadTime - startUploadTime) / 1000;
                    const uploadSpeedMbps = ((10 * 1024 * 1024 * 8) / (1024 * 1024)) / durationUpload;

                    statusElement.textContent = "Testando ping e jitter...";
                    testPingAndJitter().then(({ ping, jitter }) => {
                        statusElement.textContent = "Teste concluído!";

                        // Adicione os resultados ao log
                        const result = {
                            downloadSpeed: downloadSpeedMbps,
                            uploadSpeed: uploadSpeedMbps,
                            ping,
                            jitter,
                            timestamp: new Date().toLocaleString(),
                        };

                        logs.push(result);
                        if (logs.length > 10) logs.shift();

                        // Exibir resultados na div "results"
                        updateResults(result);

                        // Atualizar log no modal
                        updateLog();
                    });
                });
        });
}

// Função para atualizar resultados na tela com cores
function updateResults(result) {
    const resultElement = document.getElementById("result");
    const { downloadSpeed, uploadSpeed, ping, jitter } = result;

    // Determinar a cor com base na velocidade de download
    let color;
    if (downloadSpeed >= 40) color = "green";
    else if (downloadSpeed >= 25) color = "yellow";
    else color = "red";

    resultElement.style.color = color;
    resultElement.innerHTML = `
        <strong>Resultados do Teste:</strong><br>
        Download: ${downloadSpeed.toFixed(2)} Mbps<br>
        Upload: ${uploadSpeed.toFixed(2)} Mbps<br>
        Ping: ${ping.toFixed(2)} ms<br>
        Jitter: ${jitter.toFixed(2)} ms
    `;
}

// Atualizar log no modal
function updateLog() {
    const logList = document.getElementById("logList");
    logList.innerHTML = logs
        .map(
            log => `
            <li>
                <strong>${log.timestamp}</strong><br>
                Download: ${log.downloadSpeed.toFixed(2)} Mbps, 
                Upload: ${log.uploadSpeed.toFixed(2)} Mbps, 
                Ping: ${log.ping.toFixed(2)} ms, 
                Jitter: ${log.jitter.toFixed(2)} ms
            </li>`
        )
        .join("");
}

// Gerenciar o modal
const logModal = document.getElementById("logModal");
const logButton = document.getElementById("logButton");
const closeButton = document.querySelector(".close");

logButton.addEventListener("click", () => {
    logModal.style.display = "block";
});

closeButton.addEventListener("click", () => {
    logModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === logModal) {
        logModal.style.display = "none";
    }
});

function updateResults(result) {
    const resultElement = document.getElementById("result");
    const colorBox = document.getElementById("color-box");
    const { downloadSpeed, uploadSpeed, ping, jitter } = result;

    // Determinar a cor com base na velocidade de download
    let color;
    if (downloadSpeed >= 80) color = "green";
    else if (downloadSpeed >= 8) color = "yellow";
    else color = "red";

    colorBox.style.backgroundColor = color;

    resultElement.innerHTML = `
        <strong>Resultados do Teste:</strong><br>
        Download: ${downloadSpeed.toFixed(2)} Mbps<br>
        Upload: ${uploadSpeed.toFixed(2)} Mbps<br>
        Ping: ${ping.toFixed(2)} ms<br>
        Jitter: ${jitter.toFixed(2)} ms
    `;
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
          console.log('Falha ao registrar o Service Worker:', error);
        });
    });
  }

  document.getElementById('fetchIpInfo').addEventListener('click', () => {
    const token = 'e60d0ed8eb6b70';
    const apiUrl = `https://ipinfo.io/json?token=${token}`;
    const resultsDiv = document.getElementById('ipinfo-results');

    resultsDiv.innerHTML = "Buscando informações do IP...";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const { ip, city, region, country, org, loc } = data;
            resultsDiv.innerHTML = `
                <p><strong>IP:</strong> ${ip}</p>
                <p><strong>Localização:</strong> ${city}, ${region}, ${country}</p>
                <p><strong>Organização:</strong> ${org}</p>
                <p><strong>Coordenadas:</strong> ${loc}</p>
            `;
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
        });
});

document.getElementById('startTest').addEventListener('click', () => {
    performTest();
});



if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration.scope);
        })
        .catch((error) => {
            console.error('Falha ao registrar o Service Worker:', error);
        });
}
