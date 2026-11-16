import { useState } from 'react';
import { convertToPdf, downloadBlob } from '../services/api';

export default function ConverterForm() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault(); // page reload hone se roko
    setStatus('loading');
    setError('');

    try {
      const blob = await convertToPdf(url.trim());
      downloadBlob(blob, 'chat.pdf');
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  const isLoading = status === 'loading';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://chatgpt.com/share/..."
        required
        disabled={isLoading}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-black disabled:bg-slate-100"
      />

      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className="w-full rounded-lg border border-emerald-300/40 bg-emerald-400 px-4 py-3 font-semibold text-emerald-950 shadow-lg shadow-emerald-950/20 transition-colors hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/15 disabled:text-white/50 disabled:shadow-none"
      >
        {isLoading ? 'generating...' : 'generate pdf'}
      </button>

      {isLoading && (
        <p className="text-sm text-slate-500">
         it may take few seconds,please don't refresh.
        </p>
      )}
      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      {status === 'success' && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          downloaded!
        </p>
      )}
    </form>
  );
}
