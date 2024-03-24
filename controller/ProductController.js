const ProductSchema = require("../model/ProductSchema");
const CustomerSchema = require("../model/CustomerSchema");
const {query} = require("express");

const create=(req,resp)=>{
    const product = new ProductSchema({
        name:req.body.name,
        description:req.body.description,
        image:req.body.image,
        unitPrice:req.body.unitPrice,
        qtyOnHand:req.body.qtyOnHand
    });
    product.save().then(response=>{
        return resp.status(201).json({"message":"product saved"});
    }).catch(error=>{
        return resp.status(500).json({"error":error});
    });
}

const findById =(req,resp)=>{
    ProductSchema.findOne({"_id":req.params.id}).then(selectedObj=>{
        if (selectedObj!==null){
            return resp.status(200).json({"data":selectedObj});
        }
        return resp.status(404).json({"message":"product not found"});
    });
}

const update =async (req,resp)=>{
    const updatedData = await ProductSchema.findOneAndUpdate({"_id":req.params.id},{
        $set:{
            name:req.body.name,
            description:req.body.description,
            image:req.body.image,
            unitPrice:req.body.unitPrice,
            qtyOnHand:req.body.qtyOnHand
        }
    },{new:true});
    if (updatedData){
        return resp.status(200).json({"message":"product updated"});
    }
    return resp.status(500).json({"message":"product not found"});

}

const deleteById =async (req,resp)=>{
    const deletedData = await ProductSchema.findByIdAndDelete({"_id":req.params.id});
    if (deletedData){
        return resp.status(204).json({"message":"product deleted"});
    }
    return resp.status(500).json({"message":"product not found"});

}

const findAll =(req,resp)=>{
    try{
        const {searchText,page=1,size=10} = req.query;
        const pageNumber = parseInt(page);
        const pageSize = parseInt(size);
        const query ={};
        if (searchText){
            query.$text = {$search:searchText}
        }
        const skip = (pageNumber-1)*pageSize;
        ProductSchema.find(query)
            .limit(pageSize)
            .skip(skip).then(data=>{
            return resp.status(200).json(data);
        });

    }catch (error){
        return resp.status(500).json({"data":"internal server error"});
    }
}

const findAllMin =(req,resp)=>{
    try{
        ProductSchema.find({qtyOnHand:{$lt:10}}).then(data=>{
            return resp.status(200).json(data);
        })

    }catch (error){
        return resp.status(500).json({'message':'internal server error'});
    }
}

const findAllCount =(req,resp)=>{
    try{
        ProductSchema.countDocuments().then(data=>{
            return resp.status(200).json(data);
        })

    }catch (error){
        return resp.status(500).json({'message':'internal server error'});
    }
}

module.exports = {
    create,findById,update,deleteById,findAll,findAllMin,findAllCount
}
