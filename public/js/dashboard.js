document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });

    // Dashboard Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Fetch farm data from API
    fetchFarmData();
});

// Fetch farm data from API
async function fetchFarmData() {
    try {
        const response = await fetch('/api/farm-data');
        const data = await response.json();
        
        // Initialize charts with the data
        initMoistureChart(data.moisture);
        initTemperatureChart(data.temperature);
        initWaterUsageChart(data.irrigation);
        initPrecipitationChart(data.precipitation);
        initCropDistributionChart(data.crops);
        
        // Generate calendar and weather forecast
        generateCalendar();
        generateWeatherForecast();
    } catch (error) {
        console.error('Error fetching farm data:', error);
        
        // Use mock data if API fails
        const mockMoistureData = generateMockData(24, 50, 30);
        const mockTemperatureData = generateMockData(24, 20, 15);
        const mockIrrigationData = generateMockData(7, 5, 20);
        const mockPrecipitationData = generateMockData(7, 0, 20);
        const mockCropData = [
            { name: 'Corn', value: 35 },
            { name: 'Wheat', value: 25 },
            { name: 'Soybeans', value: 20 },
            { name: 'Alfalfa', value: 15 },
            { name: 'Other', value: 5 }
        ];
        
        initMoistureChart(mockMoistureData);
        initTemperatureChart(mockTemperatureData);
        initWaterUsageChart(mockIrrigationData);
        initPrecipitationChart(mockPrecipitationData);
        initCropDistributionChart(mockCropData);
        
        generateCalendar();
        generateWeatherForecast();
    }
}

// Helper function to generate mock data
function generateMockData(length, min, range) {
    return Array.from({ length }, (_, i) => {
        let label;
        if (length === 24) {
            label = `${i}:00`;
        } else {
            const day = new Date();
            day.setDate(day.getDate() - (length - 1) + i);
            label = day.toLocaleDateString('en-US', { weekday: 'short' });
        }
        
        return {
            label,
            value: Math.random() * range + min
        };
    });
}

// Initialize moisture chart
function initMoistureChart(data) {
    const ctx = document.getElementById('moistureChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.label || item.time),
            datasets: [{
                label: 'Soil Moisture (%)',
                data: data.map(item => item.value || item.moisture),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: '#10b981',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 40,
                    max: 90
                }
            }
        }
    });
}

// Initialize temperature chart
function initTemperatureChart(data) {
    const ctx = document.getElementById('temperatureChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.label || item.time),
            datasets: [{
                label: 'Temperature (°C)',
                data: data.map(item => item.value || item.temperature),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: '#f59e0b',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 15,
                    max: 40
                }
            }
        }
    });
}

// Initialize water usage chart
function initWaterUsageChart(data) {
    const ctx = document.getElementById('waterUsageChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.label || item.day),
            datasets: [{
                label: 'Water Usage (mm)',
                data: data.map(item => item.value || item.amount),
                backgroundColor: '#0ea5e9',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize precipitation chart
function initPrecipitationChart(data) {
    const ctx = document.getElementById('precipitationChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.label || item.day),
            datasets: [{
                label: 'Precipitation (mm)',
                data: data.map(item => item.value),
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize crop distribution chart
function initCropDistributionChart(data) {
    const ctx = document.getElementById('cropDistributionChart');
    if (!ctx) return;

    const colors = ['#10b981', '#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'];

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(item => item.name),
            datasets: [{
                data: data.map(item => item.value),
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
}

// Generate calendar
function generateCalendar() {
    const calendarContainer = document.getElementById('calendar');
    if (!calendarContainer) return;
    
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    let calendarHTML = `
        <div class="calendar-header">
            <h4>${date.toLocaleString('default', { month: 'long' })} ${currentYear}</h4>
        </div>
        <div class="calendar-days">
            <div class="weekday">Sun</div>
            <div class="weekday">Mon</div>
            <div class="weekday">Tue</div>
            <div class="weekday">Wed</div>
            <div class="weekday">Thu</div>
            <div class="weekday">Fri</div>
            <div class="weekday">Sat</div>
    `;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<div class="day empty"></div>`;
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = i === date.getDate();
        const hasEvent = (i === 15 || i === 22); // Example scheduled days
        
        calendarHTML += `
            <div class="day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
                ${i}
                ${hasEvent ? '<span class="event-dot"></span>' : ''}
            </div>
        `;
    }
    
    calendarHTML += `</div>`;
    calendarContainer.innerHTML = calendarHTML;
    
    // Add calendar styles
    const style = document.createElement('style');
    style.textContent = `
        .calendar-header {
            text-align: center;
            margin-bottom: 1rem;
        }
        .calendar-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.5rem;
        }
        .weekday {
            text-align: center;
            font-weight: 600;
            color: var(--gray);
            font-size: 0.75rem;
            padding: 0.5rem 0;
        }
        .day {
            text-align: center;
            padding: 0.5rem;
            border-radius: var(--border-radius);
            position: relative;
            cursor: pointer;
            transition: var(--transition);
        }
        .day:hover {
            background-color: var(--gray-light);
        }
        .day.empty {
            visibility: hidden;
        }
        .day.today {
            background-color: var(--primary-light);
            font-weight: 700;
            color: var(--primary);
        }
        .day.has-event {
            font-weight: 600;
        }
        .event-dot {
            position: absolute;
            bottom: 3px;
            left: 50%;
            transform: translateX(-50%);
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: var(--primary);
        }
    `;
    document.head.appendChild(style);
}

// Generate weather forecast
function generateWeatherForecast() {
    const forecastContainer = document.querySelector('.forecast-days');
    if (!forecastContainer) return;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    let forecastHTML = '';
    
    for (let i = 0; i < 7; i++) {
        const dayIndex = (today + i) % 7;
        const isRainy = Math.random() > 0.7;
        const temp = Math.round(Math.random() * 10 + 20);
        const precipitation = isRainy ? Math.round(Math.random() * 20) : 0;
        
        forecastHTML += `
            <div class="forecast-day">
                <div class="forecast-date">${days[dayIndex]}</div>
                <div class="forecast-icon">
                    <i class="fas ${isRainy ? 'fa-cloud-rain' : 'fa-sun'}"></i>
                </div>
                <div class="forecast-temp">${temp}°C</div>
                ${isRainy ? `<div class="forecast-precip">${precipitation}mm</div>` : ''}
            </div>
        `;
    }
    
    forecastContainer.innerHTML = forecastHTML;
}