'use client';

import { useState, useCallback, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface Post {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  tags: string;
  status: string;
}

interface PostEditorProps {
  initialPost?: Partial<Post>;
  postId?: string;
  existingTags?: string[];
}

function TagInput({ value, onChange, existingTags }: {
  value: string;
  onChange: (v: string) => void;
  existingTags: string[];
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = value ? value.split(',').map((t) => t.trim()).filter(Boolean) : [];

  function add(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || selected.includes(trimmed)) return;
    onChange([...selected, trimmed].join(', '));
    setInput('');
  }

  function remove(tag: string) {
    onChange(selected.filter((t) => t !== tag).join(', '));
  }

  function toggle(tag: string) {
    if (selected.includes(tag)) remove(tag);
    else add(tag);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      add(input.replace(/,/g, ''));
    } else if (e.key === 'Backspace' && !input && selected.length > 0) {
      remove(selected[selected.length - 1]);
    }
  }

  const suggestions = existingTags.filter(
    (t) => !selected.includes(t) && t.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="tag-input-wrapper">
      <div className="tag-input-field" onClick={() => inputRef.current?.focus()}>
        {selected.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(tag); }} className="tag-chip-remove">&times;</button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={selected.length === 0 ? 'Add tags…' : ''}
          className="tag-input-text"
        />
      </div>
      {existingTags.length > 0 && (
        <div className="tag-suggestions">
          {(input ? suggestions : existingTags.filter((t) => !selected.includes(t))).map((tag) => (
            <button key={tag} type="button" onClick={() => toggle(tag)} className="tag-suggestion-btn">
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function PostEditor({ initialPost, postId, existingTags = [] }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title || '');
  const [subtitle, setSubtitle] = useState(initialPost?.subtitle || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [tags, setTags] = useState(initialPost?.tags || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialPost?.slug);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  async function save(status: string) {
    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }
    if (!slug.trim()) {
      alert('Please enter a slug.');
      return;
    }

    setSaving(true);
    try {
      const body = { title, subtitle, slug, content, tags, status };
      const url = postId ? `/api/posts/${postId}` : '/api/posts';
      const method = postId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Save failed');
      }

      const saved = await res.json();
      if (!postId && saved.id) {
        router.push(`/admin/posts/${saved.id}`);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!postId) return;
    if (!confirm('Delete this post? This cannot be undone.')) return;
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/admin');
    } else {
      alert('Failed to delete post.');
    }
  }

  function exportMarkdown() {
    // Dynamic import to avoid SSR issues
    import('turndown').then(({ default: TurndownService }) => {
      const td = new TurndownService();
      const markdown = td.turndown(content);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug || 'post'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div>
      <div className="admin-form">
        <div className="form-field">
          <input
            type="text"
            className="form-input form-input-title"
            placeholder="Post title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="subtitle">Subtitle (optional)</label>
          <input
            id="subtitle"
            type="text"
            className="form-input"
            placeholder="A brief description or subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="slug">Slug</label>
            <input
              id="slug"
              type="text"
              className="form-input"
              placeholder="post-slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManuallyEdited(true);
              }}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Tags</label>
            <TagInput value={tags} onChange={setTags} existingTags={existingTags} />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Content</label>
          <Editor content={content} onChange={setContent} />
        </div>
      </div>

      <div className="editor-actions">
        <button
          type="button"
          className="btn"
          onClick={() => save('draft')}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save Draft'}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => save('published')}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Publish'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={exportMarkdown}
        >
          Export Markdown
        </button>
        <div className="editor-actions-right">
          {postId && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
