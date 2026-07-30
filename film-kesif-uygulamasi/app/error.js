"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 flex flex-col items-center justify-center gap-4">
      <p className="text-red-500 text-lg">Bir şeyler ters gitti.</p>
      <button
        onClick={function () { reset(); }}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Tekrar Dene
      </button>
    </div>
  );
}