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