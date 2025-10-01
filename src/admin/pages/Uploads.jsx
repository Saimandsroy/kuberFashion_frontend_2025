import React, { useState } from 'react';
import api from '../../services/api';

const CATEGORIES = ['men', 'women', 'kids'];

export default function AdminUploads() {
  const [category, setCategory] = useState('men');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onUpload = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('categorySlug', category);
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      form.append('filename', `${unique}.jpg`);

      const res = await api.post('/admin/storage/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUrl(res.data?.data?.publicUrl || '');
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Category-based Upload</h1>
      <form onSubmit={onUpload} className="space-y-4">
        <div className="flex items-center gap-4">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-600 mt-3">{error}</p>}
      {url && <p className="mt-4">Uploaded: <a href={url} className="text-blue-600 underline" target="_blank" rel="noreferrer">{url}</a></p>}
    </div>
  );
}
