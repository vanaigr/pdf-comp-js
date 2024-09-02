
function addIframe(path) {
    const div = document.createElement('div')
    const iframe = document.createElement('iframe')
    iframe.src = __server_url + path
    div.appendChild(document.createTextNode(path))
    div.appendChild(iframe)
    document.body.appendChild(div)
}

addIframe('/pdfkit-doc.pdf')
addIframe('/jspdf-doc.pdf')
