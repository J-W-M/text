const GameState = {
    currentScene: 0,
    currentDialog: 0,
    isTyping: false,
    typeWriterTimer: null,
    fullText: '',
    gameStarted: false,
    flags: {}
};

const backgrounds = {
    school_gate: `linear-gradient(to bottom, #87CEEB 0%, #98D8E8 40%, #F0E68C 40%, #DEB887 60%, #8B7355 100%)`,
    classroom: `linear-gradient(to bottom, #FFF8DC 0%, #F5DEB3 30%, #DEB887 50%, #8B7355 100%)`,
    rooftop: `linear-gradient(to bottom, #FF6B6B 0%, #FFA07A 30%, #FFD700 60%, #87CEEB 100%)`,
    starry_night: `linear-gradient(to bottom, #0a0a1a 0%, #1a1a3a 40%, #2a2a5a 70%, #1a1a3a 100%)`,
    park: `linear-gradient(to bottom, #87CEEB 0%, #90EE90 50%, #228B22 100%)`,
    cafe: `linear-gradient(to bottom, #8B4513 0%, #A0522D 30%, #D2691E 60%, #8B4513 100%)`
};

const characters = {
    heroine: {
        normal: `
            <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4a3728;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2d1f15;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFE4C4;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFDAB9;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="dressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFB6C1;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <ellipse cx="100" cy="380" rx="50" ry="15" fill="rgba(0,0,0,0.2)"/>
                <path d="M70 180 Q60 280 65 380 L135 380 Q140 280 130 180 Z" fill="url(#dressGrad)"/>
                <rect x="65" y="170" width="70" height="30" fill="white" opacity="0.8"/>
                <ellipse cx="100" cy="130" rx="45" ry="55" fill="url(#skinGrad)"/>
                <path d="M55 120 Q50 60 100 50 Q150 60 145 120 Q148 80 130 70 Q100 55 70 70 Q52 80 55 120 Z" fill="url(#hairGrad)"/>
                <path d="M50 130 Q45 180 55 220" stroke="url(#hairGrad)" stroke-width="12" fill="none" stroke-linecap="round"/>
                <path d="M150 130 Q155 180 145 220" stroke="url(#hairGrad)" stroke-width="12" fill="none" stroke-linecap="round"/>
                <path d="M65 105 Q80 100 85 110" stroke="#2d1f15" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M115 105 Q120 100 135 110" stroke="#2d1f15" stroke-width="3" fill="none" stroke-linecap="round"/>
                <ellipse cx="78" cy="125" rx="6" ry="8" fill="#2d1f15"/>
                <ellipse cx="122" cy="125" rx="6" ry="8" fill="#2d1f15"/>
                <circle cx="76" cy="123" r="2" fill="white"/>
                <circle cx="120" cy="123" r="2" fill="white"/>
                <ellipse cx="68" cy="140" rx="8" ry="5" fill="#FFB6C1" opacity="0.5"/>
                <ellipse cx="132" cy="140" rx="8" ry="5" fill="#FFB6C1" opacity="0.5"/>
                <path d="M92 155 Q100 162 108 155" stroke="#CD5C5C" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M65 170 Q50 200 55 250" stroke="url(#skinGrad)" stroke-width="14" fill="none" stroke-linecap="round"/>
                <path d="M135 170 Q150 200 145 250" stroke="url(#skinGrad)" stroke-width="14" fill="none" stroke-linecap="round"/>
            </svg>
        `,
        happy: `
            <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="hairGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4a3728;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2d1f15;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="skinGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFE4C4;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFDAB9;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="dressGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFB6C1;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <ellipse cx="100" cy="380" rx="50" ry="15" fill="rgba(0,0,0,0.2)"/>
                <path d="M70 180 Q60 280 65 380 L135 380 Q140 280 130 180 Z" fill="url(#dressGrad2)"/>
                <rect x="65" y="170" width="70" height="30" fill="white" opacity="0.8"/>
                <ellipse cx="100" cy="130" rx="45" ry="55" fill="url(#skinGrad2)"/>
                <path d="M55 120 Q50 60 100 50 Q150 60 145 120 Q148 80 130 70 Q100 55 70 70 Q52 80 55 120 Z" fill="url(#hairGrad2)"/>
                <path d="M50 130 Q45 180 55 220" stroke="url(#hairGrad2)" stroke-width="12" fill="none" stroke-linecap="round"/>
                <path d="M150 130 Q155 180 145 220" stroke="url(#hairGrad2)" stroke-width="12" fill="none" stroke-linecap="round"/>
                <path d="M65 105 Q80 100 85 110" stroke="#2d1f15" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M115 105 Q120 100 135 110" stroke="#2d1f15" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M72 125 Q78 132 84 125" stroke="#2d1f15" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M116 125 Q122 132 128 125" stroke="#2d1f15" stroke-width="3" fill="none" stroke-linecap="round"/>
                <ellipse cx="68" cy="140" rx="10" ry="6" fill="#FFB6C1" opacity="0.6"/>
                <ellipse cx="132" cy="140" rx="10" ry="6" fill="#FFB6C1" opacity="0.6"/>
                <path d="M88 155 Q100 168 112 155" stroke="#CD5C5C" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M65 170 Q50 200 55 250" stroke="url(#skinGrad2)" stroke-width="14" fill="none" stroke-linecap="round"/>
                <path d="M135 170 Q150 200 145 250" stroke="url(#skinGrad2)" stroke-width="14" fill="none" stroke-linecap="round"/>
            </svg>
        `,
        sad: `
            <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="hairGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4a3728;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2d1f15;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="skinGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFE4C4;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFDAB9;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="dressGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFB6C1;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <ellipse cx="100" cy="380" rx="50" ry="15" fill="rgba(0,0,0,0.2)"/>
                <path d="M70 180 Q60 280 65 380 L135 380 Q140 280 130 180 Z" fill="url(#dressGrad3)"/>
                <rect x="65" y="170" width="70" height="30" fill="white" opacity="0.8"/>
                <ellipse cx="100" cy="130" rx="45" ry="55" fill="url(#skinGrad3)"/>
                <path d="M55 120 Q50 60 100 50 Q150 60 145 120 Q148 80 130 70 Q100 55 70 70 Q52 80 55 120 Z" fill="url(#hairGrad3)"/>
                <path d="M50 130 Q45 180 55 220" stroke="url(#hairGrad3)" stroke-width="12" fill="none" stroke-linecap="round"/>
                <path d="M150 130 Q155 180 145 220" stroke="url(#hairGrad3)" stroke-width="12" fill="none" stroke-linecap="round"/>
                <path d="M65 112 Q80 115 85 108" stroke="#2d1f15" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M115 108 Q120 115 135 112" stroke="#2d1f15" stroke-width="3" fill="none" stroke-linecap="round"/>
                <ellipse cx="78" cy="128" rx="5" ry="7" fill="#2d1f15"/>
                <ellipse cx="122" cy="128" rx="5" ry="7" fill="#2d1f15"/>
                <circle cx="76" cy="126" r="1.5" fill="white"/>
                <circle cx="120" cy="126" r="1.5" fill="white"/>
                <ellipse cx="68" cy="142" rx="8" ry="4" fill="#87CEEB" opacity="0.8"/>
                <ellipse cx="132" cy="142" rx="8" ry="4" fill="#87CEEB" opacity="0.8"/>
                <path d="M92 160 Q100 154 108 160" stroke="#CD5C5C" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M80 145 Q75 160 72 170" stroke="#87CEEB" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
                <path d="M65 170 Q50 200 55 250" stroke="url(#skinGrad3)" stroke-width="14" fill="none" stroke-linecap="round"/>
                <path d="M135 170 Q150 200 145 250" stroke="url(#skinGrad3)" stroke-width="14" fill="none" stroke-linecap="round"/>
            </svg>
        `
    },
    protagonist: {
        normal: `
            <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="hairGradP" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#2c2c2c;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="skinGradP" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFE4C4;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#DEB887;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="suitGradP" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4a4a6a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2a2a4a;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <ellipse cx="100" cy="380" rx="50" ry="15" fill="rgba(0,0,0,0.2)"/>
                <path d="M65 180 Q55 280 60 380 L140 380 Q145 280 135 180 Z" fill="url(#suitGradP)"/>
                <rect x="85" y="175" width="30" height="100" fill="white"/>
                <line x1="100" y1="180" x2="100" y2="280" stroke="#8B0000" stroke-width="3"/>
                <ellipse cx="100" cy="130" rx="42" ry="52" fill="url(#skinGradP)"/>
                <path d="M58 115 Q55 55 100 48 Q145 55 142 115 Q140 75 120 65 Q100 58 80 65 Q60 75 58 115 Z" fill="url(#hairGradP)"/>
                <path d="M62 105 Q78 100 82 108" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M118 108 Q122 100 138 105" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
                <ellipse cx="78" cy="123" rx="5" ry="7" fill="#1a1a1a"/>
                <ellipse cx="122" cy="123" rx="5" ry="7" fill="#1a1a1a"/>
                <circle cx="76" cy="121" r="1.5" fill="white"/>
                <circle cx="120" cy="121" r="1.5" fill="white"/>
                <path d="M90 155 Q100 160 110 155" stroke="#8B4513" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M65 175 Q48 210 52 260" stroke="url(#skinGradP)" stroke-width="14" fill="none" stroke-linecap="round"/>
                <path d="M135 175 Q152 210 148 260" stroke="url(#skinGradP)" stroke-width="14" fill="none" stroke-linecap="round"/>
            </svg>
        `
    }
};

const story = [
    {
        scene: 'prologue',
        background: 'school_gate',
        dialogs: [
            { speaker: '', text: '那是一个普通的春日午后，樱花飘落的季节...', bg: 'school_gate' },
            { speaker: '', text: '我像往常一样走出校门，却不曾想到，命运的齿轮已经开始转动。', bg: 'school_gate' },
            { speaker: '？？？', text: '啊——！', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '我', text: '（什么声音？好像有人撞到了...）', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '？？？', text: '好痛...我的书都散掉了。', charLeft: 'heroine', charLeftExp: 'sad', bg: 'school_gate' },
            { speaker: '我', text: '你没事吧？我来帮你捡。', charLeft: 'heroine', charLeftExp: 'sad', bg: 'school_gate' },
            { speaker: '？？？', text: '啊，谢谢你...真是不好意思。', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '我', text: '没关系。咦，这本书是...《星空观测指南》？', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '？？？', text: '嗯！我很喜欢看星星。你也对天文感兴趣吗？', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            {
                choices: [
                    { text: '是啊，我也很喜欢星空', next: 'like_stars' },
                    { text: '还好，只是偶尔看看', next: 'sometimes' }
                ]
            }
        ]
    },
    {
        scene: 'like_stars',
        background: 'school_gate',
        dialogs: [
            { speaker: '？？？', text: '真的吗？太好了！', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '我', text: '（她的眼睛一下子亮了起来，像星星一样闪耀...）', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '？？？', text: '我叫林星语，很高兴认识你！', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '我', text: '我叫陈曦。林星语...很好听的名字，和星空很配。', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '林星语', text: '嘿嘿，谢谢！因为我出生那天晚上的星空特别美，所以爸妈给我取了这个名字。', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '林星语', text: '对了，这周末有流星雨，你...要不要一起去看？', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '我', text: '（心跳突然加速了...）', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            {
                choices: [
                    { text: '好啊！在哪里见面？', next: 'accept_date' },
                    { text: '这...会不会太突然了？', next: 'hesitate' }
                ]
            }
        ]
    },
    {
        scene: 'sometimes',
        background: 'school_gate',
        dialogs: [
            { speaker: '？？？', text: '这样啊...不过星空真的很美的！', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '我', text: '（她有点失落的样子...要不要说些什么？）', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '？？？', text: '我叫林星语，是隔壁班的。虽然我们可能不太熟...', charLeft: 'heroine', charLeftExp: 'sad', bg: 'school_gate' },
            { speaker: '林星语', text: '这周末有英仙座流星雨，你要不要一起来看？', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '我', text: '（她是在邀请我吗...）', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '林星语', text: '当然如果你不方便的话也没关系啦！我只是...想找人一起分享。', charLeft: 'heroine', charLeftExp: 'sad', bg: 'school_gate' },
            {
                choices: [
                    { text: '我去！在哪里见面？', next: 'accept_date' },
                    { text: '抱歉，这周末我有事', next: 'decline' }
                ]
            }
        ]
    },
    {
        scene: 'accept_date',
        background: 'school_gate',
        dialogs: [
            { speaker: '林星语', text: '真的吗？太好了！', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '林星语', text: '那周六晚上八点，在城市公园的山顶见面！', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '我', text: '好，我一定会到的。', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '林星语', text: '一言为定！那...我先回家啦，周六见！', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '我', text: '周六见。', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '', text: '看着她蹦蹦跳跳离开的背影，我的心久久不能平静...', bg: 'school_gate' },
            { speaker: '', text: '这个周末，会是怎样的夜晚呢？', bg: 'school_gate' },
            { speaker: '', text: '—— 第一章 完 ——', bg: 'starry_night' },
            { speaker: '', text: '感谢您的游玩！\n《星空下的约定》\n后续章节敬请期待...', bg: 'starry_night' }
        ]
    },
    {
        scene: 'hesitate',
        background: 'school_gate',
        dialogs: [
            { speaker: '林星语', text: '啊...也是哦，我们才刚认识，确实有点突然。', charLeft: 'heroine', charLeftExp: 'sad', bg: 'school_gate' },
            { speaker: '我', text: '不是的！我不是那个意思...', charLeft: 'heroine', charLeftExp: 'sad', bg: 'school_gate' },
            { speaker: '林星语', text: '没关系的！你不用勉强。', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '我', text: '（不行，不能就这样错过！）', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '我', text: '我去！我只是有点惊讶而已。', charLeft: 'heroine', charLeftExp: 'normal', bg: 'school_gate' },
            { speaker: '林星语', text: '真的？', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '我', text: '嗯！在哪里见面？', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '林星语', text: '周六晚上八点，城市公园山顶！', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '我', text: '好，一言为定。', charLeft: 'heroine', charLeftExp: 'happy', bg: 'school_gate' },
            { speaker: '', text: '看着她开心的样子，我也不由自主地笑了。', bg: 'school_gate' },
            { speaker: '', text: '这个周末，一定会很特别。', bg: 'school_gate' },
            { speaker: '', text: '—— 第一章 完 ——', bg: 'starry_night' },
            { speaker: '', text: '感谢您的游玩！\n《星空下的约定》\n后续章节敬请期待...', bg: 'starry_night' }
        ]
    },
    {
        scene: 'decline',
        background: 'school_gate',
        dialogs: [
            { speaker: '林星语', text: '这样啊...没关系的。', charLeft: 'heroine', charLeftExp: 'sad', bg: 'school_gate' },
            { speaker: '林星语', text: '那我先走了，再见。', charLeft: 'heroine', charLeftExp: 'sad', bg: 'school_gate' },
            { speaker: '我', text: '嗯...再见。', charLeft: 'heroine', charLeftExp: 'sad', bg: 'school_gate' },
            { speaker: '', text: '看着她落寞的背影，我的心里有些不是滋味。', bg: 'school_gate' },
            { speaker: '', text: '也许...我应该答应她的？', bg: 'school_gate' },
            { speaker: '', text: '一阵风吹过，樱花飘落，仿佛在为这个错过的约定而叹息。', bg: 'school_gate' },
            { speaker: '', text: '—— BAD END ——', bg: 'starry_night' },
            { speaker: '', text: '感谢您的游玩！\n《星空下的约定》\n请尝试其他选项，开启不同的命运...', bg: 'starry_night' }
        ]
    }
];

const bgLayer = document.getElementById('background-layer');
const charLeft = document.getElementById('character-left');
const charCenter = document.getElementById('character-center');
const charRight = document.getElementById('character-right');
const dialogBox = document.getElementById('dialog-box');
const speakerName = document.getElementById('speaker-name');
const dialogText = document.getElementById('dialog-text');
const clickIndicator = document.getElementById('click-indicator');
const choiceContainer = document.getElementById('choice-container');
const titleScreen = document.getElementById('title-screen');
const aboutModal = document.getElementById('about-modal');
const gameMenu = document.getElementById('game-menu');
const menuBtn = document.getElementById('menu-btn');
const saveBtn = document.getElementById('save-btn');

function setBackground(bgName) {
    if (backgrounds[bgName]) {
        bgLayer.style.background = backgrounds[bgName];
        bgLayer.style.backgroundSize = 'cover';
        bgLayer.style.backgroundPosition = 'center';
    }
}

function setCharacter(position, charName, expression) {
    const charEl = position === 'left' ? charLeft : position === 'center' ? charCenter : charRight;
    
    if (charName && characters[charName] && characters[charName][expression]) {
        charEl.innerHTML = characters[charName][expression];
        charEl.classList.add('visible');
    } else {
        charEl.classList.remove('visible');
    }
}

function clearAllCharacters() {
    charLeft.classList.remove('visible');
    charCenter.classList.remove('visible');
    charRight.classList.remove('visible');
}

function typeWriter(text, callback) {
    GameState.isTyping = true;
    GameState.fullText = text;
    dialogText.textContent = '';
    clickIndicator.classList.remove('visible');
    
    let index = 0;
    const speed = 40;
    
    function type() {
        if (index < text.length) {
            dialogText.textContent += text.charAt(index);
            index++;
            GameState.typeWriterTimer = setTimeout(type, speed);
        } else {
            GameState.isTyping = false;
            clickIndicator.classList.add('visible');
            if (callback) callback();
        }
    }
    
    type();
}

function skipTypeWriter() {
    if (GameState.typeWriterTimer) {
        clearTimeout(GameState.typeWriterTimer);
    }
    dialogText.textContent = GameState.fullText;
    GameState.isTyping = false;
    clickIndicator.classList.add('visible');
}

function findScene(sceneName) {
    return story.find(s => s.scene === sceneName);
}

function showDialog(sceneName, dialogIndex) {
    const scene = findScene(sceneName);
    if (!scene) return;
    
    const dialog = scene.dialogs[dialogIndex];
    if (!dialog) return;
    
    GameState.currentScene = sceneName;
    GameState.currentDialog = dialogIndex;
    
    if (dialog.bg) {
        setBackground(dialog.bg);
    }
    
    if (dialog.charLeft) {
        setCharacter('left', dialog.charLeft, dialog.charLeftExp || 'normal');
    } else if (dialog.charLeft === null) {
        charLeft.classList.remove('visible');
    }
    
    if (dialog.charCenter) {
        setCharacter('center', dialog.charCenter, dialog.charCenterExp || 'normal');
    } else if (dialog.charCenter === null) {
        charCenter.classList.remove('visible');
    }
    
    if (dialog.charRight) {
        setCharacter('right', dialog.charRight, dialog.charRightExp || 'normal');
    } else if (dialog.charRight === null) {
        charRight.classList.remove('visible');
    }
    
    if (dialog.choices) {
        showChoices(dialog.choices);
        return;
    }
    
    if (dialog.speaker) {
        speakerName.textContent = dialog.speaker;
        speakerName.classList.add('visible');
    } else {
        speakerName.classList.remove('visible');
    }
    
    typeWriter(dialog.text);
    choiceContainer.classList.remove('visible');
}

function showChoices(choices) {
    clickIndicator.classList.remove('visible');
    choiceContainer.innerHTML = '';
    
    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.addEventListener('click', () => {
            choiceContainer.classList.remove('visible');
            GameState.flags[`choice_${GameState.currentScene}_${index}`] = true;
            showDialog(choice.next, 0);
        });
        choiceContainer.appendChild(btn);
    });
    
    setTimeout(() => {
        choiceContainer.classList.add('visible');
    }, 100);
}

function nextDialog() {
    if (GameState.isTyping) {
        skipTypeWriter();
        return;
    }
    
    const scene = findScene(GameState.currentScene);
    if (!scene) return;
    
    const nextIndex = GameState.currentDialog + 1;
    if (nextIndex < scene.dialogs.length) {
        showDialog(GameState.currentScene, nextIndex);
    }
}

function startGame() {
    GameState.gameStarted = true;
    titleScreen.classList.add('hidden');
    menuBtn.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
    clearAllCharacters();
    showDialog('prologue', 0);
}

function returnToTitle() {
    GameState.gameStarted = false;
    titleScreen.classList.remove('hidden');
    menuBtn.classList.add('hidden');
    saveBtn.classList.add('hidden');
    gameMenu.classList.add('hidden');
    aboutModal.classList.add('hidden');
    clearAllCharacters();
    setBackground('school_gate');
}

function saveGame() {
    const saveData = {
        currentScene: GameState.currentScene,
        currentDialog: GameState.currentDialog,
        flags: GameState.flags
    };
    localStorage.setItem('visual_novel_save', JSON.stringify(saveData));
    alert('游戏已保存！');
}

function loadGame() {
    const saveData = localStorage.getItem('visual_novel_save');
    if (!saveData) {
        alert('没有找到存档！');
        return false;
    }
    
    try {
        const data = JSON.parse(saveData);
        GameState.currentScene = data.currentScene || 'prologue';
        GameState.currentDialog = data.currentDialog || 0;
        GameState.flags = data.flags || {};
        
        if (!GameState.gameStarted) {
            startGame();
        }
        
        showDialog(GameState.currentScene, GameState.currentDialog);
        gameMenu.classList.add('hidden');
        return true;
    } catch (e) {
        alert('存档损坏！');
        return false;
    }
}

function hasSaveData() {
    return localStorage.getItem('visual_novel_save') !== null;
}

document.getElementById('start-btn').addEventListener('click', startGame);

document.getElementById('load-btn').addEventListener('click', () => {
    if (!loadGame()) {
        alert('没有存档，请先开始新游戏。');
    }
});

document.getElementById('about-btn').addEventListener('click', () => {
    aboutModal.classList.remove('hidden');
});

document.getElementById('close-about').addEventListener('click', () => {
    aboutModal.classList.add('hidden');
});

menuBtn.addEventListener('click', () => {
    gameMenu.classList.remove('hidden');
});

document.getElementById('resume-btn').addEventListener('click', () => {
    gameMenu.classList.add('hidden');
});

document.getElementById('quick-save-btn').addEventListener('click', () => {
    saveGame();
});

document.getElementById('quick-load-btn').addEventListener('click', () => {
    loadGame();
});

document.getElementById('return-title-btn').addEventListener('click', () => {
    returnToTitle();
});

saveBtn.addEventListener('click', saveGame);

dialogBox.addEventListener('click', (e) => {
    if (!GameState.gameStarted) return;
    if (choiceContainer.classList.contains('visible')) return;
    nextDialog();
});

document.addEventListener('keydown', (e) => {
    if (!GameState.gameStarted) return;
    
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (choiceContainer.classList.contains('visible')) return;
        if (gameMenu.classList.contains('hidden') && aboutModal.classList.contains('hidden')) {
            nextDialog();
        }
    }
    
    if (e.code === 'Escape') {
        if (!gameMenu.classList.contains('hidden')) {
            gameMenu.classList.add('hidden');
        } else if (!aboutModal.classList.contains('hidden')) {
            aboutModal.classList.add('hidden');
        } else if (GameState.gameStarted) {
            gameMenu.classList.remove('hidden');
        }
    }
    
    if (e.code === 'KeyS' && GameState.gameStarted) {
        saveGame();
    }
    
    if (e.code === 'KeyL' && GameState.gameStarted) {
        loadGame();
    }
});

setBackground('school_gate');

function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    starsContainer.id = 'stars-container';
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 3 + 1;
        star.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 60}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        starsContainer.appendChild(star);
    }
    
    bgLayer.appendChild(starsContainer);
}

createStars();
