document.addEventListener("DOMContentLoaded", function () {
    const injuryBtn = document.getElementById("injuryGuideBtn");
    const modal = document.getElementById("injuryModal");
    const closeBtn = modal.querySelector(".close");
    const injurySelect = document.getElementById("injurySelect");
    const injuryDetails = document.getElementById("injuryDetails");
    const vitalBtn = document.getElementById('vitalSignBtn');
    const vitalBox = document.getElementById('vitalSigns');

    // 開啟 modal
    injuryBtn.addEventListener("click", () => {
        modal.style.display = "block";  // 確保modal顯示
    });

    // 關閉 modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";  // 隱藏modal
    });

    // 點選 modal 外部也能關閉
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";  // 隱藏modal
        }
    });

    // 更新傷勢處置內容
    function updateInjuryDetails(content) {
        injuryDetails.innerHTML = content;  // 更新內容
        injuryDetails.classList.add("active");
        console.log("更新傷勢內容：", content);  // 確認顯示內容
    }

    // 當選擇項目變動時，更新傷勢處置內容
    injurySelect.addEventListener("change", function () {
        const selectedInjury = injurySelect.value;
        let content = "";

        console.log("選擇的傷勢類型:", selectedInjury);  // 輸出選擇的傷勢

        switch (selectedInjury) {
            case "bleeding":
                content = `
            <h3>🔴 出血(擦傷)處置</h3>
            <div class="treatment-steps">
                <h3>🩹 傷口處置流程</h3>
                <div class="treatment-section">
                    <h4>🏥 院外處置</h4>
                    <ul>
                        <li>/me 初步止血與傷口清潔</li>
                        <li>/me 使用無菌敷料覆蓋</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內處置</h4>
                    <ul>
                        <li>/me 消毒</li>
                        <li>/me 塗抹消炎藥膏</li>
                        <li>/me 蓋上紗布後貼牢</li>
                    </ul>
                </div>
            </div>
        `;
                break;
            case "fracture":
                content = `
            <h3>🦴 疑似骨折處置</h3>
            <div class="treatment-steps">
                <h3>🩹 傷口處置流程</h3>
                <div class="treatment-section">
                    <h4>🏥 院外處置</h4>
                    <ul>
                        <li>/me 使用固定板將骨頭固定</li>
                        <li>/me 使用無菌敷料覆蓋</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內檢查</h4>
                    <ul>
                        <li>/me 照攝x光</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 骨裂處置</h4>
                    <ul>
                        <li>/me 給予體外固定器</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 骨折處置</h4>
                    <ul>
                        <li>/me 上IV，吊上生理食鹽水</li>
                        <li>/me 清潔手術部位，裝上生理監測儀</li>
                        <li>/me 施打全身麻醉，並戴上氧氣面罩</li>
                        <li>/me 使用手術刀切開骨折部位周圍的皮膚</li>
                        <li>/me 使用撐開器撐開骨折部位，確保術野清晰</li>
                        <li>/me 清理傷口，移除碎骨及異物，避免感染</li>
                        <li>/me 使用鋼板和螺釘固定骨折部位，確保對位準確</li>
                        <li>/me 縫合血管與神經，確保血流與神經功能恢復</li>
                        <li>/me 將切口處的肌肉和組織依層縫合，減少術後併發症</li>
                        <li>/me 縫合皮膚表面，確保傷口閉合</li>
                        <li>/me 覆蓋無菌敷料，防止感染</li>
                        <li>/me 放置石膏或支架固定患肢，確保骨折部位穩定</li>
                    </ul>
                </div>
            </div>
        `;
                break;
            case "Aburn":
                content = `
            <h3>🔥 輕度燒燙傷處置</h3>
            <div class="treatment-steps">
                <h3>🩹 傷口處置流程</h3>
                <div class="treatment-section">
                    <h4>🏥 院外處置</h4>
                    <ul>
                        <li>/me 使用生理食鹽水將雜質沖走</li>
                        <li>/me 使用無菌敷料覆蓋</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內處置</h4>
                    <ul>
                        <li>/me 使用生理食鹽水將雜質沖走</li>
                        <li>/me 將水泡刺破</li>
                        <li>/me 塗抹燒燙傷藥膏</li>
                        <li>/me 使用無菌敷料包紮</li>
                    </ul>
                </div>
            </div>
        `;
                break;
            case "Bburn":
                content = `
            <h3>🔥🔥 重度燒燙傷處置</h3>
            <div class="treatment-steps">
                <h3>🩹 傷口處置流程</h3>
                <div class="treatment-section">
                    <h4>🏥 院外處置</h4>
                    <ul>
                        <li>/me 使用生理食鹽水將雜質沖走</li>
                        <li>/me 使用無菌敷料覆蓋</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內處置</h4>
                    <ul>
                        <li>/me 使用生理食鹽水將雜質沖走</li>
                        <li>/me 施打局部麻醉</li>
                        <li>/me 將水泡刺破</li>
                        <li>/me 清理燒傷區域，剪除壞死皮膚</li>
                        <li>/me 使用生理食鹽水與抗菌溶液沖洗燒傷部位</li>
                        <li>/me 使用無菌敷料覆蓋</li>
                        <li>/me 使用彈性繃帶固定燒傷包紮</li>
                    </ul>
                </div>
            </div>
        `;
                break;
            case "pneumothorax":
                content = `
            <h3>💨 氣胸 / 肋骨刺穿</h3>
            <div class="treatment-steps">
                <h3>🩹 傷口處置流程</h3>
                <div class="treatment-section">
                    <h4>🏥 院外處置</h4>
                    <ul>
                        <li>/me 以敷料堵住胸壁傷口</li>
                        <li>/me 用一支大號針刺入肋膜腔內</li>
                        <li>/me 滯留針並固定住</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內處置</h4>
                    <ul>
                        <li>/me 上IV，吊上生理食鹽水</li>
                        <li>/me 清潔手術部位，裝上生理監測儀</li>
                        <li>/me 放置氣管內管</li>
                        <li>/me 施打全身麻醉</li>
                        <li>/me 清理傷口周圍，避免細菌感染</li>
                        <li>/me 確認內臟損傷部位與範圍</li>
                        <li>/me 進行創口擴大，尋找刺入的異物，必要時進行小範圍切除或修補</li>
                        <li>/me 使用生理鹽水與抗生素溶液沖洗傷口，減少感染風險</li>
                        <li>/me 進行血管修補、縫合損傷的內臟或器官</li>
                        <li>/me 使用吸引器清理積血，確保手術視野清晰，防止血腫形成</li>
                        <li>/me 放置引流管，並觀察有無滲漏液體或血液</li>
                        <li>/me 縫合表皮</li>
                        <li>/me 使用無菌敷料包紮</li>
                    </ul>
                </div>
            </div>
        `;
                break;
            case "amputation":
                content = `
            <h3>🩸 肢體截斷處置</h3>
            <div class="treatment-steps">
                <h3>🩹 傷口處置流程</h3>
                <div class="treatment-section">
                    <h4>🏥 院外處置</h4>
                    <ul>
                        <li>/me 找到出血部位，立即使用止血帶綁於傷肢上方約5cm處</li>
                        <li>/me 使用無菌紗布包覆截斷的肢體，避免污染</li>
                        <li>/me 將斷肢放入乾淨塑膠袋密封，並貼上標籤（含時間與姓名）</li>
                        <li>/me 將密封袋外層放入含有冰水的容器中（避免直接接觸冰塊）</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內處置</h4>
                    <ul>
                        <li>/me 上IV，吊上生理食鹽水</li>
                        <li>/me 清潔手術部位，裝上生理監測儀</li>
                        <li>/me 放置氣管內管</li>
                        <li>/me 施打全身麻醉</li>
                        <li>/me 進行無菌消毒，鋪上無菌布，規劃手術切口範圍</li>
                        <li>/me 清創斷端壞死組織，修整斷緣，暴露神經、肌肉、血管與骨骼</li>
                        <li>/me 使用克氏針或骨板將骨折端對齊固定</li>
                        <li>/me 找出主要血管（動脈與靜脈），進行顯微血管吻合</li>
                        <li>/me 先吻合動脈以恢復血液灌流</li>
                        <li>/me 接續吻合靜脈，確保靜脈回流順暢</li>
                        <li>/me 使用顯微縫線精細縫合神經束</li>
                        <li>/me 修復肌腱與肌肉層</li>
                        <li>/me 進行皮膚與皮下縫合，覆蓋傷口</li>
                        <li>/me 包紮術區並使用夾板或支架固定患肢，避免張力影響癒合</li>
                    </ul>
                </div>
            </div>
        `;
                break;
            case "laceration":
                content = `
        <h3>✂️ 撕裂傷處置</h3>
        <div class="treatment-steps">
                <h3>🩹 傷口處置流程</h3>
                <div class="treatment-section">
                    <h4>🏥 院外處置</h4>
                    <ul>
                        <li>/me 初步止血與傷口清潔</li>
                        <li>/me 使用無菌敷料覆蓋</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內處置</h4>
                    <ul>
                        <li>/me 消毒</li>
                        <li>/me 施打局部麻醉</li>
                        <li>/me 開始縫合患部</li>
                        <li>/me 塗抹消炎藥膏</li>
                        <li>/me 蓋上紗布後貼牢</li>
                    </ul>
                </div>
            </div>
    `;
                break;
            case "gunshotGraze":
                content = `
        <h3> 💥 槍傷處置（擦過性）</h3>
            <div class="treatment-steps">
                <h3>🩹 傷口處置流程</h3>
                <div class="treatment-section">
                    <h4>🏥 院外處置</h4>
                    <ul>
                        <li>/me 初步止血與傷口清潔</li>
                        <li>/me 使用無菌敷料覆蓋</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內處置</h4>
                    <ul>
                        <li>/me 消毒</li>
                        <li>/me 施打局部麻醉</li>
                        <li>/me 開始縫合患部</li>
                        <li>/me 塗抹消炎藥膏</li>
                        <li>/me 蓋上紗布後貼牢</li>
                    </ul>
                </div>
            </div>
    `;
                break;
            case "gunshotPenetrating":
                content = `
        <h3>🔫 槍傷處置（遷入性）</h3>
        <div class="treatment-steps">
                <h3>🩹 傷口處置流程</h3>
                <div class="treatment-section">
                    <h4>🏥 院外處置</h4>
        <ul>
                        <li>/me 初步止血與傷口清潔</li>
                        <li>/me 使用無菌敷料覆蓋</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內檢查</h4>
                    <ul>
                        <li>/me 照攝x光，確認彈道及子彈位置</li>
                    </ul>
                </div>
                <div class="treatment-section">
                    <h4>🧑‍⚕️ 院內處置</h4>
                    <ul>
                        <li>/me 上IV，吊上生理食鹽水</li>
                        <li>/me 清潔手術部位，裝上生理監測儀</li>
                        <li>/me 施打全身麻醉，並戴上氧氣面罩</li>
                        <li>/me 切開傷口，擴大術野以尋找嵌入的子彈或碎片</li>
                        <li>/me 使用紗布吸收積血，確保手術視野清晰</li>
                        <li>/me 小心移除彈頭或碎裂金屬</li>
                        <li>/me 使用生理鹽水與抗生素溶液沖洗傷口</li>
                        <li>/me 進行血管修補，確保供血正常</li>
                        <li>/me 進行軟組織縫合</li>
                        <li>/me 使用無菌敷料包紮</li>
                    </ul>
                </div>
            </div>
    `;
                break;

                break;
            default:
                content = `<p>請選擇一個傷勢類型。</p>`;
        }


        // 更新傷勢處置區域
        updateInjuryDetails(content);

        // 顯示 modal
        modal.style.display = "block";  // 確保顯示模態
    });

    // 預設選擇後立即更新內容並顯示 modal
    if (injurySelect.value) {
        injurySelect.dispatchEvent(new Event("change"));
    }
    vitalBtn.addEventListener('click', () => {
        vitalBox.style.display = vitalBox.style.display === 'block' ? 'none' : 'block';
    });
});
