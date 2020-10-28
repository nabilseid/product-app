var express = require("express");
var router = express.Router();

function sendRes(res, success, status, message) {
  res.send({ success: success, status: status, message: message });
}

const products = [
  {
    type: "phone",
    name: "Samsung Galaxy",
  },
];

// Add products
router.post("/product", function (req, res, next) {
  const { type, name } = req.body;

  if ((type != null) & (name != null)) {
    products.push({ type: type, name: name });
    sendRes(res, true, 200, "Product added!");
  } else {
    sendRes(res, false, 200, "Invalid product input");
  }
});

// Get products
router.get("/product", function (req, res, next) {
  res.send(products);
});

// Delete products
router.delete("/product", function (req, res, next) {
  const { name, type } = req.body;
  var auth = req.cookies["AuthToken"];
  if (auth) {
    const productKey = products.indexOf({ type: type, name: name });

    if (productKey) {
      delete products[productKey];
      return res.send(products);
    } else {
      sendRes(res, false, 200, "Product does not exist");
    }
  } else {
    sendRes(res, false, 200, "Not authenticated");
  }
});

// Update products
router.put("/product", function (req, res, next) {
  const { name, type } = req.body;
  var auth = req.cookies["AuthToken"];
  if (auth) {
    const product = products.find((p) => {
      return p.name === name;
    });

    if (product) {
      producsts = producsts.map((p) => {
        if (p.name == name) return { type: type, name: name };
        else return p;
      });
      return res.send(products);
    } else {
      sendRes(res, false, 200, "Product does not exist");
    }
  } else {
    sendRes(res, false, 200, "Not authenticated");
  }
});

module.exports = router;
