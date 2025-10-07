import UseProduct from "../Stores/ProductStore.js";

export const useFillInventoryStates = () => {
  const { GetProducts, GetCategory, GetVendors, GetCurrency } = UseProduct();

  const FillInventoryStates = async () => {
    try {
      await Promise.all([
        GetProducts(),
        GetCategory(),
        GetVendors(),
        GetCurrency()
      ]);
    } catch (error) {
      console.log("Failed to load", error.message);
    }
  };

  return { FillInventoryStates };
};
