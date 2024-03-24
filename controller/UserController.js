const userSchema = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const salt = 10;
const jsonwebtoken = require("jsonwebtoken");
const register = (req,resp)=>{
    userSchema.findOne({'email':req.body.email})
        .then(result=>{
            if (result==null){
                const transporter = nodemailer.createTransport({
                    service:"gmail",
                    auth:{
                        user:"sachinthadilshan711@gmail.com",
                        pass:"llyb cmvu npon ebll"
                    }
                });
                const mailOption = {
                    from:"sachinthadilshan711@gmail.com",
                    to:req.body.email,
                    subject:"New Account",
                    text:"New account created"
                }

                bcrypt.hash(req.body.password,salt,function(err,hash){
                    if (err){
                        return resp.status(500).json(err);
                    }
                    const user = new userSchema({
                        fullName:req.body.fullName,
                        password:hash,
                        email:req.body.email,
                        activeState:true
                    });
                    user.save()
                        .then(savedResponse=>{
                            transporter.sendMail(mailOption,function (error,info){
                                if (error){
                                    return resp.status(500).json({'error':error});
                                }else{
                                    return resp.status(200).json({'information':info});
                                }
                            });
                            return resp.status(201).json({"message":"user  saved"});
                        }).catch(error=>{
                        return  resp.status(500).json(error);
                    })
                });
            }else{
                return  resp.status(409).json({"error":"Email already exists"});
            }
        })

}

const login = (req,resp)=>{
    userSchema.findOne({'email':req.body.email}).then(selectedUser=>{
        if (selectedUser !== null){
            bcrypt.compare(req.body.password,selectedUser.password,function(err,result){
                if (err){
                    return resp.status(500).json({"message":"Login failed"});
                }
                if (result){
                    const payload = {
                        email:selectedUser.email
                    }
                    const secretKey = process.env["SECRET_KEY"];
                    const expiresIn = '24h';
                    const token = jsonwebtoken.sign(payload,secretKey, {expiresIn});
                    return resp.status(200).json({'token':token});
                }else{
                    return resp.status(401).json({'message':"Invalid Password"});
                }
            })
        }else{
            return resp.status(404).json({"message":"User not found"});
        }
    })
}


module.exports ={register,login}
