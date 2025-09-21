import { Sequelize } from "sequelize";
export const DataBaseInit = async () => {
    const userDB = new Sequelize('USER', 'UserServer', 'Password@12345', {
            host: 'localhost',
            dialect: 'mssql',
            dialectOptions: {
              options: { 
                encrypt: false,
                trustServerCertificate: true
        }}});
    const InventoryDB = new Sequelize('USER', 'UserServer', 'Password@12345', {
        host: 'localhost',
        dialect: 'mssql',
        dialectOptions: {
            options: { 
            encrypt: false,
            trustServerCertificate: true
        }}});
    return {userDB:userDB , InventoryDB:InventoryDB};
}

