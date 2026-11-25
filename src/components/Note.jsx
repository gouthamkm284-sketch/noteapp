import React from 'react'

export const Note = ({
  id, 
  title, 
  content,
  color,
  tags=[],
  selected=false,
  toggleSelect,
  pinned,
  archived,
  createdAt,
  updatedAt,
  editHandler, 
  deleteHandler,
  pinHandler,
  archiveHandler}) => {
    
  const formatDate = (ts) =>
    new Date(ts).toLocaleString([], {
    day: 'numeric',
    month: 'short',
    hour:'numeric',
    minute: '2-digit'
    })

  const colorMap = {
    yellow: "rgba(254,243,199,0.6)",
    green: "rgba(220,252,231,0.6)",
    blue: "rgba(219, 234, 254, 0.6)",
    pink: "rgba(252, 231, 243, 0.6)",
    purple: "rgba(243, 232, 255, 0.6)",
    white: "rgba(255, 255, 255, 0.5)"
    }

  return (
    <div className = {`note ${selected ? 'ring-2 ring-green-700' : ''}`}
    style={{ backgroundColor: colorMap[color] || colorMap.yellow}}>
      
      <div className = 'note-body'>
        
        <label className = 'flex items-center gap-2 text-sm font-semibold cursor-pointer mb-2'>
          <input
          type='checkbox'
          checked={selected}
          onChange={() => toggleSelect(id)}
          className='h-4 w-4 accent-green-700'
          />
          Select
        </label>

        {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
        <p>{content}</p>

        {tags.length > 0 && (
          <div className = "flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold">
                #{tag}
              </span>
            ))}
          </div>
          )}

          {createdAt && (
            <p className = 'text-xs mt-3 text-[#44554a]'>
              Created {formatDate (createdAt)}
              {updatedAt - createdAt> 1000 && `. Edited ${formatDate(updatedAt)}`}
            </p>
          )}
          </div>
          <div className='note_footer' style = {{ justifyContent : 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
            {!archived && (
            <button className ='note_save' onClick={() => pinHandler(id)}>
                {pinned ? "Unpin" : "Pin"}
            </button>
          )}
              <button className='note_save' onClick={() => archiveHandler(id)}>
                {archived ? "Restore" : "Archive"}
            </button>
            <button className='note_save' onClick={() => deleteHandler(id)}>
                Delete
            </button>
            <button className='note_save' onClick={() => editHandler(id, title, content, color, tags)}>
                Edit
            </button>
          </div>
    </div>
  )
}
