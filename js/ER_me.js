(function initERMeSystem() {
    const injurySelect = document.getElementById('injurySelect');
    const injuryDetails = document.getElementById('injuryDetails');

    // ===============================
    // 全域系統狀態
    // ===============================
    let copyLines = [];
    let currentLine = 0;

    // 1. 顯示選單與初始化預設 UI（含操作說明提示）
    if (injurySelect) injurySelect.style.display = 'block';

    if (injuryDetails) {
        injuryDetails.innerHTML = `
            <div class="clinical-dashboard">
                <div class="status-header" style="background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); border-left-color: #95a5a6;">
                    <span class="status-badge">System Ready</span>
                    <h2><i class="fas fa-hospital-symbol"></i> 醫療輔助系統 (MAI)</h2>
                </div>
                <div class="panel text-center" style="padding: 25px 20px;">
                    <div class="mb-3">
                        <i class="fas fa-user-md" style="font-size: 3rem; color: #bdc3c7;"></i>
                    </div>
                    <h4 class="text-secondary">等待指令中...</h4>
                    <p class="text-muted">請由上方選單選擇傷勢類別，以調閱對應的手術 SOP 與處置指引。</p>
                    
                    <!-- 新增：快捷鍵與操作說明面板 -->
                    <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin: 20px 0; text-align: left;">
                        <div style="font-weight: bold; margin-bottom: 10px; color: #3b82f6; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-keyboard"></i> MAI 快速複製指令操作說明：
                        </div>
                        <ul style="list-style: none; padding-left: 0; margin: 0; font-size: 0.88rem; line-height: 1.8; color: #cbd5e1;">
                            <li>🖱️ <b>點擊單行</b>：直接複製該行指令並設定為高亮。</li>
                            <li>⌨️ <kbd style="background: #334155; padding: 2px 6px; border-radius: 4px;">Enter</kbd>：<b>複製當前高亮指令</b> 並自動跳至下一行（適合連續推演 RP）。</li>
                            <li>⌨️ <kbd style="background: #334155; padding: 2px 6px; border-radius: 4px;">Space</kbd>：僅複製當前高亮指令（不自動跳行）。</li>
                            <li>⌨️ <kbd style="background: #334155; padding: 2px 6px; border-radius: 4px;">↓</kbd> / <kbd style="background: #334155; padding: 2px 6px; border-radius: 4px;">↑</kbd>：切換高亮目標選擇。</li>
                            <li>⌨️ <kbd style="background: #334155; padding: 2px 6px; border-radius: 4px;">Esc</kbd>：重置回第一行。</li>
                        </ul>
                    </div>

                    <hr style="border-color: rgba(255, 255, 255, 0.1);">
                    <div class="d-flex justify-content-around text-muted" style="font-size: 0.8rem;">
                        <span><i class="fas fa-check-circle"></i> 診斷協議已就緒</span>
                        <span><i class="fas fa-check-circle"></i> 快捷複製系統已加載</span>
                    </div>
                </div>
            </div>`;
    }

    // ===============================
    // MAI Copy System 核心函式
    // ===============================
    function scanCopyLines() {
        copyLines = [];

        injuryDetails.querySelectorAll("li, p").forEach(el => {
            const text = el.textContent.trim();

            if (
                text.startsWith("/me") ||
                text.startsWith("/do") ||
                text.startsWith("/ame")
            ) {
                copyLines.push(el);

                el.style.cursor = "pointer";
                el.style.transition = "0.2s";
                el.title = "點擊即可複製指令";

                el.onclick = () => {
                    currentLine = copyLines.indexOf(el);
                    copyCurrentLine();
                    highlightCurrent();
                };
            }
        });

        highlightCurrent();
    }

    function highlightCurrent() {
        copyLines.forEach((el, index) => {
            if (index === currentLine) {
                el.style.background = "#2563eb";
                el.style.color = "#fff";
                el.style.padding = "6px 10px";
                el.style.borderRadius = "6px";

                // 自動平滑捲動，讓高亮行保持在視野中央或頂部附近
                el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                el.style.background = "";
                el.style.color = "";
                el.style.padding = "";
                el.style.borderRadius = "";
            }
        });
    }

    async function copyCurrentLine() {
        if (!copyLines.length || !copyLines[currentLine]) return;

        const text = copyLines[currentLine].textContent.trim();

        try {
            await navigator.clipboard.writeText(text);
            showToast("✓ 已複製指令至剪貼簿");
        } catch (err) {
            alert("複製失敗，請確認瀏覽器權限");
        }
    }

    function showToast(message) {
        let toast = document.getElementById("maiToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "maiToast";
            toast.style.position = "fixed";
            toast.style.right = "20px";
            toast.style.bottom = "20px";
            toast.style.background = "#16a34a";
            toast.style.color = "#fff";
            toast.style.padding = "12px 18px";
            toast.style.borderRadius = "8px";
            toast.style.zIndex = "99999";
            toast.style.boxShadow = "0 0 10px rgba(0,0,0,.3)";
            toast.style.transition = ".25s";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = "1";

        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => {
            toast.style.opacity = "0";
        }, 1200);
    }

    // ===============================
    // 全域鍵盤事件監聽
    // ===============================
    document.addEventListener("keydown", async (e) => {
        if (!copyLines.length) return;

        // 如果玩家正在打字（輸入框或聊天欄），不觸發快捷鍵
        if (
            document.activeElement.tagName === "INPUT" ||
            document.activeElement.tagName === "TEXTAREA"
        ) return;

        switch (e.key) {
            case "Enter":
                e.preventDefault();
                await copyCurrentLine();
                currentLine++;
                if (currentLine >= copyLines.length) currentLine = 0;
                highlightCurrent();
                break;

            case "ArrowDown":
                e.preventDefault();
                currentLine++;
                if (currentLine >= copyLines.length) currentLine = 0;
                highlightCurrent();
                break;

            case "ArrowUp":
                e.preventDefault();
                currentLine--;
                if (currentLine < 0) currentLine = copyLines.length - 1;
                highlightCurrent();
                break;

            case " ":
                e.preventDefault();
                await copyCurrentLine();
                break;

            case "Escape":
                currentLine = 0;
                highlightCurrent();
                break;
        }
    });

    // ===============================
    // 下拉選單變換邏輯
    // ===============================
    if (injurySelect) {
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

                        <!-- 院後衛教卡片區塊 -->
                        <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                    📋 軟組織傷口衛教指南
                                </span>
                            </div>
                            <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                                <li><strong>傷口防水：</strong> 換藥前請保持敷料乾燥，洗澡時避免直接碰水或浸泡，預防細菌滋生。</li>
                                <li><strong>換藥頻率：</strong> 每日定時清潔傷口並塗抹新黴素軟膏，若敷料滲血或濕透應立即更換。</li>
                                <li><strong>感染徵兆：</strong> 若傷口周圍出現<strong>紅腫擴大、異常發熱、劇烈疼痛或膿性分泌物</strong>，請立即回診。</li>
                                <li><strong>破傷風預防：</strong> 評估近 5 年內是否施打過破傷風疫苗，必要時請至門診補打追加劑。</li>
                            </ul>
                        </div>

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
                    <li>/me 使用夾板實施「跨關節固定」，維護肢體軸線穩定</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 院內外科手術程序 (OR)</h3>
                <div class="procedure-box">
                    <strong>1. 影像學診斷</strong>
                    <p>/me 執行患肢 AP/Lateral 雙向 X 光，確認骨折類型與移位程度</p>

                    <strong>2. 臨床處置分支</strong>
                    <!-- 判斷卡片區塊 -->
                    <div style="display: flex; flex-direction: column; gap: 10px; margin: 10px 0;">
                        
                        <!-- 閉鎖性骨折卡片 -->
                        <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 10px 12px; border-radius: 4px;">
                            <div style="font-weight: bold; color: #60a5fa; font-size: 0.85rem; margin-bottom: 6px;">
                                🔹 閉鎖性骨折 (Closed Fracture)
                            </div>
                            <p style="margin-bottom: 4px;">/me 給予 Keto 30mg 止痛後，進行徒手牽引復位 (Reduction)</p>
                            <p style="margin: 0;">/me 使用石膏捲施作支架固定，並確認肢體血循功能</p>
                        </div>

                        <!-- 開放性骨折卡片 -->
                        <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 10px 12px; border-radius: 4px;">
                            <div style="font-weight: bold; color: #f87171; font-size: 0.85rem; margin-bottom: 6px;">
                                🚨 開放性骨折：I&D 術與內固定 (ORIF)
                            </div>
                            <p style="margin-bottom: 4px;"><strong>[步驟一：高壓沖洗]</strong></p>
                            <p style="margin-bottom: 8px;">/me 使用 3000-6000ml 生理食鹽水對傷口執行高壓脈衝沖洗，移除汙染物</p>
                            
                            <p style="margin-bottom: 4px;"><strong>[步驟二：外科清創]</strong></p>
                            <p style="margin-bottom: 4px;">/me 使用手術刀切除失活的肌肉與受汙染的骨碎片</p>
                            <p style="margin-bottom: 8px;">/me 執行傷口延伸切開 (Wound Extension)，逐層分離組織以暴露骨折斷端</p>
                            
                            <p style="margin-bottom: 4px;"><strong>[步驟三：解剖復位與內固定]</strong></p>
                            <p style="margin-bottom: 4px;">/me 暴露骨折端，使用復位鉗 (Reduction Forceps) 將骨骼對齊</p>
                            <p style="margin-bottom: 4px;">/me 於骨幹表面鎖上鈦合金鋼板 (Plate) 與自攻螺絲 (Screws) 進行牢固固定</p>
                            <p style="margin-bottom: 4px;">/me 縫合血管與神經，確保血流與神經功能恢復</p>
                            <p style="margin-bottom: 4px;">/me 將切口處的肌肉和組織依層縫合</p>
                            <p style="margin-bottom: 4px;">/me 縫合皮膚表面，確保傷口閉合</p>
                            <p style="margin-bottom: 4px;">/me 覆蓋無菌敷料</p>
                            <p style="margin: 0;">/me 放置石膏固定患肢</p>
                        </div>

                    </div>

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 骨折與術後院後衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>患肢抬高與消腫：</strong> 前 48 小時請將患肢抬高至高於心臟位置，並可進行局部冰敷以減緩腫脹。</li>
                            <li><strong>石膏與傷口維護：</strong> 保持石膏/敷料絕對乾燥，嚴禁自行撬開或往石膏內塞入異物抓癢。</li>
                            <li><strong>末梢血循檢查：</strong> 定期觀察手指/腳趾皮膚顏色與溫度，若出現<strong>劇烈漸進性疼痛、麻木感、蒼白或發紫</strong>，需防範「腔室症候群」並立即回診。</li>
                            <li><strong>負重限制與追蹤：</strong> 未經醫師允許嚴禁患肢提前負重或踩地，遵醫囑於 2-4 週內回診複查 X 光評估骨癒合進度。</li>
                        </ul>
                    </div>

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

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 I 度燒燙傷院後衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>保濕與散熱：</strong> 塗抹薄層新黴素軟膏或純蘆薈膠保持患處濕潤，避免使用刺激性保養品或冰敷（以免凍傷敏感組織）。</li>
                            <li><strong>防曬保護：</strong> 痊癒期（約 3-7 天）患部易色素沉澱，外出時請加強物理性防曬（如遮陽衣物）。</li>
                            <li><strong>動態觀察：</strong> 若 24-48 小時內皮膚隆起出現<strong>水泡、紅腫持續加劇或劇烈疼痛</strong>，代表損傷已達真皮層（轉為二度），請回診處理。</li>
                        </ul>
                    </div>

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

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 II 度燒燙傷院後衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>水泡皮保護：</strong> 抽吸後保留的水泡表皮為最佳天然無菌敷料，<strong>嚴禁自行撕除或擠壓</strong>，讓其自然乾燥脫落。</li>
                            <li><strong>敷料防水與更換：</strong> 保持包紮乾燥，洗澡時避免患部碰水。依醫囑每日 1-2 次使用銀磺胺嘧啶 (SSD) 與石蠟紗布更換敷料。</li>
                            <li><strong>感染警訊監測：</strong> 若出現<strong>傷口發臭、濃稠黃綠色分泌物、周圍紅腫熱痛擴散或發燒</strong>，請立即回門診評估。</li>
                            <li><strong>飲食營養：</strong> 補充高蛋白飲食（如雞蛋、牛奶、肉類）與維生素 C，以加速真皮層修復。</li>
                        </ul>
                    </div>

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

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 III 度燒燙傷術後與出院衛教
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>擺位與早期復健：</strong> 關節處需維持於「功能位置」（如手部伸直、踝部 90 度），並遵照物理治療師指示進行早期被動拉筋，<strong>防止關節攣縮與皮膚緊繃</strong>。</li>
                            <li><strong>疤痕管理：</strong> 創面皮片癒合後需遵醫囑穿著<strong>壓力衣 (Pressure Garments) 24 小時（持續 6-12 個月）</strong>，以抑制肥厚性疤痕 (Keloid) 增生。</li>
                            <li><strong>切開口與皮瓣照護：</strong> 焦痂切開處與補皮區需保持無菌，發現切口出血增多、壞死黑斑擴大或全身高燒不退，須警惕敗血症風險。</li>
                            <li><strong>腎功能與尿色監測：</strong> 出院初期的患者需持續注意尿液顏色，若出現<strong>茶色/醬油色尿液</strong>（橫紋肌溶解徵兆），請立即聯絡醫院。</li>
                        </ul>
                    </div>

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

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>防水與洗澡：</strong> 醫用膠水/防水敷料保護下可正常淋浴，但 7-10 天內嚴禁泡澡或游泳。</li>
                            <li><strong>傷口照護：</strong> 免拆線縫線會由人體自行吸收，若膠水自然脫落切勿抓摳。每日檢查有無紅腫熱痛或膿性分泌物。</li>
                            <li><strong>藥物施用：</strong> 按時塗抹抗生素軟膏，並依醫囑服用止痛藥與口服抗生素。</li>
                        </ul>
                    </div>
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

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>活動限制：</strong> 拔管出院後 2-4 週內禁止高空飛行、潛水及劇烈運動，避免胸腔壓力劇變導致復發。</li>
                            <li><strong>呼吸訓練：</strong> 每日定時練習深呼吸與咳嗽（以手或枕頭輕壓胸部傷口），促進肺部擴張。</li>
                            <li><strong>異常警訊：</strong> 若突發<strong>突發性胸痛、呼吸困難、咳血或傷口滲血/滲液</strong>，必須立即急診返診。</li>
                        </ul>
                    </div>
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

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>胸壁保護：</strong> 術後 3 個月內嚴禁舉重物 (>5kg)、擴胸運動或拉扯上半身肌肉，防止肋骨縫合處裂開。</li>
                            <li><strong>疼痛管理：</strong> 開胸術後神經痛較為劇烈，請遵醫囑定時服用止痛藥，不可隨意停藥以免影響呼吸深度。</li>
                            <li><strong>照護與追蹤：</strong> 保持左胸大型切口乾爽，按時回診複查胸部 X 光及心肺功能。若出現高燒、呼吸急促立即掛急診。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
                    break;

                // 獨立 Case 1：槍傷擦傷 / 掠過傷
                case "gsw_graze":
                    content = `
    <div class="clinical-dashboard">
        <div class="status-header" style="border-left-color: #eab308;">
            <span class="status-badge" style="background: #eab308; color: #1e293b;">Minor Trauma</span>
            <h2>⚡ 淺層槍傷 / 擦傷處置 (Bullet Graze Wound)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 創傷穩定程序</h3>
                <ul>
                    <li>/me 使用無菌生理食鹽水紗布覆蓋擦傷創面</li>
                    <li>/me 評估傷口深淺，確認無深層大出血或彈頭滯留跡象</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 院內傷口處置程序</h3>
                <div class="procedure-box">
                    <strong>1. 創面清創與沖洗</strong>
                    <p>/me 使用 500ml 生理食鹽水對擦傷創面進行高壓噴射沖洗，移除火藥殘渣與異物</p>
                    <p>/me 使用 Betadine (優碘) 由創面中心向外擴大環狀消毒 3 圈</p>

                    <strong>2. 藥物預防與抗感染</strong>
                    <p>/me 於表皮擦傷處均勻塗抹 Neomycin (新黴素抗生素軟膏) 預防感染</p>
                    <p>/me 靜脈注射破傷風疫苗 (Tetanus Toxoid) 預防深層組織感染</p>

                    <strong>3. 敷料包紮與衛教</strong>
                    <p>/me 放置 Telfa 不沾黏無菌敷料作為首層保護介面</p>
                    <p>/me 使用捲軸紗布進行適度加壓包紮，並確認遠端血循正常</p>

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>換藥說明：</strong> 每日更換敷料 1 次，更換前使用生理食鹽水清理舊軟膏並重塗抗生素軟膏。</li>
                            <li><strong>觀察感染：</strong> 槍傷火藥殘渣易致感染，若傷口周圍出現紅腫擴散、發熱或黃綠色膿液，請立即回診。</li>
                            <li><strong>生活防護：</strong> 傷口完全癒合前避開污染環境，淋浴時需使用防水保護套。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
                    break;

                // 獨立 Case 2：深層滯留槍傷 / 彈頭移除手術
                case "gsw_surgery":
                    content = `
    <div class="clinical-dashboard">
        <div class="status-header emergency">
            <span class="status-badge">Trauma Surgery</span>
            <h2>🔫 滯留性槍傷：探查與彈頭移除手術 (GSW Exploration)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 創傷穩定程序</h3>
                <ul>
                    <li>/me 使用無菌加壓敷料對傷口執行直接加壓止血</li>
                    <li>/me 檢查有無貫穿性出口創口 (Exit Wound)，並確認遠端血循與神經功能</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 院內探查與手術程序 (OR)</h3>
                <div class="procedure-box">
                    <strong>1. 術前準備與麻醉</strong>
                    <p>/me 建立雙側大口徑靜脈管路，啟動加溫輸液與生命徵象監測</p>
                    <p>/me 靜脈推注 Morphine 5mg 進行強效止痛，緩解神經性休克</p>
                    <p>/me 使用 Betadine (優碘) 由傷口中心向外擴大消毒 3 圈並鋪設無菌單</p>
                    <p>/me 使用 Lidocaine 2% 沿彈道徑路執行浸潤麻醉</p>

                    <strong>2. 創面擴創與彈道探查</strong>
                    <p>/me 使用 15號 手術刀沿彈頭路徑執行擴大切開，移除汙染與壞死組織</p>
                    <p>/me 使用血管鉗 (Kelly) 輕柔探查彈道，避免損傷鄰近之神經血管</p>

                    <strong>3. 彈頭取出手術</strong>
                    <p>/me 定位彈頭後，使用專用取彈鉗 (Bullet Forceps) 穩固夾取並完整取出</p>
                    <p>/me 檢查彈頭有無碎片殘留，並將彈頭封存於證物袋中</p>
                    <p>/me 使用大量生理食鹽水進行彈道深層高壓脈衝沖洗</p>

                    <strong>4. 血管修補與層級縫合</strong>
                    <p>/me 使用 Prolene 5-0 縫線修補受損之微血管</p>
                    <p>/me 使用可吸收縫線進行肌肉與皮下組織分層縫合</p>
                    <p>/me 縫合皮膚表層，覆蓋無菌敷料並完成加壓包紮</p>

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>抗生素療程：</strong> 務必按時將開立之口服抗生素完全服用完畢，防止深層組織或骨髓炎感染。</li>
                            <li><strong>患肢/患處照護：</strong> 若傷及肢體，請抬高患肢以減輕腫脹，並密切注意肢體末端是否麻木、發紺或失去知覺。</li>
                            <li><strong>複診通知：</strong> 7-10 天內回診檢視深層組織癒合狀況，如有持續性劇痛或創口發臭請即刻急診。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
                    break;

                case "dislocation":
                    content = `
    <div class="clinical-dashboard">
        <div class="status-header trauma">
            <span class="status-badge">Orthopedic Emergency</span>
            <h2>🦴 關節脫臼處置：非手術與手術復位程序</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場初步處置</h3>
                <ul>
                    <li>/me 檢查患肢末梢 CSM (神經/血循/運動)，評估有無神經受壓徵兆</li>
                    <li>/me 保持脫臼姿勢固定，切勿在現場強力自行復位</li>
                    <li>/me 使用三角巾或充氣夾板實施固定，維護關節兩端穩定</li>
                    <li>/me 冰敷受損關節，緩解內部出血與急性腫脹</li>
                </ul>
            </div>

            <div class="panel in-hospital">
                <h3>🏥 院內復位與外科處置 (ER / OR)</h3>
                <div class="procedure-box">
                    <strong>1. 影像學診斷與術前準備</strong>
                    <p>/me 執行患肢 AP/Lateral X 光，評估關節脫臼方向與是否合併骨折</p>
                    <p>/me 靜脈推注 Propofol (異丙酚) 進行深層鎮靜/麻醉，使肌肉完全放鬆</p>
                    <p>/me 於關節囊周圍注射 Lidocaine 2% 執行關節內麻醉</p>

                    <strong>2. 臨床處置分支</strong>
                    <!-- 判斷卡片區塊 -->
                    <div style="display: flex; flex-direction: column; gap: 10px; margin: 10px 0;">
                        
                        <!-- 非手術徒手復位卡片 -->
                        <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 10px 12px; border-radius: 4px;">
                            <div style="font-weight: bold; color: #60a5fa; font-size: 0.85rem; margin-bottom: 6px;">
                                🔹 閉鎖性脫臼：徒手復位術 (Closed Reduction)
                            </div>
                            <p style="margin-bottom: 4px;">/me 執行相對應復位手法進行持續牽引與角度校正</p>
                            <p style="margin-bottom: 4px;">/me 聽到「咔」一聲 (Click) 並觀察到關節解剖輪廓恢復正常</p>
                            <p style="margin: 0;">/me 重新確認末梢脈搏與神經感知功能，並施作石膏支架 (Splint) 固定</p>
                        </div>

                        <!-- 切開復位手術卡片 -->
                        <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 10px 12px; border-radius: 4px;">
                            <div style="font-weight: bold; color: #f87171; font-size: 0.85rem; margin-bottom: 6px;">
                                🚨 難復性/複雜性脫臼：切開復位術 (Open Reduction)
                            </div>
                            <p style="margin-bottom: 4px;"><strong>[步驟一：手術入路與暴露]</strong></p>
                            <p style="margin-bottom: 8px;">/me 使用 15號 手術刀切開皮膚，逐層分離組織以充分暴露關節腔</p>
                            
                            <p style="margin-bottom: 4px;"><strong>[步驟二：崁頓解除與解剖復位]</strong></p>
                            <p style="margin-bottom: 8px;">/me 使用復位鉗撥開夾雜之軟組織與崁頓構造，將關節頭精準導回關節窩</p>
                            
                            <p style="margin-bottom: 4px;"><strong>[步驟三：韌帶修補與精細縫合]</strong></p>
                            <p style="margin-bottom: 4px;">/me 使用可吸收縫線修補受損之關節囊與韌帶構造</p>
                            <p style="margin-bottom: 4px;">/me 使用 4-0 Monocryl 可吸收線執行「皮內縫合」(Subcuticular Stitch)</p>
                            <p style="margin-bottom: 4px;">/me 於傷口表面塗抹 Dermabond (醫用膠水) 形成抗菌保護膜</p>
                            <p style="margin: 0;">/me 使用石膏支架將關節固定於功能位置，限制活動</p>
                        </div>

                    </div>

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 關節脫臼與術後院後衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>固定佩戴：</strong> 石膏/副木支架需持續佩戴 2-6 週（視是否接受手術與關節部位而定），切勿自行拆除避免習慣性脫臼。</li>
                            <li><strong>冰敷止痛：</strong> 復位後 48 小時內，每次冰敷 15-20 分鐘（隔著布料），有助減輕關節囊腫脹。</li>
                            <li><strong>傷口照顧（若有手術）：</strong> 保持表層膠水與敷料乾燥即可，若出現紅腫發熱或異常滲液需立即回診。</li>
                            <li><strong>末梢血循檢查：</strong> 定期觀察患肢末梢顏色與感知，若出現劇烈漸進性麻木或發紫應及時就醫。</li>
                            <li><strong>復健銜接：</strong> 拆除固定後應逐步進行物理治療，恢復關節全活動度與周邊肌肉力量。</li>
                        </ul>
                    </div>

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


                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>排便說明：</strong> 服用活性碳後 1-2 天內排出黑色糞便屬於正常現象，不必驚慌。</li>
                            <li><strong>飲食調整：</strong> 洗胃後咽喉與胃黏膜較敏感，24-48 小時內宜進食溫和清淡的流質或軟質食物。</li>
                            <li><strong>中毒追蹤：</strong> 若為藥物/毒物中毒，出院後需定期追蹤肝腎功能；若有遲發性腹痛、嘔血或意識改變請立即送醫。</li>
                        </ul>
                    </div>
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

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>心臟保護：</strong> 術後需嚴格靜養，3 個月內禁止任何劇烈運動或情緒大起大落，避免血壓劇升影響心壁縫合處。</li>
                            <li><strong>回診監測：</strong> 遵醫囑按時回診進行心臟超音波 (Echo) 複查，確認無心包積液復發或心肌炎跡象。</li>
                            <li><strong>緊急警訊：</strong> 若出現<strong>心悸、胸悶、頭暈昏厥、下肢水腫或呼吸困難</strong>，必須立即前往心臟外科急診。</li>
                        </ul>
                    </div>
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


                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>腹肌防護：</strong> 術後 6-8 週內穿戴束腹帶支撐腹壁，嚴禁提重物、用力蹲便或劇烈彎腰，防止腹壁疝氣。</li>
                            <li><strong>腸胃照顧：</strong> 採少量多餐，多補充高蛋白與高纖維食物，避免暴飲暴食或易產氣食物導致腹脹。</li>
                            <li><strong>警訊觀察：</strong> 若有<strong>劇烈腹痛、持續嘔吐、無法排氣排便或傷口滲出黃綠色膿液</strong>，請立即急診處置。</li>
                        </ul>
                    </div>
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
                    <p>/me 使用 10號 刀片執行弧形切開，翻開頭皮瓣並以止血鉗固定出血點</p>
                    <p>/me 使用氣動鑽 (Cranial Drill) 於顱骨執行三處定位鑽孔</p>
                    <p>/me 使用銑刀 (Craniotome) 連接孔洞，取下骨瓣並浸泡於生理食鹽水中</p>
                    
                    <strong>2. 硬腦膜切開與清創 (Evacuation)</strong>
                    <p>/me 使用 11號 尖刀小心切開硬腦膜 (Dura)，顯露下方之暗紅色血塊</p>
                    <p>/me 使用溫生理食鹽水緩慢沖洗，利用雙極電燒 (Bipolar) 對皮質出血點精確止血</p>
                    <p>/me 使用吸引器輕柔移除壓迫腦組織之血腫 (Hematoma)，解除腦幹擠壓</p>

                    <strong>3. 置入監測器與關閉 (ICP & Closure)</strong>
                    <p>/me 於非優勢大腦半球鑽設小孔</p>
                    <p>/me 穿透硬腦膜，置入細長之 ICP 纖維導管至側腦室 (Intraventricular)</p>
                    <p>/me 將導管末端經由皮下隧道 (Tunneling) 導出，遠離骨瓣切口以防感染</p>
                    <p>/me 使用可吸收縫線 (Vicryl) 嚴密縫合硬腦膜，確保無腦脊髓液滲漏</p>
                    <p>/me 放回骨瓣並以鈦合金骨釘固定，小心避開導管路徑以免擠壓</p>
                    <p>/me 使用 4-0 Monocryl 執行皮內縫合，外層覆蓋醫用膠水</p>

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>傷口照護：</strong> 保持頭部切口乾燥清潔，每 1-2 天更換無菌敷料，預防顱內感染。</li>
                            <li><strong>日常生活：</strong> 術後 4-6 週內嚴禁劇烈運動、低頭彎腰或搬運重物，避免頭部壓力驟升。</li>
                            <li><strong>症狀觀察：</strong> 密切留意家屬/患者狀況，若出現<strong>劇烈頭痛、噴射性嘔吐、抽搐、意識模糊</strong>需立即送醫。</li>
                            <li><strong>返診追蹤：</strong> 遵照醫囑按時服用抗癲癇與降腦壓藥物，並於 7-14 天內回診拆線與複查頭部 CT。</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>`;
                    break;

                case "drowning":
                    content = `
    <div class="clinical-dashboard">
        <div class="status-header">
            <span class="status-badge" style="background: #3182ce;">Respiratory Emergency</span>
            <h2>🌊 溺水救援與復甦處置 (Drowning & Recovery)</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 EMS 現場急救動作</h3>
                <ul>
                    <li>/me 迅速將溺水者移至平地，清除口鼻內水草、淤泥等異物</li>
                    <li>/me 傾聽與觀察胸廓起伏，評估患者自主呼吸與脈搏狀態</li>
                </ul>

                <!-- 評估分支卡片區塊 -->
                <div style="display: flex; flex-direction: column; gap: 8px; margin: 12px 0;">
                    <!-- 無呼吸分支 -->
                    <div style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 10px 12px; border-radius: 4px;">
                        <div style="font-weight: bold; color: #f87171; font-size: 0.85rem; margin-bottom: 4px;">
                            🚨 判斷：患者無呼吸 / 心跳停止
                        </div>
                        <p style="margin: 0;">/me 立即啟動 CPR 高品質胸外按壓，並使用 BVM 提供 5 次初始人工通氣</p>
                    </div>

                    <!-- 有呼吸分支 -->
                    <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 10px 12px; border-radius: 4px;">
                        <div style="font-weight: bold; color: #34d399; font-size: 0.85rem; margin-bottom: 4px;">
                            ✅ 判斷：患者有呼吸但意識模糊
                        </div>
                        <p style="margin: 0;">/me 將患者身體擺放為側臥復甦姿勢 (Recovery Position)，防止嘔吐物誤吸</p>
                    </div>
                </div>

                <ul>
                    <li>/me 保暖毯包裹患者，避免體溫進一步流失</li>
                </ul>
            </div>
            
            <div class="panel in-hospital">
                <h3>🏥 院內照護程序</h3>
                <div class="procedure-box">
                    <strong>1. 氣道與肺部管理</strong>
                    <p>/me 安排胸部 X 光檢查，確認有無吸入性肺炎 (Aspiration Pneumonia)</p>
                    <p>/me 戴上非再呼吸型氧氣面罩 (NRM)，設定高流量給氧</p>

                    <strong>2. 復甦後監測與穩定</strong>
                    <p>/me 密切觀察生命徵象 6-8 小時，監測有無遲發性肺水腫 (Dry Drowning) 徵兆</p>
                    <p>/me 執行神經學評估，定期檢查瞳孔光反應與 GCS 意識分級</p>
                    <p>/me 使用溫熱電毯並給予加溫輸液，將核心體溫緩慢回升至正常範圍</p>

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>遲發症狀監測：</strong> 出院後 24-48 小時內仍須防範「次發性溺水」，若出現持續咳嗽、呼吸急促或發燒請立即返診。</li>
                            <li><strong>呼吸休養：</strong> 保障充足休息，避免吸入二手菸或刺激性氣體，讓肺部組織充分修復。</li>
                            <li><strong>心理輔導：</strong> 溺水創傷可能引發創傷後壓力症狀 (PTSD)，若出現嚴重焦慮或恐水現象建議尋求心理諮詢。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
                    break;

                case "electric_shock_minimal":
                    content = `
    <div class="clinical-dashboard">
        <div class="status-header">
            <span class="status-badge" style="background: #ecc94b; color: #744210;">Quick Assessment</span>
            <h2>⚡ 觸電傷口與清創處置</h2>
        </div>
        <div class="dashboard-grid">
            <div class="panel pre-hospital">
                <h3>🚑 現場傷情辨識</h3>
                <ul>
                    <li>/me 迅速翻轉傷患肢體，尋找電流「入口(Entry)」與「出口(Exit)」傷點</li>
                    <li>/me 檢查傷口是否呈現焦黑或火山口狀，初步評估電流路徑</li>
                </ul>
            </div>
            <div class="panel in-hospital">
                <h3>🏥 臨床清創程序</h3>
                <div class="procedure-box">
                    <strong>1. 創面處置</strong>
                    <p>/me 使用生理食鹽水徹底沖洗進出口傷處，移除焦痂與壞死組織</p>
                    <p>/me 塗抹抗生素軟膏，並使用無菌紗布進行疏鬆包紮</p>

                    <!-- 院後衛教卡片區塊 -->
                    <div style="margin-top: 15px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 6px; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #facc15; font-size: 0.88rem; letter-spacing: 0.5px;">
                                📋 院後與出院衛教指南
                            </span>
                        </div>
                        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 0.85rem; line-height: 1.6;">
                            <li><strong>橫紋肌解離觀察：</strong> 密切注意尿液顏色，若排出<strong>茶色/醬油色尿液</strong>，為肌肉溶解徵痛，需立即前往急診大量輸液。</li>
                            <li><strong>心律變化：</strong> 電流可能影響心臟電傳導，若出院後感胸悶、心悸或頭暈，請立即回診做 EKG 心電圖檢查。</li>
                            <li><strong>進出口傷照護：</strong> 電灼傷易深層壞死，每日按時換藥並觀察皮膚溫差與神經麻木感。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
                    break;
                // ... 以此類推 ...
            }
            if (content) {
                injuryDetails.innerHTML = `<div class="mai-fade-in">${content}</div>`;
                currentLine = 0;
                scanCopyLines();
            }
        };
    }
})();