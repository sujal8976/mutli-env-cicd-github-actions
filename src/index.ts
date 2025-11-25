import app, { connectDB } from "./server";

const PORT = process.env.NODE_ENV === 'test' ? 5000 : (process.env.PORT || 3000);

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}