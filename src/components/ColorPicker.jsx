import React from 'react'

const colors = [
    { name: "yellow", value:"#FEF3C7"},
    { name: "green", value:"#DCFCE7"},
    { name: "blue", value:"#DBEAFE"},
    { name: "pink", value:"#FCE7F3"},
    { name: "purple", value:"#F3E8FF"},
    { name: "white", value:"#FFFFFF"}
]

const ColorPicker = ({ selectedColor, setSelectedColor}) => {
    return (
        <div className="flex gap-2">
            {colors.map((color) => (
                <button
                key={color.name}
                type="button"
                title={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-7 h-7 rounded-full border ${
                    selectedColor === color.name
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                style={{backgroundColor: color.value }}
                />
            ))}
        </div>
    )
}

export default ColorPicker