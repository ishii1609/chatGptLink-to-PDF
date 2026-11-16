// Backend se baat karne ka sara code ek jagah
export async function convertToPdf(url) {
  const res = await fetch('/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  // Error aaye to backend ka message nikalo ({ error: "..." })
  if (!res.ok) {
    let message = 'something went wrong.';
    try {
      const data = await res.json();
      if (data.error) message = data.error;
    } catch {
      // JSON nahi tha, default message hi rehne do
    }
    throw new Error(message);
  }

  return res.blob(); // PDF file ka data
}

// Browser ko file download karne ko bolo
export function downloadBlob(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(objectUrl); // memory free karo
}