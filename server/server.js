const express = require("express");
const CORS = require("cors");
const app = express();
const port = 3000;
const digRouter = require("./routes/dig");
const playlistRouter = require("./routes/playlist");
const userRouter = require("./routes/user");
const searchRouter = require("./routes/search");
const loginRouter = require("./routes/login");
const normaRouter = require("./routes/norma");

app.use(CORS());
app.use(express.json());

app.use('/api/dig', digRouter);
app.use('/api/playlist', playlistRouter);
app.use('/api/user', userRouter);
app.use('/api/search', searchRouter);
app.use('/api/login', loginRouter);
app.use('/api/norma', normaRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
});

// bypass render.com's inactivity detection
setInterval(keepServerActive, 10*60 * 1000);

function keepServerActive () {
  console.log("INFO: keep server active")
}