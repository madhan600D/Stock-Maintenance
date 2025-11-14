import { Op } from "sequelize"
import dayjs from 'dayjs'
//DataBase
import objUserDb from "../../Utils/userDB.js"
import objInventoryDataBase from '../../Utils/InventoryDB.js'

//Kafka
import {ObjUserKafkaProducer} from '../../Kafka/Producer/kafkaProducer.js'

//Objects
import {ObjDateManipulations} from '../../Class/DateManipulation.class.js'
import ObjAutoCloseDay from "../../Class/AutoCloseDay.class.js"
import Simulation from "../../Class/Simulation.class.js"
import { ObjOrder } from "../../Class/Order.class.js"
export const joinOrg = async (req , res) => {
    //TBD: When adding user to a ORG a mail is sent to Admin and a task will be added in his task list
    //API Structure:{JoinId , userName , userId} request
    //API Structure:{JoinMethod , userName , userId , OrganizationJoiningCode} referral
    try {
        const JoinOrgTransaction = await objUserDb.userDB.transaction()
        const {JoinMethod} = req.body
        let errorMessage
        let ValidUser = await objUserDb.AllModels.users.findOne({where:{[Op.and]:{userId:req.user.userId , organizationId:1}}})
        if(!ValidUser){
            errorMessage = "Invalid user, Cannot join organization ...!"
            await objUserDb.AllModels.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
            return res.status(400).json({success:false , message:errorMessage})
        }
        switch (JoinMethod){ 
            case "request":
                //TBD:A mail will be sent to Org admin who can accept the request
                break
            case "referral":
                const OrganizationJoiningCode = req.body.OrganizationJoiningCode
                if(!OrganizationJoiningCode){
                    errorMessage = "Please provide a organization code ...!"
                    await objUserDb.AllModels.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
                    return res.status(400).json({success:false , message:errorMessage})
                }

                const isOrgCodeExists = await objUserDb.AllModels.organizations.findOne({where:{OrganizationJoiningCode:OrganizationJoiningCode}})
                if(!isOrgCodeExists){
                    errorMessage = "Please provide a valid organization code ...!"
                    await objUserDb.AllModels.userErrorLog.create({ErrorDescription:errorMessage , ClientorServer:'client'})
                    return res.status(400).json({success:false , message:errorMessage})
                }
                //Update the users Table organizationId
                const joinedOrg = await objUserDb.AllModels.users.update({organizationId:isOrgCodeExists.organizationId} , 
                                                                 {where:{userId:req.user.userId} , transaction:JoinOrgTransaction})
                
                const updatedUser = await objUserDb.AllModels.users.findOne({include:[{
                        model:objUserDb.AllModels.organizations, attributes:['organizationName']}
                    ]},{where:{userName:req.user.userId} , transaction:JoinOrgTransaction}) 

                const NewRole = await objUserDb.AllModels.roles.create({userId:req.user.userId , roleId:3 , role:"Staff" , organizationId:joinedOrg.organizationId} , {transaction:JoinOrgTransaction})
                
                const DataToClient = {organizationName:updatedUser.organization.organizationName , organizationId:updatedUser.organizationId}

                await JoinOrgTransaction.commit()
                return res.status(200).json({success:true , message:  `Sucessfully joined ${updatedUser.organization.organizationName}` , data:DataToClient})
        }
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        await JoinOrgTransaction.rollback()
        return req.status(500).json({success:false , message:error.message});
    }
}
export const createOrg = async (req , res) => {
    //At front end all organization related details should be displayed after created
    //Ability to send Invite to join this Application to others VIA Email :: How? A verification code is sent via mail
    //Entering the code will add the user to the org

    let CreateOrgTransaction = await objUserDb.userDB.transaction();
    try {
        //API Structure: {organizationName , typeOfBusiness , street , city , country , pincode , userId , ClosingTime , Weekends}    
        let errorMessage , OrganizationCode
        const {OrganizationName , TypeOfBusiness , Address , ClosingTime , Weekends} = req?.body
        //8 Digit unique ID --> Generate untill no Id is Found in DB
        OrganizationCode = Math.floor(10000000 + Math.random() * 90000000);
        let isIDExist = await objUserDb.AllModels.organizations.findOne({where:{OrganizationJoiningCode:OrganizationCode}})
        while(isIDExist){
                OrganizationCode = Math.floor(10000000 + Math.random() * 90000000);
                isIDExist = await objUserDb.AllModels.organizations.findOne({where:{OrganizationJoiningCode:OrganizationCode}})
        }
        //Add in Org Table and Admin Table
        const newOrganization = await objUserDb.AllModels.organizations.create({
                                        organizationName:OrganizationName.toUpperCase() , 
                                        typeofBusiness:TypeOfBusiness,
                                        street: Address.Street,
                                        city:Address.City,
                                        country:Address.Country,
                                        pincode:Number(Address.Pincode) ,
                                        OrganizationJoiningCode:OrganizationCode
        } , {transaction:CreateOrgTransaction})
        
        //Admin table entry
        await objUserDb.AllModels.admins.create({organizationId:newOrganization.organizationId , 
                                       adminId:req.user.userId,
                                       organizationName:OrganizationName.toUpperCase()
        } , {transaction:CreateOrgTransaction})

        //Roles table entry
        await objUserDb.AllModels.roles.create({userId:req.user.userId , 
                                       roleId:1, role:'Admin' , organizationId:newOrganization.organizationId} , {transaction:CreateOrgTransaction})
        //State table entry
        await objUserDb.AllModels.users.update(
            { organizationId: newOrganization.organizationId }, 
            { where: { userId: req.user.userId } , transaction:CreateOrgTransaction }        
        );

        //Data entry in OrgState Table
        const OrgState = await objInventoryDataBase.AllModels.OrgState.create({
            OrganizationID:newOrganization.organizationId , RunDate: dayjs().format("YYYY-MM-DD") , CurrentDaySales:0 , ClosingTime:ClosingTime , Weekends:Weekends.toString() , AutoDayShiftFlag: 1 , IsDayClosed:0
        } , {transaction:CreateOrgTransaction})

        //Data entry to PNL Table

        const PNL = await objInventoryDataBase.AllModels.PNL.create({
            OrganizationID:newOrganization.organizationId , TotalExpense:0 , TotalRevenue:0
        } , {transaction:CreateOrgTransaction})

        

        const DataToClient = {NewOrg:{OrganizationID:newOrganization.organizationId , OrganizationName:newOrganization.organizatinName , OrganizationJoiningCode:newOrganization.OrganizationJoiningCode, TypeOfBusiness:TypeOfBusiness} , OrgState:{RunDate:OrgState.RunDate , CurrentDaySales:OrgState.CurrentDaySales , ClosingTime:OrgState.ClosingTime , Weekends:OrgState.Weekends , AutoDayShiftFlag:OrgState.AutoDayShiftFlag} , PNL:{TotalExpense:PNL.TotalExpense , TotalRevenue:PNL.TotalRevenue}}

        await CreateOrgTransaction.commit()

        //TBD:Call mail service and send mail to Admin with welcome details:Kafka
        return res.status(200).json({success:true , message:`Sucessfully created organization ${newOrganization.organizationName}` , data:DataToClient});
        
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        await CreateOrgTransaction.rollback()
        return res.status(500).json({success:false , message:error.message})
    }
}
export const groupInviteToOrg = async (req , res ) => {
    //API Strcuture = {GroupOfUsers[Array]}
    try {
        let KafkaMessage  = {}
        KafkaMessage.Data = {GroupOfUsers:req.body.GroupOfUsers , Organization:req.OrganizationData, UserData:req.UserData};
        KafkaMessage.Event = "GroupMailInvitation"
        const IsSuccess = await ObjUserKafkaProducer.ProduceEvent("GroupMailInvitation" , "user.group_mail" , KafkaMessage);
        if(!IsSuccess){ 
            res.status(500).json({success:false , message:"Can't invite users to organization , Server failed ...!"})
        }
        res.status(200).json({success:false , message:"Organization invitation mail sent to mentioned users ...!"});
    } catch (error) {
     res.status(500).json({success:false , message:"Group invitation failed at server side"});
    }
}

export const getOrganizationData =async (req , res) => {
    try {
        let OrganizationDataForClient = {}

        const OrgDataFromDB = await objInventoryDataBase.AllModels.OrgState.findOne({
            include:[
                {
                    model:objInventoryDataBase.AllModels.organizations,
                    where:{organizationId:req.user.organizationId},
                }
            ],
            where:{OrganizationID:req.user.organizationId},
        })

        const PNLData = await objInventoryDataBase.AllModels.PNL.findOne({where:{OrganizationID:req.user.organizationId}})

        OrganizationDataForClient = {OrganizationName:OrgDataFromDB.organization.organizationName
        , OrganizationID:req.user.organizationId , OrganizationJoiningCode:OrgDataFromDB.organization.OrganizationJoiningCode , RunDate:OrgDataFromDB.RunDate ,CurrentDaySales:OrgDataFromDB.CurrentDaySales , ClosingTime:OrgDataFromDB.ClosingTime , Weekends:OrgDataFromDB.Weekends , TotalExpense:PNLData.TotalExpense , TotalRevenue:PNLData.TotalRevenue}

        return res.status(200).json({success:true , data:OrganizationDataForClient});

    } catch (error) {
        console.log(error);
    } 
}

export const leaveOrg = async (req ,res) => {
 
}

export const GetRole = async (req , res) => {
    try {
        const {UserID} = req.query;
        const CurrentRole = await objInventoryDataBase.AllModels.roles.findOne({where:{userId:UserID} , raw:true});
        return {success:true , data:CurrentRole.role}
    } catch (error) {
        console.log(error)
    }
}
export const getOrganizations = async (req , res) => {
    try {
        const AllOrganizations = await objUserDb.AllModels.organizations.findAll({where:{organizationName:{[Op.ne]:'New'}}, attributes:['organizationName'] , raw:true})

        return res.status(200).json({success:true , data:AllOrganizations})
    } catch (error) {
        
    }
}

export const acceptOrgRequest = async (req) =>{
    try {
        //API Structure: /:userID
        const userId = req.query?.userId , orgId = req.query?.orgId
        const isValidUser = await objUserDb.AllModels.users.findOne({[Op.and]:{where:{userId: userID , organizationId:1}}})
        if(isValidUser){
            await objUserDb.AllModels.users.update({organizationId:orgId} , {where:{userId:userId}})
        }
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
    }
}

export const ManualCloseDay = async(req , res) => {
    try {
        //Declarations
        let ClientData = {};
        var Transaction = await objInventoryDataBase.InventoryDB.transaction();


        const OrganizationState = await objInventoryDataBase.AllModels.OrgState.findOne({where:{OrganizationID:req.user.organizationId}});

        //Simulation 
        const ProductsOfOrganization = await objInventoryDataBase.AllModels.Products.findAll({where:{OrganizationID:req.user.organizationId} , raw:true});
        let ProductEWMA  = [] , OrderArray = []

        for(let Product of ProductsOfOrganization){
            var ObjSimulation = new Simulation(Product , objInventoryDataBase);

            const LTDforProduct = await ObjSimulation.ForecastDemand()

            if(!LTDforProduct.success){
                continue
            }
            let HasActiveOrder = false;
            const ActiveOrdersForVendor = await objInventoryDataBase.AllModels.Orders.findAll({where:{VendorID:Product.VendorID}});

            for(let GroupOfOrders of ActiveOrdersForVendor){
                let Condition =  GroupOfOrders.OrderJSON.some(Order => Order.ProductID == Product.ProductID)
                Condition == true ? HasActiveOrder = true : ''
            }

            if(LTDforProduct.data >= Product.Quantity && !HasActiveOrder){ 
                //Add to order array
                OrderArray.push({ProductID:Product.ProductID , ProductName:Product.ProductName , Quantity:LTDforProduct.data})

                
            }
            //ProductEWMA result for DB updation
            ProductEWMA.push({ProductID:Product.ProductID , SimulatedLTD:LTDforProduct.data})
        }

        //Prepare parameters for order
        const OrganizationData = await objInventoryDataBase.AllModels.organizations.findOne({where:{organizationId:req.user.organizationId} , raw:true});

        const OrgState = await objInventoryDataBase.AllModels.OrgState.findOne({where:{OrganizationID:req.user.organizationId}});

        let UserDataParam = {OrganizationID:req.user.organizationId , OrganizationName:OrganizationData.OrganizationName , RunDate:OrgState.RunDate};

        if(OrderArray.length > 0){
            //Place order
            await ObjOrder.PlaceManualOrder(UserDataParam , OrderArray);

            console.log(`Order Placed for ${OrganizationData.OrganizationName}. Order Details: ${OrderArray}`);
            
        }
        //Update EWMA results in DB
        await ObjSimulation.UpdateEWMAResult(ProductEWMA , {OrganizationID:OrganizationData.organizationId , RunDate:OrgState.RunDate , Transaction}); 

        const NextRundate = await ObjDateManipulations.GetNextBusinessDay(OrganizationState.RunDate , {OrganizationID:req.user.organizationId});

        if(!NextRundate.success){
            return res.status(500).json({Success:NextRundate.success , message:NextRundate.message});
        }

        const [Count, NewOrganizationState] = await objInventoryDataBase.AllModels.OrgState.update(
                                    { RunDate: NextRundate.data, CurrentDaySales: 0  , IsDayClosed:1},
                                    {
                                        where: { OrganizationID: req.user.organizationId },
                                        transaction: Transaction,
                                        returning: true,
                                        raw:true
                                    }
                                    );
                                    
        ClientData.OrgState = NewOrganizationState[0];

        //Update internal Org state Map
        ObjAutoCloseDay.OrganizationCloseTimings.set(ClientData.OrgState.OrganizationID , {ClosingTime:NewOrganizationState[0].ClosingTime , IsDayClosed:NewOrganizationState[0].IsDayClosed})

        await Transaction.commit()

        return res.status(200).json({success:true , message:"Organization closed and moved to the next day...!" , data:ClientData})
    } catch (error) {
        await objUserDb.AllModels.userErrorLog.create({ErrorDescription:error.message , ClientorServer:'server'})
        await Transaction.rollback()
        return res.status(500).json({success:false , message:"Server side error while closing the day" , error}) 
    }
}


