(()=>{window.addEventListener("scroll",(function(){const e=document.getElementById("mainNav");window.scrollY>50?e.classList.add("scrolled"):e.classList.remove("scrolled")})),document.querySelectorAll('a[href^="#"]').forEach((e=>{e.addEventListener("click",(function(e){e.preventDefault();document.querySelector(this.getAttribute("href")).scrollIntoView({behavior:"smooth"})}))}));const e=new IntersectionObserver((t=>{t.forEach((t=>{t.isIntersecting&&(t.target.classList.add("fade-in-text"),e.unobserve(t.target))}))}),{root:null,rootMargin:"0px",threshold:.1});document.addEventListener("DOMContentLoaded",(()=>{document.querySelectorAll("header, section, footer").forEach((t=>{t.querySelectorAll("h1, h2, p, img, video, ul, .logos, .cta-button, a:not(.navbar *)").forEach((t=>{t.classList.contains("background")||t.classList.contains("scroll-indicator")||e.observe(t)}))}))}))})();