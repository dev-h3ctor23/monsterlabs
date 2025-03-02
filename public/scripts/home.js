//TARJETAS

document.addEventListener('DOMContentLoaded', function() {
    var swiper = new Swiper('.swiper-container', {
        effect: 'cards',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        cardsEffect: {
            perSlideOffset: 8,
            perSlideRotate: 2,
        },
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});