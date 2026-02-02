/**
 * Astronaut Companion Script
 * Injects a floating personalized astronaut into navigation pages.
 */

(function () {
    function initAstronaut() {
        const saved = localStorage.getItem('astro_settings');
        if (!saved) return;

        const data = JSON.parse(saved);
        if (!data.name) return;

        // Create Container
        const container = document.createElement('div');
        container.id = 'astro-companion';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 150px;
            height: 150px;
            z-index: 9999;
            pointer-events: none;
            transition: all 0.5s ease;
        `;

        // Apply "Floating" animation if profile exists
        container.style.animation = "astro-float 4s ease-in-out infinite";

        // SVG Content from design.html
        const svgHTML = `
            <svg width="100%" height="100%" viewBox="0 -50 200 270" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="astro-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <!-- Ruksak -->
                <rect x="60" y="90" width="80" height="90" rx="20" fill="${data.suit || '#ffffff'}" style="filter: brightness(0.8);" />
                <!-- Tijelo -->
                <rect x="65" y="110" width="70" height="85" rx="35" fill="${data.suit || '#ffffff'}" />
                <!-- Ručice -->
                <circle cx="55" cy="140" r="14" fill="${data.suit || '#ffffff'}" />
                <circle cx="145" cy="140" r="14" fill="${data.suit || '#ffffff'}" />
                <!-- Kaciga -->
                <circle cx="100" cy="70" r="65" fill="${data.suit || '#ffffff'}" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
                <!-- Vizir -->
                <rect x="55" y="45" width="90" height="55" rx="25" fill="${data.visor || '#00d2ff'}" />
                <!-- VELIKE OČI -->
                <circle cx="82" cy="72" r="10" fill="${data.eye || '#333333'}" />
                <circle cx="118" cy="72" r="10" fill="${data.eye || '#333333'}" />
                <!-- Sjaj u očima -->
                <circle cx="85" cy="68" r="3.5" fill="white" />
                <circle cx="121" cy="68" r="3.5" fill="white" />
                <!-- Nožice -->
                <rect x="70" y="190" width="25" height="15" rx="7" fill="#111" />
                <rect x="105" y="190" width="25" height="15" rx="7" fill="#111" />
                <!-- Sjaj na viziru -->
                <path d="M70 50 Q100 40 130 50" stroke="white" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.3" />
                <!-- HAT (CUSTOM) -->
                <g>${data.hat || ''}</g>
            </svg>
            <div style="
                text-align: center; 
                background: rgba(112, 0, 255, 0.8); 
                color: white; 
                font-size: 0.8rem; 
                padding: 4px 10px; 
                border-radius: 20px; 
                margin-top: -10px;
                border: 2px solid #00f2ff;
                font-family: 'OpenDyslexic', sans-serif;
                box-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
            ">${data.name.toUpperCase()}</div>
        `;

        container.innerHTML = svgHTML;

        // Injected Styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes astro-float {
                0%, 100% { transform: translateY(0) rotate(2deg); }
                50% { transform: translateY(-15px) rotate(-2deg); }
            }
            #astro-companion svg {
                filter: drop-shadow(0 0 10px rgba(112, 0, 255, 0.5));
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(container);

        // Add hover effect to container to move slightly away from mouse
        document.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);
            const dist = Math.hypot(dx, dy);

            if (dist < 200) {
                const moveX = (dx / dist) * -20;
                const moveY = (dy / dist) * -20;
                container.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                container.style.transform = `translate(0, 0)`;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAstronaut);
    } else {
        initAstronaut();
    }
})();
