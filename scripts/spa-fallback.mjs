// GitHub Pages não conhece rotas do React: servir o index.html como 404.html faz /vestidos etc. funcionarem ao recarregar.
import { copyFileSync } from "node:fs";

copyFileSync("dist/index.html", "dist/404.html");
console.log("dist/404.html criado (fallback de rotas)");
