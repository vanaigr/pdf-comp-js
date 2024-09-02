// https://pdf-lib.js.org/docs/api/
import { PDFDocument } from 'pdf-lib'

(async() => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    page.drawText('pdf-lib document')
    const pdfBytes = await pdfDoc.save()
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
    const fileUrl = URL.createObjectURL(pdfBlob) + '#zoom=page-fit'
    const iframe = document.createElement('iframe')
    iframe.src = fileUrl
    document.body.appendChild(iframe)
})()

console.log('Hello!')

// pdf-lib doesn't support tables: https://github.com/Hopding/pdf-lib/issues/591
