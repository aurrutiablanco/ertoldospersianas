document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // 1. Entrada inicial suave del Header
    setTimeout(() => {
        if (header) {
            header.classList.add('revealed');
        }
    }, 150);

    // 2. Control de Encogimiento del Header al Hacer Scroll
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('nav-scrolled');
            } else {
                header.classList.remove('nav-scrolled');
            }
        }
    });

    // 3. Menú Hamburguesa Móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (header && !header.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.classList.remove('open');
                navMenu.classList.remove('active');
            }
        });
    }

    // 4. Lógica Acordeón Móvil para las Flechitas
    const arrowButtons = document.querySelectorAll('.nav-item.dropdown .arrow');

    arrowButtons.forEach(arrow => {
        arrow.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();

                const currentItem = arrow.closest('.nav-item.dropdown');
                if (!currentItem) return;
                const isOpen = currentItem.classList.contains('active-dropdown');

                // Cerrar cualquier otro desplegable que estuviera abierto
                document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                    item.classList.remove('active-dropdown');
                });

                // Abrir el seleccionado si no estaba abierto
                if (!isOpen) {
                    currentItem.classList.add('active-dropdown');
                }
            }
        });
    });

    // 5. Cierre del menú móvil al hacer clic en un enlace
    document.querySelectorAll('.dropdown-menu a, .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!e.target.classList.contains('arrow')) {
                if (navToggle && navMenu) {
                    navToggle.classList.remove('open');
                    navMenu.classList.remove('active');
                }
                document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                    item.classList.remove('active-dropdown');
                });
            }
        });
    });

    // 6. Revelado Lento en Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-top, .reveal-bottom');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.08
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active', 'en-vista');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // 7. Observador para la sección .bg-hueso
    const observerBgHueso = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("en-vista");
            }
        });
    }, {
        threshold: 0.15
    });

    document.querySelectorAll(".bg-hueso").forEach((elemento) => {
        observerBgHueso.observe(elemento);
    });

    // 8. CARRUSEL ROTATIVO DINÁMICO
    function setupRotativeCarousel(carouselId, intervalTime = 4000) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const viewport = carousel.querySelector('.carousel-viewport');
        const track = carousel.querySelector('.carousel-track');
        const cards = Array.from(carousel.querySelectorAll('.carousel-card'));
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');

        if (!viewport || !track || cards.length === 0) return;

        let currentIndex = 0;

        function updateCarouselPosition() {
            const viewportWidth = viewport.offsetWidth;
            const selectedCard = cards[currentIndex];
            if (!selectedCard) return;

            const cardOffsetLeft = selectedCard.offsetLeft;
            const centerTranslate = (viewportWidth / 2) - (cardOffsetLeft + (selectedCard.offsetWidth / 2));

            track.style.transform = `translateX(${centerTranslate}px)`;

            cards.forEach((card, idx) => {
                card.classList.remove('center');
                if (idx === currentIndex) {
                    card.classList.add('center');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarouselPosition();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarouselPosition();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextSlide();
                resetTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevSlide();
                resetTimer();
            });
        }

        let autoRotate = setInterval(nextSlide, intervalTime);

        function resetTimer() {
            clearInterval(autoRotate);
            autoRotate = setInterval(nextSlide, intervalTime);
        }

        window.addEventListener('resize', updateCarouselPosition);
        setTimeout(updateCarouselPosition, 200);
    }

    setupRotativeCarousel('carouselPersianas', 4000);
    setupRotativeCarousel('carouselToldos', 4000);

    // 9. Lógica de carrusel cíclico manual para Toldos
    const trackToldos = document.querySelector("#carouselToldos .carousel-track");
    const prevBtnToldos = document.querySelector("#carouselToldos .prev-btn");
    const nextBtnToldos = document.querySelector("#carouselToldos .next-btn");

    if (trackToldos && prevBtnToldos && nextBtnToldos) {
        nextBtnToldos.addEventListener("click", () => {
            const primerElemento = trackToldos.firstElementChild;
            if (primerElemento) trackToldos.appendChild(primerElemento);
        });

        prevBtnToldos.addEventListener("click", () => {
            const ultimoElemento = trackToldos.lastElementChild;
            if (ultimoElemento) trackToldos.insertBefore(ultimoElemento, trackToldos.firstElementChild);
        });
    }
});

// 10. Desvanecimiento suave al hacer scroll (Efecto Pandora)
window.addEventListener("scroll", () => {
    const secciones = document.querySelectorAll("section");
    const scrollPos = window.scrollY;

    secciones.forEach((seccion) => {
        const top = seccion.offsetTop;
        const height = seccion.offsetHeight;

        if (scrollPos > top) {
            const porcentajeSalida = (scrollPos - top) / height;
            const nuevaOpacidad = 1 - porcentajeSalida * 0.65;
            seccion.style.opacity = Math.max(nuevaOpacidad, 0);
            seccion.style.transform = `scale(${1 - porcentajeSalida * 0.07})`;
        } else {
            seccion.style.opacity = "1";
            seccion.style.transform = "scale(1)";
        }
    });
});

// Carrusel Infinito Unidireccional (Sin retrocesos)
function initInfiniteCarousel() {
    const track = document.getElementById('infiniteCarouselTrack');
    if (!track) return;

    const intervalTime = 3500; // Tiempo en milisegundos entre cada foto (3.5 segundos)
    const transitionSpeed = 600; // Duración del deslizamiento en ms
    let isTransitioning = false;

    function moveNext() {
        if (isTransitioning) return;
        isTransitioning = true;

        // 1. Aplica la animación de deslizamiento hacia la siguiente imagen
        track.style.transition = `transform ${transitionSpeed}ms cubic-bezier(0.25, 1, 0.5, 1)`;
        track.style.transform = 'translateX(-100%)';

        // 2. Al terminar el movimiento, reordena las imágenes dinámicamente
        setTimeout(() => {
            // Mueve la primera imagen al final de la lista de elementos
            const firstSlide = track.firstElementChild;
            track.appendChild(firstSlide);

            // Desactiva la transición temporalmente para reajustar la posición 0 sin salto visible
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';

            // Forzar reflow en el navegador
            void track.offsetWidth;

            isTransitioning = false;
        }, transitionSpeed);
    }

    // Rotación automática continua
    setInterval(moveNext, intervalTime);
}

// Inicialización cuando carga el documento
document.addEventListener('DOMContentLoaded', initInfiniteCarousel);



// Carrusel Continuo Infinito para Logos
function initLogosCarousel() {
    const track = document.getElementById('logosCarouselTrack');
    if (!track) return;

    // Duplicar las tarjetas para crear el bucle infinito sin saltos
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let speed = 0.8; // Velocidad del desplazamiento
    let currentX = 0;

    function animate() {
        currentX -= speed;
        
        // Cuando ha recorrido la mitad (las tarjetas originales), reinicia el ciclo
        const halfWidth = track.scrollWidth / 2;
        if (Math.abs(currentX) >= halfWidth) {
            currentX = 0;
        }

        track.style.transform = `translateX(${currentX}px)`;
        requestAnimationFrame(animate);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', initLogosCarousel);





// Carrusel Doble Vertical de 2 Imágenes (Direcciones Opuestas)
function initDualVerticalCarousel() {
    const leftCol = document.getElementById('dualColLeft');
    const rightCol = document.getElementById('dualColRight');
    if (!leftCol || !rightCol) return;

    const leftSlides = Array.from(leftCol.querySelectorAll('.dual-slide'));
    const rightSlides = Array.from(rightCol.querySelectorAll('.dual-slide'));
    if (leftSlides.length === 0 || rightSlides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = Math.min(leftSlides.length, rightSlides.length);
    const duration = 4000; // 4 segundos
    const animSpeed = 800; // Transición de 0.8s

    setInterval(() => {
        const nextIndex = (currentIndex + 1) % totalSlides;

        const currentLeft = leftSlides[currentIndex];
        const nextLeft = leftSlides[nextIndex];

        const currentRight = rightSlides[currentIndex];
        const nextRight = rightSlides[nextIndex];

        // Reset transiciones instantáneo
        nextLeft.style.transition = 'none';
        nextRight.style.transition = 'none';

        // Posicionar nuevos slides fuera de pantalla
        nextLeft.className = 'dual-slide slide-next-prep-up';    // Entra desde abajo (+100%)
        nextRight.className = 'dual-slide slide-next-prep-down'; // Entra desde arriba (-100%)

        void nextLeft.offsetWidth;  // Forzar renderizado
        void nextRight.offsetWidth;

        // Asignar curva de animación fluida
        const transitionStyle = `transform ${animSpeed}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${animSpeed}ms ease`;
        currentLeft.style.transition = transitionStyle;
        nextLeft.style.transition = transitionStyle;
        currentRight.style.transition = transitionStyle;
        nextRight.style.transition = transitionStyle;

        // Iniciar desplazamiento en sentidos opuestos
        currentLeft.className = 'dual-slide slide-exit-up';      // Sale hacia arriba (-100%)
        nextLeft.className = 'dual-slide active';

        currentRight.className = 'dual-slide slide-exit-down';   // Sale hacia abajo (+100%)
        nextRight.className = 'dual-slide active';

        // Limpiar clases al terminar la animación
        setTimeout(() => {
            currentLeft.className = 'dual-slide';
            currentRight.className = 'dual-slide';
        }, animSpeed);

        currentIndex = nextIndex;
    }, duration);
}

document.addEventListener('DOMContentLoaded', initDualVerticalCarousel);