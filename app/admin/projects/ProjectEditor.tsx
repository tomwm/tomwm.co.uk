'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id?: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
  sort_order: number;
}

export default function ProjectEditor({
  initialProject,
  projectId,
}: {
  initialProject?: Partial<Project>;
  projectId?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialProject?.title || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [url, setUrl] = useState(initialProject?.url || '');
  const [imageUrl, setImageUrl] = useState(initialProject?.image_url || '');
  const [sortOrder, setSortOrder] = useState(initialProject?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
      else setError('Image upload failed');
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    setError('');
    try {
      const body = { title, description, url, image_url: imageUrl, sort_order: sortOrder };
      const res = projectId
        ? await fetch(`/api/projects/${projectId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Save failed'); return; }
      router.push('/admin/projects');
      router.refresh();
    } catch {
      setError('Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!projectId || !confirm('Delete this project?')) return;
    await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
    router.push('/admin/projects');
    router.refresh();
  }

  return (
    <div className="admin-editor">
      {error && <div className="editor-error">{error}</div>}

      <div className="form-field">
        <label className="form-label" htmlFor="title">Title</label>
        <input id="title" type="text" className="form-input form-input-title" placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea id="description" className="form-input" rows={4} placeholder="A short description of the project…" value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: 'vertical' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '1rem' }}>
        <div className="form-field">
          <label className="form-label" htmlFor="url">URL</label>
          <input id="url" type="url" className="form-input" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="sort_order">Order</label>
          <input id="sort_order" type="number" className="form-input" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Key image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem' }} />
        {uploading && <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Uploading…</p>}
        {imageUrl && (
          <div style={{ marginTop: '0.5rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />
            <button onClick={() => setImageUrl('')} style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Remove image</button>
          </div>
        )}
      </div>

      <div className="editor-actions">
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="btn btn-secondary" onClick={() => router.push('/admin/projects')}>Cancel</button>
        </div>
        {projectId && (
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        )}
      </div>
    </div>
  );
}
