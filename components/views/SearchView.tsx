import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { SearchIcon } from '../Icon';

interface SearchViewProps {
    allUsers: User[];
    onViewProfile: (userId: string) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ allUsers, onViewProfile }) => {
    const [query, setQuery] = useState('');

    const searchResults = useMemo(() => {
        if (!query.trim()) return [];
        const lowercasedQuery = query.toLowerCase();
        return allUsers.filter(user =>
            user.name.toLowerCase().includes(lowercasedQuery)
        );
    }, [query, allUsers]);

    return (
        <div className="p-4 text-slate-300">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search for students or faculty..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
            </div>

            {query.trim() ? (
                <div className="space-y-3">
                    {searchResults.length > 0 ? (
                        searchResults.map(user => (
                            <button
                                key={user.id}
                                onClick={() => onViewProfile(user.id)}
                                className="w-full flex items-center space-x-4 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                            >
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-semibold text-slate-200">{user.name}</p>
                                    <p className="text-sm text-slate-400">{user.role}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center mt-10">
                            <p className="text-slate-500">No users found for "{query}".</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center mt-10">
                    <h2 className="text-xl font-semibold text-slate-400">Search CampusKizuna</h2>
                    <p className="text-slate-500 mt-2">Find what matters to you.</p>
                </div>
            )}
        </div>
    );
};

export default SearchView;
