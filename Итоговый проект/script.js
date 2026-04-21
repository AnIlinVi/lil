 // --------------------------------------------------------------
    // 1. БАЗА ПРОДУКТОВ (биты)
    // --------------------------------------------------------------
    const PRODUCTS = [
        { id: 1, name: "Dusk Till Dawn", price: 1990, theme: "theme1", img: "/Итоговый проект/img/beats/1.jpg" },
        { id: 2, name: "Neon Shadows", price: 1990, theme: "theme1", img: "/Итоговый проект/img/beats/2.jpg" },
        { id: 3, name: "Lost Souls", price: 1990, theme: "theme1", img: "/Итоговый проект/img/beats/3.jpg" },
        { id: 4, name: "Midnight Drift", price: 1990, theme: "theme2", img: "/Итоговый проект/img/beats/4.jpg" },
        { id: 5, name: "Echoes", price: 1990, theme: "theme2", img: "/Итоговый проект/img/beats/5.jpg" },
        { id: 6, name: "Phantom", price: 1990, theme: "theme2", img: "/Итоговый проект/img/beats/6.jpg" },
        { id: 7, name: "Wicked Dreams", price: 1990, theme: "theme3", img: "/Итоговый проект/img/beats/7.jpg" },
        { id: 8, name: "Dark Matter", price: 1990, theme: "theme3", img: "/Итоговый проект/img/beats/8.jpg" },
        { id: 9, name: "Requiem", price: 1990, theme: "theme3", img: "/Итоговый проект/img/beats/9.jpg" }
    ];

    // Глобальные переменные
    let cart = [];       // { id, quantity }
    let orders = [];     // массив заказов

    // ----- Работа с localStorage -----
    function loadData() {
        const savedCart = localStorage.getItem("liltrue_cart");
        if (savedCart) cart = JSON.parse(savedCart); 
        else cart = [];
        
        const savedOrders = localStorage.getItem("liltrue_orders");
        if (savedOrders) orders = JSON.parse(savedOrders); 
        else orders = [];
    }
    function saveCart() { localStorage.setItem("liltrue_cart", JSON.stringify(cart)); }
    function saveOrders() { localStorage.setItem("liltrue_orders", JSON.stringify(orders)); }

    // Обновить счетчик в шапке (если есть элементы .cart-count)
    function updateCartCount() {
        const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
        document.querySelectorAll("#cart-count").forEach(el => {
            if(el) el.textContent = totalItems;
        });
        // дополнительно обновляем везде, где отображается кол-во (для главной страницы)
        const cartSpans = document.querySelectorAll(".cart-count-badge, #cart-count");
        if(cartSpans.length) cartSpans.forEach(sp => sp.textContent = totalItems);
    }

    function getProductById(id) { return PRODUCTS.find(p => p.id === id); }

    // Добавить в корзину (для главной страницы)
    function addToCart(productId) {
        const existing = cart.find(item => item.id === productId);
        if (existing) existing.quantity++;
        else cart.push({ id: productId, quantity: 1 });
        saveCart();
        updateCartCount();
        alert("✅ Бит добавлен в корзину!");
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        if (window.location.pathname.includes("cart.html")) renderCartPage();
    }

    function updateQuantity(productId, newQty) {
        if (newQty <= 0) { removeFromCart(productId); return; }
        const item = cart.find(i => i.id === productId);
        if (item) { item.quantity = newQty; saveCart(); updateCartCount(); if (window.location.pathname.includes("cart.html")) renderCartPage(); }
    }

    // ---------- ОФОРМЛЕНИЕ ЗАКАЗА (исправленный переход) ----------
    function checkout() {
        if (cart.length === 0) { 
            alert("❌ Корзина пуста. Добавьте биты перед заказом."); 
            return; 
        }
        
        // Формируем детали заказа
        const orderItems = cart.map(cartItem => {
            const p = getProductById(cartItem.id);
            if (!p) return null;
            return { 
                id: p.id, 
                name: p.name, 
                price: p.price, 
                quantity: cartItem.quantity, 
                subtotal: p.price * cartItem.quantity 
            };
        }).filter(item => item !== null);
        
        if(orderItems.length === 0) {
            alert("Ошибка: товары не найдены");
            return;
        }
        
        const total = orderItems.reduce((s, i) => s + i.subtotal, 0);
        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            items: orderItems,
            total: total
        };
        orders.push(newOrder);
        saveOrders();
        
        // Очищаем корзину после успешного заказа
        cart = [];
        saveCart();
        updateCartCount();
        
        // ВАЖНО: редирект на страницу заказов (относительный путь, чтобы работало локально)
        // Так как cart.html и orders.html лежат в одной папке /html/
        window.location.href = "orders.html";
    }

    // ---------- ОТРИСОВКА КОРЗИНЫ (если страница cart.html) ----------
    function renderCartPage() {
        const container = document.getElementById("cart-items");
        const totalDiv = document.getElementById("cart-total");
        const checkoutBtn = document.getElementById("checkout-btn");
        if (!container) return;
        
        if (cart.length === 0) {
            container.innerHTML = `<div class="empty-message">🛒 Корзина пуста. <a href="/Итоговый проект/index.html" style="color:#ac70e7;">Вернуться к битам</a></div>`;
            if(totalDiv) totalDiv.innerHTML = "";
            if(checkoutBtn) checkoutBtn.style.display = "none";
            return;
        }
        let totalSum = 0;
        container.innerHTML = "";
        cart.forEach(cartItem => {
            const prod = getProductById(cartItem.id);
            if(!prod) return;
            const itemTotal = prod.price * cartItem.quantity;
            totalSum += itemTotal;
            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <div class="cart-item-info"><strong>${prod.name}</strong><br>${prod.price} ₽</div>
                <div class="cart-item-quantity"><label>Кол-во:</label> <input type="number" min="1" value="${cartItem.quantity}" data-id="${cartItem.id}" class="qty-input"></div>
                <div class="cart-item-price">${itemTotal} ₽</div>
                <button class="cart-item-remove" data-id="${cartItem.id}">Удалить</button>
            `;
            container.appendChild(div);
        });
        if(totalDiv) totalDiv.innerHTML = `<div class="cart-total">💰 ИТОГО: ${totalSum} ₽</div>`;
        if(checkoutBtn) { 
            checkoutBtn.style.display = "block"; 
            checkoutBtn.onclick = () => checkout(); 
        }
        
        // события для инпутов и кнопок удаления
        document.querySelectorAll(".qty-input").forEach(inp => {
            inp.removeEventListener("change", window._qtyHandler);
            const handler = (e) => {
                const id = parseInt(inp.dataset.id);
                let newVal = parseInt(inp.value);
                if(isNaN(newVal)) newVal = 1;
                updateQuantity(id, newVal);
            };
            inp.addEventListener("change", handler);
            window._qtyHandler = handler;
        });
        document.querySelectorAll(".cart-item-remove").forEach(btn => {
            btn.removeEventListener("click", window._removeHandler);
            const rmHandler = (e) => {
                const id = parseInt(btn.dataset.id);
                removeFromCart(id);
            };
            btn.addEventListener("click", rmHandler);
            window._removeHandler = rmHandler;
        });
    }

    // ---------- ОТРИСОВКА ЗАКАЗОВ (ключевая функция для orders.html) ----------
    function renderOrdersPage() {
        const ordersContainer = document.getElementById("orders-list");
        if (!ordersContainer) return;
        
        if (!orders || orders.length === 0) {
            ordersContainer.innerHTML = `<div class="empty-message">📦 У вас пока нет заказов. <a href="/Итоговый проект/index.html" style="color:#c896ff;">🔥 Купить биты прямо сейчас</a><br><br>✨ Добавьте биты в корзину и оформите заказ — он появится здесь.</div>`;
            return;
        }
        
        ordersContainer.innerHTML = "";
        // Показываем заказы от новых к старым
        [...orders].reverse().forEach(order => {
            const orderDiv = document.createElement("div");
            orderDiv.className = "order-card";
            // Формируем список товаров
            let itemsHtml = "";
            order.items.forEach(item => {
                itemsHtml += `<div class="order-item"><span>🎵 ${item.name} × ${item.quantity}</span><span>${item.subtotal} ₽</span></div>`;
            });
            orderDiv.innerHTML = `
                <div class="order-header">
                    <span>🧾 Заказ #${order.id}</span>
                    <span>📅 ${order.date}</span>
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
                <div class="order-total">💵 Общая сумма: ${order.total} ₽</div>
            `;
            ordersContainer.appendChild(orderDiv);
        });
    }
    
    // ---------- ОЧИСТКА ВСЕХ ЗАКАЗОВ (доп. функция для кнопки) ----------
    function clearAllOrders() {
        if (orders.length === 0) {
            alert("История заказов уже пуста.");
            return;
        }
        const confirmClear = confirm("⚠️ ВНИМАНИЕ: вся история заказов будет удалена без возможности восстановления. Продолжить?");
        if (confirmClear) {
            orders = [];
            saveOrders();
            renderOrdersPage();
            alert("✅ История заказов очищена.");
        }
    }
    
    // ---------- ФИЛЬТРАЦИЯ НА ГЛАВНОЙ (если страница main) ----------
    function initFilters() {
        const filterBtns = document.querySelectorAll(".filter-btn");
        const themeGroups = document.querySelectorAll(".theme-group");
        const themeTitles = document.querySelectorAll(".theme-title");
        if(!filterBtns.length) return;
        function filterBeats(theme) {
            themeGroups.forEach(group => {
                const groupTheme = group.getAttribute("data-theme");
                group.style.display = (theme === "all" || groupTheme === theme) ? "flex" : "none";
            });
            themeTitles.forEach(title => {
                const titleTheme = title.getAttribute("data-theme");
                title.style.display = (theme === "all" || titleTheme === theme) ? "block" : "none";
            });
        }
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const filterVal = btn.getAttribute("data-filter");
                filterBeats(filterVal);
            });
        });
        filterBeats("all");
    }
    
    // ---------- ИНИЦИАЛИЗАЦИЯ ВСЕХ СТРАНИЦ (единый обработчик) ----------
    document.addEventListener("DOMContentLoaded", () => {
        loadData();
        updateCartCount();
        
        const path = window.location.pathname;
        const isCartPage = path.includes("cart.html");
        const isOrdersPage = path.includes("orders.html");
        
        // Страница корзины
        if (isCartPage) {
            renderCartPage();
        }
        // Страница заказов — тут главная магия, делаем работающую страницу заказов
        else if (isOrdersPage) {
            renderOrdersPage();
            
            // Вешаем обработчик на кнопку очистки заказов (если она есть)
            const clearBtn = document.getElementById("clear-all-orders-btn");
            if (clearBtn) {
                clearBtn.addEventListener("click", clearAllOrders);
            }
        }
        // Главная страница (main.html или index)
        else {
            // привязываем кнопки "Добавить в корзину" 
            const btns = document.querySelectorAll(".add-to-cart-btn");
            btns.forEach(btn => {
                // Убираем старые обработчики, чтобы избежать дублей
                btn.removeEventListener("click", window._cartAddHandler);
                const handler = (e) => {
                    const id = parseInt(btn.getAttribute("data-id"));
                    if (!isNaN(id)) addToCart(id);
                };
                btn.addEventListener("click", handler);
                window._cartAddHandler = handler;
            });
            initFilters(); // фильтрация тем
        }
        
        // Дополнительно: если на странице заказов нужно обновить счетчик (не критично)
        if(isOrdersPage) {
            // Просто чтобы счетчик в шапке не мешал, если вдруг добавится элемент
            updateCartCount();
        }
    });
    
    // Экспорт функций в глобальную область для возможного вызова из консоли или из inline-событий (необязательно)
    window.checkout = checkout;
    window.addToCart = addToCart;
    window.clearAllOrders = clearAllOrders;