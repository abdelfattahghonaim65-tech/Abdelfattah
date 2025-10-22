const testimonials = [
    { name: "Islam", feedback: "Abdel Fattah is a very creative and hardworking person. Thank you Abdel Fattah.", avatar: "./public/Islam.png" },
    { name: "Ziad Ahmed", feedback: "Abdel Fattah is creative and loves learning very much, and I can attest to that. Thank you Abdel Fattah.", avatar: "./public/zyiad.png" },
    { name: "Mohab Mohamed", feedback: "Abdel Fattah is very punctual. He delivered the video the day before work and in very high quality. Thank you Abdel Fattah.", avatar: "./public/Mohab Mohamed.png" },
];

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

function loadTestimonials() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid) return;

    testimonials.forEach((testimonial, index) => {
        const card = document.createElement('div');
        card.className = `floating-window testimonial-card delay-${index % 6}`;
        card.innerHTML = `
            <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
            <div class="testimonial-stars">★★★★★</div>
            <h3 class="text-xl font-bold mb-2 text-blue-300">${testimonial.name}</h3>
            <p class="text-gray-300">"${testimonial.feedback}"</p>
        `;
        grid.appendChild(card);
    });
}

function initGame() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const finalScoreDisplay = document.getElementById('final-score');
    const gameOverScreen = document.getElementById('game-over');
    const restartBtn = document.getElementById('restart-btn');

    let score = 0;
    let timeLeft = 30;
    let gameActive = false;
    let orbs = [];
    let animationId;
    let timerInterval;

    function resizeCanvas() {
        const container = document.getElementById('game-container');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }

    class Orb {
        constructor() {
            this.radius = 15 + Math.random() * 20;
            this.x = this.radius + Math.random() * (canvas.width - this.radius * 2);
            this.y = this.radius + Math.random() * (canvas.height - this.radius * 2);
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = (Math.random() - 0.5) * 3;
            this.color = Math.random() > 0.5 ? '#60a5fa' : '#34d399';
            this.pulsePhase = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
                this.vx *= -1;
            }
            if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
                this.vy *= -1;
            }

            this.pulsePhase += 0.05;
        }

        draw() {
            const pulse = Math.sin(this.pulsePhase) * 5;
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius + pulse);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.5, this.color + '80');
            gradient.addColorStop(1, this.color + '00');

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + pulse, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        contains(x, y) {
            const dx = x - this.x;
            const dy = y - this.y;
            return dx * dx + dy * dy < this.radius * this.radius;
        }
    }

    function startGame() {
        score = 0;
        timeLeft = 30;
        orbs = [];
        gameActive = true;
        gameOverScreen.classList.add('hidden');

        for (let i = 0; i < 5; i++) {
            orbs.push(new Orb());
        }

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);

        gameLoop();
    }

    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        cancelAnimationFrame(animationId);
        finalScoreDisplay.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    function gameLoop() {
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        orbs.forEach(orb => {
            orb.update();
            orb.draw();
        });

        animationId = requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener('click', (e) => {
        if (!gameActive) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = orbs.length - 1; i >= 0; i--) {
            if (orbs[i].contains(x, y)) {
                score += 10;
                scoreDisplay.textContent = score;
                orbs.splice(i, 1);
                orbs.push(new Orb());
                break;
            }
        }
    });

    restartBtn.addEventListener('click', startGame);

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    startGame();
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    loadTestimonials();
    initGame();
});
const pages = [{ title: "Home", url: "/Abdelfattah/" },
  { title: 'clients', url: '/Abdelfattah/clients.html' },
  { title: "portfolio", url: "/Abdelfattah/portfolio.html" },
  { title: "Contact", url: "/Abdelfattah/contact.html" }
]


function createNextPageBtn() {
   const currentPath = window.location.pathname;
   const currentIndex = pages.findIndex(page => page.url === currentPath);
   const nextIndex = (currentIndex + 1) % pages.length;
   const nextPage = pages[nextIndex];

   const nextPageBtn = document.createElement('a');
   nextPageBtn.href = nextPage.url;
   nextPageBtn.textContent = `Next: ${nextPage.title}`;
   nextPageBtn.style.position = 'fixed';
   nextPageBtn.style.bottom = '10px';
   nextPageBtn.style.right = '10px';
   nextPageBtn.style.padding = '10px 15px';
   nextPageBtn.style.backgroundColor = '#60a5fa';
   nextPageBtn.style.color = '#FFFFFF';
   nextPageBtn.style.textDecoration = 'none';
   nextPageBtn.style.borderRadius = '5px';
   nextPageBtn.style.zIndex = '1000';

   document.body.appendChild(nextPageBtn);
}


function createPrevPageBtn() {
   const currentPath = window.location.pathname;
   const currentIndex = pages.findIndex(page => page.url === currentPath);
   const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
   const prevPage = pages[prevIndex];

   const prevPageBtn = document.createElement('a');
   prevPageBtn.href = prevPage.url;
   prevPageBtn.textContent = `Previous: ${prevPage.title}`;
   prevPageBtn.style.position = 'fixed';
   prevPageBtn.style.bottom = '10px';
   prevPageBtn.style.left = '10px';
   prevPageBtn.style.padding = '10px 15px';
   prevPageBtn.style.backgroundColor = '#28A745';
   prevPageBtn.style.color = '#FFFFFF';
   prevPageBtn.style.textDecoration = 'none';
   prevPageBtn.style.borderRadius = '5px';
   prevPageBtn.style.zIndex = '1000';

   document.body.appendChild(prevPageBtn);
}

function renderBtns() {
   createNextPageBtn();
   createPrevPageBtn();
}

window.onload = renderBtns;
