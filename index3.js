function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    const toggleBtn = document.querySelector('.toggle-btn');

    if (sidebar.style.left === '-250px') {
        sidebar.style.left = '0';
        content.style.marginLeft = '250px';
        toggleBtn.style.left = '250px';
    } else {
        sidebar.style.left = '-250px';
        content.style.marginLeft = '0';
        toggleBtn.style.left = '0';
    }
}

// 初始時側邊導航
document.getElementById('sidebar').style.left = '-250px';
document.querySelector('.content').style.marginLeft = '1';
document.querySelector('.toggle-btn').style.left = '1';

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    const toggleBtn = document.querySelector('.toggle-btn');
    const imageGallery = document.getElementById('image-gallery');
    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');
    const searchInput = document.querySelector('input[name="search"]'); // 假设你的搜索框有name="search"
    let currentPage = 1;
    const imagesPerPage = 10;
    let totalImages = 50; // 假设总共有50张图片，这可能会根据搜索结果变化
    let totalPages = Math.ceil(totalImages / imagesPerPage);
    let checkedState = {};
    let searchResultIndexes = []; // 用于保存搜索结果的索引

    const imageLabels = [
        "tiggo red", "rio black", "rio blue", "matiz black", "tiggo red",
        "rio black", "tiggo red", "tiggo black", "matiz red", "tiggo blue",
        "matiz red", "rio black", "rio blue", "tiggo blue", "rio red",
        "matiz blue", "matiz blue", "matiz blue", "rio red", "rio red",
        "rio red", "matiz red", "rio blue", "matiz blue", "matiz red",
        "rio red", "matiz red", "rio blue", "matiz red", "tiggo black",
        "rio blue", "tiggo black", "tiggo blue", "rio red", "tiggo black",
        "rio black", "tiggo blue", "matiz blue", "matiz blue", "tiggo blue",
        "tiggo black", "rio black", "rio blue", "rio black", "tiggo black",
        "rio red", "rio black", "matiz black", "rio black", "rio blue"
    ];

    function searchImages() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        // 如果搜索框为空，显示所有图片
        if (!searchTerm) {
            searchResultIndexes = imageLabels.map((_, index) => index); // 重置为所有索引
        } else {
            // 过滤出包含关键字的图片索引
            searchResultIndexes = imageLabels
                .map((label, index) => label.toLowerCase().includes(searchTerm) ? index : -1)
                .filter(index => index !== -1);
        }
        // 重置当前页和总页数
        currentPage = 1;
        totalImages = searchResultIndexes.length;
        totalPages = Math.ceil(totalImages / imagesPerPage);
        loadImages(currentPage);
    }

    // 修改loadImages函数，根据searchResultIndexes加载图片
    function loadImages(page) {
        imageGallery.innerHTML = ''; // 清除当前的图片
        const start = (page - 1) * imagesPerPage;
        const end = Math.min(start + imagesPerPage, searchResultIndexes.length); // 确保不超出范围
        for (let i = start; i < end; i++) {
            const index = searchResultIndexes[i];
            const label = imageLabels[index];
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.innerHTML = `
                <label>${label}</label>
                <img src="car/${index}.jpg" alt="${label}">
                <input type="checkbox" data-index="${index}" ${checkedState[index] ? 'checked' : ''}>
            `;
            imageGallery.appendChild(imageItem);
        }
    }

    document.querySelector('form[action="/search"]').addEventListener('submit', function (event) {
        event.preventDefault(); // 阻止表单默认提交行为
        searchImages(); // 调用搜索功能
    });

    // 初始化
    searchImages(); // 用于初始化，显示所有图片

    imageGallery.addEventListener('change', function (event) {
        if (event.target.type === 'checkbox') {
            const index = event.target.getAttribute('data-index');
            checkedState[index] = event.target.checked; // 更新选中状态
        }
    });

    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadImages(currentPage);
        }
    });

    nextPage.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadImages(currentPage);
        }
    });

    document.getElementById('show-selected-images').addEventListener('click', function () {
        displaySelectedImages();
    });

    function displaySelectedImages() {
        const selectedIndexes = Object.keys(checkedState).filter(index => checkedState[index]);

        imageGallery.innerHTML = ''; // 清除当前的图片展示
        selectedIndexes.forEach(index => {
            const label = imageLabels[index];
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.innerHTML = `
                <label>${label}</label>
                <img src="car/${index}.jpg" alt="${label}">
                <input type="checkbox" data-index="${index}" ${checkedState[index] ? 'checked' : ''}>
            `;
            imageGallery.appendChild(imageItem);
        });

        // 重置checkedState以便下次点击时不重复显示相同的图片
        checkedState = {};

        // 重置选中状态
        document.querySelectorAll('#image-gallery .image-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // 由于显示的是选中的图片，可能不需要分页，所以隐藏分页按钮
        document.getElementById('pagination').style.display = 'none';
    }

    function displaySelectedImages() {
        // 检查是否有图片被选中
        const selectedIndexes = Object.keys(checkedState).filter(index => checkedState[index]);
        if (selectedIndexes.length === 0) {
            alert('請選取圖片');
            return; // 如果没有图片被选中，就不进行后续操作
        }

        // 隐藏搜索栏、搜索标题、分页按钮和“显示预选的图片”按钮
        document.querySelector('.search-container').style.display = 'none';
        document.querySelector('h1').style.display = 'none'; // 隐藏“搜尋您想尋找的圖片”标题
        document.getElementById('pagination').style.display = 'none';
        document.getElementById('show-selected-images').style.display = 'none';

        // 显示新的提示文字
        const selectionPrompt = document.createElement('h2');
        selectionPrompt.innerText = '請選擇其中的一張圖片';
        // 清除之前可能存在的提示，避免重复
        const existingPrompt = document.querySelector('.selection-prompt');
        if (existingPrompt) existingPrompt.remove();
        selectionPrompt.className = 'selection-prompt';
        imageGallery.before(selectionPrompt);

        // 显示预选的图片
        imageGallery.innerHTML = '';
        selectedIndexes.forEach(index => {
            const label = imageLabels[index];
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.innerHTML = `
                <label>${label}</label>
                <img src="car/${index}.jpg" alt="${label}">
                <input type="checkbox" data-index="${index}">
            `;
            imageGallery.appendChild(imageItem);
        });

        // 添加“显示最终选择的图片”按钮，先清除已存在的按钮避免重复
        const existingFinalSelectionButton = document.querySelector('.final-selection-button');
        if (existingFinalSelectionButton) existingFinalSelectionButton.remove();
        const finalSelectionButton = document.createElement('button');
        finalSelectionButton.className = 'final-selection-button';
        finalSelectionButton.innerText = '顯示最終選擇的圖片';
        imageGallery.after(finalSelectionButton);

        finalSelectionButton.addEventListener('click', () => {
            const selected = document.querySelectorAll('#image-gallery .image-item input[type="checkbox"]:checked');
            if (selected.length === 0) {
                alert('請選擇一張圖片');
            } else if (selected.length > 1) {
                alert('只能選擇一張圖片');
            } else {
                displayFinalImage(selected[0].getAttribute('data-index'));
            }
            // 重置checkedState和复选框状态
            resetCheckedStateAndCheckboxes();
        });
    }

    function resetCheckedStateAndCheckboxes() {
        Object.keys(checkedState).forEach(key => {
            checkedState[key] = false;
        });
        document.querySelectorAll('#image-gallery .image-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    function displayFinalImage(index) {
        const label = imageLabels[index];
        imageGallery.innerHTML = `
            <div class="image-item">
                <label>${label}</label>
                <img src="car/${index}.jpg" alt="${label}">
            </div>
        `;

        // 创建并显示返回按钮，移除之前的按钮和提示
        const backButton = document.createElement('button');
        backButton.innerText = '返回';
        const existingPrompt = document.querySelector('.selection-prompt');
        const existingFinalSelectionButton = document.querySelector('.final-selection-button');
        existingPrompt?.remove();
        existingFinalSelectionButton?.remove();
        imageGallery.after(backButton);

        backButton.addEventListener('click', () => {
            document.location.reload(); // 或者可以使用其他逻辑来恢复初始界面状态
        });
    }

});