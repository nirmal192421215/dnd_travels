/* ==========================================================================
   DND Travels - Interactivity and Animation Layer
   ========================================================================== */
/* jshint esversion: 6 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Particle Background Animation ---
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    const particleCount = 45;
    
    // Resize Canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2.5 + 0.5;
            // Soft amber and cyan for bright/light theme
            this.color = Math.random() > 0.5 ? "rgba(0, 142, 166," : "rgba(217, 119, 6,";
            this.alpha = Math.random() * 0.25 + 0.05;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color} ${this.alpha})`;
            ctx.fill();
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Screen wrapping
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
    }
    
    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connection lines
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 120) {
                    const alpha = (120 - dist) / 120 * 0.06;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 100, 120, ${alpha})`;
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation Loop — canvas background is transparent for bright theme
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        requestAnimationFrame(animate);
    }
    animate();

    // --- 2. Floating Navbar Scroll Effect & Scroll Spy ---
    const navbar = document.getElementById("main-navbar");
    const sections = document.querySelectorAll("section, header[id]");
    const navLinksArray = document.querySelectorAll(".nav-links a:not(.nav-cta)");

    window.addEventListener("scroll", () => {
        let current = "";
        
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
        
        // Scroll spy logic
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navLinksArray.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === "#" + current || (current === "home" && href === "#")) {
                link.classList.add("active");
            }
        });
    });

    // --- 3. Mobile Navigation Menu Toggle ---
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navLinks = document.getElementById("nav-links");
    
    mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = mobileMenuBtn.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });
    
    // Close mobile menu on link click
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            mobileMenuBtn.querySelector("i").className = "fa-solid fa-bars";
        });
    });

    // --- 4. Booking System Dropdowns & Form Management ---
    const bookingTypeSelect = document.getElementById("booking-type");
    const bookingSelection = document.getElementById("booking-selection");
    
    const rentalsList = [
        { value: "Mahindra Thar 4x4", label: "Mahindra Thar 4x4 (SUV - ₹3,500/day)" },
        { value: "Luxe Tempo Traveller", label: "Luxe Tempo Traveller (Coach - ₹6,000/day)" },
        { value: "Toyota Fortuner", label: "Toyota Fortuner (Premium SUV - ₹6,000/day)" },
        { value: "Toyota Innova Crysta", label: "Toyota Innova Crysta (Comfort Travel - ₹4,500/day)" },
        { value: "Maruti Suzuki Swift Dzire", label: "Maruti Suzuki Swift Dzire (Economy Sedan - ₹2,000/day)" },
        { value: "Royal Enfield Classic 350", label: "Royal Enfield Classic 350 (Classic Bike - ₹1,000/day)" }
    ];
    
    const packagesList = [
        { value: "Ooty: Misty Tea Gardens", label: "Ooty: Misty Tea Gardens (3 Days - ₹12,000/pax)" },
        { value: "Kodaikanal: Princess of Valleys", label: "Kodaikanal: Princess of Valleys (3 Days - ₹11,500/pax)" },
        { value: "Yercaud: Coffee Estate Escapes", label: "Yercaud: Coffee Estate Escapes (2 Days - ₹7,500/pax)" },
        { value: "Rameswaram: Spiritual Shores", label: "Rameswaram: Spiritual Shores (2 Days - ₹9,000/pax)" },
        { value: "Kanyakumari: Sun & Seas", label: "Kanyakumari: Sun & Seas (2 Days - ₹9,500/pax)" },
        { value: "Chennai: Coastal Heritage", label: "Chennai: Coastal Heritage (1 Day - ₹4,000/pax)" }
    ];
    
    function updateSelectionDropdown() {
        const type = bookingTypeSelect.value;
        bookingSelection.innerHTML = "";
        
        const list = type === "rental" ? rentalsList : packagesList;
        
        list.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.value;
            opt.textContent = item.label;
            bookingSelection.appendChild(opt);
        });
    }
    
    bookingTypeSelect.addEventListener("change", updateSelectionDropdown);
    updateSelectionDropdown(); // Initial call

    // --- 5. Fleets & Packages Selection Redirects ---
    function selectItemAndScroll(type, itemName) {
        bookingTypeSelect.value = type;
        updateSelectionDropdown();
        bookingSelection.value = itemName;
        
        // Smooth scroll to form
        const bookingSection = document.getElementById("booking");
        bookingSection.scrollIntoView({ behavior: "smooth" });
    }
    
    // Vehicle book buttons
    document.querySelectorAll(".book-trigger").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const vehicleName = btn.getAttribute("data-vehicle");
            selectItemAndScroll("rental", vehicleName);
        });
    });
    
    // Package select buttons
    document.querySelectorAll(".package-book-trigger").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const packageName = btn.getAttribute("data-package");
            selectItemAndScroll("package", packageName);
        });
    });

    // --- 6. WhatsApp Booking Generation ---
    const bookingForm = document.getElementById("booking-form");
    
    bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const type = bookingTypeSelect.value;
        const selection = bookingSelection.value;
        const pickupLoc = document.getElementById("pickup-loc").value;
        const dropLoc = document.getElementById("drop-loc").value;
        const dateVal = document.getElementById("pickup-date").value;
        const passengerCount = document.getElementById("passengers").value;
        const nameVal = document.getElementById("cust-name").value;
        const phoneVal = document.getElementById("cust-phone").value;
        
        // Format Date nicely
        let formattedDate = dateVal;
        try {
            const dateObj = new Date(dateVal);
            formattedDate = dateObj.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
        } catch(err) {}
        
        const serviceHeader = type === "rental" ? "🚘 VEHICLE RENTAL REQUEST" : "🎒 TOUR PACKAGE BOOKING";
        
        // WhatsApp API text
        const textMessage = 
`🚀 *DND TRAVELS TAMIL NADU* 🚀
*===========================*
${serviceHeader}
*===========================*

👤 *Customer Name:* ${nameVal}
📞 *Contact Number:* ${phoneVal}

📍 *Selected Option:* ${selection}
🛫 *Pickup Hub:* ${pickupLoc}
🏁 *Drop-off Hub:* ${dropLoc}
📅 *Journey Date:* ${formattedDate}
👥 *Travelers count:* ${passengerCount} Person(s)

*===========================*
Please confirm slot availability.
_Sent from DND Travels Web Portal_`;

        const encodedText = encodeURIComponent(textMessage);
        // Direct to DND travels mock number
        const whatsappNumber = "919342626096";
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;
        
        window.open(whatsappUrl, "_blank");
    });

    // Set today as minimum booking date
    const dateInput = document.getElementById("pickup-date");
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;

    // --- 7. Interactive Fleet Category Filter Tabs ---
    const filterTabs = document.querySelectorAll(".filter-tab");
    const vehicleCards = document.querySelectorAll(".vehicle-card");
    
    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active status
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const filterValue = tab.getAttribute("data-filter");
            
            vehicleCards.forEach(card => {
                const category = card.getAttribute("data-category");
                
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "flex";
                    // Apply brief animation
                    card.style.opacity = "0";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 50);
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // --- 8. Statistics Counter Animation ---
    const counterSection = document.getElementById("stats-counter-section");
    const counters = document.querySelectorAll(".stat-number");
    let countersAnimated = false;
    
    function startCounting(counter) {
        const target = parseFloat(counter.getAttribute("data-target"));
        const isDecimal = target % 1 !== 0;
        const duration = 2000; // 2 seconds
        const stepTime = 15;
        const totalSteps = duration / stepTime;
        const stepValue = target / totalSteps;
        let current = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            current += stepValue;
            
            if (step >= totalSteps) {
                counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString("en-IN") + "+";
                clearInterval(timer);
            } else {
                counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString("en-IN") + "+";
            }
        }, stepTime);
    }
    
    function checkScrollCounters() {
        if (!counterSection) return;
        const rect = counterSection.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isInViewport && !countersAnimated) {
            countersAnimated = true;
            counters.forEach(counter => startCounting(counter));
        }
    }
    
    window.addEventListener("scroll", checkScrollCounters);
    checkScrollCounters(); // Run initially in case it's already in view

    // --- 9. FAQ Section Accordion ---
    const faqItems = document.querySelectorAll(".faq-item");
    
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        
        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Close other FAQs
            faqItems.forEach(i => {
                i.classList.remove("active");
                i.querySelector(".faq-answer").style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- 10. Hero Slideshow Logic ---
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlideIndex = 0;
        setInterval(() => {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        }, 3000);
    }
});
