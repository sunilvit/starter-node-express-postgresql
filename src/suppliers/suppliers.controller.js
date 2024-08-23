const suppliersService = require("./suppliers.service");

const VALID_PROPERTIES = [
    "supplier_name",
    "supplier_address_line_1",
    "supplier_address_line_2",
    "supplier_city",
    "supplier_state",
    "supplier_zip",
    "supplier_phone",
    "supplier_email",
    "supplier_notes",
    "supplier_type_of_goods",
]

function hasOnlyValidProperties(req, res, next) {
    const {data = {}} = req.body;

    const invalidFields = Object.keys(data).filter(
        (field) => !VALID_PROPERTIES.includes(field)
    );

    if (invalidFields.length) {
        return next({
            status: 400,
            message: `Invalid Fields: ${invalidFields.join(", ")}`
        })
    }
    next();
}

function hasProperties(...properties) {
    return function (req, res, next) {
        const {data = {}} = req.body;

        try {
            properties.forEach((property) => {
                if (!data[property]) {
                    const error = new Error(`A ${property} is required!!`)
                    error.status = 400;
                    throw error;
                }
            });
            next();
        } catch (error) {
            next(error);
        }
    };
}

async function supplierExists(req, res, next) {
    const {supplierId} = req.params;

    const supplier = await suppliersService.read(supplierId)
    if (supplier) {
        res.locals.supplier = supplier;
        return next();
    }
    next({
        status: 404,
        message: `Supplier Id: ${supplierId} not Found!!`
    })
}

async function create(req, res, next) {
    const data = await suppliersService.create(req.body.data)
    res.status(201).json({data})
}

async function update(req, res, next) {
    const updatedSupplier = {
        ...req.body.data,
        supplier_id: res.locals.supplier.supplier_id
    };

    const data = await suppliersService.update(updatedSupplier);
    res.json({data})
}

function read(req, res, next) {
    const {supplierId} = req.params
    suppliersService
        .read(supplierId)
        .then((data) => res.json({data}))
        .catch(next);
}

async function destroy(req, res, next) {
    const {supplierId} = req.params
    await suppliersService.destroy(supplierId);

    res.sendStatus(204);
}

module.exports = {
    read: [supplierExists, read],
    create: [
        hasOnlyValidProperties,
        hasProperties("supplier_name", "supplier_email"),
        create
    ],
    update: [
        supplierExists,
        hasOnlyValidProperties,
        hasProperties("supplier_name", "supplier_email"),
        update
    ],
    destroy: [
        supplierExists, destroy
    ]
}
