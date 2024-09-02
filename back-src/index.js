import express from 'express'
import PDFDocument from 'pdfkit'

const app = express()
app.get('/pdfkit-doc.pdf', (q, s) => {
    console.log('File was requested')
    s.setHeader('Content-Type', 'application/pdf')

    const w = 850, h = 1100

    const doc = new PDFDocument({ size: [w, h] })
    const stream = doc.pipe(s)
    stream.on('end', () => { s.end() })

    doc.text('pdfkit document', { align: 'center' })

    doc.end()
})

app.listen(2999, () => {
    console.log('listening...')
})
