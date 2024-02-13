/**
 * Query Params
 *
 * link/?param=value // search parameters
 * link/?sort=value // sort parameters by value
 * link/?sort=-value // sort parameters by value negatively.
 * link/?sort=-value-value // chain sort
 * link/?fields=value1,value2 // <select()>
 */


const Product = require('../models/Product');


const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ price: { $gt: 30 } }).sort('-price')
    res.status(200).json({ nbHits: products.length, products })
}


const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query
    const queryObj = {}
    if (featured) {
        queryObj.featured = featured === "true" ? true : false
    }
    if (company) {
        queryObj.company = company
    }
    if(name) {
        queryObj.name = {$regex: name, $options: 'i'}
    }

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(>|>=|=|<=|<)\b/g
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)) {
                queryObj[field] = {[operator]: Number(value)}
            }
        });
    }

    let result = Product.find(queryObj)
    // Sort
    if(sort) {
        sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result.sort('-createAt')
    }
    // Field
    if(fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    // Limit
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page -1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({ products, nbHits: products.length })
}


module.exports = {
    getAllProductsStatic,
    getAllProducts
}
