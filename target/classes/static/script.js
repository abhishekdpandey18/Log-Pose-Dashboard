document.addEventListener('DOMContentLoaded', () => {

    
    // --- Settings Panel Logic ---
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const widgetVisibilityCheckboxes = document.querySelectorAll('.widget-visibility-manager input[type="checkbox"]');

    // Point to your own Java Backend endpoint
    const defaultApiUrl = "/api/quote";
    const lockGridToggle = document.getElementById('lock-grid-toggle');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValue = document.getElementById('font-size-value');
    const greetingTextInput = document.getElementById('greeting-text');
    const greetingContent = document.getElementById('greeting-content');
    const bgTypeRadios = document.querySelectorAll('input[name="bg-type"]');
    const solidColorInput = document.getElementById('solid-color');
    const gradientColor1Input = document.getElementById('gradient-color1');
    const gradientColor2Input = document.getElementById('gradient-color2');
    const solidColorGroup = document.getElementById('solid-color-group');
    const gradientColorGroup = document.getElementById('gradient-color-group');
    const imageUrlInput = document.getElementById('image-url');
    const imageUploadInput = document.getElementById('image-upload');
    const displayImage = document.getElementById('display-image');
    const profileNameInput = document.getElementById('profile-name-input');
    const profileTitleInput = document.getElementById('profile-title-input');
    const profileStatusInput = document.getElementById('profile-status-input');
    const profilePicUrlInput = document.getElementById('profile-pic-url-input');
    const profilePicUploadInput = document.getElementById('profile-pic-upload-input');
    const profilePicDisplay = document.getElementById('profile-pic-display');
    const profileNameDisplay = document.getElementById('profile-name-display');
    const profileTitleDisplay = document.getElementById('profile-title-display');
    const profileStatusDisplay = document.getElementById('profile-status-display');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    const quoteApiUrlInput = document.getElementById('quote-api-url');
    const searchUrlInput = document.getElementById('search-url');
    const focusDurationInput = document.getElementById('focus-duration');
    const breakDurationInput = document.getElementById('break-duration');

    settingsToggle.addEventListener('click', () => settingsPanel.classList.toggle('show'));

    function updateAndSaveSettings() {
        const widgetVisibility = {};
        widgetVisibilityCheckboxes.forEach(cb => {
            widgetVisibility[cb.dataset.widgetId] = cb.checked;
        });

        const settings = {
            gridLocked: lockGridToggle.checked,
            fontSize: fontSizeSlider.value,
            widgetVisibility: widgetVisibility,
            greetingText: greetingTextInput.value,
            bgType: document.querySelector('input[name="bg-type"]:checked').value,
            solidColor: solidColorInput.value,
            gradientColor1: gradientColor1Input.value,
            gradientColor2: gradientColor2Input.value,
            imageUrl: imageUrlInput.value,
            imageDataUrl: displayImage.src.startsWith('data:') ? displayImage.src : null,
            profileName: profileNameInput.value,
            profileTitle: profileTitleInput.value,
            profileStatus: profileStatusInput.value,
            profilePicUrl: profilePicUrlInput.value,
            profilePicDataUrl: profilePicDisplay.src.startsWith('data:') ? profilePicDisplay.src : null,
            quoteApiUrl: quoteApiUrlInput.value,
            searchUrl: searchUrlInput.value,
            focusDuration: focusDurationInput.value,
            breakDuration: breakDurationInput.value
        };
        
        localStorage.setItem('dashboardSettings', JSON.stringify(settings));
        applySettingsFromObject(settings);
    }
    
    function applySettingsFromObject(settings) {
        applyGridLockState(settings.gridLocked);
        document.documentElement.style.fontSize = `${settings.fontSize}px`;
        fontSizeValue.textContent = settings.fontSize;
        if (settings.widgetVisibility) applyWidgetVisibility(settings.widgetVisibility);

        greetingContent.textContent = settings.greetingText;
        
        if (settings.bgType === 'solid') {
            solidColorGroup.style.display = 'block'; gradientColorGroup.style.display = 'none';
            document.body.style.background = settings.solidColor;
        } else {
            solidColorGroup.style.display = 'none'; gradientColorGroup.style.display = 'block';
            document.body.style.background = `linear-gradient(45deg, ${settings.gradientColor1}, ${settings.gradientColor2})`;
        }
        
        if (settings.imageDataUrl) { displayImage.src = settings.imageDataUrl;
        } else if (settings.imageUrl) { displayImage.src = settings.imageUrl; }
        
        profileNameDisplay.textContent = settings.profileName;
        profileTitleDisplay.textContent = settings.profileTitle;
        profileStatusDisplay.textContent = settings.profileStatus;
        if (settings.profilePicDataUrl) { profilePicDisplay.src = settings.profilePicDataUrl;
        } else if (settings.profilePicUrl) { profilePicDisplay.src = settings.profilePicUrl; }
    }

    function applyGridLockState(isLocked) {
        const gridContainer = document.getElementById('grid-container');
        const widgets = document.querySelectorAll('.widget');
        if (isLocked) {
            gridContainer.classList.add('locked');
            widgets.forEach(widget => { widget.draggable = false; });
        } else {
            gridContainer.classList.remove('locked');
            widgets.forEach(widget => { widget.draggable = true; });
        }
    }

    function applyWidgetVisibility(visibility) {
        for (const widgetId in visibility) {
            const widget = document.getElementById(widgetId);
            if (widget) {
                widget.style.display = visibility[widgetId] ? 'flex' : 'none';
            }
        }
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('dashboardSettings');
        let settings;
        const defaultSettings = {
            gridLocked: false, fontSize: 16, greetingText: "Hello!", bgType: "solid",
            solidColor: "#1a1a2e", gradientColor1: "#1a1a2e", gradientColor2: "#2a2a4a",
            imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070",
            imageDataUrl: null, profileName: "Alex Mercer", profileTitle: "Lead Developer",
            profileStatus: "Building the future, one line of code at a time. 🚀",
            profilePicUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080",
            profilePicDataUrl: null, widgetVisibility: {},
            quoteApiUrl: "https://dummyjson.com/quotes/random",
            searchUrl: "https://www.google.com/search?q=",
            focusDuration: 25,
            breakDuration: 5
        };

        if (savedSettings) {
            settings = { ...defaultSettings, ...JSON.parse(savedSettings) };
        } else {
            settings = { ...defaultSettings };
            widgetVisibilityCheckboxes.forEach(cb => {
                settings.widgetVisibility[cb.dataset.widgetId] = true;
            });
        }
        
        lockGridToggle.checked = settings.gridLocked;
        fontSizeSlider.value = settings.fontSize;
        greetingTextInput.value = settings.greetingText;
        solidColorInput.value = settings.solidColor;
        gradientColor1Input.value = settings.gradientColor1;
        gradientColor2Input.value = settings.gradientColor2;
        document.querySelector(`input[name="bg-type"][value="${settings.bgType}"]`).checked = true;
        imageUrlInput.value = settings.imageUrl || '';
        profileNameInput.value = settings.profileName;
        profileTitleInput.value = settings.profileTitle;
        profileStatusInput.value = settings.profileStatus;
        profilePicUrlInput.value = settings.profilePicUrl || '';
        quoteApiUrlInput.value = settings.quoteApiUrl;
        searchUrlInput.value = settings.searchUrl;
        focusDurationInput.value = settings.focusDuration;
        breakDurationInput.value = settings.breakDuration;

        if (settings.widgetVisibility) {
            widgetVisibilityCheckboxes.forEach(cb => {
                cb.checked = settings.widgetVisibility[cb.dataset.widgetId] !== false;
            });
        }
        applySettingsFromObject(settings);
    }

    const allSettingsInputs = [ fontSizeSlider, greetingTextInput, solidColorInput, gradientColor1Input, gradientColor2Input, imageUrlInput, profileNameInput, profileTitleInput, profileStatusInput, profilePicUrlInput, quoteApiUrlInput, searchUrlInput, focusDurationInput, breakDurationInput ];
    allSettingsInputs.forEach(input => input.addEventListener('input', updateAndSaveSettings));
    bgTypeRadios.forEach(radio => radio.addEventListener('change', updateAndSaveSettings));
    widgetVisibilityCheckboxes.forEach(cb => cb.addEventListener('change', updateAndSaveSettings));
    lockGridToggle.addEventListener('change', updateAndSaveSettings);
    imageUploadInput.addEventListener('change', (e) => handleFileUpload(e, displayImage, imageUrlInput));
    profilePicUploadInput.addEventListener('change', (e) => handleFileUpload(e, profilePicDisplay, profilePicUrlInput));
    
    resetSettingsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset ALL data and settings to default? This includes notes, tasks, finances and bookmarks. This action cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    });
    
    function handleFileUpload(event, imageElement, urlInputElement) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageElement.src = e.target.result;
                if (urlInputElement) urlInputElement.value = '';
                updateAndSaveSettings();
            };
            reader.readAsDataURL(file);
        }
    }
    
    loadSettings();

    // --- Calendar Widget ---
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    function renderCalendar() {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        calendarMonthYear.textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        calendarGrid.innerHTML = '';
        ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
            const dayNameEl = document.createElement('div');
            dayNameEl.className = 'day-name'; dayNameEl.textContent = day;
            calendarGrid.appendChild(dayNameEl);
        });
        for (let i = 0; i < firstDayOfMonth; i++) { calendarGrid.appendChild(document.createElement('div')); }
        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'day'; dayEl.textContent = i;
            if (i === now.getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                dayEl.classList.add('today');
            }
            calendarGrid.appendChild(dayEl);
        }
    }
    renderCalendar();

    // --- Notes Widget Logic ---
    const notesListContainer = document.getElementById('notes-list-container');
    const addNoteBtn = document.getElementById('add-note-btn');
    let notes = JSON.parse(localStorage.getItem('notes')) || [{id: 1, title: 'Welcome Note', content: 'You can add, edit, and delete notes!'}];
    function saveNotes() { localStorage.setItem('notes', JSON.stringify(notes)); }
    function renderNotes() {
        notesListContainer.innerHTML = '';
        notes.forEach(note => {
            const noteEl = document.createElement('div');
            noteEl.className = 'notes-item'; noteEl.dataset.id = note.id;
            noteEl.innerHTML = `<div class="notes-header"><span class="notes-header-title">${note.title}</span><div class="notes-header-actions"><button class="edit-note-btn">✏️</button><button class="delete-note-btn">🗑️</button></div></div><div class="notes-content-body"><p>${note.content}</p></div>`;
            notesListContainer.appendChild(noteEl);
        });
    }
    notesListContainer.addEventListener('click', (e) => {
        const header = e.target.closest('.notes-header');
        const noteItem = e.target.closest('.notes-item');
        if (!noteItem) return;
        const noteId = parseInt(noteItem.dataset.id);
        if (e.target.classList.contains('edit-note-btn')) {
            const noteIndex = notes.findIndex(n => n.id === noteId);
            const newTitle = prompt('Enter new title:', notes[noteIndex].title);
            const newContent = prompt('Enter new content:', notes[noteIndex].content);
            if (newTitle !== null) notes[noteIndex].title = newTitle;
            if (newContent !== null) notes[noteIndex].content = newContent;
            saveNotes(); renderNotes();
        } else if (e.target.classList.contains('delete-note-btn')) {
            if (confirm('Are you sure you want to delete this note?')) {
                notes = notes.filter(n => n.id !== noteId);
                saveNotes(); renderNotes();
            }
        } else if (header) { header.nextElementSibling.classList.toggle('open'); }
    });
    addNoteBtn.addEventListener('click', () => {
        const title = prompt('Enter note title:');
        if (title) {
            const content = prompt('Enter note content:');
            notes.push({ id: Date.now(), title, content: content || '' });
            saveNotes(); renderNotes();
        }
    });
    renderNotes();
    
    // --- To-Do List Widget Logic ---
    const todoInput = document.getElementById('todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));
    const renderTasks = () => {
        todoList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `<input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}"><span data-index="${index}">${task.text}</span><div class="actions"><button class="edit-btn" data-index="${index}">✏️</button><button class="delete-btn" data-index="${index}">🗑️</button></div>`;
            todoList.appendChild(li);
        });
    };
    const addTask = () => {
        const text = todoInput.value.trim();
        if (text) {
            tasks.push({ text: text, completed: false });
            todoInput.value = '';
            saveTasks(); renderTasks();
        }
    };
    const handleListClick = (e) => {
        const index = e.target.dataset.index;
        if (index === undefined) return;
        if (e.target.type === 'checkbox') { tasks[index].completed = e.target.checked;
        } else if (e.target.tagName === 'SPAN') { tasks[index].completed = !tasks[index].completed;
        } else if (e.target.closest('.delete-btn')) { tasks.splice(index, 1);
        } else if (e.target.closest('.edit-btn')) {
            const newText = prompt('Edit task:', tasks[index].text);
            if (newText !== null && newText.trim() !== '') { tasks[index].text = newText.trim(); }
        }
        saveTasks(); renderTasks();
    };
    addTodoBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());
    todoList.addEventListener('click', handleListClick);
    renderTasks();

    // --- Clock Widget Logic ---
    const hourDigits = Array.from(document.querySelectorAll('#hours .flip-digit span'));
    const minuteDigits = Array.from(document.querySelectorAll('#minutes .flip-digit span'));
    const secondDigits = Array.from(document.querySelectorAll('#seconds .flip-digit span'));

    function updateDigit(digitSpan, newValue) {
        const oldValue = digitSpan.textContent;
        if (oldValue !== newValue) {
            digitSpan.textContent = newValue;
            digitSpan.classList.add('changing');
            digitSpan.addEventListener('animationend', () => {
                digitSpan.classList.remove('changing');
            }, { once: true });
        }
    }

    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');

        updateDigit(hourDigits[0], h[0]);
        updateDigit(hourDigits[1], h[1]);
        updateDigit(minuteDigits[0], m[0]);
        updateDigit(minuteDigits[1], m[1]);
        updateDigit(secondDigits[0], s[0]);
        updateDigit(secondDigits[1], s[1]);
    }

    setInterval(updateClock, 1000);
    updateClock();

    // --- Finance Widget Logic ---
    const financeBalance = document.getElementById('finance-balance');
    const financeIncomeTotal = document.getElementById('finance-income-total');
    const financeExpenseTotal = document.getElementById('finance-expense-total');
    const incomeTabBtn = document.getElementById('income-tab-btn');
    const expenseTabBtn = document.getElementById('expense-tab-btn');
    const financeForm = document.getElementById('finance-form');
    const transCategorySelect = document.getElementById('trans-category');
    const transDateInput = document.getElementById('trans-date');
    const transDescInput = document.getElementById('trans-description');
    const transAmountInput = document.getElementById('trans-amount');
    const transactionHistoryList = document.querySelector('#transaction-history ul');
    
    const newIncomeCatInput = document.getElementById('new-income-cat');
    const addIncomeCatBtn = document.getElementById('add-income-cat-btn');
    const newExpenseCatInput = document.getElementById('new-expense-cat');
    const addExpenseCatBtn = document.getElementById('add-expense-cat-btn');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let financeCategories = JSON.parse(localStorage.getItem('financeCategories')) || { income: ['Salary', 'Gifts'], expense: ['Food', 'Bills', 'Shopping'] };
    let currentTransactionType = 'income';

    const saveTransactions = () => localStorage.setItem('transactions', JSON.stringify(transactions));
    const saveFinanceCategories = () => localStorage.setItem('financeCategories', JSON.stringify(financeCategories));

    function renderFinanceCategories() {
        transCategorySelect.innerHTML = '';
        const categories = financeCategories[currentTransactionType];
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            transCategorySelect.appendChild(option);
        });
    }

    function updateFinanceSummary() {
        const amounts = transactions.map(t => t.amount);
        const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
        const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

        financeBalance.textContent = `₹${total}`;
        financeIncomeTotal.textContent = `₹${income}`;
        financeExpenseTotal.textContent = `₹${expense}`;
    }
    
    function renderTransactions() {
        transactionHistoryList.innerHTML = '';
        const recentTransactions = [...transactions].reverse().slice(0, 100);
        
        recentTransactions.forEach(trans => {
            const sign = trans.amount < 0 ? '-' : '+';
            const typeClass = trans.amount < 0 ? 'expense' : 'income';
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="trans-desc">${trans.description || 'Transaction'}</span>
                <span class="trans-cat">${trans.category}</span>
                <span class="trans-amount ${typeClass}">${sign}₹${Math.abs(trans.amount).toFixed(2)}</span>
            `;
            transactionHistoryList.appendChild(li);
        });
    }

    function handleAddTransaction(e) {
        e.preventDefault();
        const description = transDescInput.value;
        const category = transCategorySelect.value;
        const date = transDateInput.value;
        let amount = parseFloat(transAmountInput.value);

        if (isNaN(amount) || amount <= 0 || !category || !date) {
            alert('Please fill in all required fields with valid values.');
            return;
        }

        if (currentTransactionType === 'expense') {
            amount *= -1;
        }

        const newTransaction = { id: Date.now(), description, amount, category, date };
        transactions.push(newTransaction);
        saveTransactions();
        updateFinanceSummary();
        renderTransactions();
        financeForm.reset();
        transDateInput.valueAsDate = new Date();
    }

    function addFinanceCategory(type) {
        const input = type === 'income' ? newIncomeCatInput : newExpenseCatInput;
        const newCat = input.value.trim();
        if (newCat && !financeCategories[type].includes(newCat)) {
            financeCategories[type].push(newCat);
            saveFinanceCategories();
            renderFinanceCategories();
            input.value = '';
        } else if (!newCat) {
            alert('Category name cannot be empty.');
        } else {
            alert('This category already exists.');
        }
    }
    
    function initFinanceWidget() {
        transDateInput.valueAsDate = new Date();
        incomeTabBtn.addEventListener('click', () => {
            currentTransactionType = 'income';
            incomeTabBtn.classList.add('active');
            expenseTabBtn.classList.remove('active');
            renderFinanceCategories();
        });
        expenseTabBtn.addEventListener('click', () => {
            currentTransactionType = 'expense';
            expenseTabBtn.classList.add('active');
            incomeTabBtn.classList.remove('active');
            renderFinanceCategories();
        });

        financeForm.addEventListener('submit', handleAddTransaction);
        addIncomeCatBtn.addEventListener('click', () => addFinanceCategory('income'));
        addExpenseCatBtn.addEventListener('click', () => addFinanceCategory('expense'));

        renderFinanceCategories();
        updateFinanceSummary();
        renderTransactions();
    }
    initFinanceWidget();

    // --- Bookmarks Widget Logic ---
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const addBookmarkForm = document.getElementById('add-bookmark-form');
    const newBookmarkCatInput = document.getElementById('new-bookmark-cat');
    const addBookmarkCatBtn = document.getElementById('add-bookmark-cat-btn');
    const bookmarkCategorySelect = document.getElementById('bookmark-category');
    const manageBookmarksList = document.getElementById('manage-bookmarks-list');

    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    let bookmarkCategories = JSON.parse(localStorage.getItem('bookmarkCategories')) || ['Social', 'Work', 'News'];
    
    const saveBookmarks = () => localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    const saveBookmarkCategories = () => localStorage.setItem('bookmarkCategories', JSON.stringify(bookmarkCategories));

    function getFaviconUrl(url) {
        try {
            const urlObject = new URL(url);
            return `https://icons.duckduckgo.com/ip3/${urlObject.hostname}.ico`;
        } catch (error) {
            return 'https://icons.duckduckgo.com/ip3/duckduckgo.com.ico';
        }
    }

    function renderAllBookmarkUI() {
        renderBookmarks();
        renderManageBookmarksList();
    }

    function renderBookmarks() {
        bookmarksContainer.innerHTML = '';
        bookmarks.forEach(bookmark => {
            const faviconUrl = getFaviconUrl(bookmark.url);
            const bookmarkEl = document.createElement('a');
            bookmarkEl.className = 'bookmark-item';
            bookmarkEl.href = bookmark.url;
            bookmarkEl.target = '_blank';
            bookmarkEl.title = `${bookmark.name}\n${bookmark.url}`;
            bookmarkEl.innerHTML = `
                <div class="bookmark-icon-wrapper">
                    <img src="${faviconUrl}" alt="${bookmark.name} favicon">
                </div>
                <span class="bookmark-name">${bookmark.name}</span>
                <button class="bookmark-delete-btn" data-id="${bookmark.id}">&times;</button>
            `;
            bookmarksContainer.appendChild(bookmarkEl);
        });
    }

    function renderManageBookmarksList() {
        manageBookmarksList.innerHTML = '';
        if (bookmarks.length === 0) {
            manageBookmarksList.innerHTML = '<div class="bookmark-manage-item"><span>No bookmarks yet.</span></div>';
            return;
        }
        bookmarks.forEach(bookmark => {
            const itemEl = document.createElement('div');
            itemEl.className = 'bookmark-manage-item';
            itemEl.innerHTML = `
                <span title="${bookmark.url}">${bookmark.name}</span>
                <button class="bookmark-manage-delete-btn" data-id="${bookmark.id}">Remove</button>
            `;
            manageBookmarksList.appendChild(itemEl);
        });
    }

    function renderBookmarkCategoryDropdown() {
        bookmarkCategorySelect.innerHTML = '';
        bookmarkCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            bookmarkCategorySelect.appendChild(option);
        });
    }

    addBookmarkCatBtn.addEventListener('click', () => {
        const newCat = newBookmarkCatInput.value.trim();
        if (newCat && !bookmarkCategories.includes(newCat)) {
            bookmarkCategories.push(newCat);
            saveBookmarkCategories();
            renderBookmarkCategoryDropdown();
            newBookmarkCatInput.value = '';
        } else if (bookmarkCategories.includes(newCat)) {
            alert('This category already exists.');
        }
    });

    addBookmarkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('bookmark-name').value;
        const url = document.getElementById('bookmark-url').value;
        const category = document.getElementById('bookmark-category').value;
        
        bookmarks.push({ id: Date.now(), name, url, category });
        saveBookmarks();
        renderAllBookmarkUI();
        addBookmarkForm.reset();
    });

    function deleteBookmark(bookmarkId) {
        if (confirm('Are you sure you want to delete this bookmark?')) {
            bookmarks = bookmarks.filter(b => b.id !== bookmarkId);
            saveBookmarks();
            renderAllBookmarkUI();
        }
    }

    bookmarksContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('bookmark-delete-btn')) {
            e.preventDefault(); e.stopPropagation();
            const bookmarkId = parseInt(e.target.dataset.id);
            deleteBookmark(bookmarkId);
        }
    });
    
    manageBookmarksList.addEventListener('click', (e) => {
        if(e.target.classList.contains('bookmark-manage-delete-btn')) {
            const bookmarkId = parseInt(e.target.dataset.id);
            bookmarks = bookmarks.filter(b => b.id !== bookmarkId);
            saveBookmarks();
            renderAllBookmarkUI();
        }
    });

    renderAllBookmarkUI();
    renderBookmarkCategoryDropdown();

    // --- Quote Widget Logic ---
    async function fetchQuote() {
        const widget = document.getElementById('quote-widget');
        if (!widget) return;
        
        const quoteTextEl = document.getElementById('quote-text');
        const quoteAuthorEl = document.getElementById('quote-author');
        
        quoteTextEl.textContent = "Fetching...";
        quoteAuthorEl.textContent = "";

        const defaultApiUrl = "https://dummyjson.com/quotes/random";
        let apiUrl = (JSON.parse(localStorage.getItem('dashboardSettings')) || {}).quoteApiUrl || defaultApiUrl;

        try {
            const urlToFetch = apiUrl + (apiUrl.includes('?') ? '&' : '?') + 'timestamp=' + new Date().getTime();
            const response = await fetch(urlToFetch, { cache: 'no-cache' });
            if (!response.ok) throw new Error(`Network response was not ok (status: ${response.status})`);
            const data = await response.json();

            if (data && data.quote && data.author) { // For dummyjson.com
                quoteTextEl.textContent = `"${data.quote}"`;
                quoteAuthorEl.textContent = `— ${data.author}`;
            } else if (data && data.content && data.author) { // Fallback for quotable.io
                quoteTextEl.textContent = `"${data.content}"`;
                quoteAuthorEl.textContent = `— ${data.author}`;
            } else {
                throw new Error("Unexpected API response structure.");
            }
        } catch (error) {
            quoteTextEl.textContent = "Could not fetch a quote.";
            quoteAuthorEl.textContent = "Check API URL or network.";
            console.error("Error fetching quote:", error);
        }
    }

    function initQuoteWidget() {
        const refreshBtn = document.getElementById('refresh-quote-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', fetchQuote);
        }
        
        const quoteApiUrlInput = document.getElementById('quote-api-url');
        if (quoteApiUrlInput) {
            quoteApiUrlInput.addEventListener('change', fetchQuote);
        }

        fetchQuote(); // Initial fetch on load
    }
    initQuoteWidget();
    
    // --- Search Widget Logic ---
    function initSearchWidget() {
        const form = document.getElementById('search-form');
        if (!form) return;
        
        const input = document.getElementById('search-input');
        const defaultSearchUrl = "https://www.google.com/search?q=";
         let searchUrl = (JSON.parse(localStorage.getItem('dashboardSettings')) || {}).searchUrl || defaultSearchUrl;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = input.value.trim();
            if (query) {
                searchUrl = (JSON.parse(localStorage.getItem('dashboardSettings')) || {}).searchUrl || defaultSearchUrl;
                window.open(searchUrl + encodeURIComponent(query), '_blank');
                input.value = '';
            }
        });
    }
    initSearchWidget();

    // --- Focus Timer Logic ---
    function initFocusTimerWidget() {
        const widget = document.getElementById('focus-timer-widget');
        if (!widget) return;

        const timeDisplay = document.getElementById('timer-time');
        const sessionDisplay = document.getElementById('timer-session');
        const startPauseBtn = document.getElementById('timer-start-pause');
        const resetBtn = document.getElementById('timer-reset');
        const progressCircle = widget.querySelector('.timer-progress');
        const sound = document.getElementById('timer-sound');
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        progressCircle.style.strokeDasharray = circumference;

        let timerId;
        let isRunning = false;
        let sessionType = 'focus'; // 'focus' or 'break'
        let timeLeft;
        let totalTime;

        function getDurations() {
            const settings = JSON.parse(localStorage.getItem('dashboardSettings')) || {};
            const focusMins = parseInt(settings.focusDuration, 10) || 25;
            const breakMins = parseInt(settings.breakDuration, 10) || 5;
            return { focus: focusMins * 60, break: breakMins * 60 };
        }

        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            const offset = circumference - (timeLeft / totalTime) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        function switchSession() {
            sessionType = sessionType === 'focus' ? 'break' : 'focus';
            sessionDisplay.textContent = sessionType;
            resetTimer();
        }

        function tick() {
            timeLeft--;
            updateDisplay();
            if (timeLeft < 0) {
                clearInterval(timerId);
                sound.play();
                switchSession();
                startTimer(); // Auto-start next session
            }
        }

        function startTimer() {
            if (isRunning) return;
            isRunning = true;
            startPauseBtn.textContent = 'Pause';
            timerId = setInterval(tick, 1000);
        }

        function pauseTimer() {
            if (!isRunning) return;
            isRunning = false;
            startPauseBtn.textContent = 'Start';
            clearInterval(timerId);
        }

        function resetTimer() {
            clearInterval(timerId);
            isRunning = false;
            startPauseBtn.textContent = 'Start';
            const durations = getDurations();
            timeLeft = durations[sessionType];
            totalTime = durations[sessionType];
            updateDisplay();
        }

        startPauseBtn.addEventListener('click', () => {
            if (isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        });

        resetBtn.addEventListener('click', resetTimer);
        focusDurationInput.addEventListener('input', resetTimer);
        breakDurationInput.addEventListener('input', resetTimer);

        resetTimer(); // Initialize on load
    }
    initFocusTimerWidget();

    // --- Dock Widgets Logic ---
    function initDockWidget(type) {
        const isHorizontal = type === 'horizontal';
        const container = document.querySelector(isHorizontal ? '.horizontal-dock-container' : '.vertical-dock-container');
        const form = document.getElementById(isHorizontal ? 'add-horizontal-dock-form' : 'add-vertical-dock-form');
        const manageList = document.getElementById(isHorizontal ? 'manage-horizontal-dock-list' : 'manage-vertical-dock-list');
        const storageKey = isHorizontal ? 'horizontalDockItems' : 'verticalDockItems';
        
        let items = JSON.parse(localStorage.getItem(storageKey)) || [];
        const saveItems = () => localStorage.setItem(storageKey, JSON.stringify(items));

        function render() {
            container.innerHTML = '';
            items.forEach(item => {
                const faviconUrl = getFaviconUrl(item.url);
                const itemEl = document.createElement('a');
                itemEl.className = 'dock-item';
                itemEl.href = item.url;
                itemEl.target = '_blank';
                itemEl.title = item.name;
                itemEl.innerHTML = `
                    <div class="dock-item-icon"><img src="${faviconUrl}" alt="${item.name}"></div>
                    <span class="dock-item-name">${item.name}</span>
                `;
                container.appendChild(itemEl);
            });
        }

        function renderManageList() {
            manageList.innerHTML = '';
            if (items.length === 0) {
                manageList.innerHTML = '<div class="dock-manage-item"><span>No items yet.</span></div>';
                return;
            }
            items.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'dock-manage-item';
                itemEl.innerHTML = `
                    <span title="${item.url}">${item.name}</span>
                    <button class="dock-manage-delete-btn" data-index="${index}">Remove</button>
                `;
                manageList.appendChild(itemEl);
            });
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = e.target.elements.name.value;
            const url = e.target.elements.url.value;
            items.push({ id: Date.now(), name, url });
            saveItems();
            render();
            renderManageList();
            form.reset();
        });

        manageList.addEventListener('click', (e) => {
            if(e.target.classList.contains('dock-manage-delete-btn')) {
                const index = parseInt(e.target.dataset.index);
                items.splice(index, 1);
                saveItems();
                render();
                renderManageList();
            }
        });

        render();
        renderManageList();
    }

    initDockWidget('horizontal');
    initDockWidget('vertical');

    // --- Apply Saved Layout and Grid Logic ---
    const savedLayout = JSON.parse(localStorage.getItem('widgetLayout'));
    if (savedLayout) {
        savedLayout.forEach(layout => {
            const widget = document.getElementById(layout.id);
            if (widget) {
                widget.dataset.col = layout.col;
                widget.dataset.row = layout.row;
                widget.dataset.colSpan = layout.colSpan;
                widget.dataset.rowSpan = layout.rowSpan;
            }
        });
    }

    // --- Grid Logic ---
    const gridContainer = document.getElementById('grid-container');
    const placeholder = document.getElementById('placeholder');
    const GRID_COLS = 16, GRID_ROWS = 9;
    let gridState = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));
    let draggedWidget = null, resizeHandle = null;
    function updateGridState(widget) { 
        if (!widget || widget.style.display === 'none') return;
        const col = parseInt(widget.dataset.col), row = parseInt(widget.dataset.row);
        const colSpan = parseInt(widget.dataset.colSpan), rowSpan = parseInt(widget.dataset.rowSpan);
        for (let r = 0; r < GRID_ROWS; r++) { for (let c = 0; c < GRID_COLS; c++) { if (gridState[r][c] === widget.id) gridState[r][c] = null; } }
        for (let r = row - 1; r < row - 1 + rowSpan && r < GRID_ROWS; r++) { for (let c = col - 1; c < col - 1 + colSpan && c < GRID_COLS; c++) { gridState[r][c] = widget.id; } }
    }
    function isAreaAvailable(startCol, startRow, colSpan, rowSpan, widgetId) {
        if (startCol < 1 || startRow < 1 || startCol + colSpan - 1 > GRID_COLS || startRow + rowSpan - 1 > GRID_ROWS) return false;
        for (let r = startRow - 1; r < startRow - 1 + rowSpan; r++) { 
            for (let c = startCol - 1; c < startCol - 1 + colSpan; c++) { 
                const occupyingId = gridState[r][c];
                if (occupyingId !== null && occupyingId !== widgetId) {
                    const occupyingWidget = document.getElementById(occupyingId);
                    if (occupyingWidget && occupyingWidget.style.display !== 'none') {
                        return false; 
                    }
                }
            }
        }
        return true;
    }
    function applyGridStyles(el) { el.style.gridColumn = `${el.dataset.col} / span ${el.dataset.colSpan}`; el.style.gridRow = `${el.dataset.row} / span ${el.dataset.rowSpan}`; }
    document.querySelectorAll('.widget').forEach(widget => {
        applyGridStyles(widget);
        updateGridState(widget);
        widget.addEventListener('dragstart', (e) => {
            if (e.target.closest('input, button, select, textarea, .notes-header, .actions, .widget-content, .bookmark-item, .dock-item')) { e.preventDefault(); return; }
            draggedWidget = widget;
            setTimeout(() => widget.classList.add('dragging'), 0);
        });
        widget.addEventListener('dragend', () => { draggedWidget = null; placeholder.style.display = 'none'; widget.classList.remove('dragging'); });
        const resizer = widget.querySelector('.resizer');
        resizer.addEventListener('mousedown', (e) => { 
            e.preventDefault(); e.stopPropagation(); resizeHandle = widget;
            const startX = e.clientX, startY = e.clientY;
            const cellWidth = gridContainer.offsetWidth / GRID_COLS, cellHeight = gridContainer.offsetHeight / GRID_ROWS;
            const initialColSpan = parseInt(resizeHandle.dataset.colSpan), initialRowSpan = parseInt(resizeHandle.dataset.rowSpan);
            function handleMouseMove(me) {
                const dx = me.clientX - startX, dy = me.clientY - startY;
                const colSpanChange = Math.round(dx / cellWidth), rowSpanChange = Math.round(dy / cellHeight);
                let newColSpan = Math.max(1, initialColSpan + colSpanChange), newRowSpan = Math.max(1, initialRowSpan + rowSpanChange);
                const startCol = parseInt(resizeHandle.dataset.col), startRow = parseInt(resizeHandle.dataset.row);
                if (isAreaAvailable(startCol, startRow, newColSpan, newRowSpan, resizeHandle.id)) {
                     resizeHandle.style.gridColumnEnd = `span ${newColSpan}`; resizeHandle.style.gridRowEnd = `span ${newRowSpan}`;
                }
            }
            function handleMouseUp() {
                const finalColSpan = parseInt(getComputedStyle(resizeHandle).gridColumnEnd.replace('span ', '')),
                      finalRowSpan = parseInt(getComputedStyle(resizeHandle).gridRowEnd.replace('span ', ''));
                resizeHandle.dataset.colSpan = finalColSpan; resizeHandle.dataset.rowSpan = finalRowSpan;
                updateGridState(resizeHandle);
                document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp);
                resizeHandle = null;
            }
            document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
        });
    });
    gridContainer.addEventListener('dragover', (e) => {
        e.preventDefault(); if (!draggedWidget) return;
        const rect = gridContainer.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top;
        const col = Math.floor(x / (rect.width / GRID_COLS)) + 1, row = Math.floor(y / (rect.height / GRID_ROWS)) + 1;
        const colSpan = parseInt(draggedWidget.dataset.colSpan), rowSpan = parseInt(draggedWidget.dataset.rowSpan);
        placeholder.style.display = 'block'; placeholder.style.gridColumn = `${col} / span ${colSpan}`; placeholder.style.gridRow = `${row} / span ${rowSpan}`;
        if (isAreaAvailable(col, row, colSpan, rowSpan, draggedWidget.id)) {
            placeholder.style.backgroundColor = 'rgba(70, 130, 180, 0.3)'; placeholder.style.borderColor = 'steelblue'; e.dataTransfer.dropEffect = 'move';
        } else {
            placeholder.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; placeholder.style.borderColor = 'red'; e.dataTransfer.dropEffect = 'none';
        }
    });
    gridContainer.addEventListener('drop', (e) => {
        e.preventDefault(); if (!draggedWidget) return;
        const gridRect = gridContainer.getBoundingClientRect(), x = e.clientX - gridRect.left, y = e.clientY - gridRect.top;
        let col = Math.floor(x / (gridRect.width / GRID_COLS)) + 1, row = Math.floor(y / (gridRect.height / GRID_ROWS)) + 1;
        const colSpan = parseInt(draggedWidget.dataset.colSpan), rowSpan = parseInt(draggedWidget.dataset.rowSpan);
        if (isAreaAvailable(col, row, colSpan, rowSpan, draggedWidget.id)) {
            draggedWidget.dataset.col = col; draggedWidget.dataset.row = row;
            applyGridStyles(draggedWidget); updateGridState(draggedWidget);
        }
        placeholder.style.display = 'none';
    });
    
    // --- START: Import/Export Logic ---
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file-input');

    exportBtn.addEventListener('click', () => {
        const dataToExport = {};
        const localStorageKeys = ['dashboardSettings', 'notes', 'tasks', 'transactions', 'financeCategories', 'bookmarks', 'bookmarkCategories', 'horizontalDockItems', 'verticalDockItems'];
        dataToExport.localStorageData = {};
        localStorageKeys.forEach(key => {
            const item = localStorage.getItem(key);
            if (item) { dataToExport.localStorageData[key] = JSON.parse(item); }
        });

        dataToExport.widgetLayout = [];
        document.querySelectorAll('.widget').forEach(widget => {
            dataToExport.widgetLayout.push({
                id: widget.id,
                col: widget.dataset.col,
                row: widget.dataset.row,
                colSpan: widget.dataset.colSpan,
                rowSpan: widget.dataset.rowSpan
            });
        });

        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-config-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importBtn.addEventListener('click', () => { importFileInput.click(); });
    importFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!importedData.localStorageData || !importedData.widgetLayout) {
                    throw new Error("Invalid configuration file format.");
                }
                localStorage.clear();
                for (const key in importedData.localStorageData) {
                    localStorage.setItem(key, JSON.stringify(importedData.localStorageData[key]));
                }
                localStorage.setItem('widgetLayout', JSON.stringify(importedData.widgetLayout));
                alert('Configuration imported successfully! The page will now reload.');
                location.reload();
            } catch (error) {
                console.error("Failed to import configuration:", error);
                alert(`Error: Failed to import configuration.\n${error.message}`);
            } finally {
                importFileInput.value = '';
            }
        };
        reader.readAsText(file);
    });
    // --- END: Import/Export Logic ---
});