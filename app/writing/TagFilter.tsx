'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function TagFilter({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.getAll('tag');

  function toggle(tag: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.delete('tag');
    const updated = active.includes(tag)
      ? active.filter((t) => t !== tag)
      : [...active, tag];
    updated.forEach((t) => next.append('tag', t));
    router.push(`/writing${next.toString() ? '?' + next.toString() : ''}`);
  }

  function clearAll() {
    router.push('/writing');
  }

  if (tags.length === 0) return null;

  return (
    <div className="tag-filter">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggle(tag)}
          className={`tag-filter-btn${active.includes(tag) ? ' active' : ''}`}
        >
          {tag}
        </button>
      ))}
      {active.length > 0 && (
        <button onClick={clearAll} className="tag-filter-btn tag-filter-clear">
          clear
        </button>
      )}
    </div>
  );
}
