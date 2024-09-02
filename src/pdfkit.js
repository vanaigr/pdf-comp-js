// https://pdfkit.org/docs/getting_started.html

const iframe = document.createElement('iframe')
iframe.src = __server_url + '/pdfkit-doc.pdf'
document.body.appendChild(iframe)
