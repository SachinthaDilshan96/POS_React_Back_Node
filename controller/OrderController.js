const OrderSchema = require("../model/OrderSchema");
const CustomerSchema = require("../model/CustomerSchema");

const create=(req,resp)=>{
    const order = new OrderSchema({
        date:req.body.date,
        customerDetails:req.body.customerDetails,
        totalCost:req.body.totalCost,
        products:req.body.products
    });
    order.save().then(response=>{
        return resp.status(201).json({"message":"Order saved"});
    }).catch(error=>{
        return resp.status(500).json({"error":error});
    });
}

const findById =(req,resp)=>{
    OrderSchema.findOne({"_id":req.params.id}).then(selectedObj=>{
        if (selectedObj!==null){
            return resp.status(200).json({"data":selectedObj});
        }
        return resp.status(404).json({"message":"order not found"});
    });
}

const update =async (req,resp)=>{
    const updatedData = await OrderSchema.findOneAndUpdate({"_id":req.params.id},{
        $set:{
            date:req.body.date,
            customerDetails:req.body.customerDetails,
            totalCost:req.body.totalCost,
            products:req.body.products
        }
    },{new:true});
    if (updatedData){
        return resp.status(200).json({"message":"order updated"});
    }
    return resp.status(500).json({"message":"order not found"});

}

const deleteById =async (req,resp)=>{
    const deletedData = await OrderSchema.findByIdAndDelete({"_id":req.params.id});
    if (deletedData){
        return resp.status(204).json({"message":"order deleted"});
    }
    return resp.status(500).json({"message":"order not found"});

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
        const data = OrderSchema.find(query)
            .limit(pageSize)
            .skip(skip);
        return resp.status(200).json(data);

    }catch (error){
        return resp.status(500).json({"data":"internal server error"});
    }
}

const findOrderCounts =(req,resp)=>{
    try{
        OrderSchema.countDocuments().then(data=>{
            return resp.status(200).json(data);
        })

    }catch (error){
        return resp.status(500).json({'message':'internal server error'});
    }
}

const findIncome =async (req,resp)=>{
    try{
       const result = await OrderSchema.aggregate([
           {$group:{
               _id:null,
                   totalCostSum:{$sum:"$totalCost"}
               }}
       ]);
       const totalCostSum = result.length>0?result[0].totalCostSum:0;
       resp.json({totalCostSum});

    }catch (error){
        return resp.status(500).json({'message':'internal server error'});
    }
}

module.exports = {
    create,findById,update,deleteById,findAll,findOrderCounts,findIncome
}
