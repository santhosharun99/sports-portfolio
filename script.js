gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // 1. Generate line numbers to fill the IDE view
    const linesContainer = document.querySelector('.line-numbers');
    if (linesContainer && document.querySelector('.code-view')) {
        let linesHTML = '';
        for (let i = 1; i <= 150; i++) {
            linesHTML += `<div>${i}</div>`;
        }
        linesContainer.innerHTML = linesHTML;
    }

    // 2. Map blocks for ScrollTrigger animations
    const blocks = [
        { id: '#skills-section', code: '.anim-type-0' },
        { id: '#education-section', code: '.anim-type-1' },
        { id: '#experience-section', code: '.anim-type-2' },
        { id: '#aiml-section', code: '.anim-type-3' },
        { id: '#sports-section', code: '.anim-type-4' },
        { id: '#chemistry-section', code: '.anim-type-5' },
        { id: '#contact-section', code: '.anim-type-6' }
    ];

    blocks.forEach((block, index) => {
        const section = document.querySelector(block.id);
        if (!section) return;

        const codeEl = section.querySelector(block.code);
        const revealEl = section.querySelector('.content-reveal');

        if (!codeEl || !revealEl) return;

        // Hide initially so GSAP controls appearance
        gsap.set(revealEl, { opacity: 0, y: 30 });

        // Ensure inline-block and hidden width
        gsap.set(codeEl, {
            visibility: "visible",
            width: 0,
            borderRightColor: "transparent" // Terminal cursor color
        });

        // Create scroll timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: ".editor-content", // Listen to the IDE scroll container instead of main window
                start: "top 80%", // Triggers when section is 80% down the viewport
                once: true        // Only runs the animation once
            }
        });

        // B. Type out the function code
        tl.to(codeEl, { borderRightColor: "#00f2ff", duration: 0.1 }); // Show cursor active
        tl.to(codeEl, {
            width: "auto",      // Expands to natural bounds of text
            duration: 1.2,
            ease: "steps(35)",  // Makes it look like typing mechanically
        });
        tl.to(codeEl, { borderRightColor: "transparent", duration: 0.1 }); // Hide cursor

        // C. Reveal specific project section content
        tl.to(revealEl, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "+=0.2"); // Slight pause after typing finishes before content fades in
    });

    // 3. Initial Hero Entrance Animation
    const heroCode = document.querySelector("#hero-section .code-block");
    if (heroCode) {
        gsap.from(heroCode, { opacity: 0, y: 20, duration: 1, delay: 0.2 });
        gsap.from(".hero-reveal h1", { opacity: 0, x: -30, duration: 1, delay: 0.8 });
        gsap.from(".hero-reveal .subtitle, .hero-reveal .tech-stack-hero", {
            opacity: 0,
            y: 15,
            duration: 0.8,
            delay: 1.2,
            stagger: 0.2
        });
    }

    // 4. Sidebar Navigation & Active State Tracking
    const navLinks = document.querySelectorAll('.sidebar-files .file');
    const allSections = [
        document.querySelector('#hero-section'),
        document.querySelector('#skills-section'),
        document.querySelector('#education-section'),
        document.querySelector('#experience-section'),
        document.querySelector('#aiml-section'),
        document.querySelector('#sports-section'),
        document.querySelector('#chemistry-section'),
        document.querySelector('#contact-section')
    ];

    // Click to scroll
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            const targetEl = document.querySelector(targetId);
            const editorScrollData = document.querySelector('.editor-content');

            if (targetEl && editorScrollData) {
                editorScrollData.scrollTo({
                    top: targetEl.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll to update active class
    allSections.forEach((sec, i) => {
        if (!sec) return;
        ScrollTrigger.create({
            trigger: sec,
            scroller: ".editor-content",
            start: "top 50%",
            end: "bottom 50%",
            onToggle: self => {
                if (self.isActive && navLinks[i]) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLinks[i].classList.add('active');
                }
            }
        });
    });

    // 5. GitHub Repository Modal Logic
    const modalOverlay = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalReadme = document.getElementById('modal-readme-content');
    const modalRepoName = document.getElementById('modal-repo-name');
    const modalRepoUrl = document.getElementById('modal-repo-url');
    const modalStars = document.getElementById('modal-stars');
    const modalForks = document.getElementById('modal-forks');
    const modalLang = document.getElementById('modal-lang');

    // Setup marked.js options
    if (typeof marked !== 'undefined') {
        marked.setOptions({ breaks: true, gfm: true });
    }

    // Attach click listeners to cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', async () => {
            const repoPath = card.getAttribute('data-repo');
            if (!repoPath) return;

            // Extract summary details from card HTML
            const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent : "Project Overview";
            const cardDesc = card.querySelector('p') ? card.querySelector('p').textContent : "";
            const cardTagsHTML = card.querySelector('.tags') ? card.querySelector('.tags').innerHTML : "";

            // Determine Doodle based on title
            let doodleHTML = '';
            const t = cardTitle.toLowerCase();
            if (t.includes('cric') || t.includes('ind vs nz') || t.includes('ipl')) {
                doodleHTML = `<div class="doodle-container">
                                <div class="cric-pitch"></div>
                                <div class="cric-bat"></div>
                                <div class="cric-ball"></div>
                              </div>`;
            } else if (t.includes('tennis')) {
                doodleHTML = `<div class="doodle-container">
                                <div class="tennis-court">
                                  <div class="tennis-net"></div>
                                  <div class="tennis-player p1"></div>
                                  <div class="tennis-player p2"></div>
                                  <div class="tennis-ball"></div>
                                </div>
                              </div>`;
            } else if (t.includes('smell') || t.includes('chemistry')) {
                doodleHTML = `<div class="doodle-container">
                                <div class="chem-stem"></div>
                                <div class="chem-flask"><div class="chem-liquid"></div></div>
                                <div class="chem-bubble"></div><div class="chem-bubble"></div><div class="chem-bubble"></div>
                              </div>`;
            } else {
                // F1 or default fallback
                doodleHTML = `<div class="doodle-container">
                                <div class="f1-track"></div>
                                <div class="f1-car"></div>
                                <div class="f1-car c2"></div>
                              </div>`;
            }

            // Create Summary HTML element
            const summaryHTML = `
                <div style="background: rgba(0, 242, 255, 0.05); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid var(--accent); margin-bottom: 30px; overflow:hidden;">
                    ${doodleHTML}
                    <div style="padding: 0 20px 20px 20px;">
                        <h2 style="margin-top:0; padding-bottom:0.1em; border-bottom: none; color: #fff; font-size: 1.4rem;">${cardTitle}</h2>
                        <p style="color: var(--text-primary); font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px;">${cardDesc}</p>
                        <div style="display:flex; align-items:center; gap: 10px;">
                            <strong style="color: var(--text-muted); font-family: var(--font-mono); font-size:0.9rem;">Tech / Skills:</strong> 
                            <div style="display:inline-flex; gap: 8px; flex-wrap: wrap;" class="tags">${cardTagsHTML}</div>
                        </div>
                    </div>
                </div>
            `;

            // Prepare UI state
            modalOverlay.classList.add('active');
            modalRepoName.textContent = repoPath;
            modalRepoUrl.href = `https://github.com/${repoPath}`;
            modalReadme.innerHTML = summaryHTML + '<div class="loader"><i class="fas fa-spinner fa-spin"></i> Fetching live repository data from GitHub...</div>';
            modalStars.textContent = "0";
            modalForks.textContent = "0";
            modalLang.textContent = "Loading...";

            try {
                // 1. Fetch Stats
                const repoRes = await fetch(`https://api.github.com/repos/${repoPath}`);
                let repoDesc = "No description provided.";

                if (repoRes.ok) {
                    const repoData = await repoRes.json();
                    modalStars.textContent = repoData.stargazers_count;
                    modalForks.textContent = repoData.forks_count;
                    if (repoData.language) modalLang.textContent = repoData.language;
                    if (repoData.description) repoDesc = repoData.description;
                }

                // 2. Fetch README Content
                const readmeRes = await fetch(`https://api.github.com/repos/${repoPath}/readme`);

                if (!readmeRes.ok) {
                    // Fallback to description if no README exists
                    modalReadme.innerHTML = summaryHTML + `
                        <div style="padding: 20px; font-family:var(--font-mono);">
                            <h3 style="color: var(--text-muted);"><i class="fas fa-info-circle"></i> No README.md present</h3>
                            <p style="color: var(--text-primary); font-size: 1.1em; margin-top: 15px; line-height: 1.6; white-space: pre-wrap;">${repoDesc}</p>
                            <p style="margin-top: 30px;">
                                <a href="https://github.com/${repoPath}" target="_blank" class="github-btn" style="display:inline-block;">View source code on GitHub</a>
                            </p>
                        </div>
                    `;
                    return;
                }

                const readmeData = await readmeRes.json();

                // Decode base64 unicode properly
                const decodedText = decodeURIComponent(escape(window.atob(readmeData.content)));

                // Parse markdown
                modalReadme.innerHTML = summaryHTML + marked.parse(decodedText);
            } catch (error) {
                console.error("Github Fetch Error:", error);
                modalReadme.innerHTML = summaryHTML + `
                    <div style="color: #f85149; text-align: center; margin-top: 40px; font-family:var(--font-mono);">
                        <h3><i class="fas fa-exclamation-triangle"></i> Data Fetch Failed</h3>
                        <p style="color: var(--text-primary); margin-top: 10px;">We couldn't reach the GitHub API. It might be rate-limited.</p>
                        <a href="https://github.com/${repoPath}" target="_blank" class="github-btn" style="display:inline-block; margin-top:20px;">
                            View directly on GitHub
                        </a>
                    </div>
                `;
            }
        });
    });

    // Close Modal Events
    modalCloseBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        themeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-theme');
            if (document.documentElement.classList.contains('light-theme')) {
                icon.classList.replace('fa-sun', 'fa-moon');
            } else {
                icon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    }

});
