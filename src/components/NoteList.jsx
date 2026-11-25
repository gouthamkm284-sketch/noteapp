import React from 'react'
import { CreateNote } from './CreateNote'
import { Note } from './Note'

export const NoteList = ({
    notes, 
    layout, 
    view, 
    query,
    editToggle,
    selectedIds,
    formProps,
    noteHandlers 
}) => {
    return (
        <div className={layout === 'grid' ? 'notes' : 'notes-list'}>
            {
            notes.map((note) => 
            editToggle === note.id
                ? <CreateNote key={note.id} autoFocus {...formProps}/>
                : <Note
                    key={note.id}
                    {...note}
                    selected={selectedIds.includes(note.id)}
                    {...noteHandlers}
                    />
            )}

            {notes.length === 0 && (
            <div className='col-span-full flex flex-col items-center gap-2 py-12 text-center text-[#263238]'>
                <span className='text-5xl'>📝</span>
                <p className='text-lg font-bold'>
                    {query 
                    ? 'No notes match your search.'
                    : view ==='archive'
                    ? 'Nothing archived yet.'
                    : 'No notes yet.'}
                </p>
                {!query && view === 'notes' && (
                    <p className='text-sm'>Write your first one using the card below.</p>
                )}
                {!query && view === 'archive' && (
                    <p className='text-sm'>Archived notes will show up here.</p>
                )}
            </div>
        )}
        {!editToggle && view === 'notes' && 
            <CreateNote 
                {...formProps}
            />
        }
    </div>
)}