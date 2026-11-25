import React, { useEffect, useRef, useState } from 'react'
import './notes.css'
import{ v4 as uuid } from 'uuid'
// import { CreateNote } from './CreateNote'
// import { Note } from './Note'
import { Sidebar } from './SideBar'
import { SearchBar } from './SearchBar'
import { NoteList } from './NoteList'

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
    const searchRef = useRef(null)
    const[loading, setLoading] = useState(true)
    const [layout, setLayout] = useState("grid")
// useState const ends here 

// edit handler starts here
    const editHandler = (id, title, content, color, tags) => {
        setEditToggle(id)
        setInputTitle(title || "")
        setInputText(content || "")
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
        
        if(!content) return setError("Content is required (at least 1 character)")
        if(title.length>100) return setError("Title can be at most 100 characters")
        if(content.length > 5000) return setError("Content can be at most 5000 characters")

            const duplicate = notes.some((n) => 
            n.id !== editToggle && (n.title || "") === title && n.content === content)
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

//cancel handler starts here 
    const cancelHandler = () =>{
        setEditToggle(null)
        setInputTitle("")
        setInputText("")
        setInputColor("yellow")
        setInputTags([])
        setError("")
    }
//cancel handle ends here

    useEffect(() => {
        localStorage.setItem('Notes', JSON.stringify(notes))
    }, [notes])

    useEffect(() => {
        const onKey = (e) => {
            const tag = e.target.tagName
            if(e.key === "/" && tag!== "INPUT" && tag!== "TEXTAREA" && tag !== "SELECT"){
                e.preventDefault()
            searchRef.current?.focus()
        }
    }
    window.addEventListener("keydown" , onKey)
    return () => window.removeEventListener("keydown", onKey)
    },[])

    useEffect(() => {
        const onEsc = (e) => {
            if(e.key === "Escape" && editToggle) cancelHandler()
        }
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
    }, [editToggle])
    
    useEffect(() => {
        const t =setTimeout(() => setLoading(false), 400)
        return () => clearTimeout(t)
    }, [])

    const allTags = [...new Set(
        notes
            .filter((n) => Boolean(n.archived) === (view === "archive"))
            .flatMap((n) => n.tags || [])
    )].sort()

    const activeTag = allTags.includes(tagFilter) ? tagFilter : "all"

    const visibleNotes = notes
        .filter((n) => Boolean(n.archived) === (view === "archive"))
        .filter((n) => activeTag === "all" || (n.tags || []).includes(activeTag))
        .filter((n) => 
            ((n.title || "")+ " " + n.content + " " + (n.tags || []) .join(" "))
                .toLowerCase()
                .includes(query.toLowerCase()))
        .sort((a,b) => {
            if(Boolean(a.pinned) !== Boolean(b.pinned)) return Boolean(b.pinned) - Boolean(a.pinned)
            if(sort === "title") return (a.title || "").localeCompare(b.title || "")
            if(sort === "color") return (a.color || "").localeCompare(b.color || "")
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

        const formProps = {
            inputTitle,
            setInputTitle,
            inputText,
            setInputText,
            inputColor,
            setInputColor,
            inputTags,
            setInputTags,
            saveHandler,
            cancelHandler,
            error
        }

        const noteHandlers = {
            toggleSelect, editHandler, deleteHandler, pinHandler, archiveHandler
        }

        if(loading) {
            return (
                <div className="notes">
                    {[1,2,3].map((i) => (
                        <div key={i} className="note animate-pulse"/>
                    ))}
                </div>
            )
        }

return (
    <>
    <div className="flex flex-wrap items-center gap-3 mb-4">
        <Sidebar view={view} setView={setView} cancelHandler={cancelHandler}/>
        <SearchBar
            query={query} 
            setQuery={setQuery}
            sort={sort}
            setSort={setSort}
            allTags={allTags}
            activeTag={activeTag}
            setTagFilter={setTagFilter}
            layout={layout}
            setLayout={setLayout}
            searchRef={searchRef}
        />
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

        <NoteList
            notes={visibleNotes}
            layout={layout}
            view={view}
            query={query}
            editToggle={editToggle}
            selectedIds={selectedVisible}
            formProps={formProps}
            noteHandlers={noteHandlers}
        />
    </>
  )
}

export default Notes
