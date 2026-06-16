// ====================
// СИСТЕМА СОХРАНЕНИЯ ПРОГРЕССА
// ====================
let maxPasswordRuleReached = 0;
let maxChatLevelReached = 0;

window.saveProgress = function(passWin = false, chatWin = false) {
    try {
        let localStats = JSON.parse(localStorage.getItem('sys_local_stats')) || {};
        if (!localStats['SecurityAwarnessOS']) localStats['SecurityAwarnessOS'] = {};
        let gameStats = localStats['SecurityAwarnessOS'];

        // Очки (10 за каждое правило пароля, 100 за каждый уровень чата)
        let currentScore = (maxChatLevelReached * 100) + (maxPasswordRuleReached * 10);

        // Обновляем лучший счет
        gameStats.score = Math.max(gameStats.score || 0, currentScore);
        
        // Лучший стрик (максимальный уровень чата)
        gameStats.streak = Math.max(gameStats.streak || 0, maxChatLevelReached);

        // Засчитываем попытку, если игрок продвинулся хоть на шаг
        if (maxChatLevelReached > 0 || maxPasswordRuleReached > 0) {
            gameStats.add_run = true;
        }

        // Обновляем достижения (в формате snake_case для красивого отображения на главном сайте)
        if (!gameStats.achievements) gameStats.achievements = [];
        if (passWin && !gameStats.achievements.includes('password_master')) {
            gameStats.achievements.push('password_master');
        }
        if (chatWin && !gameStats.achievements.includes('social_engineer_pro')) {
            gameStats.achievements.push('social_engineer_pro');
        }

        localStorage.setItem('sys_local_stats', JSON.stringify(localStats));
    } catch (e) {
        console.error("Stats save error:", e);
    }
}

// ====================
// УПРАВЛЕНИЕ РЕЖИМАМИ
// ====================
function switchMode(mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active'); 

    document.getElementById('game-absurd').classList.add('hidden');
    document.getElementById('game-danger').classList.add('hidden');
    document.getElementById(`game-${mode}`).classList.remove('hidden');

    if(mode === 'danger') {
        startChatScenario(0); 
    }
}

// ====================
// РЕЖИМ 1: ПРОТОКОЛ АБСУРД (Генератор)
// ====================

const targetSum = Math.floor(Math.random() * 11) + 20; 
const forbiddenWords = ['ADMIN', 'ROOT', 'SECRET', 'LOGIN', 'MASTER', 'SYSTEM'];
const targetWord = forbiddenWords[Math.floor(Math.random() * forbiddenWords.length)];
const emojis = ['🔥', '🚀', '💀', '🗿', '💼', '👁️', '🧬', '🦠'];
const targetEmoji = emojis[Math.floor(Math.random() * emojis.length)];

const animalsRegex = /Кот|Пес|Хомяк|Барыс|Беркут|Верблюд|Тулпар/i;
const animalsText = "'Кот', 'Пес', 'Хомяк', 'Барыс', 'Беркут' или 'Верблюд'";

const rules = [
    { id: 1, text: "Пароль должен содержать минимум 5 символов.", check: (p) => p.length >= 5 },
    { id: 2, text: "Пароль должен содержать хотя бы одну цифру.", check: (p) => /\d/.test(p) },
    { id: 3, text: "Пароль должен содержать заглавную букву.", check: (p) => /[A-Z]/.test(p) },
    { id: 4, text: "Пароль должен содержать спецсимвол (!@#$%).", check: (p) => /[!@#$%^&*]/.test(p) },
    { id: 5, text: `Сумма цифр в пароле должна быть равна ${targetSum}.`, check: (p) => {
        const nums = p.match(/\d/g);
        if (!nums) return false;
        return nums.reduce((a, b) => parseInt(a) + parseInt(b), 0) === targetSum;
    }},
    { id: 6, text: `Пароль должен содержать слово '${targetWord}' (регистр не важен).`, check: (p) => new RegExp(targetWord, 'i').test(p) },
    { id: 7, text: "Пароль должен содержать название текущего месяца на русском (с большой буквы).", check: (p) => {
        const month = new Date().toLocaleString('ru', { month: 'long' });
        const monthCap = month.charAt(0).toUpperCase() + month.slice(1);
        return p.includes(monthCap);
    }},
    { id: 8, text: "Пароль должен включать римскую цифру V (буквой).", check: (p) => p.includes('V') },
    { id: 9, text: "Пароль НЕ должен содержать пробелов.", check: (p) => !/\s/.test(p) },
    { id: 10, text: `Пароль должен содержать эмодзи: ${targetEmoji}`, check: (p) => p.includes(targetEmoji) },
    { id: 11, text: "Пароль должен содержать результат выражения 100 - 13.", check: (p) => p.includes('87') },
    { id: 12, text: `В пароле должно быть название животного: ${animalsText}.`, check: (p) => animalsRegex.test(p) },
    { id: 13, text: "Длина пароля должна быть четным числом.", check: (p) => p.length % 2 === 0 },
    { id: 14, text: "Пароль должен содержать национальный домен '.kz'", check: (p) => p.includes('.kz') },
    { id: 15, text: "Пароль должен содержать хотя бы одну букву 'ё' или 'Ё'.", check: (p) => /ё|Ё/.test(p) },
    { id: 16, text: "Пароль должен содержать текущую минуту (две цифры, сейчас: " + new Date().getMinutes().toString().padStart(2, '0') + ").", check: (p) => {
        const min = new Date().getMinutes().toString().padStart(2, '0');
        return p.includes(min);
    }}
];

const input = document.getElementById('passwordInput');
const rulesList = document.getElementById('rulesList');
const charCount = document.getElementById('charCount');

let activeRuleIndex = 0; 
let isPasswordWon = false;

function renderRules() {
    const password = input.value;
    charCount.textContent = password.length;
    rulesList.innerHTML = '';
    
    const currentMin = new Date().getMinutes().toString().padStart(2, '0');
    rules[15].text = `Пароль должен содержать текущую минуту (две цифры, сейчас: ${currentMin}).`;

    let allActivePassed = true;

    for (let i = 0; i <= activeRuleIndex; i++) {
        if (i >= rules.length) break;
        
        const rule = rules[i];
        const passed = rule.check(password);
        
        if (!passed) allActivePassed = false;

        const div = document.createElement('div');
        div.className = `rule-card ${passed ? 'passed' : 'failed'}`;
        div.innerHTML = `
            <div class="rule-header">
                <span>Правило ${rule.id}</span>
                <span>${passed ? '✅' : '❌'}</span>
            </div>
            <div>${rule.text}</div>
        `;
        rulesList.prepend(div);
    }

    if (activeRuleIndex > maxPasswordRuleReached) {
        maxPasswordRuleReached = activeRuleIndex;
        window.saveProgress(isPasswordWon, false);
    }

    if (allActivePassed && activeRuleIndex < rules.length - 1) {
        activeRuleIndex++;
        setTimeout(renderRules, 200);
    } 
    else if (allActivePassed && activeRuleIndex === rules.length - 1 && !isPasswordWon) {
         isPasswordWon = true;
         const winMsg = document.createElement('div');
         winMsg.style.color = 'var(--green)';
         winMsg.style.fontWeight = 'bold';
         winMsg.style.padding = '15px';
         winMsg.style.border = '2px solid var(--green)';
         winMsg.style.marginBottom = '15px';
         winMsg.style.textAlign = 'center';
         winMsg.innerText = 'ПОЛНЫЙ ДОСТУП РАЗРЕШЕН! ИДЕАЛЬНЫЙ ПАРОЛЬ.';
         rulesList.prepend(winMsg);
         window.saveProgress(true, false);
    }
}

input.addEventListener('input', renderRules);
setInterval(renderRules, 60000); 

// ====================
// РЕЖИМ 2: ОПАСНЫЕ СВЯЗИ (10 Уровней)
// ====================

const chatWindow = document.getElementById('chatWindow');
const choiceArea = document.getElementById('choiceArea');
const contactName = document.getElementById('chatContactName');

const scenarios = [
    {
        id: 0,
        sender: "Техподдержка (Unknown)",
        messages: ["Алло? Это техподдержка провайдера.", "Мы проверяем качество связи.", "Вы меня хорошо слышите?"],
        options: [
            { text: "Да, слышу.", correct: false, reason: "Ошибка! Вы сказали ключевое слово 'Да'. Ваш голос записан и может быть использован для подтверждения транзакций по биометрии." },
            { text: "Связь нормальная.", correct: true, next: 1 },
            { text: "Кто это? Представьтесь полностью.", correct: true, next: 1 }
        ]
    },
    {
        id: 1,
        sender: "Ген. Директор (Аскар)",
        messages: ["Срочно! Я на встрече в Астане.", "Не могу войти в облако, пароль вылетел.", "Скинь мне свой доступ, я быстро документ заберу и выйду.", "Времени нет объяснять!"],
        options: [
            { text: "Вот пароль: Qwerty12345", correct: false, reason: "Вы только что отдали доступ к корпоративной сети. Директор никогда не попросит ваш личный пароль." },
            { text: "Аскар, я не могу передать пароль в мессенджере. Это нарушение политики.", correct: true, next: 2 },
            { text: "Позвоните в IT отдел, они сбросят вам доступ.", correct: true, next: 2 }
        ]
    },
    {
        id: 2,
        sender: "HR Отдел",
        messages: ["Коллеги, добрый день!", "В честь Наурыза компания начисляет премии.", "Список сумм и сотрудников в приложенном файле.", "Скачать: 'Premia_2025.exe'"],
        options: [
            { text: "О, круто! Скачиваю.", correct: false, reason: "Вы запустили исполняемый файл (.exe) из чата. Теперь вся сеть компании зашифрована вирусом-вымогателем." },
            { text: "Странный формат файла. Уточню у HR по телефону.", correct: true, next: 3 }
        ]
    },
    {
        id: 3,
        sender: "Служба безопасности Банка",
        messages: ["Здравствуйте.", "С вашей карты пытаются совершить перевод в Караганде на 500 000 тенге.", "Чтобы отменить операцию, назовите код, который сейчас придет в СМС."],
        options: [
            { text: "Сейчас посмотрю... 4589", correct: false, reason: "Никогда не диктуйте коды из СМС! Вы только что подтвердили перевод мошенникам." },
            { text: "Я сам перезвоню в банк по номеру на карте.", correct: true, next: 4 },
            { text: "Продиктуйте номер вашей лицензии.", correct: true, next: 4 }
        ]
    },
    {
        id: 4,
        sender: "Коллега (Бухгалтерия)",
        messages: ["(Голосовое сообщение): 'Привет! Слушай, я тут в банке, карту заблокировали, закинь мне 20к на Каспи, завтра отдам. Очень надо!'", "Ну что, выручишь?"],
        options: [
            { text: "Конечно, диктуй номер.", correct: false, reason: "Это дипфейк (синтез голоса). Мошенники взяли голос коллеги из соцсетей. Всегда перезванивайте лично." },
            { text: "Перезвонить коллеге по сотовому.", correct: true, next: 5 },
            { text: "Написать: 'Зайди ко мне в кабинет, дам наличкой'.", correct: true, next: 5 }
        ]
    },
    {
        id: 5,
        sender: "E-gov Notification",
        messages: ["Важное уведомление.", "Вам начислен штраф за нарушение ПДД.", "Оплатите со скидкой 50% в течение часа по ссылке: egov-kz-penalty.online"],
        options: [
            { text: "Перейти и оплатить", correct: false, reason: "Фишинг! Обратите внимание на домен (egov-kz-penalty.online). Официальный сайт — egov.kz." },
            { text: "Зайти в официальное приложение E-gov и проверить.", correct: true, next: 6 }
        ]
    },
    {
        id: 6,
        sender: "Курьерская служба",
        messages: ["Я подъехал к офису с доставкой.", "Охрана не пускает.", "Скиньте фото вашего пропуска с двух сторон, я им покажу, что вы меня ждете."],
        options: [
            { text: "Ок, сейчас сфоткаю.", correct: false, reason: "Вы передали мошенникам образец пропуска. Его подделают и проникнут в офис." },
            { text: "Я спущусь сам.", correct: true, next: 7 },
            { text: "Скажите охране позвонить мне на рабочий.", correct: true, next: 7 }
        ]
    },
    {
        id: 7,
        sender: "Куратор из Министерства",
        messages: ["Добрый день.", "Сейчас с вами свяжется сотрудник КНБ по вопросу утечки данных.", "Ситуация серьезная. Выполняйте все его инструкции.", "Вы меня поняли?"],
        options: [
            { text: "Понял, жду звонка.", correct: false, reason: "Классическая схема. Сначала пишет якобы 'начальник', чтобы подавить волю, потом звонит 'офицер'. Это мошенники." },
            { text: "Проигнорировать и сообщить в службу безопасности.", correct: true, next: 8 }
        ]
    },
    {
        id: 8,
        sender: "Опрос сотрудников",
        messages: ["Проходим ежегодный опрос удовлетворенности.", "Войдите через Google-аккаунт, чтобы подтвердить личность.", "Ссылка: forms-google.com.su/login"],
        options: [
            { text: "Ввести логин и пароль.", correct: false, reason: "Фишинговая страница. Домен .com.su — это подделка." },
            { text: "Проверить адресную строку.", correct: true, next: 9 }
        ]
    },
    {
        id: 9,
        sender: "SYSTEM",
        messages: ["АНАЛИЗ ЗАВЕРШЕН.", "Вы прошли все 10 уровней угроз.", "Ваша киберустойчивость подтверждена."],
        options: [
            { text: "Начать тренировку заново", correct: true, next: 0 }
        ]
    }
];

let currentScenarioIndex = 0;

function startChatScenario(index) {
    currentScenarioIndex = index;
    const scenario = scenarios[index];
    
    chatWindow.innerHTML = '';
    choiceArea.innerHTML = '';
    contactName.innerText = scenario.sender;

    let delay = 0;
    scenario.messages.forEach((msg, i) => {
        setTimeout(() => {
            addMessage(msg, 'bot');
            if (i === scenario.messages.length - 1) {
                showChoices(scenario.options);
            }
        }, delay);
        delay += 800 + Math.random() * 800; 
    });
}

function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; 
}

function showChoices(options) {
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = opt.text;
        btn.onclick = () => handleChoice(opt);
        choiceArea.appendChild(btn);
    });
}

function handleChoice(option) {
    addMessage(option.text, 'user');
    choiceArea.innerHTML = ''; 

    setTimeout(() => {
        if (option.correct) {
            
            if (currentScenarioIndex > maxChatLevelReached) {
                maxChatLevelReached = currentScenarioIndex;
                window.saveProgress(isPasswordWon, false);
            }

            if (currentScenarioIndex === 9) {
                window.saveProgress(isPasswordWon, true);
            }

            if (option.next !== undefined) {
                startChatScenario(option.next);
            }
        } else {
            addMessage("❌ КРИТИЧЕСКАЯ ОШИБКА", 'bot');
            addMessage(option.reason, 'bot');
            
            const restartBtn = document.createElement('button');
            restartBtn.className = 'choice-btn';
            restartBtn.innerText = "Попробовать уровень заново";
            restartBtn.style.borderColor = "var(--red)";
            restartBtn.onclick = () => startChatScenario(currentScenarioIndex);
            choiceArea.appendChild(restartBtn);
        }
    }, 800);
}

renderRules();