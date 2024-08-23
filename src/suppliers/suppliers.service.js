const knex = require("../db/connection");

function create(supplier){
    return knex("suppliers")
        .insert(supplier)
        .returning("*")
        .then((createdRecord) =>
            createdRecord[0]
        )
}

function read(supplierId){
    return knex("suppliers")
        .select("*")
        .where({supplier_id: supplierId})
        .first();
}

function update(updatedSupplier){
    return knex("suppliers")
        .select("*")
        .where({supplier_id: updatedSupplier.supplier_id})
        .update(updatedSupplier, "*")
}

function destroy(supplierId){
    return knex("suppliers")
        .where({supplier_id: supplierId})
        .del();
}
module.exports = {
    create,
    read,
    update,
    destroy
}