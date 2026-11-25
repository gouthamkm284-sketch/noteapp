import React, { useEffect, useState } from 'react'
import { CreateNote } from './CreateNote'
import './notes.css'
import{ v4 as uuid } from 'uuid'
import { Note } from './Note'

const Notes = () => {
// useState begins here
    const [inputTitle, setInputTitle] = useState("")
    const [inputText, setInputText] = useState("")
    const [notes, setNotes] = useState(() => {
        const data = localStorage.getItem("Notes")
        return data ? JSON.parse(data) : []
    })
    const [editToggle, setEditToggle] = useState(null)
    const [inputColor, setInputColor] = useState("yellow")
    const [error, setError] = useState("")
    const [inputTags, setInputTags] = useState([])
    const [view, setView] = useState('notes')
    const [query, setQuery] = useState("")
    const [sort, setSort] = useState("newest")
    const [tagFilter, setTagFilter] = useState("all")
    const [selected, setSelected] = useState([])
// useState const ends here 

// edit handler starts here
    const editHandler = (id, title, content, color, tags) => {
        setEditToggle(id)
        setInputTitle(title)
        setInputText(content)
        setInputColor(color || "yellow")
        setInputTags(tags || [])
        setError("")
    }
// edit handler ends here

// delete handler starts here
    const deleteHandler = (id) => {
        if(!window.confirm("Delete this note?")) return
        setNotes((prevNotes) =>
            prevNotes.filter((note) => note.id !== id))
    }
// delete handler ends here

// pin handler starts here
    const pinHandler = (id) => {
        setNotes((prevNotes) => 
        prevNotes.map((n) => n.id === id ? {...n, pinned: !n.pinned } : n))
    }
// pin handler ends here

// archive handler starts here
    const archiveHandler = (id) => {
        setNotes((prevNotes) => 
        prevNotes.map((n) => 
        n.id === id ? {...n, archived: !n.archived, pinned: false } : n))
    }
// archive handler ends here

// save handler starts here
    const saveHandler = () => {
        const title = inputTitle.trim()
        const content = inputText.trim()
        
        if(!content) return setError("Content is required (at least 1 charchter)")
        if(title.length>100) return setError("Title can be at most 100 characters")

            const duplicate = notes.some((n) => 
            n.id !== editToggle && n.title === title && n.content === content)
            if(duplicate) return setError("This note already exists")

                setError("")

            if(editToggle) {
            setNotes((prevNotes) =>
                prevNotes.map((note) => 
                note.id === editToggle ?
                {
                    ...note, 
                    title: title,
                    content: content,
                    color: inputColor,
                    tags: inputTags,
                    updatedAt: Date.now()
                }
                : note
            )
        );
        } else {
            setNotes((prevNotes) => [
                ...prevNotes, 
                {
                    id: uuid(),
                    title: title,
                    content: content,
                    color: inputColor,
                    tags: inputTags,
                    pinned:false,
                    archived: false,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }
            ])
        }
        setInputTitle("")
        setInputText("");
        setInputColor("yellow")
        setInputTags([])
        setEditToggle(null);
    };
// save handler ends here

    useEffect(() => {
        localStorage.setItem('Notes', JSON.stringify(notes))
    }, [notes])

    const allTags = [...new Set(
        notes
            .filter((n) => n.archived === (view === "archive"))
            .flatMap((n) => n.tags || [])
    )].sort()

    const activeTag = allTags.includes(tagFilter) ? tagFilter : "all"

    const visibleNotes = notes
        .filter((n) => Boolean(n.archived) === (view === "archive"))
        .filter((n) => activeTag === "all" || (n.tags || []).includes(activeTag))
        .filter((n) => 
            (n.title + " " + n.content + " " + (n.tags || []) .join(" "))
                .toLowerCase()
                .includes(query.toLowerCase()))
        .sort((a,b) => {
            if(a.pinned !== b.pinned) return b.pinned - a.pinned
            if(sort === "title") return (a.title || "").localeCompare(b.title || "")
            if(sort === "oldest") return a.createdAt - b.createdAt
            return b.createdAt - a.createdAt
        })

        const selectedVisible = selected.filter((id) => visibleNotes.some((n) => n.id === id))

        const toggleSelect = (id) => {
            setSelected((prev) => 
            prev.includes(id) ? prev.filter((x) => x!== id) : [...prev, id])
        }

        const bulkDelete = () => {
            if(!window.confirm(`Delete ${selectedVisible.length} notes?`)) return 
            setNotes((prev) => prev.filter((n) => !selectedVisible.includes(n.id)))
            setSelected([])
        }

return (
    <>
    <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
            className={`px-4 py-1.5 rounded-xl font-bold text-sm 
                ${view==='notes' ? "bg-green-700 text-white" : "bg-white/50"}`}
            onClick={() => setView("notes")}
        >
            Notes
        </button>
        <button 
            className={`px-4 py-1.5 rounded-xl font-bold text-sm 
                ${view ==="archive" ? "bg-green-700 text-white" : "bg-white/50"}`}
            onClick={() => setView("archive")}
        >
            Archive    
        </button>

        <input
            className="flex-1 min-w-[180px] rounded-xl bg-white/50 px-3 py-1.5 outline-none"
            placeholder='Search notes....'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />

            <select className='rounded-xl bg-white/50 px-3 py-1.5'
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title A-Z</option>
            </select>

            {allTags.length > 0 && (
                <select 
                className="rounded-xl bg-white/50 px-3 py-1.5"
                value={activeTag}
                onChange={(e) => setTagFilter(e.target.value)}
                >
                    <option value ="all">All tags</option>
                    {allTags.map((t) => (
                        <option key={t} value={t}>#{t}</option>
                    ))}
                </select>
            )}
            </div>
        
        {selectedVisible.length > 0 && (
            <div className='flex flex-wrap items-center gap-3 mb-4 rounded-xl bg-white/60 px-4 py-2'>
            <span className = 'font-bold text-sm'>{selectedVisible.length} selected</span>
            <button className='note_save' onClick={() => setSelected(visibleNotes.map((n) => n.id))}>
                Select all
            </button>
            <button className='note_save' onClick={bulkDelete}> Delete selected</button>
            <button className='note_save' onClick={() => setSelected([])}>Clear</button>
            </div>
        )}

    <div className='notes'>
        {visibleNotes.map((note) => (
                editToggle === note.id ? 
                    <CreateNote 
                        key={note.id}
                        inputTitle={inputTitle}
                        setInputTitle={setInputTitle}
                        inputText={inputText} 
                        setInputText = {setInputText}
                        inputColor={inputColor}
                        setInputColor={setInputColor}
                        inputTags={inputTags}
                        setInputTags={setInputTags}
                        saveHandler = {saveHandler}
                        error={error}
                    />
                    :
                    <Note
                        key={note.id}
                        id={note.id}
                        title={note.title}
                        content={note.content}
                        color={note.color}
                        tags={note.tags}
                        selected={selectedVisible.includes(note.id)}
                        toggleSelect={toggleSelect}
                        pinned={note.pinned}
                        archived={note.archived}
                        createdAt={note.createdAt}
                        updatedAt={note.updatedAt}
                        editHandler={editHandler}
                        deleteHandler={deleteHandler}
                        pinHandler={pinHandler}
                        archiveHandler={archiveHandler}
                    />
                ))
            }
            {visibleNotes.length === 0 && (
                    <p className = 'font-semibold text-[#263238]'>
                        {query
                        ? 'No notes match your search.'
                        : view === 'archive'
                        ? 'Nothing archived yet.'
                        :'No notes yet. write your first one!'}
                    </p>
                )
            }
            {!editToggle && view ==="notes" &&
            <CreateNote 
            inputTitle={inputTitle}
            setInputTitle={setInputTitle}
            inputText={inputText} 
            setInputText={setInputText}
            inputColor={inputColor}
            setInputColor={setInputColor}
            inputTags={inputTags}
            setInputTags={setInputTags}
            saveHandler={saveHandler}
            error={error}
            />
            }
    </div>
    </>
  )
}

export default Notes
