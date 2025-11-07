(() => {
    'use strict';

    const host = location.hostname;
    const debug = false;
    let currentLanguage = localStorage.getItem('lang') || 'vi';

    // Translations - ĐÃ CHUYỂN THÀNH LUE X
    const translations = {
        vi: {
            title: "LUE X Bypass",
            pleaseSolveCaptcha: "Vui lòng giải CAPTCHA để tiếp tục",
            captchaSuccess: "CAPTCHA đã thành công",
            redirectingToWork: "Đang qua Work.ink...",
            bypassSuccessCopy: "Bypass thành công, đã Copy Key (bấm 'Cho Phép' nếu có)",
            waitingCaptcha: "Đang chờ CAPTCHA...",
            pleaseReload: "Vui lòng tải lại trang...(workink lỗi)",
            bypassSuccess: "Bypass thành công, chờ {time}s...",
            backToCheckpoint: "Đang về lại Checkpoint...",
            captchaSuccessBypassing: "CAPTCHA đã thành công, đang bypass...",
            version: "Phiên bản v1.6.3.0",
            madeBy: "Được tạo bởi LUE X (dựa trên IHaxU)"
        },
        en: {
            title: "LUE X Bypass",
            pleaseSolveCaptcha: "Please solve the CAPTCHA to continue",
            captchaSuccess: "CAPTCHA solved successfully",
            redirectingToWork: "Redirecting to Work.ink...",
            bypassSuccessCopy: "Bypass successful! Key copied (click 'Allow' if prompted)",
            waitingCaptcha: "Waiting for CAPTCHA...",
            pleaseReload: "Please reload the page...(workink bugs)",
            bypassSuccess: "Bypass successful, waiting {time}s...",
            backToCheckpoint: "Returning to checkpoint...",
            captchaSuccessBypassing: "CAPTCHA solved successfully, bypassing...",
            version: "Version v1.6.3.0",
            madeBy: "Made by LUE X (based on IHaxU)"
        }
    };

    function t(key, replacements = {}) {
        let text = translations[currentLanguage][key] || key;
        Object.keys(replacements).forEach(placeholder => {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        });
        return text;
    }

    class BypassPanel {
        constructor() {
            this.container = null;
            this.shadow = null;
            this.panel = null;
            this.statusText = null;
            this.statusDot = null;
            this.versionEl = null;
            this.creditEl = null;
            this.langBtns = [];
            this.currentMessageKey = null;
            this.currentType = 'info';
            this.currentReplacements = {};
            this.isMinimized = false;
            this.body = null;
            this.minimizeBtn = null;
            this.websiteBtn = null;
            this.init();
        }

        init() {
            this.createPanel();
            this.setupEventListeners();
        }

        createPanel() {
            this.container = document.createElement('div');
            this.shadow = this.container.attachShadow({ mode: 'closed' });

            const style = document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@700;800&display=swap');

                * { margin: 0; padding: 0; box-sizing: border-box; }

                .panel-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 500px;
                    z-index: 2147483647;
                    font-family: 'Exo 2', sans-serif;
                    perspective: 1200px;
                }

                .panel {
                    background: #0a0000;
                    border: 3px solid #ff1a1a;
                    border-radius: 28px;
                    overflow: hidden;
                    box-shadow: 
                        0 0 50px #ff1a1a,
                        0 0 100px #ff3333,
                        0 0 150px rgba(255, 26, 26, 0.5),
                        inset 0 0 50px rgba(255, 26, 26, 0.2);
                    animation: ignite 0.9s ease-out;
                    transition: all 0.5s ease;
                    transform-style: preserve-3d;
                    position: relative;
                }

                @keyframes ignite {
                    from {
                        opacity: 0;
                        transform: scale(0.8) rotateX(-20deg) translateY(-40px);
                        box-shadow: 0 0 0 #ff1a1a;
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) rotateX(0) translateY(0);
                    }
                }

                .header {
                    background: linear-gradient(135deg, #1f0000 0%, #3d0000 50%, #1f0000 100%);
                    padding: 30px 34px;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    border-bottom: 2px solid #ff1a1a;
                    position: relative;
                    overflow: hidden;
                }

                .header::before {
                    content: '';
                    position: absolute;
                    top: -250%;
                    left: -250%;
                    width: 600%;
                    height: 600%;
                    background: radial-gradient(circle, rgba(255, 26, 26, 0.35), transparent 65%);
                    animation: redPulse 6s infinite;
                    pointer-events: none;
                }

                @keyframes redPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.5); }
                }

                .logo-container {
                    width: 82px;
                    height: 82px;
                    background: linear-gradient(135deg, #ff1a1a, #cc0000);
                    border-radius: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    box-shadow: 
                        0 0 40px #ff1a1a,
                        0 0 70px #ff3333,
                        inset 0 0 35px rgba(0,0,0,0.7);
                    animation: logoFloat 3s infinite ease-in-out;
                    border: 3.5px solid #ff4d4d;
                    overflow: hidden;
                    transform: rotateX(12deg);
                }

                .logo-container::after {
                    content: 'LUE X';
                    font-family: 'Orbitron', sans-serif;
                    font-weight: 900;
                    font-size: 22px;
                    color: #fff;
                    letter-spacing: 0.8px;
                    text-shadow: 
                        0 0 20px #ff1a1a,
                        0 0 35px #ff3333,
                        0 0 45px #ff1a1a;
                    position: absolute;
                    transform: rotateX(-12deg);
                }

                @keyframes logoFloat {
                    0%, 100% { transform: translateY(0) rotateX(12deg); }
                    50% { transform: translateY(-10px) rotateX(12deg); }
                }

                .title {
                    font-family: 'Orbitron', sans-serif;
                    font-size: 30px;
                    font-weight: 900;
                    color: #fff;
                    text-shadow: 
                        0 0 30px #ff1a1a,
                        0 4px 12px rgba(0,0,0,0.9);
                    letter-spacing: 3px;
                    flex: 1;
                    background: linear-gradient(90deg, #fff, #ff4d4d);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .minimize-btn {
                    background: rgba(255, 26, 26, 0.35);
                    border: 3px solid #ff4d4d;
                    color: #fff;
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    font-weight: 700;
                    transition: all 0.45s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    box-shadow: 0 0 35px rgba(255, 26, 26, 0.7);
                }

                .minimize-btn:hover {
                    background: #ff1a1a;
                    transform: scale(1.35) rotate(180deg);
                    box-shadow: 0 0 60px #ff3333, 0 0 80px #ff1a1a;
                }

                .status-section {
                    padding: 32px;
                    background: rgba(255, 26, 26, 0.06);
                    border-bottom: 1px dashed #ff1a1a;
                }

                .status-box {
                    background: rgba(30, 0, 0, 0.7);
                    border: 2.5px solid rgba(255, 26, 26, 0.55);
                    border-radius: 24px;
                    padding: 26px;
                    position: relative;
                    overflow: hidden;
                }

                .status-box::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 26, 26, 0.18), transparent);
                    animation: scanRed 2.8s infinite;
                }

                @keyframes scanRed {
                    0% { transform: translateX(-180%); }
                    100% { transform: translateX(180%); }
                }

                .status-content {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    position: relative;
                    z-index: 1;
                }

                .status-dot {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #ff1a1a;
                    box-shadow: 0 0 40px #ff3333, 0 0 60px #ff1a1a;
                    animation: dotPulse 1.6s infinite;
                }

                .status-dot.info { background: #60a5fa; box-shadow: 0 0 40px #60a5fa; }
                .status-dot.success { background: #4ade80; box-shadow: 0 0 40px #4ade80; }
                .status-dot.warning { background: #facc15; box-shadow: 0 0 40px #facc15; }
                .status-dot.error { background: #f87171; box-shadow: 0 0 40px #f87171; }

                @keyframes dotPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.7); opacity: 0.7; }
                }

                .status-text {
                    color: #ffeeee;
                    font-size: 17px;
                    font-weight: 700;
                    flex: 1;
                    line-height: 1.7;
                    text-shadow: 0 0 18px rgba(255, 26, 26, 0.8);
                }

                .panel-body {
                    max-height: 600px;
                    overflow: hidden;
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 1;
                    background: rgba(25, 0, 0, 0.45);
                }

                .panel-body.hidden {
                    max-height: 0;
                    opacity: 0;
                    padding: 0 34px;
                }

                .language-section {
                    padding: 28px 34px;
                    border-bottom: 1px dashed #ff1a1a;
                }

                .lang-toggle {
                    display: flex;
                    gap: 22px;
                }

                .lang-btn {
                    flex: 1;
                    background: rgba(255, 26, 26, 0.2);
                    border: 3px solid rgba(255, 77, 77, 0.65);
                    color: #ff9999;
                    padding: 18px;
                    border-radius: 22px;
                    cursor: pointer;
                    font-weight: 800;
                    font-size: 15.5px;
                    transition: all 0.45s ease;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                }

                .lang-btn:hover {
                    background: rgba(255, 26, 26, 0.4);
                    border-color: #ff1a1a;
                    color: #fff;
                    transform: translateY(-7px);
                    box-shadow: 0 20px 40px rgba(255, 26, 26, 0.6);
                }

                .lang-btn.active {
                    background: linear-gradient(135deg, #ff1a1a, #cc0000);
                    border-color: #ff1a1a;
                    color: #fff;
                    box-shadow: 0 0 50px rgba(255, 26, 26, 1);
                    font-weight: 900;
                }

                .info-section {
                    padding: 28px 34px;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.55);
                }

                .version {
                    color: #ff6666;
                    font-size: 15.5px;
                    font-weight: 700;
                    margin-bottom: 14px;
                    text-shadow: 0 0 18px rgba(255, 26, 26, 0.7);
                }

                .credit {
                    color: #ff9999;
                    font-size: 15.5px;
                    font-weight: 700;
                    margin-bottom: 20px;
                }

                .credit-author {
                    color: #ff1a1a;
                    font-weight: 900;
                    font-family: 'Orbitron', sans-serif;
                    text-shadow: 0 0 25px #ff1a1a;
                }

                .links {
                    display: flex;
                    justify-content: center;
                    gap: 36px;
                    margin-bottom: 20px;
                }

                .links a {
                    color: #ff6666;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 14px;
                    transition: all 0.45s;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .links a:hover {
                    color: #ff1a1a;
                    text-shadow: 0 0 22px #ff1a1a;
                    transform: scale(1.3);
                }

                .website-btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #ff1a1a, #cc0000);
                    color: #fff;
                    padding: 16px 32px;
                    border-radius: 60px;
                    font-weight: 800;
                    font-size: 15px;
                    text-transform: uppercase;
                    letter-spacing: 2.5px;
                    cursor: pointer;
                    margin-top: 18px;
                    transition: all 0.45s ease;
                    box-shadow: 0 0 35px rgba(255, 26, 26, 0.7);
                    text-shadow: 0 0 18px #ff1a1a;
                }

                .website-btn:hover {
                    background: #ff3333;
                    transform: translateY(-5px) scale(1.08);
                    box-shadow: 0 0 60px #ff1a1a, 0 0 85px #ff3333;
                }

                @media (max-width: 480px) {
                    .panel-container {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        width: auto;
                    }
                    .title { font-size: 26px; }
                    .logo-container { width: 70px; height: 70px; }
                    .logo-container::after { font-size: 19px; }
                }
            `;

            this.shadow.appendChild(style);

            const panelHTML = `
                <div class="panel-container">
                    <div class="panel">
                        <div class="header">
                            <div class="logo-container"></div>
                            <div class="title">LUE X BYPASS</div>
                            <button class="minimize-btn" id="minimize-btn">−</button>
                        </div>
                        <div class="status-section">
                            <div class="status-box">
                                <div class="status-content">
                                    <div class="status-dot info" id="status-dot"></div>
                                    <div class="status-text" id="status-text">${t('pleaseSolveCaptcha')}</div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body" id="panel-body">
                            <div class="language-section">
                                <div class="lang-toggle">
                                    <button class="lang-btn ${currentLanguage === 'vi' ? 'active' : ''}" data-lang="vi">Tiếng Việt</button>
                                    <button class="lang-btn ${currentLanguage === 'en' ? 'active' : ''}" data-lang="en">English</button>
                                </div>
                            </div>
                            <div class="info-section">
                                <div class="version" id="version">${t('version')}</div>
                                <div class="credit" id="credit">
                                    ${t('madeBy').replace('LUE X', '<span class="credit-author">LUE X</span>')}
                                </div>
                                <div class="links">
                                    <a href="https://www.youtube.com/@luexbypass" target="_blank">YouTube</a>
                                    <a href="https://discord.gg/luexbypass" target="_blank">Discord</a>
                                </div>
                                <div class="website-btn" id="website-btn">
                                    luexteamscript.vercel.app
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const wrapper = document.createElement('div');
            wrapper.innerHTML = panelHTML;
            this.shadow.appendChild(wrapper.firstElementChild);

            this.panel = this.shadow.querySelector('.panel');
            this.statusText = this.shadow.querySelector('#status-text');
            this.statusDot = this.shadow.querySelector('#status-dot');
            this.versionEl = this.shadow.querySelector('#version');
            this.creditEl = this.shadow.querySelector('#credit');
            this.langBtns = Array.from(this.shadow.querySelectorAll('.lang-btn'));
            this.body = this.shadow.querySelector('#panel-body');
            this.minimizeBtn = this.shadow.querySelector('#minimize-btn');
            this.websiteBtn = this.shadow.querySelector('#website-btn');

            document.documentElement.appendChild(this.container);
        }

        setupEventListeners() {
            this.langBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    currentLanguage = btn.dataset.lang;
                    localStorage.setItem('lang', currentLanguage);
                    this.updateLanguage();
                });
            });

            this.minimizeBtn.addEventListener('click', () => {
                this.isMinimized = !this.isMinimized;
                this.body.classList.toggle('hidden');
                this.minimizeBtn.textContent = this.isMinimized ? '+' : '−';
            });

            this.websiteBtn.addEventListener('click', () => {
                window.open('https://luexteamscript.vercel.app', '_blank');
            });
        }

        updateLanguage() {
            this.langBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
            });

            this.shadow.querySelector('.title').textContent = 'LUE X BYPASS';
            this.versionEl.textContent = t('version');
            this.creditEl.innerHTML = t('madeBy').replace('LUE X', '<span class="credit-author">LUE X</span>');

            if (this.currentMessageKey) {
                this.show(this.currentMessageKey, this.currentType, this.currentReplacements);
            }
        }

        show(messageKey, type = 'info', replacements = {}) {
            this.currentMessageKey = messageKey;
            this.currentType = type;
            this.currentReplacements = replacements;

            const message = t(messageKey, replacements);
            this.statusText.textContent = message;
            this.statusDot.className = `status-dot ${type}`;
        }
    }

    let panel = null;
    setTimeout(() => {
        panel = new BypassPanel();
        panel.show('pleaseSolveCaptcha', 'info');
    }, 100);

    if (host.includes("key.volcano.wtf")) handleVolcano();
    else if (host.includes("work.ink")) handleWorkInk();

    function handleVolcano() {
        if (panel) panel.show('pleaseSolveCaptcha', 'info');
        if (debug) console.log('[Debug] Waiting Captcha');

        let alreadyDoneContinue = false;
        let alreadyDoneCopy = false;

        function actOnCheckpoint(node) {
            if (!alreadyDoneContinue) {
                const buttons = node && node.nodeType === 1
                    ? node.matches('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                        ? [node]
                        : node.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]')
                    : document.querySelectorAll('#primaryButton[type="submit"], button[type="submit"], a, input[type=button], input[type=submit]');
                for (const btn of buttons) {
                    const text = (btn.innerText || btn.value || "").trim().toLowerCase();
                    if (text.includes("continue") || text.includes("next step")) {
                        const disabled = btn.disabled || btn.getAttribute("aria-disabled") === "true";
                        const style = getComputedStyle(btn);
                        const visible = style.display !== "none" && style.visibility !== "hidden" && btn.offsetParent !== null;
                        if (visible && !disabled) {
                            alreadyDoneContinue = true;
                            if (panel) panel.show('captchaSuccess', 'success');
                            if (debug) console.log('[Debug] Captcha Solved');

                            for (const btn of buttons) {
                                const currentBtn = btn;
                                const currentPanel = panel;

                                setTimeout(() => {
                                    try {
                                        currentBtn.click();
                                        if (currentPanel) currentPanel.show('redirectingToWork', 'info');
                                        if (debug) console.log('[Debug] Clicking Continue');
                                    } catch (err) {
                                        if (debug) console.log('[Debug] No Continue Found', err);
                                    }
                                }, 300);
                            }
                            return true;
                        }
                    }
                }
            }

            const copyBtn = node && node.nodeType === 1
                ? node.matches("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                    ? node
                    : node.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']")
                : document.querySelector("#copy-key-btn, .copy-btn, [aria-label='Copy']");
            if (copyBtn) {
                setInterval(() => {
                    try {
                        copyBtn.click();
                        if (debug) console.log('[Debug] Copy button spam click');
                        if (panel) panel.show('bypassSuccessCopy', 'success');
                    } catch (err) {
                        if (debug) console.log('[Debug] No Copy Found', err);
                    }
                }, 500);
                return true;
            }

            return false;
        }

        const mo = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (actOnCheckpoint(node)) {
                                if (alreadyDoneCopy) {
                                    mo.disconnect();
                                    return;
                                }
                            }
                        }
                    }
                }
                if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
                    if (actOnCheckpoint(mutation.target)) {
                        if (alreadyDoneCopy) {
                            mo.disconnect();
                            return;
                        }
                    }
                }
            }
        });

        mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'style'] });

        if (actOnCheckpoint()) {
            if (alreadyDoneCopy) {
                mo.disconnect();
            }
        }
    }

    function handleWorkInk() {
        if (panel) panel.show('pleaseSolveCaptcha', 'info');

        const startTime = Date.now();
        let sessionControllerA = undefined;
        let sendMessageA = undefined;
        let onLinkInfoA = undefined;
        let linkInfoA = undefined;
        let onLinkDestinationA = undefined;
        let bypassTriggered = false;
        let destinationReceived = false;

        const map = {
            onLI: ["onLinkInfo"],
            onLD: ["onLinkDestination"]
        };

        function resolveName(obj, candidates) {
            if (!obj || typeof obj !== "object") {
                return { fn: null, index: -1, name: null };
            }
            
            for (let i = 0; i < candidates.length; i++) {
                const name = candidates[i];
                if (typeof obj[name] === "function") {
                    return { fn: obj[name], index: i, name };
                }
            }
            return { fn: null, index: -1, name: null };
        }

        function resolveWriteFunction(obj) {
            if (!obj || typeof obj !== "object") {
                return { fn: null, index: -1, name: null };
            }
            
            for (let i in obj) {
                if (typeof obj[i] === "function" && obj[i].length === 2) {
                    return { fn: obj[i], name: i };
                }
            }
            return { fn: null, index: -1, name: null };
        }

        const types = {
            mo: 'c_monetization',
            ss: 'c_social_started',
            tr: 'c_turnstile_response',
            ad: 'c_adblocker_detected',
            ping: 'c_ping'
        };

        function triggerBypass(reason) {
            if (bypassTriggered) {
                if (debug) console.log('[Debug] trigger Bypass skipped, already triggered');
                return;
            }
            bypassTriggered = true;
            if (debug) console.log('[Debug] trigger Bypass via:', reason);
            if (panel) panel.show('captchaSuccessBypassing', 'success');
            
            let retryCount = 0;
            function keepSpoofing() {
                if (destinationReceived) {
                    if (debug) console.log('[Debug] Destination received, stopping spoofing after', retryCount, 'attempts');
                    return;
                }
                retryCount++;
                if (debug) console.log(`[Debug] Spoofing attempt #${retryCount}`);
                spoofWorkink();
                setTimeout(keepSpoofing, 3000);
            }
            keepSpoofing();
            if (debug) console.log('[Debug] Waiting for server to send destination data...');
        }

        function spoofWorkink() {
            if (!linkInfoA) {
                if (debug) console.log('[Debug] spoof Workink skipped: no sessionControllerA.linkInfo');
                return;
            }
            if (debug) console.log('[Debug] spoof Workink starting, linkInfo:', linkInfoA);
            
            const socials = linkInfoA.socials || [];
            if (debug) console.log('[Debug] Total socials to fake:', socials.length);
            
            for (let i = 0; i < socials.length; i++) {
                const soc = socials[i];
                try {
                    if (sendMessageA) {
                        sendMessageA.call(sessionControllerA, types.ss, { url: soc.url });
                        if (debug) console.log(`[Debug] Faked social [${i+1}/${socials.length}]:`, soc.url);
                    } else {
                        if (debug) console.warn(`[Debug] No send message for social [${i+1}/${socials.length}]:`, soc.url);
                    }
                } catch (e) {
                    if (debug) console.error(`[Debug] Error faking social [${i+1}/${socials.length}]:`, soc.url, e);
                }
            }
            
            const monetizations = sessionControllerA?.monetizations || [];
            if (debug) console.log('[Debug] Total monetizations to fake:', monetizations.length);
            
            for (let i = 0; i < monetizations.length; i++) {
                const monetization = monetizations[i];
                if (debug) console.log(`[Dyrian] Processing monetization [${i+1}/${monetizations.length}]:`, monetization);
                const monetizationId = monetization.id;
                const monetizationSendMessage = monetization.sendMessage;

                try {
                    switch (monetizationId) {
                        case 22: {
                            monetizationSendMessage.call(monetization, { event: 'read' });
                            if (debug) console.log(`[Debug] Faked readArticles2 [${i+1}/${monetizations.length}]`);
                            break;
                        }
                        case 25: {
                            monetizationSendMessage.call(monetization, { event: 'start' });
                            monetizationSendMessage.call(monetization, {  event: 'installedClicked' });
                            fetch('/_api/v2/affiliate/operaGX', { method: 'GET', mode: 'no-cors' });
                            setTimeout(() => {
                                fetch('https://work.ink/_api/v2/callback/operaGX', {
                                    method: 'POST',
                                    mode: 'no-cors',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        'noteligible': true
                                    })
                                });
                            }, 5000);
                            if (debug) console.log(`[Debug] Faked operaGX [${i+1}/${monetizations.length}]`);
                            break;
                        }
                        case 34: {
                            monetizationSendMessage.call(monetization, { event: 'start' });
                            monetizationSendMessage.call(monetization, { event: 'installedClicked' });
                            if (debug) console.log(`[Debug] Faked norton [${i+1}/${monetizations.length}]`);
                            break;
                        }
                        case 71: {
                            monetizationSendMessage.call(monetization, { event: 'start' });
                            monetizationSendMessage.call(monetization, { event: 'installed' });
                            if (debug) console.log(`[Debug] Faked externalArticles [${i+1}/${monetizations.length}]`);
                            break;
                        }
                        case 45: {
                            monetizationSendMessage.call(monetization, { event: 'installed' });
                            if (debug) console.log(`[Debug] Faked pdfeditor [${i+1}/${monetizations.length}]`);
                            break;
                        }
                        case 57: {
                            monetizationSendMessage.call(monetization, { event: 'installed' });
                            if (debug) console.log(`[Debug] Faked betterdeals [${i+1}/${monetizations.length}]`);
                            break;
                        }
                        default: {
                            if (debug) console.log(`[Debug] Unknown monetization [${i+1}/${monetizations.length}]:`, monetization);
                            break;
                        }
                    }    
                } catch (e) {
                    if (debug) console.error(`[Debug] Error faking monetization [${i+1}/${monetizations.length}]:`, monetization, e);
                }
            }
            
            if (debug) console.log('[Debug] spoof Workink completed');
        }

        function createSendMessageProxy() {
            return function(...args) {
                const pt = args[0];
                const pd = args[1];
                
                if (pt !== types.ping) {
                    if (debug) console.log('[Debug] Message sent:', pt, pd);
                }
                
                if (pt === types.ad) {
                    if (debug) console.log('[Debug] Blocking adblocker message');
                    return;
                }
                
                if (pt === types.tr) {
                    if (debug) console.log('[Debug] Captcha bypassed via TR');
                    triggerBypass('tr');
                }
                
                return sendMessageA ? sendMessageA.apply(this, args) : undefined;
            };
        }

        function createLinkInfoProxy() {
            return function(...args) {
                const info = args[0];
                linkInfoA = info;
                if (debug) console.log('[Debug] Link info:', info);
                spoofWorkink();
                try {
                    Object.defineProperty(info, 'isAdblockEnabled', {
                        get: () => false,
                        set: () => {},
                        configurable: false,
                        enumerable: true
                    });
                    if (debug) console.log('[Debug] Adblock disabled in linkInfo');
                } catch (e) {
                    if (debug) console.warn('[Debug] Define Property failed:', e);
                }
                return onLinkInfoA ? onLinkInfoA.apply(this, args): undefined;
            };
        }

        function redirect(url) {
            if (debug) console.log('[Debug] Redirecting to:', url);
            window.location.href = url;
        }

        function startCountdown(url, waitLeft) {
            if (debug) console.log('[Debug] startCountdown: Started with', waitLeft, 'seconds');
            if (panel) panel.show('bypassSuccess', 'warning', { time: Math.ceil(waitLeft) });

            const interval = setInterval(() => {
                waitLeft -= 1;
                if (waitLeft > 0) {
                    if (debug) console.log('[Debug] startCountdown: Time remaining:', waitLeft);
                    if (panel) panel.show('bypassSuccess', 'warning', { time: Math.ceil(waitLeft) });
                } else {
                    clearInterval(interval);
                    redirect(url);
                }
            }, 1000);
        }

        function createDestinationProxy() {
            return function(...args) {
                const data = args[0];
                const secondsPassed = (Date.now() - startTime) / 1000;
                destinationReceived = true;
                if (debug) console.log('[Debug] Destination data:', data.url);

                let waitTimeSeconds = 5;
                const url = location.href;
                if (url.includes('42rk6hcq') || url.includes('ito4wckq') || url.includes('pzarvhq1')) {
                    waitTimeSeconds = 38;
                }

                if (secondsPassed >= waitTimeSeconds) {
                    if (panel) panel.show('backToCheckpoint', 'info');
                    redirect(data.url);
                } else {
                    startCountdown(data.url, waitTimeSeconds - secondsPassed);
                }
                return onLinkDestinationA ? onLinkDestinationA.apply(this, args): undefined;
            };
        }

        function setupProxies() {
            const send = resolveWriteFunction(sessionControllerA);
            const info = resolveName(sessionControllerA, map.onLI);
            const dest = resolveName(sessionControllerA, map.onLD);

            sendMessageA = send.fn;
            onLinkInfoA = info.fn;
            onLinkDestinationA = dest.fn;

            const sendMessageProxy = createSendMessageProxy();
            const onLinkInfoProxy = createLinkInfoProxy();
            const onDestinationProxy = createDestinationProxy();

            Object.defineProperty(sessionControllerA, send.name, {
                get() { return sendMessageProxy },
                set(v) { sendMessageA = v },
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(sessionControllerA, info.name, {
                get() { return onLinkInfoProxy },
                set(v) { onLinkInfoA = v },
                configurable: false,
                enumerable: true
            });

            Object.defineProperty(sessionControllerA, dest.name, {
                get() { return onDestinationProxy },
                set(v) { onLinkDestinationA = v },
                configurable: false,
                enumerable: true
            });

            if (debug) console.log(`[Debug] setupProxies: installed ${send.name}, ${info.name}, ${dest.name}`);
        }


        function checkController(target, prop, value, receiver) {
            if (debug) console.log('[Debug] Checking prop:', prop, typeof value);
            if (value &&
                typeof value === 'object' &&
                resolveWriteFunction(value).fn &&
                resolveName(value, map.onLI).fn &&
                resolveName(value, map.onLD).fn &&
                !sessionControllerA) {
                sessionControllerA = value;
                if (debug) console.log('[Debug] Controller detected:', sessionControllerA);
                setupProxies();
            } else {
                if (debug) console.log('[Debug] checkController: No controller found for prop:', prop);
            }
            return Reflect.set(target, prop, value, receiver);
        }

        function createComponentProxy(comp) {
            return new Proxy(comp, {
                construct(target, args) {
                    const instance = Reflect.construct(target, args);
                    if (instance.$$.ctx) {
                        instance.$$.ctx = new Proxy(instance.$$.ctx, { set: checkController });
                    }
                    return instance;
                }
            });
        }

        function creaNodeResultProxy(result) {
            return new Proxy(result, {
                get: (target, prop, receiver) => {
                    if (prop === 'component') {
                        return createComponentProxy(target.component);
                    }
                    return Reflect.get(target, prop, receiver);
                }
            });
        }

        function createNodeProxy(oldNode) {
            return async (...args) => {
                const result = await oldNode(...args);
                return creaNodeResultProxy(result);
                }
        }

        function createKitProxy(kit) {
            if (!kit?.start) return [false, kit];

            return [
                true,
                new Proxy(kit, {
                    get(target, prop, receiver) {
                        if (prop === 'start') {
                            return function(...args) {
                                const appModule = args[0];
                                const options = args[2];

                                if (
                                    typeof appModule === 'object' &&
                                    typeof appModule.nodes === 'object' &&
                                    typeof options === 'object' &&
                                    typeof options.node_ids === 'object'
                                ) {
                                    const nodeIndex = options.node_ids[1];
                                    const oldNode = appModule.nodes[nodeIndex];
                                    appModule.nodes[nodeIndex] = createNodeProxy(oldNode);
                                }

                                if (debug) console.log('[Debug] kit.start intercepted!', options);
                                return kit.start.apply(this, args);
                            };
                        }
                        return Reflect.get(target, prop, receiver);
                    }
                })
            ];
        }

        function setupInterception() {
            const origPromiseAll = Promise.all;
            let intercepted = false;

            Promise.all = async function(promises) {
                const result = origPromiseAll.call(this, promises);
                if (!intercepted) {
                    intercepted = true;
                    return await new Promise((resolve) => {
                        result.then(([kit, app, ...args]) => {
                            if (debug) console.log('[Debug]: Set up Interception!');

                            const [success, created] = createKitProxy(kit);
                            if (success) {
                                Promise.all = origPromiseAll;
                                if (debug) console.log('[Debug]: Kit ready', created, app);
                            }
                            resolve([created, app, ...args]);
                        });
                    });
                }
                return await result;
            };
        }

        window.googletag = {cmd: [], _loaded_: true};

        const blockedClasses = [
            "adsbygoogle",
            "adsense-wrapper",
            "inline-ad",
            "gpt-billboard-container"
        ];

        const blockedIds = [
            "billboard-1",
            "billboard-2",
            "billboard-3",
            "sidebar-ad-1",
            "skyscraper-ad-1"
        ];

        setupInterception();

        const ob = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1) {
                        blockedClasses.forEach((cls) => {
                            if (node.classList?.contains(cls)) {
                                node.remove();
                                if (debug) console.log('[Debug]: Removed ad by class:', cls, node);
                            }
                            node.querySelectorAll?.(`.${cls}`).forEach((el) => {
                                el.remove();
                                if (debug) console.log('[Debug]: Removed nested ad by class:', cls, el);
                            });
                        });
                        
                        blockedIds.forEach((id) => {
                            if (node.id === id) {
                                node.remove();
                                if (debug) console.log('[Debug]: Removed ad by id:', id, node);
                            }
                            node.querySelectorAll?.(`#${id}`).forEach((el) => {
                                el.remove();
                                if (debug) console.log('[Debug]: Removed nested ad by id:', id, el);
                            });
                        });
                        
                        if (node.matches('.button.large.accessBtn.pos-relative') && node.textContent.includes('Go To Destination')) {
                            if (debug) console.log('[Debug] GTD button detected');
                            
                            if (!bypassTriggered) {
                                if (debug) console.log('[Debug] GTD: Waiting for linkInfo...');
                                
                                let gtdRetryCount = 0;
                                
                                function checkAndTriggerGTD() {
                                    const ctrl = sessionControllerA;
                                    const dest = resolveName(ctrl, map.onLD);
                                    
                                    if (ctrl && linkInfoA && dest.fn) {
                                        triggerBypass('gtd');
                                        if (debug) console.log('[Debug] Captcha bypassed via GTD after', gtdRetryCount, 'seconds');
                                    } else {
                                        gtdRetryCount++;
                                        if (debug) console.log(`[Debug] GTD retry ${gtdRetryCount}s: Still waiting for linkInfo...`);
                                        if (panel) panel.show('pleaseReload', 'info');
                                        setTimeout(checkAndTriggerGTD, 1000);
                                    }
                                }
                                
                                checkAndTriggerGTD();
                                
                            } else {
                                if (debug) console.log('[Debug] GTD ignored: bypass already triggered via TR');
                            }
                        }
                    }
                }
            }
        });
        ob.observe(document.documentElement, { childList: true, subtree: true });
    }
})();


