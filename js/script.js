import { createClient } from '@supabase/supabase-js'
import emailjs from '@emailjs/browser'

// Global Error Handler
window.addEventListener('error', (e) => {
    console.error('Handled Script Error:', e.message);
});

// Protocol Detection & Warning
const isLocalFile = window.location.protocol === 'file:';

document.addEventListener("DOMContentLoaded", () => {
    // Show warning if on file protocol
    if (isLocalFile) {
        const warning = document.getElementById('protocol-warning');
        if (warning) warning.style.display = 'block';
        console.error('CRITICAL: Use http://localhost:3000 for Chatbot & Database features.');
    }

    // Supabase Initialization
    let supabase = null;
    try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (url && key && !url.includes('YOUR_')) {
            supabase = createClient(url, key);
        }
    } catch (e) { console.warn('Supabase not found'); }

    // EmailJS Initialization
    try {
        const pubKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        if (pubKey && !pubKey.includes('YOUR_')) emailjs.init(pubKey);
    } catch (e) { console.warn('EmailJS not found'); }

    // 1. Preloader
    const preloader = document.querySelector(".preloader");
    const hidePreloader = () => {
        if (preloader) {
            preloader.style.opacity = "0";
            preloader.style.pointerEvents = "none";
            setTimeout(() => preloader.style.display = "none", 500);
        }
    };
    window.addEventListener("load", hidePreloader);
    setTimeout(hidePreloader, 3000);

    // 2. Custom Cursor & Glow
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const glow = document.querySelector('.mouse-glow');
    let mX = 0, mY = 0, oX = 0, oY = 0;

    window.addEventListener('mousemove', (e) => {
        mX = e.clientX;
        mY = e.clientY;
        if (cursorDot) cursorDot.style.transform = `translate3d(${mX}px, ${mY}px, 0)`;
        if (glow) glow.style.transform = `translate3d(${mX}px, ${mY}px, 0)`;
    });

    function animateCursor() {
        oX += (mX - oX) * 0.15;
        oY += (mY - oY) * 0.15;
        if (cursorOutline) cursorOutline.style.transform = `translate3d(${oX}px, ${oY}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const setupHovers = () => {
        document.querySelectorAll('a, button, .skill-card, .project-card, .magnetic').forEach(el => {
            el.onmouseenter = () => document.body.classList.add('cursor-hover');
            el.onmouseleave = () => document.body.classList.remove('cursor-hover');
        });
    };
    setupHovers();

    // 3. Navbar Scroll & Scroll Spy
    const header = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section[id]");

    const handleScroll = () => {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    sections.forEach(section => navObserver.observe(section));

    // 4. Magnetic Effect
    document.querySelectorAll('.magnetic').forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const r = this.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            this.style.transition = 'none'; 
            this.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
        });
        item.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.5s ease';
            this.style.transform = 'translate3d(0, 0, 0)';
        });
    });

    // 4. Chatbot
    const chatContainer = document.getElementById('chatbot-container');
    const chatToggle = document.getElementById('chat-toggle');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-messages');

    if (chatToggle) chatToggle.onclick = () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            setTimeout(() => chatInput?.focus(), 300);
        }
    };
    if (closeBtn) closeBtn.onclick = () => chatContainer.classList.remove('active');

    const addMsg = (txt, type) => {
        if (!chatBox) return null;
        const d = document.createElement('div');
        d.className = `message ${type}`;
        d.textContent = txt;
        chatBox.appendChild(d);
        chatBox.scrollTop = chatBox.scrollHeight;
        return d;
    };
    // Mock data for local chatbot
    const chatbotData = [
        {
            keywords: ["hi", "hello", "hey", "hii"],
            reply: "Hey there! 👋 I’m Sarvesh’s virtual assistant. Ask me anything about his skills, projects, or contact details!"
        },
        {
            keywords: ["who are you", "what is this", "bot", "chatbot"],
            reply: "I’m a friendly chatbot built for Sarvesh’s portfolio website 🤖. I can help you learn about his work and skills!"
        },
        {
            keywords: ["name", "your name", "who is sarvesh"],
            reply: "He’s Sarvesh S, a B.Tech AI & Data Science student passionate about Machine Learning and Web Development 🚀"
        },
        {
            keywords: ["skills", "technologies", "tech stack", "what can you do"],
            reply: "Sarvesh works with Python, Scikit-learn, Pandas, NumPy, Tkinter, HTML, CSS, C++ and Java. He enjoys building ML models and websites 💻"
        },
        {
            keywords: ["projects", "project", "work", "portfolio"],
            reply: "Sarvesh has worked on Machine Learning and web-based projects. Two highlights are Bangalore House Price Prediction 🏠📊 and Health Tech Care 🩺💻."
        },
        {
            keywords: ["health", "healthtech", "health tech", "medical", "hospital", "care"],
            reply: "Health Tech Care 🩺 is an advanced healthcare project by Sarvesh featuring an Advanced Calling System and GPS Tracking System for emergency care. Check it out: https://github.com/sarveshsundaram26/healthtech-final"
        },
        {
            keywords: ["bangalore", "house price", "price prediction", "ml project"],
            reply: "The Bangalore House Price Prediction project uses Machine Learning (Scikit-learn, Pandas, NumPy) to estimate property prices based on location and features 📊"
        },
        {
            keywords: ["education", "college", "study", "degree"],
            reply: "Sarvesh is pursuing B.Tech in Artificial Intelligence & Data Science at SNS College of Technology, Coimbatore 🎓"
        },
        {
            keywords: ["certifications", "certification", "courses"],
            reply: "Sarvesh has completed two major certifications: a Python Completion certificate and an Analytic Vidhya Data Science course 🧾"
        },
        {
            keywords: ["contact", "email", "phone", "github", "reach"],
            reply: "You can contact Sarvesh at 📧 sarveshsundaram26@gmail.com or check his GitHub: https://github.com/sarveshsundaram26"
        },
        {
            keywords: ["hire", "internship", "job", "work with you"],
            reply: "Sarvesh is open to internships and project collaborations 🤝 Feel free to reach out!"
        },
        {
            keywords: ["bye", "goodbye", "see you"],
            reply: "Thanks for chatting! 👋 Have a great day!"
        },
        {
            keywords: ["default"],
            reply: "Hmm 🤔 I didn’t get that. Try asking about skills, projects (like Health Tech Care), education, or contact info!"
        }
    ];

    const getLocalReply = (input) => {
        const text = input.toLowerCase();
        for (const item of chatbotData) {
            if (item.keywords.some(k => text.includes(k) && k !== "default")) {
                return item.reply;
            }
        }
        return chatbotData.find(d => d.keywords.includes("default")).reply;
    };

    const handleChat = async () => {
        const val = chatInput.value.trim();
        if (!val) return;
        addMsg(val, 'user-msg');
        chatInput.value = '';
        
        const loader = addMsg("Thinking...", 'ai-msg');
        
        // Simulate small delay for natural feel
        setTimeout(() => {
            const res = getLocalReply(val);
            if (loader) loader.textContent = res;
        }, 600);
    };

    // Ensure input is accessible
    if (chatInput) {
        chatInput.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            chatInput.focus();
        });
        chatInput.onfocus = () => console.log("Chat input focused");
    }

    if (sendBtn) sendBtn.onclick = handleChat;
    if (chatInput) chatInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleChat();
        }
    };

    // 5. Typing Text
    const tText = document.getElementById("typing-text");
    const phrases = ["AI Enthusiast", "ML Developer", "Web Developer"];
    let pI = 0, cI = 0, isD = false;
    const type = () => {
        const cP = phrases[pI];
        if (tText) {
            tText.textContent = isD ? cP.substring(0, cI--) : cP.substring(0, ++cI);
            let s = isD ? 50 : 100;
            if (!isD && cI === cP.length) { isD = true; s = 2000; }
            else if (isD && cI === 0) { isD = false; pI = (pI + 1) % phrases.length; s = 500; }
            setTimeout(type, s);
        }
    };
    type();

    // 6. Theme
    const tToggle = document.getElementById('theme-toggle');
    if (tToggle) {
        const i = tToggle.querySelector("i");
        const set = (l) => {
            document.body.classList.toggle('light-theme', l);
            document.body.classList.toggle('dark-theme', !l);
            if (i) i.className = l ? "fas fa-sun" : "fas fa-moon";
            localStorage.setItem('p-theme', l ? 'l' : 'd');
        };
        tToggle.onclick = () => set(!document.body.classList.contains('light-theme'));
        if (localStorage.getItem('p-theme') === 'l') set(true);
    }

    // 7. Skills Animation
    const obs = new IntersectionObserver((es) => {
        es.forEach(e => {
            if (e.isIntersecting && e.target.classList.contains('progress')) {
                const card = e.target.closest('.skill-card');
                const pEl = card?.querySelector('.skill-percent');
                const p = parseInt(window.getComputedStyle(e.target).getPropertyValue('--percent')) || 0;
                
                if (pEl && !pEl.dataset.anim) {
                    let cur = 0;
                    const itv = setInterval(() => {
                        cur += p/20;
                        if (cur >= p) { pEl.textContent = p+'%'; clearInterval(itv); }
                        else pEl.textContent = Math.ceil(cur)+'%';
                    }, 50);
                    pEl.dataset.anim = "1";
                }
                const rad = e.target.r.baseVal.value;
                const circ = 2 * Math.PI * rad;
                e.target.style.strokeDasharray = circ;
                e.target.style.strokeDashoffset = circ - (circ * p) / 100;
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.skill-svg .progress').forEach(el => obs.observe(el));

    // 8. Form
    const cForm = document.getElementById("contactForm");
    if (cForm) {
        cForm.onsubmit = async (e) => {
            e.preventDefault();
            const b = cForm.querySelector("button");
            const fd = {
                name: document.getElementById('name')?.value || '',
                email: document.getElementById('email')?.value || '',
                message: document.getElementById('message')?.value || ''
            };
            if (b) b.textContent = "Sending...";
            try {
                let dbSuccess = false;
                if (supabase) {
                   const { error: sbErr } = await supabase.from('contacts').insert([fd]);
                   if (sbErr) throw sbErr;
                   dbSuccess = true;
                }
                
                try {
                    if (import.meta.env.VITE_EMAILJS_SERVICE_ID && !import.meta.env.VITE_EMAILJS_SERVICE_ID.includes('YOUR_')) {
                        console.log('Attempting EmailJS send with:', { 
                            service: import.meta.env.VITE_EMAILJS_SERVICE_ID, 
                            template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID 
                        });
                        const emailResult = await emailjs.send(
                            import.meta.env.VITE_EMAILJS_SERVICE_ID, 
                            import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
                            {
                                // Multiple variations to ensure mapping success
                                name: fd.name,
                                from_name: fd.name,
                                user_name: fd.name,
                                
                                email: fd.email,
                                from_email: fd.email,
                                user_email: fd.email,
                                reply_to: fd.email,
                                
                                message: fd.message,
                                message_html: fd.message,
                                
                                time: new Date().toLocaleString(),
                                to_email: 'sarveshsundaram26@gmail.com'
                            }
                        );
                        console.log('EmailJS Success:', emailResult);
                    }
                } catch (emailErr) {
                    // Log the actual error text provided by EmailJS
                    const errorText = emailErr?.text || emailErr?.message || JSON.stringify(emailErr);
                    console.error('CRITICAL EMAILJS FAILURE:', errorText);
                }
                
                // Show Success Message (Since data is in DB)
                const successMsg = document.getElementById('contact-success');
                if (successMsg) {
                    successMsg.classList.add('show');
                    setTimeout(() => successMsg.classList.remove('show'), 5000);
                }
                
                cForm.reset();
            } catch (err) { 
                console.error('DATABASE ERROR:', err);
                let errorMsg = err.message || "Connection Error";
                alert("Database Save Failed!\n\nDetails: " + errorMsg); 
            }
            finally { if (b) b.textContent = "Send Message"; }
        };
    }
});
