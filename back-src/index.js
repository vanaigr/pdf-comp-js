import express from 'express'
import fs from 'node:fs'
import { join } from 'node:path'
import { JSDOM as jsdom } from 'jsdom'

import puppeteer from 'puppeteer'

const browserP = puppeteer.launch({
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--allow-file-access-from-files',
        '--enable-local-file-accesses',
    ]
});
const pageP = browserP.then(browser => browser.newPage())

const srcData = JSON.parse(fs.readFileSync(join(import.meta.dirname, '../src/data.json')))

const colorHighest = [20, 40, 60, 80]
const colors = [ '#f01010', '#efb010', '#b0ef10', '#40ef10', '#10f010' ]

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.`
const sideText = `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`

const doc = new jsdom('<!DOCTYPE html><head></head><body></body>')
const dd = doc.window.document

const styles = dd.createElement('style')
styles.append(dd.createTextNode(`
html {
  -webkit-print-color-adjust: exact;
}

@media print {
  @page {
    size: letter;
    margin: 0.5in;
  }
}

html {
    line-height: 1.15;
    font-family: Helvetica;
}

.text {
    font-size: 16pt;
}

table {
    border-collapse: collapse;
    font-size: 10pt;
}

tbody tr:nth-child(odd) {
    background-color: #f5f5f5;
}

th {
    text-align: left;
    background-color: #2e80ba;
    color: white;
}

th, td {
    border: 0.3pt solid #505050;
    padding: 5pt;
}

.number {
    text-align: right;
}
.index {
    text-align: center;
}

.columns {
    display: flex;
    font-size: 14pt;
    gap: 7pt;
    margin-top: 15pt;
    flex-direction: row;
}

table {
    flex-grow: 1;
}

.side {
    width: 100pt;
}

.logo {
    display: flex;
    justify-content: right;
    font-size: 14pt;
    align-items: baseline;
    gap: 3pt;
    margin-bottom: 3pt;
}

.logo > img {
    max-width: 20pt;
    max-height: 20pt;
}

`));
dd.head.append(styles)

const logo = dd.createElement('span')
logo.classList.add('logo')
const logoImg = dd.createElement('img')
logoImg.src = './logo.png'
logo.append(dd.createTextNode('logo'), logoImg)
dd.body.append(logo)

const textEl = dd.createElement('span')
textEl.append(dd.createTextNode(text))
textEl.classList.add('text')
dd.body.append(textEl)

const columns = dd.createElement('div')
columns.classList.add('columns')

const table = dd.createElement('table')
const head = dd.createElement('thead')
const headRow = dd.createElement('tr')
for(let i = 0; i < srcData.head.length; i++) {
    const el = dd.createElement('th')
    el.append(dd.createTextNode(srcData.head[i]))
    if(i === 0) el.classList.add('index')
    headRow.append(el)
}
head.append(headRow)
table.append(head)

const tableBody = dd.createElement('tbody')
for(let i = 0; i < srcData.body.length; i++) {
    const row = dd.createElement('tr')
    const sr = srcData.body[i]
    for(let j = 0; j < sr.length; j++) {
        const d = dd.createElement('td')
        d.append(dd.createTextNode(sr[j]))
        if(j === 0) d.classList.add('index')
        if(j === 3) {
            d.classList.add('number')
            let k = 0
            while(k < colorHighest.length && sr[3] > colorHighest[k]) k++
            d.style.color = colors[k]
        }
        row.append(d)
    }
    tableBody.append(row)
}
table.append(tableBody)
columns.append(table)

const side = dd.createElement('span')
side.classList.add('side')
side.append(dd.createTextNode(sideText))
columns.append(side)

dd.body.append(columns)

const pageString = doc.serialize()
console.log(pageString)

const tmpDir = join(import.meta.dirname, '../tmp')
const filePath = join(tmpDir, 'index.html')

fs.mkdirSync(tmpDir, { recursive: true })
fs.writeFileSync(filePath, pageString)
fs.copyFileSync(join(import.meta.dirname, '../src/logo.png'), join(tmpDir, 'logo.png'))

const page = await pageP

const start = performance.now()
await page.goto(new URL(filePath, 'file://'))
const pdfB = await page.pdf({ format: 'letter' })
const end = performance.now()
const pdfBuffer = Buffer.from(pdfB)
console.log('Done in', end - start)

const app = express()

app.get('/puppeteer-doc.pdf', (q, s) => {
    s.setHeader('Content-Type', 'application/pdf')
    s.send(pdfBuffer)
})

app.get('/puppeteer-doc.html', (q, s) => {
    s.send(pageString)
})

app.listen(2999, () => {
    console.log('listening...')
})
