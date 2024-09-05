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


    // https://artskydj.github.io/jsPDF/docs/module-split_text_to_size.html#~splitTextToSize
    // Undocumented options. lineHeightFactor doesn't work

    doc.setDrawColor(255, 0, 0)

    const margin = inchToPx * 0.5;
    const rectWidth = w - 2*margin
    const maxWidth = (rectWidth) / 3
    const text = ('Document').repeat(33)



    doc.text('vertical align: top', margin + maxWidth * 0.5, 10, { align: 'center' })
    doc.text('vertical align: baseline', margin + maxWidth + maxWidth * 0.5, 10, { align: 'center' })
    doc.text('vertical align: bottom', margin + maxWidth * 2 + maxWidth * 0.5, 10, { align: 'center' })

    var hght;
    {
        const dim = doc.getTextDimensions(text, { maxWidth: maxWidth })
        hght = 20 + dim.h

        doc.rect(w * 0.5 - rectWidth * 0.5, 20, rectWidth, dim.h)

        doc.text(
            text,
            margin + maxWidth * 0.5, 20,
            {
                align: 'center',
                baseline: 'top',
                maxWidth: maxWidth,
            }
        )

        doc.text(
            text,
            margin + maxWidth + maxWidth * 0.5, 20,
            {
                align: 'center',
                baseline: 'baseline',
                maxWidth: maxWidth,
            }
        )

        doc.text(
            text,
            margin + maxWidth * 2 + maxWidth * 0.5, 20,
            {
                align: 'center',
                baseline: 'bottom',
                maxWidth: maxWidth,
            }
        )
    }

    {
        hght += 20
        doc.setLineHeightFactor(3)

        const dim = doc.getTextDimensions(text, { maxWidth: maxWidth })
        const y = hght
        hght += dim.h

        doc.rect(w * 0.5 - rectWidth * 0.5, y, rectWidth, dim.h)

        doc.text(
            text,
            margin + maxWidth * 0.5, y,
            {
                align: 'center',
                baseline: 'top',
                maxWidth: maxWidth,
            }
        )

        doc.text(
            text,
            margin + maxWidth + maxWidth * 0.5, y,
            {
                align: 'center',
                baseline: 'baseline',
                maxWidth: maxWidth,
            }
        )

        doc.text(
            text,
            margin + maxWidth * 2 + maxWidth * 0.5, y,
            {
                align: 'center',
                baseline: 'bottom',
                maxWidth: maxWidth,
            }
        )
    }


    doc.setFontSize(32)

    autoTable(doc, {
        startY: hght + 10,
        head: [['Name', 'Name2']],
        body: [
            ['Test', 'Test2'],
            ['Test3', 'Test4'],
        ],
        margin: { left: 5 * inchToPx, right: inchToPx },
    })

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
