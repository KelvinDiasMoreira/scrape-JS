const { exec } = require("child_process");

const scripts = [
  "index.js",
  "index2.js",
  "index3.js",
  // "index5.js",
  // "index6.js",
  // "index7.js",
  // "index8.js",
  // "index9.js",
  // "index10.js",
  // "index11.js",
  // "index12.js",
  // "index13.js",
];

scripts.forEach((script) => {
  exec(`node ${script}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar ${script}: ${error}`);
      return;
    }
    console.log(`Script ${script} executado com sucesso.`);
  });
});
