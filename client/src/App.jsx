import ConverterForm from './components/ConverterForm';
import Velaris from './components/ui/velaris';

export default function App() {
  return (
    <Velaris
      height="100svh"
      bg="#050b08"
      colors={['#064e3b', '#10b981', '#059669', '#020617']}
      speed={1.2}
      grain={0.2}
    >
      <main className="flex min-h-full flex-col items-center justify-center gap-6 px-4 py-10">
        <div className="text-center">
          <h1 className="text-3xl tracking-tight text-white sm:whitespace-nowrap sm:text-4xl">
            <span className="block font-[cursive] font-medium transition-colors duration-300 hover:text-emerald-200 sm:inline">
              ChatGPT link
            </span>{' '}
            <span className="block sm:inline">
              <span className="font-[cursive] font-medium transition-colors duration-300 hover:text-emerald-200">to </span>
              <span className="inline-block font-sans text-4xl font-black tracking-widest text-emerald-300 transition-colors duration-300 hover:text-white sm:text-5xl">
                PDF
              </span>
            </span>
          </h1>
          <p className="mt-2 text-white/75">Paste your public share link here.</p>
        </div>
        <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-slate-950/45 p-5 shadow-2xl backdrop-blur-md sm:p-7">
          <ConverterForm />
        </div>
      </main>
    </Velaris>
  );
}
