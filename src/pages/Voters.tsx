import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { VoterCard } from '@/components/VoterCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { fetchDirectoryPage, fetchTopVoters, fetchTopPoliticians, type DirectoryPage, type PublicUser } from '@/lib/users';
import { Link } from 'react-router-dom';

export default function Voters() {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');

  const [type, setType] = useState<'all' | 'public' | 'politician'>('all');
  const [gender, setGender] = useState<'any' | 'male' | 'female' | 'other' | 'prefer_not'>('any');
  const [queryText, setQueryText] = useState('');
  const [page, setPage] = useState<DirectoryPage | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [topVoters, setTopVoters] = useState<PublicUser[]>([]);
  const [topPoliticians, setTopPoliticians] = useState<PublicUser[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const first = await fetchDirectoryPage({ type, gender, pageSize: 24, cursor: null });
        if (!mounted) return;
        setPage(first);
        setItems(first.items);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch directory page:', error);
        if (!mounted) return;
        setPage(null);
        setItems([]);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [type, gender]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [tv, tp] = await Promise.all([fetchTopVoters(10), fetchTopPoliticians(10)]);
        if (!mounted) return;
        setTopVoters(tv);
        setTopPoliticians(tp);
      } catch (error) {
        console.error('Failed to fetch top voters/politicians:', error);
        if (!mounted) return;
        // Set empty arrays on error to prevent page crash
        setTopVoters([]);
        setTopPoliticians([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const loadMore = async () => {
    if (!page?.nextCursor) return;
    setLoadingMore(true);
    try {
      const next = await fetchDirectoryPage({ type, gender, pageSize: 24, cursor: page.nextCursor });
      setItems((prev) => [...prev, ...next.items]);
      setPage(next);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = items.filter((u) => {
    if (!queryText) return true;
    const name = (u.display_name || `${u.name || ''} ${u.surname || ''}`).toLowerCase();
    return name.includes(queryText.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        selectedLanguage={selectedLanguage}
        onCountryChange={setSelectedCountry}
        onStateChange={setSelectedState}
        onLanguageChange={setSelectedLanguage}
      />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Voters Directory</h1>
          <Link to="/search">
            <Button variant="default">Search</Button>
          </Link>
        </div>

        {/* Previews */}
        {(topVoters.length > 0 || topPoliticians.length > 0) && (
          <div className="space-y-6 mb-6">
            {topVoters.length > 0 && (
              <section>
                <div className="font-medium mb-2">Top Voters</div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {topVoters.map((u) => (
                    <VoterCard key={u.id} user={u} />
                  ))}
                </div>
              </section>
            )}
            {topPoliticians.length > 0 && (
              <section>
                <div className="font-medium mb-2">Top Politicians</div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {topPoliticians.map((u) => (
                    <VoterCard key={u.id} user={u} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <Input
            placeholder="Search by name"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />
          <Select value={type} onValueChange={(v: any) => setType(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public Voters</SelectItem>
              <SelectItem value="politician">Politicians</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gender} onValueChange={(v: any) => setGender(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not">Prefer not</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((u) => (
                <VoterCard key={u.id} user={u} />
              ))}
            </div>
            {page?.nextCursor && (
              <div className="flex justify-center mt-6">
                <Button variant="secondary" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? 'Loading…' : 'Load more'}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}


