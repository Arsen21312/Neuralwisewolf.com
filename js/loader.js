// CONFIG - АБСОЛЮТНЫЕ ПУТИ!
const CONFIG = {
    fragmentsPath: '/fragments/',
    toolsDataPath: '/data/tools.json'
};

// Главная функция загрузки фрагментов
async function loadFragment(selector, fileName) {
    const element = document.querySelector(`[data-include="${selector}"]`);
    if (!element) {
        console.warn(`Элемент [data-include="${selector}"] не найден`);
        return;
    }

    try {
        const response = await fetch(`${CONFIG.fragmentsPath}${fileName}`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        element.innerHTML = await response.text();
        console.log(`✅ Фрагмент "${selector}" загружен`);
        
        // После загрузки фрагмента инициализируем его логику
        if (selector === 'sidebar') {
            initSidebarLogic();
        } else if (selector === 'related') {
            initRelatedTools();
        }
        
    } catch (error) {
        console.error(`❌ Ошибка загрузки "${selector}":`, error);
        element.innerHTML = `<!-- Ошибка загрузки ${selector} -->`;
    }
}

// Загрузка данных инструментов
async function loadToolsData() {
    try {
        const response = await fetch(CONFIG.toolsDataPath);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Ошибка загрузки tools.json:', error);
        return { tools: [], categories: {} };
    }
}

// Инициализация логики сайдбара
async function initSidebarLogic() {
    const sideGrid = document.getElementById('sideGrid');
    if (!sideGrid) return;
    
    try {
        const data = await loadToolsData();
        const tools = data.tools || [];
        populateSidebar(tools);
        setupSidebarSearch(tools);
        
    } catch (error) {
        console.error('Ошибка инициализации сайдбара:', error);
        sideGrid.innerHTML = '<div class="muted">Не удалось загрузить инструменты</div>';
    }
}

// Заполнение сайдбара инструментами
function populateSidebar(tools) {
    const sideGrid = document.getElementById('sideGrid');
    if (!sideGrid) return;
    
    const categories = {
        'math': { name: '🧮 Математика и числа', tools: [] },
        'convert': { name: '📏 Конвертеры и измерения', tools: [] },
        'text': { name: '✍️ Текстовые инструменты', tools: [] },
        'dev': { name: '👩‍💻 Разработчику', tools: [] },
        'random': { name: '🎲 Рандом и генераторы', tools: [] },
        'life': { name: '📊 Быт и продуктивность', tools: [] },
        'fun': { name: '🧩 Разное и fun', tools: [] }
    };
    
    // Сортируем инструменты по категориям
    tools.forEach(tool => {
        if (categories[tool.category]) {
            categories[tool.category].tools.push(tool);
        }
    });
    
    // Генерируем HTML
    sideGrid.innerHTML = Object.entries(categories)
        .map(([categoryId, category]) => {
            if (category.tools.length === 0) return '';
            
            const toolsList = category.tools
                .slice(0, 6)
                .map(tool => `
                    <a href="/tools/${tool.slug}.html" class="sidebar-tool">
                        <span class="tool-icon">${tool.icon}</span>
                        <span class="tool-title">${tool.title}</span>
                        ${tool.popular ? '<span class="tool-badge popular">🔥</span>' : ''}
                        ${tool.new ? '<span class="tool-badge new">🆕</span>' : ''}
                    </a>
                `).join('');
            
            return `
                <div class="side-cat">
                    <h4>${category.name}</h4>
                    ${toolsList}
                    ${category.tools.length > 6 ? 
                        `<a href="/index.html?category=${categoryId}" class="see-all">
                            Все инструменты →
                        </a>` : ''}
                </div>
            `;
        })
        .join('');
}

// Настройка поиска в сайдбаре
function setupSidebarSearch(tools) {
    const searchInput = document.getElementById('sideSearch');
    const categorySelect = document.getElementById('sideCat');
    
    if (!searchInput || !categorySelect) return;
    
    const filterTools = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        
        document.querySelectorAll('.side-cat').forEach(cat => {
            let visibleTools = 0;
            
            cat.querySelectorAll('.sidebar-tool').forEach(tool => {
                const title = tool.querySelector('.tool-title').textContent.toLowerCase();
                const shouldShow = 
                    (category === '' || tool.closest('.side-cat').dataset.category === category) &&
                    (searchTerm === '' || title.includes(searchTerm));
                
                tool.style.display = shouldShow ? 'flex' : 'none';
                if (shouldShow) visibleTools++;
            });
            
            cat.style.display = visibleTools > 0 ? 'block' : 'none';
        });
    };
    
    searchInput.addEventListener('input', filterTools);
    categorySelect.addEventListener('change', filterTools);
}

// Инициализация похожих инструментов
async function initRelatedTools() {
    const relatedGrid = document.getElementById('related-tools-grid');
    if (!relatedGrid) return;
    
    // Получаем текущую категорию и slug
    const mainElement = document.querySelector('main[data-category][data-slug]');
    if (!mainElement) return;
    
    const currentCategory = mainElement.dataset.category;
    const currentSlug = mainElement.dataset.slug;
    
    try {
        const data = await loadToolsData();
        const tools = data.tools || [];
        
        // Фильтруем инструменты: той же категории, кроме текущего
        const relatedTools = tools
            .filter(tool => tool.category === currentCategory && tool.slug !== currentSlug)
            .slice(0, 4);
        
        displayRelatedTools(relatedTools);
        
    } catch (error) {
        console.error('Ошибка загрузки похожих инструментов:', error);
        showRelatedError();
    }
    
    function displayRelatedTools(tools) {
        if (tools.length === 0) {
            showRelatedEmpty();
            return;
        }
        
        relatedGrid.innerHTML = tools.map(tool => `
            <a href="/tools/${tool.slug}.html" class="related-card">
                ${tool.popular ? '<span class="related-badge badge-popular">Популярный</span>' : ''}
                ${tool.new ? '<span class="related-badge badge-new">Новый</span>' : ''}
                
                <div class="related-icon">${tool.icon || '🐺'}</div>
                
                <div class="related-content">
                    <div class="related-title">${tool.title}</div>
                    <p class="related-desc">${tool.description || ''}</p>
                </div>
            </a>
        `).join('');
    }
    
    function showRelatedEmpty() {
        relatedGrid.innerHTML = `
            <div class="related-loading">
                <span>Пока нет похожих инструментов</span>
                <a href="/" class="btn btn-primary">Смотреть все инструменты</a>
            </div>
        `;
    }
    
    function showRelatedError() {
        relatedGrid.innerHTML = `
            <div class="related-loading">
                <span>Не удалось загрузить похожие инструменты</span>
                <a href="/" class="btn btn-secondary">Перейти на главную</a>
            </div>
        `;
    }
}

// Инициализация бокового меню (открытие/закрытие)
function initSidebar() {
    const openBtn = document.getElementById('openMenu');
    const closeBtn = document.getElementById('closeMenu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (!openBtn || !sidebar) return;
    
    const toggleMenu = (isOpen) => {
        sidebar.classList.toggle('open', isOpen);
        if (overlay) overlay.classList.toggle('show', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        sidebar.setAttribute('aria-hidden', !isOpen);
    };
    
    openBtn.addEventListener('click', () => toggleMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
    
    if (overlay) {
        overlay.addEventListener('click', () => toggleMenu(false));
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleMenu(false);
    });
}

// Синхронизация поиска
function syncSearch() {
    const mainSearch = document.getElementById('q');
    const sideSearch = document.getElementById('sideSearch');
    const mainCategory = document.getElementById('cat');
    const sideCategory = document.getElementById('sideCat');

    if (mainSearch && sideSearch) {
        mainSearch.addEventListener('input', (e) => {
            sideSearch.value = e.target.value;
            sideSearch.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    if (mainCategory && sideCategory) {
        mainCategory.addEventListener('change', (e) => {
            sideCategory.value = e.target.value;
            sideCategory.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }
    
    if (sideSearch && mainSearch) {
        sideSearch.addEventListener('input', (e) => {
            mainSearch.value = e.target.value;
            mainSearch.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }

    if (sideCategory && mainCategory) {
        sideCategory.addEventListener('change', (e) => {
            mainCategory.value = e.target.value;
            mainCategory.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }
}

// Базовая инициализация
async function initApp() {
    console.log('🐺 Инициализация Neural Wise Wolf...');
    
    // Загружаем основные части сайта
    await Promise.allSettled([
        loadFragment('header', 'header.html'),
        loadFragment('sidebar', 'sidebar.html'),
        loadFragment('footer', 'footer.html'),
        loadFragment('related', 'related.html')
    ]);
    
    // Инициализируем функциональность
    initSidebar();
    syncSearch();
    
    // Если мы на главной - настраиваем поиск
    if (document.getElementById('toolsGrid')) {
        const data = await loadToolsData();
        if (data.tools) {
            setupSearch(data.tools);
        }
    }
    
    console.log('✅ Приложение инициализировано');
}

// Запускаем приложение
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Функция поиска для главной страницы (остается без изменений)
function setupSearch(tools) {
    const searchInput = document.getElementById('mainSearch');
    const toolsGrid = document.getElementById('toolsGrid');
    
    if (!searchInput || !toolsGrid) return;

    function filterTools(searchTerm = '') {
        const term = searchTerm.toLowerCase().trim();
        const filtered = tools.filter(tool => {
            const searchString = `${tool.title} ${tool.description} ${tool.keywords}`.toLowerCase();
            return searchString.includes(term);
        });

        displayTools(filtered);
    }

    function displayTools(toolsToShow) {
        if (toolsToShow.length === 0) {
            toolsGrid.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center;">
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить поисковый запрос</p>
                </div>
            `;
            return;
        }

        toolsGrid.innerHTML = toolsToShow.map(tool => `
            <a href="/tools/${tool.slug}.html" class="card tool-card">
                ${tool.popular ? '<span class="card-badge popular">Популярный</span>' : ''}
                ${tool.new ? '<span class="card-badge new">Новый</span>' : ''}
                <div class="card-icon">${tool.icon}</div>
                <h3>${tool.title}</h3>
                <p>${tool.description}</p>
            </a>
        `).join('');
    }

    searchInput.addEventListener('input', (e) => {
        filterTools(e.target.value);
    });

    filterTools();

    window.initRelated = async function initRelated(containerEl, category, jsonUrl){
  try {
    const url = jsonUrl || (location.pathname.startsWith('/tools/'))
      ? '../data/tools.json' : '/data/tools.json';
    const res = await fetch(url, {cache:'no-store'});
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const tools = (data.tools||[]).filter(t=>t.category===category).slice(0,4);

    containerEl.querySelector('#related-tools-grid').innerHTML = tools.map(t => `
      <a href="/tools/${t.slug}.html" class="related-card">
        <div class="related-card-top">
          ${t.popular?'<span class="tool-badge popular">🔥 Популярный</span>':''}
          ${t.new?'<span class="tool-badge new">🆕 Новый</span>':''}
        </div>
        <h4 class="tool-title">${t.title}</h4>
        <p class="tool-desc">${t.description}</p>
      </a>
    `).join('');
  } catch(e){
    console.error('related error:', e);
    containerEl.querySelector('#related-tools-grid').innerHTML =
      '<div class="muted">Не удалось загрузить похожие инструменты</div>';
  }
}

function toTarget({sign,intVal,frac}, base, precision, trimZeros, grouping){
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // --- integer ---
  let n = intVal < 0n ? -intVal : intVal;
  let intStr = (n===0n) ? '0' : '';
  while(n>0n){ const r = n % BigInt(base); intStr = digits[Number(r)] + intStr; n /= BigInt(base); }
  if(sign<0 && !(intStr==='0' && frac===0)) intStr = '-' + intStr;

  // --- fraction ---
  let fr = frac, fracStr = '';
  for(let i=0;i<precision;i++){
    fr *= base;
    const d = Math.floor(fr + 1e-14);
    fracStr += digits[d]; fr -= d;
    if(fr<=1e-15) break;
  }
  if(trimZeros) fracStr = fracStr.replace(/0+$/,'');

  // --- grouping: только для base 10 ---
  if(grouping && base===10){
    const neg = intStr.startsWith('-'); const core = neg ? intStr.slice(1) : intStr;
    const grouped = core.replace(/\B(?=(\d{3})+(?!\d))/g,' ');
    intStr = neg ? '-' + grouped : grouped;
  }

  return fracStr ? intStr + '.' + fracStr : intStr;
}

}
