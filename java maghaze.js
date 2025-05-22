// JavaScript Document
const menuBtn = document.querySelector('.menu-btn');
const menuContent = document.querySelector('.menu-content');


menuBtn.addEventListener('click', () => {
	menuContent.style.display = (menuContent.style.display === 'block') ? 'none' : 'block';
});

// بررسی اینکه سبد خرید در checkout پاک شده باشه
if (!localStorage.getItem('cartItems') || localStorage.getItem('cartItems') === '{}') {
    localStorage.removeItem('cartData');
}


window.addEventListener('click', (e) => {
	if(!e.target.matches('.menu-btn')) {
		menuContent.style.display = 'none';
	}
});
let cartCount = 0;
const cartItems = {};  // { 'سبزی خوردن': { quantity: 2, price: 50000 } }

// فقط یکبار همه add-to-cart ها رو بگیریم و روی دکمه‌ها EventListener بگذاریم
const addButtons = document.querySelectorAll('.add-to-cart');
addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const productName = card.querySelector('h3').textContent.trim();
        const priceText = card.querySelector('p').textContent.trim();  
        const priceMatch = priceText.match(/(\d+)/);  // فقط عدد قیمت رو بگیره
        const productPrice = priceMatch ? parseInt(priceMatch[1]) : 0;

        if (cartItems[productName]) {
            cartItems[productName].quantity++;
        } else {
            cartItems[productName] = { quantity: 1, price: productPrice };
        }

        cartCount++;
        document.getElementById('cart-count').textContent = cartCount;

        // ذخیره در localStorage بعد از هر افزودن
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // نمایش سبد خرید
        showCartPanel();
    });
});


// وقتی از منو روی "سبد خرید" کلیک شد → پنل باز بشه
const menuLinks = document.querySelectorAll('.menu-content a');
menuLinks.forEach(link => {
    if (link.textContent.includes('سبد خرید')) {
        link.addEventListener('click', () => {
            showCartPanel();
        });
    }
});

// اگر اطلاعات سبد خرید در localStorage وجود داشت، بازیابی کن
const savedCart = localStorage.getItem('cartItems');
if (savedCart) {
    Object.assign(cartItems, JSON.parse(savedCart));
    cartCount = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}


// تابع بازکردن پنل سبد خرید
function showCartPanel() {
    const panel = document.getElementById('cart-panel');
    const list = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('go-to-checkout');
const clearBtn = document.getElementById('clear-cart');

	// نمایش یا مخفی‌سازی دکمه خالی کردن سبد
if (Object.keys(cartItems).length > 0) {
    clearBtn.style.display = 'block';
} else {
    clearBtn.style.display = 'none';
}

	
	
    list.innerHTML = ''; // خالی‌کردن لیست محصولات
    let totalPrice = 0;

    if (Object.keys(cartItems).length === 0) {
        list.innerHTML = '<li class="empty-message">سبد خرید شما خالی است</li>';
        totalElement.textContent = '';
        checkoutBtn.style.display = 'none';
    } else {
        for (const product in cartItems) {
            const item = cartItems[product];
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const li = document.createElement('li');
            li.innerHTML = `
                <span>${product}</span> 
                <div class="quantity-control">
                    <button class="decrease" data-product="${product}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase" data-product="${product}">+</button>
                </div>
                <span class="price">${itemTotal.toLocaleString()} تومان</span>
                <button class="remove-item" data-product="${product}">❌</button>
            `;
            list.appendChild(li);
        }

        totalElement.textContent = `مجموع کل: ${totalPrice.toLocaleString()} تومان`;
        checkoutBtn.style.display = 'block';

        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const product = btn.getAttribute('data-product');
                cartItems[product].quantity++;
                updateCartUI();
            });
        });

        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const product = btn.getAttribute('data-product');
                if (cartItems[product].quantity > 1) {
                    cartItems[product].quantity--;
                } else {
                    delete cartItems[product];
                }
                updateCartUI();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const product = btn.getAttribute('data-product');
                cartCount -= cartItems[product].quantity;
                delete cartItems[product];
                updateCartUI();
            });
        });
    }

   panel.classList.add('show');
panel.classList.remove('hidden');

}



	
    // اینجا بررسی می‌کنیم که دکمه باید باشه یا نه
    const checkoutBtnGlobal = document.getElementById('go-to-checkout');
if (Object.keys(cartItems).length > 0) {
    checkoutBtnGlobal.style.display = 'block';
} else {
    checkoutBtnGlobal.style.display = 'none';
}


function updateCartUI() {
    cartCount = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
    showCartPanel();

    // ذخیره در لوکال‌استوریج
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

document.getElementById('close-cart').addEventListener('click', () => {
    const panel = document.getElementById('cart-panel');  // 👈 تعریف panel
    panel.classList.remove('show');
    panel.classList.add('hidden');
});

document.getElementById('go-to-checkout').addEventListener('click', function () {
    // تبدیل cartItems به رشته JSON و ذخیره در localStorage
    localStorage.setItem('cartData', JSON.stringify(cartItems));

    // انتقال به صفحه پرداخت
    window.location.href = 'checkout.html';

});
// ✅ دکمه خالی کردن سبد خرید
document.getElementById('clear-cart').addEventListener('click', () => {
    // پاک کردن همه آیتم‌ها
    for (const key in cartItems) {
        delete cartItems[key];
    }
    cartCount = 0;

    // بروزرسانی ظاهر و ذخیره‌سازی
    updateCartUI();
});
const contactPanel = document.getElementById('contact-panel');
const closeContactPanel = document.getElementById('close-contact-panel');

// وقتی روی "تماس با ما" کلیک بشه، پنل باز بشه
document.querySelector('.menu-content a[href="#content"]').addEventListener('click', (e) => {
  e.preventDefault();
  contactPanel.classList.remove('hidden');
});

// بستن پنل با ضربدر
closeContactPanel.addEventListener('click', () => {
  contactPanel.classList.add('hidden');
});

