// ER_me.js 內容範例
(function initERMeSystem() {
    const injurySelect = document.getElementById('injurySelect');
    const injuryDetails = document.getElementById('injuryDetails');

    // 1. 顯示選單與初始化
    if (injurySelect) injurySelect.style.display = 'block';

    injuryDetails.innerHTML = `
            <div class="clinical-dashboard">
                <div class="status-header" style="background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); border-left-color: #95a5a6;">
                    <span class="status-badge">System Ready</span>
                    <h2><i class="fas fa-hospital-symbol"></i> 醫療輔助系統 (MAI)</h2>
                </div>
                <div class="panel text-center" style="padding: 30px 20px;">
                    <div class="mb-3">
                        <i class="fas fa-user-md" style="font-size: 3rem; color: #bdc3c7;"></i>
                    </div>
                    <h4 class="text-secondary">等待指令中...</h4>
                    <p class="text-muted">請由上方選單選擇傷勢類別，以調閱對應的手術 SOP 與處置指引。</p>
                    <hr>
                    <div class="d-flex justify-content-around text-muted" style="font-size: 0.8rem;">
                        <span><i class="fas fa-check-circle"></i> 診斷協議已就緒</span>
                        <span><i class="fas fa-check-circle"></i> 藥典資料已加載</span>
                    </div>
                </div>
            </div>`;

    // 2. 下拉選單變換邏輯
    injurySelect.onchange = (e) => {
        const type = e.target.value;
        let content = "";

        switch (type) {
            case "bleeding":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header">
            <span class="status-badge">Standard Protocol</span>
            <h2>🔴 軟組織損傷與出血處置 (Soft Tissue Injury)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場穩定程序</h3>
                <ul>
                    <li>/me 使用 500ml 生理食鹽水由中心向外執行高壓噴射沖洗</li>
                    <li>/me 覆蓋濕潤無菌敷料，預防組織與紗布乾涸黏連</li>
                </ul>
            </div>
            <div class="panel in-hospital">
                <h3>🏥 院內傷口照護程序</h3>
                <div class="procedure-box">
                    <strong>1. 創面清創</strong>
                    <p>/me 以 生理食鹽水 進行二次潤濕與物理性異物移除</p>
                    <p>/me 以 Betadine (優碘) 由內向外執行環狀消毒 3 圈</p>
                    
                    <strong>2. 藥物預防與評估</strong>
                    <p>/me 於傷口基部均勻塗抹 Neomycin (新黴素軟膏)</p>
                    
                    <strong>3. 封閉式包紮</strong>
                    <p>/me 放置 Telfa 不沾黏敷料作為首層介面</p>
                    <p>/me 使用捲軸紗布執行 8 字型固定</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "fracture":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header trauma">
            <span class="status-badge">Orthopedic Emergency</span>
            <h2>🦴 骨折處置：閉鎖性與開放性手術程序</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場初步處置</h3>
                <ul>
                    <li>/me 使用無菌生理食鹽水潤濕紗布，覆蓋開放性創口</li>
                    <li>/me 執行遠端 CSM 檢查，確認有無神經血管受壓徵兆</li>
                    <li>/me 使用夾板實施「跨關節固定」，維持肢體軸線穩定</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 院內外科手術程序 (OR)</h3>
                <div class="procedure-box">
                    <strong>1. 影像學診斷</strong>
                    <p>/me 執行患肢 AP/Lateral 雙向 X 光，確認骨折類型與移位程度</p>

                    <strong>2. 閉鎖性骨折 (Closed Fracture)</strong>
                    <p>/me 給予 Keto 30mg 止痛後，進行徒手牽引復位 (Reduction)</p>
                    <p>/me 使用石膏捲施作支架固定，並確認肢體血循功能</p>

                    <strong>3. 開放性：I&D 術與內固定 (ORIF)</strong>
                    <p><strong>[步驟一：高壓沖洗]</strong></p>
                    <p>/me 使用 3000-6000ml 生理食鹽水對傷口執行高壓脈衝沖洗，移除汙染物</p>
                    <p><strong>[步驟二：外科清創]</strong></p>
                    <p>/me 使用手術刀切除失活的肌肉與受汙染的骨碎片</p>
                    <p>/me 執行傷口延伸切開 (Wound Extension)，逐層分離組織以暴露骨折斷端</p>
                    
                    <p><strong>[步驟三：解剖復位與內固定]</strong></p>
                    <p>/me 暴露骨折端，使用復位鉗 (Reduction Forceps) 將骨骼對齊</p>
                    <p>/me 於骨幹表面鎖上鈦合金鋼板 (Plate) 與自攻螺絲 (Screws) 進行牢固固定</p>
                    <p>/me 縫合血管與神經，確保血流與神經功能恢復</p>
                    <p>/me 將切口處的肌肉和組織依層縫合</p>
                    <p>/me 縫合皮膚表面，確保傷口閉合</p>
                    <p>/me 覆蓋無菌敷料</p>
                    <p>/me 放置石膏固定患肢</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "burn1":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header">
            <span class="status-badge">Minor Burn</span>
            <h2>🔥 I 度燒燙傷處置 (表皮層損傷)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場處理</h3>
                <ul>
                    <li>/me 流動清水沖洗後使用無菌生理食鹽水潤濕紗布覆蓋</li>
                </ul>
            </div>
            <div class="panel in-hospital">
                <h3>🏥 院內照護程序</h3>
                <div class="procedure-box">
                    <strong>1. 創面處置</strong>
                    <p>/me 使用生理食鹽水進行表面清潔</p>
                    <p>/me 均勻塗抹 Neomycin (新黴素軟膏) 保持組織濕潤</p>
                    <strong>2. 後續醫囑</strong>
                    <p>● 叮囑患者無需包紮，保持患處通風</p>
                    <p>● 觀察 24 小時內是否出現水泡(轉為二度)</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "burn2":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header trauma">
            <span class="status-badge">Moderate Burn</span>
            <h2>🔥 II 度燒燙傷處置 (真皮層損傷)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場處理</h3>
                <ul>
                    <li>/me 流動清水沖洗後使用無菌生理食鹽水潤濕紗布覆蓋</li>
                </ul>
            </div>
            <div class="panel in-hospital">
                <h3>🏥 院內外科處置</h3>
                <div class="procedure-box">
                    <strong>1. 水泡處理</strong>
                    <p>/me 以無菌針頭抽吸大面積張力性水泡，並保留水泡皮作為天然屏障</p>
                    <strong>2. 藥物應用</strong>
                    <p>/me 於創面覆蓋厚層 SSD (銀磺胺嘧啶) 抗菌藥膏</p>
                    <strong>3. 進階包紮</strong>
                    <p>/me 覆蓋石蠟紗布避免敷料黏連，並以捲軸紗布輕輕固定</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "burn3":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header trauma">
            <span class="status-badge">Burn Center SOP</span>
            <h2>💀 III 度燒燙傷：焦痂切開與深度清創手術</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場急救程序</h3>
                <ul>
                    <li>/me 建立雙側 14G 大口徑靜脈管路，啟動快速輸液</li>
                    <li>/me 移除戒指與手錶，預防組織腫脹導致遠端缺血</li>
                    <li>/me 以乾燥無菌布單包裹患部</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 燒傷專科手術程序 (OR)</h3>
                <div class="procedure-box">
                    <strong>1. 術前準備與麻醉</strong>
                    <p>/me 執行標準氣管插管並啟動吸入性全身麻醉</p>
                    
                    <strong>2. 焦痂切開術 (Escharotomy)</strong>
                    <p>/me 使用 #10 手術刀片沿患肢內外側中線執行縱向深切開</p>
                    <p>/me 深度切穿焦痂組織直到脂肪層，使皮緣向兩側彈開釋放壓力</p>
                    <p>/me 使用電燒刀 (Bovie) 對切口內活動性出血點進行止血</p>
                    

                    <strong>3. 深度清創手術 (Debridement)</strong>
                    <p>/me 使用 Goulian 刮刀或手術刀逐層刮除皮革狀壞死組織 (Eschar)</p>
                    <p>/me 以 3000ml 生理食鹽水配合脈衝式沖洗系統進行創面除菌</p>

                    <strong>4. 創面覆蓋與藥物</strong>
                    <p>/me 均勻塗抹 SSD (銀磺胺嘧啶) 抗菌藥膏於所有切口與創面</p>
                    <p>/me 覆蓋生物性敷料 (Biobrane) 或石蠟紗布避免黏連</p>
                    <p>/me 以厚層疏鬆紗布包紮，維持肢體於功能位置固定</p>

                    <strong>[醫囑備註]</strong>
                    <p>● 監測 CK 數值預防橫紋肌溶解症導致的急性腎衰竭</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "laceration":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header">
            <span class="status-badge">Wound Care SOP</span>
            <h2>✂️ 撕裂傷處置 (Laceration Repair - No Removal Required)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場止血與評估</h3>
                <ul>
                    <li>/me 直接施壓於傷口止血，使用無菌紗布覆蓋</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 院內免拆線縫合程序</h3>
                <div class="procedure-box">
                    <strong>1. 創面清創與麻醉</strong>
                    <p>/me 以生理食鹽水大量沖洗傷口，移除表淺異物</p>
                    <p>/me 使用 Betadine (優碘) 由內向外執行環狀消毒</p>
                    <p>/me 施打 Lidocaine 2% 進行局部浸潤麻醉</p>
                    
                    <strong>2. 免拆線縫合技術 (Absorbable Suture)</strong>
                    <p>/me 使用Vicryl (可吸收縫線) 執行皮內縫合</p>
                    <p>/me 針對表皮細微裂縫，塗抹 Dermabond (醫用傷口膠水) 加固封閉</p>
                    
                    <strong>3. 傷口保護與藥物</strong>
                    <p>/me 於表面塗抹 Neomycin (新黴素軟膏)</p>
                    <p>/me 覆蓋防水透明敷料 (Tegaderm)</p>

                    <strong>[醫囑備註] 破傷風 (TT) 施打準則：</strong>
                    <p>● 若傷口超過 1cm 且具污染性，施打 0.5ml Tetanus Toxoid</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "pneumothorax":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header trauma">
            <span class="status-badge">Critical Care SOP</span>
            <h2>🫁 氣血胸急救處置 (Hemo-Pneumothorax)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場減壓程序</h3>
                <ul>
                    <li>/me 於患側第二肋間與鎖骨中線交點執行「針刺減壓術」</li>
                    <li>/me 使用 14G 靜脈導管刺入胸膜腔，釋放高壓氣體</li>
                    <li>/me 若有開放性傷口，使用「三邊封閉敷料」建立單向瓣膜</li>
                    <li>/me 給予 15L/min 高流量氧氣，維持血氧飽和度 > 94%</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 院內胸腔引流手術 (Chest Tube)</h3>
                <div class="procedure-box">
                    <strong>1. 術前定位與麻醉</strong>
                    <p>/me 定位於患側第五肋間，腋中線與腋前線之間區域</p>
                    <p>/me 施打 Lidocaine 2% 進行肋間神經與胸壁局部浸潤麻醉</p>
                    
                    <strong>2. 胸腔切開術 (Thoracostomy)</strong>
                    <p>/me 使用 #10 手術刀片於肋骨上緣執行 2-3cm 橫向切口</p>
                    <p>/me 使用止血鉗 (Kelly Clamp) 鈍性剝離肋間肌與壁層胸膜</p>
                    <p>/me 伸入手指確認胸膜腔內無組織黏連 (Finger Exploration)</p>
                    

                    <strong>3. 引流管置入與固定</strong>
                    <p>/me 置入 30Fr 胸腔引流管，胸管導向胸腔後上方 (Posterior-Apex)，兼顧排氣與排血</p>
                    <p>/me 接上三腔式水封引流瓶 (Pleur-evac)，觀察是否有氣泡溢出</p>
                    <p>/me 使用可吸收縫線執行「錢包縫合」固定管路，並覆蓋凡士林紗布</p>
                    

                    <strong>[醫囑備註]</strong>
                    <p>● 若引流量瞬間超過 1500ml 或每小時 > 200ml，立即啟動開胸止血手術</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "thoracotomyexploration":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header emergency">
            <span class="status-badge">Level 1 Trauma Surgery</span>
            <h2>🫀 緊急開胸止血手術 (Thoracotomy)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🏥 與術前前置</h3>
                <ul>
                    <li>/me 執行氣管插管 (ET Tube) 並連結呼吸器給予 100% 氧氣</li>
                    <li>/me 開放雙側大口徑靜脈 (14G)，啟動大量輸液加溫器</li>
                    <li>/me 使用 10% Betadine (優碘) 迅速塗抹左側胸壁至腋下區域</li>
                    <li>/me 鋪設無菌單 (Draping)，僅暴露第四至第五肋間預計切口處</li>
                    <li>/me 靜脈推注 Propofol (異丙酚) 進行快速序列麻醉誘導 (RSI)</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 胸腔止血程序 (Surgical Phase)</h3>
                <div class="procedure-box">
                    <strong>1. 局部浸潤與切開</strong>
                    <p>/me 於預計切口沿線快速注射 Lidocaine 2% 以降低手術應激反應</p>
                    <p>/me 使用 #10 手術刀片於左側乳頭下方執行前側橫向大切口</p>
                    <p>/me 迅速切斷肋間肌，避免損傷肋間動脈</p>
                    
                    <strong>2. 強力暴露 (Exposure)</strong>
                    <p>/me 置入 Finochietto (開胸器) 並旋轉手把強力撐開肋骨</p>
                    
                    <p>/me 手動撥開肺葉，清除胸腔內積血，顯露縱膈腔與心包膜</p>

                    <strong>3. 核心止血與復甦 (The "Golden Moments")</strong>
                    <p>/me 執行主動脈夾閉 (Aortic Cross-clamping) 將血液保留至腦部</p>
                    <p>/me 使用血管鉗 (Kelly) 夾閉肺門大血管出血點，並以 Prolene 線縫合肺葉撕裂處</p>
                    

                    <strong>4. 關閉胸腔與引流</strong>
                    <p>/me 置入 32Fr 胸管至肺底，連接水封瓶確認肺部重張狀況</p>
                    <p>/me 使用強力可吸收縫線進行肋骨對合，並逐層密合胸壁肌肉與皮膚</p>

                    <strong>[醫囑備註]</strong>
                    <p>● 確認引流狀況</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "gsw":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header emergency">
            <span class="status-badge">Trauma Surgery</span>
            <h2>🔫 槍傷處置與彈頭移除手術 (GSW Exploration)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 創傷穩定程序</h3>
                <ul>
                    <li>/me 使用加壓止血法</li>
                    
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 探查與移除程序</h3>
                <div class="procedure-box">
                    <strong>1. 術前診斷與消毒</strong>
                    <p>/me 建立雙側大口徑靜脈管路，啟動加溫輸液</p>
                    <p>/me 靜脈推注 Morphine 5mg 進行強效止痛，緩解神經性休克</p>
                    <p>/me 使用 Betadine (優碘) 由傷口中心向外擴大消毒 3 圈</p>
                    <p>/me 鋪設無菌單並使用 Lidocaine 2% 沿彈道徑路浸潤麻醉</p>
                    
                    <strong>2. 創面擴創術 (Wound Track Exploration)</strong>
                    <p>/me 使用 #15 手術刀沿彈頭路徑執行擴大切開，移除汙染之組織</p>
                    <p>/me 使用血管鉗 (Kelly) 輕柔探查彈道，避免損傷鄰近之神經叢</p>
                    

                    <strong>3. 彈頭移除 (Bullet Extraction)</strong>
                    <p>/me 定位彈頭後，使用專用取彈鉗 (Bullet Forceps) 穩固夾取</p>
                    <p>/me 完整取出彈頭，檢查有無碎片殘留，並保存為證物</p>
                    <p>/me 使用大量生理食鹽水進行彈道內高壓沖洗</p>
                    

                    <strong>4. 血管修補與閉合</strong>
                    <p>/me 使用 Prolene 5-0 縫線修補受損之小血管</p>
                    <p>/me 使用可吸收縫線執行縫合，保留傷口彈性</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "dislocation":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header trauma">
            <span class="status-badge">Orthopedic Surgery</span>
            <h2>🦴 關節脫臼處置 (Dislocation Reduction)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場穩定程序</h3>
                <ul>
                    <li>/me 檢查患肢末梢脈搏與感覺，評估有無神經受壓</li>
                    <li>/me 保持脫臼姿勢固定，切勿在現場強力自行復位</li>
                    <li>/me 使用三角巾或充氣夾板固定關節上下兩端</li>
                    <li>/me 冰敷受損關節，緩解內部出血與急性腫脹</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 院內復位程序 (OR/ER)</h3>
                <div class="procedure-box">
                    <strong>1. 影像診斷與準備</strong>
                    <p>/me 靜脈推注 Propofol (異丙酚) 進行深層鎮靜，使肌肉完全放鬆</p>
                    <p>/me 於關節囊周圍注射 Lidocaine 2% 執行關節內麻醉</p>
                    
                    <strong>2. 徒手復位術 (Closed Reduction)</strong>
                    <p>/me 執行 相對應復位術 進行持續牽引</p>
                    <p>/me 聽到「咔」一聲(Click)並觀察到關節輪廓恢復正常</p>
                    

                    <strong>3. 切開復位手術 (Open Reduction)</strong>
                    <p><em>※ 若徒手復位失敗或有關節囊嵌入時執行：</em></p>
                    <p>/me 使用 #15 手術刀切開皮膚，暴露受阻礙之關節腔</p>
                    <p>/me 使用復位鉗撥開夾雜之軟組織，將關節頭導回關節窩</p>
                    <p>/me 使用可吸收縫線修補受損之關節囊與韌帶</p>
                    
                    <strong>4. 表皮免拆線縫合 (Closure)</strong>
                    <p>/me 使用 4-0 Monocryl 可吸收線執行「皮內縫合」 (Subcuticular Stitch)</p>
                    <p>/me 將縫線完全隱埋於真皮層內，利用人體水解自行吸收</p>
                    <p>/me 於傷口表面塗抹 Dermabond (醫用膠水) 形成抗菌保護膜</p>

                    <strong>5. 固定與後續</strong>
                    <p>/me 使用石膏支架 (Splint) 將關節固定於功能位置，限制活動</p>

                </div>
            </div>
        </div>
    </div>`;
                break;
            case "lavage":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header emergency">
            <span class="status-badge">Toxicology SOP</span>
            <h2>🧪 緊急洗胃與排毒處置 (Gastric Lavage)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場中毒處置</h3>
                <ul>
                    <li>/me 保持病患側臥 (Left Lateral Decubitus) 預防嘔吐窒息</li>
                    <li>/me 給予高濃度氧氣，並持續監測心電圖 (EKG) 變化</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 院內洗胃程序 (ER)</h3>
                <div class="procedure-box">
                    <strong>1. 鼻胃管置入 (NG Tube Insertion)</strong>
                    <p>/me 於粗口徑洗胃管 (36-40 Fr) 前端塗抹 Lidocaine 凝膠潤滑</p>
                    <p>/me 經鼻腔引導管路進入食道，並確認進入胃部 (聽診氣泡音)</p>
                    

                    <strong>2. 循環灌洗 (Lavage Phase)</strong>
                    <p>/me 注入 250ml 生理食鹽水，隨即利用重力或吸引器回抽</p>
                    <p>/me 反覆執行上述動作，直至回流液呈現澄清且無異味為止</p>
                    

                    <strong>3. 活性碳給藥 (Decontamination)</strong>
                    <p>/me 經管路注入 50g 活性碳 (Activated Charcoal) 懸浮液</p>

                    <strong>4. 移除管路與觀察</strong>
                    <p>/me 快速拔除洗胃管並清理口鼻分泌物</p>
                    <p>/me 靜脈注射大量的生理食鹽水，加速腎臟代謝稀釋毒素</p>

                    <strong>[醫囑備註] 禁忌症提醒：</strong>
                    <p>● 若誤食強酸、強鹼或石油製品，絕對禁止洗胃 (避免二次食道燒傷)</p>
                    <p>● 利用活性碳巨大的表面積吸附殘留毒素，阻斷腸道吸收</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "tamponade_plus":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header emergency">
            <span class="status-badge">Ultra-Critical SOP</span>
            <h2>🫀 心包填塞與開胸心臟修補術</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 ER 緊急減壓 (穿刺)</h3>
                <ul>
                    <li>/me 判定 Beck's Triad，於劍突下 45 度角刺入 18G 長針</li>
                    <li>/me 回抽暗紅色不凝固血液，暫時緩解心包填塞壓力</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 手術室開胸程序 (Thoracotomy)</h3>
                <div class="procedure-box">
                    <strong>1. 術前準備與消毒</strong>
                    <p>/me 執行全身麻醉與 RSI 氣管插管，維持 100% 給氧</p>
                    <p>/me 使用 Betadine 快速由左胸大面積消毒至腋中線，鋪設無菌單</p>
                    
                    <strong>2. 開胸與暴露 (Exposure)</strong>
                    <p>/me 使用 #10 刀片於左側第四肋間執行橫向切開，切斷肋間肌</p>
                    <p>/me 置入 Finochietto (開胸器) 強力撐開肋骨，移除殘餘血塊</p>
                    

                    <strong>3. 心包膜切開與修補 (Pericardiotomy)</strong>
                    <p>/me 使用止血鉗提起心包膜並用剪刀縱向剪開，釋放所有積血</p>
                    <p>/me 發現心室裂口，立即使用手指暫時按壓止血</p>
                    <p>/me 使用 3-0 Prolene 不可吸收線搭配「墊片 (Pledget)」進行褥式縫合</p>
                    <p>/me 確保縫合不傷及冠狀動脈，確認心室不再噴血</p>
                    

                    <strong>4. 關閉與免拆線處理</strong>
                    <p>/me 置入 32Fr 胸管引流；使用強力可吸收線執行肋骨對合</p>
                    <p>/me 使用 4-0 Monocryl 執行皮內縫合，外層覆蓋醫用膠水</p>

                </div>
            </div>
        </div>
    </div>`;
                break;
            case "laparotomy":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header emergency">
            <span class="status-badge">Trauma Level 1</span>
            <h2>🩸 緊急腹部探查手術 (Exploratory Laparotomy)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 術前準備與誘導</h3>
                <ul>
                    <li>/me 執行快速序列誘導 (RSI)，靜脈推注 Propofol 確保深層麻醉</li>
                    <li>/me 使用 10% Betadine 由劍突至恥骨大面積消毒，鋪設剖腹單</li>
                    <li>/me 留置鼻胃管 (NG Tube) 減壓，預防胃內容物反流</li>
                    <li>/me 建立自體血液回收系統 (Cell Saver)，備好 4 單位紅血球 (pRBC)</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 剖腹探查程序</h3>
                <div class="procedure-box">
                    <strong>1. 正中切開與進入 (Entry)</strong>
                    <p>/me 使用 #10 刀片執行正中線切開 (Midline Incision)，切穿白線進入腹腔</p>
                    <p>/me 使用大型吸引器 (Yankauer) 抽吸積血，視野顯露腸道與器官</p>
                    

                    <strong>2. 四象限探查與止血 (Evisceration)</strong>
                    <p>/me 執行「四象限塞紗包紮」(Four-quadrant Packing) 以暫時壓迫止血</p>
                    <p>/me 使用血管鉗夾閉出血之腸系膜血管，並以 Prolene 線縫合</p>
                    

                    <strong>3. 損傷控制與沖洗</strong>
                    <p>/me 以 5000ml 溫生理食鹽水反覆沖洗腹腔，移除汙染與血塊</p>
                    <p>/me 放置 JP 引流管於盆腔低處，監測術後滲血狀況</p>

                    <strong>4. 腹壁關閉與免拆線處理</strong>
                    <p>/me 使用 #1 粗規格可吸收線執行「筋膜層」強力連續縫合</p>
                    <p>/me 使用 4-0 Monocryl 執行皮內縫合，外層覆蓋 Dermabond 醫用膠水</p>
                    

                    <strong>[醫囑備註]</strong>
                    <p>● 監測腹壓 (IAP)，預防腹部腔室症候群 (ACS)</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            case "craniotomy":
                content = `
    <div class="clinical-dashboard">
        <div class="status-header trauma">
            <span class="status-badge">Neurosurgery SOP</span>
            <h2>🧠 開顱手術：顱內出血清除 (Craniotomy for ICH)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 術前急救與誘導</h3>
                <ul>
                    <li>/me 執行 RSI 氣管插管 (On Endo)，給予 Mannitol (甘露醇) 降低顱內壓</li>
                    <li>/me 剃除手術區域頭髮，使用 Betadine 與酒精進行頭皮三層消毒</li>
                    <li>/me 靜脈推注 Propofol 與肌鬆劑，維持病患於深層麻醉狀態</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 神經外科程序</h3>
                <div class="procedure-box">
                    <strong>1. 骨瓣開窗 (Bone Flap)</strong>
                    <p>/me 使用 #10 刀片執行弧形切開，翻開頭皮瓣並以止血鉗固定出血點</p>
                    <p>/me 使用氣動鑽 (Cranial Drill) 於顱骨執行三處定位鑽孔</p>
                    
                    <p>/me 使用銑刀 (Gigli saw/Craniotome) 連接孔洞，取下骨瓣並浸泡於生理食鹽水中</p>
                    
                    <strong>2. 硬腦膜切開與清創 (Evacuation)</strong>
                    <p>/me 使用 #11 尖刀小心切開硬腦膜 (Dura)，顯露下方之暗紅色血塊</p>
                    
                    <p>/me 使用溫生理食鹽水緩慢沖洗，利用雙極電燒 (Bipolar) 對皮質出血點精確止血</p>
                    <p>/me 使用吸引器輕柔移除壓迫腦組織之血腫 (Hematoma)，解除腦幹擠壓</p>

                    <strong>3. 置入監測器與關閉 (ICP & Closure)</strong>
                    <p>/me 於非優勢大腦半球鑽設小孔</p>
                    <p>/me 穿透硬腦膜，置入細長之 ICP 纖維導管至側腦室 (Intraventricular)</p>
                    <p>/me 將導管末端經由皮下隧道 (Tunneling) 導出，遠離骨瓣切口以防感染</p>
                    <p>/me 使用可吸收縫線 (Vicryl) 嚴密縫合硬腦膜，確保無腦脊髓液滲漏</p>
                    <p>/me 放回骨瓣並以鈦合金骨釘固定，小心避開導管路徑以免擠壓</p>
                    <p>/me 使用 4-0 Monocryl 執行皮內縫合，外層覆蓋醫用膠水</p>
                    

                    <strong>[醫囑備註]</strong>
                    <p>● 留置顱內壓監測器 (ICP Monitor)，術後維持頭部抬高 30 度</p>
                </div>
            </div>
        </div>
    </div>`;
                break;
            // ... 以此類推 ...
        }

        if (content) {
            injuryDetails.innerHTML = `<div class="mai-fade-in">${content}</div>`;
        }
    };
})();