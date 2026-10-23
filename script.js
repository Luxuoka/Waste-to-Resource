document.addEventListener('DOMContentLoaded', () => {

    const themeToggleBtn = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.textContent = '🌙';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.textContent = '☀️';
            }
        });
    }

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#tutorialGrid .card');

    if (filterBtns.length > 0 && cards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                cards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput && cards.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();

            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                if (title.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    const lokasiItems = document.querySelectorAll('.lokasi-item');
    const mapCards = document.querySelectorAll('.map-card');

    if (lokasiItems.length > 0) {
        lokasiItems.forEach(item => {
            item.addEventListener('click', () => {
                lokasiItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const targetId = item.getAttribute('data-target');
                if (targetId && mapCards.length > 0) {
                    mapCards.forEach(card => card.classList.remove('active'));
                    const targetCard = document.getElementById(targetId);
                    if (targetCard) {
                        targetCard.classList.add('active');
                        // Scroll halus pada layar hp jika diperlukan
                        if (window.innerWidth <= 768) {
                            targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }
                }
            });
        });
    }

    // Klik Vid Fullscreen
    const tutorialVideos = document.querySelectorAll('.card-video');
    tutorialVideos.forEach(video => {
        video.addEventListener('click', () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (video.requestFullscreen) {
                    video.requestFullscreen().catch(err => {
                        console.warn("Fullscreen request:", err);
                    });
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                }

                if (video.paused) {
                    video.play();
                }
            }
        });
    });

    // Fullscreen Galeri
    const galeriItems = document.querySelectorAll('.item-galeri');
    const lightboxModal = document.getElementById('galeriModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (galeriItems.length > 0 && lightboxModal && lightboxImg) {
        let currentIndex = 0;
        const totalItems = galeriItems.length;

        // data gambar dan judul dri item galeri
        const galleryData = Array.from(galeriItems).map(item => {
            const img = item.querySelector('.card-img');
            const title = item.querySelector('h3');
            return {
                src: img ? img.getAttribute('src') : '',
                alt: img ? img.getAttribute('alt') : '',
                title: title ? title.textContent.trim() : (img ? img.getAttribute('alt') : '')
            };
        });

        function showLightbox(index) {
            if (index < 0) index = totalItems - 1;
            if (index >= totalItems) index = 0;
            currentIndex = index;

            const item = galleryData[currentIndex];
            if (!item) return;

            lightboxImg.src = item.src;
            lightboxImg.alt = item.alt;
            if (lightboxCaption) lightboxCaption.textContent = item.title;
            if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${totalItems}`;

            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (!lightboxModal.classList.contains('active')) {
                    lightboxImg.src = '';
                }
            }, 250);
        }

        function prevImage() {
            showLightbox(currentIndex - 1);
        }

        function nextImage() {
            showLightbox(currentIndex + 1);
        }

        // lightbox galeri
        galeriItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                showLightbox(index);
            });

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showLightbox(index);
                }
            });
        });

        // Kontrol shortcut 
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
        if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

        // Shortcut keyboard
        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        });

        // Swipe di hp
        let touchStartX = 0;
        let touchEndX = 0;

        lightboxModal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxModal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) {
                nextImage();
            } else if (touchEndX > touchStartX + threshold) {
                prevImage();
            }
        }, { passive: true });
    }
});