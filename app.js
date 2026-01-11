// ===========================
// MOBILE MENU FUNCTIONALITY
// ===========================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// ===========================
// SCROLL TO TOP BUTTON
// ===========================
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.remove('opacity-0', 'invisible');
        scrollTopBtn.classList.add('opacity-100', 'visible');
    } else {
        scrollTopBtn.classList.add('opacity-0', 'invisible');
        scrollTopBtn.classList.remove('opacity-100', 'visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===========================
// PENGURUS MODAL SYSTEM
// ===========================
class PengurusModal {
    constructor(group) {
        this.group = group;
        this.cards = group.querySelectorAll('.pengurus-card');
        this.modal = group.querySelector('.pengurusModal');
        
        if (!this.modal) return;
        
        this.closeBtn = this.modal.querySelector('.closeModalBtn');
        this.init();
    }
    
    init() {
        // Add click event to each card
        this.cards.forEach(card => {
            card.addEventListener('click', () => this.openModal(card));
        });
        
        // Close button
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // Close when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }
    
    openModal(card) {
        const data = {
            name: card.dataset.name,
            jabatan: card.dataset.jabatan,
            fotoBersama: card.dataset.fotoBersama,
            bio: card.dataset.bio,
            program: card.dataset.program
        };
        
        // Populate modal content (guard elements - different group modals may vary)
        const nameEl = this.modal.querySelector('.modalName');
        const jabatanEl = this.modal.querySelector('.modalJabatan');
        const bioEl = this.modal.querySelector('.modalBio');
        // removed per-person small image element; modals show only group photo

      
        if (jabatanEl) jabatanEl.textContent = data.jabatan || '';
        if (bioEl) bioEl.textContent = data.bio || '';
        // Prefer showing the group photo (if available) otherwise fall back to the individual image
        const fotoBersamaEl = this.modal.querySelector('.modalFotoBersama');
        if (fotoBersamaEl && (data.fotoBersama || data.image)) {
            fotoBersamaEl.src = data.fotoBersama || data.image || '';
            fotoBersamaEl.style.display = '';
        } else {
            if (fotoBersamaEl) fotoBersamaEl.style.display = 'none';
        }        
        // Populate program kerja
        const programList = this.modal.querySelector('.modalProgram');
        programList.innerHTML = '';
        if (data.program) {
            data.program.split(',').forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.trim();
                programList.appendChild(li);
            });
        }
        
        // Show modal
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Initialize all pengurus modals
document.querySelectorAll('.pengurus-group').forEach(group => {
    new PengurusModal(group);
});

// init AOS animations (if loaded by page)
if (window.AOS) {
    AOS.init({ duration: 800, once: true });
}

// Gallery modal is handled directly via inline script in index.html (keeps app.js lighter)

// ===========================
// DEPARTEMEN MODAL SYSTEM
// ===========================
class DepartemenModal {
    constructor() {
        this.cards = document.querySelectorAll('.departemen-card');
        this.modal = document.getElementById('departemenModal');
        this.closeBtn = document.getElementById('closeDepartemenModal');
        
        if (!this.modal) return;
        
        this.init();
    }
    
    init() {
        // Add click event to each card
        this.cards.forEach(card => {
            card.addEventListener('click', () => this.openModal(card));
        });
        
        // Close button
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // Close when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }
    
    openModal(card) {
        const data = {
            nama: card.dataset.nama,
            deskripsi: card.dataset.deskripsi,
            program: card.dataset.program,
            agenda: card.dataset.agenda,
            foto: card.dataset.foto,
            anggota: JSON.parse(card.dataset.anggota)
        };
        
        // Populate modal content
        document.getElementById('modalDepartemenNama').textContent = data.nama;
        document.getElementById('modalDepartemenDeskripsi').textContent = data.deskripsi;
        document.getElementById('modalDepartemenFoto').src = data.foto || '';
        
        // Populate anggota
        const anggotaContainer = document.getElementById('modalAnggota');
        anggotaContainer.innerHTML = '';
        data.anggota.forEach(member => {
            const div = document.createElement('div');
            div.className = 'bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors';
            div.innerHTML = `
                <p class="font-semibold text-gray-800">${member.jabatan}</p>
                <p class="text-gray-600">${member.nama}</p>
            `;
            anggotaContainer.appendChild(div);
        });
        
        // Populate program kerja
        const programList = document.getElementById('modalDepartemenProgram');
        programList.innerHTML = '';
        if (data.program) {
            data.program.split(',').forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.trim();
                programList.appendChild(li);
            });
        }
        
        // Populate agenda
        const agendaList = document.getElementById('modalDepartemenAgenda');
        agendaList.innerHTML = '';
        if (data.agenda) {
            data.agenda.split(',').forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.trim();
                agendaList.appendChild(li);
            });
        } else {
            agendaList.innerHTML = '<li class="text-gray-500 italic">Tidak ada agenda saat ini</li>';
        }
        
        // Show modal
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Initialize departemen modal
new DepartemenModal();

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// LOADING ANIMATION
// ===========================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===========================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card-hover, .departemen-card, .fade-in-up').forEach(el => {
    observer.observe(el);
});

// ===========================
// CONSOLE MESSAGE
// ===========================
console.log('%c HMPSIK Website ', 'background: #667eea; color: white; font-size: 20px; padding: 10px;');
console.log('%c Developed with ❤️ for HMPS Ilmu Keperawatan S1 UMP ', 'color: #667eea; font-size: 12px;');