const app = require("./app");

console.log("App =", app);
console.log("Type =", typeof app);
console.log("Has listen =", app.listen);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
