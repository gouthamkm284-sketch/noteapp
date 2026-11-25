import React from 'react'

const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    return parts.map((part, i) => {
        if(part.startsWith("**") && part.endsWith("**") && part.length > 4)
            return <strong key ={i}>{part.slice(2, -2)}</strong>
        if(part.startsWith("*") && part.endsWith("*") && part.length>2)
            return <em key={i}>{part.slice(1, -1)}</em>
        return part
    })
}

export const FormattedText = ({text}) => {
    const blocks = []
    let items = []

    const flush = () => {
        if(items.length){
            blocks.push(<ul key={"ul" + blocks.length} className='list-disc pl-5'>{items}</ul>)
            items = []
        }
    }
    text.split("\n").forEach((line, i) => {
        if(line.startsWith("- ")) {
            items.push(<li key={i}>{renderInline(line.slice(2))}</li>)
        } else {
            flush()
            blocks.push(<p key={i} className="min-h-[1em]">{renderInline(line)}</p>)
        }
    })
    flush()

    return <div>{blocks}</div>
}
