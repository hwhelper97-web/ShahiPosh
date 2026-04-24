'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..." 
        className="w-full bg-muted border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-accent transition-luxury"
      />
      <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-luxury">
        <Search size={18} />
      </button>
    </form>
  );
}
