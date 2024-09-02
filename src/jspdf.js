// https://artskydj.github.io/jsPDF/docs/jsPDF.html
import jspdf from 'jspdf'

const w = 850, h = 1100

const s = performance.now()
const doc = new jspdf({ unit: 'px', format: [w, h], putOnlyUsedFonts: true })
doc.text('jsPDF document', w * 0.5, 10, { align: 'center', baseline: 'top' })
const docBlob = doc.output('blob')
const e = performance.now()

const iframe = document.createElement('iframe')
iframe.src = URL.createObjectURL(docBlob)
document.body.appendChild(iframe)

console.log('Done in', e - s)
