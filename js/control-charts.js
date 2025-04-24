// control-charts.js - Script para generar gráficos de control para Serviwash del Llano

// Datos simulados basados en el análisis estadístico previo
const controlChartData = {
    // Datos para el gráfico X-barra
    xbar: {
        subgroups: [1, 2, 3, 4, 5, 6, 7, 8],
        values: [25.03, 26.40, 25.72, 25.84, 24.67, 24.22, 25.71, 25.95],
        ucl: 29.55,  // Límite Superior de Control
        cl: 25.44,   // Línea Central
        lcl: 21.34   // Límite Inferior de Control
    },
    
    // Datos para el gráfico de Rango
    range: {
        subgroups: [1, 2, 3, 4, 5, 6, 7, 8],
        values: [6.63, 6.93, 6.46, 7.16, 4.09, 11.78, 5.70, 8.19],
        ucl: 15.05,  // Límite Superior de Control
        cl: 7.12,    // Línea Central
        lcl: 0.00    // Límite Inferior de Control
    },
    
    // Información adicional
    specs: {
        lsl: 20,     // Límite Inferior de Especificación
        usl: 30,     // Límite Superior de Especificación
        cp: 0.73,    // Índice de capacidad del proceso
        cpk: 0.66,   // Índice de capacidad centrada del proceso
        withinSpec: 97  // Porcentaje dentro de especificaciones
    }
};

// Función para inicializar los gráficos al cargar la página
function initControlCharts() {
    // Actualizar los valores en las tarjetas de estadísticas
    updateStatsCards();
    
    // Inicializar gráfico X-barra
    initXbarChart();
    
    // Inicializar gráfico de Rango
    initRangeChart();
    
    // Asegurar que los botones de pestaña funcionan correctamente
    setupTabButtons();
}

// Función para actualizar los valores en las tarjetas de estadísticas
function updateStatsCards() {
    // Actualizar estadísticas de X-barra
    document.getElementById('xbar-ucl').textContent = controlChartData.xbar.ucl.toFixed(2) + ' minutos';
    document.getElementById('xbar-cl').textContent = controlChartData.xbar.cl.toFixed(2) + ' minutos';
    document.getElementById('xbar-lcl').textContent = controlChartData.xbar.lcl.toFixed(2) + ' minutos';
    
    // Verificar si algún punto está fuera de control en X-barra
    const xbarOutOfControl = controlChartData.xbar.values.some(value => 
        value > controlChartData.xbar.ucl || value < controlChartData.xbar.lcl
    );
    document.getElementById('xbar-status').textContent = xbarOutOfControl ? 'Fuera de control' : 'Bajo control';
    
    // Actualizar estadísticas de Rango
    document.getElementById('range-ucl').textContent = controlChartData.range.ucl.toFixed(2) + ' minutos';
    document.getElementById('range-cl').textContent = controlChartData.range.cl.toFixed(2) + ' minutos';
    document.getElementById('range-lcl').textContent = controlChartData.range.lcl.toFixed(2) + ' minutos';
    
    // Verificar si algún punto está fuera de control en Rango
    const rangeOutOfControl = controlChartData.range.values.some(value => 
        value > controlChartData.range.ucl || value < controlChartData.range.lcl
    );
    document.getElementById('range-status').textContent = rangeOutOfControl ? 'Fuera de control' : 'Bajo control';
}

// Función para inicializar el gráfico X-barra
function initXbarChart() {
    const xbarCtx = document.getElementById('xbar-chart').getContext('2d');
    
    new Chart(xbarCtx, {
        type: 'line',
        data: {
            labels: controlChartData.xbar.subgroups,
            datasets: [
                {
                    label: 'Media',
                    data: controlChartData.xbar.values,
                    borderColor: '#3498db',
                    backgroundColor: '#3498db',
                    tension: 0.1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'LSC',
                    data: Array(controlChartData.xbar.subgroups.length).fill(controlChartData.xbar.ucl),
                    borderColor: '#e74c3c',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Línea Central',
                    data: Array(controlChartData.xbar.subgroups.length).fill(controlChartData.xbar.cl),
                    borderColor: '#2ecc71',
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'LIC',
                    data: Array(controlChartData.xbar.subgroups.length).fill(controlChartData.xbar.lcl),
                    borderColor: '#e74c3c',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Gráfico de Control X-barra - Tiempo de Servicio',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Tiempo (minutos)'
                    },
                    min: Math.min(controlChartData.xbar.lcl, Math.min(...controlChartData.xbar.values)) - 1,
                    max: Math.max(controlChartData.xbar.ucl, Math.max(...controlChartData.xbar.values)) + 1
                },
                x: {
                    title: {
                        display: true,
                        text: 'Subgrupo'
                    }
                }
            }
        }
    });
}

// Función para inicializar el gráfico de Rango
function initRangeChart() {
    const rangeCtx = document.getElementById('range-chart').getContext('2d');
    
    new Chart(rangeCtx, {
        type: 'line',
        data: {
            labels: controlChartData.range.subgroups,
            datasets: [
                {
                    label: 'Rango',
                    data: controlChartData.range.values,
                    borderColor: '#9b59b6',
                    backgroundColor: '#9b59b6',
                    tension: 0.1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'LSC',
                    data: Array(controlChartData.range.subgroups.length).fill(controlChartData.range.ucl),
                    borderColor: '#e74c3c',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Línea Central',
                    data: Array(controlChartData.range.subgroups.length).fill(controlChartData.range.cl),
                    borderColor: '#2ecc71',
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'LIC',
                    data: Array(controlChartData.range.subgroups.length).fill(controlChartData.range.lcl),
                    borderColor: '#e74c3c',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Gráfico de Control de Rango - Tiempo de Servicio',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Rango (minutos)'
                    },
                    min: 0,
                    max: Math.max(controlChartData.range.ucl, Math.max(...controlChartData.range.values)) + 2
                },
                x: {
                    title: {
                        display: true,
                        text: 'Subgrupo'
                    }
                }
            }
        }
    });
}

// Función para configurar los botones de las pestañas
function setupTabButtons() {
    const tabs = document.querySelectorAll('.tab');
    const xbarChart = document.getElementById('xbar-chart');
    const rangeChart = document.getElementById('range-chart');
    
    // Configurar escucha de eventos para cada pestaña
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover la clase 'active' de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Agregar la clase 'active' a la pestaña seleccionada
            this.classList.add('active');
            
            // Mostrar u ocultar los gráficos correspondientes
            if (this.textContent.includes('X-barra')) {
                xbarChart.style.display = 'block';
                rangeChart.style.display = 'none';
            } else {
                xbarChart.style.display = 'none';
                rangeChart.style.display = 'block';
            }
        });
    });
}

// Función para determinar si el proceso está bajo control estadístico
function isProcessStable() {
    // Verificar si hay puntos fuera de los límites de control en X-barra
    const xbarOutOfControl = controlChartData.xbar.values.some(value => 
        value > controlChartData.xbar.ucl || value < controlChartData.xbar.lcl
    );
    
    // Verificar si hay puntos fuera de los límites de control en Rango
    const rangeOutOfControl = controlChartData.range.values.some(value => 
        value > controlChartData.range.ucl || value < controlChartData.range.lcl
    );
    
    // El proceso está estable si no hay puntos fuera de control en ambos gráficos
    return !xbarOutOfControl && !rangeOutOfControl;
}

// Inicializar los gráficos cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initControlCharts);