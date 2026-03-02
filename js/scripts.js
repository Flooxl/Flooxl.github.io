// --- МОКОВЫЕ ДАННЫЕ (Подготовка под localStorage) ---
const mockData = {
    achievements: [
        { id: 1, icon: "🔥", title: "Первая кровь", desc: "Сыграть первую игру в системе.", progress: 1, maxProgress: 1, locked: false },
        { id: 2, icon: "👑", title: "Идеальный инспектор", desc: "Пройти Cyber Inspector без единой ошибки.", progress: 0, maxProgress: 1, locked: true },
        { id: 3, icon: "🧠", title: "Мегамозг", desc: "Запомнить 50 элементов в Remember Me.", progress: 12, maxProgress: 50, locked: true },
        { id: 4, icon: "🧹", title: "Чистый стол", desc: "Убрать 100 предметов в Clean Desk.", progress: 100, maxProgress: 100, locked: false },
        { id: 5, icon: "🛡️", title: "Мастер защиты", desc: "Отразить 10 фишинговых атак в Security OS.", progress: 7, maxProgress: 10, locked: true }
    ],
    statistics: {
        summary: { totalGames: 47, totalPoints: 1250, recordLevel: 12 },
        games: [
            { id: "clean-desk", name: "Clean Desk", attempts: 15, bestScore: 500, avgScore: 320, lastPlayed: "2024-03-01" },
            { id: "cyber-inspector", name: "Cyber Inspector", attempts: 10, bestScore: 1000, avgScore: 850, lastPlayed: "2024-03-02" },
            { id: "remember-me", name: "Remember Me", attempts: 22, bestScore: 300, avgScore: 150, lastPlayed: "2024-02-28" }
        ]
    },
    leaderboards: {
        "clean-desk": [
            { rank: 1, name: "Neo", score: 550, date: "2024-03-01" },
            { rank: 2, name: "Игрок", score: 500, date: "2024-03-01" },
            { rank: 3, name: "Trinity", score: 480, date: "2024-02-29" }
        ],
        "cyber-inspector": [
            { rank: 1, name: "Admin_God", score: 1200, date: "2024-02-28" },
            { rank: 2, name: "Игрок", score: 1000, date: "2024-03-02" },
            { rank: 3, name: "Guest404", score: 850, date: "2024-03-02" }
        ]
    }
};

// --- ЛОГИКА БОКОВОЙ ПАНЕЛИ ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Закрытие меню по клавише Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
});


// --- ЛОГИКА ВКЛАДОК (TAB BAR & ЭКРАНЫ) ---
function switchTab(targetTabId) {
    // Скрываем все панели
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    // Показываем нужную
    const targetPanel = document.getElementById(targetTabId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }

    // Обновляем активный класс в нижней панели
    document.querySelectorAll('.bottom-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === targetTabId);
    });

    // Обновляем активный класс в сайдбаре
    document.querySelectorAll('.sidebar .menu-link').forEach(link => {
        // Убираем у всех
        link.classList.remove('active');
        // Ставим тому, кто совпадает по data-tab
        if (link.getAttribute('data-tab') === targetTabId) {
            link.classList.add('active');
        }
    });

    // Закрываем сайдбар, если он был открыт
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('active')) {
        toggleSidebar();
    }
    
    // Скролл наверх страницы при переключении
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// --- РЕНДЕР ДАННЫХ ИЗ JSON ---
function renderAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    container.innerHTML = mockData.achievements.map(a => `
        <div class="ach-card ${a.locked ? 'locked' : ''}">
            <div class="ach-status">${a.locked ? 'LOCKED' : 'UNLOCKED'}</div>
            <div class="ach-icon">${a.icon}</div>
            <div class="ach-info">
                <h3 class="ach-title">${a.title}</h3>
                <p class="ach-desc">${a.desc}</p>
                <div class="ach-progress-bar">
                    <div class="ach-progress-fill" style="width: ${(a.progress / a.maxProgress) * 100}%"></div>
                </div>
                <div style="font-family: var(--font-tech); font-size: 0.8em; color: var(--gray-dark);">
                    PROGRESS: ${a.progress} / ${a.maxProgress}
                </div>
            </div>
        </div>
    `).join('');
}

function renderStatistics() {
    const summaryContainer = document.getElementById('stats-summary-container');
    const tableContainer = document.getElementById('stats-table-container');
    if (!summaryContainer || !tableContainer) return;

    // Рендер сводки
    summaryContainer.innerHTML = `
        <div class="stat-box">
            <div class="stat-box-title">СЫГРАНО ИГР</div>
            <div class="stat-box-value">${mockData.statistics.summary.totalGames}</div>
        </div>
        <div class="stat-box">
            <div class="stat-box-title">СУММАРНЫЕ ОЧКИ</div>
            <div class="stat-box-value">${mockData.statistics.summary.totalPoints}</div>
        </div>
        <div class="stat-box">
            <div class="stat-box-title">МАКС. УРОВЕНЬ</div>
            <div class="stat-box-value">${mockData.statistics.summary.recordLevel}</div>
        </div>
    `;

    // Рендер таблицы
    tableContainer.innerHTML = `
        <div style="overflow-x: auto;">
            <table class="sys-table">
                <thead>
                    <tr>
                        <th>Игра</th>
                        <th>Попытки</th>
                        <th>Лучший результат</th>
                        <th>Средний балл</th>
                        <th>Последний запуск</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.statistics.games.map(g => `
                        <tr>
                            <td style="font-weight: bold;">${g.name}</td>
                            <td>${g.attempts}</td>
                            <td style="color: var(--accent); font-weight: bold; background: var(--black);">${g.bestScore}</td>
                            <td>${g.avgScore}</td>
                            <td style="font-family: var(--font-tech);">${g.lastPlayed}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderLeaderboards() {
    const selectorsContainer = document.getElementById('leaderboard-selectors');
    const listContainer = document.getElementById('leaderboard-container');
    if (!selectorsContainer || !listContainer) return;

    // Получаем список игр из объекта (ключи)
    const gameKeys = Object.keys(mockData.leaderboards);
    
    // Рендерим кнопки выбора игры
    selectorsContainer.innerHTML = gameKeys.map((key, index) => `
        <div class="lb-tab ${index === 0 ? 'active' : ''}" data-game="${key}">
            ${key.replace('-', ' ')}
        </div>
    `).join('');

    // Функция для отрисовки таблицы конкретной игры
    const drawTable = (gameKey) => {
        const data = mockData.leaderboards[gameKey];
        listContainer.innerHTML = `
            <div style="overflow-x: auto;">
                <table class="sys-table">
                    <thead>
                        <tr>
                            <th>Место</th>
                            <th>Агент (Ник)</th>
                            <th>Очки</th>
                            <th>Дата</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(r => `
                            <tr>
                                <td style="font-size: 1.2em; font-weight: bold;">#${r.rank}</td>
                                <td style="font-weight: bold;">${r.name}</td>
                                <td style="color: var(--accent); font-weight: bold; background: var(--black);">${r.score}</td>
                                <td style="font-family: var(--font-tech);">${r.date}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    // Отрисовываем дефолтную (первую) игру
    drawTable(gameKeys[0]);

    // Вешаем слушатели на кнопки переключения лидерборда
    const lbTabs = selectorsContainer.querySelectorAll('.lb-tab');
    lbTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            lbTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            drawTable(e.target.getAttribute('data-game'));
        });
    });
}


// --- ИНИЦИАЛИЗАЦИЯ (DOM Content Loaded) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Инициализация данных для новых вкладок
    renderAchievements();
    renderStatistics();
    renderLeaderboards();

    // 2. Слушатели кликов по табам (нижняя панель и сайдбар)
    const tabTriggers = document.querySelectorAll('[data-tab]');
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault(); // Если это ссылка <a> в меню
            const targetTab = trigger.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // 3. IntersectionObserver (анимации появления при скролле)
    const sections = document.querySelectorAll('.observe-section');
    const railDots = document.querySelectorAll('.rail-dot');
    const railNumber = document.querySelector('.rail-number');

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                const index = entry.target.getAttribute('data-index');
                if (index) {
                    railDots.forEach(dot => dot.classList.remove('active'));
                    const activeDot = document.querySelector(`.rail-dot[data-target="${index}"]`);
                    if (activeDot) activeDot.classList.add('active');
                    if (railNumber) railNumber.textContent = index;
                }
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    // 4. Микро-анимации карточек (3D Tilt) - старый функционал
    const cards = document.querySelectorAll('.game-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!prefersReducedMotion.matches) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; 
                const y = e.clientY - rect.top;  
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const tiltX = ((y - centerY) / centerY) * -4; 
                const tiltY = ((x - centerX) / centerX) * 4;
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }
});