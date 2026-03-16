// --- НАСТРОЙКИ API ---
// URL твоего опубликованного Worker'а
const API_BASE = 'https://sys-games-auth.likirill.workers.dev'; 

/* ==========================================
   НОВАЯ СИСТЕМА: СТАТИСТИКА И ДОСТИЖЕНИЯ
   ========================================== */
window.sysStats = {
    gamesList: [
        { id: 'CleanDesk', name: 'Clean Desk' },
        { id: 'CyberInspector', name: 'Cyber Inspector' },
        { id: 'KeeptalkingAndNobodyHacked', name: 'Keep Talking' },
        { id: 'NoIAMNotAHacker', name: 'Not A Hacker' },
        { id: 'RememberMe', name: 'Remember Me' },
        { id: 'SecurityAwarnessOS', name: 'Security OS' }
    ],

    async apiCall(endpoint, data = null) {
        const token = localStorage.getItem('sys_token');
        if (!token) return null;
        const options = { 
            method: data ? 'POST' : 'GET', 
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } 
        };
        if (data) options.body = JSON.stringify(data);
        try {
            const res = await fetch(`${API_BASE}/api/games${endpoint}`, options);
            if (res.ok) return await res.json();
            return null;
        } catch (e) { 
            console.error('Stats API Error:', e); 
            return null; 
        }
    },

    async loadUserGameStats() {
        const data = await this.apiCall('/stats');
        if (data && data.success) {
            this.renderStats(data.stats);
        } else {
            this.renderStats([]); // Если ошибка, пробуем отрендерить локальные данные
        }
    },

    async saveGameStats(game_id, data) {
        this.saveLocal(game_id, data);
        await this.apiCall('/update-stats', { game_id, ...data });
    },

    async updateBestScore(game_id, score) {
        await this.saveGameStats(game_id, { best_score: score });
    },

    async unlockAchievement(game_id, achievement) {
        this.saveLocalArray(game_id, 'achievements', achievement);
        await this.apiCall('/add-achievement', { game_id, achievement });
    },

    async syncLocalToServer() {
        const localData = JSON.parse(localStorage.getItem('sys_local_stats')) || {};
        for (const [game_id, data] of Object.entries(localData)) {
            let hasStatsUpdate = (data.score !== undefined || data.time !== undefined || data.streak !== undefined || data.add_run);
            if (hasStatsUpdate) {
                await this.apiCall('/update-stats', { 
                    game_id, 
                    best_score: data.score, 
                    best_time: data.time, 
                    best_streak: data.streak, 
                    add_run: data.add_run 
                });
            }
            if (data.achievements) {
                for (const ach of data.achievements) {
                    await this.apiCall('/add-achievement', { game_id, achievement: ach });
                }
            }
        }
        // Очищаем локальные данные после синхронизации
        localStorage.removeItem('sys_local_stats');
    },

    // Сохранение метрик локально (для игры без интернета или гостем)
    saveLocal(game_id, data) {
        let local = JSON.parse(localStorage.getItem('sys_local_stats')) || {};
        if (!local[game_id]) local[game_id] = {};
        
        if (data.best_score !== undefined) local[game_id].score = Math.max(local[game_id].score || 0, data.best_score);
        if (data.best_streak !== undefined) local[game_id].streak = Math.max(local[game_id].streak || 0, data.best_streak);
        if (data.best_time !== undefined) {
            if (!local[game_id].time || data.best_time < local[game_id].time) local[game_id].time = data.best_time;
        }
        if (data.add_run) local[game_id].add_run = true;
        
        localStorage.setItem('sys_local_stats', JSON.stringify(local));
    },

    // Сохранение достижений локально
    saveLocalArray(game_id, key, item) {
        let local = JSON.parse(localStorage.getItem('sys_local_stats')) || {};
        if (!local[game_id]) local[game_id] = {};
        if (!local[game_id][key]) local[game_id][key] = [];
        
        if (!local[game_id][key].includes(item)) {
            local[game_id][key].push(item);
            localStorage.setItem('sys_local_stats', JSON.stringify(local));
        }
    },

    // Форматирование ID достижения (например: perfect_run -> Perfect Run)
    formatAchievementName(id) {
        return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },

    // Отрисовка карточек в профиле
    renderStats(serverData) {
        const container = document.getElementById('user-progress-container');
        if (!container) return;

        const dataSource = serverData || [];
        const localData = JSON.parse(localStorage.getItem('sys_local_stats')) || {};

        container.innerHTML = this.gamesList.map(game => {
            let gData = dataSource.find(p => p.game_id === game.id) || {};
            let lData = localData[game.id] || {};

            let score = gData.best_score ?? lData.score;
            let time = gData.best_time ?? lData.time;
            let streak = gData.best_streak ?? lData.streak;
            let runs = gData.completed_runs ?? (lData.add_run ? 1 : 0);
            
            let achs = [];
            try { achs = JSON.parse(gData.achievements || '[]'); } catch(e){}
            if (lData.achievements) {
                lData.achievements.forEach(a => { if(!achs.includes(a)) achs.push(a); });
            }

            let metricsHtml = '';
            if (score !== undefined && score !== null) metricsHtml += `<div class="prog-stat"><span class="label">BEST SCORE:</span><span class="val">${score}</span></div>`;
            if (time !== undefined && time !== null) metricsHtml += `<div class="prog-stat"><span class="label">BEST TIME:</span><span class="val">${time}</span></div>`;
            if (streak !== undefined && streak !== null) metricsHtml += `<div class="prog-stat"><span class="label">MAX STREAK:</span><span class="val">${streak}</span></div>`;
            if (runs > 0) metricsHtml += `<div class="prog-stat"><span class="label">RUNS:</span><span class="val">${runs}</span></div>`;
            
            if (metricsHtml === '') metricsHtml = `<div class="prog-stat" style="color:var(--gray-dark)">НЕТ ДАННЫХ</div>`;

            let achsHtml = achs.length > 0 
                ? `<ul class="ach-list">${achs.map(a => `<li>✔ ${this.formatAchievementName(a)}</li>`).join('')}</ul>` 
                : `<div style="color:var(--gray-dark); font-size: 0.8em; margin-top: 5px;">Достижений пока нет</div>`;

            return `
                <div class="prog-card">
                    <h3>${game.name}</h3>
                    <div style="margin-bottom: 15px;">${metricsHtml}</div>
                    <div style="border-top: 1px dashed var(--gray-light); padding-top: 10px;">
                        <span class="label" style="font-size: 0.8em; color:var(--accent);">ACHIEVEMENTS:</span>
                        ${achsHtml}
                    </div>
                </div>
            `;
        }).join('');
    }
};

/* ==========================================
   ЛОГИКА АВТОРИЗАЦИИ И ИНТЕРФЕЙСА
   ========================================== */

async function checkAuth() {
    const token = localStorage.getItem('sys_token');
    
    if (!token) {
        document.getElementById('prof-status-text').textContent = "OFFLINE";
        sysStats.renderStats([]); // Рендерим локальную стату для гостя
        showAuthScreen();
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/me`, { 
            method: 'GET', 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            const data = await res.json();
            
            // Обновляем данные пользователя на сайте
            document.getElementById('display-username').textContent = data.username;
            document.getElementById('user-avatar-initial').textContent = data.username.charAt(0).toUpperCase();
            document.getElementById('prof-page-username').textContent = data.username;
            document.getElementById('prof-page-avatar').textContent = data.username.charAt(0).toUpperCase();
            document.getElementById('prof-page-email').textContent = data.email;
            document.getElementById('prof-status-text').textContent = "ONLINE (AUTHORIZED)";
            
            const dateStr = new Date(data.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('prof-page-date').textContent = dateStr;

            // Синхронизируем локальные данные и загружаем статистику с сервера
            sysStats.syncLocalToServer().then(() => sysStats.loadUserGameStats());

            showAppScreen();
        } else {
            localStorage.removeItem('sys_token');
            document.getElementById('prof-status-text').textContent = "OFFLINE";
            sysStats.renderStats([]);
            showAuthScreen();
        }
    } catch (e) {
        console.error("Сервер недоступен:", e);
        showAuthScreen();
    }
}

function showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app-screen').style.display = 'none';
}

function showAppScreen() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
}

function toggleAuthMode(e) {
    e.preventDefault();
    document.getElementById('login-form').classList.toggle('active');
    document.getElementById('register-form').classList.toggle('active');
    document.getElementById('login-error').innerText = '';
    document.getElementById('reg-error').innerText = '';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function switchTab(targetTabId) {
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    const targetPanel = document.getElementById(targetTabId);
    if (targetPanel) targetPanel.classList.add('active');

    document.querySelectorAll('.bottom-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === targetTabId);
    });

    document.querySelectorAll('.sidebar .menu-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === targetTabId) link.classList.add('active');
    });

    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('active')) toggleSidebar();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Проверка сессии
    checkAuth();

    // 2. Логин
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const login = document.getElementById('login-input').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');
        errorDiv.innerText = 'ОБРАБОТКА...';

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
                errorDiv.innerText = data.error || 'Ошибка входа';
            }
        } catch (err) { errorDiv.innerText = 'Ошибка соединения с сервером'; }
    });

    // 3. Регистрация
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPass = document.getElementById('reg-confirm').value;
        const errorDiv = document.getElementById('reg-error');

        if (password !== confirmPass) {
            errorDiv.style.color = '#ff3366';
            errorDiv.innerText = 'Пароли не совпадают!';
            return;
        }

        errorDiv.innerText = 'ОБРАБОТКА...';

        try {
            const res = await fetch(`${API_BASE}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                errorDiv.style.color = 'var(--accent)';
                errorDiv.innerText = 'Успешно! Теперь войдите.';
                setTimeout(() => toggleAuthMode({preventDefault:()=>{}}), 2000);
            } else {
                errorDiv.style.color = '#ff3366';
                errorDiv.innerText = data.error || 'Ошибка регистрации';
            }
        } catch (err) { errorDiv.innerText = 'Ошибка соединения с сервером'; }
    });

    // 4. Выход (Logout)
    document.getElementById('logout-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('sys_token');
        if (token) {
            try {
                await fetch(`${API_BASE}/api/logout`, { 
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (err) { console.error(err); }
        }
        localStorage.removeItem('sys_token');
        if (document.getElementById('sidebar').classList.contains('active')) toggleSidebar();
        checkAuth();
    });

    // 5. Закрытие меню по Escape
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

    // 6. Переключение вкладок (Меню и Нижняя панель)
    const tabTriggers = document.querySelectorAll('[data-tab]');
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(trigger.getAttribute('data-tab'));
        });
    });

    // 7. Скролл-анимации (IntersectionObserver)
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

    // 8. Эффект 3D-наклона для игровых карточек (Vanilla JS Tilt)
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