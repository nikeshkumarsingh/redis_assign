const express = require("express");
const Product = require("../models/product.models");
const clint = require("../config/redis");
const router = express.Router();

router.post("", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const products = await Product.find().lean().exec();
    clint.set("product", JSON.stringify(products));
    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});
router.get("", async (req, res) => {
  try {
    clint.get("product", async (err, fetchedproduct) => {
      if (fetchedproduct) {
        const product = JSON.parse(fetchedproduct);
        return res.status(200).send({product,redis:true});
      }
      else{
          try{
              const product= await Product.find().lean.exec()
              clint.set("product",JSON.stringify(product))
              return res.status(200).send({product,redis:false})
          }catch(err){return res.status(500).send({ message: err.message });}
      }
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
    try {
        clint.get(`product.${req.params.id}`, async (err, fetchedproduct) => {
          if (fetchedproduct) {
            const product = JSON.parse(fetchedproduct);
            return res.status(200).send({product,redis:true});
          }
          else{
              try{
                  const product= await Product.findById(req.params.id).lean().exec()
                  clint.set(`product.${req.params.id}`,JSON.stringify(product))
                  return res.status(200).send({product,redis:false})
              }catch(err){return res.status(500).send({ message: err.message });}
          }
        });
      } catch (err) {
        return res.status(500).send({ message: err.message });
      }
});
router.patch("/:id", async (req, res) => {
  try {
      const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec()
      const products = await Product.find().lean().exec()
      clint.set(`product.${req.params.id}`,JSON.stringify(product))
      clint.set("product",JSON.stringify(products))
      return res.status(200).send(product)
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
       const product=await Product.findByIdAndDelete(req.params.id).lean().exec()
       const products=await Product.find().lean().exec()
       clint.del(`product.${req.params.id}`)
      clint.set("product",JSON.stringify(products))
      return res.status(200).send(product)
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
