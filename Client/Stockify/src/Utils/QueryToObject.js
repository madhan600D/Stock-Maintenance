import { GraphTypes } from "../Declarations/ClientPublicEnums";

export const StateToTable =  (Query , ParamObject , Attributes = []) =>{
    try {
        //Assign columns
        const keys = Object.keys(Query[0][0]) 
        //({ColumnName:k , IsEditable:false})
        // const ColumnsFromQuery = keys
        //     .filter((Col) => Attributes.length === 0 || Attributes.includes(Col))
        //     .map((Col) => ({
        //         ColumnName: Col,
        //         IsEditable: false,
        //     }));
        const ColumnsFromQuery = Attributes.map((Attr) => {
            const match = keys.find(k => k === Attr);
            return {
                ColumnName: match ? match : "Column",
                IsEditable: false
            };
        });
        ParamObject.Columns = ColumnsFromQuery
        
        //Assign Rows
        const RowFromQuery = Query[0]
            .map((Row) => {
                return (
                    Attributes.length !== 0 ? Attributes.map((Attr) => (Row[Attr])) : Object.values(Row)
                )
            })
            
        ParamObject.Rows = RowFromQuery
        console.log("State:" , ParamObject)
        return ParamObject
    } catch (error) {
        console.log(error)
        return false
    }
}

export const StateToChart =  (Query , Attributes = [] , ChartType) =>{
    try {
        let GraphObject = []
        switch (ChartType){
            case GraphTypes.SINGLELINE_CHART:
                for(let Data of Query[0]){
                    const SingleSeries = {
                        XVal:Data[Attributes[0]],
                        YVal:[Data[Attributes[1]]]
                    }
                    GraphObject.push(SingleSeries);
                }
                return GraphObject;
            case GraphTypes.BAR_CHART:
                //Data={[{ValX:'PS4' , ValY:100} , {ValX:'Xbox1' , ValY:600} , {ValX:'PC' , ValY:800} , {ValX:'Nintendo' , 
                for(let Data of Query[0]){
                    const Temp = {
                        ValX:Data[Attributes[0]],
                        ValY:Data[Attributes[1]],
                    }
                    GraphObject.push(Temp)
                }
                return GraphObject;
            }
    } catch (error) {
        console.log(error)
        return []
    }
}

export const StateToMultiLineChart = (Query , Attributes = [] , MultiParameters = [] , XKey , YKey , AttrKey) => {
    try {
        let  MultiLineMap  = new Map() , MultiLineSeries = []
        //Using Index Technique
        for(let Product of Query[0]){
            const ParamterIndex = MultiParameters.findIndex(item => item === Product[AttrKey]);
            if (MultiLineMap.has(Product[YKey])) {
                const arr = MultiLineMap.get(Product[YKey]);
                arr[ParamterIndex] = Product[XKey];
                MultiLineMap.set(Product[YKey], arr);
            } 
            else {
                const arr = new Array(MultiParameters.length).fill(0);
                arr[ParamterIndex] = Product[XKey];
                MultiLineMap.set(Product[YKey], arr);
            }
        }
        //Convert to output structure
        for(let [Key , Value] of MultiLineMap){
            let temp = {
                XVal:Key,
                YVal:Value
            }
            MultiLineSeries.push(temp)
        }
        return MultiLineSeries;
    } catch (error) {
        console.log(error)
        return []
    }
}