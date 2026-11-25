import React, {useRef, useState} from 'react'
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
    cancelHandler,
    autoFocus=false,
    error}) => {

    const MAX_CONTENT = 5000
    const titleLeft = 100 - inputTitle.length
    const contentLeft = MAX_CONTENT - inputText.length

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

    const textRef = useRef(null)

    const wrap = (before, after = before) => {
        const el = textRef.current
        const s = el.selectionStart
        const e = el.selectionEnd
        const selected = inputText.slice(s, e)
        setInputText(inputText.slice(0, s) + before + selected + after + inputText.slice(e))
        requestAnimationFrame(() => {
            el.focus()
            el.setSelectionRange(s + before.length, e + before.length)
        })
    }

    const makeList = () => {
        const el = textRef.current
        const s = el.selectionStart
        const e = el.selectionEnd
        const lineStart = s === 0 ? 0 : inputText.lastIndexOf("\n", s - 1) +1
        const block = inputText.slice(lineStart, e)
        const listed = block
            .split("\n")
            .map((l) => (l.startsWith("- ") ? l : "- " + l))
        .join("\n")
    setInputText(inputText.slice(0, lineStart) + listed + inputText.slice(e))
    }

    const onTextKeyDown = (e) => {
        if(e.key !== "Enter" || e.ctrlKey || e.metaKey) return 
        const el = textRef.current
        const pos = el.selectionStart
        const lineStart = inputText.slice(lineStart, pos)

        if(line === "- ") {
            e.preventDefault()
            setInputText(inputText.slice(0, lineStart) + inputText.slice(pos))
            return 
        }
        if(line.startsWith("- ")) {
            e.preventDefault()
            setInputText(inputText.slice(0, pos) + "\n- " + inputText.slice(pos))
            requestAnimationFrame(() => el.setSelectionRange(pos + 3, pos + 3))
        }
    }

    const onFormKeyDown = (e) =>{
        if((e.ctrlKey || e.metaKey) && e.key === "Enter"){
            e.preventDefault()
            saveHandler()
        }
        if(e.key === "Escape") cancelHandler()
    }

    return (
    <div className='note' onKeyDown={onFormKeyDown}>
        <input
        type='text'
        className="w-full bg-transparent text-[#263238] text-2xl font-semibold outline-none mb-2"
        placeholder='Content (required)'
        value={inputTitle}
        onChange={(e) => setInputTitle(e.target.value)}
        maxLength={100}
        />
        <div className='flex gap-2 mb-1'>
            <button type="button" className='note_save font-bold' onClick={() => wrap("**")}>B</button>
            <button type="button" className='note_save italic' onClick={() => wrap("*")}>I</button>
            <button type="button" className="note_save" onClick={makeList}>• List</button>
        </div>
        <textarea
        className='w-full bg-transparent text-base outline-none resize-none'
        cols={10}
        rows={5}
        placeholder="Type..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        maxLength={MAX_CONTENT}
        autoFocus={autoFocus}
        ref={textRef}
        onKeyDown={onTextKeyDown}
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
            <span className = 'label'>Title: {titleLeft} . Content: {contentLeft}</span>
            <button className='note_save' onClick = {saveHandler}>Save</button>
        </div>
    </div>
  )
}
