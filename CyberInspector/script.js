/* ==========================================
   СЕРВИС ВРЕМЕНИ (SINGLE SOURCE OF TRUTH)
   ========================================== */
class GameDateProvider {
    static get currentYear() { return new Date().getFullYear(); }
    
    // Текущая игровая дата
    static getToday() { 
        return new Date(); 
    }

    // Формат: YYYY-MM-DD
    static format(date) {
        return date.toISOString().split('T')[0];
    }

    // Генерация даты в прошлом (дата выдачи, рождения)
    static getPastDate(minDays, maxDays) {
        const date = new Date();
        const diff = Math.floor(Math.random() * (maxDays - minDays + 1) + minDays);
        date.setDate(date.getDate() - diff);
        return this.format(date);
    }

    // Генерация даты в будущем (истечение срока)
    static getFutureDate(minDays, maxDays) {
        const date = new Date();
        const diff = Math.floor(Math.random() * (maxDays - minDays + 1) + minDays);
        date.setDate(date.getDate() + diff);
        return this.format(date);
    }

    // Генерация даты рождения (возраст от minAge до maxAge)
    static getDOB(minAge, maxAge) {
        const date = new Date();
        const age = Math.floor(Math.random() * (maxAge - minAge + 1) + minAge);
        date.setFullYear(date.getFullYear() - age);
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        return this.format(date);
    }
}

/* ==========================================
   КОНФИГУРАЦИЯ И ДАННЫЕ
   ========================================== */
const DATA = {
    safeDomains: ['corp.net', 'partner-logistics.com', 'secure-bank.org', 'gov-portal.com'],
    phishingDomains: ['corp-support.net', 'g0ogle.com', 'secure-bakk.org', 'free-money.xyz'],
    safeSenders: ['hr', 'it-support', 'boss', 'alice', 'bob', 'security'],
    extensions: {
        safe: ['.pdf', '.txt', '.docx', '.png'],
        danger: ['.exe', '.bat', '.js', '.scr']
    }
};

const PROTOCOL_RULES = [
    {
        id: 'no_free_email',
        text: "ЗАПРЕТ: Вход с бесплатных доменов (g0ogle, free-money).",
        check: (req) => {
            const domain = req.from.split('@')[1];
            return DATA.phishingDomains.includes(domain);
        }
    },
    {
        id: 'block_exe',
        text: "ЗАПРЕТ: Вложения .exe и .bat строго запрещены.",
        check: (req) => req.attachment && (req.attachment.endsWith('.exe') || req.attachment.endsWith('.bat'))
    },
    {
        id: 'check_ip',
        text: "ВНИМАНИЕ: Запросы не из подсети 192.168.x.x считать угрозой.",
        check: (req) => !req.ip.startsWith('192.168.')
    },
    {
        id: 'device_match',
        text: "УСТРОЙСТВА: ID должен совпадать с заявленным (Claimed ID).",
        check: (req) => req.type === 'DEVICE' && req.deviceData.id !== req.deviceData.claimedId
    },
    {
        id: 'expired_cert',
        text: "WEB: Запрещен доступ с истекшими сертификатами.",
        check: (req) => {
            if (req.type !== 'WEB') return false;
            const today = GameDateProvider.format(GameDateProvider.getToday());
            return req.webData.sslExpiry < today;
        }
    }
];

const GUIDE_PAGES = [
    {
        title: "ИНСТРУМЕНТЫ (1/3)",
        content: `
            <div class="guide-entry"><div class="guide-term">ANTIVIRUS</div><div class="guide-desc">Проверяет файлы. Красный = Вирус. Желтый = Подозрительно.</div></div>
            <div class="guide-entry"><div class="guide-term">WHOIS</div><div class="guide-desc">Дата создания домена. Свежие домены (< 1 года) опасны.</div></div>
        `
    },
    {
        title: "ТИПЫ ДАННЫХ (2/3)",
        content: `
            <div class="guide-entry"><div class="guide-term">EMAIL</div><div class="guide-desc">Проверяйте отправителя, домен и вложения.</div></div>
            <div class="guide-entry"><div class="guide-term">WEB REQUEST</div><div class="guide-desc">Смотрите SSL сертификат. Он не должен быть просрочен.</div></div>
        `
    },
    {
        title: "УСТРОЙСТВА (3/3)",
        content: `
            <div class="guide-entry"><div class="guide-term">DEVICE ID</div><div class="guide-desc">Сравнивайте Hardware ID и Claimed ID. Они обязаны совпадать.</div></div>
            <div class="guide-entry"><div class="guide-term">DATES</div><div class="guide-desc">Сверяйте даты с текущей. Срок действия ID не должен истечь.</div></div>
        `
    }
];

const SHOP_ITEMS = [
    { id: 'cpu_boost', name: 'CPU OVERCLOCK', desc: 'Ускоряет инструменты на 30%.', cost: 150, type: 'PERMANENT' },
    { id: 'coffee', name: 'BLACK COFFEE', desc: 'Продлевает смену до 19:00.', cost: 50, type: 'CONSUMABLE' },
    { id: 'insurance', name: 'FINE INSURANCE', desc: 'Первый штраф игнорируется.', cost: 75, type: 'CONSUMABLE' }
];

/* ==========================================
   СИСТЕМНЫЕ КЛАССЫ
   ========================================== */
class EconomySystem {
    constructor() {
        this.credits = parseInt(localStorage.getItem('ci_credits')) || 0;
        this.inventory = JSON.parse(localStorage.getItem('ci_inventory')) || [];
        this.activeBonuses = [];
    }
    save() {
        localStorage.setItem('ci_credits', this.credits);
        localStorage.setItem('ci_inventory', JSON.stringify(this.inventory));
    }
    addCredits(amount) {
        this.credits += amount;
        this.save();
        this.updateUI();
    }
    hasUpgrade(id) { return this.inventory.includes(id) || this.activeBonuses.includes(id); }
    buyItem(itemId) {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item || this.credits < item.cost) return false;
        this.credits -= item.cost;
        if (item.type === 'PERMANENT') {
            if (!this.inventory.includes(itemId)) this.inventory.push(itemId);
        } else {
            if (!this.activeBonuses.includes(itemId)) this.activeBonuses.push(itemId);
        }
        this.save();
        this.updateUI();
        return true;
    }
    updateUI() {
        const el = document.getElementById('credits-display');
        if(el) el.innerText = this.credits;
        const bal = document.getElementById('shop-balance-val');
        if(bal) bal.innerText = this.credits;
    }
}

class GuidebookSystem {
    constructor() { this.currentPage = 0; }
    open() { document.getElementById('guide-modal').classList.remove('hidden'); this.render(); }
    close() { document.getElementById('guide-modal').classList.add('hidden'); }
    nextPage() { if (this.currentPage < GUIDE_PAGES.length - 1) { this.currentPage++; this.render(); } }
    prevPage() { if (this.currentPage > 0) { this.currentPage--; this.render(); } }
    render() {
        const page = GUIDE_PAGES[this.currentPage];
        document.getElementById('guide-title').innerText = page.title;
        document.getElementById('guide-body').innerHTML = page.content;
    }
}

class DailyProtocolSystem {
    constructor() { this.activeRules = []; }
    generateDailyRules(difficulty) {
        const count = 2 + Math.floor(difficulty / 2);
        this.activeRules = PROTOCOL_RULES.sort(() => 0.5 - Math.random()).slice(0, count);
        this.renderUI();
    }
    renderUI() {
        const listModal = document.getElementById('protocol-list-modal');
        listModal.innerHTML = this.activeRules.map(r => `<div class="protocol-rule">${r.text}</div>`).join('');
        const listPanel = document.getElementById('daily-rules');
        listPanel.innerHTML = this.activeRules.map(r => `<li>⚠ ${r.text}</li>`).join('');
    }
    checkViolation(req) {
        for (let rule of this.activeRules) {
            if (rule.check(req)) return rule.text;
        }
        return null;
    }
}

/* ==========================================
   ГЕНЕРАТОР
   ========================================== */
class RequestGenerator {
    static generate(difficulty) {
        const types = ['EMAIL', 'EMAIL', 'EMAIL', 'WEB', 'DEVICE'];
        const type = types[Math.floor(Math.random() * types.length)];
        const isAttack = Math.random() < (0.3 + (difficulty * 0.05));
        const todayStr = GameDateProvider.format(GameDateProvider.getToday());
        
        let req = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            type: type,
            isMalicious: isAttack,
            timestamp: new Date().toLocaleTimeString(),
            date: todayStr,
            reason: null,
            ip: "192.168.1.5",
            from: "", subject: "", body: "", attachment: null
        };

        const domain = isAttack && Math.random() > 0.5 ? 
            DATA.phishingDomains[Math.floor(Math.random() * DATA.phishingDomains.length)] : 
            DATA.safeDomains[Math.floor(Math.random() * DATA.safeDomains.length)];
        const sender = DATA.safeSenders[Math.floor(Math.random() * DATA.safeSenders.length)];
        req.from = `${sender}@${domain}`;

        let dob = GameDateProvider.getDOB(22, 55); 
        let issued = GameDateProvider.getPastDate(30, 365 * 3);
        let expires = GameDateProvider.getFutureDate(30, 365 * 4);
        
        if (isAttack && Math.random() > 0.8) {
             expires = GameDateProvider.getPastDate(1, 365);
        }

        req.idCard = {
            name: `${sender.toUpperCase()} DOE`,
            idNum: Math.floor(Math.random() * 899999 + 100000).toString(),
            dob: dob,
            issued: issued,
            expiry: expires,
            org: domain.split('.')[0].toUpperCase() + " CORP"
        };

        if (type === 'WEB') {
            req.subject = "Request: External Web Access";
            req.body = "Требуется доступ к внешнему ресурсу для работы.";
            let sslStart = GameDateProvider.getPastDate(1, 90);
            let sslEnd = GameDateProvider.getFutureDate(30, 365);
            
            if (isAttack) {
                sslEnd = GameDateProvider.getPastDate(1, 60);
                req.reason = "EXPIRED_CERT";
            }

            req.webData = {
                url: `https://${domain}/login`,
                sslIssuer: Math.random() > 0.5 ? "DigiCert Inc" : "Let's Encrypt",
                sslIssued: sslStart,
                sslExpiry: sslEnd
            };
        } else if (type === 'DEVICE') {
            req.subject = "Request: Hardware Connection";
            req.body = "Подключение нового оборудования.";
            const devId = "HW-" + Math.floor(Math.random()*9999);
            req.deviceData = {
                type: Math.random() > 0.5 ? "USB Storage" : "Laptop",
                id: devId,
                claimedId: (isAttack && Math.random() > 0.5) ? "HW-0000" : devId
            };
            req.reason = isAttack ? "DEVICE_MISMATCH" : null;
        } else {
            req.subject = isAttack ? "URGENT: INVOICE" : "Weekly Report";
            req.body = `Please review attached document.\nDate: ${todayStr}`;
            req.attachment = "doc" + (isAttack ? ".exe" : ".txt");
            
            req.domainCreated = isAttack ? 
                GameDateProvider.getPastDate(1, 20) : 
                GameDateProvider.getPastDate(700, 3000); 

            if (isAttack) req.reason = "MALWARE_FILE";
        }
        
        if (isAttack && Math.random() > 0.6) {
            req.ip = "45.33.22.11"; 
        }

        return req;
    }
}

/* ==========================================
   ИГРОВОЙ ЦИКЛ
   ========================================== */
class Game {
    constructor() {
        this.day = 1;
        this.economy = new EconomySystem();
        this.guidebook = new GuidebookSystem();
        this.protocol = new DailyProtocolSystem();
        this.queue = [];
        this.activeRequest = null;
        
        this.timeStart = 8 * 60; 
        this.timeEnd = 18 * 60;
        this.currentTime = this.timeStart;
        this.gameTimeSpeed = 2;
        this.timeInterval = null;

        this.dailyStats = { correct: 0, errors: 0, earned: 0 };
        this.insuranceUsed = false;
        
        this.tools = {
            scanVirus: (e) => this.runTool('ANTIVIRUS', 2000, e.target),
            checkWhois: (e) => this.runTool('WHOIS', 1000, e.target),
            checkHeaders: (e) => this.runTool('HEADERS', 500, e.target)
        };

        this.init();
    }

    init() {
        this.economy.updateUI();
        this.startDay();
    }

    startNextDay() {
        document.getElementById('shop-modal').classList.add('hidden');
        document.getElementById('day-end-screen').classList.add('hidden');
        this.day++;
        this.startDay();
    }

    startDay() {
        this.dailyStats = { correct: 0, errors: 0, earned: 0 };
        this.queue = [];
        this.removeActiveRequest();
        
        this.currentTime = this.timeStart;
        this.timeEnd = 18 * 60;
        if (this.economy.hasUpgrade('coffee')) this.timeEnd = 19 * 60;
        
        this.insuranceUsed = false;
        document.getElementById('day-display').innerText = this.day;

        this.protocol.generateDailyRules(this.day);
        document.getElementById('protocol-day').innerText = this.day;
        document.getElementById('protocol-modal').classList.remove('hidden');
        
        if (this.timeInterval) clearInterval(this.timeInterval);
    }

    closeProtocolScreen() {
        document.getElementById('protocol-modal').classList.add('hidden');
        this.timeInterval = setInterval(() => this.tick(), 1000);
        this.addRequestToQueue();
    }

    tick() {
        this.currentTime += this.gameTimeSpeed;
        const hours = Math.floor(this.currentTime / 60);
        const mins = this.currentTime % 60;
        document.getElementById('time-display').innerText = 
            `${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}`;

        if (this.currentTime >= this.timeEnd) { this.endDay(); return; }

        let spawnChance = this.queue.length === 0 ? 0.8 : 0.3;
        if (this.queue.length > 5) spawnChance = 0;
        if (Math.random() < spawnChance) this.addRequestToQueue();
    }

    addRequestToQueue() {
        const req = RequestGenerator.generate(this.day);
        this.queue.push(req);
        this.renderQueue();
    }

    renderQueue() {
        const list = document.getElementById('queue-list');
        list.innerHTML = '';
        this.queue.forEach(req => {
            const el = document.createElement('div');
            el.className = `queue-item ${this.activeRequest === req ? 'active' : ''}`;
            el.innerText = `[${req.timestamp}] ${req.type}`;
            el.onclick = () => this.loadRequest(req);
            list.appendChild(el);
        });
    }

    loadRequest(req) {
        this.activeRequest = req;
        this.renderQueue();
        const viewer = document.getElementById('document-viewer');
        const toolsPanel = document.getElementById('tools-panel');
        document.getElementById('tool-output').innerText = "";
        
        const today = GameDateProvider.format(GameDateProvider.getToday());
        const isExpired = req.idCard.expiry < today;
        let specificInfo = "";

        if (req.type === 'WEB') {
            const isCertExpired = req.webData.sslExpiry < today;
            specificInfo = `
                <div class="web-block">
                    <div>URL: ${req.webData.url}</div>
                    <div>SSL ISSUER: ${req.webData.sslIssuer}</div>
                    <div>VALID FROM: ${req.webData.sslIssued}</div>
                    <div>VALID TO: <span class="${isCertExpired ? 'expired' : ''}">${req.webData.sslExpiry}</span></div>
                </div>`;
        } else if (req.type === 'DEVICE') {
            specificInfo = `
                <div class="device-block">
                    <div>DEVICE: ${req.deviceData.type}</div>
                    <div>HARDWARE ID: ${req.deviceData.id}</div>
                    <div>CLAIMED ID: ${req.deviceData.claimedId}</div>
                </div>`;
        }

        viewer.innerHTML = `
            <div class="req-type-badge type-${req.type.toLowerCase()}">${req.type} REQUEST</div>
            <div class="id-card-container ${isExpired ? 'fake-id' : ''}">
                <div class="id-photo"></div>
                <div class="id-info">
                    <div class="id-row"><span class="id-label">NAME:</span> <span class="id-val">${req.idCard.name}</span></div>
                    <div class="id-row"><span class="id-label">DOB:</span> <span class="id-val">${req.idCard.dob}</span></div>
                    <div class="id-row"><span class="id-label">ISSUED:</span> <span class="id-val">${req.idCard.issued}</span></div>
                    <div class="id-row"><span class="id-label">EXP:</span> <span class="id-val ${isExpired ? 'expired' : ''}">${req.idCard.expiry}</span></div>
                    <div class="id-row"><span class="id-label">ID #:</span> <span class="id-val">${req.idCard.idNum}</span></div>
                </div>
            </div>
            <div class="doc-header">
                <div><span class="doc-label">DATE:</span> <span class="doc-value">${req.date}</span></div>
                <div><span class="doc-label">FROM:</span> <span class="doc-value">${req.from}</span></div>
                <div><span class="doc-label">SUBJECT:</span> <span class="doc-value">${req.subject}</span></div>
            </div>
            ${specificInfo}
            <div class="doc-body">${req.body}</div>
            ${req.attachment ? `<div class="doc-attachment"><span>📎 ${req.attachment}</span></div>` : ''}
        `;
        viewer.classList.remove('empty');
        toolsPanel.style.display = 'block';
    }

    runTool(toolName, duration, btnElement) {
        if (!this.activeRequest) return;
        if (btnElement && btnElement.classList.contains('loading')) return;
        if (this.economy.hasUpgrade('cpu_boost')) duration *= 0.7;

        let originalText = "";
        if (btnElement) {
            btnElement.classList.add('loading');
            originalText = btnElement.innerText;
            btnElement.innerText = "SCANNING...";
        }

        const output = document.getElementById('tool-output');
        output.innerText = `> ЗАПУСК ${toolName}...\n> ПОДОЖДИТЕ...`;
        
        setTimeout(() => {
            let result = "";
            const req = this.activeRequest;

            if (toolName === 'ANTIVIRUS') {
                if (req.reason === 'MALWARE_FILE') result = "!!! УГРОЗА: Trojan.Win32 !!!";
                else if (req.attachment && req.attachment.endsWith('.exe')) result = "WARN: ИСПОЛНЯЕМЫЙ ФАЙЛ";
                else result = "ФАЙЛЫ ЧИСТЫ";
            } else if (toolName === 'WHOIS') {
                const created = req.domainCreated || GameDateProvider.getPastDate(1000, 3000);
                result = `DOMAIN: ${req.from.split('@')[1]}\nCREATED: ${created}\nSTATUS: Active`;
            } else if (toolName === 'HEADERS') {
                result = `ORIGIN IP: ${req.ip}`;
            }

            output.innerText = `> ${toolName} ЗАВЕРШЕН:\n${result}`;
            if (btnElement) {
                btnElement.classList.remove('loading');
                btnElement.innerText = originalText;
            }
        }, duration);
    }

    makeVerdict(decision) {
        if (!this.activeRequest) return;
        const req = this.activeRequest;
        
        const isTechnicalThreat = req.isMalicious;
        const protocolViolation = this.protocol.checkViolation(req);
        const shouldDeny = isTechnicalThreat || (protocolViolation !== null);
        
        let correct = false;
        let msg = "";
        let reward = 0;

        if (shouldDeny) {
            if (decision === 'DENY') {
                correct = true;
                msg = protocolViolation ? "Нарушение протокола пресечено." : "Угроза блокирована.";
            } else {
                correct = false;
                msg = protocolViolation ? `ОШИБКА: Нарушен протокол: ${protocolViolation}` : "ОШИБКА: Пропущен вирус!";
            }
        } else {
            if (decision === 'APPROVE') {
                correct = true;
                msg = "Доступ разрешен верно.";
            } else {
                correct = false;
                msg = "ОШИБКА: Отказ без причины.";
            }
        }

        if (correct) {
            reward = 15;
            this.dailyStats.correct++;
        } else {
            reward = -30;
            if (this.economy.hasUpgrade('insurance') && !this.insuranceUsed) {
                reward = 0;
                msg += " (СТРАХОВКА)";
                this.insuranceUsed = true;
            }
            this.dailyStats.errors++;
        }

        this.economy.addCredits(reward);
        this.dailyStats.earned += reward;
        this.log(`[${correct ? 'OK' : 'FAIL'}] ${msg}`, correct ? 'green' : 'red');

        // Визуал
        const viewer = document.getElementById('document-viewer');
        const oldStamp = document.querySelector('.verdict-stamp');
        if(oldStamp) oldStamp.remove();
        const stamp = document.createElement('div');
        stamp.className = `verdict-stamp ${decision === 'APPROVE' ? 'stamp-approved' : 'stamp-denied'}`;
        stamp.innerText = decision;
        viewer.appendChild(stamp);
        requestAnimationFrame(() => stamp.classList.add('visible'));

        if (!correct) {
            const container = document.querySelector('.game-container');
            container.classList.add('shake-anim');
            setTimeout(() => container.classList.remove('shake-anim'), 500);
        }

        this.economy.updateUI();
        setTimeout(() => this.removeActiveRequest(), 800);
    }

    removeActiveRequest() {
        this.queue = this.queue.filter(r => r !== this.activeRequest);
        this.activeRequest = null;
        document.getElementById('document-viewer').innerHTML = '<p>ВЫБЕРИТЕ ЗАПРОС</p>';
        document.getElementById('tools-panel').style.display = 'none';
        this.renderQueue();
    }

    endDay() {
        clearInterval(this.timeInterval);
        this.economy.activeBonuses = [];
        const modal = document.getElementById('day-end-screen');
        const stats = document.getElementById('day-stats');
        stats.innerHTML = `
            <p>ОБРАБОТАНО: ${this.dailyStats.correct + this.dailyStats.errors}</p>
            <p style="color:var(--terminal-green)">ВЕРНО: ${this.dailyStats.correct}</p>
            <p style="color:var(--danger)">ОШИБКИ: ${this.dailyStats.errors}</p>
            <hr><p style="color:var(--safe)">ЗАРАБОТАНО: ${this.dailyStats.earned} CR</p>
        `;

        // ИНТЕГРАЦИЯ С НОВОЙ ГЛОБАЛЬНОЙ СТАТИСТИКОЙ
        try {
            let localStats = JSON.parse(localStorage.getItem('sys_local_stats')) || {};
            if (!localStats['CyberInspector']) localStats['CyberInspector'] = {};
            let gameStats = localStats['CyberInspector'];

            // Обновляем лучший счет (кредиты)
            gameStats.score = Math.max(gameStats.score || 0, this.economy.credits);

            // Обновляем лучший стрик (максимальный день)
            gameStats.streak = Math.max(gameStats.streak || 0, this.day);

            // Увеличиваем счетчик завершенных смен
            gameStats.add_run = true; 

            if (!gameStats.achievements) gameStats.achievements = [];

            // Достижение за идеальную смену
            if (this.dailyStats.errors === 0 && this.dailyStats.correct > 0) {
                if (!gameStats.achievements.includes('perfect_inspector')) {
                    gameStats.achievements.push('perfect_inspector');
                }
            }
            
            // Достижение за дожитие до 5 дня
            if (this.day >= 5) {
                if (!gameStats.achievements.includes('veteran_inspector')) {
                    gameStats.achievements.push('veteran_inspector');
                }
            }

            localStorage.setItem('sys_local_stats', JSON.stringify(localStats));
        } catch (e) {
            console.error("Stats save error:", e);
        }

        modal.classList.remove('hidden');
    }

    openShop() {
        document.getElementById('day-end-screen').classList.add('hidden');
        const shopModal = document.getElementById('shop-modal');
        const grid = document.getElementById('shop-grid');
        grid.innerHTML = '';
        SHOP_ITEMS.forEach(item => {
            const el = document.createElement('div');
            const isOwned = this.economy.hasUpgrade(item.id);
            el.className = `shop-item ${isOwned ? 'purchased' : ''}`;
            el.innerHTML = `
                <div class="item-title">${item.name} <span class="item-cost">${item.cost} CR</span></div>
                <div style="color:#aaa;font-size:0.8rem">${item.desc}</div>
                <button class="buy-btn" ${isOwned ? 'disabled' : ''}>${isOwned ? 'КУПЛЕНО' : 'КУПИТЬ'}</button>
            `;
            const btn = el.querySelector('button');
            if(!isOwned) btn.onclick = () => { this.economy.buyItem(item.id); this.openShop(); };
            grid.appendChild(el);
        });
        shopModal.classList.remove('hidden');
    }

    log(text, color = 'white') {
        const log = document.getElementById('system-log');
        log.innerHTML += `<div style="color:${color === 'red' ? '#f33' : (color === 'green' ? '#3f0' : '#888')}">> ${text}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}

const game = new Game();
window.game = game;

window.saveProgress = function() {
    if (window.game) {
        try {
            let localStats = JSON.parse(localStorage.getItem('sys_local_stats')) || {};
            if (!localStats['CyberInspector']) localStats['CyberInspector'] = {};
            let gameStats = localStats['CyberInspector'];
            
            gameStats.score = Math.max(gameStats.score || 0, window.game.economy.credits);
            gameStats.streak = Math.max(gameStats.streak || 0, window.game.day);
            
            localStorage.setItem('sys_local_stats', JSON.stringify(localStats));
        } catch(e) {}
    }
};