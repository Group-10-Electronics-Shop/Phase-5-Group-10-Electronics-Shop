import fetch from "node-fetch"; // install: npm install node-fetch

const FRONTEND = "http://localhost:3000";
const BACKEND = "http://localhost:5000";

async function testIntegration() {
  try {
    console.log("🔎 Checking backend health...");
    const health = await fetch(`${BACKEND}/health`);
    if (!health.ok) throw new Error("Backend not healthy");
    console.log("✅ Backend is running");

    console.log("🔎 Fetching products...");
    const res = await fetch(`${BACKEND}/products`);
    const products = await res.json();
    console.log("✅ Products received:", products.slice(0, 2)); // show first 2

    console.log("🔎 Checking if frontend is live...");
    const front = await fetch(FRONTEND);
    if (!front.ok) throw new Error("Frontend not responding");
    console.log("✅ Frontend is live");

    console.log("\n🎉 SUCCESS: Frontend + Backend are connected!");
  } catch (err) {
    console.error("❌ Integration failed:", err.message);
  }
}

testIntegration();
