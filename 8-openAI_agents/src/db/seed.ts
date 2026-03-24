// src/db/seed.ts
import { db, dbAll, dbRun, withTransaction } from "./client";

const force = process.argv.includes("--force");

if (!force) {
  const existing = dbAll("SELECT id FROM customers LIMIT 1");
  if (existing.length > 0) {
    console.log("✓ Already seeded. Pass --force to re-seed.");
    process.exit(0);
  }
}

if (force) {
  console.log("⚠️  Clearing tables...");
  db.run("DELETE FROM audit_log");
  db.run("DELETE FROM refunds");
  db.run("DELETE FROM order_items");
  db.run("DELETE FROM orders");
  db.run("DELETE FROM products");
  db.run("DELETE FROM categories");
  db.run("DELETE FROM customers");
  db.run("DELETE FROM sqlite_sequence");
}

console.log("🌱 Seeding...\n");

withTransaction(() => {
  // categories — IDs 1=Electronics 2=Clothing 3=Home 4=Sports
  for (const name of ["Electronics", "Clothing", "Home & Kitchen", "Sports"]) {
    dbRun("INSERT INTO categories (name) VALUES (?1)", [name]);
  }

  // customers
  const customers: [string, string, string, string][] = [
    ["Arjun Sharma", "arjun@example.com", "9876543210", "gold"],
    ["Priya Mehta", "priya@example.com", "9876543211", "silver"],
    ["Rahul Verma", "rahul@example.com", "9876543212", "bronze"],
    ["Sneha Patel", "sneha@example.com", "9876543213", "gold"],
    ["Vikram Singh", "vikram@example.com", "9876543214", "silver"],
    ["Ananya Gupta", "ananya@example.com", "9876543215", "bronze"],
    ["Kiran Nair", "kiran@example.com", "9876543216", "silver"],
    ["Deepak Joshi", "deepak@example.com", "9876543217", "bronze"],
    ["Meera Iyer", "meera@example.com", "9876543218", "gold"],
    ["Rohan Malhotra", "rohan@example.com", "9876543219", "bronze"],
  ];
  for (const [name, email, phone, tier] of customers) {
    dbRun(
      "INSERT INTO customers (name, email, phone, tier) VALUES (?1, ?2, ?3, ?4)",
      [name, email, phone, tier],
    );
  }

  // products — [sku, name, cat_id, price, stock, threshold]
  const products: [string, string, number, number, number, number][] = [
    ["ELEC-001", "Wireless Headphones", 1, 2499, 45, 10],
    ["ELEC-002", "Bluetooth Speaker", 1, 1799, 3, 8], // ⚠ low
    ["ELEC-003", "USB-C Charging Cable", 1, 299, 120, 20],
    ["ELEC-004", "Mechanical Keyboard", 1, 3999, 12, 5],
    ["ELEC-005", "Webcam 1080p", 1, 2199, 2, 5], // ⚠ low
    ["CLTH-001", "Cotton Kurta", 2, 899, 60, 15],
    ["CLTH-002", "Denim Jeans", 2, 1499, 35, 10],
    ["CLTH-003", "Formal Shirt", 2, 1199, 4, 8], // ⚠ low
    ["CLTH-004", "Sports Joggers", 2, 799, 50, 12],
    ["CLTH-005", "Winter Jacket", 2, 3499, 18, 5],
    ["HOME-001", "Non-stick Cookware Set", 3, 2999, 22, 5],
    ["HOME-002", "Stainless Steel Bottle", 3, 499, 80, 20],
    ["HOME-003", "Air Purifier", 3, 8999, 7, 3],
    ["HOME-004", "Bed Sheet Set", 3, 1299, 0, 5], // ✗ out of stock
    ["HOME-005", "Electric Kettle", 3, 1099, 33, 8],
    ["SPRT-001", "Yoga Mat", 4, 699, 55, 10],
    ["SPRT-002", "Dumbbell Set (5kg)", 4, 1599, 14, 5],
    ["SPRT-003", "Cricket Bat", 4, 2299, 3, 5], // ⚠ low
    ["SPRT-004", "Running Shoes", 4, 3299, 28, 8],
    ["SPRT-005", "Resistance Bands", 4, 399, 65, 15],
  ];
  for (const [sku, name, cat, price, stock, threshold] of products) {
    dbRun(
      `INSERT INTO products (sku, name, category_id, price, stock_qty, restock_threshold)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
      [sku, name, cat, price, stock, threshold],
    );
  }

  // orders + items
  const prices = products.map((p) => p[3]); // 0-indexed, pid is 1-indexed

  type OrderSeed = [number, string, string, [number, number][]];
  const orderSeeds: OrderSeed[] = [
    [
      1,
      "delivered",
      "12 MG Road, Bengaluru",
      [
        [1, 1],
        [3, 2],
      ],
    ],
    [1, "shipped", "12 MG Road, Bengaluru", [[4, 1]]],
    [
      2,
      "delivered",
      "5 Park Street, Kolkata",
      [
        [6, 2],
        [7, 1],
      ],
    ],
    [
      2,
      "pending",
      "5 Park Street, Kolkata",
      [
        [2, 1],
        [5, 1],
      ],
    ],
    [
      3,
      "confirmed",
      "88 Linking Road, Mumbai",
      [
        [11, 1],
        [15, 1],
      ],
    ],
    [3, "cancelled", "88 Linking Road, Mumbai", [[8, 1]]],
    [4, "delivered", "3 Rajpur Road, Dehradun", [[13, 1]]],
    [
      4,
      "delivered",
      "3 Rajpur Road, Dehradun",
      [
        [16, 2],
        [20, 3],
      ],
    ],
    [
      4,
      "shipped",
      "3 Rajpur Road, Dehradun",
      [
        [19, 1],
        [17, 1],
      ],
    ],
    [
      5,
      "pending",
      "77 Anna Salai, Chennai",
      [
        [1, 1],
        [2, 1],
      ],
    ],
    [5, "delivered", "77 Anna Salai, Chennai", [[9, 2]]],
    [
      6,
      "delivered",
      "22 Civil Lines, Allahabad",
      [
        [12, 2],
        [3, 4],
      ],
    ],
    [6, "cancelled", "22 Civil Lines, Allahabad", [[18, 1]]],
    [
      7,
      "confirmed",
      "9 Sector 17, Chandigarh",
      [
        [4, 1],
        [10, 1],
      ],
    ],
    [
      7,
      "pending",
      "9 Sector 17, Chandigarh",
      [
        [15, 1],
        [14, 1],
      ],
    ],
    [8, "delivered", "66 Residency Road, Lucknow", [[5, 1]]],
    [
      8,
      "shipped",
      "66 Residency Road, Lucknow",
      [
        [6, 3],
        [7, 2],
      ],
    ],
    [
      9,
      "delivered",
      "101 Jubilee Hills, Hyderabad",
      [
        [1, 2],
        [16, 1],
      ],
    ],
    [9, "pending", "101 Jubilee Hills, Hyderabad", [[11, 1]]],
    [
      10,
      "confirmed",
      "34 New BEL Road, Bengaluru",
      [
        [19, 2],
        [20, 1],
      ],
    ],
    [
      10,
      "delivered",
      "34 New BEL Road, Bengaluru",
      [
        [13, 1],
        [3, 3],
      ],
    ],
    [
      1,
      "delivered",
      "12 MG Road, Bengaluru",
      [
        [17, 1],
        [18, 1],
      ],
    ],
    [
      2,
      "shipped",
      "5 Park Street, Kolkata",
      [
        [9, 1],
        [10, 1],
      ],
    ],
    [3, "pending", "88 Linking Road, Mumbai", [[2, 2]]],
    [
      4,
      "cancelled",
      "3 Rajpur Road, Dehradun",
      [
        [4, 1],
        [6, 1],
      ],
    ],
    [
      5,
      "delivered",
      "77 Anna Salai, Chennai",
      [
        [12, 1],
        [15, 2],
      ],
    ],
    [6, "shipped", "22 Civil Lines, Allahabad", [[1, 1]]],
    [
      7,
      "delivered",
      "9 Sector 17, Chandigarh",
      [
        [19, 1],
        [20, 2],
      ],
    ],
    [
      8,
      "pending",
      "66 Residency Road, Lucknow",
      [
        [7, 1],
        [8, 1],
      ],
    ],
    [9, "confirmed", "101 Jubilee Hills, Hyderabad", [[4, 2]]],
  ];

  for (const [custId, status, address, items] of orderSeeds) {
    const total = items.reduce(
      (sum, [pid, qty]) => sum + prices[pid - 1] * qty,
      0,
    );
    const { lastInsertRowid: orderId } = dbRun(
      `INSERT INTO orders (customer_id, status, total, shipping_address)
       VALUES (?1, ?2, ?3, ?4)`,
      [custId, status, total, address],
    );
    for (const [pid, qty] of items) {
      dbRun(
        `INSERT INTO order_items (order_id, product_id, qty, unit_price)
         VALUES (?1, ?2, ?3, ?4)`,
        [orderId, pid, qty, prices[pid - 1]],
      );
    }
  }

  // refunds
  for (const r of [
    {
      order_id: 1,
      reason: "Item arrived damaged",
      status: "approved",
      amount: 2499,
    },
    {
      order_id: 3,
      reason: "Wrong size delivered",
      status: "approved",
      amount: 899,
    },
    {
      order_id: 7,
      reason: "Product stopped working",
      status: "pending",
      amount: 8999,
    },
    {
      order_id: 16,
      reason: "Changed my mind",
      status: "rejected",
      amount: 2199,
    },
    {
      order_id: 18,
      reason: "Item not as described",
      status: "pending",
      amount: 2499,
    },
  ]) {
    dbRun(
      `INSERT INTO refunds (order_id, reason, status, amount, resolved_at)
       VALUES (?1, ?2, ?3, ?4, ?5)`,
      [
        r.order_id,
        r.reason,
        r.status,
        r.amount,
        r.status !== "pending" ? new Date().toISOString() : null,
      ],
    );
  }

  // audit log
  for (const a of [
    {
      agent: "order_agent",
      action: "create_order",
      entity: "order",
      id: 1,
      note: "New order by Arjun Sharma",
    },
    {
      agent: "refund_agent",
      action: "approve_refund",
      entity: "refund",
      id: 1,
      note: "Damage confirmed by customer photo",
    },
    {
      agent: "refund_agent",
      action: "approve_refund",
      entity: "refund",
      id: 2,
      note: "Wrong item confirmed",
    },
    {
      agent: "inventory_agent",
      action: "restock_alert",
      entity: "product",
      id: 2,
      note: "Bluetooth Speaker below threshold",
    },
    {
      agent: "refund_agent",
      action: "reject_refund",
      entity: "refund",
      id: 4,
      note: "Change of mind not covered",
    },
  ]) {
    dbRun(
      `INSERT INTO audit_log (agent, action, entity, entity_id, note)
       VALUES (?1, ?2, ?3, ?4, ?5)`,
      [a.agent, a.action, a.entity, a.id, a.note],
    );
  }
});

const n = (t: string) => (dbAll(`SELECT COUNT(*) as n FROM ${t}`)[0] as any).n;
console.log("✅ Done!\n");
console.log(`  customers   ${n("customers")}`);
console.log(`  products    ${n("products")}`);
console.log(`  orders      ${n("orders")}`);
console.log(`  order_items ${n("order_items")}`);
console.log(`  refunds     ${n("refunds")}`);
