import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// last commit - last year

// jspdf conversion factors:
// https://github.com/parallax/jsPDF/blob/ddbfc0f0250ca908f8061a72fa057116b7613e78/jspdf.js#L791

// baseline: 'top' is broken
function addPdf() {
    const inchToPx = 25.4
    const w = 8.5 * inchToPx, h = 11 * inchToPx
    const ptToUnit = inchToPx / 72

    const start = performance.now()

    const doc = new jsPDF({ unit: 'mm', format: 'letter', putOnlyUsedFonts: true })
    doc.setFont('times')
    doc.setFontSize(8)
    doc.setLineHeightFactor(1)

    var finalY = 10
    for(let i = 0; i < 10; i++) {
        if(i != 0) doc.addPage()
        autoTable(doc, {
            startY: finalY,
            head: [['Name', 'Name2', 'Name3', 'Name4', 'Name5']],
            body: [
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
            margin: { left: inchToPx, right: inchToPx },
            styles: { valign: 'middle', halign: 'center', fontSize: 20 },
        })
    }

    const docB = doc.output('blob')
    const end = performance.now()
    console.log('jspdf took', end - start)

    const div = document.createElement('div')
    const iframe = document.createElement('iframe')
    iframe.src = URL.createObjectURL(docB)
    div.appendChild(document.createTextNode('jspdf'))
    div.appendChild(iframe)
    document.body.appendChild(div)
}

addPdf()
