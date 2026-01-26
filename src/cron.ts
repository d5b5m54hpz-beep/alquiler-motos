import cron from "node-cron";

// IMPORTANTE:
// estos endpoints YA EXISTEN en tu app
const BASE_URL = "http://localhost:3000";

// Job: pagos vencidos
cron.schedule("0 3 * * *", async () => {
  try {
    console.log("⏰ Ejecutando job de vencimientos...");
    await fetch(`${BASE_URL}/api/jobs/vencimientos`, {
      method: "POST",
    });
    console.log("✅ Job de vencimientos ejecutado");
  } catch (err) {
    console.error("❌ Error en job de vencimientos", err);
  }
});

// Job: contratos por vencer
cron.schedule("30 3 * * *", async () => {
  try {
    console.log("⏰ Ejecutando job de contratos por vencer...");
    await fetch(`${BASE_URL}/api/jobs/contratos-por-vencer`, {
      method: "POST",
    });
    console.log("✅ Job de contratos por vencer ejecutado");
  } catch (err) {
    console.error("❌ Error en job de contratos por vencer", err);
  }
});

// Job: facturar pagos
cron.schedule("10 4 * * *", async () => {
  try {
    console.log("⏰ Ejecutando job de facturación...");
    await fetch(`${BASE_URL}/api/jobs/facturar-pagos`, {
      method: "POST",
    });
    console.log("✅ Job de facturación ejecutado");
  } catch (err) {
    console.error("❌ Error en job de facturación", err);
  }
});

console.log("🕒 Cron jobs inicializados");
