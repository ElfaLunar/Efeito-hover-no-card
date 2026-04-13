(function() {
    // Para dispositivos com toque, adicionamos classe tátil que permite o hover via clique/toque
    // mas mantendo a experiência original. Melhora a usabilidade em tablets/mobile.
    const cardsGroup = document.querySelector('.cards-group');
    
    if (cardsGroup) {
        // Se for dispositivo touch, ao tocar no grupo, alternamos uma classe temporária para simular hover
        // mas não prejudica o hover nativo, apenas garante que ao tocar as cartas se espalhem.
        let touchTimeout;
        
        cardsGroup.addEventListener('touchstart', (e) => {
            // Previne scroll excessivo apenas se necessário, mas não atrapalha
            e.stopPropagation();
            // Adiciona efeito hover ativo via classe forçada por alguns instantes
            cardsGroup.classList.add('force-hover');
            // Remove após alguns segundos, mas também se tocar fora
            if (touchTimeout) clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                cardsGroup.classList.remove('force-hover');
            }, 1500);
        });
        
        // Também mantém comportamento mouse normal
        // Para evitar que a classe force-hover persista, quando mouse sair, removemos
        cardsGroup.addEventListener('mouseleave', () => {
            if (cardsGroup.classList.contains('force-hover')) {
                cardsGroup.classList.remove('force-hover');
            }
        });
        
        // Estilo dinâmico para classe force-hover aplicar os mesmos transforms do hover
        const style = document.createElement('style');
        style.textContent = `
            .cards-group.force-hover {
                transform: translateZ(40px) rotateX(0deg) rotateY(0deg) scale(0.98);
            }
            .cards-group.force-hover .card-1 {
                transform: translateX(-105%) translateZ(50px) translateY(-20px) rotateY(6deg) rotateX(4deg) !important;
                z-index: 5;
                background: rgba(255, 255, 245, 0.98);
            }
            .cards-group.force-hover .card-2 {
                transform: translateX(0%) translateZ(70px) translateY(-25px) rotateY(0deg) rotateX(2deg) !important;
                z-index: 6;
                background: rgba(255, 252, 245, 1);
            }
            .cards-group.force-hover .card-3 {
                transform: translateX(105%) translateZ(50px) translateY(-20px) rotateY(-6deg) rotateX(4deg) !important;
                z-index: 5;
                background: rgba(255, 255, 248, 0.98);
            }
            @media (max-width: 800px) {
                .cards-group.force-hover .card-1 { transform: translateX(-90%) translateZ(40px) translateY(-15px) !important; }
                .cards-group.force-hover .card-3 { transform: translateX(90%) translateZ(40px) translateY(-15px) !important; }
            }
            @media (max-width: 560px) {
                .cards-group.force-hover .card-1 { transform: translateX(-75%) translateZ(30px) translateY(-10px) scale(0.9) !important; }
                .cards-group.force-hover .card-3 { transform: translateX(75%) translateZ(30px) translateY(-10px) scale(0.9) !important; }
                .cards-group.force-hover .card-2 { transform: translateX(0%) translateZ(55px) translateY(-15px) scale(0.95) !important; }
            }
        `;
        document.head.appendChild(style);
    }

    // Adicionar leve efeito de movimento paralaxe no círculo (opcional e sutil)
    const circle = document.querySelector('.orange-circle');
    if (circle) {
        // Pequeno efeito de mouse tracking sutil no círculo
        let mouseX = 0, mouseY = 0;
        let circleX = 0, circleY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 10;
            mouseY = (e.clientY / window.innerHeight) * 8;
            
            // Suavização do movimento
            circleX += (mouseX * 0.05 - circleX) * 0.1;
            circleY += (mouseY * 0.05 - circleY) * 0.1;
            
            if (circle) {
                circle.style.transform = `translate(-50%, -50%) translate(${circleX}px, ${circleY}px)`;
            }
        });
        
        // Reset quando mouse sai da janela
        document.addEventListener('mouseleave', () => {
            if (circle) {
                circle.style.transform = 'translate(-50%, -50%)';
                circleX = 0;
                circleY = 0;
            }
        });
    }

    // Adiciona efeito de clique suave nas cartas para feedback tátil adicional
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Pequena animação de feedback para clique
            this.style.transform += ' scale(0.98)';
            setTimeout(() => {
                if (this.style.transform) {
                    // Remove o scale temporário preservando os transforms originais
                    const parentGroup = document.querySelector('.cards-group');
                    if (!parentGroup || !parentGroup.matches(':hover')) {
                        // Se não estiver em hover, restaura estilo específico baseado na classe
                        if (this.classList.contains('card-1')) this.style.transform = '';
                        else if (this.classList.contains('card-2')) this.style.transform = '';
                        else if (this.classList.contains('card-3')) this.style.transform = '';
                    } else {
                        this.style.transform = '';
                    }
                }
            }, 150);
            
            // Mostra no console qual livro foi clicado (apenas para debug)
            const bookTitle = this.querySelector('.book-title')?.innerText || 'Livro';
            console.log(`📚 Clicou em: ${bookTitle}`);
        });
    });
    
    // Previne qualquer conflito de hover em dispositivos híbridos
    if ('ontouchstart' in window) {
        // Adiciona classe ao body para possíveis ajustes futuros
        document.body.classList.add('touch-device');
    }
    
    // Efeito de brilho adicional nas cartas ao passar o mouse individualmente (opcional)
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!document.querySelector('.cards-group:hover')) return;
            this.style.transition = 'all 0.2s ease';
            this.style.boxShadow = '0 0 20px rgba(255,160,50,0.6), 0 20px 30px -8px black';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
})();
