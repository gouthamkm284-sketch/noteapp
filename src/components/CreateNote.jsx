import React, {useState} from 'react'
import ColorPicker from './ColorPicker'

export const CreateNote = ({
    inputTitle,
    setInputTitle,
    inputText, 
    setInputText,
    inputColor,
    setInputColor,
    inputTags=[],
    setInputTags,
    saveHandler,
    error}) => {
    // const char =100;
    // const charLimit = char - inputText.length;

    const titleLeft = 100 - inputTitle.length

    const [tagDraft, setTagDraft] = useState("")
    
    const addTags =() => {
        const tag = tagDraft.trim().replace(/^#/,"").toLowerCase().slice(0, 20)
        setTagDraft("")
        if(!tag || inputTags.includes(tag) || inputTags.length >= 5) return 
        setInputTags([...inputTags, tag])
    }

    const onTagKeyDown = (e) => {
        if(e.key === "Enter" || e.key === ","){
            e.preventDefault()
            addTags()
        } else if (e.key === "Backspace" && !tagDraft && inputTags.length) {
            setInputTags(inputTags.slice(0, -1))
        }
    }

    return (
    <div className='note'>
        <input
        type='text'
        className="w-full bg-transparent text-2xl font-semibold outline-none mb-2"
        placeholder='Content (required)'
        value={inputTitle}
        onChange={(e) => setInputTitle(e.target.value)}
        maxLength={100}
        />
        <textarea
        className='w-full bg-transparent text-base outline-none resize-none'
        cols={10}
        rows={5}
        placeholder="Type..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        />

    <div className ="flex flex-wrap items-center gap-2 my-2">
        {inputTags.map((tag) => (
            <span
            key={tag}
            className = "inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-0.5 text-sm font-semibold"
            >
                #{tag} 
                <button
                type="button"
                aria-label={`Remove tag ${tag}`}
                onClick={() => setInputTags(inputTags.filter((t) => t !== tag))}>
                    x
                </button>
            </span>
    ))}
    <input
    type="text"
    className="min-w-[110px] flex-1 bg-transparent text-sm outline-none"
    placeholder={inputTags.length >= 5 ? "Tag limit reached" : "Add tag, press Enter"}
    value={tagDraft}
    disabled={inputTags.length >=5}
    maxLength={20}
    onChange={(e) => setTagDraft(e.target.value)}
    onKeyDown={onTagKeyDown}
    />
    </div>

        <ColorPicker
        selectedColor={inputColor}
        setSelectedColor={setInputColor}/>

        {error && <p className ='text-red-700 text-sm font-semibold mt-2'>{error}</p>}

        <div className='note_footer'>
            <span className = 'label'>Title: {titleLeft} left</span>
            <button className='note_save' onClick = {saveHandler}>Save</button>
        </div>
    </div>
  )
}
