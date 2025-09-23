import express from 'express'

//MiddleWares
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import { AddProductValidate , AlterProductValidate , DeleteProductValidate } from '../MiddleWares/EndPointValidations/InventoryEndPointValidations/Product.Validate.js';

//Controllers
import { GetProductsForOrganization, AddProductForOrganization , GetCategoryForOrganization, AlterProductForOrganization, DeleteProducts} from '../Controller/InventoryControllers/Inventory.controller.js';

import { AlterWorker, GetUsers , GetVendors } from '../Controller/InventoryControllers/UserManagement.controller.js';

const InventoryRouter = express.Router();

//MiddleWare setup
InventoryRouter.use(cookieValidation);

//Products Routers
InventoryRouter.get('./get_products' ,  GetProductsForOrganization);
InventoryRouter.put('./add_product' ,  AddProductValidate , AddProductForOrganization);
InventoryRouter.get('./get_categories' , GetCategoryForOrganization);
InventoryRouter.patch('./alter_product' ,  AlterProductValidate ,AlterProductForOrganization);
InventoryRouter.delete('./delete_products' ,cookieValidation ,DeleteProductValidate , DeleteProducts)


//User Routers
InventoryRouter.get('./get_workforce' ,  GetUsers);
InventoryRouter.get('./get_vendors' ,  GetVendors);
InventoryRouter.patch('./alter_worker' , AlterWorker);
export default InventoryRouter

