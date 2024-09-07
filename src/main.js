import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import srcData from './data.json'
import logoUrl from './logo.png?url'

const logoImg = new Image()
logoImg.src = logoUrl
const logoLoadedP = new Promise((s, j) => {
    logoImg.addEventListener('load', s)
    logoImg.addEventListener('error', j)
})

async function renderDoc() {
    const doc = new jsPDF({ unit: 'mm', format: 'letter' })

    const colorHighest = [20, 40, 60, 80]
    const colors = ['f01010', 'efb010', 'b0ef10', '40ef10', '10f010']

    const head = [
        { content: '' + srcData.head[0], styles: { textColor: 'fefefe', halign: 'center' } },
        { content: '' + srcData.head[1], styles: { textColor: 'fefefe' } },
        { content: '' + srcData.head[2], styles: { textColor: 'fefefe' } },
        { content: '' + srcData.head[3], styles: { textColor: 'fefefe' } },
        { content: '' + srcData.head[4], styles: { textColor: 'fefefe' } },
    ]

    const body = []

    for(let i = 0; i < srcData.body.length; i++) {
        const sRow = srcData.body[i]

        var k = 0
        while(k < colorHighest.length && sRow[3] > colorHighest[k]) k++
        const color = colors[k]


        const row = [
            { content: '' + sRow[0], styles: { halign: 'center' } },
            sRow[1],
            sRow[2],
            { content: '' + sRow[3], styles: { halign: 'right', textColor: color } },
            sRow[4],
        ]
        body.push(row)
    }

    const logoH = 6
    const margin = 25.4 * 0.5 // half inch in mm
    const marginTop = margin + logoH + 1
    const ptToMm = 25.4 / 72 // postscript point = 1/72 inch

    const ps = doc.internal.pageSize
    const width = ps.getWidth()
    const height = ps.getHeight()
    console.log(width)

    const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.`
    doc.setLineHeightFactor(1.15)
    doc.setFontSize(16)
    const lines = doc.splitTextToSize(text, width - 2*margin)
    var fs = doc.getFontSize() * ptToMm, lhf = doc.getLineHeightFactor()
    const linesHeight = lines.length == 0 ? 0 : fs + (lines.length-1)*fs*lhf
    console.log(linesHeight)

    // Note: + fs is for vertically aligning to top. 'baseline' is broken
    doc.text(lines, margin, marginTop + fs)

    const afterY = marginTop + linesHeight + 5
    const sideWidth = 40

    autoTable(doc, {
        startY: afterY,
        head: [head],
        body: body,
        margin: { top: 0, left: margin, right: margin + sideWidth + 2 },
        styles: {
            lineColor: 80,
            lineWidth: 0.1,
            cellPadding: 1.9,
            textColor: '101010',
            fontSize: 10,
        }
    })

    doc.setFontSize(14)
    fs = 14 * ptToMm

    doc.text(`Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`, width - (margin + sideWidth), afterY + fs, { maxWidth: sideWidth })

    await logoLoadedP

    const logoW = logoH * logoImg.width / logoImg.height

    doc.text('logo', width - margin - logoW - 1, margin + logoH, { align: 'right' })
    doc.addImage(
        logoImg, 'PNG',
        width - margin - logoW,
        margin,
        logoW, logoH
    )

    const docB = doc.output('blob')

    const div = document.createElement('div')
    const iframe = document.createElement('iframe')
    iframe.src = URL.createObjectURL(docB)
    div.appendChild(document.createTextNode('jspdf'))
    div.appendChild(iframe)
    document.body.appendChild(div)
}

renderDoc()

{
    const div = document.createElement('div')
    const iframe = document.createElement('iframe')
    iframe.src = new URL('puppeteer-doc.pdf', __server_url)
    div.appendChild(document.createTextNode('puppeteer'))
    div.appendChild(iframe)
    document.body.appendChild(div)
}
