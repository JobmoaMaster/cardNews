// 웹 페이지의 모든 요소가 로드된 후 스크립트 실행
document.addEventListener('DOMContentLoaded', function() {
    // 필요한 DOM 요소들을 상수로 선언
    const track = document.getElementById('slider-track');
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const paginationNav = document.getElementById('slider-pagination');

    // 슬라이드의 개수만큼 페이지네이션 점 생성
    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('pagination-dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) {
            dot.classList.add('active'); // 첫 번째 점을 활성화 상태로
        }
        paginationNav.appendChild(dot);
    });

    const dots = Array.from(paginationNav.children);
    const slideWidth = slides[0].getBoundingClientRect().width;

    // 현재 슬라이드 인덱스를 추적하는 변수
    let currentIndex = 0;

    /**
     * 지정된 인덱스의 슬라이드로 이동하는 함수
     * @param {number} targetIndex - 이동할 슬라이드의 인덱스
     */
    const moveToSlide = (targetIndex) => {
        // 트랙을 움직여 해당 슬라이드를 보여줌
        track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
        
        // 현재 활성화된 슬라이드와 점의 'active' 클래스 제거
        const currentSlide = slides[currentIndex];
        const currentDot = dots[currentIndex];
        currentSlide.classList.remove('active');
        currentDot.classList.remove('active');

        // 목표 슬라이드와 점에 'active' 클래스 추가
        const targetSlide = slides[targetIndex];
        const targetDot = dots[targetIndex];
        targetSlide.classList.add('active');
        targetDot.classList.add('active');

        // 현재 인덱스를 업데이트
        currentIndex = targetIndex;
    };

    // 다음 버튼 클릭 이벤트 처리
    nextButton.addEventListener('click', e => {
        // 다음 슬라이드 인덱스 계산 (마지막 슬라이드면 처음으로)
        const nextIndex = (currentIndex + 1) % slides.length;
        moveToSlide(nextIndex);
    });

    // 이전 버튼 클릭 이벤트 처리
    prevButton.addEventListener('click', e => {
        // 이전 슬라이드 인덱스 계산 (첫 슬라이드면 마지막으로)
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        moveToSlide(prevIndex);
    });
    
    // 페이지네이션 점 클릭 이벤트 처리 (이벤트 위임)
    paginationNav.addEventListener('click', e => {
        // 클릭된 요소가 점이 아니면 함수 종료
        const targetDot = e.target.closest('.pagination-dot');
        if (!targetDot) return;

        // 클릭된 점에 해당하는 슬라이드 인덱스 찾기
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        moveToSlide(targetIndex);
    });

    // 창 크기 변경 시 슬라이드 너비를 다시 계산하여 레이아웃 깨짐 방지
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        track.style.transition = 'none'; // 리사이즈 중에는 애니메이션 일시 정지
        track.style.transform = 'translateX(-' + newSlideWidth * currentIndex + 'px)';
        track.style.transition = ''; // 애니메이션 재활성화
    });
});