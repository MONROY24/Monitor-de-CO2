// Pega la MISMA URL de implementación de Apps Script aquí
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFkhLcmCfYPXD5_PfPwN_3ZG0RZfpVtxMy6TnN3YaK2RMMFweI0-0etUTsf09EGlVy9g/exec";

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("co2-chart")) {
        fetchChartData();
    }
});

function fetchChartData() {
    const loadingEl = document.getElementById("loading-charts");

    fetch(GOOGLE_SCRIPT_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la red");
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos para gráficos:", data);
            loadingEl.style.display = "none";

            const labels = data.map(row => new Date(row.Timestamp).toLocaleString());
            const co2Data = data.map(row => Number(row.CO2_PPM).toFixed(2));
            const tempData = data.map(row => Number(row.Temperatura).toFixed(1));
            const humData = data.map(row => Number(row.Humedad).toFixed(1));

            // Obtenemos los colores de las variables CSS
            const style = getComputedStyle(document.body);
            const co2BorderColor = style.getPropertyValue('--chart-co2-border').trim();
            const co2BgColor = style.getPropertyValue('--chart-co2-background').trim();
            const tempBorderColor = style.getPropertyValue('--chart-temp-border').trim();
            const tempBgColor = style.getPropertyValue('--chart-temp-background').trim();
            const humBorderColor = style.getPropertyValue('--chart-hum-border').trim();
            const humBgColor = style.getPropertyValue('--chart-hum-background').trim();

            createChart('co2-chart', 'Niveles de CO2 (ppm)', labels, co2Data, co2BorderColor, co2BgColor);
            createChart('temp-chart', 'Temperatura (°C)', labels, tempData, tempBorderColor, tempBgColor);
            createChart('hum-chart', 'Humedad (%)', labels, humData, humBorderColor, humBgColor);
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
            loadingEl.textContent = "Error al cargar los datos. Revisa la consola.";
            loadingEl.style.color = "red";
        });
}

function createChart(canvasId, chartLabel, labels, data, borderColor, backgroundColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: data,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 2,
                fill: true,
                tension: 0.3 // Ligera curvatura para un look más suave
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: false
                },
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 15
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--color-text-dark').trim() // Color de leyenda
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo del tooltip más oscuro
                    titleColor: '#fff',
                    bodyColor: '#fff'
                }
            }
        }
    });
}