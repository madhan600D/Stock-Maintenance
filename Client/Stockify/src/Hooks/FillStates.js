import useOrg from "../Stores/OrgStore.js";
import UseProduct from "../Stores/ProductStore.js";
import useUser from "../Stores/UserStore.js";

export const useFillInventoryStates = () => {
  const { GetProducts, GetCategory, GetVendors, GetCurrency , GetCurrentDayCheckout, FillOrderStates ,CurrentOrders , GetPerformance,InitInventorySocketEvents , GetCheckoutsClient , GetEWMAAnalytics , } = UseProduct();
  const {FillOrgData} = useOrg();
  const {GetTasks} = useUser();

  const FillInventoryStates = async () => {
    try {
      await Promise.all([
        GetProducts(),
        GetCategory(),
        GetVendors(),
        GetCurrency(),
        FillOrgData(),
        GetCurrentDayCheckout(),
        FillOrderStates(),
        GetCheckoutsClient(),
        GetTasks(),
        GetPerformance(),
        GetEWMAAnalytics(),
        //Initialize events
        InitInventorySocketEvents(),
      ]);
      console.log("These are current orders:" , CurrentOrders)
    } catch (error) {
      console.log("Failed to load", error.message);
    }
  };

  return { FillInventoryStates };
};
