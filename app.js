const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

// app.engine(
//   "hbs",
//   expressHbs.engine({
//     layoutsDir: "views/layouts/",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );
// app.set("view engine", "hbs");

// app.set("view engine", "pug");
app.set("view engine", "ejs");
app.set("views", "views");

// next(); Allows the request to continue to the next middleware in line

// app.use("/", (req, res, next) => {
//   console.log("This always run!");
//   next();
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.findOne({ while: { id: 1 } });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// Relationships
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); // Optional
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

(async () => {
  try {
    await sequelize.sync();
    // const result = await sequelize.sync({ force: true })
    //console.log(result);
    const user = await User.findOne({ where: { id: 1 } });
    if (!user) {
      const newUser = await User.create({
        name: "Quoc",
        email: "quangquoc1542002@gmail.com",
      });
      newUser.createCart();
    } else {
      console.log("Found user:", user);
    }
    app.listen(3000);
  } catch (error) {
    console.log(error);
  }
})();
