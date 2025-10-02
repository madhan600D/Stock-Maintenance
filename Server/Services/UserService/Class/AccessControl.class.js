import objUserDb from "../Utils/userDB.js"
export default class AccessControl{
    constructor(){
        this.UserID
    }
    
    VerifyAccessControl = async (UserID , Action , Control) => {
        try {
        const UserDetails = await objUserDb.AllModels.roles.findOne({
                                    where: { userId: UserID },
                                    include: [
                                        {
                                            model: objUserDb.AllModels.RoleDetails,
                                            attributes: ['RoleName', 'Permissions']
                                        },
                                        {
                                            model: objUserDb.AllModels.users,
                                            attributes: ['userId', 'userName']
                                        }
                                    ]
                                    });

        const Permissions = UserDetails?.RoleDetail.Permissions
        const UserRole = UserDetails?.RoleDetail.RoleName;
        
        
        //Admin control
        if(Permissions.Permissions === "ALL"){
            return true
        }

        // find the Control object
        const ControlObject = Permissions.find(p => p.Control );
        
        
        if(ControlObject && ControlObject.includes(Action)){
            return true
        }
        else{
            false
        }
        

        } catch (error) {
            console.log(error)
        }
    }

}