import useOrg from "../Stores/OrgStore.js";
import UseProduct from "../Stores/ProductStore.js";

export const useFillInventoryStates = () => {
  const { GetProducts, GetCategory, GetVendors, GetCurrency , GetCurrentDayCheckout } = UseProduct();
  const {FillOrgData} = useOrg();

  const FillInventoryStates = async () => {
    try {
      await Promise.all([
        GetProducts(),
        GetCategory(),
        GetVendors(),
        GetCurrency(),
        FillOrgData(),
        GetCurrentDayCheckout()
      ]);
    } catch (error) {
      console.log("Failed to load", error.message);
    }
  };

  return { FillInventoryStates };
};
