# POS-SARI-SARI
# Aling Nena's Sari-Sari Store POS
## Member:
## **1. Lian Suzaine Sultan**
## **2. Jennie Lou L. Redondo**

This is our point-of-sale (POS) system project — a browser-based cashier system for a sari-sari/grocery store, complete with login, product catalog, cart, checkout, discounts, receipts, shift reports, and a credit ("utang") log. Made using just HTML, CSS, and JavaScript (no frameworks, no libraries, no database — everything runs in-memory and resets on page reload, per the project spec).

## What it does ( Features )

When you open the app, it asks the cashier to log in first (username, password, and which shift), then drops you into the actual POS screen with the product catalog on one side and the cart/order summary on the other.

**Core POS flow:**
- 50-item grocery catalog (mostly Filipino/native products), each with an auto-picked emoji icon based on its name
- Search bar and price-range filter to narrow down the product list
- Tap-to-add: clicking a product card rings it up immediately into the cart, no separate "add" step
- Cart with quantity +/- controls, remove button, and live subtotal/total
- Clear Cart button to reset the current order

**Checkout:**
- Two payment methods: **Cash** (asks for amount paid, computes change) and **Credit/Utang** (requires customer name, gets logged for later payment)
- **Senior/PWD discount** (5%) — the only discount in the app; requires entering a name and ID number and clicking "Apply Discount" before it actually applies (just checking the box isn't enough)
- Validates payment (won't let you check out with insufficient cash) and validates required fields before confirming

**After checkout:**
- Auto-generated printable-style receipt showing items, subtotal, discount, total, payment method, and change (or "ON CREDIT" if unpaid)
- Transactions get logged in-memory so they show up in shift reports

**Other features:**
- **Shift Reports** — shows number of transactions, total sales, and best-selling product for the current cashier's shift; admins get an extra toggle to view all shifts/all cashiers combined
- **Utang/Credit Log** — a running list of customers who bought on credit, with a "Mark as Paid" button to clear them once they've settled
- Toast notifications for quick feedback (item added, discount applied, payment marked, etc.)
- Logout flow that shows the shift's final report before actually logging out

## How the code works (the important parts)

### Login & session handling
`loginForm`'s submit handler checks the entered username/password against the hardcoded `users` array, and if it matches, builds a `currentSession` object (name, role, shift, login time) that the rest of the app reads from. This session gets cleared on logout, which also triggers a final shift report before actually returning to the login screen.

### Data & state
Everything is in-memory JavaScript arrays/objects — no backend, no database:
- `groceryItems` — the fixed product catalog
- `users` — hardcoded login accounts (cashiers + admin)
- `cart`, `transactions`, and `creditLog` — these build up as the app is used, and reset whenever the page reloads

### Product catalog & search
`getFilteredProducts()` filters `groceryItems` by matching the search text against product names and checking if the price falls inside the selected price range, then `renderProducts()` redraws the grid from whatever matches. The `emojiFor()` helper just runs the product name through a bunch of regex checks (meat, rice, drinks, sweets, etc.) to auto-assign an icon instead of us having to hardcode one per product.

### Cart logic
`addToCart()` checks if the product's already in the cart — if yes, just bumps the quantity instead of adding a duplicate row. `changeQty()` handles the +/- buttons and auto-removes the item if the quantity drops to 0. `cartSubtotal()` just sums up price × quantity across everything in the cart.

### Discount logic
Senior/PWD (5%) is the only discount in the app. It doesn't apply the moment the checkbox is checked — checking it only reveals the ID input. The discount only actually counts once the cashier fills in the name/ID and clicks "Apply Discount," which sets a `seniorPwdApplied` flag to true. If the ID field gets edited afterward, that flag resets to false so the discount has to be re-applied (avoids stale/incorrect discounts). If it isn't applied, the transaction just goes through at full price — no other discount kicks in automatically.

### Checkout & validation
Before finalizing a sale, we check: senior/PWD was actually applied (not just checked) if selected, customer name is filled in when required (credit purchases always need one), and — for cash — that the amount paid actually covers the total. Only after all of that passes do we build the `txn` object, push it into `transactions`, and (if paid on credit) also log it into `creditLog` with a status of `"unpaid"`.

### Receipts & reports
`showReceipt()` just takes the finished transaction object and formats it into a printable-looking summary. `buildReport()` filters `transactions` down to the current cashier's shift (or everything, if an admin has the "all shifts" toggle on) and calculates total sales plus the top-selling product by looping through every item in every transaction and tallying quantities.

### Utang (credit) log
`buildUtangLog()` filters `creditLog` down to unpaid entries only and renders them into a table with a "Mark as Paid" button per row, which flips that entry's status to `"paid"` and removes it from the outstanding list.

## Requirements Checklist & Partition of Works

### Core Requirements

| # | Requirement | How it's implemented | Handled by |
|---|---|---|---|
| 1 | **Product Catalog** — display the given dataset so the cashier can select items | `groceryItems` array (50 products, product_id/name/price) rendered as tappable cards via `renderProducts()` | **Lian Suzaine Sultan** |
| 2 | **Transaction Entry** — select product, enter quantity, calculate subtotal, record immediately | `addToCart()` / `changeQty()` add items and track quantity; `cartSubtotal()` computes price × quantity live as the cart updates | **Lian Suzaine Sultan** |
| 3 | **Checkout Process** — show total due, accept payment, calculate change, confirm | `refreshCheckoutTotals()` shows total; `paymentInput` + change calc under Cash tab; success shown via receipt + toast ("Transaction completed" equivalent) | **Jennie Lou L. Redondo** |
| 4 | **Transaction Records** — Txn ID, date, product details, qty, subtotal, total paid, change | Built inside the `confirmCheckout` handler as the `txn` object, then pushed into the `transactions` array | **Jennie Lou L. Redondo** |
| 5 | **Reporting Features** — view all transactions, total sales, most purchased product | `buildReport()` filters `transactions`, sums `totalDue` for total sales, and tallies item quantities to find the top product | **Lian Suzaine Sultan** |

### Additional Implemented Feature

| Feature | How it's implemented | Handled by |
|---|---|---|
| **Login & Session Handling** | `loginForm` submit handler validates username/password against `users`, builds the `currentSession` object (name, role, shift), and controls the login → POS screen transition plus logout flow | **Lian Suzaine Sultan** |

### Optional Enhancements Implemented

| Enhancement | How it's implemented | Handled by |
|---|---|---|
| **HTML receipt generation** | `showReceipt()` builds a formatted, printable-style receipt after every transaction | **Jennie Lou L. Redondo** |
| **Discounts** (Senior/PWD 5%) | `calcDiscount()` — requires an explicit "Apply Discount" click after entering name + ID; this is the only discount in the app | **Jennie Lou L. Redondo** |
| **Search filter** (by name and price range) | `getFilteredProducts()` filters `groceryItems` by search text and selected price range | **Lian Suzaine Sultan** |
| **Track customer names per transaction** | `customerName` field captured at checkout and stored in every `txn` (also used for the Utang/Credit Log) | **Jennie Lou L. Redondo** |
| **Simple UI** (buttons, forms, tables) | Login form, product grid, cart panel, checkout modal, receipt modal, reports table, utang table | **Shared** — built together across both parts |

*(Not part of the required list, but added as extra polish: shift system, per-shift reporting, admin "all shifts" view, and a full Utang/Credit Log with "Mark as Paid" — these were split alongside the related core features above.)*

## Partition of Works (Summary)

- **Lian Suzaine Sultan** (5 items) — Login & session handling, Product catalog, Search & filter, Cart & transaction entry logic, Reporting features
- **Jennie Lou L. Redondo** (5 items) — Checkout process, Transaction records, Discounts, Receipts, Utang/credit log & customer name tracking

## Deliverables
- Working POS application — `index.html` (open directly in browser, no setup required)
- Demonstration to cover: product selection → transaction recording → checkout/payment → reporting (total sales + most purchased product), as shown live in the presentation video

## How to run it
Just open `index.html` in a browser. No installs, no server, no database needed — everything is plain HTML/CSS/JS and runs entirely in memory (all data resets on page reload, as required by the project spec).

**Test login accounts (built into the code):**
| Username | Password | Role |
|---|---|---|
| juan | 1234 | cashier |
| maria | 1234 | cashier |
| admin | admin123 | admin |
