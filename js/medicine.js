/**
 * Medical System All-in-One Optimization
 * 整合：臨床藥典、SOAP病例助手、術語百科
 */

(function () {
    // --- 1. 資料庫定義 (Data Center) ---
    const MEDICAL_DATA = {
        drugs: {
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
        },
        pLibrary: {
            "擦挫傷": ["以生理食鹽水沖洗", "使用優碘消毒", "塗抹抗生素藥膏", "無菌敷料覆蓋", "冰敷"],
            "銳器劃傷": ["生理食鹽水沖洗傷口", "優碘消毒", "局部麻醉", "進行傷口縫合術", "蓋上無菌敷料"],
            "皮下瘀青": ["患處施以冰敷減輕腫脹"],
            "撕裂傷": ["生理食鹽水沖洗傷口", "優碘消毒", "局部麻醉", "進行傷口縫合術", "蓋上無菌敷料"],
            "扭傷": ["/me 觸診確認韌帶受損情形", "患部施以彈性繃帶加壓包紮", "冰敷處理", "衛教 RICE 原則"],
            "骨折": ["建立靜脈通路", "拍攝 X-Ray 評估", "進行骨折復位手術", "施以石膏固定"],
            "骨裂": ["拍攝 X-Ray 確認", "患處施以副木固定", "給予止痛藥物"],
            "一度燒燙傷": ["生理食鹽水沖洗降溫", "塗抹燒燙傷藥膏", "保持散熱"],
            "淺 II 度燒燙傷": ["生理食鹽水沖洗", "清理水泡與焦傷", "塗抹燒燙傷藥膏", "無菌包紮"],
            "防彈衣後鈍傷 (BABT)": ["評估胸壁挫傷程度與呼吸音","局部冰敷 (Cold Compress) 15-20 分鐘"],
            "穿透槍傷(無傷及骨頭)": ["以生理食鹽水沖洗", "使用優碘消毒", "局部麻醉", "擴大傷口並清理彈道通道", "移除異物及殘留金屬碎片", "使用生理食鹽水與抗生素溶液沖洗", "縫合患部", "塗抹抗生素藥膏", "無菌敷料覆蓋"],
            "輕度槍傷(僅擦傷表皮)": ["以生理食鹽水沖洗", "使用優碘消毒", "塗抹抗生素藥膏", "無菌敷料覆蓋", "冰敷"],
            "低血糖": ["測量血糖值進行確認", "給予葡萄糖濃縮液"],
            "嗆水": ["協助患者採取側臥位", "拍背協助排出水分", "給予高濃度氧氣治療", "持續監測血氧飽和度(SpO2)", "觀察有無吸入性肺炎徵兆"],
            "輕微觸電": ["移除患處飾品", "大量生理食鹽水沖洗降溫", "塗抹燒燙傷藥膏", "無菌敷料覆蓋"]
        },
        eLibrary: {
            "擦挫傷": "傷口保持乾燥，每日更換敷料，觀察有無紅腫熱痛等感染徵兆。",
            "銳器劃傷": "傷口切勿碰水，若縫合處有滲血或裂開請立即回診。",
            "撕裂傷": "傷口切勿碰水，觀察縫合處是否紅腫，若有高燒現象請立即回診。",
            "皮下瘀青": "24小時內持續冰敷以利消腫，之後可改熱敷促進血液吸收。",
            "扭傷": "遵循 RICE 原則，48小時內勿推拿，患部儘量抬高於心臟位置。",
            "骨折": "石膏不可弄濕，觀察末梢手指/腳趾是否有發紫或麻痺現象。",
            "骨裂": "患部需固定並減少負重，初期可適度冰敷減輕腫脹與疼痛。",
            "一度燒燙傷": "患部持續沖水降溫，塗抹藥膏後保持通風，切勿塗抹牙膏或凡士林。",
            "淺 II 度燒燙傷": "請勿自行刺破水泡以防感染，保持敷料清潔，若水泡過大請回診處理。",
            "防彈衣後鈍傷 (BABT)": "24小時內持續冰敷；若出現呼吸困難、劇烈腹痛或咳血，請立即急診。",
            "穿透槍傷(無傷及骨頭)": "傷口嚴禁碰水，按時服用抗生素，留意有無滲血或化膿情形。",
            "輕度槍傷(僅擦傷表皮)": "保持傷口乾燥，每日換藥一次，觀察是否有異常紅腫。",
            "低血糖": "隨身攜帶糖果，避免空腹運動，若反覆發作請至門診追蹤。",
            "嗆水": "觀察 24 小時內有無咳嗽加劇或發燒，預防遲發性吸入性肺炎。",
            "輕微觸電": "傷口若出現水泡請勿自行弄破以免感染；未來24小時若有心跳不規律或胸悶請務必就醫。"
        },
        wiki: {
            // --- 檢查與評估 (Check/Exam) ---
            "CBC/DC": { cat: "檢查", desc: "全血球計數與白血球分類。用於檢查貧血(Hb)、感染(WBC)或血小板(Plt)是否不足。" },
            "GCS": { cat: "檢查", desc: "昏迷指數 (3-15分)。3分代表深度昏迷，15分代表清醒。評估眼球、語言、運動反應。" },
            "CRT": { cat: "檢查", desc: "微血管充填時間。按壓指甲看回血，>2秒代表周邊循環灌流不足。" },
            "FAST": { cat: "檢查", desc: "中風快速評估。Face(歪斜)、Arm(無力)、Speech(含糊)、Time(搶救時間)。" },
            "EKG/ECG": { cat: "檢查", desc: "心電圖。用於偵測心律不整、心肌梗塞或心電活動異常。" },
            "SpO2": { cat: "檢查", desc: "血氧飽和度。正常範圍為 95-100%，低於 90% 通常需立即給氧。" },
            "BS": { cat: "檢查", desc: "血糖值 (Blood Sugar)。評估是否有高血糖危象或低血糖昏迷。" },

            // --- 急救與生命監測 (Emergency) ---
            "ROSC": { cat: "急救", desc: "自發性血液循環恢復。指心肺復甦 (CPR) 後成功恢復自主心跳。" },
            "OHCA": { cat: "急救", desc: "到院前心肺功能停止。指患者在進入醫院前已無呼吸心跳。" },
            "AED": { cat: "急救", desc: "自動體外心臟電擊去顫器。用於偵測並電擊去顫特定種類的心律不整。" },
            "IV/IO": { cat: "急救", desc: "靜脈注射 (IV) 或 骨內針 (IO)。急救時建立藥物與液體灌注的通道。" },

            // --- 臨床操作與處置 (Clinical) ---
            "NPO": { cat: "臨床", desc: "禁食。手術或檢查前，嚴禁由口攝取任何食物或水分（包括水）。" },
            "STAT": { cat: "臨床", desc: "立即執行。表示該醫囑具備最高優先權。" },
            "PRN": { cat: "臨床", desc: "必要時執行。例如：當疼痛時才給予藥物。" },
            "foley": { cat: "臨床", desc: "留置導尿管。用於監測尿量或因應排尿困難患者。" },
            "NG tube": { cat: "臨床", desc: "鼻胃管。用於餵食、灌藥或排空胃部減壓。" },

            // --- 病理與疾病 (Pathology) ---
            "Pneumothorax": { cat: "病理", desc: "氣胸。空氣進入胸膜腔導致肺部塌陷。張力性氣胸會導致氣管偏移與休克。" },
            "AMI": { cat: "病理", desc: "急性心肌梗塞。供應心肌血液的冠狀動脈突然阻塞，導致心肌缺血壞死。" },
            "CVA": { cat: "病理", desc: "腦血管意外 (俗稱中風)。分為出血性或缺血性中風。" },
            "Hypovolemic Shock": { cat: "病理", desc: "低血容性休克。因大出血或嚴重脫水導致有效血量不足造成的循環衰竭。" },
            "Anaphylaxis": { cat: "病理", desc: "過敏性休克。嚴重的過敏反應，會導致呼吸道水腫與血壓崩跌。" },

            // --- 侵入性監測 (Invasive Monitoring) ---
            "A-line": { cat: "監測", desc: "動脈導管 (Arterial Line)。將導管置入動脈（常為橈動脈），提供即時、連續的血壓監測，並方便抽取動脈血氧分析(ABG)。" },
            "CVP": { cat: "監測", desc: "中心靜脈壓 (Central Venous Pressure)。由中心靜脈導管測得，反映右心房壓力。正常值為 2-6 mmHg，可用於評估患者體液容量是否充足。" },
            "MAP": { cat: "監測", desc: "平均動脈壓。公式為 $(SBP + 2 \times DBP) / 3$。正常值應大於 65 mmHg，以維持器官（如腎臟、大腦）的基本灌流。" },
            "Swan-Ganz": { cat: "監測", desc: "肺動脈導管。侵入性極高，可測量肺動脈楔壓(PCWP)與心輸出量(CO)，精確評估心臟衰竭嚴重程度。" },

            // --- 管路與引流 (Tubes & Drainage) ---
            "CVC": { cat: "臨床", desc: "中心靜脈導管。置入頸內或鎖骨下大靜脈，用於給予高濃度藥物（如升壓藥）、全靜脈營養或大量輸液。" },
            "Chest Tube": { cat: "臨床", desc: "胸管。置入胸膜腔以排出積氣（氣胸）或積液（血胸、胸水），協助肺部重新擴張。" },
            "PICC": { cat: "臨床", desc: "周邊置入中心靜脈導管。從手臂外周靜脈進入，導管末端到達中心大靜脈，適用於需長期抗生素或化療的患者。" },
            "EVD": { cat: "監測", desc: "腦室外引流管。置入腦室以引流腦脊髓液並監測顱內壓(ICP)，常見於腦出血或水腦症患者。" },

            // --- 血液分析 (Lab Analysis) ---
            "ABG": { cat: "檢查", desc: "動脈血氧分析。測量血液中的 pH 值、氧分壓(PaO2)與二氧化碳分壓(PaCO2)，精確評估呼吸衰竭與酸鹼平衡。" },
            "Lactate": { cat: "檢查", desc: "乳酸濃度。組織灌流不足或缺氧的指標，數值升高（>2 mmol/L）通常提示敗血症或休克風險。" },

            // --- 手術名稱縮寫 (Surgical Abbreviations) ---
            "Appe": { cat: "手術", desc: "闌尾切除術 (Appendectomy)。常見於急性闌尾炎患者。" },
            "Chole": { cat: "手術", desc: "膽囊切除術 (Cholecystectomy)。常用於膽結石或膽囊炎，現多採腹腔鏡手術。" },
            "Explo-Lapa": { cat: "手術", desc: "剖腹探查術 (Exploratory Laparotomy)。當腹部外傷或原因不明急腹症時，直接開腹檢查。" },
            "Debridement": { cat: "手術", desc: "清創手術。移除傷口壞死組織、異物，以利肉芽組織生長。" },
            "ORIF": { cat: "手術", desc: "開放復位內固定術。骨折後切開皮膚，使用鋼板或螺絲固定骨骼。" },
            "I&D": { cat: "手術", desc: "切開引流 (Incision and Drainage)。用於治療膿瘍，將皮膚切開排出膿液。" },
            "Craniotomy": { cat: "手術", desc: "開顱手術。移除部分頭蓋骨以進行腦部手術（如清除血腫）。" },
            "CABG": { cat: "手術", desc: "冠狀動脈繞道手術 (Bypass)。取患者其他部位血管，繞過阻塞的冠狀動脈。" },
            "Thoracotomy": { cat: "手術", desc: "開胸手術。常見於肺葉切除或嚴重胸部外傷止血。" },

            // --- 呼吸與感染 (Respiratory & Infection) ---
            "Pneumonia": { cat: "病理", desc: "肺炎。肺部組織受感染導致發炎，症狀包括發燒、咳嗽、痰多及呼吸困難。聽診時常可聞及濕囉音 (Crackles)。" },
            "Aspiration": { cat: "病理", desc: "吸入性肺炎。因嘔吐物或食物誤入氣管進入肺部引起。常見於意識不清或長期臥床患者。" },

            // --- 骨科 (Orthopedics) ---
            "Fracture": { cat: "病理", desc: "骨折 (Fx)。骨骼完整性中斷。分為開放性（骨頭穿出皮膚）與閉鎖性骨折。需觀察周邊血液循環、感覺與運動功能 (CSM)。" },
            "Dislocation": { cat: "病理", desc: "脫臼。關節面失去正常的對合關係，常伴隨劇烈疼痛與畸形。" },

            // --- 心理與神經 (Psychological) ---
            "Panic Attack": { cat: "心理", desc: "恐慌發作。突然出現強烈的恐懼與生理不適感，包括心悸、出汗、手抖、呼吸急促及瀕死感。通常持續數分鐘至半小時。" },
            "Hyperventilation": { cat: "病理", desc: "過度換氣症候群。因焦慮或恐慌導致呼吸過快，排出過多二氧化碳引起血鈣降低，造成手腳麻木或呈「助產士手」抽搐。" },
            "PTSD": { cat: "心理", desc: "創傷後壓力症候群。在經歷重大創傷事件後，出現閃回 (Flashback)、惡夢、過度警覺或逃避行為。" },

            // --- 生命徵象與心律 (Vital Signs & Rhythm) ---
            "Asystole": {
                cat: "急救",
                desc: "心跳停止 (平直線)。心電圖顯示為一條直線，代表心臟無電氣活動。此時不可電擊 (Non-shockable)，應持續 CPR 並給予 Epinephrine。",
                rp: "/me 觀察監視器顯示 Asystole → 立即加壓胸口持續 CPR → 紀錄藥物給予時間 → 準備確認 Lead 是否脫落。"
            },
            "PEA": {
                cat: "急救",
                desc: "無脈性電氣活動。心電圖有波形但觸摸不到脈搏。需尋找背後原因（如：大量出血、氣胸、缺氧）。"
            },

            // --- 氣道管理 (Airway Management) ---
            "ENDO": {
                cat: "急救",
                desc: "氣管內插管 (Endotracheal Intubation)。經口或鼻將導管置入氣管，由呼吸機輔助呼吸。是維持氣道開放的「金標準」。",
                rp: "/me 協助醫師使用喉鏡暴露聲門 → 置入管路並吹起氣囊 (Cuff) → 使用 BVM 通氣並聽診雙肺音確認位置。"
            },
            "BVM": {
                cat: "臨床",
                desc: "甦醒球 (Ambu Bag)。手動擠壓以提供正壓通氣。在插管前或急救中維持患者血氧的主要工具。"
            },
            "LMA": {
                cat: "急救",
                desc: "喉罩氣道。當插管困難 (Difficult Airway) 時的替代方案，操作較簡單，不需使用喉鏡。"
            },

            // --- 醫療處置與藥理 (Medical Treatment & Pharmacology) ---
            "Anti-": {
                cat: "臨床",
                desc: "抗生素 (Antibiotics) 之簡稱。用於預防或治療細菌性感染。臨床給藥前必須確認病人有無藥物過敏史（Allergy History），必要時須執行皮膚過敏試驗（Skin Test）。",
            },
            "PCA": {
                cat: "臨床",
                desc: "病人自控式止痛 (Patient-Controlled Analgesia)。一種經由靜脈注射的止痛給藥裝置，預先設定好安全劑量與鎖定時間（Lockout interval），由患者根據疼痛程度自行按壓給藥，可維持穩定的血中藥物濃度並減少爆發性疼痛。",
            },
            "Allergy": {
                cat: "臨床",
                desc: "過敏反應。機體對藥物或外來物質產生的免疫異常反應。嚴重者可能導致喉頭水腫、支氣管痙攣及過敏性休克，需立即給予 Epinephrine 與類固醇治療。",
            }
            
        }
    };

    // --- 2. 核心 UI 管理 (UI Controller) ---
    const UI = {
        // 增加一個參數 isSOP，預設為 false
        initModal: function (isSOP = false) {
            const modal = document.getElementById('injuryModal');
            const details = document.getElementById('injuryDetails');
            const disclaimer = document.getElementById('sopDisclaimerContainer');
            const select = document.getElementById('injurySelect');
            const vsBtn = document.getElementById('vitalSignBtn');

            if (modal) modal.style.display = 'flex';

            // 只有在「非 SOP 模式」（即開啟藥典、病例、百科）時，才隱藏 SOP 介面
            if (!isSOP) {
                if (disclaimer) disclaimer.style.display = 'none';
                if (select) select.style.display = 'none';
                if (vsBtn) vsBtn.style.display = 'none';
            } else {
                // 如果是 SOP 模式（點擊生理參數），確保選單跟按鈕都在
                if (disclaimer) disclaimer.style.display = 'block';
                if (select) select.style.display = 'block';
                if (vsBtn) vsBtn.style.display = 'block';
            }

            return details;
        },
        closeModal: function () {
            document.getElementById('injuryModal').style.display = 'none';
            // 關閉 Modal 時，恢復 SOP 的基本介面顯示
            if (document.getElementById('injurySelect')) document.getElementById('injurySelect').style.display = 'block';
            if (document.getElementById('vitalSignBtn')) document.getElementById('vitalSignBtn').style.display = 'block';
            if (document.getElementById('sopDisclaimerContainer')) document.getElementById('sopDisclaimerContainer').style.display = 'block';
        }
    };

    // --- 3. 藥物查詢系統 ---
    window.openMedicineSystem = function () {
        const details = UI.initModal();
        details.innerHTML = `
            <div class="clinical-dashboard slide-in">
                <div class="status-header medicine" style="background: #1a202c; padding: 15px; color: white; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="margin:0;"><i class="fas fa-pills"></i> 臨床藥物查詢系統</h2>
                </div>
                <div class="panel">
                    <input type="text" id="medSearchInput" placeholder="輸入藥名或用途搜尋..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom:15px;" onkeyup="window.filterMedication()">
                    <div id="medTabNav" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
                        <button class="tab-btn active" onclick="window.switchMedTab('all')">全部</button>
                        <button class="tab-btn" onclick="window.switchMedTab('ana')">麻醉</button>
                        <button class="tab-btn" onclick="window.switchMedTab('painless')">止痛</button>
                        <button class="tab-btn" onclick="window.switchMedTab('pressor')">升壓</button>
                        <button class="tab-btn" onclick="window.switchMedTab('gi')">止血/消化</button>
                    </div>
                    <div id="medTabContent"></div>
                </div>
                <button onclick="window.closeAll()" style="width:100%; margin-top:15px; padding:10px; background:#e2e8f0; border:none; border-radius:6px; cursor:pointer;">關閉</button>
            </div>`;
        window.switchMedTab('all');
    };

    window.switchMedTab = function (cat) {
        // 1. 處理按鈕 Active 樣式切換
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            // 這裡判斷 onclick 的參數是否包含當前 cat
            if (btn.getAttribute('onclick').includes(`'${cat}'`)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. 清空搜尋框 (切換 Tab 時通常希望重置搜尋)
        document.getElementById('medSearchInput').value = "";

        // 3. 渲染資料
        const content = document.getElementById('medTabContent');
        const data = (cat === 'all') ? Object.values(MEDICAL_DATA.drugs).flat() : (MEDICAL_DATA.drugs[cat] || []);
        content.innerHTML = window.generateMedTable(data);
    };

    window.filterMedication = function () {
        const searchTerm = document.getElementById('medSearchInput').value.toLowerCase();
        const content = document.getElementById('medTabContent');

        // 1. 取得所有藥物
        const allDrugs = Object.values(MEDICAL_DATA.drugs).flat();

        // 2. 執行過濾 (修正欄位名稱：enName, cnName, use, sideEffect)
        const filteredData = allDrugs.filter(drug => {
            return (
                (drug.enName && drug.enName.toLowerCase().includes(searchTerm)) ||
                (drug.cnName && drug.cnName.toLowerCase().includes(searchTerm)) ||
                (drug.use && drug.use.toLowerCase().includes(searchTerm)) ||
                (drug.sideEffect && drug.sideEffect.toLowerCase().includes(searchTerm))
            );
        });

        // 3. 處理標籤樣式
        if (searchTerm !== "") {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        }

        // 4. 渲染結果
        if (filteredData.length > 0) {
            content.innerHTML = window.generateMedTable(filteredData);
        } else {
            content.innerHTML = `
            <div style="padding:40px; text-align:center; color:#a0aec0;">
                <i class="fas fa-search" style="font-size:2rem; display:block; margin-bottom:10px;"></i>
                找不到與「${searchTerm}」相關的藥物資料
            </div>`;
        }
    };
    
    window.generateMedTable = function (data) {
        let html = `<table class="med-table"><thead><tr><th>藥名</th><th>用途</th><th>劑量</th><th>途徑</th></tr></thead><tbody>`;
        data.forEach(item => {
            html += `<tr>
                <td title="副作用：${item.sideEffect}"><b>${item.enName}</b><br><small>${item.cnName}</small></td>
                <td>${item.use}</td>
                <td><code class="dose-code">${item.dose}</code></td>
                <td><span class="${item.type}">${item.type.replace('tag-', '').toUpperCase()}</span></td>
            </tr>`;
        });
        return html + `</tbody></table>`;
    };

    // --- 4. SOAP 病例助手 ---
    window.openCaseAssistant = function () {
        const details = UI.initModal(); // 假設 UI.initModal 會回傳 Modal 的內容容器
        const parts = ["全身", "頭部", "頸部", "胸部", "腹部", "背部", "左手臂", "右手臂", "左腿部", "右腿部"];

        const partOptions = `
        <option value="">-- 無 --</option>
        ${Object.keys(MEDICAL_DATA.pLibrary).map(k => `<option value="${k}">${k}</option>`).join('')}
    `;

        // 預先生成右側部位清單
        let partsHtml = parts.map(part => `
        <div class="asst-part-row">
            <label class="asst-label-sm">${part}</label>
            <select name="partInjury" data-part="${part}" class="asst-input-sm">
                ${partOptions}
            </select>
        </div>
    `).join('');

        details.innerHTML = `
    <div class="asst-container slide-in">
        <div class="asst-header">
            <h2><i class="fas fa-file-medical-alt"></i> SOAP 智慧病例診斷系統</h2>
        </div>

        <div class="asst-main-body">
            <div class="asst-grid">
                
                <div class="asst-col-left">
    <div class="asst-group">
        <label class="asst-label">
            <i class="fas fa-comment-medical"></i> S (傷患主訴)
        </label>
        <div class="asst-input-wrapper">
            <input type="text" id="caseS" class="asst-input" placeholder="例如：胸口中彈、意識不清">
            <span class="asst-input-focus-line"></span>
        </div>
    </div>

        <div class="asst-group">
            <label class="asst-label">
                <i class="fas fa-house-damage"></i> 受傷原因 / 環境
            </label>
            <div class="asst-input-wrapper">
                <select id="caseReason" class="asst-input">
                    <option value="">-- 請選擇受傷環境 --</option>
                    <optgroup label="外傷類">
                        <option value="跌倒/擦撞">跌倒/擦撞</option>
                        <option value="拳頭/鈍器毆打">拳頭/鈍器毆打</option>
                        <option value="刀械/銳器割傷">刀械/銳器割傷</option>
                        <option value="槍擊">槍擊</option>
                    </optgroup>
                    <optgroup label="事故類">
                        <option value="車輛爆炸">車輛爆炸</option>
                        <option value="車內碰撞">車內碰撞</option>
                        <option value="車禍">車禍</option>
                    </optgroup>
                    <optgroup label="其他">
                        <option value="低血糖">低血糖</option>
                        <option value="扭傷">扭傷</option>
                        <option value="嗆水">嗆水 (呼吸道)</option>
                        <option value="動物咬傷">動物咬傷</option>
                        <option value="輕微觸電">輕微觸電</option>
                    </optgroup>
                </select>
            </div>
        </div>

        <div class="asst-vaccine-box">
            <label class="asst-label">
                <i class="fas fa-syringe"></i> 額外處置 / 疫苗項目
            </label>
            <div class="asst-check-group">
                <label class="asst-pill-checkbox">
                    <input type="checkbox" name="extraTreat" value="施打破傷風疫苗 (Tetanus)">
                    <span class="asst-pill-content">
                        <i class="fas fa-shield-virus"></i> 破傷風
                    </span>
                </label>
                <label class="asst-pill-checkbox">
                    <input type="checkbox" name="extraTreat" value="施打狂犬病疫苗 (Rabies)">
                    <span class="asst-pill-content">
                        <i class="fas fa-dog"></i> 狂犬病
                    </span>
                </label>
            </div>
        </div>
    </div>

                <div class="asst-col-right">
                    <label class="asst-label"><i class="fas fa-child"></i> A (傷勢細節設定)</label>
                    <div id="asstScrollArea">
                        ${partsHtml}
                    </div>
                </div>
            </div>

            <div class="asst-actions">
                <button onclick="window.generateCaseReport()" class="asst-btn-primary">
                    <i class="fas fa-magic"></i> 生成醫療報告
                </button>
                <button onclick="window.toggleDarkMode()" id="asstThemeBtn" class="asst-btn-theme">
                    <i class="fas fa-moon"></i>
                </button>
                <button onclick="window.resetCaseAssistant()" class="asst-btn-reset">
                    <i class="fas fa-undo"></i> 重設
                </button>
                <button onclick="window.closeAll()" class="asst-btn-cancel">取消</button>
            </div>

            <div id="caseResultArea" style="display: none; margin-top: 30px;">
                <div class="asst-result-card slide-in">
                    <div class="asst-result-header">
                        <span class="asst-status-tag"><i class="fas fa-check-circle"></i> 診斷完成</span>
                        <button onclick="window.copyCaseText()" class="asst-btn-copy">
                            <i class="fas fa-copy"></i> 複製報告
                        </button>
                    </div>
                    <div class="asst-result-body">
                        <pre id="caseOutput"></pre>
                    </div>
                    <div class="asst-result-footer">
                        <small>* 此報告僅供 Roleplay 醫療用途使用</small>
                    </div>
                </div>
            </div>
        </div>
    </div>

<style>
    /* 1. 基礎容器與變數定義 */
    .asst-container {
        /* 淺色模式變數 */
        --asst-bg: #f7fafc;
        --asst-card: #ffffff;
        --asst-text: #2d3748;
        --asst-label: #4a5568;
        --asst-border: #e2e8f0;
        --asst-accent: #3182ce;
        --asst-header-bg: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        --asst-scroll-thumb: #cbd5e0;
        
        /* 按鈕變數 */
        --asst-btn-primary: #3182ce;
        --asst-btn-reset: #ecc94b;
        --asst-btn-reset-text: #744210;
        --asst-btn-cancel: #a0aec0;
        --asst-btn-theme-bg: #4a5568;

        width: 880px; 
        max-width: 95vw; 
        margin: auto;
        font-family: 'PingFang TC', 'Microsoft JhengHei', sans-serif !important;
        color: var(--asst-text);
        text-align: left !important; /* 修正字體置中 */
    }

    /* 2. 深色模式變數覆蓋 */
    .asst-container.dark-mode {
        --asst-bg: #1a202c;
        --asst-card: #2d3748;
        --asst-text: #edf2f7;
        --asst-label: #cbd5e0;
        --asst-border: #4a5568;
        --asst-accent: #63b3ed;
        --asst-header-bg: linear-gradient(135deg, #111827 0%, #000000 100%);
        --asst-scroll-thumb: #718096;
        
        /* 深色模式按鈕微調 */
        --asst-btn-primary: #63b3ed;
        --asst-btn-reset: #f6e05e;
        --asst-btn-reset-text: #4a2b00;
        --asst-btn-cancel: #4a5568;
        --asst-btn-theme-bg: #cbd5e0;
    }

/* 修改這部分，確保兩種模式的結構一致 */
        .modal-content {
            padding: 20 !important; /* 強制移除預設內距 */
            overflow: hidden !important;
            overflow-y: auto !important;
            border-radius: 12px !important;
            transition: background-color 0.3s ease, border 0.3s ease; /* 增加過渡讓變色更平滑 */
        }

        .modal-content.dark-mode {
            background-color: #1a202c !important; /* 使用實色，不要用 rgba */
            background: #1a202c !important;      /* 雙重保險 */
            opacity: 1 !important;               /* 確保透明度是 100% */
        }

    /* 4. 組件樣式 */
    .asst-header {
        background: var(--asst-header-bg) !important;
        padding: 20px !important;
        color: white !important;
        text-align: center !important;
        border-radius: 12px 12px 0 0 !important;
        transition: 0.3s;
    }
    .asst-header h2 { margin: 0 !important; font-size: 1.5rem !important; color: white !important; }

    .asst-main-body {
            background-color: var(--asst-bg) !important;
            padding: 25px !important;
            border-radius: 0 0 12px 12px !important;
            min-height: 550px; /* 設定一個最小高度，防止內容增減時版型跳動 */
            box-sizing: border-box !important;
        }

    .asst-grid {
        display: grid !important;
        grid-template-columns: 1fr 1.1fr !important;
        gap: 25px !important;
        box-sizing: border-box !important;
    }

    /* 5. 表單元素 */
    .asst-label { display: block !important; font-weight: 700 !important; margin-bottom: 8px !important; color: var(--asst-text) !important; }
    .asst-input {
        width: 100% !important; padding: 12px !important; border: 2px solid var(--asst-border) !important;
        border-radius: 8px !important; background: var(--asst-card) !important; color: var(--asst-text) !important;
        box-sizing: border-box !important; outline: none; transition: 0.2s;
    }
    .asst-input:focus { border-color: var(--asst-accent) !important; }

    /* 6. 右側部位選擇區 */
    .asst-col-right {
        background: var(--asst-card) !important; padding: 15px !important;
        border-radius: 12px !important; border: 1px solid var(--asst-border) !important;
    }
    .asst-part-row {
        display: grid !important; grid-template-columns: 75px 1fr !important; gap: 12px !important;
        align-items: center !important; margin-bottom: 10px !important; padding: 10px !important;
        background: var(--asst-bg) !important; border-radius: 8px !important; border: 2px solid var(--asst-border) !important;
    }
    .asst-label-sm { font-weight: 700 !important; color: var(--asst-label) !important; }
    .asst-input-sm {
        width: 100% !important; padding: 8px !important; border: 1px solid var(--asst-border) !important;
        border-radius: 6px !important; background: var(--asst-card) !important; color: var(--asst-text) !important;
    }

    /* 7. 滾動條樣式 */
    #asstScrollArea {
        max-height: 310px !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        padding-right: 8px !important;
    }
    #asstScrollArea::-webkit-scrollbar { width: 6px !important; }
    #asstScrollArea::-webkit-scrollbar-track { background: transparent !important; }
    #asstScrollArea::-webkit-scrollbar-thumb {
        background: var(--asst-scroll-thumb) !important;
        border-radius: 10px !important;
    }

    /* 8. 按鈕與動作區 */
    .asst-actions { display: flex !important; gap: 15px !important; margin-top: 25px !important; }
    
    .asst-btn-primary { flex: 2; padding: 14px; background: var(--asst-btn-primary) !important; color: white !important; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .asst-btn-theme { flex: 0.5; background: var(--asst-btn-theme-bg) !important; color: var(--asst-bg) !important; border: none; border-radius: 8px; cursor: pointer; transition: 0.3s; }
    .asst-btn-reset { flex: 1; padding: 14px; background: var(--asst-btn-reset) !important; color: var(--asst-btn-reset-text) !important; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .asst-btn-cancel { flex: 1; padding: 14px; background: var(--asst-btn-cancel) !important; color: white !important; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; }

    .asst-btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }

    /* 9. 結果顯示 */
    .asst-result-card {
        background: var(--asst-card) !important;
        border: 1px solid var(--asst-border) !important;
        border-left: 6px solid var(--asst-accent) !important; /* 左側藍條增加專業感 */
        border-radius: 12px !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
        overflow: hidden;
        position: relative;
        transition: all 0.3s ease;
    }

    .asst-container.dark-mode .asst-result-card {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4) !important;
        border-color: #4a5568 !important;
    }

    .asst-result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid var(--asst-border);
}

    .asst-container.dark-mode .asst-result-header {
        background: rgba(255, 255, 255, 0.05);
    }

    .asst-status-tag {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--asst-accent);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    /* 報告內容區 */
    .asst-result-body {
        padding: 20px;
    }

    #caseOutput {
        white-space: pre-wrap;
        font-size: 1rem;
        line-height: 1.7;
        color: var(--asst-text);
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important; /* 打字機字體 */
        margin: 0;
        padding: 10px;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 6px;
    }

    .asst-container.dark-mode #caseOutput {
        background: rgba(0, 0, 0, 0.2);
    }

    /* 複製按鈕美化 */
    .asst-btn-copy {
        background: var(--asst-accent) !important;
        color: white !important;
        border: none;
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        transition: 0.2s;
    }

    .asst-btn-copy:hover {
        transform: scale(1.05);
        filter: brightness(1.1);
    }

    .asst-result-footer {
        padding: 8px 20px;
        background: transparent;
        border-top: 1px solid var(--asst-border);
        text-align: right;
        color: var(--asst-label);
        font-size: 0.75rem;
        opacity: 0.7;
    }

    /* 左側容器間距 */
    .asst-col-left {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    /* 輸入框包裝器 */
    .asst-input-wrapper {
        position: relative;
        width: 100%;
    }

    /* 下拉選單群組美化 */
    optgroup {
        background: var(--asst-card);
        color: var(--asst-accent);
        font-weight: bold;
    }

    /* 膠囊按鈕美化 (Pill Checkbox) */
    .asst-check-group {
        display: flex;
        gap: 12px;
        margin-top: 10px;
    }

    .asst-pill-checkbox {
        cursor: pointer;
        flex: 1;
    }

    .asst-pill-checkbox input {
        display: none; /* 隱藏原本醜醜的勾選框 */
    }

    .asst-pill-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 15px;
        background: var(--asst-card);
        border: 2px solid var(--asst-border);
        border-radius: 50px; /* 圓角膠囊 */
        color: var(--asst-text);
        font-size: 0.9rem;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 膠囊選中狀態 */
    .asst-pill-checkbox input:checked + .asst-pill-content {
        background: var(--asst-accent);
        border-color: var(--asst-accent);
        color: white;
        box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
        transform: translateY(-2px);
    }

    /* 深色模式下的膠囊微調 */
    .asst-container.dark-mode .asst-pill-content {
        background: #2d3748;
    }

    /* 疫苗外框虛線優化 */
    .asst-vaccine-box {
        background: rgba(0, 0, 0, 0.02);
        padding: 18px;
        border-radius: 12px;
        border: 1px dashed var(--asst-border);
        transition: 0.3s;
    }

    .asst-container.dark-mode .asst-vaccine-box {
        background: rgba(255, 255, 255, 0.03);
    }

    /* 圖示間距 */
    .asst-label i {
        margin-right: 8px;
        color: var(--asst-accent);
        width: 18px;
        text-align: center;
    }

    #caseOutput { white-space: pre-wrap; font-size: 1.05rem; line-height: 1.6; color: var(--asst-text); font-family: monospace; margin: 0; }
    
    /* 動畫 */
    .slide-in { animation: asstFadeIn 0.4s ease; }
    @keyframes asstFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
    `;
    };

    // --- 深色模式切換邏輯 ---
    window.toggleDarkMode = function () {
        const container = document.querySelector('.asst-container');
        const themeBtn = document.getElementById('asstThemeBtn');
        if (!container) return;

        // 切換本體 (這會觸發 Header 和滾動條顏色的變數切換)
        container.classList.toggle('dark-mode');

        // 切換外框
        const modalContent = container.closest('.modal-content');
        if (modalContent) {
            modalContent.classList.toggle('dark-mode');
        }

        // 圖示切換
        const isDark = container.classList.contains('dark-mode');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
    // --- 輔助函式：取得臨床徵象 ---
    const getClinicalSign = (part, type) => {
        const mapping = {
            "擦挫傷": `${part}表皮紅腫滲血`,
            "骨折": `${part}明顯畸形且活動受限`,
            "骨裂": `${part}觸壓痛劇烈且腫脹`,
            "低血糖": `意識模糊、冒冷汗且手腳發抖`,
            "扭傷": `${part}關節腫脹、活動時劇痛且皮下瘀血`,
            "嗆水": `劇烈咳嗽、呼吸急促且肺部有囉音`,
            "銳器劃傷": `${part}傷口邊緣整齊並持續滲血`,
            "撕裂傷": `${part}傷口不規則裂開且有深層組織外露`,
            "槍擊 (防彈衣)": `${part}受擊處呈現圓形挫傷、明顯瘀血及深層壓痛`,
            "皮下瘀青": `${part}呈現圓形大面積瘀血，觸診局部壓痛明顯`,
            "輕微觸電": `${part}可見一至二度類灼傷紅斑，局部伴隨麻木與刺痛感`
        };
        return mapping[type] || `${part}呈現${type}徵象`;
    };

    // --- 生成報告邏輯 ---
    window.generateCaseReport = function () {
        const sVal = document.getElementById('caseS').value || "患處疼痛";
        const reason = document.getElementById('caseReason').value;

        const rawInjuries = Array.from(document.querySelectorAll('select[name="partInjury"]'))
            .filter(s => s.value !== "")
            .map(s => ({ part: s.getAttribute('data-part'), type: s.value }));

        if (rawInjuries.length === 0) return alert("請至少選一個受傷部位！");

        const extraTreats = Array.from(document.querySelectorAll('input[name="extraTreat"]:checked'))
            .map(cb => cb.value);

        const grouped = {};
        rawInjuries.forEach(inj => {
            if (!grouped[inj.type]) grouped[inj.type] = [];
            grouped[inj.type].push(inj.part);
        });

        let aTexts = [];
        let oTexts = [];
        let pSteps = new Set();
        let eduSet = new Set();

        for (let type in grouped) {
            const parts = grouped[type].join('、');
            aTexts.push(`${parts}${type}`);
            oTexts.push(getClinicalSign(parts, type));

            if (MEDICAL_DATA.pLibrary[type]) {
                MEDICAL_DATA.pLibrary[type].forEach(step => pSteps.add(step));
            }
            if (MEDICAL_DATA.eLibrary[type]) {
                eduSet.add(`【${parts}${type}】${MEDICAL_DATA.eLibrary[type]}`);
            }
        }

        extraTreats.forEach(treat => pSteps.add(treat));
        if (reason === "槍擊 (防彈衣)") eduSet.add(MEDICAL_DATA.eLibrary["防彈衣後鈍傷 (BABT)"]);
        if (extraTreats.some(t => t.includes("疫苗"))) eduSet.add("請留意疫苗接種處有無紅腫熱痛，如有過敏反應請立即回診。");

        let finalEdu = eduSet.size > 0 ? Array.from(eduSet).join("；") : "請遵照醫囑休息，如有不適隨時回診。";
        const actionText = Array.from(pSteps).join(" → ");
        const reasonText = reason ? ` (原因：${reason})` : "";

        const report = `S：主訴${sVal}
O：檢查發現${oTexts.join("；")}
A：${aTexts.join(" 合併 ")}${reasonText}
P：${actionText}
(衛教：${finalEdu})`;

        document.getElementById('caseOutput').innerText = report;
        document.getElementById('caseResultArea').style.display = 'block';
    };

    // --- 重設功能 ---
    window.resetCaseAssistant = function () {
        document.getElementById('caseS').value = "";
        document.getElementById('caseReason').selectedIndex = 0;
        document.querySelectorAll('select[name="partInjury"]').forEach(s => s.selectedIndex = 0);
        document.querySelectorAll('input[name="extraTreat"]').forEach(cb => cb.checked = false);
        document.getElementById('caseResultArea').style.display = 'none';
        document.getElementById('caseOutput').innerText = "";
    };

    // --- 5. 術語百科 ---
    window.openTermWiki = function () {
        const details = UI.initModal();
        // 取得所有分類 (不重複)
        const categories = [...new Set(Object.values(MEDICAL_DATA.wiki).map(item => item.cat))];

        details.innerHTML = `
        <div class="wiki-dashboard slide-in" style="width: 900px; max-width: 95vw; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.3); display: flex; flex-direction: column; height: 600px;">
            <div style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); padding: 18px 25px; color: white; display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; font-size: 1.4rem; letter-spacing: 1px;"><i class="fas fa-book-medical"></i> 臨床術語百科 <small style="font-size:0.8rem; opacity:0.8;">Medical Wiki</small></h3>
                <button onclick="window.closeAll()" style="background:rgba(255,255,255,0.2); border:none; color:white; width:35px; height:35px; border-radius:50%; cursor:pointer; transition:0.3s;">&times;</button>
            </div>

            <div style="display: flex; flex: 1; overflow: hidden;">
                <div style="width: 180px; background: #f8f9fa; border-right: 1px solid #e9ecef; display: flex; flex-direction: column; padding: 15px 0;">
                    <button class="wiki-cat-btn active" onclick="window.filterWikiByCat('all', this)" style="padding: 12px 20px; text-align: left; border: none; background: none; cursor: pointer; font-weight: bold; color: #17a2b8;">全部術語</button>
                    ${categories.map(cat => `
                        <button class="wiki-cat-btn" onclick="window.filterWikiByCat('${cat}', this)" style="padding: 12px 20px; text-align: left; border: none; background: none; cursor: pointer; color: #495057;">${cat}</button>
                    `).join('')}
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; padding: 20px; background: white;">
                    <div style="position: relative; margin-bottom: 20px;">
                        <i class="fas fa-search" style="position: absolute; left: 12px; top: 12px; color: #adb5bd;"></i>
                        <input type="text" id="wikiSearch" placeholder="搜尋術語名稱或關鍵字..." style="width: 100%; padding: 10px 10px 10px 40px; border-radius: 8px; border: 1px solid #dee2e6; outline: none; transition: 0.3s;" oninput="window.searchWiki(this.value)">
                    </div>
                    
                    <div id="wikiListArea" style="flex: 1; overflow-y: auto; padding-right: 10px;">
                        </div>
                </div>
            </div>
        </div>
        <style>
            .wiki-cat-btn:hover { background: #eef2f3; color: #17a2b8; }
            .wiki-cat-btn.active { background: #e9f7f9; color: #17a2b8; border-right: 3px solid #17a2b8; }
            .wiki-card { margin-bottom: 12px; padding: 15px; border-radius: 8px; background: #fff; border: 1px solid #f1f3f5; border-left: 4px solid #17a2b8; transition: 0.2s; }
            .wiki-card:hover { transform: translateX(5px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: #17a2b8; }
            #wikiListArea::-webkit-scrollbar { width: 6px; }
            #wikiListArea::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
        </style>
    `;
        // 預設顯示全部
        window.renderWikiItems(MEDICAL_DATA.wiki);
    };

    // 1. 定義顏色對應表 (建議放在 render 函式外面或內部)
    const getCatColor = (cat) => {
        const colors = {
            "檢查": "#17a2b8",
            "急救": "#dc3545",
            "臨床": "#6c757d",
            "病理": "#fd7e14",
            "監測": "#6610f2",
            "手術": "#28a745",
            "心理": "#ffc107"
        };
        return colors[cat] || "#212529";
    };

    // 2. 整合顏色至渲染函式
    window.renderWikiItems = function (data) {
        const listArea = document.getElementById('wikiListArea');
        let html = '';

        for (const [key, val] of Object.entries(data)) {
            const themeColor = getCatColor(val.cat);

            html += `
            <div class="wiki-card" style="border-left: 5px solid ${themeColor};">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <strong style="font-size: 1.1rem; color: #212529;">${key}</strong>
                    <span style="font-size: 0.75rem; background: ${themeColor}1A; color: ${themeColor}; padding: 3px 10px; border-radius: 6px; font-weight: bold; border: 1px solid ${themeColor}33;">
                        ${val.cat}
                    </span>
                </div>
                <p style="margin: 10px 0 0; font-size: 0.95rem; color: #4a5568; line-height: 1.6;">
                    ${val.desc}
                </p>
            </div>
        `;
        }

        listArea.innerHTML = html || '<div style="text-align:center; color:#adb5bd; padding-top:50px; font-style: italic;">查無相關術語...</div>';
    };


    // 3. 搜尋與過濾邏輯 (保持不變，但確保呼叫的是新的 render)
    window.filterWikiByCat = function (cat, btn) {
        document.querySelectorAll('.wiki-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (cat === 'all') {
            window.renderWikiItems(MEDICAL_DATA.wiki);
        } else {
            const filtered = Object.fromEntries(
                Object.entries(MEDICAL_DATA.wiki).filter(([_, val]) => val.cat === cat)
            );
            window.renderWikiItems(filtered);
        }
    };

    window.searchWiki = function (keyword) {
        const kw = keyword.toUpperCase();
        const filtered = Object.fromEntries(
            Object.entries(MEDICAL_DATA.wiki).filter(([key, val]) =>
                key.toUpperCase().includes(kw) || val.desc.includes(kw) || val.cat.includes(kw)
            )
        );
        window.renderWikiItems(filtered);
    };

    // --- 6. 通用函式 ---
    window.closeAll = UI.closeModal;
    window.copyCaseText = function () {
        const text = document.getElementById('caseOutput').innerText;
        navigator.clipboard.writeText(text).then(() => alert("病例已複製！"));
    };

    // --- 7. 事件綁定 (Event Binding) ---
    const bindBtns = () => {
        const btns = {
            'medSearchBtn': window.openMedicineSystem,
            'caseAssistantBtn': window.openCaseAssistant,
            'termWikiBtn': window.openTermWiki
        };
        for (let id in btns) {
            const el = document.getElementById(id);
            if (el) el.onclick = btns[id];
        }
    };

    // 啟動
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindBtns);
    else bindBtns();
    setTimeout(bindBtns, 1000); // 針對動態生成的按鈕進行二次檢查
})();