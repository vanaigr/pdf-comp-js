import express from 'express'
import PDFDocument from 'pdfkit-table'

const app = express()

// https://pdfkit.org/docs/getting_started.html
app.get('/pdfkit-doc.pdf', (q, s) => {
    s.setHeader('Content-Type', 'application/pdf')

    const w = 850, h = 1100

    const start = performance.now()
    const doc = new PDFDocument({ size: [w, h] })
    // doesn't affect perf it seems
    // const stream = doc.pipe(s)
    // stream.on('finish', () => { s.end() })
    doc.text('document', { align: 'center' })

    ;(async() => {
        for(let i = 0; i < 10; i++) {
            if(i != 0) doc.addPage()
            // note: no alignment
            await doc.table({
                headers: ['Name', 'Name2', 'Name3', 'Name4', 'Name5'],
                rows: [
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
                ],
            })
        }
        const end = performance.now()
        console.log('pdfkit took', end - start)
        doc.end()
    })()
})
app.listen(2999, () => {
    console.log('listening...')
})
