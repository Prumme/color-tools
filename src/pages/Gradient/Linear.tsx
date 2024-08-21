
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { HexAlphaColorPicker } from "react-colorful";


import { RiCloseLine } from "react-icons/ri";

interface Color {
    color: string
    stop: number
}

interface Props {
    angle: number
    setAngle: (angle: number) => void
    colors: {color: string, stop: number}[]
    setColors: (colors: {color: string, stop: number}[]) => void
    selectedColor: number
    setSelectedColor: (selectedColor: number) => void
}

const Linear = ({angle, colors, selectedColor, setAngle, setColors, setSelectedColor}: Props) => {
  return (
    <>
    <div className="flex flex-col gap-y-4">

        <div className="flex gap-x-2">
            <Input className="w-min" type="number" value={angle} onChange={(e) => {setAngle(parseInt(e.target.value))}} />
            <Slider className="grow" defaultValue={[angle]} max={360} step={1} onValueChange={(numbers) => { setAngle(numbers[0])}} />
        </div>

        <HexAlphaColorPicker color={colors[selectedColor].color} onChange={(newColor) => {
            const newColors = [...colors]
            newColors[selectedColor].color = newColor
            setColors(newColors)
            }} 
            className="!w-full"
        />

        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
                {colors.map((color: Color, index) => (
                    <>
                    <div key={index}>
                        <Label className="capitalize">Color {index + 1}</Label>
                        <Input type="text" value={color.color} onClick={() => setSelectedColor(index)} 
                        onChange={(e) => {
                            const newColors = [...colors]
                            newColors[index].color = e.target.value
                            setColors(newColors)
                        }} />
                    </div>

                    <div className="flex items-center gap-x-4">
                        <div>
                            <Label className="capitalize">Stop</Label>
                            <Input type="text" value={color.stop} onClick={() => setSelectedColor(index)} 
                            onChange={(e) => {
                                const newColors = [...colors]
                                let stop = parseInt(e.target.value)
                                if(isNaN(stop)) stop = 0
                                if(stop < 0) stop = 0
                                if(stop > 100) stop = 100
                                newColors[index].stop = stop
                                setColors(newColors)
                            }} />
                        </div>
                        <div className="h-full flex flex-col justify-end">
                            <Button variant="destructive" onClick={() => {
                                if(colors.length === 1) return
                                const newColors = [...colors]
                                newColors.splice(index, 1)
                                setColors(newColors)
                            }}><RiCloseLine /></Button>
                        </div>
                    </div>

                    </>
                ))
            }
        </div>
    </>
  )
}

export default Linear