// --- НАСТРОЙКИ API ---
// Замени URL на свой опубликованный Worker (в Cloudflare)
const API_BASE = 'https://sys-games-auth.likirill.workers.dev'; 

// === КОНФИГУРАЦИЯ ИГР И АЧИВОК ===
const GAME_CONFIG = {
    CleanDesk: {
        name: "Clean Desk", image: "gameicons/cleandesk.png", url: "CleanDesk/index.html",
        desc: "Рабочий день окончен! Осмотрите своё место и уберите все личные вещи. Ничего не должно остаться — проверьте внимательно.",
        achievements: [
            { id: "perfect_cleanup", title: "Идеальный порядок", desc: "Завершить смену без единого штрафа.", target: 1, getProgress: (stats) => stats.score === 100 ? 1 : 0 }
        ]
    },
    CyberInspector: {
        name: "Cyber Inspector", image: "gameicons/CyberInspector.png", url: "CyberInspector/index.html",
        desc: "Входящий запрос. Письмо от банка, сертификат, файл во вложении. Всё выглядит легитимно — почти... Проверьте данные. Примите решение.",
        achievements: [
            { id: "perfect_inspector", title: "Безошибочный", desc: "Пройти смену без пропуска угроз.", target: 1, getProgress: (stats) => (stats.achievements || []).includes('perfect_inspector') ? 1 : 0 },
            { id: "veteran_inspector", title: "Ветеран IT-таможни", desc: "Дожить до 5-го дня (Streak).", target: 5, getProgress: (stats) => Math.min(stats.streak || 0, 5) }
        ]
    },
    KeeptalkingAndNobodyHacked: {
        name: "Keep Talking and Nobody Hacked", image: "gameicons/KeepTalking.png", url: "KeeptalkingAndNobodyHacked/index.html",
        desc: "Система под атакой. Модули заражены. Используя руководство, анализируйте данные и обезвреживайте угрозы. Ошибка — и система будет взломана.",
        achievements: [
            { id: "defender_pro", title: "Защитник PRO", desc: "Достигнуть 10-го уровня угрозы.", target: 10, getProgress: (stats) => Math.min(stats.streak || 0, 10) }
        ]
    },
    NoIAMNotAHacker: {
        name: "Not I Am Not a Hacker", image: "gameicons/NoH.png", url: "NoIAmNotAHacker/index.html",
        desc: "Поток запросов на публикацию. Кто-то пришёл с добром, кто-то маскирует взлом под длинной ссылкой. Ваша работа — отличить норму от угрозы.",
        achievements: [
            { id: "master_moderator", title: "Мастер модерации", desc: "Проверить 50 запросов за сессию.", target: 50, getProgress: (stats) => Math.min(stats.score || 0, 50) },
            { id: "flawless_start", title: "Чистый старт", desc: "Проверить 10 IP без ошибок.", target: 1, getProgress: (stats) => (stats.achievements || []).includes('flawless_start') ? 1 : 0 }
        ]
    },
    RememberMe: {
        name: "Remember Me", image: "gameicons/RememberMe.png", url: "RememberMe/index.html",
        desc: "Входящий инцидент. Поток запросов, зашифрованные файлы, утечка данных. Что это — DDoS, ransomware, фишинг? Определите угрозу.",
        achievements: [
            { id: "memory_master", title: "Феноменальная память", desc: "Дать 15 правильных ответов.", target: 15, getProgress: (stats) => Math.min((stats.score || 0) / 50, 15) },
            { id: "story_cleared", title: "Сюжет пройден", desc: "Завершить кампанию.", target: 1, getProgress: (stats) => (stats.achievements || []).includes('story_cleared') ? 1 : 0 }
        ]
    },
    SecurityAwarnessOS: {
        name: "Security Awareness OS", image: "gameicons/SecOS.png", url: "SecurityAwarnessOS/index.html",
        desc: "Симуляция системы безопасности. Управляйте защитой, анализируйте угрозы и принимайте решения для защиты системы.",
        achievements: [
            { id: "password_master", title: "Парольный гений", desc: "Собрать пароль по всем 16 правилам.", target: 1, getProgress: (stats) => (stats.achievements || []).includes('password_master') ? 1 : 0 },
            { id: "social_engineer_pro", title: "Анти-СИ", desc: "Вычислить мошенников во всех 10 чатах.", target: 10, getProgress: (stats) => Math.min(stats.streak || 0, 10) }
        ]
    }
};

/* === ТЕМЫ (Светлая / Темная) === */
function initTheme() {
    const savedTheme = localStorage.getItem('site_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-btn').innerText = savedTheme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('site_theme', newTheme);
    document.getElementById('theme-btn').innerText = newTheme === 'dark' ? '☀️' : '🌙';
}

/* === ЗАПУСК ИГРЫ (Глобальная функция) === */
window.playGame = function(url) {
    console.log("Запуск игры:", url);
    location.href = url; // Переход на папку с игрой
};

/* === АВТОРИЗАЦИЯ === */
async function checkAuth() {
    const token = localStorage.getItem('sys_token');
    if (!token) { showAuthScreen(); return; }

    try {
        const res = await fetch(`${API_BASE}/api/me`, { headers: { 'Authorization': `Bearer ${token}` }});
        if (res.ok) {
            const data = await res.json();
            document.getElementById('display-username').textContent = data.username;
            document.getElementById('user-avatar-initial').textContent = data.username.charAt(0).toUpperCase();
            document.getElementById('prof-page-username').textContent = data.username;
            document.getElementById('prof-page-avatar').textContent = data.username.charAt(0).toUpperCase();
            document.getElementById('prof-page-email').textContent = data.email;
            document.getElementById('greeting-text').textContent = `Привет, ${data.username}!`;
            
            await syncLocalToServer();
            await loadAllData();
            showAppScreen();
        } else {
            localStorage.removeItem('sys_token');
            showAuthScreen();
        }
    } catch (e) { showAuthScreen(); }
}

function showAuthScreen() { document.getElementById('auth-screen').style.display = 'flex'; document.getElementById('app-screen').style.display = 'none'; }
function showAppScreen() { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('app-screen').style.display = 'block'; }
function toggleAuthMode(e) { e.preventDefault(); document.getElementById('login-form').classList.toggle('active'); document.getElementById('register-form').classList.toggle('active'); document.getElementById('login-error').innerText = ''; document.getElementById('reg-error').innerText = ''; }

/* === ЗАГРУЗКА ДАННЫХ И ПРОГРЕССА === */
let userStatsMap = {}; // key: game_id, value: stats object

async function syncLocalToServer() {
    const token = localStorage.getItem('sys_token');
    if (!token) return;
    
    // Берем данные, которые игры сохранили оффлайн (или перед выходом)
    const localData = JSON.parse(localStorage.getItem('sys_local_stats')) || {};
    
    for (const [game_id, data] of Object.entries(localData)) {
        let hasUpdate = (data.score !== undefined || data.streak !== undefined || data.add_run);
        
        if (hasUpdate) {
            await fetch(`${API_BASE}/api/games/update-stats`, { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ game_id, best_score: data.score, best_streak: data.streak, add_run: data.add_run }) 
            });
        }
        if (data.achievements) {
            for (const ach of data.achievements) {
                await fetch(`${API_BASE}/api/games/add-achievement`, { 
                    method: 'POST', 
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ game_id, achievement: ach }) 
                });
            }
        }
    }
    
    // Очищаем локальное хранилище после отправки на сервер
    localStorage.removeItem('sys_local_stats');
}

async function loadAllData() {
    const token = localStorage.getItem('sys_token');
    try {
        const res = await fetch(`${API_BASE}/api/games/stats`, { headers: { 'Authorization': `Bearer ${token}` }});
        if (res.ok) {
            const data = await res.json();
            userStatsMap = {};
            data.stats.forEach(s => { userStatsMap[s.game_id] = s; });
            calculateAndRenderProgress();
        }
    } catch(e) { console.error("Error loading stats", e); }
}

/* === РАСЧЕТ И РЕНДЕР ПРОГРЕССА === */
function calculateAndRenderProgress() {
    let totalAchs = 0;
    let unlockedAchs = 0;
    let totalScore = 0;

    const gamesHtml = [];
    const achsHtml = [];
    const profileBarsHtml = [];

    for (const [gameId, config] of Object.entries(GAME_CONFIG)) {
        const stats = userStatsMap[gameId] || {};
        const serverAchs = JSON.parse(stats.achievements || '[]');
        
        let gameAchsTarget = 0;
        let gameAchsProgress = 0;

        // Генерация Ачивок
        config.achievements.forEach(ach => {
            totalAchs++; gameAchsTarget += ach.target;
            const isUnlocked = serverAchs.includes(ach.id);
            if (isUnlocked) unlockedAchs++;
            
            let progVal = isUnlocked ? ach.target : ach.getProgress(stats);
            gameAchsProgress += progVal;
            
            let percent = Math.min(100, Math.floor((progVal / ach.target) * 100));

            achsHtml.push(`
                <div class="card ach-card ${isUnlocked ? '' : 'locked'}">
                    <div class="ach-icon">${isUnlocked ? '🏆' : '🔒'}</div>
                    <div class="ach-info">
                        <div class="ach-title"><span>${ach.title}</span> ${isUnlocked ? '<span class="ach-status">ОТКРЫТО</span>' : ''}</div>
                        <div class="ach-desc">${ach.desc}</div>
                        <div class="progress-wrap">
                            <div class="progress-header"><span>Прогресс</span><span>${progVal} / ${ach.target}</span></div>
                            <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%"></div></div>
                        </div>
                    </div>
                </div>
            `);
        });

        // Карточка Игры (в стиле Steam)
        totalScore += (stats.best_score || 0);
        let gamePercent = gameAchsTarget > 0 ? Math.floor((gameAchsProgress / gameAchsTarget) * 100) : 0;

        gamesHtml.push(`
            <div class="steam-card">
                <div class="steam-card-image-wrapper">
                    <img src="${config.image}" alt="${config.name}" class="steam-card-bg">
                    <div class="steam-card-overlay">
                        <div class="steam-status">ДОСТУПНО</div>
                        <p class="steam-desc">${config.desc}</p>
                        <button class="steam-play-btn" onclick="playGame('${config.url}')">ИГРАТЬ</button>
                    </div>
                </div>
                <div class="steam-card-footer">
                    <h3>${config.name}</h3>
                    <div class="progress-wrap">
                        <div class="progress-header"><span>Освоено</span><span>${gamePercent}%</span></div>
                        <div class="progress-bar"><div class="progress-fill" style="width: ${gamePercent}%"></div></div>
                    </div>
                </div>
            </div>
        `);

        // Бар в профиле
        profileBarsHtml.push(`
            <div class="progress-wrap">
                <div class="progress-header"><span>${config.icon} ${config.name}</span><span>${gamePercent}%</span></div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${gamePercent}%"></div></div>
            </div>
        `);
    }

    // Обновляем общую статистику
    let overallPercent = totalAchs > 0 ? Math.floor((unlockedAchs / totalAchs) * 100) : 0;
    document.getElementById('overall-progress-text').innerText = `${overallPercent}%`;
    document.getElementById('overall-progress-bar').style.width = `${overallPercent}%`;
    document.getElementById('home-score').innerText = totalScore;
    document.getElementById('home-achs').innerText = unlockedAchs;

    // Встраиваем сгенерированный HTML
    document.getElementById('games-container').innerHTML = gamesHtml.join('');
    document.getElementById('achievements-container').innerHTML = achsHtml.join('');
    document.getElementById('profile-games-stats').innerHTML = profileBarsHtml.join('');
}

/* === LEADERBOARD (Таблица лидеров) === */
async function loadLeaderboard() {
    const token = localStorage.getItem('sys_token');
    const container = document.getElementById('leaderboard-content');
    container.innerHTML = '<div style="text-align: center; padding: 50px;">Загрузка данных...</div>';

    try {
        const res = await fetch(`${API_BASE}/api/leaderboard`, { headers: { 'Authorization': `Bearer ${token}` }});
        if (res.ok) {
            const data = await res.json();
            renderLeaderboard(data.leaderboard);
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 50px; color:var(--danger)">Ошибка загрузки рейтинга.</div>';
        }
    } catch(e) {
        container.innerHTML = '<div style="text-align: center; padding: 50px; color:var(--danger)">Нет связи с сервером.</div>';
    }
}

function renderLeaderboard(data) {
    const container = document.getElementById('leaderboard-content');
    if (!data || data.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 50px;">Рейтинг пока пуст. Стань первым!</div>';
        return;
    }

    // Подиум (Топ-3)
    let podiumHtml = '<div class="podium-container">';
    const top3 = [data[1], data[0], data[2]]; // Для визуального подиума: 2 место слева, 1 по центру, 3 справа
    const ranks = [2, 1, 3];
    
    top3.forEach((user, idx) => {
        if(user) {
            podiumHtml += `
                <div class="podium-item rank-${ranks[idx]} fade-in" style="animation-delay: ${idx*0.1}s">
                    <div class="podium-avatar">${user.username.charAt(0).toUpperCase()}</div>
                    <div class="podium-name">${user.username}</div>
                    <div class="podium-score">${user.totalScore} pts</div>
                    <div class="podium-block">#${ranks[idx]}</div>
                </div>
            `;
        }
    });
    podiumHtml += '</div>';

    // Таблица остальных игроков
    let tableHtml = '<table class="lb-table fade-in" style="animation-delay: 0.3s"><thead><tr><th>Rank</th><th>Агент</th><th>Счет</th><th>Ачивки</th><th>Сессии</th></tr></thead><tbody>';
    data.forEach((user, index) => {
        tableHtml += `
            <tr>
                <td class="lb-rank">#${index + 1}</td>
                <td class="lb-user">${user.username}</td>
                <td class="lb-score">${user.totalScore}</td>
                <td>${user.achCount}</td>
                <td>${user.runs}</td>
            </tr>
        `;
    });
    tableHtml += '</tbody></table>';

    container.innerHTML = podiumHtml + tableHtml;
}

/* === НАВИГАЦИЯ === */
function switchTab(targetTabId) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    // Показываем нужную
    document.getElementById(targetTabId).classList.add('active');

    // Меняем стили в боковом меню
    document.querySelectorAll('.sidebar .menu-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === targetTabId) link.classList.add('active');
    });

    // Загружаем лидерборд, если открыли его
    if (targetTabId === 'tab-leaderboard') loadLeaderboard();
    
    // Скролл наверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* === INIT & EVENTS === */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    checkAuth();

    // Отправка формы Входа
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const login = document.getElementById('login-input').value;
        const password = document.getElementById('login-password').value;
        const err = document.getElementById('login-error'); 
        err.innerText = 'Загрузка...';
        try {
            const res = await fetch(`${API_BASE}/api/login`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ login, password }) 
            });
            const data = await res.json();
            if (res.ok) { 
                localStorage.setItem('sys_token', data.token); 
                checkAuth(); 
            } else { 
                err.innerText = data.error || 'Ошибка входа'; 
            }
        } catch (e) { err.innerText = 'Ошибка сети'; }
    });

    // Отправка формы Регистрации
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        const err = document.getElementById('reg-error');
        
        if (password !== confirm) { 
            err.innerText = 'Пароли не совпадают'; 
            return; 
        }
        
        err.innerText = 'Загрузка...';
        
        try {
            const res = await fetch(`${API_BASE}/api/register`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ username, email, password }) 
            });
            const data = await res.json();
            
            if (res.ok) { 
                err.style.color = 'var(--success)'; 
                err.innerText = 'Успешно! Войдите.'; 
                setTimeout(() => toggleAuthMode({preventDefault:()=>{}}), 2000); 
            } else { 
                err.innerText = data.error || 'Ошибка регистрации'; 
            }
        } catch (e) { err.innerText = 'Ошибка сети'; }
    });

    // Кнопка Выхода
    document.getElementById('logout-btn').addEventListener('click', async () => {
        const token = localStorage.getItem('sys_token');
        if (token) {
            try { 
                await fetch(`${API_BASE}/api/logout`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }}); 
            } catch (e) {}
        }
        localStorage.removeItem('sys_token');
        checkAuth();
    });

    // Кнопки переключения вкладок меню
    document.querySelectorAll('.menu-link').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(trigger.getAttribute('data-tab'));
        });
    });
});