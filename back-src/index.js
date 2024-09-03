import express from 'express'
import PDFDocument from 'pdfkit'
import { jsPDF } from 'jspdf'

const app = express()

// https://pdfkit.org/docs/getting_started.html
app.get('/pdfkit-doc.pdf', (q, s) => {
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

// https://artskydj.github.io/jsPDF/docs/jsPDF.html
app.get('/jspdf-doc.pdf', (q, s) => {
    const w = 850, h = 1100

    const start = performance.now()

    s.setHeader('Content-Type', 'application/pdf')
    const doc = new jsPDF({ unit: 'px', format: [w, h], putOnlyUsedFonts: true })
    doc.text('document', w * 0.5, 10, { align: 'center', baseline: 'top' })

    const docB = Buffer.from(doc.output('arraybuffer'))
    s.send(docB)
    const end = performance.now()
    console.log('jspdf took', end - start)
})

app.listen(2999, () => {
    console.log('listening...')
})
