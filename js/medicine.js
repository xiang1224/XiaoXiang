(function () {
    // 1. 【關鍵修正】將資料庫定義在最外層，讓所有函式都能讀取
    const allData = {
        ana: [
            { enName: "Propofol", cnName: "普洛福", use: "誘導麻醉", dose: "2 mg/kg", type: "tag-iv", sideEffect: "呼吸抑制、血壓下降", contra: "對蛋過敏者" },
            { enName: "Midazolam", cnName: "導美睡", use: "鎮靜", dose: "2-5 mg", type: "tag-iv", sideEffect: "過度鎮靜", contra: "重症肌無力" },
            { enName: "Ketamine", cnName: "凱他敏", use: "鎮痛/誘導", dose: "1-2 mg/kg", type: "tag-iv", sideEffect: "幻覺、血壓上升", contra: "顱內壓高" },
            { enName: "Lidocaine", cnName: "利多卡因", use: "局麻/抗心律", dose: "1-2% 浸潤", type: "tag-im", sideEffect: "神經毒性", contra: "傳導阻滯" },
            { enName: "Etomidate", cnName: "伊妥咪酯", use: "插管誘導", dose: "0.3 mg/kg", type: "tag-iv", sideEffect: "肌抽躍", contra: "敗血性休克" },
            { enName: "Dexmedetomidine", cnName: "右美托咪啶", use: "ICU鎮靜", dose: "0.2-0.7 mcg/hr", type: "tag-iv", sideEffect: "心跳過緩", contra: "高度房室阻滯" }
        ],
        painless: [
            { enName: "Morphine", cnName: "嗎啡", use: "嚴重疼痛", dose: "2-5 mg", type: "tag-iv", sideEffect: "嘔吐、止癢", contra: "呼吸衰竭" },
            { enName: "Fentanyl", cnName: "芬太尼", use: "強效鎮痛", dose: "50-100 mcg", type: "tag-iv", sideEffect: "胸壁僵直", contra: "MAOI服用者" },
            { enName: "Keto", cnName: "克多羅多", use: "中度疼痛", dose: "30 mg", type: "tag-iv-im", sideEffect: "影響凝血", contra: "消化道出血" },
            { enName: "Tramadol", cnName: "特拉嗎竇", use: "中重度疼痛", dose: "50-100 mg", type: "tag-iv", sideEffect: "癲癇風險", contra: "嚴重肝腎受損" }
        ],
        pressor: [
            { enName: "Epinephrine", cnName: "腎上腺素", use: "CPR/過敏", dose: "1 mg", type: "tag-iv", sideEffect: "心悸", contra: "急救無禁忌" },
            { enName: "Atropine", cnName: "阿托平", use: "心跳過緩", dose: "0.5 mg", type: "tag-iv", sideEffect: "口乾", contra: "青光眼" },
            { enName: "Norepinephrine", cnName: "正腎上腺素", use: "休克升壓", dose: "0.05-0.5 mcg/min", type: "tag-iv", sideEffect: "末端缺血", contra: "低血容量" },
            { enName: "Amiodarone", cnName: "安律酮", use: "抗心律不整", dose: "300 mg", type: "tag-iv", sideEffect: "低血壓", contra: "心動過緩" }
        ],
        resp: [
            { enName: "Succinylcholine", cnName: "司可林", use: "快速肌鬆", dose: "1 mg/kg", type: "tag-iv", sideEffect: "高血鉀、震顫", contra: "燒傷 >24hr" },
            { enName: "Rocuronium", cnName: "洛庫羅寧", use: "維持肌鬆", dose: "0.6 mg/kg", type: "tag-iv", sideEffect: "恢復較慢", contra: "過敏" },
            { enName: "Bricanyl", cnName: "博得康", use: "支氣管擴張", dose: "0.5 mg", type: "tag-iv-im", sideEffect: "手抖、心悸", contra: "快速心律不整" }
        ],
        allergy: [
            { enName: "Diphenhydramine", cnName: "苯海拉明", use: "蕁麻疹", dose: "30 mg", type: "tag-iv", sideEffect: "嗜睡、口乾", contra: "鎮靜劑使用者" },
            { enName: "Chlorpheniramine", cnName: "敏感寧", use: "輕度過敏", dose: "5 mg", type: "tag-im", sideEffect: "嗜睡", contra: "新生兒" }
        ],
        gi: [
            { enName: "Buscopan", cnName: "補斯可胖", use: "腹痛痙攣", dose: "20 mg", type: "tag-iv-im", sideEffect: "視力模糊", contra: "前列腺肥大" },
            { enName: "Primperan", cnName: "普瑞博朗", use: "止吐/腸動", dose: "10 mg", type: "tag-iv-im", sideEffect: "EPS症狀", contra: "腸阻塞" },
            { enName: "Transamin", cnName: "斷血炎", use: "止血劑", dose: "500 mg", type: "tag-iv", sideEffect: "低血壓", contra: "血栓患者" }
        ],
        psych: [
            { enName: "Naloxone", cnName: "納洛酮", use: "鴉片解毒", dose: "0.4 mg", type: "tag-iv", sideEffect: "戒斷症狀", contra: "已知過敏" },
            { enName: "Valium", cnName: "安定", use: "癲癇/焦慮", dose: "5-10 mg", type: "tag-iv", sideEffect: "運動失調", contra: "呼吸抑制" },
            { enName: "Haloperidol", cnName: "好力道", use: "躁動/幻覺", dose: "5 mg", type: "tag-im", sideEffect: "肢體僵硬", contra: "巴金森氏" }
        ]
    };

    // --- 核心：藥典主邏輯 ---
    window.openMedicineSystem = function () {
        const injuryModal = document.getElementById('injuryModal');
        const injuryDetails = document.getElementById('injuryDetails');
        const sopDisclaimer = document.getElementById('sopDisclaimerContainer');
        const injurySelect = document.getElementById('injurySelect');
        const vitalSignBtn = document.getElementById('vitalSignBtn');

        if (sopDisclaimer) sopDisclaimer.style.display = 'none';
        if (!injuryModal || !injuryDetails) return;

        injuryModal.style.display = 'flex';
        if (injurySelect) injurySelect.style.display = 'none';
        if (vitalSignBtn) vitalSignBtn.style.display = 'none';

        const medicineDisclaimer = `
        <div class="med-disclaimer" style="margin-top: 25px; padding: 15px; background: #fff5f5; border-left: 4px solid #fc8181; border-radius: 4px;">
            <p style="color: #c53030; font-size: 0.8rem; margin: 0; line-height: 1.6;">
                <i class="fas fa-exclamation-triangle"></i> <strong>臨床模擬免責聲明：</strong><br>
                本藥典僅供 Roleplay (RP) 醫療演戲情境參考。內容包含虛構劑量與適應症，
                <strong>嚴禁轉用於現實醫療行為</strong>。現實用藥請務必諮詢執業醫師。
            </p>
        </div>`;

        const routeNote = `
        <div class="route-note" style="margin-top: 15px; padding: 10px; background: #f7fafc; border: 1px dashed #cbd5e0; border-radius: 6px;">
            <div style="font-size: 0.85rem; color: #4a5568; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                <span><strong><i class="fas fa-syringe"></i> 給藥途徑說明：</strong></span>
                <span><code style="color: #3182ce;">IV</code> 靜脈注射</span>
                <span><code style="color: #e53e3e;">IM</code> 肌肉注射</span>
                <span><code style="color: #805ad5;">PO</code> 口服</span>
                <span><code style="color: #38a169;">SC</code> 皮下注射</span>
                <span><code style="color: #d69e2e;">SCI</code> 結膜下注射</span>
                <span><code style="color: #e53e3e;">IN</code> 鼻內給藥</span>
            </div>
        </div>`;

        injuryDetails.innerHTML = `
            <div class="clinical-dashboard slide-in">
                <div class="status-header medicine" style="background: #1a202c; padding: 15px; color: white; border-radius: 8px; margin-bottom: 20px;">
                    <span style="background: rgba(255, 255, 255, 0.2); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">PHARMACY</span>
                    <h2 style="margin:5px 0 0 0;"><i class="fas fa-pills"></i> 臨床藥物查詢系統</h2>
                </div>
                <div class="panel">
                    <div class="search-container" style="margin-bottom: 15px; position: relative;">
                        <i class="fas fa-search" style="position: absolute; left: 12px; top: 12px; color: #a0aec0;"></i>
                        <input type="text" id="medSearchInput" placeholder="輸入藥名或用途搜尋..."
                            style="width: 100%; padding: 10px 10px 10px 35px; border-radius: 8px; border: 1px solid #e2e8f0;"
                            onkeyup="filterMedication()">
                    </div>
                    <div class="med-tabs-nav" id="medTabNav" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; background: #f8fafc; padding: 10px; border-radius: 12px;">
                        <button class="tab-btn active" onclick="switchMedTab('all')">全部藥物</button>
                        <button class="tab-btn" onclick="switchMedTab('ana')">麻醉/鎮靜</button>
                        <button class="tab-btn" onclick="switchMedTab('painless')">止痛/嗎啡</button>
                        <button class="tab-btn" onclick="switchMedTab('pressor')">升壓/急救</button>
                        <button class="tab-btn" onclick="switchMedTab('resp')">呼吸/插管</button>
                        <button class="tab-btn" onclick="switchMedTab('allergy')">抗組織胺</button>
                        <button class="tab-btn" onclick="switchMedTab('gi')">消化/止血</button>
                        <button class="tab-btn" onclick="switchMedTab('psych')">精神/解毒</button>
                    </div>
                    <div id="medTabContent"></div>
                    ${routeNote}
                </div>
                ${medicineDisclaimer}
            </div>`;
        window.switchMedTab('all');
    };

    window.switchMedTab = function (category) {
        const contentArea = document.getElementById('medTabContent');
        if (!contentArea) return;

        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        const targetBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn =>
            btn.getAttribute('onclick').includes(`'${category}'`)
        );
        if (targetBtn) targetBtn.classList.add('active');

        let data = (category === 'all') ? Object.values(allData).flat() : (allData[category] || []);
        contentArea.innerHTML = window.generateMedTable(data);
    };

    window.filterMedication = function () {
        const input = document.getElementById('medSearchInput');
        if (!input) return;
        const filter = input.value.toUpperCase();
        const contentArea = document.getElementById('medTabContent');

        const allItems = Object.values(allData).flat();
        const filteredData = allItems.filter(item =>
            item.enName.toUpperCase().includes(filter) ||
            item.cnName.toUpperCase().includes(filter) ||
            item.use.includes(filter)
        );

        if (filter === "") {
            const activeTab = document.querySelector('.tab-btn.active');
            const category = activeTab ? activeTab.getAttribute('onclick').match(/'([^']+)'/)[1] : 'all';
            switchMedTab(category);
            return;
        }

        contentArea.innerHTML = filteredData.length > 0 ? window.generateMedTable(filteredData) : `<div style="padding: 20px; text-align: center; color: #a0aec0;">找不到相關藥物...</div>`;
    };

    window.generateMedTable = function (data) {
        let html = `<table class="med-table"><thead><tr><th>藥名 (EN/CN)</th><th>用途</th><th>RP 劑量</th><th>途徑</th></tr></thead><tbody>`;
        data.forEach(item => {
            const tooltip = `副作用：${item.sideEffect}\n禁忌：${item.contra}`;
            html += `<tr>
                <td class="med-name-cell" title="${tooltip}">
                    <div class="en">${item.enName}</div>
                    <div class="cn">${item.cnName} <i class="fas fa-info-circle" style="font-size:0.7rem; color:#cbd5e0;"></i></div>
                </td>
                <td>${item.use}</td>
                <td><code class="dose-code">${item.dose}</code></td>
                <td><span class="${item.type}">${item.type.replace('tag-', '').toUpperCase()}</span></td>
            </tr>`;
        });
        return html + `</tbody></table>`;
    };

    const initMedBtn = () => {
        const btn = document.getElementById('medSearchBtn');
        if (btn) btn.onclick = window.openMedicineSystem;
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMedBtn);
    else initMedBtn();
})();

// --- [病例小助手合併區] ---

window.openCaseAssistant = function (e) {
    if (e) e.preventDefault();

    const details = document.getElementById('injuryDetails');
    const injuryModal = document.getElementById('injuryModal');
    const sopDisclaimer = document.getElementById('sopDisclaimerContainer');
    const injurySelect = document.getElementById('injurySelect');
    const vitalSignBtn = document.getElementById('vitalSignBtn');

    if (injurySelect) injurySelect.style.display = 'none';
    if (vitalSignBtn) vitalSignBtn.style.display = 'none';
    if (injuryModal) injuryModal.style.display = 'flex';
    if (sopDisclaimer) sopDisclaimer.style.display = 'none';

    const bodyParts = ["頭部", "頸部", "胸部", "腹部", "背部", "左手臂", "右手臂", "左腿部", "右腿部"];

    let partsHtml = bodyParts.map(part => `
        <div style="display: grid; griwwwwd-template-columns: 80px 1fr; gap: 10px; align-items: center; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid #f0f4f8;">
            <label style="font-size:1rem; font-weight:bold; color:#2d3748;">${part}</label>
            <select name="partInjury" data-part="${part}" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:1rem; background:#fff;">
                <option value="">-- 無 --</option>
                <option value="擦挫傷">擦挫傷</option>
                <option value="銳器劃傷">銳器劃傷</option>
                <option value="撕裂傷">撕裂傷</option>
                <option value="骨折">骨折</option>
                <option value="骨裂">骨裂</option>
                <option value="一度燒燙傷">一度燒燙傷</option>
                <option value="淺 II 度燒燙傷">淺 II 度燒燙傷</option>
                <option value="穿透槍傷(無傷及骨頭)">穿透槍傷</option>
            </select>
        </div>
    `).join('');

    details.innerHTML = `
        <div class="clinical-dashboard slide-in" style="width: 900px; max-width: 95vw; margin: auto;">
            <div class="status-header" style="background: #2d3748; padding: 15px; color: white; border-radius: 8px 8px 0 0; text-align:center;">
                <h2 style="margin:0; font-size: 1.2rem;"><i class="fas fa-notes-medical"></i> SOAP 智慧病例系統 (橫向寬螢幕版)</h2>
            </div>
            
            <div class="panel" style="padding: 20px; background: white; border: 1px solid #e2e8f0; color: #333; border-radius: 0 0 8px 8px;">
                
                <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px;">
                    
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="text-align: left;">
                            <label style="font-size:1rem; font-weight:bold; display:block; margin-bottom:5px;">S (傷患主訴)</label>
                            <input type="text" id="caseS" style="width:100%; padding:10px; border:1px solid #cbd5e0; border-radius:6px; font-size:1rem;" placeholder="例如：車禍撞到腳">
                        </div>

                        <div style="text-align: left;">
                            <label style="font-size:1rem; font-weight:bold; display:block; margin-bottom:5px;">受傷原因</label>
                            <select id="caseReason" style="width:100%; padding:10px; border:1px solid #cbd5e0; border-radius:6px; font-size:1rem;">
                                <option value="">-- 請選擇 --</option>
                                <option value="跌倒/擦撞">跌倒/擦撞</option>
                                <option value="車輛爆炸">車輛爆炸</option>
                                <option value="刀械/銳器割傷">刀械/銳器割傷</option>
                                <option value="槍擊">槍擊</option>
                                <option value="車內碰撞">車內碰撞</option>
                                <option value="車禍">車禍</option>
                            </select>
                        </div>

                        <div style="text-align: left; flex-grow: 1;">
                            <label style="font-size:1rem; font-weight:bold; display:block; margin-bottom:5px;">P (處置預覽)</label>
                            <div style="padding:15px; background:#f8fafc; border:1px dashed #cbd5e0; border-radius:6px; font-size:0.9rem; color:#718096; line-height:1.4;">
                                系統將根據右側傷勢自動疊加主、次要處置流程。
                            </div>
                        </div>
                    </div>

                    <div style="text-align: left; padding:15px; background:#f8fafc; border-radius:8px; border:1px solid #edf2f7;">
                        <label style="font-size:1rem; font-weight:bold; display:block; margin-bottom:10px;">A (部位傷勢詳細設定)</label>
                        <div style="background: white; padding: 10px; border-radius: 6px; border: 1px solid #cbd5e0; max-height: 320px; overflow-y: auto;">
                            ${partsHtml}
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                    <button type="button" onclick="window.generateCaseReport()" style="padding:12px; background:#2d3748; color:white; border:none; border-radius:6px; cursor:pointer; font-size:1rem; font-weight:bold;">生成病例報告</button>
                    <button type="button" onclick="window.closeCaseAssistant()" style="padding:12px; background:#e2e8f0; color:#2d3748; border:none; border-radius:6px; cursor:pointer; font-size:1rem; font-weight:bold;">取消並關閉</button>
                </div>
            </div>

            <div id="caseResultArea" style="display:none; margin-top:15px;">
                <div style="padding:20px; background:#fff; border: 2px solid #2d3748; border-radius: 8px; position: relative; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <pre id="caseOutput" style="white-space:pre-wrap; margin:0; font-family:monospace; font-size:1rem; color:#2d3748; line-height:1.6;"></pre>
                    <button type="button" onclick="window.copyCaseText()" style="position:absolute; right:15px; top:15px; padding:6px 12px; background:#2d3748; color:white; border:none; border-radius:4px; cursor:pointer; font-size:0.9rem;">複製文字</button>
                </div>
            </div>
        </div>`;
};
window.generateCaseReport = function () {
    const sInput = document.getElementById('caseS');
    const reasonSelect = document.getElementById('caseReason');
    const partSelects = document.querySelectorAll('select[name="partInjury"]');

    let injuryData = [];
    partSelects.forEach(sel => {
        if (sel.value !== "") {
            injuryData.push({ part: sel.getAttribute('data-part'), type: sel.value });
        }
    });

    if (!reasonSelect.value || injuryData.length === 0) {
        alert("⚠️ 資訊不足：請選擇受傷原因並至少設定一個受傷部位！");
        return;
    }

    // --- 處置資料庫 (依傷勢自動組合) ---
    const pLibrary = {
        "擦挫傷": ["以生理食鹽水沖洗", "使用優碘消毒", "塗抹抗生素藥膏", "無菌敷料覆蓋"],
        "銳器劃傷": ["生理食鹽水沖洗傷口", "優碘消毒", "局部麻醉", "進行傷口縫合術", "蓋上無菌敷料"],
        "撕裂傷": ["生理食鹽水沖洗傷口", "優碘消毒", "局部麻醉", "進行傷口縫合術", "蓋上無菌敷料"],
        "骨折": ["建立靜脈通路", "拍攝 X-Ray 評估", "進行骨折復位手術", "施以石膏固定"],
        "骨裂": ["拍攝 X-Ray 確認", "患處施以副木固定", "給予止痛藥物"],
        "一度燒燙傷": ["生理食鹽水沖洗降溫", "塗抹燒燙傷藥膏", "保持散熱"],
        "淺 II 度燒燙傷": ["生理食鹽水沖洗", "清理水泡與焦傷", "塗抹燒燙傷藥膏", "無菌包紮"],
        "穿透槍傷(無傷及骨頭)": ["以生理食鹽水沖洗", "使用優碘消毒", "局部麻醉", "擴大傷口並清理彈道通道", "移除異物及殘留金屬碎片", "使用生理食鹽水與抗生素溶液沖洗", "縫合患部", "塗抹抗生素藥膏", "無菌敷料覆蓋"],
        "輕度槍傷(僅擦傷表皮)": ["以生理食鹽水沖洗", "使用優碘消毒", "塗抹抗生素藥膏", "無菌敷料覆蓋", "冰敷"]  
    };

    // 1. 分類傷勢與組合 P 步驟
    let grouped = {};
    let pSteps = new Set(); // 使用 Set 自動去重

    injuryData.forEach(item => {
        // 分類 A
        if (!grouped[item.type]) grouped[item.type] = [];
        grouped[item.type].push(item.part);

        // 疊加 P
        if (pLibrary[item.type]) {
            pLibrary[item.type].forEach(step => pSteps.add(step));
        }
    });

    // 2. 生成 O 與 A
    let oTexts = [];
    let aTexts = [];
    for (let type in grouped) {
        const parts = grouped[type].join('、');
        aTexts.push(`${parts}${type}`);

        let desc = "";
        if (type === "擦挫傷") desc = `${parts}表皮紅腫滲血`;
        else if (type === "骨折") desc = `${parts}明顯畸形且活動受限`;
        else if (type === "骨裂") desc = `${parts}觸壓痛劇烈且腫脹`;
        else desc = `${parts}呈現${type}徵象`;
        oTexts.push(desc);
    }

    // 3. 格式化 P
    let actionText = "";
    pSteps.forEach(step => {
        if (step.startsWith("/me")) {
            actionText += "\n" + step;
        } else {
            const prefix = (actionText === "" || actionText.endsWith("\n")) ? "" : " → ";
            actionText += prefix + step;
        }
    });

    // 4. 輸出報告
    const report =
        `S：患者主訴${sInput.value || "患處疼痛。"}\n` +
        `O：檢查發現${oTexts.join("；")}。\n` +
        `A：${aTexts.join(" 合併 ")} (原因：${reasonSelect.value})\n` +
        `P：${actionText}\n(衛教：傷口保持乾燥，勿碰水，避免激烈運動。)`;

    const resultArea = document.getElementById('caseResultArea');
    const outputField = document.getElementById('caseOutput');
    if (resultArea && outputField) {
        outputField.innerText = report;
        resultArea.style.display = 'block';
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

// 補充：關閉函式
window.closeCaseAssistant = function () {
    document.getElementById('injuryModal').style.display = 'none';
    document.getElementById('injurySelect').style.display = 'block';
    document.getElementById('vitalSignBtn').style.display = 'block';
};
window.copyCaseText = function () {
    const outputField = document.getElementById('caseOutput');
    if (!outputField) return alert("找不到複製目標");

    const text = outputField.innerText;

    // 優先使用剪貼簿 API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
            alert("病例 SOAP 已成功複製！");
        }).catch(function (err) {
            console.error('無法複製: ', err);
            fallbackCopyText(text); // 失敗時改用傳統方法
        });
    } else {
        fallbackCopyText(text); // 瀏覽器不支援時使用傳統方法
    }
};
// 2. 自動綁定按鈕 (雙重保險)
const setupBtn = () => {
    const btn = document.getElementById('caseAssistantBtn');
    if (btn) btn.onclick = (e) => window.openCaseAssistant(e);
};
setupBtn();
// 如果按鈕是動態生成的，延遲再跑一次
setTimeout(setupBtn, 1000);