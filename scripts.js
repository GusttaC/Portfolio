// ===========================
// CANVAS BACKGROUND - EFEITO AVANÇADO
// ===========================

class CanvasBackground {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                this.canvas.width,
                this.canvas.height
            ));
        }
    }

    handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        this.particles.forEach(particle => {
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle) * 0.5;
                particle.vy += Math.sin(angle) * 0.5;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualizar partículas
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        
        // Desenhar conexões
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        this.ctx.strokeStyle = 'rgba(224, 224, 224, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const opacity = 1 - (distance / 200);
                    this.ctx.strokeStyle = `rgba(224, 224, 224, ${opacity * 0.15})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(x, y, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Aplicar fricção
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // Bounce nas bordas
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        }
        if (this.y < 0 || this.y > this.canvasHeight) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(224, 224, 224, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.strokeStyle = `rgba(224, 224, 224, ${this.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Inicializar canvas
const canvasBackground = new CanvasBackground();

// ===========================
// NAVEGAÇÃO E SCROLL
// ===========================

class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        let current = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-target') === current) {
                link.classList.add('active');
            }
        });
    }
}

// ===========================
// OBSERVADOR DE ELEMENTOS
// ===========================

class ElementObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll(
            '.about-card, .timeline-content, .project-card, .skill-column, .contact-card, .info-box'
        );

        elements.forEach(el => {
            el.classList.add('observe-element');
            this.observer.observe(el);
        });
    }
}

// Adicionar estilos para elementos observados
const style = document.createElement('style');
style.textContent = `
    .observe-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .observe-element.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .nav-link.active {
        color: #00ff22;
        text-shadow: 0 0 10px #00ff22;
    }

    .nav-link.active::before {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ===========================
// ANIMAÇÃO DE NÚMEROS
// ===========================

class NumberAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.5
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumbers(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.observeNumbers();
    }

    observeNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(num => this.observer.observe(num));
    }

    animateNumbers(element) {
        const text = element.textContent;
        const isInfinity = text === '∞';
        
        if (isInfinity) {
            element.style.animation = 'spin 2s linear infinite';
            return;
        }

        const finalNumber = parseInt(text);
        let current = 0;
        const increment = Math.ceil(finalNumber / 30);
        const interval = setInterval(() => {
            current += increment;
            if (current >= finalNumber) {
                element.textContent = finalNumber;
                clearInterval(interval);
            } else {
                element.textContent = current;
            }
        }, 30);
    }
}

// Adicionar animação spin
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        0% { transform: rotateZ(0deg); }
        100% { transform: rotateZ(360deg); }
    }
`;
document.head.appendChild(spinStyle);

// ===========================
// EFEITO DE DIGITAÇÃO AVANÇADO
// ===========================

class TypingEffect {
    constructor() {
        this.titleLines = document.querySelectorAll('.title-line');
        this.init();
    }

    init() {
        this.titleLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            
            setTimeout(() => {
                this.typeText(line, text, 50);
            }, index * 300);
        });
    }

    typeText(element, text, speed) {
        let index = 0;
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        type();
    }
}

// ===========================
// SMOOTH SCROLL ENHANCEMENT
// ===========================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            e.preventDefault();
            const href = link.getAttribute('href');
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===========================
// PERFORMANCE MONITOR
// ===========================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Preload critical resources
        this.preloadResources();
    }

    preloadResources() {
        // Preload fonts, etc
        if (document.fonts) {
            document.fonts.ready.then(() => {
                console.log('Fonts loaded');
            });
        }
    }
}

// ===========================
// INICIALIZAÇÃO GLOBAL
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 Portfólio 3.0 Ultra Carregado', 'color: #00ff22; font-size: 16px; font-weight: bold;');
    console.log('%cDesenvolvido por Gustavo Fernandes', 'color: #00ff22; font-size: 12px;');

    // Inicializar todos os componentes
    new Navigation();
    new ElementObserver();
    new NumberAnimator();
    new TypingEffect();
    new SmoothScroll();
    new PerformanceMonitor();

    // Adicionar classe ao body quando carregado
    document.body.classList.add('loaded');
});

// ===========================
// TRATAMENTO DE ERROS
// ===========================

window.addEventListener('error', (e) => {
    console.error('Erro:', e.error);
});

// ===========================
// SUPORTE A TECLADO
// ===========================

document.addEventListener('keydown', (e) => {
    // ESC para fechar qualquer modal (futuro)
    if (e.key === 'Escape') {
        console.log('ESC pressionado');
    }

    // Navegação com setas
    if (e.key === 'ArrowDown') {
        window.scrollBy({ top: 100, behavior: 'smooth' });
    } else if (e.key === 'ArrowUp') {
        window.scrollBy({ top: -100, behavior: 'smooth' });
    }
});

// ===========================
// DETECÇÃO DE TEMA
// ===========================

class ThemeDetector {
    constructor() {
        this.detectTheme();
    }

    detectTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }
    }
}

new ThemeDetector();

// ===========================
// ANALYTICS BÁSICO
// ===========================

class Analytics {
    constructor() {
        this.trackPageView();
        this.trackInteractions();
    }

    trackPageView() {
        console.log('Página visualizada:', window.location.href);
    }

    trackInteractions() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.closest('a')) {
                const link = target.tagName === 'A' ? target : target.closest('a');
                console.log('Link clicado:', link.href);
            }
        });
    }
}

new Analytics();

// ===========================
// WAKE LOCK API (Experimental)
// ===========================

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            const wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock ativado');
        }
    } catch (err) {
        console.log('Wake Lock não disponível:', err.name);
    }
}

// Ativar ao interagir com a página
document.addEventListener('click', requestWakeLock);
