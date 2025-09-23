import { DataTypes } from "sequelize";
import {DataBaseInit} from "./DataBaseInit.js";
// User-related Models
import userRoleModel from "../Models/UserModels/userRoleModel.js";
import organizationModel from "../Models/UserModels/organizationModel.js";
import sessionModel from "../Models/UserModels/sessionModel.js";
import userModel from "../Models/UserModels/userModel.js";
import adminModel from "../Models/UserModels/adminModel.js";
import otpModel from "../Models/UserModels/otpModel.js";
import taskBucketModel from "../Models/UserModels/taskBucketModel.js";
import userErrorLogModel from "../Models/UserModels/userErrorLogModel.js";
import pendingUserModel from "../Models/UserModels/pendingUser.js";
import configurationSettingsModel from "../Models/UserModels/configurationSettingsModel.js";
import ConsumedEventsModel from "../Models/UserModels/consumedEventsModel.js";
import producedEventsModel from "../Models/UserModels/producedEventsModel.js";
import LoadingTextsModel from "../Models/UserModels/LoadingTexts.js";
import RoleDetailsModel from "../Models/UserModels/RoleDetailsModel.js";

// Inventory-related Models
import CategoryModel from "../Models/InventoryModels/Category.Model.js";
import ProductModel from "../Models/InventoryModels/Product.Model.js";
import VendorModel from "../Models/InventoryModels/Vendor.Model.js";
import CheckOutModel from "../Models/InventoryModels/CheckOut.Model.js";
import CurrencyModel from "../Models/InventoryModels/Currency.Model.js";
import OrdersModel from "../Models/InventoryModels/Orders.Model.js";
import HolidayModel from "../Models/InventoryModels/Holiday.Model.js";
import ScreensModel from "../Models/InventoryModels/Screens.Model.js";
import OrganizationStateModel from "../Models/InventoryModels/OrganizationState.Model.js";


export async function InitializeDataBase(){
  try {
    console.log("Initializing database");
    const { userDB, InventoryDB } = await DataBaseInit();
    const Models = { 
      // User System
      users: userModel(userDB, DataTypes),
      roles: userRoleModel(userDB, DataTypes),
      organizations: organizationModel(userDB, DataTypes),
      sessions: sessionModel(userDB, DataTypes),
      admins: adminModel(userDB, DataTypes), 
      otps: otpModel(userDB, DataTypes),
      taskBuckets: taskBucketModel(userDB, DataTypes),
      userErrorLogs: userErrorLogModel(userDB, DataTypes),
      pendingUsers: pendingUserModel(userDB, DataTypes),
      ConfigurationSettings: configurationSettingsModel(userDB, DataTypes),
      ConsumedEvents: ConsumedEventsModel(userDB, DataTypes),
      ProducedEvents: producedEventsModel(userDB, DataTypes),
      LoadingTexts: LoadingTextsModel(userDB, DataTypes),
      RoleDetails: RoleDetailsModel(userDB, DataTypes),

      // Inventory System
      Category: CategoryModel(InventoryDB, DataTypes),
      Products: ProductModel(InventoryDB, DataTypes),
      Vendors: VendorModel(InventoryDB, DataTypes),
      CheckOuts: CheckOutModel(InventoryDB, DataTypes),
      Currency: CurrencyModel(InventoryDB, DataTypes),
      Orders: OrdersModel(InventoryDB, DataTypes),
      Holidays: HolidayModel(InventoryDB, DataTypes),
      Screens: ScreensModel(InventoryDB, DataTypes),
      OrgState: OrganizationStateModel(InventoryDB , DataTypes)
    }; 

    return {Models , userDB , InventoryDB}

  } catch (error) {
    console.log("Failed init all models")
    return {}
  }
 }



