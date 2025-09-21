
export default (Sequelize , DataTypes) => {
    const ScreenModel = Sequelize.define('Screens' , {
    ScreenID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    URL:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    Screen:{
        type:DataTypes.STRING,
        allowNull:false
    },
}, 
    {
        tablename:'Screens'
    }
) 
return ScreenModel;

}
 

