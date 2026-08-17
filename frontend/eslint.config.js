import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. Ignorar carpetas de compilación y archivos de configuración
  { 
    ignores: ["dist", "build", "node_modules", "postcss.config.cjs", "eslint.config.js", "vite.config.ts"] 
  },
  
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } 
  },
  
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  
  // 2. Configurar la versión de React y apagar la regla de importación
  {
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off"
    }
  }
]);