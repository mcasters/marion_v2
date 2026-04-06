import next from "next";
import express from "express";
import path from "node:path";
import dotenv from "dotenv";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
if (dev) dotenv.config({ path: ".env" });
const app = next({ dev, webpack: true });
const handle = app.getRequestHandler();

const server = express();

server.use(
  "/images",
  express.static(path.join(`${process.env.PHOTOS_PATH}`, "")),
);
server.all("*path", (req, res) => {
  return handle(req, res);
});
app
  .prepare()
  .then(() => {
    server.listen(port);
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`,
    );
  })
  .catch((err) => {
    console.log(err);
  });
