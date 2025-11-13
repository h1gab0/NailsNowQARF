import React, { useEffect, useState, useRef } from 'react';
import Typed from 'typed.js';
import * as echarts from 'echarts';
import anime from 'animejs';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Link } from 'react-router-dom';
import './LandingPage.css';

import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import AuthenticatedCTA from './components/AuthenticatedCTA';
import Footer from './components/Footer';
import Video from './components/Video';
import { useAuth } from '../../context/AuthContext';


const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const typedElement = useRef(null);
  const particlesContainer = useRef(null);
  const revenueChart = useRef(null);
  const testimonialsSlider = useRef(null);
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for booking demo
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Smooth scrolling for navigation links
  const handleNavClick = (e) => {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    setMobileMenuOpen(false);
  };

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('feature-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Typed text animation
  useEffect(() => {
    if (!typedElement.current) return;
    const options = {
      strings: ['Belleza', 'Negocio', 'Éxito', 'Futuro'],
      typeSpeed: 80,
      backSpeed: 60,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    };
    const typed = new Typed(typedElement.current, options);
    return () => typed.destroy();
  }, []);

  // Particle system
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = particlesContainer.current;
    if (!container) return;
    container.appendChild(canvas);
    let particles = [];
    let animationId;
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#E8B4B8' : '#A8B5A0',
    });
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
      }
    };
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animationId = requestAnimationFrame(updateParticles);
    };
    resizeCanvas();
    initParticles();
    updateParticles();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      if(container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  // Revenue chart
  useEffect(() => {
    if (!revenueChart.current) return;
    const chart = echarts.init(revenueChart.current);
    const option = {
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#E8B4B8', textStyle: { color: '#2C2C2C' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], axisLine: { lineStyle: { color: '#A8B5A0' } }, axisLabel: { color: '#6B6B6B' } },
        yAxis: { type: 'value', axisLine: { lineStyle: { color: '#A8B5A0' } }, axisLabel: { color: '#6B6B6B', formatter: '${value}k' }, splitLine: { lineStyle: { color: '#F0F0F0' } } },
        series: [{ name: 'Ingresos', type: 'line', smooth: true, data: [18, 22, 25, 28, 31, 35], lineStyle: { color: '#E8B4B8', width: 3 }, itemStyle: { color: '#E8B4B8' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(232, 180, 184, 0.3)' }, { offset: 1, color: 'rgba(232, 180, 184, 0.05)' }] } } }]
    };
    chart.setOption(option);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chart.resize();
                setTimeout(() => chart.setOption({ animation: true, animationDuration: 1000, animationEasing: 'cubicOut' }), 500);
            }
        });
    });
    observer.observe(revenueChart.current);
    window.addEventListener('resize', () => chart.resize());
    return () => {
        chart.dispose();
        observer.disconnect();
    };
  }, []);

    // Pricing toggle animation
    useEffect(() => {
        anime({
            targets: ['#free-price', '#premium-price'],
            scale: [1, 1.1, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
    }, [isAnnualBilling]);


  // Testimonials slider
  useEffect(() => {
    if (!testimonialsSlider.current) return;
    const splide = new Splide(testimonialsSlider.current, { type: 'loop', perPage: 1, autoplay: true, interval: 5000, pauseOnHover: true, arrows: false, pagination: true, gap: '2rem' });
    splide.mount();
    return () => splide.destroy();
  }, []);

  const getServiceName = (service) => {
    const names = {
        'manicura': 'Manicura Clásica',
        'pedicura': 'Pedicura Completa',
        'acrilicas': 'Uñas Acrílicas'
    };
    return names[service] || service;
  }

  const getServicePrice = (service) => {
    const prices = {
      'manicura': 150,
      'pedicura': 200,
      'acrilicas': 400
    }
    return prices[service] || 0;
  }

  const handleBookAppointment = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
    }, 5000);
  }

  return (
    <div>
      <Hero
        particlesContainer={particlesContainer}
        typedElement={typedElement}
      />
      <Features />
      <Video/>
      <Pricing
        isAnnualBilling={isAnnualBilling}
        setIsAnnualBilling={setIsAnnualBilling}
      />
      <Testimonials testimonialsSlider={testimonialsSlider} />
      {isAuthenticated ? <AuthenticatedCTA /> : <CTA />}
      <Footer />
    </div>
  );
};

export default LandingPage;
