import express from 'express'

//MiddleWares
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import { AddCategoryValidation, AddProductValidate , AlterProductValidate , DeleteProductValidate } from '../MiddleWares/EndPointValidations/InventoryEndPointValidations/Product.Validate.js';
import { AddVendorValidate } from '../MiddleWares/EndPointValidations/InventoryEndPointValidations/Vendor.Validate.js';

//Controllers
import { GetProductsForOrganization, AddProductForOrganization , GetCategoryForOrganization, AlterProductForOrganization, DeleteProducts, AddCategoryForOrganization, GetCurrency} from '../Controller/InventoryControllers/Inventory.controller.js';

import { AlterWorker, GetUsers , GetVendors } from '../Controller/InventoryControllers/UserManagement.controller.js';
import { AddVendor } from '../Controller/InventoryControllers/Vendor.controller.js';

const InventoryRouter = express.Router();

//MiddleWare setup
InventoryRouter.use(cookieValidation);

//Products Routers
InventoryRouter.get('/get_products' ,  GetProductsForOrganization);
InventoryRouter.put('/add_product' ,  AddProductValidate , AddProductForOrganization);
InventoryRouter.patch('/alter_product' ,  AlterProductValidate ,AlterProductForOrganization);
InventoryRouter.delete('/delete_products' ,cookieValidation ,DeleteProductValidate , DeleteProducts)

//Category Routers
InventoryRouter.put('/add_category' , AddCategoryValidation , AddCategoryForOrganization);
InventoryRouter.get('/get_categories' , GetCategoryForOrganization);

//Vendor Routers
InventoryRouter.get('/get_vendor' , GetVendors);
InventoryRouter.put('/add_vendor' , AddVendorValidate , AddVendor);

//Currency Router
InventoryRouter.get('/get_currency' , GetCurrency);

//User Routers
InventoryRouter.get('/get_workforce' ,  GetUsers);
InventoryRouter.get('/get_vendors' ,  GetVendors);
InventoryRouter.patch('/alter_worker' , AlterWorker);
export default InventoryRouter

