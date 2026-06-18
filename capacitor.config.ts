import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rkglobal.fabricerp",
  appName: "RK Global Fabric ERP",
  webDir: "out",
  server: {
    url: "https://erp-xi-rose.vercel.app",
    cleartext: true,
  },
};

export default config;
