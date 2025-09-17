// User-related Models
import userRoleModel from "../Models/userRoleModel.js";
import organizationModel from "../Models/organizationModel.js";
import sessionModel from "../Models/sessionModel.js";
import userModel from "../Models/userModel.js";
import adminModel from "../Models/adminModel.js";
import otpModel from "../Models/otpModel.js";
import taskBucketModel from "../Models/taskBucketModel.js";
import userErrorLogModel from "../Models/userErrorLogModel.js";
import pendingUserModel from "../Models/pendingUser.js";
import configurationSettingsModel from "../Models/configurationSettingsModel.js";
import ConsumedEventsModel from "../Models/consumedEventsModel.js";
import producedEventsModel from "../Models/producedEventsModel.js";
import LoadingTextsModel from "../Models/LoadingTexts.js";

// Inventory-related Models
import CategoryModel from "../Models/InventoryModels/Category.Model.js";
import ProductModel from "../Models/InventoryModels/Product.Model.js";
import VendorModel from "../Models/InventoryModels/Vendor.Model.js";
import CheckOutModel from "../Models/InventoryModels/CheckOut.Model.js";
import CurrencyModel from "../Models/InventoryModels/Currency.Model.js";
import OrdersModel from "../Models/InventoryModels/Orders.Model.js";

const AllModels = {
  // User System
  Users: userModel,
  UserRoles: userRoleModel,
  Organizations: organizationModel,
  Sessions: sessionModel,
  Admins: adminModel,
  Otps: otpModel,
  TaskBuckets: taskBucketModel,
  UserErrorLogs: userErrorLogModel,
  PendingUsers: pendingUserModel,
  ConfigurationSettings: configurationSettingsModel,
  ConsumedEvents: ConsumedEventsModel,
  ProducedEvents: producedEventsModel,
  LoadingTexts: LoadingTextsModel,

  // Inventory System
  Category: CategoryModel,
  Products: ProductModel,
  Vendors: VendorModel,
  CheckOuts:CheckOutModel,
  Currency:CurrencyModel,
  Orders:OrdersModel
};

export default AllModels;
