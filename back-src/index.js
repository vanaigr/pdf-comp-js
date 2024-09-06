import express from 'express'
import PdfPrinter from 'pdfmake'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const srcData = JSON.parse(readFileSync(join(import.meta.dirname, '../src/data.json')))

const bodyStyles = {
    'tNumber': { alignment: 'right' },
    'tIndex': { alignment: 'center' },
    'tHead': { color: 'white' },
}

const colorHighest = [20, 40, 60, 80]
const colors = [ '#f01010', '#efb010', '#b0ef10', '#40ef10', '#10f010' ]

const body = [
    [
        { text: '' + srcData.head[0], style: 'tHead', alignment: 'center' },
        { text: '' + srcData.head[1], style: 'tHead' },
        { text: '' + srcData.head[2], style: 'tHead' },
        { text: '' + srcData.head[3], style: 'tHead' },
        { text: '' + srcData.head[4], style: 'tHead' },
    ]
]
for(let i = 0; i < srcData.body.length; i++) {
    const sr = srcData.body[i]

    let k = 0
    while(k < colorHighest.length && sr[3] > colorHighest[k]) k++
    const color = colors[k]

    const r0 = { text: '' + sr[0], style: 'tIndex' }
    const r3 = { text: '' + sr[3], style: 'tNumber', color }
    body.push([r0, sr[1], sr[2], r3, sr[4]])
}

const table = {
    style: 'myTable',
    table: {
        // totalWidth - 2*margin - sideTextSize - gap. 612 - 72 - 110 - 7 = 423
        // widths do not include padding????
        widths: [30 - 10, 70 - 10, 200 - 10, 60 - 10, 63 - 10],
        body,
    },
    layout: {
        fillColor: (r, node, c) => {
            return r === 0 ? '#2e80ba' : (r - 1) & 1 ? null : '#f5f5f5'
        },
        hLineWidth: () => 0.3,
        hLineColor: () => '#505050',
        vLineWidth: () => 0.3,
        vLineColor: () => '#505050',
        paddingLeft: () => 5,
        paddingRight: () => 5,
        paddingTop: () => 7,
        paddingBottom: () => 3,
    },
}

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

app.get('/pdfmake-doc.pdf', (q, s) => {
    s.setHeader('Content-Type', 'application/pdf')

    const start = performance.now()

    const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.`
    const sideText = `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`

    const content = [
        {
            columns: [
                { text: '', width: '*' },
                {
                    text: 'logo',
                    fontSize: 14,
                    width: 'auto',
                },
                {
                    image: join(import.meta.dirname, '../src/logo.png'),
                    fit: [20, 20],
                    width: 'auto',
                }
            ],
            margin: [0, 0, 0, 3],
        },
        { text, fontSize: 16, width: 612 - 200 },
        {
            columns: [
                table,
                { text: sideText, fontSize: 14, width: 110 },
            ],
            columnGap: 7,
            margin: [0, 15, 0, 0],
        }
    ]
    const styles = { ...bodyStyles }

    const doc = printer.createPdfKitDocument({
        content,
        styles,
        pageSize: 'LETTER',
        pageMargins: 36,
        defaultStyle: { font: 'Helvetica', lineHeight: 1.15 }
    })
    doc.pipe(s)
    doc.end()

    const end = performance.now()
    console.log(end - start)
})
app.listen(2999, () => {
    console.log('listening...')
})
