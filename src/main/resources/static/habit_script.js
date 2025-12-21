// --- State ---
const defaultData = {
    habits: [], 
    records: {}, 
    descriptions: {}, 
    events: {}, 
    settings: { 
        darkMode: false,
        sidebarWidth: 320,
        descWidth: 250,
        habitWidth: 90,
        fontSize: 14
    }
};

let appData = JSON.parse(localStorage.getItem('habitMatrixUltData')) || defaultData;

// Defaults Check
if(!appData.settings.sidebarWidth) appData.settings.sidebarWidth = 320;
if(!appData.settings.descWidth) appData.settings.descWidth = 250;
if(!appData.settings.habitWidth) appData.settings.habitWidth = 90;
if(!appData.settings.fontSize) appData.settings.fontSize = 14;

let currentMonth = new Date(); 
let selectedDate = new Date(); 

// --- DOM Elements ---
const calendarGrid = document.getElementById('calendarGrid');
const calendarMonthLabel = document.getElementById('calendarMonthLabel');
const gridBody = document.getElementById('gridBody');
const addEventTargetDate = document.getElementById('addEventTargetDate');
const eventList = document.getElementById('eventList');
const eventInput = document.getElementById('eventInput');

// Modals
const settingsModal = document.getElementById('settingsModal');
const analyticsModal = document.getElementById('analyticsModal');
const habitList = document.getElementById('habitList');

// Sizing Inputs
const descWidthInput = document.getElementById('descWidthInput');
const descWidthVal = document.getElementById('descWidthVal');
const habitWidthInput = document.getElementById('habitWidthInput');
const habitWidthVal = document.getElementById('habitWidthVal');
const fontSizeInput = document.getElementById('fontSizeInput');
const fontSizeVal = document.getElementById('fontSizeVal');

// Resizer
const sidebarResizer = document.getElementById('sidebarResizer');
const sidebar = document.querySelector('aside');

// Analytics Elements
const analyticsBtn = document.getElementById('analyticsBtn');
const closeAnalytics = document.getElementById('closeAnalytics');
const analyticsContent = document.getElementById('analyticsContent');
const statCompletion = document.getElementById('statCompletion');
const statTotalDone = document.getElementById('statTotalDone');
const statBestHabit = document.getElementById('statBestHabit');
const analyticsMonthLabel = document.getElementById('analyticsMonthLabel');

let dailyChartInstance = null;
let habitChartInstance = null;

// --- Helpers ---
const formatDate = (d) => d.toISOString().split('T')[0];
const getDaysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
const saveData = () => { localStorage.setItem('habitMatrixUltData', JSON.stringify(appData)); };

// --- Analytics Logic ---
function calculateStats() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    
    let totalHabitsCount = appData.habits.length;
    let totalPossibleTicks = totalHabitsCount * daysInMonth;
    let actualTicks = 0;
    
    let dailyCounts = new Array(daysInMonth).fill(0);
    let habitPerformance = {};

    // Initialize habit counters
    appData.habits.forEach(h => habitPerformance[h.id] = 0);

    for(let d=1; d<=daysInMonth; d++) {
        const dDate = new Date(year, month, d);
        const dStr = formatDate(dDate);
        
        appData.habits.forEach(h => {
            if(appData.records[`${dStr}-${h.id}`]) {
                actualTicks++;
                dailyCounts[d-1]++;
                habitPerformance[h.id]++;
            }
        });
    }

    // Calculations
    const completionRate = totalPossibleTicks > 0 ? Math.round((actualTicks / totalPossibleTicks) * 100) : 0;
    
    // Best Habit
    let bestHabitName = "--";
    let maxTicks = -1;
    appData.habits.forEach(h => {
        if(habitPerformance[h.id] > maxTicks) {
            maxTicks = habitPerformance[h.id];
            bestHabitName = h.name;
        }
    });
    if(totalHabitsCount === 0 || actualTicks === 0) bestHabitName = "--";

    return {
        completionRate,
        actualTicks,
        bestHabitName,
        dailyCounts,
        habitPerformance
    };
}

function renderCharts() {
    const stats = calculateStats();
    
    // Text Stats
    statCompletion.textContent = `${stats.completionRate}%`;
    statTotalDone.textContent = stats.actualTicks;
    statBestHabit.textContent = stats.bestHabitName;
    analyticsMonthLabel.textContent = `Stats for ${currentMonth.toLocaleDateString('default', {month:'long', year:'numeric'})}`;

    const isDark = appData.settings.darkMode;
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    // Daily Chart
    const daysInMonth = getDaysInMonth(currentMonth);
    const labels = Array.from({length: daysInMonth}, (_, i) => i + 1);
    
    const ctxDaily = document.getElementById('dailyChart').getContext('2d');
    if(dailyChartInstance) dailyChartInstance.destroy();

    dailyChartInstance = new Chart(ctxDaily, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Habits Completed',
                data: stats.dailyCounts,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, suggestedMax: appData.habits.length, grid: { color: gridColor }, ticks: { color: textColor } },
                x: { grid: { display: false }, ticks: { color: textColor } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Habit Chart
    const ctxHabit = document.getElementById('habitChart').getContext('2d');
    if(habitChartInstance) habitChartInstance.destroy();

    const habitLabels = appData.habits.map(h => h.name);
    const habitData = appData.habits.map(h => stats.habitPerformance[h.id]);
    const habitColors = appData.habits.map(h => h.color);

    habitChartInstance = new Chart(ctxHabit, {
        type: 'bar',
        data: {
            labels: habitLabels,
            datasets: [{
                label: 'Days Completed',
                data: habitData,
                backgroundColor: habitColors,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: daysInMonth, grid: { color: gridColor }, ticks: { color: textColor } },
                x: { grid: { display: false }, ticks: { color: textColor } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// --- Layout & Sizing Logic ---
function applyLayoutSettings() {
    const root = document.documentElement;
    root.style.setProperty('--sidebar-width', `${appData.settings.sidebarWidth}px`);
    root.style.setProperty('--desc-width', `${appData.settings.descWidth}px`);
    root.style.setProperty('--habit-width', `${appData.settings.habitWidth}px`);
    root.style.setProperty('--base-font-size', `${appData.settings.fontSize}px`);

    descWidthInput.value = appData.settings.descWidth;
    descWidthVal.textContent = `${appData.settings.descWidth}px`;
    habitWidthInput.value = appData.settings.habitWidth;
    habitWidthVal.textContent = `${appData.settings.habitWidth}px`;
    fontSizeInput.value = appData.settings.fontSize;
    fontSizeVal.textContent = `${appData.settings.fontSize}px`;
}

let isResizing = false;
sidebarResizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    sidebarResizer.classList.add('resizing');
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    let newWidth = e.clientX;
    if (newWidth < 200) newWidth = 200;
    if (newWidth > 600) newWidth = 600;
    appData.settings.sidebarWidth = newWidth;
    document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
});

document.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
        sidebarResizer.classList.remove('resizing');
        saveData(); 
    }
});

descWidthInput.addEventListener('input', (e) => {
    appData.settings.descWidth = e.target.value;
    applyLayoutSettings();
});
descWidthInput.addEventListener('change', saveData);

habitWidthInput.addEventListener('input', (e) => {
    appData.settings.habitWidth = e.target.value;
    applyLayoutSettings();
});
habitWidthInput.addEventListener('change', saveData);

fontSizeInput.addEventListener('input', (e) => {
    appData.settings.fontSize = e.target.value;
    applyLayoutSettings();
});
fontSizeInput.addEventListener('change', saveData);


// --- Calendar Logic ---
function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    calendarMonthLabel.textContent = currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    document.getElementById('mainViewLabel').textContent = calendarMonthLabel.textContent; 

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(currentMonth);
    
    calendarGrid.innerHTML = '';
    for (let i = 0; i < firstDay; i++) calendarGrid.innerHTML += `<div class="calendar-day empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = formatDate(new Date(year, month, d));
        const isSelected = dateStr === formatDate(selectedDate);
        const isToday = dateStr === formatDate(new Date());
        const hasEvents = appData.events[dateStr] && appData.events[dateStr].length > 0;

        const dayEl = document.createElement('div');
        dayEl.className = `calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} relative`;
        dayEl.innerHTML = `
            ${d}
            ${hasEvents && !isSelected ? '<div class="absolute bottom-1 w-1 h-1 bg-indigo-500 rounded-full"></div>' : ''}
        `;
        dayEl.onclick = () => {
            selectedDate = new Date(year, month, d);
            renderCalendar();
            renderEvents(); 
        };
        calendarGrid.appendChild(dayEl);
    }
}

// --- Event Logic ---
function renderEvents() {
    addEventTargetDate.textContent = selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    
    let allEvents = [];
    for(let d=1; d<=daysInMonth; d++) {
        const dDate = new Date(year, month, d);
        const dStr = formatDate(dDate);
        if(appData.events[dStr] && appData.events[dStr].length > 0) {
            appData.events[dStr].forEach(ev => {
                allEvents.push({ ...ev, dateObj: dDate, dateStr: dStr, dayNum: d });
            });
        }
    }
    
    eventList.innerHTML = '';
    if (allEvents.length === 0) {
        eventList.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center text-gray-400 italic text-[10px] space-y-2 opacity-60"><i class="fa-regular fa-calendar-xmark text-xl"></i><span>No events this month</span></div>`;
    } else {
        allEvents.forEach(ev => {
            const isSelectedDay = ev.dateStr === formatDate(selectedDate);
            const div = document.createElement('div');
            div.className = `flex items-center gap-2 p-1.5 rounded-md border shadow-sm group transition ${isSelectedDay ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-white border-gray-100 dark:bg-slate-800 dark:border-gray-700'}`;
            div.innerHTML = `
                <div class="flex flex-col items-center min-w-[20px]">
                    <span class="text-[8px] uppercase font-bold text-gray-400 leading-none">${ev.dateObj.toLocaleDateString('default', {weekday: 'short'})}</span>
                    <span class="text-xs font-bold leading-tight ${isSelectedDay ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}">${ev.dayNum}</span>
                </div>
                <div class="w-px h-6 bg-gray-100 dark:bg-gray-700 mx-0.5"></div>
                <span class="text-[11px] flex-1 break-words leading-tight">${ev.text}</span>
                <button onclick="deleteEvent('${ev.dateStr}', '${ev.id}')" class="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition px-1"><i class="fa-solid fa-trash-can text-[10px]"></i></button>
            `;
            eventList.appendChild(div);
        });
    }
}

function addEvent(e) {
    e.preventDefault();
    const text = eventInput.value.trim();
    if(!text) return;
    const dateStr = formatDate(selectedDate);
    if(!appData.events[dateStr]) appData.events[dateStr] = [];
    appData.events[dateStr].push({ id: Date.now().toString(), text });
    saveData();
    eventInput.value = '';
    renderEvents();
    renderCalendar();
}

function deleteEvent(dateStr, id) {
    appData.events[dateStr] = appData.events[dateStr].filter(e => e.id !== id);
    if(appData.events[dateStr].length === 0) delete appData.events[dateStr];
    saveData();
    renderEvents();
    renderCalendar();
}

// --- Main Grid Logic ---
function renderGrid() {
    const headerRow = document.querySelector('thead tr');
    while(headerRow.children.length > 2) headerRow.removeChild(headerRow.lastChild);
    
    appData.habits.forEach(h => {
        const th = document.createElement('th');
        th.className = "habit-col px-2 py-3 text-center border-r border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900";
        th.innerHTML = `
            <div class="flex flex-col items-center w-full overflow-hidden">
                <span class="truncate w-full text-xs mb-1 px-1" title="${h.name}">${h.name}</span>
                <div class="h-1 w-8 rounded-full" style="background-color: ${h.color}"></div>
            </div>
        `;
        headerRow.appendChild(th);
    });

    const daysInMonth = getDaysInMonth(currentMonth);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    gridBody.innerHTML = '';

    for(let d=1; d<=daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dateStr = formatDate(date);
        const description = appData.descriptions[dateStr] || '';
        const isToday = formatDate(new Date()) === dateStr;

        const tr = document.createElement('tr');
        tr.className = `group ${isToday ? "bg-indigo-50/40 dark:bg-indigo-900/10" : "hover:bg-gray-50 dark:hover:bg-slate-900/50"} transition-colors`;
        
        const tdDay = document.createElement('td');
        tdDay.className = "text-center font-mono text-xs font-bold text-gray-500 sticky-left-col bg-white dark:bg-slate-950 border-r border-b border-gray-100 dark:border-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-slate-900/50";
        tdDay.innerHTML = isToday ? `<span class="text-indigo-600 dark:text-indigo-400">${d}</span>` : d;
        tr.appendChild(tdDay);

        const tdDesc = document.createElement('td');
        tdDesc.className = "desc-col border-r border-b border-gray-100 dark:border-gray-800 sticky-desc-col bg-white dark:bg-slate-950 p-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-gray-50 dark:group-hover:bg-slate-900/50";
        tdDesc.innerHTML = `<input type="text" class="bare-input px-4 py-2 text-gray-600 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-700 h-full" placeholder="..." value="${description.replace(/"/g, '&quot;')}" onchange="updateDescription('${dateStr}', this.value)">`;
        tr.appendChild(tdDesc);

        appData.habits.forEach(h => {
            const tdHabit = document.createElement('td');
            const isChecked = appData.records[`${dateStr}-${h.id}`];
            tdHabit.className = "habit-col text-center p-0 border-r border-b border-gray-100 dark:border-gray-800";
            tdHabit.innerHTML = `
                <label class="cursor-pointer w-full h-10 flex items-center justify-center checkbox-wrapper">
                    <input type="checkbox" class="sr-only" onchange="toggleHabit('${dateStr}', '${h.id}')" ${isChecked ? 'checked' : ''}>
                    <div class="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] shadow-sm transform transition-all"
                         style="background-color: ${isChecked ? h.color : 'transparent'}; border: 1px solid ${isChecked ? h.color : '#cbd5e1'};">
                        ${isChecked ? '<i class="fa-solid fa-check"></i>' : ''}
                    </div>
                </label>
            `;
            tr.appendChild(tdHabit);
        });
        gridBody.appendChild(tr);
    }

    const emptyState = document.getElementById('emptyState');
    if(appData.habits.length === 0) emptyState.classList.remove('hidden');
    else emptyState.classList.add('hidden');
}

// --- Data Interaction ---
function updateDescription(dateStr, val) {
    if(val.trim()) appData.descriptions[dateStr] = val.trim();
    else delete appData.descriptions[dateStr];
    saveData();
}

function toggleHabit(dateStr, habitId) {
    const key = `${dateStr}-${habitId}`;
    if(appData.records[key]) delete appData.records[key];
    else appData.records[key] = true;
    saveData();
    renderGrid();
}

function addHabit(e) {
    e.preventDefault();
    const name = document.getElementById('habitNameInput').value.trim();
    if(!name) return;
    appData.habits.push({ id: Date.now().toString(), name, color: document.getElementById('habitColorInput').value });
    document.getElementById('habitNameInput').value = '';
    saveData();
    renderHabitList();
    renderGrid();
}

function deleteHabit(id) {
    if(confirm("Delete habit?")) {
        appData.habits = appData.habits.filter(h => h.id !== id);
        saveData();
        renderHabitList();
        renderGrid();
    }
}

// --- Init & UI Bindings ---
document.getElementById('addEventForm').addEventListener('submit', addEvent);
document.getElementById('addHabitForm').addEventListener('submit', addHabit);

document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
    renderGrid();
    renderEvents();
});
document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
    renderGrid();
    renderEvents();
});

const openSettings = () => {
    renderHabitList();
    settingsModal.classList.remove('hidden');
    setTimeout(() => document.getElementById('modalContent').classList.remove('scale-95', 'opacity-0'), 10);
    setTimeout(() => document.getElementById('modalContent').classList.add('scale-100', 'opacity-100'), 10);
};
const closeSettings = () => {
    document.getElementById('modalContent').classList.remove('scale-100', 'opacity-100');
    document.getElementById('modalContent').classList.add('scale-95', 'opacity-0');
    setTimeout(() => settingsModal.classList.add('hidden'), 300);
};

const openAnalytics = () => {
    renderCharts();
    analyticsModal.classList.remove('hidden');
    setTimeout(() => analyticsContent.classList.remove('scale-95', 'opacity-0'), 10);
    setTimeout(() => analyticsContent.classList.add('scale-100', 'opacity-100'), 10);
};
const closeAnalyticsModal = () => {
    analyticsContent.classList.remove('scale-100', 'opacity-100');
    analyticsContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => analyticsModal.classList.add('hidden'), 300);
};

document.getElementById('settingsBtn').addEventListener('click', openSettings);
document.getElementById('closeSettings').addEventListener('click', closeSettings);
settingsModal.addEventListener('click', (e) => { if(e.target === settingsModal) closeSettings(); });

analyticsBtn.addEventListener('click', openAnalytics);
closeAnalytics.addEventListener('click', closeAnalyticsModal);
analyticsModal.addEventListener('click', (e) => { if(e.target === analyticsModal) closeAnalyticsModal(); });

function renderHabitList() {
    habitList.innerHTML = appData.habits.map(h => `
        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full border border-black/10 shadow-sm" style="background-color: ${h.color}"></div>
                <span class="text-sm font-medium">${h.name}</span>
            </div>
            <button onclick="deleteHabit('${h.id}')" class="text-gray-400 hover:text-red-500 p-1"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `).join('');
}

const darkModeToggle = document.getElementById('darkModeToggle');
function updateTheme() {
    if(appData.settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    darkModeToggle.checked = appData.settings.darkMode;
}
darkModeToggle.addEventListener('change', (e) => {
    appData.settings.darkMode = e.target.checked;
    saveData();
    updateTheme();
});

document.getElementById('clearDataBtn').addEventListener('click', () => {
    if(confirm("Reset everything?")) {
        localStorage.removeItem('habitMatrixUltData');
        location.reload();
    }
});

applyLayoutSettings();
updateTheme();
renderCalendar();
renderEvents();
renderGrid();