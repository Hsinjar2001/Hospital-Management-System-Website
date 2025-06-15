import DataTable from "react-data-table-component"


const data=[
    {id:1, name:"Ram", age:24},
    {id:2, name:"Sita", age:24},
    {id:3, name:"Hari", age:24},

]
const columns = [
 {   name: "Name",
    selector: (row)=> row.name,
    sortable: true,
}, {
    name: "Age",
    selector: (row)=> row.age,
    sortable: true,
},
];

export default function DataTableExample () {
return <DataTable columns={columns} data={data}  pagination/>
}
