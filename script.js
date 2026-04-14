(function() {
    const cardsGroup = document.querySelector('.cards-group');
    const circleRing = document.querySelector('.orange-circle-ring');
    const cards = document.querySelectorAll('.card');
    
    // Suporte para dispositivos touch
    if (cards.length > 0) {
        let touchTimeouts = new Map();
        
        cards.forEach(card => {
            card.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                if (touchTimeouts.has(card)) {
                    clearTimeout(touchTimeouts.get(card));
                    touchTimeouts.delete(card);
                }
                
                cards.forEach(c => {
                    if (c !== card && c.classList.contains('touch-active')) {
                        c.classList.remove('touch-active');
                        const content = c.querySelector('.card-content');
                        if (content) {
                            content.style.opacity = '';
                            content.style.transform = '';
                        }
                        const icon = c.querySelector('.card-icon');
                        if (icon) {
                            icon.style.opacity = '';
                            icon.style.fontSize = '';
                            icon.style.transform = '';
                        }
                        if (c.classList.contains('card-1')) c.style.transform = '';
                        else if (c.classList.contains('card-2')) c.style.transform = '';
                        else if (c.classList.contains('card-3')) c.style.transform = '';
                        c.style.zIndex = '';
                        c.style.boxShadow = '';
                    }
                });
                
                card.classList.add('touch-active');
                
                card.style.transform = `translateY(-35px) translateZ(25px) rotateX(0deg) rotateY(0deg) scale(1.03)`;
                card.style.zIndex = '100';
                card.style.boxShadow = '0 35px 50px -20px rgba(0,0,0,0.7), 0 0 0 2px rgba(255, 180, 50, 0.6) inset';
                
                const content = card.querySelector('.card-content');
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }
                
                const icon = card.querySelector('.card-icon');
                if (icon) {
                    icon.style.opacity = '0.15';
                    icon.style.fontSize = '1.6rem';
                    icon.style.transform = 'translateY(-8px)';
                }
                
                const timeout = setTimeout(() => {
                    card.classList.remove('touch-active');
                    
                    if (card.classList.contains('card-1')) card.style.transform = '';
                    else if (card.classList.contains('card-2')) card.style.transform = '';
                    else if (card.classList.contains('card-3')) card.style.transform = '';
                    
                    card.style.zIndex = '';
                    card.style.boxShadow = '';
                    
                    if (content) {
                        content.style.opacity = '';
                        content.style.transform = '';
                    }
                    if (icon) {
                        icon.style.opacity = '';
                        icon.style.fontSize = '';
                        icon.style.transform = '';
                    }
                    touchTimeouts.delete(card);
                }, 2000);
                
                touchTimeouts.set(card, timeout);
            });
        });
        
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.card')) {
                cards.forEach(card => {
                    if (card.classList.contains('touch-active')) {
                        card.classList.remove('touch-active');
                        
                        if (card.classList.contains('card-1')) card.style.transform = '';
                        else if (card.classList.contains('card-2')) card.style.transform = '';
                        else if (card.classList.contains('card-3')) card.style.transform = '';
                        
                        card.style.zIndex = '';
                        card.style.boxShadow = '';
                        
                        const content = card.querySelector('.card-content');
                        if (content) {
                            content.style.opacity = '';
                            content.style.transform = '';
                        }
                        const icon = card.querySelector('.card-icon');
                        if (icon) {
                            icon.style.opacity = '';
                            icon.style.fontSize = '';
                            icon.style.transform = '';
                        }
                    }
                    if (touchTimeouts.has(card)) {
                        clearTimeout(touchTimeouts.get(card));
                        touchTimeouts.delete(card);
                    }
                });
            }
        });
    }
    
    // Hover do grupo para touch
    if (cardsGroup) {
        let groupTouchTimeout;
        
        cardsGroup.addEventListener('touchstart', (e) => {
            if (e.target.closest('.card')) return;
            e.stopPropagation();
            cardsGroup.classList.add('force-hover');
            if (circleRing) circleRing.classList.add('circle-active');
            if (groupTouchTimeout) clearTimeout(groupTouchTimeout);
            groupTouchTimeout = setTimeout(() => {
                cardsGroup.classList.remove('force-hover');
                if (circleRing) circleRing.classList.remove('circle-active');
            }, 2000);
        });
        
        cardsGroup.addEventListener('mouseleave', () => {
            if (cardsGroup.classList.contains('force-hover')) cardsGroup.classList.remove('force-hover');
            if (circleRing && circleRing.classList.contains('circle-active')) circleRing.classList.remove('circle-active');
        });
        
        const style = document.createElement('style');
        style.textContent = `
            .cards-group.force-hover { transform: translateZ(15px) rotateX(2deg) rotateY(-2deg) scale(0.98) !important; }
            .cards-group.force-hover .card-1 { transform: translateX(-115%) translateZ(20px) translateY(0px) rotateY(10deg) !important; z-index: 5; }
            .cards-group.force-hover .card-2 { transform: translateX(0%) translateZ(35px) translateY(0px) rotateY(0deg) !important; z-index: 6; }
            .cards-group.force-hover .card-3 { transform: translateX(115%) translateZ(20px) translateY(0px) rotateY(-10deg) !important; z-index: 5; }
            .orange-circle-ring.circle-active { animation: pulseRing 0.6s ease infinite alternate !important; box-shadow: 0 0 0 18px rgba(255, 140, 0, 0.9), 0 0 0 30px rgba(255, 120, 0, 0.5), 0 0 90px 40px rgba(255, 100, 0, 0.8), inset 0 0 50px 20px rgba(255, 120, 0, 0.5) !important; }
        `;
        document.head.appendChild(style);
    }
    
    // Movimento do círculo com o mouse
    if (circleRing) {
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        const wrapper = document.querySelector('.circle-wrapper');
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 20 - 10;
            mouseY = (e.clientY / window.innerHeight) * 20 - 10;
            ringX += (mouseX * 0.03 - ringX) * 0.1;
            ringY += (mouseY * 0.03 - ringY) * 0.1;
            if (wrapper) wrapper.style.transform = `translate(-50%, -50%) translate(${ringX}px, ${ringY}px)`;
        });
        
        document.addEventListener('mouseleave', () => {
            if (wrapper) wrapper.style.transform = 'translate(-50%, -50%)';
            ringX = 0; ringY = 0;
        });
    }
    
    // Clique nas cartas
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            const bookTitle = this.querySelector('.book-title')?.innerText || 'Livro';
            console.log(`📚 Clicou em: ${bookTitle}`);
            
            if (circleRing) {
                circleRing.style.transform = 'scale(1.05)';
                setTimeout(() => { if (circleRing) circleRing.style.transform = ''; }, 200);
            }
        });
    });
    
    if ('ontouchstart' in window) document.body.classList.add('touch-device');
})();
