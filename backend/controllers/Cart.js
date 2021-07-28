const { body, param, validationResult } = require('express-validator');

const { CartModel } = require('../models/Cart');
const { ItemModel } = require('../models/Item');


module.exports.validators = {
    getCart: [
        body('userId', 'Id of user is required').exists(),
    ],
    addItemToCart: [
        body('id', 'Id is required').exists(),
        body('userId', 'Id of user is required').exists(),
    ],
    deleteItemFromCart: [
        body('id', 'Id is required').exists(),
    ],
};

module.exports.controllers = {
    getCart: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if(!errors.isEmpty()){ return res.json(errors);}
            const { userId } = req.body;

            // Get from database
            const cart = await CartModel.aggregate([
                {
                    $match: 
                    {
                        userId: userId
                    }
                },
                {
                    $lookup :
                    {
                        from: "items",
                        localField: "item",
                        foreignField: "_id",
                        as : "datos_Item"
                    }
                }]);
            var total = 0.00;
            cart.forEach(item => {
                total += item.datos_Item[0].price
                });
            res.json({ data: cart, totalPrice: total, model: 'cart', count: cart.length });
        } catch (error) {
            res.json({message: error.message});
        }
    },
    addItemToCart: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if(!errors.isEmpty()){ return res.json(errors);}
            const { id, userId } = req.body;

            // Save in database
            const item = await ItemModel.findById(id);
            await CartModel.create({ item, userId });
            const cart = await CartModel.find({ userId: userId }); 
            res.json({ data: cart, model: 'cart', count: cart.length });
        } catch (error) {
            res.json({message: error.message});
        }
    },
    deleteItemFromCart: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if(!errors.isEmpty()){ return res.json(errors);}
            const { id, userId } = req.body;

            // Save in database
            const del = await CartModel.aggregate([
                {
                    $match: 
                    {
                        userId: userId,
                        item: id
                    }
                },
                { 
                    $limit: 1 
                }
                ]);
            await CartModel.deleteOne({ _id: del[0]._id });
            const cart = await CartModel.find({ userId: userId }); 
            res.json({ data: cart, model: 'cart', count: cart.length });
        } catch (error) {
            res.json({message: error.message});
        }
    },
};