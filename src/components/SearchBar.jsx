import React from 'react'

export const SearchBar = ({
    query, setQuery,
    sort, setSort,
    allTags, activeTag, setTagFilter, 
    layout, setLayout,
    searchRef}) => {

    return (
        <>
            <input
                ref={searchRef}
                className='flex-1 min-w-[180px] rounded-xl bg-white/50 px-3 py-1.5 outline-none'
                placeholder='Search notes... (press /)'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <select
                className='rounded-xl bg-white/50 px-3 py-1.5'
                value={sort}
                onChange={(e) => setSort(e.target.value)}
            >
                <option value='newest'>Newest first</option>
                <option value='oldest'>Oldest first</option>
                <option value='title'>Title A-Z</option>
                <option value='color'>Color</option>
            </select>

            {allTags.length > 0 && (
                <select
                    className='rounded-xl bg-white/50 px-3 py-1.5'
                    value={activeTag}
                    onChange={(e) => setTagFilter(e.target.value)}
                >
                    <option value='all'>All tags</option>
                    {allTags.map((t) => (
                        <option key = {t} value={t}>#{t}</option>
                    ))}
                </select>
            )}

            <button
                className='rounded-xl bg-white/50 px-3 py-1.5 font-bold text-sm'
                onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
            >
                {layout==='grid' ? 'List view' : 'Grid view'}
            </button>
        </>
    )
    }