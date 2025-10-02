export const StateToTable =  (Query , ParamObject) =>{
    try {
        //Assign columns
        const keys = Object.keys(Query[0][0]) 

        const ColumnsFromQuery = keys.map(k => ({ColumnName:k , IsEditable:false}))
        ParamObject.Columns = ColumnsFromQuery

        //Assign Rows
        const RowFromQuery = Query[0].map(Row => Object.values(Row))
        ParamObject.Rows = RowFromQuery
        return ParamObject
    } catch (error) {
        console.log(error)
        return false
    }
}