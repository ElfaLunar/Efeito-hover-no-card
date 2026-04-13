(function() {
    // Para dispositivos com toque, adicionamos classe tátil que permite o hover via clique/toque
    const cardsGroup = document.querySelector('.cards-group');
    const circleRing = document.querySelector('.orange-circle-ring');
    
    if (cardsGroup) {
        let touchTimeout;
        
        cardsGroup.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            cardsGroup.classList.add('force-hover');
            if (circleRing) circleRing.classList.add('circle-active');
            if (touchTimeout) clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                cardsGroup.classList.remove('force-hover');
                if (circleRing) circleRing.classList.remove('circle-active');
            }, 1500);
        });
        
        cardsGroup.addEventListener('mouseleave', () => {
            if (cardsGroup.classList.contains('force-hover')) {
                cardsGroup.classList.remove('force-hover');
            }
            if (circleRing && circleRing.classList.contains('circle-active')) {
                circleRing.classList.remove('circle-active');
            }
        });
        
        // Estilo dinâmico para classe force-hover
        const style = document.createElement('style');
        style.textContent = `
            .cards-group.force-hover {
                transform: translateZ(40px) rotateX(0deg) rotateY(0deg) scale(0.98);
            }
            .cards-group.force-hover .card-1 {
                transform: translateX(-115%) translateZ(45px) translateY(-15px) rotateY(6deg) rotateX(4deg) !important;
                z-index: 5;
                background: rgba(255, 255, 245, 0.98);
            }
            .cards-group.force-hover .card-2 {
                transform: translateX(0%) translateZ(60px) translateY(-20px) rotateY(0deg) rotateX(2deg) !important;
                z-index: 6;
                background: rgba(255, 252, 245, 1);
            }
            .cards-group.force-hover .card-3 {
                transform: translateX(115%) translateZ(45px) translateY(-15px) rotateY(-6deg) rotateX(4deg) !important;
                z-index: 5;
                background: rgba(255, 255, 248, 0.98);
            }
            .orange-circle-ring.circle-active {
                animation: pulseRing 0.6s ease infinite alternate !important;
                box-shadow: 
                    0 0 0 18px rgba(255, 140, 0, 0.9),
                    0 0 0 30px rgba(255, 120, 0, 0.5),
                    0 0 90px 40px rgba(255, 100, 0, 0.8),
                    inset 0 0 50px 20px rgba(255, 120, 0, 0.5) !important;
            }
            @media (max-width: 800px) {
                .cards-group.force-hover .card-1 { transform: translateX(-105%) translateZ(35px) translateY(-12px) !important; }
                .cards-group.force-hover .card-3 { transform: translateX(105%) translateZ(35px) translateY(-12px) !important; }
            }
            @media (max-width: 560px) {
                .cards-group.force-hover .card-1 { transform: translateX(-90%) translateZ(25px) translateY(-8px) scale(0.9) !important; }
                .cards-group.force-hover .card-3 { transform: translateX(90%) translateZ(25px) translateY(-8px) scale(0.9) !important; }
                .cards-group.force-hover .card-2 { transform: translateX(0%) translateZ(45px) translateY(-12px) scale(0.95) !important; }
            }
        `;
        document.head.appendChild(style);
    }

    // Efeito de movimento suave no círculo acompanhando o mouse
    if (circleRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        const wrapper = document.querySelector('.circle-wrapper');
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 20 - 10;
            mouseY = (e.clientY / window.innerHeight) * 20 - 10;
            
            ringX += (mouseX * 0.03 - ringX) * 0.1;
            ringY += (mouseY * 0.03 - ringY) * 0.1;
            
            if (wrapper) {
                wrapper.style.transform = `translate(-50%, -50%) translate(${ringX}px, ${ringY}px)`;
            }
        });
        
        document.addEventListener('mouseleave', () => {
            if (wrapper) {
                wrapper.style.transform = 'translate(-50%, -50%)';
                ringX = 0;
                ringY = 0;
            }
        });
    }

    // Adiciona efeito de clique suave nas cartas
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            this.style.transform += ' scale(0.98)';
            setTimeout(() => {
                if (this.style.transform) {
                    const parentGroup = document.querySelector('.cards-group');
                    if (!parentGroup || !parentGroup.matches(':hover')) {
                        if (this.classList.contains('card-1')) this.style.transform = '';
                        else if (this.classList.contains('card-2')) this.style.transform = '';
                        else if (this.classList.contains('card-3')) this.style.transform = '';
                    } else {
                        this.style.transform = '';
                    }
                }
            }, 150);
            
            const bookTitle = this.querySelector('.book-title')?.innerText || 'Livro';
            console.log(`📚 Clicou em: ${bookTitle}`);
            
            if (circleRing) {
                circleRing.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    if (circleRing) circleRing.style.transform = '';
                }, 200);
            }
        });
        
        card.addEventListener('mouseenter', function() {
            if (!document.querySelector('.cards-group:hover')) return;
            this.style.transition = 'all 0.2s ease';
            this.style.boxShadow = '0 0 15px rgba(255,160,50,0.6), 0 15px 25px -8px black';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
})();
