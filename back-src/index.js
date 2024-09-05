import express from 'express'
import PdfPrinter from 'pdfmake'

var fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};
var printer = new PdfPrinter(fonts)

const app = express()

// https://pdfkit.org/docs/getting_started.html
app.get('/pdfkit-doc.pdf', (q, s) => {
    s.setHeader('Content-Type', 'application/pdf')

    const w = 850, h = 1100

    const start = performance.now()

    const content = []
    const styles = {
        myTable: {
            font: 'Helvetica',
        },
    }

    // add tables
    for(let i = 0; i < 10; i++) {
        content.push({
            style: 'myTable',
            table: {
                headerRows: 1,
                widths: ['*', '*', '*', '*', '*'],
                body: [
                    ['Name', 'Name2', 'Name3', 'Name4', 'Name5'],

                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3\nTest3\nTest3\nTest3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', ('Test2').repeat(5), 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                    ['Test', 'Test2', 'Test3', 'Test4', 'Test5'],
                ]
            },
        })
    }

    const doc = printer.createPdfKitDocument({ content, styles })
    doc.pipe(s)
    doc.end()
    const end = performance.now()
    console.log(end - start)
})
app.listen(2999, () => {
    console.log('listening...')
})
