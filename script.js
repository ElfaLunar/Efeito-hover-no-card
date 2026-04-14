(function() {
    // Para dispositivos com toque, simula o hover individual nas cartas
    const cardsGroup = document.querySelector('.cards-group');
    const circleRing = document.querySelector('.orange-circle-ring');
    const cards = document.querySelectorAll('.card');
    
    // Suporte para dispositivos touch - cada carta pode ser tocada individualmente
    if (cards.length > 0) {
        let touchTimeouts = new Map();
        
        cards.forEach(card => {
            card.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                
                // Se já houver um timeout para este card, limpa
                if (touchTimeouts.has(card)) {
                    clearTimeout(touchTimeouts.get(card));
                    touchTimeouts.delete(card);
                }
                
                // Remove a classe active de todos os outros cards
                cards.forEach(c => {
                    if (c !== card && c.classList.contains('touch-active')) {
                        c.classList.remove('touch-active');
                        const content = c.querySelector('.card-content');
                        if (content) {
                            content.style.opacity = '';
                            content.style.transform = '';
                        }
                    }
                });
                
                // Adiciona classe active ao card tocado
                card.classList.add('touch-active');
                
                // Mostra o conteúdo via CSS
                const content = card.querySelector('.card-content');
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }
                
                // Esconde após 2 segundos
                const timeout = setTimeout(() => {
                    card.classList.remove('touch-active');
                    if (content) {
                        content.style.opacity = '';
                        content.style.transform = '';
                    }
                    touchTimeouts.delete(card);
                }, 2000);
                
                touchTimeouts.set(card, timeout);
            });
        });
        
        // Limpa ao tocar fora
        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.card')) {
                cards.forEach(card => {
                    if (card.classList.contains('touch-active')) {
                        card.classList.remove('touch-active');
                        const content = card.querySelector('.card-content');
                        if (content) {
                            content.style.opacity = '';
                            content.style.transform = '';
                        }
                    }
                    if (touchTimeouts.has(card)) {
                        clearTimeout(touchTimeouts.get(card));
                        touchTimeouts.delete(card);
                    }
                });
            }
        });
        
        // Estilo para suporte touch
        const touchStyle = document.createElement('style');
        touchStyle.textContent = `
            .card.touch-active .card-content {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            .card.touch-active .card-icon {
                opacity: 0.3 !important;
                font-size: 1.5rem !important;
            }
        `;
        document.head.appendChild(touchStyle);
    }
    
    // Efeito de hover no grupo
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
                transform: translateZ(20px) rotateX(70deg) rotateY(-3deg) scale(0.98) !important;
            }
            .cards-group.force-hover .card-1 {
                transform: translateX(-110%) translateZ(30px) translateY(5px) rotateY(12deg) rotateX(2deg) !important;
                z-index: 5;
            }
            .cards-group.force-hover .card-2 {
                transform: translateX(0%) translateZ(45px) translateY(0px) rotateY(0deg) rotateX(0deg) !important;
                z-index: 6;
            }
            .cards-group.force-hover .card-3 {
                transform: translateX(110%) translateZ(30px) translateY(5px) rotateY(-12deg) rotateX(2deg) !important;
                z-index: 5;
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
                .cards-group.force-hover .card-1 { transform: translateX(-105%) translateZ(25px) !important; }
                .cards-group.force-hover .card-3 { transform: translateX(105%) translateZ(25px) !important; }
            }
            @media (max-width: 560px) {
                .cards-group.force-hover .card-1 { transform: translateX(-95%) translateZ(20px) scale(0.92) !important; }
                .cards-group.force-hover .card-3 { transform: translateX(95%) translateZ(20px) scale(0.92) !important; }
                .cards-group.force-hover .card-2 { transform: translateX(0%) translateZ(35px) scale(0.96) !important; }
            }
        `;
        document.head.appendChild(style);
    }

    // Efeito de movimento suave no círculo
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

    // Efeito de clique nas cartas
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            this.style.transform += ' scale(0.98)';
            setTimeout(() => {
                if (this.style.transform) {
                    const parentGroup = document.querySelector('.cards-group');
                    const isHovered = parentGroup && parentGroup.matches(':hover');
                    
                    if (!isHovered && !this.classList.contains('touch-active')) {
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
    });
    
    // Detecta dispositivos touch
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
})();
