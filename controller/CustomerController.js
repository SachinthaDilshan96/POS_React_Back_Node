const CustomerSchema = require("../model/CustomerSchema");
const {query} = require("express");
const ProductSchema = require("../model/ProductSchema");

const create=(req,resp)=>{
    const customer = new CustomerSchema({
        name:req.body.name,
        address:req.body.address,
        salary:req.body.salary
    });
    customer.save().then(response=>{
        return resp.status(201).json({"message":"customer saved"});
    }).catch(error=>{
        return resp.status(500).json({"error":error});
    });
}

const findById =(req,resp)=>{
    CustomerSchema.findOne({"_id":req.params.id}).then(selectedObj=>{
        if (selectedObj!==null){
            return resp.status(200).json({"data":selectedObj});
        }
        return resp.status(404).json({"message":"customer not found"});
    });
}

const update =async (req,resp)=>{
   const updatedData = await CustomerSchema.findOneAndUpdate({"_id":req.params.id},{
        $set:{
            name:req.body.name,
            address:req.body.address,
            salary:req.body.salary
        }
    },{new:true});
    if (updatedData){
        return resp.status(200).json({"message":"customer updated"});
    }
    return resp.status(500).json({"message":"customer not found"});

}

const deleteById =async (req,resp)=>{
    const deletedData = await CustomerSchema.findByIdAndDelete({"_id":req.params.id});
    if (deletedData){
        return resp.status(204).json({"message":"customer deleted"});
    }
    return resp.status(500).json({"message":"customer not found"});

}

const findAll =(req,resp)=>{
    try{
        const {searchText, page=1, size=10}=req.query;

        const pageNumber=parseInt(page);
        const pageSize=parseInt(size);

        const query ={};
        if(searchText){
            query.$text={$search:searchText}
        }

        const skip= (pageNumber-1) * pageSize;
        CustomerSchema.find(query)
            .limit(pageSize)
            .skip(skip).then(response=>{
            return resp.status(200).json(response);
        })

    }catch (error){
        console.log(error)
        return resp.status(500).json({'message':'internal server error'});
    }
}

const findCustomerCounts =(req,resp)=>{
    try{
        CustomerSchema.countDocuments().then(data=>{
            return resp.status(200).json(data);
        })

    }catch (error){
        return resp.status(500).json({'message':'internal server error'});
    }
}

module.exports = {
    create,findById,update,deleteById,findAll,findCustomerCounts
}
