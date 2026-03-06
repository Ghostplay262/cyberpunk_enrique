document.addEventListener('DOMContentLoaded', () => {

    // 1. Floating Particles Background

    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 60;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.4 + 0.1;
                const colors = ['0, 243, 255', '255, 0, 127', '252, 226, 5'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
                // Glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(${this.color}, ${this.opacity * 0.5})`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 243, 255, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    
    // 2. Scroll Reveal Logic (staggered)

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    
    // 3. Navbar Scroll Effect

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }


    // 4. Animated Stat Counters

    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 2000;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        el.textContent = target;
                    }
                }
                requestAnimationFrame(updateCount);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statsObserver.observe(el));


    // 5. Smooth Parallax on Hero

    const hero = document.querySelector('.hero');
    const bandName = document.querySelector('.band-name');
    if (hero && bandName) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;
            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 1.2;
                const scale = 1 + scrolled * 0.0003;
                bandName.style.transform = `scale(${scale})`;
                bandName.style.opacity = Math.max(opacity, 0);
            }
        });
    }


    // 6. Typing effect for hero subtitle

    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 60 + Math.random() * 40);
            }
        }
        setTimeout(typeChar, 1200);
    }
});

// 7. Initialize Supabase

// 7. Initialize Supabase & Reviews

if (window.supabase) {
    const supabaseUrl = 'https://wgctyijulsbfxzzzgbeu.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnY3R5aWp1bHNiZnh6enpnYmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTYzNjcsImV4cCI6MjA4ODMzMjM2N30.xNBMhfwRS3NCqqN2yeZl21Ks4MTICt9mY621lXAbBCE';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Fetch concert locations for the dropdown
    async function loadConcertLocations() {
        const select = document.getElementById('review-location');
        if (!select) return;

        const { data, error } = await supabase
            .from('concerts')
            .select('location_name');

        if (error || !data) {
            console.error('Error fetching locations:', error);
            return;
        }

        const locations = [...new Set(data.map(item => item.location_name))];
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            select.appendChild(option);
        });
    }

    // Fetch and display reviews
    async function loadReviews() {
        const container = document.getElementById('reviews-list');
        if (!container) return;

        const { data, error } = await supabase
            .from('band_reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            container.innerHTML = '<p class="loading-reviews">Nie udało się załadować recenzji.</p>';
            console.error('Supabase error:', error);
            return;
        }

        if (!data || data.length === 0) {
            container.innerHTML = '<p class="loading-reviews">Brak recenzji. Bądź pierwszy!</p>';
            return;
        }

        container.innerHTML = data.map(review => `
            <div class="review-box scroll-reveal visible">
                <h3>${escapeHtml(review.location)}</h3>
                <p class="quote">${escapeHtml(review.content)}</p>
                <p class="reviewer-name">— ${escapeHtml(review.author)}</p>
            </div>
        `).join('');
    }

    // Submit a new review
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = reviewForm.querySelector('.review-submit-btn');
            const statusEl = document.getElementById('form-status');
            const author = document.getElementById('review-author').value.trim();
            const location = document.getElementById('review-location').value.trim();
            const content = document.getElementById('review-content').value.trim();

            if (!author || !location || !content) return;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Wysyłanie...';
            statusEl.textContent = '';
            statusEl.className = 'form-status';

            const { error } = await supabase
                .from('band_reviews')
                .insert([{ author, location, content }]);

            if (error) {
                statusEl.textContent = 'Błąd podczas wysyłania. Spróbuj ponownie.';
                statusEl.classList.add('error');
                console.error('Insert error:', error);
            } else {
                statusEl.textContent = 'Recenzja dodana pomyślnie!';
                statusEl.classList.add('success');
                reviewForm.reset();
                await loadReviews();
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Wyślij recenzję';
        });
    }

    // Helper to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Load reviews on page load
    loadReviews();
    loadConcertLocations();

    const locationSelect = document.getElementById('review-location');
    if(locationSelect) {
        locationSelect.addEventListener('change', () => {
            if(locationSelect.value) {
                locationSelect.classList.remove('select-placeholder');
            }
        });
    }
}