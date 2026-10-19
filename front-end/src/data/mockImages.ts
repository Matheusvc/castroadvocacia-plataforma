/**
 * Imagens de exemplo (SVG inline) usadas apenas nos dados mock de chat —
 * simulam uma foto de documento/comprovante sem depender de upload real
 * nem de assets externos.
 */
function receiptSvg(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640" viewBox="0 0 480 640">
  <rect width="480" height="640" fill="#F4F5F7"/>
  <rect x="40" y="40" width="400" height="560" rx="12" fill="#FFFFFF" stroke="#E6E8EC" stroke-width="2"/>
  <rect x="72" y="88" width="180" height="20" rx="4" fill="#2E3DA3"/>
  <rect x="72" y="128" width="336" height="10" rx="4" fill="#E3E5E8"/>
  <rect x="72" y="152" width="336" height="10" rx="4" fill="#E3E5E8"/>
  <rect x="72" y="176" width="240" height="10" rx="4" fill="#E3E5E8"/>
  <rect x="72" y="228" width="336" height="1" fill="#E6E8EC"/>
  <rect x="72" y="256" width="150" height="12" rx="4" fill="#858B99"/>
  <rect x="72" y="284" width="200" height="16" rx="4" fill="#151619"/>
  <rect x="72" y="332" width="150" height="12" rx="4" fill="#858B99"/>
  <rect x="72" y="360" width="140" height="16" rx="4" fill="#151619"/>
  <circle cx="340" cy="470" r="56" fill="none" stroke="#508B26" stroke-width="4"/>
  <path d="M316 470 l16 16 l32 -36" fill="none" stroke="#508B26" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="240" y="568" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#858B99">${label}</text>
</svg>`;
}

/** Gera uma data URL de uma imagem de exemplo (comprovante/documento). */
export function mockReceiptImage(label = "Comprovante de pagamento"): string {
  return `data:image/svg+xml,${encodeURIComponent(receiptSvg(label))}`;
}
