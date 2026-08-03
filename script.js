/* =====================================================
   ALING NENA'S SARI-SARI STORE POS
   Members: Lian Suzaine Sultan & Jennie Lou L. Redondo
   ----------------------------------------------------
   PARTITION OF WORK (matches README.md — 5 items each):
   - Lian Suzaine Sultan   -> Login & session handling, product
                              catalog, search & filter, cart &
                              transaction entry logic, reporting
                              features
   - Jennie Lou L. Redondo -> Checkout process, transaction
                              records, discounts, receipts,
                              utang/credit log & customer name
                              tracking
===================================================== */

/* =====================================================
   DATA — Product catalog (given dataset, no database)
===================================================== */
const groceryItems = [
  { product_id: 1, product_name: "Dried Mangoes (200g)", product_price: 180 },
  { product_id: 2, product_name: "Banana Chips (200g)", product_price: 120 },
  { product_id: 3, product_name: "Tablea Chocolate (250g)", product_price: 200 },
  { product_id: 4, product_name: "Coconut Oil (500ml)", product_price: 180 },
  { product_id: 5, product_name: "Mango Jam (250g)", product_price: 160 },
  { product_id: 6, product_name: "Peanut Brittle (200g)", product_price: 150 },
  { product_id: 7, product_name: "Cashew Nuts (250g)", product_price: 280 },
  { product_id: 8, product_name: "Philippine Coffee Beans (250g)", product_price: 320 },
  { product_id: 9, product_name: "Native Vinegar (500ml)", product_price: 120 },
  { product_id: 10, product_name: "Philippine Honey (250ml)", product_price: 250 },
  { product_id: 11, product_name: "Coconut Sugar (500g)", product_price: 180 },
  { product_id: 12, product_name: "Rice Crackers (200g)", product_price: 100 },
  { product_id: 13, product_name: "Salted Fish (Danggit, 250g)", product_price: 220 },
  { product_id: 14, product_name: "Longganisa (Frozen, 500g)", product_price: 280 },
  { product_id: 15, product_name: "Tocino (Frozen, 500g)", product_price: 300 },
  { product_id: 16, product_name: "Chicharon (100g)", product_price: 120 },
  { product_id: 17, product_name: "Pandesal Pack (12 pcs)", product_price: 80 },
  { product_id: 18, product_name: "Native Brown Rice (1kg)", product_price: 90 },
  { product_id: 19, product_name: "White Rice (1kg)", product_price: 70 },
  { product_id: 20, product_name: "Corn Coffee (250g)", product_price: 150 },
  { product_id: 21, product_name: "Coconut Water (1L)", product_price: 100 },
  { product_id: 22, product_name: "Calamansi Juice (1L)", product_price: 120 },
  { product_id: 23, product_name: "Guava Jelly (250g)", product_price: 160 },
  { product_id: 24, product_name: "Bagoong (250g)", product_price: 90 },
  { product_id: 25, product_name: "Fish Sauce (Patis, 500ml)", product_price: 110 },
  { product_id: 26, product_name: "Soy Sauce (500ml)", product_price: 95 },
  { product_id: 27, product_name: "Native Salt (250g)", product_price: 50 },
  { product_id: 28, product_name: "Coconut Milk Powder (200g)", product_price: 140 },
  { product_id: 29, product_name: "Instant Noodles (Pack of 6)", product_price: 75 },
  { product_id: 30, product_name: "Native Cheese (Kesong Puti, 250g)", product_price: 180 },
  { product_id: 31, product_name: "Eggs (Dozen)", product_price: 90 },
  { product_id: 32, product_name: "Fresh Tilapia (1kg)", product_price: 160 },
  { product_id: 33, product_name: "Fresh Bangus (Milkfish, 1kg)", product_price: 180 },
  { product_id: 34, product_name: "Fresh Chicken (1kg)", product_price: 200 },
  { product_id: 35, product_name: "Fresh Pork (1kg)", product_price: 280 },
  { product_id: 36, product_name: "Fresh Beef (1kg)", product_price: 350 },
  { product_id: 37, product_name: "Native Vegetables Basket", product_price: 250 },
  { product_id: 38, product_name: "Bananas (1kg)", product_price: 60 },
  { product_id: 39, product_name: "Mangoes (1kg)", product_price: 120 },
  { product_id: 40, product_name: "Papaya (1kg)", product_price: 70 },
  { product_id: 41, product_name: "Pineapple (Whole)", product_price: 90 },
  { product_id: 42, product_name: "Coconut (Whole)", product_price: 50 },
  { product_id: 43, product_name: "Native Peanuts (250g)", product_price: 100 },
  { product_id: 44, product_name: "Camote (Sweet Potato, 1kg)", product_price: 80 },
  { product_id: 45, product_name: "Ube Halaya (250g)", product_price: 180 },
  { product_id: 46, product_name: "Leche Flan (Whole)", product_price: 250 },
  { product_id: 47, product_name: "Bibingka (Whole)", product_price: 200 },
  { product_id: 48, product_name: "Puto (Dozen)", product_price: 120 },
  { product_id: 49, product_name: "Kakanin Sampler Pack", product_price: 300 },
  { product_id: 50, product_name: "Native Chocolate Drink (Sikwate, 250ml)", product_price: 90 }
];

/* User accounts for shift login (no database — in-memory only) */
const users = [
  { username: "juan",  password: "1234",     name: "Juan Dela Cruz", role: "cashier" },
  { username: "maria", password: "1234",     name: "Maria Santos",   role: "cashier" },
  { username: "admin", password: "admin123", name: "Store Admin",    role: "admin" }
];

/* =====================================================
   STATE (all in-memory arrays — resets on page reload,
   per project spec: "no database required")
===================================================== */
let currentSession = null;      // { username, name, role, shift, loginTime }
let cart = [];                  // [{ product_id, product_name, product_price, quantity }]
let transactions = [];          // all recorded transactions, across logins in this browser session
let creditLog = [];             // [{ creditId, customerName, idNumber, transactionId, amount, date, shift, cashierName, status }]
let txnCounter = 1000;
let creditCounter = 5000;

/* =====================================================
   HELPERS
===================================================== */
const peso = n => "₱" + Number(n).toFixed(2);

function emojiFor(name){
  const n = name.toLowerCase();
  if(/beef|pork|chicken|tilapia|bangus|danggit|longganisa|tocino|fish/.test(n)) return "🥩";
  if(/rice|noodles/.test(n)) return "🍚";
  if(/coffee|sikwate/.test(n)) return "☕";
  if(/juice|water|coconut water/.test(n)) return "🥤";
  if(/mango|banana|papaya|pineapple|coconut \(whole\)/.test(n)) return "🍍";
  if(/chocolate|tablea/.test(n)) return "🍫";
  if(/egg/.test(n)) return "🥚";
  if(/bibingka|puto|leche flan|ube|kakanin|pandesal/.test(n)) return "🍡";
  if(/sauce|vinegar|bagoong|salt/.test(n)) return "🧂";
  if(/chicharon|crackers|brittle|nuts|peanuts/.test(n)) return "🥨";
  if(/vegetable|camote/.test(n)) return "🥬";
  if(/honey|jam|jelly/.test(n)) return "🍯";
  if(/oil/.test(n)) return "🫙";
  if(/cheese/.test(n)) return "🧀";
  return "🛍️";
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._tm);
  showToast._tm = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* =====================================================================
   PART 1 — Lian Suzaine Sultan
   Login/session handling, product catalog, search & filter,
   cart & transaction-entry logic, reporting features
===================================================================== */

/* -----------------------------------------------------
   LOGIN
----------------------------------------------------- */
document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const shift = document.getElementById('shift').value;
  const errorEl = document.getElementById('loginError');

  const user = users.find(u => u.username === username && u.password === password);
  if(!user){
    errorEl.textContent = "Incorrect username or password. Try again.";
    return;
  }
  errorEl.textContent = "";
  currentSession = {
    username: user.username,
    name: user.name,
    role: user.role,
    shift: shift,
    loginTime: new Date()
  };
  cart = [];
  document.getElementById('cashierName').textContent = user.name;
  document.getElementById('shiftBadge').textContent = shift + " Shift";
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('posScreen').style.display = 'block';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  renderProducts();
  renderCart();
  showToast(`Welcome, ${user.name}! ${shift} shift started.`);
});

document.getElementById('logoutBtn').addEventListener('click', function(){
  if(cart.length > 0 && !confirm("There's still an order in the cart. Are you sure you want to end your shift?")) return;
  openReports(true); // show final shift summary before logout
  document.getElementById('reportsModal').dataset.endingShift = "1";
});

/* -----------------------------------------------------
   PRODUCT CATALOG
----------------------------------------------------- */
function getFilteredProducts(){
  const term = document.getElementById('searchInput').value.trim().toLowerCase();
  const range = document.getElementById('priceFilter').value;
  return groceryItems.filter(p => {
    const matchesName = p.product_name.toLowerCase().includes(term);
    let matchesPrice = true;
    if(range){
      const [min, max] = range.split('-').map(Number);
      matchesPrice = p.product_price >= min && p.product_price <= max;
    }
    return matchesName && matchesPrice;
  });
}

function renderProducts(){
  const grid = document.getElementById('productGrid');
  const items = getFilteredProducts();
  grid.innerHTML = '';
  if(items.length === 0){
    grid.innerHTML = '<div class="no-results">No products match your search.</div>';
    return;
  }
  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = p.product_id;
    card.innerHTML = `
      <div class="emoji">${emojiFor(p.product_name)}</div>
      <div class="pname">${p.product_name}</div>
      <div class="pprice">${peso(p.product_price)}</div>
      <div class="tap-hint">👆 Tap </div>
    `;
    grid.appendChild(card);
  });
}

// Real-time scanning: clicking a product card immediately rings it up —
// no separate "add to order" step, like a real grocery POS.
document.getElementById('productGrid').addEventListener('click', function(e){
  const card = e.target.closest('.product-card');
  if(!card) return;
  const id = Number(card.dataset.id);
  addToCart(id);
  card.classList.remove('just-added');
  void card.offsetWidth; // restart animation
  card.classList.add('just-added');
  const p = groceryItems.find(g => g.product_id === id);
  if(p) showToast(`+1 ${p.product_name}`);
});

document.getElementById('searchInput').addEventListener('input', renderProducts);
document.getElementById('priceFilter').addEventListener('change', renderProducts);

/* -----------------------------------------------------
   CART / TRANSACTION ENTRY
----------------------------------------------------- */
function addToCart(productId){
  const product = groceryItems.find(p => p.product_id === productId);
  if(!product) return;
  const existing = cart.find(c => c.product_id === productId);
  if(existing){
    existing.quantity += 1;
  } else {
    cart.push({
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: product.product_price,
      quantity: 1
    });
  }
  renderCart();
}

function changeQty(productId, delta){
  const item = cart.find(c => c.product_id === productId);
  if(!item) return;
  item.quantity += delta;
  if(item.quantity <= 0){
    cart = cart.filter(c => c.product_id !== productId);
  }
  renderCart();
}

function removeFromCart(productId){
  cart = cart.filter(c => c.product_id !== productId);
  renderCart();
}

function cartSubtotal(){
  return cart.reduce((sum, c) => sum + c.product_price * c.quantity, 0);
}
function renderCart(){
  const container = document.getElementById('cartItems');
  if(cart.length === 0){
    container.innerHTML = '<div class="empty-cart">No items yet. Tap a product on the left to start.</div>';
  } else {
    container.innerHTML = cart.map(c => `
      <div class="cart-row">
        <div>
          <div class="cname">${c.product_name}</div>
          <div class="cprice">${peso(c.product_price)} each</div>
        </div>
        <div class="qty-controls">
          <button data-act="minus" data-id="${c.product_id}">−</button>
          <span>${c.quantity}</span>
          <button data-act="plus" data-id="${c.product_id}">+</button>
        </div>
        <div class="csub">${peso(c.product_price * c.quantity)}</div>
        <button class="remove-btn" data-act="remove" data-id="${c.product_id}">✕</button>
      </div>
    `).join('');
  }

  const sub = cartSubtotal();

  // No automatic bulk discount anymore — the only discount in this app is
  // Senior/PWD, and that's applied at checkout, not shown here in the cart.
  document.getElementById('sumSubtotal').textContent = peso(sub);
  document.getElementById('sumTotal').textContent = peso(sub);
  document.getElementById('discountLine').style.display = 'none';
  document.getElementById('checkoutBtn').disabled = cart.length === 0;
}

document.getElementById('cartItems').addEventListener('click', function(e){
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const act = btn.dataset.act;
  if(act === 'plus') changeQty(id, 1);
  if(act === 'minus') changeQty(id, -1);
  if(act === 'remove') removeFromCart(id);
});

document.getElementById('clearCartBtn').addEventListener('click', function(){
  if(cart.length === 0) return;
  if(confirm("Clear the entire order?")){
    cart = [];
    renderCart();
  }
});

/* =====================================================================
   PART 2 — Jennie Lou L. Redondo
   Checkout process, transaction records, discounts, receipts,
   reports, utang/credit log
===================================================================== */

/* -----------------------------------------------------
   CHECKOUT
----------------------------------------------------- */
let paymentMethod = 'cash'; // 'cash' | 'credit'
let seniorPwdApplied = false; // discount only counts once the ID is entered and "Apply Discount" is clicked

// Discount logic: Senior/PWD (5%) is now the ONLY discount in the app.
// It only counts once it has been explicitly applied via "Apply Discount"
// (just checking the box isn't enough) — see the checkbox/button handlers below.
function calcDiscount(sub){
  const seniorPwd = document.getElementById('seniorPwdCheck').checked && seniorPwdApplied;
  if(seniorPwd){
    return { amount: sub * 0.05, label: 'Senior/PWD Discount (5%)', type: 'senior_pwd' };
  }
  return { amount: 0, label: '', type: 'none' };
}

function refreshCheckoutTotals(){
  const sub = cartSubtotal();
  const disc = calcDiscount(sub);
  const total = sub - disc.amount;

  document.getElementById('coSubtotal').textContent = peso(sub);
  document.getElementById('coTotal').textContent = peso(total);
  const dLine = document.getElementById('coDiscountLine');
  if(disc.amount > 0){
    dLine.style.display = 'flex';
    document.getElementById('coDiscountLabel').textContent = disc.label;
    document.getElementById('coDiscount').textContent = '-' + peso(disc.amount);
  } else {
    dLine.style.display = 'none';
  }

  if(paymentMethod === 'cash'){
    const paid = Number(document.getElementById('paymentInput').value) || 0;
    const change = paid - total;
    document.getElementById('coChange').textContent = peso(change > 0 ? change : 0);
  } else {
    document.getElementById('creditNoteAmount').textContent = peso(total);
  }
  return { sub, disc, total };
}

function setPaymentMethod(method){
  paymentMethod = method;
  document.getElementById('tabCash').classList.toggle('active', method === 'cash');
  document.getElementById('tabCredit').classList.toggle('active', method === 'credit');
  document.getElementById('cashFields').style.display = method === 'cash' ? 'block' : 'none';
  document.getElementById('creditNote').style.display = method === 'credit' ? 'block' : 'none';
  document.getElementById('confirmCheckout').textContent = method === 'cash' ? 'Confirm Payment' : 'Save as Credit';
  document.getElementById('customerNameLabel').textContent = method === 'credit'
    ? 'Customer name (required for credit)'
    : 'Customer name (optional)';
  document.getElementById('checkoutError').textContent = '';
  refreshCheckoutTotals();
}

document.getElementById('tabCash').addEventListener('click', () => setPaymentMethod('cash'));
document.getElementById('tabCredit').addEventListener('click', () => setPaymentMethod('credit'));

document.getElementById('seniorPwdCheck').addEventListener('change', function(){
  document.getElementById('seniorPwdFields').classList.toggle('show', this.checked);
  // Checking the box only reveals the ID field — it does NOT apply the discount yet.
  seniorPwdApplied = false;
  document.getElementById('seniorPwdAppliedNote').style.display = 'none';
  if(!this.checked){
    document.getElementById('seniorIdInput').value = '';
  }
  refreshCheckoutTotals();
});

document.getElementById('applySeniorPwdBtn').addEventListener('click', function(){
  const customerNameVal = document.getElementById('customerName').value.trim();
  const seniorId = document.getElementById('seniorIdInput').value.trim();
  const errorEl = document.getElementById('checkoutError');

  if(!customerNameVal || !seniorId){
    errorEl.textContent = 'Enter the name and ID number first before applying the discount.';
    return;
  }
  errorEl.textContent = '';
  seniorPwdApplied = true;
  document.getElementById('seniorPwdAppliedNote').style.display = 'block';
  refreshCheckoutTotals();
  showToast('Senior/PWD discount applied ✓');
});

// If the ID field is edited after applying, the discount must be re-applied.
document.getElementById('seniorIdInput').addEventListener('input', function(){
  if(seniorPwdApplied){
    seniorPwdApplied = false;
    document.getElementById('seniorPwdAppliedNote').style.display = 'none';
    refreshCheckoutTotals();
  }
});

document.getElementById('checkoutBtn').addEventListener('click', function(){
  document.getElementById('paymentInput').value = '';
  document.getElementById('coChange').textContent = peso(0);
  document.getElementById('checkoutError').textContent = '';
  document.getElementById('customerName').value = '';
  document.getElementById('seniorPwdCheck').checked = false;
  document.getElementById('seniorPwdFields').classList.remove('show');
  document.getElementById('seniorIdInput').value = '';
  document.getElementById('seniorPwdAppliedNote').style.display = 'none';
  seniorPwdApplied = false;
  setPaymentMethod('cash');
  refreshCheckoutTotals();
  document.getElementById('checkoutModal').classList.add('show');
  document.getElementById('paymentInput').focus();
});

document.getElementById('paymentInput').addEventListener('input', refreshCheckoutTotals);

document.getElementById('cancelCheckout').addEventListener('click', function(){
  document.getElementById('checkoutModal').classList.remove('show');
});

document.getElementById('confirmCheckout').addEventListener('click', function(){
  const { sub, disc, total } = refreshCheckoutTotals();
  const errorEl = document.getElementById('checkoutError');
  const customerNameVal = document.getElementById('customerName').value.trim();
  const seniorPwd = document.getElementById('seniorPwdCheck').checked;
  const seniorId = document.getElementById('seniorIdInput').value.trim();

  if(seniorPwd && !seniorPwdApplied){
    errorEl.textContent = 'Click "Apply Discount" first before you can proceed.';
    return;
  }
  if(seniorPwd && (!customerNameVal || !seniorId)){
    errorEl.textContent = 'Name and ID number are required for the Senior/PWD discount.';
    return;
  }

  if(paymentMethod === 'credit' && !customerNameVal){
    errorEl.textContent = 'Customer name is required for credit purchases.';
    return;
  }

  let paid = 0, change = 0;
  if(paymentMethod === 'cash'){
    paid = Number(document.getElementById('paymentInput').value) || 0;
    if(paid < total){
      errorEl.textContent = `Insufficient payment. At least ${peso(total)} is required.`;
      return;
    }
    change = paid - total;
  }
  errorEl.textContent = '';

  // ---- TRANSACTION RECORD (Requirement #4) ----
  const txn = {
    transactionId: 'TXN-' + (++txnCounter),
    date: new Date(),
    cashier: { username: currentSession.username, name: currentSession.name },
    shift: currentSession.shift,
    customerName: customerNameVal || 'Walk-in',
    paymentMethod: paymentMethod,
    discountType: disc.type,
    discountLabel: disc.label,
    seniorPwdId: seniorPwd ? seniorId : null,
    items: cart.map(c => ({
      product_id: c.product_id,
      product_name: c.product_name,
      product_price: c.product_price,
      quantity: c.quantity,
      subtotal: c.product_price * c.quantity
    })),
    subtotal: sub,
    discount: disc.amount,
    totalDue: total,
    amountPaid: paymentMethod === 'cash' ? paid : 0,
    change: change
  };
  transactions.push(txn);

  if(paymentMethod === 'credit'){
    creditLog.push({
      creditId: 'UTG-' + (++creditCounter),
      customerName: customerNameVal,
      idNumber: seniorPwd ? seniorId : null,
      transactionId: txn.transactionId,
      amount: total,
      date: new Date(),
      shift: currentSession.shift,
      cashierName: currentSession.name,
      status: 'unpaid'
    });
    showToast(`Added to Credit Log: ${customerNameVal} — ${peso(total)}`);
  }

  document.getElementById('checkoutModal').classList.remove('show');
  showReceipt(txn);
  cart = [];
  renderCart();
});

/* -----------------------------------------------------
   RECEIPT
----------------------------------------------------- */
function showReceipt(txn){
  const dateStr = txn.date.toLocaleString('en-PH', { dateStyle:'medium', timeStyle:'short' });
  const itemsHtml = txn.items.map(it => `
    <div class="ritem">
      <div class="rline"><span>${it.product_name}</span><span>${peso(it.subtotal)}</span></div>
      <small>${it.quantity} x ${peso(it.product_price)}</small>
    </div>
  `).join('');

  const isCredit = txn.paymentMethod === 'credit';
  document.getElementById('receiptContent').innerHTML = `
    <div class="receipt-center">
      <b>ALING NENA'S SARI-SARI STORE</b><br>
      <small>Official Receipt${isCredit ? ' — ON CREDIT' : ''}</small>
    </div>
    <hr>
    <div class="rline"><span>Txn ID:</span><span>${txn.transactionId}</span></div>
    <div class="rline"><span>Date:</span><span>${dateStr}</span></div>
    <div class="rline"><span>Cashier:</span><span>${txn.cashier.name}</span></div>
    <div class="rline"><span>Shift:</span><span>${txn.shift}</span></div>
    <div class="rline"><span>Customer:</span><span>${txn.customerName}</span></div>
    ${txn.seniorPwdId ? `<div class="rline"><span>Senior/PWD ID:</span><span>${txn.seniorPwdId}</span></div>` : ''}
    <hr>
    ${itemsHtml}
    <hr>
    <div class="rline"><span>Subtotal</span><span>${peso(txn.subtotal)}</span></div>
    ${txn.discount > 0 ? `<div class="rline"><span>${txn.discountLabel}</span><span>-${peso(txn.discount)}</span></div>` : ''}
    <div class="rline"><b>TOTAL DUE</b><b>${peso(txn.totalDue)}</b></div>
    ${isCredit
      ? `<div class="rline"><b>PAYMENT</b><b>ON CREDIT</b></div>`
      : `<div class="rline"><span>Cash</span><span>${peso(txn.amountPaid)}</span></div>
         <div class="rline"><span>Change</span><span>${peso(txn.change)}</span></div>`
    }
    <hr>
    <div class="receipt-center"><small>${isCredit ? 'On credit: to be paid at a later date. Thank you! 🙏' : 'Thank you for your purchase! 🙏'}</small></div>
  `;
  document.getElementById('receiptModal').classList.add('show');
}

document.getElementById('closeReceipt').addEventListener('click', function(){
  document.getElementById('receiptModal').classList.remove('show');
});

/* -----------------------------------------------------
   REPORTS  (back to Lian Suzaine Sultan's part —
   placed here in the file just to stay next to the
   checkout flow that feeds it, but this section is
   Lian's per the partition table)
----------------------------------------------------- */
function openReports(endingShift){
  const modal = document.getElementById('reportsModal');
  document.getElementById('adminToggleWrap').style.display = currentSession.role === 'admin' ? 'block' : 'none';
  if(!endingShift) modal.dataset.endingShift = "";
  buildReport();
  modal.classList.add('show');
}

function buildReport(){
  const showAll = currentSession.role === 'admin' && document.getElementById('adminAllShifts').checked;
  const relevant = showAll
    ? transactions
    : transactions.filter(t => t.cashier.username === currentSession.username && t.shift === currentSession.shift);

  const count = relevant.length;
  const totalSales = relevant.reduce((s, t) => s + t.totalDue, 0);

  // most purchased product by quantity
  const qtyMap = {};
  relevant.forEach(t => t.items.forEach(it => {
    qtyMap[it.product_name] = (qtyMap[it.product_name] || 0) + it.quantity;
  }));
  let topProduct = '—';
  let topQty = 0;
  Object.entries(qtyMap).forEach(([name, qty]) => {
    if(qty > topQty){ topQty = qty; topProduct = name; }
  });

  document.getElementById('repCount').textContent = count;
  document.getElementById('repTotal').textContent = peso(totalSales);
  document.getElementById('repTop').textContent = topQty > 0 ? `${topProduct} (${topQty}x)` : '—';

  const tbody = document.getElementById('reportTableBody');
  if(relevant.length === 0){
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#8a7c5c; padding:16px;">No transactions yet this shift.</td></tr>';
  } else {
    tbody.innerHTML = relevant.slice().reverse().map(t => `
      <tr>
        <td>${t.transactionId}</td>
        <td>${t.date.toLocaleTimeString('en-PH', {hour:'2-digit', minute:'2-digit'})}</td>
        <td>${t.cashier.name}</td>
        <td>${t.shift}</td>
        <td>${t.items.map(i => `${i.product_name} x${i.quantity}`).join(', ')}</td>
        <td class="mono">${peso(t.totalDue)}</td>
        <td>${t.paymentMethod === 'credit' ? '📒 Credit' : '💵 Cash'}</td>
      </tr>
    `).join('');
  }
}

/* -----------------------------------------------------
   UTANG / CREDIT LOG
----------------------------------------------------- */
function buildUtangLog(){
  const unpaid = creditLog.filter(c => c.status === 'unpaid');
  const total = unpaid.reduce((s, c) => s + c.amount, 0);
  document.getElementById('utangTotal').textContent = peso(total);

  const tbody = document.getElementById('utangTableBody');
  if(unpaid.length === 0){
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#8a7c5c; padding:16px;">No outstanding credit right now. All clear! 🎉</td></tr>';
    return;
  }
  tbody.innerHTML = unpaid.slice().reverse().map(c => `
    <tr>
      <td>${c.customerName}</td>
      <td class="mono">${peso(c.amount)}</td>
      <td>${c.date.toLocaleDateString('en-PH', {month:'short', day:'numeric', year:'numeric'})}</td>
      <td>${c.transactionId}</td>
      <td>${c.cashierName}</td>
      <td><button class="pay-utang-btn" data-id="${c.creditId}">✓ Mark as Paid</button></td>
    </tr>
  `).join('');
}

document.getElementById('utangBtn').addEventListener('click', function(){
  buildUtangLog();
  document.getElementById('utangModal').classList.add('show');
});

document.getElementById('closeUtang').addEventListener('click', function(){
  document.getElementById('utangModal').classList.remove('show');
});

document.getElementById('utangTableBody').addEventListener('click', function(e){
  const btn = e.target.closest('.pay-utang-btn');
  if(!btn) return;
  const entry = creditLog.find(c => c.creditId === btn.dataset.id);
  if(!entry) return;
  if(confirm(`Has ${entry.customerName} paid the ${peso(entry.amount)}? They will be removed from the credit list.`)){
    entry.status = 'paid';
    entry.paidDate = new Date();
    buildUtangLog();
    showToast(`Paid: ${entry.customerName} — ${peso(entry.amount)}`);
  }
});

document.getElementById('reportsBtn').addEventListener('click', () => openReports(false));
document.getElementById('adminAllShifts').addEventListener('change', buildReport);

document.getElementById('closeReports').addEventListener('click', function(){
  const modal = document.getElementById('reportsModal');
  modal.classList.remove('show');
  if(modal.dataset.endingShift === "1"){
    // finish logout
    currentSession = null;
    cart = [];
    document.getElementById('posScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    modal.dataset.endingShift = "";
    showToast("Shift ended. Thank you!");
  }
});
