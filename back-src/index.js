import express from 'express'
import PDFDocument from 'pdfkit'
import { jsPDF } from 'jspdf'
import _autoTable from 'jspdf-autotable'
const autoTable = _autoTable['default']

const app = express()

// https://pdfkit.org/docs/getting_started.html
app.get('/pdfkit-doc.pdf', (q, s) => {
    s.status(404)
    s.send()
    return
    s.setHeader('Content-Type', 'application/pdf')

    const w = 850, h = 1100

    const start = performance.now()
    const doc = new PDFDocument({ size: [w, h] })
    const stream = doc.pipe(s)
    stream.on('finish', () => {
        s.end()
        const end = performance.now()
        console.log('pdfkit took', end - start)
    })

    // for tebles:
    // https://github.com/natancabral/pdfkit-table
    // but the code is bad, so no

    doc.text('document', { align: 'center' })

    doc.end()
})

// last commit - last year

// jspdf conversion factors:
// https://github.com/parallax/jsPDF/blob/ddbfc0f0250ca908f8061a72fa057116b7613e78/jspdf.js#L791

// https://artskydj.github.io/jsPDF/docs/jsPDF.html
app.get('/jspdf-doc.pdf', (q, s) => {
    const inchToPx = 25.4
    const w = 8.5 * inchToPx, h = 11 * inchToPx
    const ptToUnit = inchToPx / 72

    const start = performance.now()

    s.setHeader('Content-Type', 'application/pdf')
    const doc = new jsPDF({ unit: 'mm', format: 'letter', putOnlyUsedFonts: true })
    doc.setFont('times')
    doc.setFontSize(20 * ptToUnit)

    // https://artskydj.github.io/jsPDF/docs/module-split_text_to_size.html#~splitTextToSize
    // Undocumented options. lineHeightFactor doesn't work
    const dim = doc.getTextDimensions(
        ('document').repeat(100),
        {
            align: 'center',
            baseline: 'top',
            maxWidth: w - 4 * inchToPx,
        }
    )

    doc.text(
        ('document').repeat(100),
        w * 0.5, 10,
        {
            align: 'center',
            baseline: 'top',
            maxWidth: w - 4 * inchToPx,
        }
    )

    doc.setFont('times', 'bold')
    const dim2 = doc.getTextDimensions(
        ('document').repeat(100),
        {
            align: 'center',
            baseline: 'top',
            maxWidth: w - 4 * inchToPx,
        }
    )
    doc.text(
        ('document').repeat(100),
        w * 0.5, 10 + dim.h,
        {
            align: 'center',
            baseline: 'top',
            maxWidth: w - 4 * inchToPx,
        }
    )

    console.log(dim.h, dim2.h)

    autoTable(doc, {
        startY: 10 + dim.h + dim2.h,
        head: [['Name', 'Name2']],
        body: [
            ['Test', 'Test2'],
            ['Test3', 'Test4'],
        ],
        styles: { fontSize: 14 * ptToUnit },
        margin: { left: 5 * inchToPx, right: inchToPx },
    })

    const docB = Buffer.from(doc.output('arraybuffer'))
    s.send(docB)
    const end = performance.now()
    console.log('jspdf took', end - start)
})

app.listen(2999, () => {
    console.log('listening...')
})
