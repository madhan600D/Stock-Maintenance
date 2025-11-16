

export class UserManagement{
    constructor(Database , AccessControl , SequelizeOP , UserDetails , TargetUserDetails = {} , OrganizationDetails = {} ,TaskDetails = {}){
        this.Database  = Database;
        this.AccessControl = AccessControl;
        this.SequelizeOP = SequelizeOP
        //ID , Name
        //Details
        this.UserDetails = UserDetails
        this.TargetUserDetails = TargetUserDetails
        this.OrganizationDetails = OrganizationDetails
        this.TaskDetails  = TaskDetails
    }
    async PromoteUser(UserData , TargetUser){

    }

    async DemoteUser(UserData , TargetUser){

    }
    async RaiseJoiningTask(){
        try {
            //Clear Old Tasks
            const OldTask = await this.Database.AllModels.Tasks.findAll({where:{TargetUserID : this.UserDetails.userId}})

            //Clear them 
            for(let task of OldTask){
                await task.destroy()
            }
            //Add a Task Entry to task table
            await this.Database.AllModels.Tasks.create({ 
                OrganizationID:this.OrganizationDetails.OrganizationID,
                TaskType:"JOIN",
                TargetUserID:this.UserDetails.userId,
                IsActive:1
            })

            return {success:true}
        } catch (error) {
            console.log(error)
            return {success:false , message:error}
        }
    }

    async AcceptJoiningTask(){
        try {
            //1.Validation
            const IsValid = this.IsValidToHandleTask();
            if(!IsValid){
                return {success:false , message:"Not authorized to handle this task..!"}
            }

            //2. Update Database
            await this.UpdateDatabase(this.TargetUserDetails.TargetUserID);

            return {success:true , message:"Task accepted successfully..!"}
        } catch (error) {
            console.log(error)
            return {success:false , message:error}
            
        }

    }
    async RejectTask(){
        try {
            //1.Validation
            const IsValid = this.IsValidToHandleTask();
            if(!IsValid){
                return {success:false , message:"Unauthorized"}
            }

            //Update Task Table
            await this.Database.AllModels.update({IsActive:0} , {where:{TaskID : this.TaskDetails.TaskID}});

            return {success:true , message:"Task rejected successfully..!"}
        } catch (error) {
            console.log(error)
            return {success:false , message:error}
        }
        
    }

    async IsValidToHandleTask(UserID , TaskType){
        try {
            const ObjAccessControl = new this.AccessControl()
            const HasAccess = ObjAccessControl.VerifyAccessControl(UserID , "ADD" , "User");

            if(!HasAccess){
                return false;
            }

            return true
        } catch (error) {
            console.log(error)
            return {success:false , message:error}
        }
    }
    async UpdateDatabase(TargetID){
        try {
            //0.Transaction
            var Transaction = await this.Database.InventoryDB.transaction()
            //1. Update userTable
            const IsAvailable  = await this.Database.AllModels.users.findOne({where:{[this.SequelizeOP.and]:[{userId:TargetID} , {organizationId:1}]}});

            if(!IsAvailable){
                return {success:false , message:"User not available / Already in a org"};
            }
            await this.Database.AllModels.users.update({organizationId:this.OrganizationDetails.OrganizationID} , {where:{userId:TargetID} , transaction:Transaction})

            //2.Add to role table
            await this.Database.AllModels.roles.create({
                userId:TargetID,
                roleId:3,
                role:'Staff',
                organizationId:this.OrganizationDetails.OrganizationID
            } , {transaction:Transaction})

            //3.update Task Table
            await this.Database.AllModels.Tasks.update({IsActive:0} , {where:{TaskId:this.TaskDetails.TaskID} , transaction:Transaction})

            await Transaction.commit();

            return {success:true}
        } catch (error) {
            console.log(error)
            await Transaction.rollback()
            return {success:false , message:error}
        }
    }
}

