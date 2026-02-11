// Timetable data
const timetableData = {
    Monday: [
        { time: "9:00–10:00", subject: "SE", type: "Theory", batch: "All" },
        { time: "10:00–11:00", subject: "JAVA", type: "Theory", batch: "All" },
        { time: "11:00–1:00", subject: "SE / OS", type: "Lab", batch: "b1 / b2" },
        { time: "1:30–2:30", subject: "DSP", type: "Theory", batch: "All" },
        { time: "2:30–4:30", subject: "Sports", type: "Activity", batch: "All" }
    ],
    Tuesday: [
        { time: "9:00–11:00", subject: "JAVA / DSP", type: "Lab", batch: "b1 / b2" },
        { time: "11:00–12:00", subject: "OS", type: "Theory", batch: "All" },
        { time: "12:00–1:00", subject: "DSP", type: "Theory", batch: "All" },
        { time: "2:00–3:00", subject: "SE", type: "Theory", batch: "All" },
        { time: "3:00–4:30", subject: "DSP / JAVA", type: "Lab", batch: "b1 / b2" }
    ],
    Wednesday: [
        { time: "9:00–10:00", subject: "SE", type: "Theory", batch: "All" },
        { time: "10:00–11:00", subject: "IC", type: "Theory", batch: "All" },
        { time: "11:00–12:00", subject: "DSP", type: "Theory", batch: "All" },
        { time: "1:00–3:00", subject: "OS / SE", type: "Lab", batch: "b1 / b2" },
        { time: "3:00–4:30", subject: "Sports", type: "Activity", batch: "All" }
    ],
    Thursday: [
        { time: "9:00–11:00", subject: "SE / OS", type: "Lab", batch: "b1 / b2" },
        { time: "11:00–12:00", subject: "JAVA", type: "Theory", batch: "All" },
        { time: "12:00–1:00", subject: "DSP", type: "Theory", batch: "All" },
        { time: "1:30–2:30", subject: "OS", type: "Theory", batch: "All" },
        { time: "2:30–4:30", subject: "JAVA / DSP", type: "Lab", batch: "b2 / b1" }
    ],
    Friday: [
        { time: "9:00–10:00", subject: "JAVA", type: "Theory", batch: "All" },
        { time: "10:00–11:00", subject: "OS", type: "Theory", batch: "All" },
        { time: "11:00–12:00", subject: "SE", type: "Theory", batch: "All" },
        { time: "1:00–3:00", subject: "JAVA / DSP", type: "Lab", batch: "b1 / b2" },
        { time: "3:00–4:00", subject: "IC", type: "Theory", batch: "All" }
    ],
    Saturday: [
        { time: "9:00–10:00", subject: "OS", type: "Theory", batch: "All" },
        { time: "10:00–11:00", subject: "JAVA", type: "Theory", batch: "All" },
        { time: "11:00–1:00", subject: "SE / OS", type: "Lab", batch: "b2 / b1" }
    ]
};

// Global variables
let currentView = 'today';
let currentFilter = 'all';
let currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

// DOM elements
const todayBtn = document.getElementById('todayBtn');
const weekBtn = document.getElementById('weekBtn');
const dayFilters = document.getElementById('dayFilters');
const timetableContent = document.getElementById('timetableContent');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderTimetable();
});

function setupEventListeners() {
    // View toggle buttons
    todayBtn.addEventListener('click', () => {
        currentView = 'today';
        updateActiveButton(todayBtn, weekBtn);
        dayFilters.style.display = 'none';
        renderTimetable();
    });

    weekBtn.addEventListener('click', () => {
        currentView = 'week';
        updateActiveButton(weekBtn, todayBtn);
        dayFilters.style.display = 'flex';
        renderTimetable();
    });

    // Day filter buttons
    dayFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('day-btn')) {
            currentFilter = e.target.dataset.day;
            updateActiveDayButton(e.target);
            renderTimetable();
        }
    });
}

function updateActiveButton(active, inactive) {
    active.classList.add('active');
    inactive.classList.remove('active');
}

function updateActiveDayButton(activeBtn) {
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

function renderTimetable() {
    if (currentView === 'today') {
        renderTodayView();
    } else {
        renderWeekView();
    }
}

function renderTodayView() {
    const todaySchedule = timetableData[currentDay];
    const isToday = true;

    if (!todaySchedule || todaySchedule.length === 0) {
        timetableContent.innerHTML = `
            <div class="no-classes">
                <i class="fas fa-calendar-times"></i>
                <p>No classes scheduled for today!</p>
                <p>Enjoy your free day 🎉</p>
            </div>
        `;
        return;
    }

    const daySection = createDaySection(currentDay, todaySchedule, isToday);
    timetableContent.innerHTML = daySection;
    timetableContent.classList.add('fade-in');
}

function renderWeekView() {
    let html = '';
    const days = Object.keys(timetableData);

    days.forEach(day => {
        if (currentFilter === 'all' || currentFilter === day) {
            const isToday = day === currentDay;
            const daySchedule = timetableData[day];
            html += createDaySection(day, daySchedule, isToday);
        }
    });

    if (html === '') {
        html = `
            <div class="no-classes">
                <i class="fas fa-calendar-times"></i>
                <p>No classes found for the selected filter.</p>
            </div>
        `;
    }

    timetableContent.innerHTML = html;
    timetableContent.classList.add('fade-in');
}

function createDaySection(day, schedule, isToday) {
    const dayHeader = `
        <div class="day-header">
            <h2>${day}</h2>
            <div class="day-date">${getDayDate(day)}</div>
            ${isToday ? '<div class="today-indicator">Today</div>' : ''}
        </div>
    `;

    const scheduleItems = schedule.map(item => createScheduleItem(item, isToday)).join('');

    return `
        <div class="day-section">
            ${dayHeader}
            <div class="schedule-grid">
                ${scheduleItems}
            </div>
        </div>
    `;
}

function createScheduleItem(item, isToday) {
    const typeClass = item.type.toLowerCase();
    const currentTimeIndicator = isToday && isCurrentTime(item.time) ? 
        '<div class="current-time-indicator"></div>' : '';

    const typeIcon = getTypeIcon(item.type);
    const batchIcon = item.batch === 'All' ? 'fas fa-users' : 'fas fa-user-friends';

    return `
        <div class="schedule-item ${typeClass}">
            ${currentTimeIndicator}
            <div class="schedule-header">
                <div class="time-slot">
                    <i class="fas fa-clock"></i> ${item.time}
                </div>
                <div class="subject-type">
                    <i class="${typeIcon}"></i> ${item.type}
                </div>
            </div>
            <div class="subject-name">${item.subject}</div>
            <div class="batch-info">
                <i class="${batchIcon}"></i>
                <span>Batch: ${item.batch}</span>
            </div>
        </div>
    `;
}

function getTypeIcon(type) {
    switch (type.toLowerCase()) {
        case 'theory': return 'fas fa-book';
        case 'lab': return 'fas fa-laptop-code';
        case 'activity': return 'fas fa-running';
        default: return 'fas fa-graduation-cap';
    }
}

function getDayDate(day) {
    // This is a simplified version - you might want to calculate actual dates
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayIndex = today.getDay();
    const targetDayIndex = dayNames.indexOf(day);
    
    const date = new Date(today);
    date.setDate(today.getDate() + (targetDayIndex - currentDayIndex));
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function isCurrentTime(timeSlot) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Parse time slot (e.g., "9:00–10:00")
    const [startTime, endTime] = timeSlot.split('–');
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return currentTime >= startMinutes && currentTime <= endMinutes;
}

// Initialize day filters as hidden for today view
dayFilters.style.display = 'none';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.log('Registration failed:', err));
    });
}