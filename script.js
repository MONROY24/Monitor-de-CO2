// Pega la MISMA URL de implementación de Apps Script aquí
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFkhLcmCfYPXD5_PfPwN_3ZG0RZfpVtxMy6TnN3YaK2RMMFweI0-0etUTsf09EGlVy9g/exec";

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});

function fetchData() {
    const loadingEl = document.getElementById("loading");
    const tableBody = document.getElementById("table-body");

    fetch(GOOGLE_SCRIPT_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta de la red");
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);
            loadingEl.style.display = "none"; // Ocultar mensaje de carga
            tableBody.innerHTML = ""; // Limpiar tabla

            // Los datos de Google Apps Script a veces vienen en orden de ingreso
            // Invertirlos para mostrar el más reciente primero
            data.reverse();

            // Poblar la tabla
            data.forEach(rowData => {
                const tr = document.createElement("tr");
                
                // Formatear el timestamp para que sea legible
                const timestamp = new Date(rowData.Timestamp).toLocaleString();

                tr.innerHTML = `
                    <td>${timestamp}</td>
                    <td>${Number(rowData.CO2_PPM).toFixed(2)}</td>
                    <td>${Number(rowData.Temperatura).toFixed(1)}</td>
                    <td>${Number(rowData.Humedad).toFixed(1)}</td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
            loadingEl.textContent = "Error al cargar los datos. Revisa la consola.";
            loadingEl.style.color = "red";
        });
}