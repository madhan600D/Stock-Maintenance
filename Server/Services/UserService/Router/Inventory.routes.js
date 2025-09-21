import express from 'express'

//MiddleWares
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import { AddProductValidate , AlterProductValidate } from '../MiddleWares/EndPointValidations/InventoryEndPointValidations/Product.Validate.js';

//Controllers
import { GetProductsForOrganization, AddProductForOrganization , GetCategoryForOrganization, AlterProductForOrganization} from '../Controller/InventoryControllers/Inventory.controller.js';

const InventoryRouter = express.Router();

//Products Routers
InventoryRouter.get('./get_products' , cookieValidation , GetProductsForOrganization);
InventoryRouter.put('./add_product' , cookieValidation , AddProductValidate , AddProductForOrganization);
InventoryRouter.get('./get_categories' , cookieValidation , GetCategoryForOrganization);
InventoryRouter.patch('./alter_product' , cookieValidation , AlterProductValidate ,AlterProductForOrganization);
InventoryRouter.delete('./delete_products' ,cookieValidation)

export default InventoryRouter

