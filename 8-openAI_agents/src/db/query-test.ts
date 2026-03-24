// src/db/query-test.ts
import { dbAll, dbGet } from "./client";
import type { Customer, Product } from "./schema";

const hr = "─".repeat(52);
console.log(hr + "\n  DB Query Test\n" + hr + "\n");

// 1. Gold customers
const gold = dbAll<Customer>("SELECT * FROM customers WHERE tier = 'gold'");
console.log(`👑 Gold customers (${gold.length}):`);
for (const c of gold) console.log(`   ${c.id}. ${c.name}  <${c.email}>`);

// 2. Low / out-of-stock products
const low = dbAll<Product>(
  `SELECT * FROM products
   WHERE  stock_qty <= restock_threshold
   ORDER  BY stock_qty ASC`,
);
console.log(`\n⚠️  Low stock (${low.length}):`);
for (const p of low)
  console.log(
    `   [${p.sku}] ${p.name.padEnd(24)} stock=${p.stock_qty}  threshold=${p.restock_threshold}`,
  );

// 3. Pending refunds with customer name
const pending = dbAll<{
  refund_id: number;
  amount: number;
  reason: string;
  customer: string;
}>(
  `SELECT r.id AS refund_id, r.amount, r.reason, c.name AS customer
   FROM   refunds r
   JOIN   orders    o ON r.order_id    = o.id
   JOIN   customers c ON o.customer_id = c.id
   WHERE  r.status = 'pending'`,
);
console.log(`\n🔄 Pending refunds (${pending.length}):`);
for (const r of pending)
  console.log(`   #${r.refund_id}  ₹${r.amount}  ${r.customer}  "${r.reason}"`);

// 4. Top 5 customers by lifetime spend
const top = dbAll<{ name: string; tier: string; spend: number }>(
  `SELECT   c.name, c.tier, ROUND(SUM(o.total), 2) AS spend
   FROM     customers c
   JOIN     orders    o ON c.id = o.customer_id
   WHERE    o.status != 'cancelled'
   GROUP BY c.id
   ORDER BY spend DESC
   LIMIT 5`,
);
console.log(`\n💰 Top 5 by spend:`);
for (const r of top)
  console.log(
    `   ${r.name.padEnd(18)} [${r.tier.padEnd(6)}]  ₹${r.spend.toLocaleString("en-IN")}`,
  );

// 5. Order summary
const orders = dbAll<{
  id: number;
  status: string;
  total: number;
  items: number;
  customer: string;
}>(
  `SELECT   o.id, o.status, o.total, COUNT(oi.id) AS items, c.name AS customer
   FROM     orders      o
   JOIN     order_items oi ON o.id          = oi.order_id
   JOIN     customers   c  ON o.customer_id = c.id
   GROUP BY o.id
   ORDER BY o.id
   LIMIT 10`,
);
console.log(`\n📦 First 10 orders:`);
for (const o of orders)
  console.log(
    `   #${String(o.id).padEnd(3)} [${o.status.padEnd(10)}]  ${o.items} items  ₹${o.total.toLocaleString("en-IN")}  — ${o.customer}`,
  );

// 6. Single customer lookup
const c = dbGet<Customer>("SELECT * FROM customers WHERE email = ?1", [
  "arjun@example.com",
]);
console.log(`\n🔍 Lookup arjun@example.com:`);
console.log(
  c ? `   id=${c.id}  name=${c.name}  tier=${c.tier}` : "   not found",
);

// 7. Audit log
const audit = dbAll("SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 5");
console.log(`\n📋 Audit log:`);
for (const a of audit as any[])
  console.log(`   [${a.agent}]  ${a.action}  ${a.entity} #${a.entity_id}`);

console.log("\n" + hr + "\n  ✅ All queries passed\n" + hr);
