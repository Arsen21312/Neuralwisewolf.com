document.addEventListener('DOMContentLoaded', function() {
    const daySelect = document.getElementById('day');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const findBtn = document.getElementById('find-btn');
    const loading = document.getElementById('loading');
    const resultCard = document.getElementById('result-card');
    const zodiacGrid = document.getElementById('zodiac-grid');
    const shareVk = document.getElementById('share-vk');
    const shareTg = document.getElementById('share-tg');
    const copyLink = document.getElementById('copy-link');

    // Данные о знаках зодиака
    const zodiacData = {
        aries: {
            name: 'Овен',
            dates: '21 марта - 19 апреля',
            icon: '♈',
            element: 'Огонь',
            planet: 'Марс',
            stones: 'Алмаз, рубин, гранат',
            description: 'Энергичный, уверенный в себе, импульсивный, целеустремленный. Овны любят challenges и всегда готовы к действию.',
            compatibility: {
                leo: {
                    score: 90,
                    type: 'good'
                },
                sagittarius: {
                    score: 85,
                    type: 'good'
                },
                gemini: {
                    score: 75,
                    type: 'average'
                },
                cancer: {
                    score: 40,
                    type: 'poor'
                }
            }
        },
        taurus: {
            name: 'Телец',
            dates: '20 апреля - 20 мая',
            icon: '♉',
            element: 'Земля',
            planet: 'Венера',
            stones: 'Изумруд, сапфир, розовый кварц',
            description: 'Надежный, практичный, терпеливый, чувственный. Тельцы ценят комфорт и стабильность.',
            compatibility: {
                virgo: {
                    score: 88,
                    type: 'good'
                },
                capricorn: {
                    score: 82,
                    type: 'good'
                },
                cancer: {
                    score: 78,
                    type: 'average'
                },
                leo: {
                    score: 45,
                    type: 'poor'
                }
            }
        },
        gemini: {
            name: 'Близнецы',
            dates: '21 мая - 20 июня',
            icon: '♊',
            element: 'Воздух',
            planet: 'Меркурий',
            stones: 'Агат, изумруд, хризопраз',
            description: 'Общительный, любознательный, адаптивный, умный. Близнецы легко находят общий язык с любым человеком.',
            compatibility: {
                libra: {
                    score: 92,
                    type: 'good'
                },
                aquarius: {
                    score: 87,
                    type: 'good'
                },
                aries: {
                    score: 75,
                    type: 'average'
                },
                scorpio: {
                    score: 35,
                    type: 'poor'
                }
            }
        },
        cancer: {
            name: 'Рак',
            dates: '21 июня - 22 июля',
            icon: '♋',
            element: 'Вода',
            planet: 'Луна',
            stones: 'Жемчуг, изумруд, лунный камень',
            description: 'Эмоциональный, заботливый, интуитивный, преданный. Раки очень привязаны к дому и семье.',
            compatibility: {
                scorpio: {
                    score: 95,
                    type: 'good'
                },
                pisces: {
                    score: 90,
                    type: 'good'
                },
                taurus: {
                    score: 78,
                    type: 'average'
                },
                aries: {
                    score: 40,
                    type: 'poor'
                }
            }
        },
        leo: {
            name: 'Лев',
            dates: '23 июля - 22 августа',
            icon: '♌',
            element: 'Огонь',
            planet: 'Солнце',
            stones: 'Рубин, янтарь, топаз',
            description: 'Харизматичный, уверенный, щедрый, лидер. Львы любят быть в центре внимания и вести за собой.',
            compatibility: {
                aries: {
                    score: 90,
                    type: 'good'
                },
                sagittarius: {
                    score: 85,
                    type: 'good'
                },
                libra: {
                    score: 80,
                    type: 'average'
                },
                taurus: {
                    score: 45,
                    type: 'poor'
                }
            }
        },
        virgo: {
            name: 'Дева',
            dates: '23 августа - 22 сентября',
            icon: '♍',
            element: 'Земля',
            planet: 'Меркурий',
            stones: 'Сапфир, яшма, сердолик',
            description: 'Аналитичный, трудолюбивый, практичный, внимательный к деталям. Девы стремятся к совершенству во всем.',
            compatibility: {
                taurus: {
                    score: 88,
                    type: 'good'
                },
                capricorn: {
                    score: 85,
                    type: 'good'
                },
                cancer: {
                    score: 75,
                    type: 'average'
                },
                gemini: {
                    score: 50,
                    type: 'poor'
                }
            }
        },
        libra: {
            name: 'Весы',
            dates: '23 сентября - 22 октября',
            icon: '♎',
            element: 'Воздух',
            planet: 'Венера',
            stones: 'Опал, лазурит, аквамарин',
            description: 'Дипломатичный, справедливый, общительный, элегантный. Весы ищут гармонию и баланс во всем.',
            compatibility: {
                gemini: {
                    score: 92,
                    type: 'good'
                },
                aquarius: {
                    score: 88,
                    type: 'good'
                },
                leo: {
                    score: 80,
                    type: 'average'
                },
                cancer: {
                    score: 40,
                    type: 'poor'
                }
            }
        },
        scorpio: {
            name: 'Скорпион',
            dates: '23 октября - 21 ноября',
            icon: '♏',
            element: 'Вода',
            planet: 'Плутон, Марс',
            stones: 'Топаз, гранат, опал',
            description: 'Страстный, решительный, загадочный, интуитивный. Скорпионы обладают сильной волей и глубокими чувствами.',
            compatibility: {
                cancer: {
                    score: 95,
                    type: 'good'
                },
                pisces: {
                    score: 90,
                    type: 'good'
                },
                virgo: {
                    score: 70,
                    type: 'average'
                },
                gemini: {
                    score: 35,
                    type: 'poor'
                }
            }
        },
        sagittarius: {
            name: 'Стрелец',
            dates: '22 ноября - 21 декабря',
            icon: '♐',
            element: 'Огонь',
            planet: 'Юпитер',
            stones: 'Бирюза, топаз, сапфир',
            description: 'Оптимистичный, свободолюбивый, философ, честный. Стрельцы всегда ищут приключения и новые знания.',
            compatibility: {
                leo: {
                    score: 85,
                    type: 'good'
                },
                aries: {
                    score: 80,
                    type: 'good'
                },
                libra: {
                    score: 75,
                    type: 'average'
                },
                virgo: {
                    score: 40,
                    type: 'poor'
                }
            }
        },
        capricorn: {
            name: 'Козерог',
            dates: '22 декабря - 19 января',
            icon: '♑',
            element: 'Земля',
            planet: 'Сатурн',
            stones: 'Гранат, оникс, малахит',
            description: 'Амбициозный, дисциплинированный, ответственный, терпеливый. Козероги стремятся к успеху и стабильности.',
            compatibility: {
                virgo: {
                    score: 85,
                    type: 'good'
                },
                taurus: {
                    score: 82,
                    type: 'good'
                },
                scorpio: {
                    score: 70,
                    type: 'average'
                },
                libra: {
                    score: 50,
                    type: 'poor'
                }
            }
        },
        aquarius: {
            name: 'Водолей',
            dates: '20 января - 18 февраля',
            icon: '♒',
            element: 'Воздух',
            planet: 'Уран, Сатурн',
            stones: 'Аметист, аквамарин, сапфир',
            description: 'Оригинальный, независимый, гуманный, интеллектуальный. Водолеи ценят свободу и стремятся к новому.',
            compatibility: {
                gemini: {
                    score: 87,
                    type: 'good'
                },
                libra: {
                    score: 88,
                    type: 'good'
                },
                aries: {
                    score: 70,
                    type: 'average'
                },
                taurus: {
                    score: 40,
                    type: 'poor'
                }
            }
        },
        pisces: {
            name: 'Рыбы',
            dates: '19 февраля - 20 марта',
            icon: '♓',
            element: 'Вода',
            planet: 'Нептун, Юпитер',
            stones: 'Аквамарин, лунный камень, аметист',
            description: 'Мечтательный, сострадательный, интуитивный, творческий. Рыбы обладают богатым внутренним миром.',
            compatibility: {
                cancer: {
                    score: 90,
                    type: 'good'
                },
                scorpio: {
                    score: 92,
                    type: 'good'
                },
                capricorn: {
                    score: 75,
                    type: 'average'
                },
                leo: {
                    score: 45,
                    type: 'poor'
                }
            }
        },
    };

    // Заполняем дни
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }

    // Заполняем годы (от 1900 до текущего года)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    findBtn.addEventListener('click', findZodiac);

    function findZodiac() {
        const day = parseInt(daySelect.value);
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);

        if (!day || !month || !year) {
            alert('Пожалуйста, выберите полную дату рождения');
            return;
        }

        loading.style.display = 'block';
        resultCard.style.display = 'none';

        // Имитация загрузки
        setTimeout(() => {
            const zodiac = calculateZodiac(day, month);
            displayZodiacResult(zodiac);
            loading.style.display = 'none';
            resultCard.style.display = 'block';
        }, 1000);
    }

    function calculateZodiac(day, month) {
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
    }

    function displayZodiacResult(zodiacKey) {
        const zodiac = zodiacData[zodiacKey];
        if (!zodiac) {
            alert('Знак зодиака не найден. Проверьте дату.');
            return;
        }

        document.getElementById('zodiac-icon').textContent = zodiac.icon;
        document.getElementById('zodiac-name').textContent = zodiac.name;
        document.getElementById('zodiac-dates').textContent = zodiac.dates;
        document.getElementById('zodiac-description').textContent = zodiac.description;
        document.getElementById('zodiac-planet').textContent = zodiac.planet;
        document.getElementById('zodiac-element').textContent = zodiac.element;
        document.getElementById('zodiac-stones').textContent = zodiac.stones;

        const compatGrid = document.getElementById('compatibility-grid');
        compatGrid.innerHTML = '';

        for (const [sign, data] of Object.entries(zodiac.compatibility)) {
            const compatItem = document.createElement('div');
            compatItem.className = `compat-item ${data.type}`;

            compatItem.innerHTML = `
                <div class="compat-icon">${zodiacData[sign].icon}</div>
                <div class="compat-name">${zodiacData[sign].name}</div>
                <div class="compat-score">${data.score}%</div>
            `;

            compatGrid.appendChild(compatItem);
        }

        // Обновляем URL для возможности поделиться
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('sign', zodiacKey);
        history.replaceState(null, '', `?${urlParams.toString()}`);

        const shareUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}?sign=${zodiacKey}`);
        const shareText = encodeURIComponent(`Я ${zodiac.name}! Узнайте свой знак зодиака на Neural Wise Wolf.`);

        shareVk.href = `https://vk.com/share.php?url=${shareUrl}&title=${shareText}`;
        shareTg.href = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
    }

    // Инициализация сетки всех знаков зодиака
    function initZodiacGrid() {
        for (const [key, zodiac] of Object.entries(zodiacData)) {
            const item = document.createElement('div');
            item.className = 'zodiac-item';
            item.onclick = () => {
                displayZodiacResult(key);
                resultCard.style.display = 'block';
                resultCard.scrollIntoView({
                    behavior: 'smooth'
                });
            };

            item.innerHTML = `
                <div class="zodiac-item-icon">${zodiac.icon}</div>
                <div class="zodiac-item-name">${zodiac.name}</div>
                <div class="zodiac-item-dates">${zodiac.dates}</div>
            `;

            zodiacGrid.appendChild(item);
        }
    }

    // Обработка прямого перехода по URL с параметром знака
    function handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const sign = urlParams.get('sign');
        if (sign && zodiacData[sign]) {
            displayZodiacResult(sign);
            resultCard.style.display = 'block';
        }
    }

    initZodiacGrid();
    handleUrlParams();

    // Функционал копирования ссылки
    copyLink.addEventListener('click', function(e) {
        e.preventDefault();
        const fullUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
            showCopyNotification('Ссылка скопирована в буфер обмена');
        });
    });

    function showCopyNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification show';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
});