// --- 1. 圖片放大功能 (保持優化) ---
const images = document.querySelectorAll('.image-container img');
const imgModal = document.createElement('div');
imgModal.id = 'image-modal';
document.body.appendChild(imgModal);

const imgCloseBtn = document.createElement('button');
imgCloseBtn.id = 'close-btn';
imgCloseBtn.innerHTML = '×';

images.forEach(image => {
    image.addEventListener('click', () => {
        const largeImage = document.createElement('img');
        largeImage.src = image.src;
        imgModal.innerHTML = '';
        imgModal.appendChild(largeImage);
        imgModal.appendChild(imgCloseBtn);
        imgModal.style.display = 'flex';
    });
});

imgCloseBtn.addEventListener('click', () => { imgModal.style.display = 'none'; });

// --- 2. 核心控制邏輯 ---
document.addEventListener('DOMContentLoaded', () => {
    const injuryGuideBtn = document.getElementById('injuryGuideBtn');
    const medSearchBtn = document.getElementById('medSearchBtn');
    const versionModal = document.getElementById('versionModal');
    const injuryModal = document.getElementById('injuryModal');

    // 獲取 HTML 中預設隱藏的生理素質區塊
    const vitalSignBtn = document.getElementById('vitalSignBtn');
    const vitalSigns = document.getElementById('vitalSigns');

    // 輔助函式：關閉所有彈窗
    const closeAllModals = () => {
        [versionModal, injuryModal, imgModal].forEach(m => {
            if (m) m.style.display = "none";
        });
    };

    // A. 點擊大眾傷勢 SOP
    if (injuryGuideBtn) {
        injuryGuideBtn.onclick = () => {
            closeAllModals();
            versionModal.style.display = "flex";
        };
    }

    // B. 點擊藥典查詢
    if (medSearchBtn) {
        medSearchBtn.onclick = () => {
            closeAllModals(); // 這是你原本的輔助函式

            // 【新增：強制隱藏 SOP 免責聲明容器】
            const sopDisclaimer = document.getElementById('sopDisclaimerContainer');
            if (sopDisclaimer) {
                sopDisclaimer.style.display = "none";
            }

            // 呼叫 medicine.js 中的全域函式
            if (window.openMedicineSystem) {
                window.openMedicineSystem();
            } else {
                console.error("藥典腳本未載入");
            }
        };
    }

    // C. 版本選擇邏輯 (SOP 專用)
    const selectVersion = (fileName) => {
        versionModal.style.display = "none";

        const injurySelect = document.getElementById('injurySelect');
        const vitalSignBtn = document.getElementById('vitalSignBtn');
        const vitalSigns = document.getElementById('vitalSigns');
        const details = document.getElementById('injuryDetails');
        const sopDisclaimer = document.getElementById('sopDisclaimerContainer'); // 抓取新容器

        // 1. 還原顯示狀態
        if (injurySelect) injurySelect.style.display = 'block';
        if (vitalSignBtn) vitalSignBtn.style.display = 'block';
        if (vitalSigns) vitalSigns.style.display = 'none';

        // 【核心改動】開啟 SOP 時，強制顯示獨立的免責聲明
        if (sopDisclaimer) sopDisclaimer.style.display = 'block';

        // 2. 重新綁定生理資訊按鈕 (保持你的邏輯)
        if (vitalSignBtn && vitalSigns) {
            vitalSignBtn.onclick = (e) => {
                e.preventDefault();
                const isHidden = (vitalSigns.style.display === 'none' || !vitalSigns.style.display);
                vitalSigns.style.display = isHidden ? 'block' : 'none';
            };
        }

        // 3. 重置細節容器 (只放歡迎介面)
        const welcomeHTML = `
    <div class="clinical-dashboard">
        <div class="status-header" style="background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); border-left-color: #95a5a6;">
            <span class="status-badge">System Ready</span>
            <h2><i class="fas fa-hospital-symbol"></i> 醫療輔助系統 (MAI)</h2>
        </div>
        <div class="panel text-center" style="padding: 30px 20px;">
            <div class="mb-3"><i class="fas fa-user-md" style="font-size: 3rem; color: #bdc3c7;"></i></div>
            <h4 class="text-secondary">等待指令中...</h4>
            <p class="text-muted">請由上方選單選擇傷勢類別。</p>
        </div>
    </div>`;

        if (details) {
            details.innerHTML = welcomeHTML;
        }

        // 4. 選單邏輯 (簡化，因為免責聲明已經在外面了)
        if (injurySelect) {
            injurySelect.onchange = null;
            injurySelect.addEventListener('change', function () {
                if (this.value === "" || this.selectedIndex === 0) {
                    details.innerHTML = welcomeHTML;
                    if (vitalSigns) vitalSigns.style.display = 'none';
                } else {
                    // 這裡不管 ER_do.js 怎麼覆蓋，外面的 sopDisclaimerContainer 都還在
                    details.innerHTML = `<div id="sopContent">系統載入中...</div>`;
                }
            });
        }

        // 5. 載入腳本
        changeScript(fileName);
        injuryModal.style.display = "flex";
    };

    const loadDoBtn = document.getElementById('loadDoBtn');
    const loadMeBtn = document.getElementById('loadMeBtn');
    if (loadDoBtn) loadDoBtn.onclick = () => selectVersion('ER_do.js');
    if (loadMeBtn) loadMeBtn.onclick = () => selectVersion('ER_me.js');

    // --- 在 D. 關閉按鈕邏輯中修改 ---

    document.getElementById('closeInjuryModal')?.addEventListener('click', () => {
        injuryModal.style.display = "none";

        // 【新增這行】將下拉選單重置回第一個選項 (請先從上方選擇傷勢項目...)
        const injurySelect = document.getElementById('injurySelect');
        if (injurySelect) {
            injurySelect.selectedIndex = 0; // 或者使用 injurySelect.value = "";
        }

        // 可選：順便把內容區也清空，避免下次打開先看到舊資料
        const details = document.getElementById('injuryDetails');
        if (details) details.innerHTML = "請先從上方選擇傷勢項目...";

        // 可選：關閉時順便隱藏生理數值區塊
        const vitalSigns = document.getElementById('vitalSigns');
        if (vitalSigns) vitalSigns.style.display = 'none';
    });

    // --- 在「點擊外部關閉」的邏輯中也要同步修改 ---

    window.onclick = (event) => {
        if (event.target == versionModal || event.target == injuryModal || event.target == imgModal) {
            event.target.style.display = "none";

            // 如果關閉的是 injuryModal，同樣重置選單
            if (event.target == injuryModal) {
                const injurySelect = document.getElementById('injurySelect');
                if (injurySelect) injurySelect.selectedIndex = 0;

                const details = document.getElementById('injuryDetails');
                if (details) details.innerHTML = "請先從上方選擇傷勢項目...";
            }
        }
    };
});

// --- 3. 動態載入 Script ---
function changeScript(fileName) {
    const oldScript = document.getElementById('main-er-script');
    if (oldScript) oldScript.remove();

    const newScript = document.createElement('script');
    newScript.id = 'main-er-script';
    newScript.src = './js/' + fileName + '?v=' + new Date().getTime();
    document.body.appendChild(newScript);
}
// 將函式掛載到 window，確保 HTML 的 onclick 絕對找得到
window.closeVersionMenu = function () {
    const vModal = document.getElementById('versionModal');
    if (vModal) {
        vModal.style.display = "none";
        // 恢復頁面捲動 (如果之前有鎖定的話)
        document.body.style.overflow = "auto";
        console.log("[System] 版本選擇已取消，返回後台。");
    }
};

// --- 額外保障：手動重新綁定 (預防 onclick 被意外蓋掉) ---
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeVersionModal');
    if (closeBtn) {
        closeBtn.onclick = window.closeVersionMenu;
    }
});