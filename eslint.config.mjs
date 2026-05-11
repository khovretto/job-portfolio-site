import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      "hifi/**",
      "Maksim Khovrov.html",
      ".next/**",
      "node_modules/**",
      "ops/**",
    ],
  },
  ...nextVitals,
];

export default config;
