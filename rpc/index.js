// from，以此内容创建
const buffer1 = Buffer.from('crane')
const buffer2 = Buffer.from([1, 2, 3, 4])

// 创建指定长度的空 buffer
const buffer3 = Buffer.alloc(10)

// buffer 每一位都是 16 进制
console.log(buffer1) // <Buffer 63 72 61 6e 65>
console.log(buffer2) // <Buffer 01 02 03 04>
console.log(buffer3) // <Buffer 00 00 00 00 00 00 00 00 00 00>

// 第1个参数，要写入的内容，第2个参数，要写入的位置（替换）
buffer2.writeInt8(12, 1)
console.log(buffer2) // <Buffer 01 0c 03 04>

// writeInt16，占 2 个位置，
// BE，高位放在前面
buffer2.writeInt16BE(512, 1)
console.log(buffer2) // <Buffer 01 02 00 04>

// 如果是 LE ，高位放在后面
// buffer2.writeInt16LE(512, 1)
// console.log(buffer2) // <Buffer 01 00 02 04>

// BE和LE，不同的设备或后台，使用的不同的标准，具体情况要和后台协商。


const fs = require('fs')
const protobuf = require('protocol-buffers')

// test.proto 文件有严格的编写规范，比如字段每个后面都会有一个分号。
const schema = protobuf(fs.readFileSync(__dirname + '/test.proto', 'utf-8'))
console.log(schema)

const bufferProto = schema.Column.encode({
  id: 1,
  name: 'crane',
  price: 85.4
})

console.log(bufferProto) // <Buffer 08 01 12 05 63 72 61 6e 65 1d cd cc aa 42>
// 这里会有浮点数的出现，需要在解码后，手动处理。
console.log(schema.Column.decode(bufferProto)) // { id: 1, name: 'crane', price: 85.4000015258789 }


const buf = Buffer.from([0, 5]); // <Buffer 00 05>
// 高位在后
console.log(buf.readInt16LE(0)); // 1280（ 16进制的 500 转为 10进制就是 1280）
// 高位在前
console.log(buf.readInt16BE(0)); // 5