document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('slider-track');
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const paginationNav = document.getElementById('slider-pagination');
    const sliderViewport = document.getElementById('slider-viewport');

    if (slides.length === 0) return;

    // 페이지네이션 점 생성
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('pagination-dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        paginationNav.appendChild(dot);
    });

    const dots = Array.from(paginationNav.children);
    let slideWidth = sliderViewport.offsetWidth;
    let currentIndex = 0;

    const setActiveItems = (index) => {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    const moveToSlide = (targetIndex) => {
        track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
        currentIndex = targetIndex;
        setActiveItems(currentIndex);
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        moveToSlide(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        moveToSlide(prevIndex);
    };

    nextButton.addEventListener('click', handleNext);
    prevButton.addEventListener('click', handlePrev);

    paginationNav.addEventListener('click', e => {
        const targetDot = e.target.closest('.pagination-dot');
        if (targetDot) {
            const targetIndex = dots.indexOf(targetDot);
            if (targetIndex !== -1) moveToSlide(targetIndex);
        }
    });

    // 이미지 클릭으로 좌/우 이동 및 링크 기능 구현
    sliderViewport.addEventListener('click', e => {
        // '지금 시작하기' 버튼은 a 태그이므로 기본 동작을 따르도록 하고, 이벤트 처리를 종료
        if (e.target.classList.contains('action-button')) {
            return;
        }

        const slideContentWrapper = e.target.closest('.slide-content-wrapper');
        if (slideContentWrapper) {
            // 마지막 슬라이드(QR코드)는 클릭 네비게이션 제외
            if (slideContentWrapper.closest('.slide') === slides[slides.length - 1]) {
                return;
            }

            const rect = slideContentWrapper.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            if (clickX > rect.width / 2) {
                handleNext(); // 오른쪽 클릭
            } else {
                handlePrev(); // 왼쪽 클릭
            }
        }
    });

    // 창 크기 변경 시 슬라이드 너비 재계산
    window.addEventListener('resize', () => {
        slideWidth = sliderViewport.offsetWidth;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        setTimeout(() => {
            track.style.transition = '';
        }, 50);
    });

    // 초기 로드 시 첫 번째 슬라이드 활성화
    setActiveItems(0);
});