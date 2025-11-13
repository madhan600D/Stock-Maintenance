import express from 'express'

//MiddleWares
import { cookieValidation } from '../MiddleWares/cookieValidation.js';
import { AddCategoryValidation, AddProductValidate , AlterProductValidate , DeleteProductValidate } from '../MiddleWares/EndPointValidations/InventoryEndPointValidations/Product.Validate.js';
import { AddVendorValidate } from '../MiddleWares/EndPointValidations/InventoryEndPointValidations/Vendor.Validate.js';
import { AddCheckOutValidate } from '../MiddleWares/EndPointValidations/InventoryEndPointValidations/CheckOut.validate.js';

//Controllers
import { GetProductsForOrganization, AddProductForOrganization , GetCategoryForOrganization, AlterProductForOrganization, DeleteProducts, AddCategoryForOrganization, GetCurrency, GetAnalytics} from '../Controller/InventoryControllers/Inventory.controller.js';
import { AlterWorker, GetUsers , GetVendors } from '../Controller/InventoryControllers/UserManagement.controller.js';
import { AddVendor } from '../Controller/InventoryControllers/Vendor.controller.js';
import { AddCheckOut , GetCurrentDayCheckout} from '../Controller/InventoryControllers/Checkout.controller.js';
import { ConfirmOrder, GetOrders, PlaceManualOrder } from '../Controller/InventoryControllers/Order.controller.js';
import { ConfirmOrderValidate } from '../MiddleWares/EndPointValidations/InventoryEndPointValidations/Orders.validate.js';

const InventoryRouter = express.Router();

//MiddleWare setup
InventoryRouter.use(cookieValidation);

//Products Routers
InventoryRouter.get('/get_products' ,  GetProductsForOrganization);
InventoryRouter.put('/add_product' ,  AddProductValidate , AddProductForOrganization);
InventoryRouter.patch('/alter_product' ,  AlterProductValidate ,AlterProductForOrganization);
InventoryRouter.delete('/delete_products'  ,DeleteProductValidate , DeleteProducts)

//Category Routers
InventoryRouter.put('/add_category' , AddCategoryValidation , AddCategoryForOrganization);
InventoryRouter.get('/get_categories' , GetCategoryForOrganization);

//Vendor Routers
InventoryRouter.get('/get_vendor' , GetVendors);
InventoryRouter.put('/add_vendor' , AddVendorValidate , AddVendor);

//Currency Routers
InventoryRouter.get('/get_currency' , GetCurrency);

//CheckOut Routers
InventoryRouter.put('/add_checkout' , AddCheckOutValidate , AddCheckOut);
InventoryRouter.get('/get_today_checkout' , GetCurrentDayCheckout);

//User Routers
InventoryRouter.get('/get_workforce' ,  GetUsers);
InventoryRouter.get('/get_vendors' ,  GetVendors);
InventoryRouter.patch('/alter_worker' , AlterWorker);

//Order Routers
InventoryRouter.put('/add_order' , PlaceManualOrder)
InventoryRouter.put('/confirm_order' , ConfirmOrderValidate , ConfirmOrder);
InventoryRouter.get('/get_orders' , GetOrders);

//Analytics Routers
InventoryRouter.get('/get_analytics' , GetAnalytics);
export default InventoryRouter

