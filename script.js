// Jira 財務教練電子報行銷頁 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // 表單處理功能
    function handleFormSubmission(formId, emailId) {
        const form = document.getElementById(formId);
        const emailInput = document.getElementById(emailId);
        
        if (!form || !emailInput) return;
        
        form.addEventListener('submit', function(e) {
            const email = emailInput.value.trim();
            
            // 基本電子郵件驗證
            if (!isValidEmail(email)) {
                e.preventDefault();
                showMessage('請輸入有效的電子郵件地址', 'error');
                return;
            }
            
            // 顯示載入狀態
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '訂閱中...';
            submitBtn.disabled = true;
            
            // 追蹤轉換事件（如果有 Google Analytics）
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    event_category: 'engagement',
                    event_label: formId
                });
            }
            
            // 表單提交到 Portaly 後的處理
            setTimeout(() => {
                showMessage('訂閱成功！歡迎加入 Jira 財務教練的專業社群', 'success');
                emailInput.value = '';
                
                // 重置按鈕
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
            
            // 讓表單正常提交到 Portaly
            return true;
        });
    }
    
    // 電子郵件驗證函數
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 顯示訊息函數
    function showMessage(message, type = 'info') {
        // 移除現有訊息
        const existingMessage = document.querySelector('.notification-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 創建新訊息元素
        const messageDiv = document.createElement('div');
        messageDiv.className = `notification-message notification-${type}`;
        messageDiv.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // 添加樣式
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease-out;
            font-family: inherit;
        `;
        
        // 根據類型設置顏色
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#10B981';
            messageDiv.style.color = 'white';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#EF4444';
            messageDiv.style.color = 'white';
        } else {
            messageDiv.style.backgroundColor = '#3B82F6';
            messageDiv.style.color = 'white';
        }
        
        document.body.appendChild(messageDiv);
        
        // 自動移除訊息
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 5000);
    }
    
    // 初始化表單
    handleFormSubmission('hero-form', 'hero-email');
    handleFormSubmission('final-form', 'final-email');
    
    // 平滑滾動功能
    function smoothScrollToElement(targetId) {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // 添加滾動動畫
    function addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // 觀察需要動畫的元素
        const animatedElements = document.querySelectorAll('.card, .benefit-card, .testimonial-card');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // 初始化滾動動畫
    addScrollAnimations();
    
    // 添加輸入框焦點效果
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
    });
    
    // 添加按鈕點擊效果
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 創建漣漪效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // 導航欄滾動效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滾動，隱藏導航欄
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滾動，顯示導航欄
            navbar.style.transform = 'translateY(0)';
        }
        
        // 添加滾動時的背景效果
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    console.log('Jira 財務教練行銷頁已載入完成 ✨');
});

// CSS 動畫定義
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        opacity: 0.8;
        border-radius: 4px;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.2);
    }
    
    .input-focused {
        transform: scale(1.02);
    }
    
    .navbar {
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .navbar.scrolled {
        background-color: rgba(247, 250, 252, 0.95);
        backdrop-filter: blur(10px);
    }
    
    .card, .benefit-card, .testimonial-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .card.fade-in, .benefit-card.fade-in, .testimonial-card.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style); 