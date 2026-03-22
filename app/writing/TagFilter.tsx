'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function TagFilter({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('tag');

  function toggle(tag: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (active === tag) {
      next.delete('tag');
    } else {
      next.set('tag', tag);
    }
    router.push(`/writing${next.toString() ? '?' + next.toString() : ''}`);
  }

  if (tags.length === 0) return null;

  return (
    <div className="tag-filter">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggle(tag)}
          className={`tag-filter-btn${active === tag ? ' active' : ''}`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
