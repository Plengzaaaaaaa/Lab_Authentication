const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({//Schema คือโครงสร้างข.ตารางของเราว่ามีฟิวอะไรบ้าง ชนิดข้อมูล
    product_name: { type: String, required: true },
    product_type: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
}, { timestamps: true, versionKey: false });//ถ้าเปลี่ยนfalseเป็นtrue มันเก็บข้อมูล

module.exports = mongoose.model('Product', productSchema);
