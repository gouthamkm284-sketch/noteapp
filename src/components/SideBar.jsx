import React from 'react'

export const Sidebar = ({view, setView, cancelHandler}) => {
    const tabs = [
        { id:'notes', label:'Notes'},
        { id:'archive', label:'Archive'}
    ]
    return (
        <>
        {tabs.map((t) => (
            <button 
            key={t.id}
            className={`px-4 py-1.5 rounded-xl font-bold text-sm 
                ${view === t.id ? "bg-green-700 text-white" : "bg-white/50"}`}
            onClick={() => {setView(t.id); cancelHandler() }}
            >
                {t.label}
            </button>
        ))}
        </>
    )
}