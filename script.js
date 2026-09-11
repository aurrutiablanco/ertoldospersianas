document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. OCULTAR NAVBAR AL SCROLLEAR ABAJO Y MOSTRAR AL SCROLLEAR ARRIBA
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 90) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;
    });

    // ----------------------------------------------------------------------
    // 2. MENÚ MÓVIL
    // ----------------------------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 3. EFECTO REVELADO EN SCROLL
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------------------------------------
    // 4. SECCIÓN TOLDOS: BOTONES PESTAÑA CON REVELADO Y TRANSICIONES
    // ----------------------------------------------------------------------
    const toldosInfo = [
        {
            title: "Toldo Retráctil / Brazos Invisibles",
            desc: "Extensión horizontal sin columnas fijas. Ideal para terrazas y balcones residenciales.",
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Toldo Vertical / Drop",
            desc: "Caída vertical guiada de alta resistencia. Perfecto para cerramientos de churuatas y balcones.",
            image: "https://images.unsplash.com/photo-1540518614846-7ede433c5172?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Persiana Exterior Enrollable",
            desc: "Filtrado UV con visibilidad exterior. Recomendado para oficinas y dormitorios expuestos al sol.",
            image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80"
        }
    ];

    const tabButtons = document.querySelectorAll('.toldo-tab-btn');
    const toldoDisplay = document.getElementById('toldoDisplay');
    const toldoTitle = document.getElementById('toldoTitle');
    const toldoDesc = document.getElementById('toldoDesc');
    const toldoImg = document.getElementById('toldoImg');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            toldoDisplay.classList.add('switching');

            setTimeout(() => {
                toldoTitle.textContent = toldosInfo[index].title;
                toldoDesc.textContent = toldosInfo[index].desc;
                toldoImg.src = toldosInfo[index].image;
                toldoDisplay.classList.remove('switching');
            }, 300);
        });
    });

    // ----------------------------------------------------------------------
    // 5. MODAL Y ENVÍO DE FORMULARIO A WHATSAPP
    // ----------------------------------------------------------------------
    const contactModal = document.getElementById('contactModal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.getElementById('closeModal');
    const whatsappForm = document.getElementById('whatsappForm');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
        }
    });

    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('userName').value.trim();
            const estado = document.getElementById('userState').value;
            const servicio = document.getElementById('userService').value;
            const phone = "584120700903";

            const mensaje = `Hola, solicito *${servicio}*, soy *${nombre}* de *${estado}*.`;
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`;

            window.open(whatsappUrl, '_blank');

            whatsappForm.reset();
            contactModal.classList.remove('active');
        });
    }

    // ----------------------------------------------------------------------
    // 6. BOTÓN FLOTANTE ESTÁTICO DE WHATSAPP + ALERT CON BARRA
    // ----------------------------------------------------------------------
    const floatingWhatsappBtn = document.getElementById('floatingWhatsappBtn');
    const whatsappToast = document.getElementById('whatsappToast');
    const toastProgressBar = document.getElementById('toastProgressBar');
    let toastTimeout = null;
    let isToastActive = false;

    function openWhatsAppDirectly() {
        const phone = "584120700903";
        const mensaje = "Hola, me gustaría obtener más información sobre los toldos y persianas.";
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`, '_blank');
    }

    function triggerToastAlert() {
        isToastActive = true;
        whatsappToast.classList.add('show');

        // Reiniciar barra de progreso animación
        toastProgressBar.style.transition = 'none';
        toastProgressBar.style.width = '0%';
        
        // Reflow para reiniciar la animación CSS por JS
        void toastProgressBar.offsetWidth;

        toastProgressBar.style.transition = 'width 3s linear';
        toastProgressBar.style.width = '100%';

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            whatsappToast.classList.remove('show');
            isToastActive = false;
        }, 3000);
    }

    if (floatingWhatsappBtn) {
        // Al dar clic por primera vez, muestra el alert con la barra. Si ya está activo, o al dar doble clic, redirige.
        floatingWhatsappBtn.addEventListener('click', () => {
            if (!isToastActive) {
                triggerToastAlert();
            } else {
                openWhatsAppDirectly();
            }
        });

        floatingWhatsappBtn.addEventListener('dblclick', () => {
            openWhatsAppDirectly();
        });
    }

    // ----------------------------------------------------------------------
    // 7. ACCORDION (PREGUNTAS FRECUENTES)
    // ----------------------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');

            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });

});