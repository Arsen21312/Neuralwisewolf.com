document.addEventListener('DOMContentLoaded', function() {
    const rawHtmlTextarea = document.getElementById('raw-html');
    const minifiedHtmlTextarea = document.getElementById('minified-html');
    const minifyBtn = document.getElementById('minify-btn');
    const originalSizeEl = document.getElementById('original-size');
    const minifiedSizeEl = document.getElementById('minified-size');
    const savedPercentageEl = document.getElementById('saved-percentage');
    const statsBar = document.getElementById('stats-bar');

    minifyBtn.addEventListener('click', () => {
        const rawHtml = rawHtmlTextarea.value;
        if (!rawHtml) {
            minifiedHtmlTextarea.value = '';
            statsBar.style.display = 'none';
            return;
        }
        
        const minifiedHtml = rawHtml
            .replace(//g, '') // Удаление HTML-комментариев
            .replace(/\s+/g, ' ') // Замена нескольких пробелов, табов и переносов на один пробел
            .replace(/>\s+</g, '><') // Удаление пробелов между тегами
            .trim(); // Удаление пробелов в начале и конце

        minifiedHtmlTextarea.value = minifiedHtml;

        const originalSize = new Blob([rawHtml]).size / 1024;
        const minifiedSize = new Blob([minifiedHtml]).size / 1024;
        const savedPercentage = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);

        originalSizeEl.textContent = `${originalSize.toFixed(2)} KB`;
        minifiedSizeEl.textContent = `${minifiedSize.toFixed(2)} KB`;
        savedPercentageEl.textContent = `${savedPercentage}%`;
        
        statsBar.style.display = 'flex';
    });
});