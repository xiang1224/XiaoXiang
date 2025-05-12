// 獲取所有的圖片容器
const images = document.querySelectorAll('.image-container img');

// 創建一個放大圖片的 Modal
const modal = document.createElement('div');
modal.id = 'image-modal';
document.body.appendChild(modal);

// 創建關閉按鈕
const closeBtn = document.createElement('button');
closeBtn.id = 'close-btn';
closeBtn.innerHTML = '×';
modal.appendChild(closeBtn);

// 當用戶點擊圖片時，顯示放大圖片
images.forEach(image => {
    image.addEventListener('click', () => {
        const largeImage = document.createElement('img');
        largeImage.src = image.src; // 使用原始圖片的 URL
        modal.innerHTML = ''; // 清空 Modal
        modal.appendChild(largeImage); // 添加放大的圖片
        modal.appendChild(closeBtn); // 再添加關閉按鈕
        modal.style.display = 'flex'; // 顯示 Modal
    });
});

// 當用戶點擊關閉按鈕時，隱藏放大圖片
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none'; // 隱藏 Modal
});
