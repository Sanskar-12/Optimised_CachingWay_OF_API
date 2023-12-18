import express from "express";
import { connectDb } from "./db.js";
import morgan from "morgan";
import { faker } from "@faker-js/faker";
import { Product } from "./schema.js";
import NodeCache from "node-cache";

const app = express();
app.use(express.json())
const nodeCache = new NodeCache();
connectDb();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API is working");
});

app.get("/get/products", async (req, res) => {
  try {
    let products;

    if (nodeCache.has("products")) {
      products = JSON.parse(nodeCache.get("products"));
    } else {
      products = await Product.find({});

      nodeCache.set("products", JSON.stringify(products));
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/update/product", async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.query;

    const product = await Product.findById(id);

    product.name = name;

    await product.save();

    nodeCache.del("products");
    res.status(200).json({
      success: true,
      message: "Product Name Updated",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// async function generateProducts(count){
//     const products=[]

//     for(let i=0;i<count;i++)
//     {
//         const newProduct={
//             name:faker.commerce.productName(),
//             photo:faker.image.url(),
//             price:faker.commerce.price({min:1500,max:80000,dec:0}),
//             stock:faker.commerce.price({min:0,max:100,dec:0}),
//             category:faker.commerce.department()
//         }

//         products.push(newProduct)
//     }

//     await Product.create(products)
// }

// generateProducts(40)

app.listen(4000, () => {
  console.log(`Server Connected 4000`);
});
