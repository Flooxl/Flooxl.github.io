/* ==========================================================================
   PROJECT: REMEMBER ME — UNDERTALE EDITION (v4.0 STABLE)
   ========================================================================== */

/* 1. DATA: 500+ SCENARIOS & SYNONYMS */
const GameDatabase = {
    threats: [
        {
            id: "t_ddos", name: "DDoS",
            aliases: ["ddos", "dos", "ддос", "denial of service", "flood"],
            learning: {
                theory: "Атака, направленная на перегрузку сервера огромным количеством запросов (Flood), чтобы сделать его недоступным.",
                signs: ["Сайт недоступен (503)", "Аномальный рост трафика", "Запросы с тысяч IP"]
            }
        },
        {
            id: "t_phishing", name: "Phishing",
            aliases: ["phishing", "фишинг", "scam", "скам", "социальная инженерия"],
            learning: {
                theory: "Враг притворяется кем-то доверенным (банк, босс), чтобы украсть пароль или заставить скачать файл.",
                signs: ["Срочность в письме", "Подозрительный домен (g00gle.com)", "Вложение .exe"]
            }
        },
        {
            id: "t_ransomware", name: "Ransomware",
            aliases: ["ransomware", "вымогатель", "шифровальщик", "locker"],
            learning: {
                theory: "Вредоносное ПО шифрует файлы и требует выкуп (Bitcoin) за ключ расшифровки.",
                signs: ["Файлы .enc/.locked", "Записка с требованием выкупа", "Блокировка ПК"]
            }
        },
        {
            id: "t_sql", name: "SQL Injection",
            aliases: ["sql", "sqli", "sql injection", "инъекция"],
            learning: {
                theory: "Внедрение кода в форму ввода на сайте для взлома Базы Данных.",
                signs: ["Ошибки БД на странице", "Вход под 'admin' --", "Утечка таблиц"]
            }
        },
        {
            id: "t_mitm", name: "MitM",
            aliases: ["mitm", "man in the middle", "sniffing", "перехват"],
            learning: {
                theory: "Атакующий тайно перехватывает связь между двумя сторонами (например, через Wi-Fi).",
                signs: ["Ошибки SSL", "Открытый Wi-Fi", "Странные редиректы"]
            }
        },
        {
            id: "t_malware", name: "Malware",
            aliases: ["malware", "virus", "вирус", "троян", "trojan"],
            learning: {
                theory: "Общее название вредоносного ПО (вирусы, черви, трояны), которое повреждает систему.",
                signs: ["Медленная работа ПК", "Неизвестные процессы", "Всплывающие окна"]
            }
        }
    ],

    templates: {
        "t_ddos": [
            "* Сервер упал. CPU: 100%. Трафик вырос в 1000 раз.\n* Источник: {source}.",
            "* Ошибка {error_code}.\n* Сетевой экран фиксирует Flood ({traffic_amount}) с разных IP.",
            "* Пользователи жалуются на {symptom}.\n* Анализ логов показывает миллионы запросов."
        ],
        "t_phishing": [
            "* Письмо от '{fake_sender}'.\n* Тема: 'СРОЧНО: {subject}'.\n* Ссылка на {fake_domain}.",
            "* В письме требуют {action} и открыть файл '{malware_file}'."
        ],
        "t_ransomware": [
            "* Файлы стали .{extension}.\n* На экране текст: 'Заплатите {price} BTC'.",
            "* Бухгалтерия парализована.\n* Обои сменились на требование выкупа."
        ],
        "t_sql": [
            "* В логах запрос: SELECT * FROM users WHERE id = '{payload}'.",
            "* Хакер вошел как админ, введя '{payload}' в поле логина.",
            "* Ошибка: {db_error} на странице входа."
        ],
        "t_mitm": [
            "* Браузер ругается на сертификат {ssl_error}.\n* Вы в сети Wi-Fi '{wifi_name}'.",
            "* Перехват трафика выявил пароли.\n* ARP-таблица содержит дубликаты."
        ],
        "t_malware": [
            "* Антивирус нашел '{malware_file}'.\n* Процесс потребляет 90% памяти.",
            "* Система работает медленно.\n* Появились новые иконки на рабочем столе."
        ]
    },

    vars: {
        source: ["Botnet Mirai", "китайских прокси", "IoT камер", "Tor Exit Nodes"],
        traffic_amount: ["10M req/sec", "500 Gbps", "UDP Flood"],
        error_code: ["503 Service Unavailable", "Time Out", "504 Gateway Timeout"],
        symptom: ["полный отказ", "лаги", "высокий пинг"],
        fake_sender: ["security@g00gle.com", "boss@company.net", "admin@sber-update.ru"],
        subject: ["Ваш пароль истек", "Задержка зарплаты", "Вызов в суд"],
        fake_domain: ["sber-bank.xyz", "update-win.in", "login-secure.com"],
        malware_file: ["invoice.exe", "bonus.scr", "report.js"],
        action: ["сменить пароль", "отключить защиту", "скачать архив"],
        extension: ["locked", "enc", "wannacry", "crypt"],
        price: ["0.5", "10", "5"],
        payload: ["' OR '1'='1", "DROP TABLE users", "UNION SELECT 1,2"],
        db_error: ["Unclosed quotation mark", "SQL Syntax Error"],
        wifi_name: ["Free_WiFi", "Cafe_Guest", "Airport_Free"],
        ssl_error: ["AUTHORITY_INVALID", "CERT_DATE_INVALID"]
    },

    story: [
        {
            chapter: 1, title: "Awakening",
            dialogues: [
                { speaker: "MENTOR", text: "Приветствую, Агент. Добро пожаловать в Систему." },
                { speaker: "MENTOR", text: "Монстры захватили сеть. Назови их по имени, чтобы удалить." },
                { speaker: "MENTOR", text: "Начнем с простых угроз." }
            ],
            threats: ["t_ddos", "t_phishing"], wins: 3
        },
        {
            chapter: 2, title: "Encryption",
            dialogues: [
                { speaker: "MENTOR", text: "Ты справляешься. Но враги стали хитрее." },
                { speaker: "MENTOR", text: "Они требуют выкуп и крадут базы данных." }
            ],
            threats: ["t_ransomware", "t_sql", "t_mitm"], wins: 5
        }
    ],

    normalize(input) {
        return input.trim().toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9]/g, '');
    },
    checkAnswer(input, threat) {
        const norm = this.normalize(input);
        return threat.aliases.some(a => this.normalize(a) === norm);
    }
};

/* 2. AUDIO SYSTEM */
class AudioManager {
    constructor() { this.ctx = null; }
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    playTone(freq, type, duration) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    playType() { this.playTone(800, 'square', 0.03); }
    playError() { this.playTone(150, 'sawtooth', 0.4); this.playTone(100, 'sawtooth', 0.4); }
    playSuccess() { this.playTone(600, 'square', 0.1); setTimeout(() => this.playTone(900, 'square', 0.2), 100); }
    playMenu() { this.playTone(400, 'triangle', 0.1); }
}

/* 3. HEALTH SYSTEM */
class HealthSystem {
    constructor(maxHp = 3) {
        this.maxHp = maxHp;
        this.currentHp = maxHp;
        this.container = document.getElementById('hp-container');
    }
    reset() {
        this.currentHp = this.maxHp;
        this.render();
    }
    takeDamage() {
        if (this.currentHp > 0) {
            this.currentHp--;
            this.render();
            document.body.classList.add('shake-anim');
            setTimeout(() => document.body.classList.remove('shake-anim'), 500);
            return this.currentHp <= 0;
        }
        return true;
    }
    render() {
        this.container.innerHTML = "";
        if (this.maxHp > 10) return; // Hide hearts in learning mode
        for (let i = 0; i < this.maxHp; i++) {
            const heart = document.createElement('span');
            heart.className = i < this.currentHp ? 'heart-icon' : 'heart-icon heart-broken';
            heart.innerText = "♥";
            this.container.appendChild(heart);
        }
    }
}

/* 4. TYPEWRITER (FIXED RACE CONDITION) */
class Typewriter {
    constructor(elementId, speed = 30) {
        this.element = document.getElementById(elementId);
        this.speed = speed;
        this.timer = null;
        this.isTyping = false;
        this.fullText = "";
        this.resolvePromise = null;
    }
    type(text, onComplete) {
        if (this.timer) clearTimeout(this.timer);
        this.element.innerHTML = "";
        this.fullText = text;
        this.isTyping = true;
        document.getElementById('skip-hint').classList.remove('hidden');

        return new Promise((resolve) => {
            this.resolvePromise = () => {
                if (onComplete) onComplete();
                resolve();
            };

            let i = 0;
            const nextChar = () => {
                if (!this.isTyping) return;
                if (i < text.length) {
                    const char = text.charAt(i);
                    this.element.innerHTML += char;
                    if (i % 2 === 0) Engine.audio.playType();
                    i++;
                    let delay = this.speed;
                    if (char === '.' || char === '!') delay = 300;
                    else if (char === ',') delay = 150;
                    this.timer = setTimeout(nextChar, delay);
                } else {
                    this.finish();
                }
            };
            nextChar();
        });
    }
    finish() {
        this.isTyping = false;
        this.element.innerHTML = this.fullText;
        document.getElementById('skip-hint').classList.add('hidden');
        if (this.resolvePromise) { const cb = this.resolvePromise; this.resolvePromise = null; cb(); }
    }
    skip() {
        if (this.isTyping) {
            clearTimeout(this.timer);
            this.finish();
            return true;
        }
        return false;
    }
}

/* 5. GENERATOR */
class ScenarioGenerator {
    static generate(threatId) {
        const templates = GameDatabase.templates[threatId];
        if (!templates) return { text: "Error generating scenario.", threat_id: threatId };
        let tpl = templates[Math.floor(Math.random() * templates.length)];
        const text = tpl.replace(/{(\w+)}/g, (match, p1) => {
            const opts = GameDatabase.vars[p1];
            return opts ? opts[Math.floor(Math.random() * opts.length)] : match;
        });
        return { text: text, threat_id: threatId };
    }
}

/* 6. INPUT SYSTEM */
class InputSystem {
    constructor() {
        this.wrapper = document.getElementById('word-slots-wrapper');
        this.hiddenInput = document.getElementById('hidden-input');
        
        document.getElementById('input-zone').onclick = () => {
            this.hiddenInput.disabled = false;
            this.hiddenInput.focus();
        };
        this.hiddenInput.addEventListener('input', () => this.render());
        this.hiddenInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') Engine.submitAnswer();
        });
    }
    reset() {
        this.hiddenInput.value = "";
        this.hiddenInput.disabled = false;
        this.render();
        if (!(/Mobi|Android/i.test(navigator.userAgent))) {
             setTimeout(() => this.hiddenInput.focus(), 100);
        }
    }
    getValue() { return this.hiddenInput.value.trim(); }
    render() {
        const val = this.hiddenInput.value;
        this.wrapper.innerHTML = '';
        for (let i = 0; i < val.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'slot-char active';
            slot.innerText = val[i];
            this.wrapper.appendChild(slot);
        }
        if (val.length < 30) {
            const cursor = document.createElement('div');
            cursor.className = 'slot-char cursor-blink';
            this.wrapper.appendChild(cursor);
        }
    }
    showValidation(isCorrect) {
        const slots = this.wrapper.children;
        for (let slot of slots) {
            slot.classList.add(isCorrect ? 'correct' : 'wrong');
            slot.classList.remove('active', 'cursor-blink');
        }
        this.hiddenInput.disabled = true;
    }
}

/* 7. CAMPAIGN MANAGER */
class CampaignManager {
    constructor() {
        this.chapterIdx = 0;
        this.winsInChapter = 0;
    }
    start() {
        this.chapterIdx = 0;
        this.winsInChapter = 0;
        this.playIntro();
    }
    playIntro() {
        const ch = GameDatabase.story[this.chapterIdx];
        if (!ch) { alert("CAMPAIGN COMPLETED!"); Engine.modeManager.showMenu(); return; }
        this.showDialogue(ch.dialogues, () => Engine.nextLevel());
    }
    showDialogue(lines, onComplete) {
        const overlay = document.getElementById('story-overlay');
        const speaker = document.getElementById('story-speaker');
        const face = document.getElementById('story-face');
        const btn = document.getElementById('btn-next-story');
        let idx = 0;
        
        overlay.classList.remove('hidden');
        const storyTyper = new Typewriter('story-text', 20);

        const nextLine = () => {
            if (idx >= lines.length) {
                overlay.classList.add('hidden');
                onComplete();
                return;
            }
            const line = lines[idx];
            speaker.innerText = line.speaker;
            face.classList.remove('face-idle');
            
            storyTyper.type(line.text, () => {
                face.classList.add('face-idle');
            });
            idx++;
        };

        const clickHandler = () => {
            if (storyTyper.isTyping) {
                storyTyper.skip();
                face.classList.add('face-idle');
            } else {
                Engine.audio.playMenu();
                nextLine();
            }
        };

        btn.onclick = clickHandler;
        overlay.onclick = (e) => {
            if(e.target === overlay || e.target.closest('.story-box')) clickHandler();
        };
        nextLine();
    }
    checkProgress() {
        this.winsInChapter++;
        const ch = GameDatabase.story[this.chapterIdx];
        if (this.winsInChapter >= ch.wins) {
            this.chapterIdx++;
            this.winsInChapter = 0;
            setTimeout(() => this.playIntro(), 1000);
            return true;
        }
        return false;
    }
    getPool() {
        const ch = GameDatabase.story[this.chapterIdx];
        return ch ? ch.threats : GameDatabase.threats.map(t => t.id);
    }
}

/* 8. LEARNING UI MANAGER (Encyclopedia) */
class LearningUIManager {
    constructor() {
        this.hub = document.getElementById('learning-hub');
        this.detail = document.getElementById('threat-detail-view');
        this.grid = document.getElementById('threat-grid');
        
        document.getElementById('btn-exit-learning').onclick = () => Engine.modeManager.showMenu();
        document.getElementById('btn-back-hub').onclick = () => this.showHub();
    }
    showHub() {
        this.detail.classList.add('hidden');
        this.hub.classList.remove('hidden');
        this.renderGrid();
    }
    renderGrid() {
        this.grid.innerHTML = "";
        GameDatabase.threats.forEach(threat => {
            const btn = document.createElement('div');
            btn.className = 'threat-card-btn';
            btn.innerText = threat.name;
            btn.onclick = () => {
                Engine.audio.playMenu();
                this.showDetail(threat);
            };
            this.grid.appendChild(btn);
        });
    }
    showDetail(threat) {
        this.hub.classList.add('hidden');
        this.detail.classList.remove('hidden');

        document.getElementById('detail-title').innerText = threat.name;
        document.getElementById('detail-theory').innerText = threat.learning.theory;
        
        const signsList = document.getElementById('detail-signs');
        signsList.innerHTML = "";
        threat.learning.signs.forEach(s => {
            const li = document.createElement('li');
            li.innerText = s;
            signsList.appendChild(li);
        });

        document.getElementById('detail-aliases').innerText = threat.aliases.join(", ");

        const scenList = document.getElementById('detail-scenarios-list');
        scenList.innerHTML = "";
        if (GameDatabase.templates[threat.id]) {
            GameDatabase.templates[threat.id].forEach(tpl => {
                const text = tpl.replace(/{(\w+)}/g, (match, p1) => {
                    const opts = GameDatabase.vars[p1];
                    return opts ? opts[Math.floor(Math.random() * opts.length)] : match;
                });
                const div = document.createElement('div');
                div.className = 'scenario-item';
                div.innerText = text;
                scenList.appendChild(div);
            });
        }
    }
}

/* 9. GAME MODE MANAGER (Strict Lifecycle Flow) */
class GameModeManager {
    constructor() {
        this.currentMode = 'MENU';
        this.menu = document.getElementById('main-menu');
    }
    
    init() {
        const lvl = parseInt(localStorage.getItem('player_level') || 1);
        if (lvl >= 2) {
            const btn = document.getElementById('btn-mode-practice');
            btn.classList.remove('locked');
            btn.disabled = false;
        }
        document.getElementById('btn-mode-learning').onclick = () => this.setMode('LEARNING');
        document.getElementById('btn-mode-practice').onclick = () => this.setMode('PRACTICE');
        document.getElementById('btn-mode-story').onclick = () => this.setMode('STORY');
        document.getElementById('btn-reset-save').onclick = () => {
            localStorage.clear(); location.reload();
        };
        this.showMenu();
    }

    cleanupUI() {
        const overlays = [
            'learning-hub', 'threat-detail-view', 'story-overlay', 
            'game-over-overlay', 'feedback-overlay', 'tutorial-overlay',
            'battle-box', 'input-zone'
        ];
        overlays.forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.classList.contains('hidden')) {
                el.classList.add('hidden');
            }
        });

        document.body.classList.remove('mode-learning', 'mode-practice');
        if (Engine.typewriter) Engine.typewriter.skip();
        if (Engine.inputSystem) {
            Engine.inputSystem.hiddenInput.disabled = true;
            Engine.inputSystem.reset();
        }
    }

    showMenu() {
        this.cleanupUI();
        this.currentMode = 'MENU';
        this.menu.classList.remove('hidden');
        document.getElementById('rank-display').innerText = "MENU";
        Engine.audio.playMenu();
    }

    setMode(mode) {
        this.cleanupUI();
        this.currentMode = mode;
        this.menu.classList.add('hidden');
        Engine.audio.playSuccess();
        
        if (mode === 'LEARNING') {
            document.body.classList.add('mode-learning');
            Engine.learningUI.showHub();
        } else if (mode === 'PRACTICE') {
            document.body.classList.add('mode-practice');
            document.getElementById('battle-box').classList.remove('hidden');
            Engine.health.maxHp = 3;
            Engine.health.reset();
            Engine.nextLevel();
        } else if (mode === 'STORY') {
            document.getElementById('battle-box').classList.remove('hidden');
            Engine.health.maxHp = 3;
            Engine.health.reset();
            Engine.campaign.start();
        }

        if (!localStorage.getItem('tut_complete')) Engine.tutorial.start();
    }
}

/* 10. TUTORIAL MANAGER (FIXED CLAMPING) */
class TutorialManager {
    constructor() {
        this.overlay = document.getElementById('tutorial-overlay');
        this.pointer = document.getElementById('tut-pointer');
        this.text = document.getElementById('tut-text');
        this.btn = document.getElementById('tut-next-btn');
        this.step = 0;
        this.activeElement = null;
        
        this.btn.onclick = (e) => { e.stopPropagation(); this.next(); };
        window.addEventListener('resize', () => {
            if(!this.overlay.classList.contains('hidden') && this.activeElement) this.positionPointer(this.activeElement);
        });
    }
    start() {
        this.step = 0;
        this.overlay.classList.remove('hidden');
        this.next();
    }
    next() {
        this.clearHighlight();
        this.step++;
        if (this.step === 1) this.show("Агент! Добро пожаловать в симулятор киберугроз.", null);
        else if (this.step === 2) this.show("Твоя задача: анализировать инциденты здесь.", document.getElementById('battle-box'));
        else if (this.step === 3) this.show("Здесь твои жизни. В ПРАКТИКЕ ошибки фатальны.", document.getElementById('hp-container'));
        else if (this.step === 4) {
            document.getElementById('input-zone').classList.remove('hidden');
            this.show("Вводи название атаки здесь. Например 'DDoS'.", document.getElementById('input-zone'));
        }
        else {
            this.overlay.classList.add('hidden');
            localStorage.setItem('tut_complete', 'true');
        }
    }
    show(msg, targetEl) {
        this.text.innerText = msg;
        if (targetEl) {
            targetEl.classList.remove('hidden');
            this.activeElement = targetEl;
            this.activeElement.classList.add('highlight-element');
            if (getComputedStyle(this.activeElement).position === 'static') this.activeElement.style.position = 'relative';
            this.positionPointer(targetEl);
        } else {
            this.pointer.style.top = '50%'; this.pointer.style.left = '50%'; this.pointer.style.transform = 'translate(-50%, -50%)';
        }
    }
    positionPointer(targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const pRect = this.pointer.getBoundingClientRect();
        let top = rect.bottom + 10;
        let left = rect.left + (rect.width/2) - (pRect.width/2);
        
        if (top > window.innerHeight - pRect.height - 20) top = rect.top - pRect.height - 10;
        left = Math.max(20, Math.min(left, window.innerWidth - pRect.width - 20));
        
        this.pointer.style.transform = 'none';
        this.pointer.style.top = `${top}px`;
        this.pointer.style.left = `${left}px`;
    }
    clearHighlight() {
        if (this.activeElement) {
            this.activeElement.classList.remove('highlight-element');
            if (this.activeElement.style.position === 'relative') this.activeElement.style.position = '';
            this.activeElement = null;
        }
    }
}

/* 11. CORE ENGINE */
const Engine = {
    audio: new AudioManager(),
    health: new HealthSystem(3),
    campaign: new CampaignManager(),
    modeManager: new GameModeManager(),
    tutorial: new TutorialManager(),
    learningUI: new LearningUIManager(),
    typewriter: null,
    inputSystem: null,
    gameState: { currentThreat: null },

    init() {
        this.typewriter = new Typewriter('scenario-text');
        this.inputSystem = new InputSystem();
        document.body.addEventListener('click', () => this.audio.init(), { once: true });
        
        document.getElementById('battle-box').addEventListener('click', () => this.typewriter.skip());
        document.getElementById('btn-fight').addEventListener('click', () => this.submitAnswer());
        document.getElementById('btn-mercy').addEventListener('click', () => this.useHint());
        
        document.getElementById('btn-continue').addEventListener('click', () => {
            if (this.modeManager.currentMode === 'STORY') this.campaign.checkProgress();
            else this.nextLevel();
        });
        
        document.getElementById('btn-restart').addEventListener('click', () => {
             if (this.modeManager.currentMode === 'PRACTICE' || this.modeManager.currentMode === 'STORY') {
                 this.health.reset();
                 document.getElementById('game-over-overlay').classList.add('hidden');
                 if(this.modeManager.currentMode === 'STORY') this.campaign.start();
                 else this.nextLevel();
             } else {
                 this.modeManager.showMenu();
             }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'd' && e.altKey) {
                document.getElementById('debug-panel').classList.toggle('hidden');
                document.getElementById('debug-info').innerText = `M: ${this.modeManager.currentMode} | HP: ${this.health.currentHp}`;
            }
        });

        this.modeManager.init();
    },

    debugSkipLevel() { this.submitAnswer("DEBUG_SKIP"); },

    nextLevel() {
        document.getElementById('feedback-overlay').classList.add('hidden');
        document.getElementById('input-zone').classList.add('hidden');
        document.getElementById('rank-display').innerText = this.modeManager.currentMode;

        let poolIds = (this.modeManager.currentMode === 'STORY') 
            ? this.campaign.getPool() 
            : GameDatabase.threats.map(t => t.id);
        
        const rnd = poolIds[Math.floor(Math.random() * poolIds.length)];
        const threat = GameDatabase.threats.find(t => t.id === rnd);
        this.gameState.currentThreat = threat;

        this.startScenario(threat);
    },

    startScenario(threat) {
        const sc = ScenarioGenerator.generate(threat.id);
        this.typewriter.type(sc.text, () => {
            document.getElementById('input-zone').classList.remove('hidden');
            Engine.inputSystem.reset();
        });
    },

    submitAnswer(override) {
        let raw = override || this.inputSystem.getValue();
        if (!raw) return;
        
        const threat = this.gameState.currentThreat;
        let isCorrect = (raw === "DEBUG_SKIP") ? true : GameDatabase.checkAnswer(raw, threat);

        if (isCorrect) {
            this.audio.playSuccess();
            this.inputSystem.showValidation(true);
            if (this.modeManager.currentMode !== 'PRACTICE') localStorage.setItem('player_level', '2');
            
            setTimeout(() => {
                if (this.modeManager.currentMode === 'STORY') {
                    if (!this.campaign.checkProgress()) this.showFeedback(true, threat);
                } else {
                    this.showFeedback(true, threat);
                }
            }, 500);
        } else {
            this.audio.playError();
            this.inputSystem.showValidation(false);
            
            if (this.health.takeDamage()) {
                document.getElementById('hidden-input').disabled = true;
                document.getElementById('game-over-overlay').classList.remove('hidden');
            }
            else setTimeout(() => this.inputSystem.reset(), 1000);
        }
    },

    useHint() {
        if (this.modeManager.currentMode === 'PRACTICE') return; 
        const threat = this.gameState.currentThreat;
        alert(`Начинается на: ${threat.name[0]}...`);
        this.health.takeDamage();
    },

    showFeedback(isWin, threat) {
        const ov = document.getElementById('feedback-overlay');
        document.getElementById('feedback-title').innerText = isWin ? "* VICTORY!" : "* FAIL";
        document.getElementById('feedback-title').style.color = isWin ? "var(--ut-yellow)" : "var(--ut-red)";
        document.getElementById('feedback-message').innerText = `Верно! Это ${threat.name}.`;
        ov.classList.remove('hidden');
    }
};

document.addEventListener('DOMContentLoaded', () => Engine.init());