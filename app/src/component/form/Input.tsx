import { InputHTMLAttributes } from "react"
import { StringUtil } from "../../util/StringUtil"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label?: string
    width?: string
}

interface InputsProps {
    label: string
    width?: string
    inputs: InputProps[]
}

export interface InpuSelectProps {
    key: string
    label?: string
    width?: string
    title?: string
    type?: "button" | "reset" | "submit" | undefined
    isSelected: boolean,
    onSelect?: any | undefined
}

interface InpusSelectProps {
    label: string
    width?: string
    elements: InpuSelectProps[]
}

const resolveWidth = (width?: string) => {
    // return width ? `w-[${width}]` : 'w-full'
    // const resolvedWidth = width ? width.includes('%') ? `w-[${width}]` : `w-${width}` : 'w-full'
    return width ? width.includes('%') ? `w-[${width}]` : `w-${width}` : 'w-full'
    // return width ? `w-${width}` : 'w-full'
    
}

const getInput = (input: InputProps) => {
    const classNameAsString: string = `${resolveWidth(input.width)} h-full bg-zinc-900 mb-1 py-3 px-4 rounded text-sm placeholder:text-zinc-500`
    return (
        <input 
            id={input.id}
            key={input.id}
            {...input}
            className={classNameAsString}
        />
    )
}

const getInputs = (inputs: InputProps[]) => {
    return inputs.map((input, index) => {
        return getInput(input)
    })
}

const getElement = (element: InpuSelectProps) => {
    const classNameAsString: string = `${resolveWidth(element.width)} h-full ${element.isSelected ? 'bg-violet-500' : 'bg-zinc-900'} py-3 px-4 rounded text-sm placeholder:text-zinc-500`
    return (
        <button 
            id={element.key}
            key={element.key}
            title={element.title}
            type={element.type}
            className={classNameAsString}
            onClick={() => {
                element.onSelect(element)
            }}
        >
            {element.label}
        </button>
    )
}

const getInputElements = (elements: InpuSelectProps[]) => {
    return elements.map((element, index) => {
        return getElement(element)
    })
}

export const Input = (props: InputProps) => {
    return (
        <div className='flex flex-col gap-2'>
            {
                StringUtil.isNotEmpty(props.label) ? 
                <label htmlFor={props.id}>{props.label}</label> : 
                <></>
            }
            {getInput(props)}
        </div>
    )
}

export const Inputs = (props: InputsProps) => {
    const classNameAsString: string = `${resolveWidth(props.width)} flex flex-col gap-2 mb-2 overflow-x-hidden`
    // console.log(classNameAsString)
    return (
        <div className={classNameAsString}>
            {
                StringUtil.isNotEmpty(props.label) ? 
                <label htmlFor={props.inputs[0].id}>{props.label}</label> : 
                <></>
            }
            <div className='w-full flex gap-2'>
                {getInputs(props.inputs)}
            </div>
        </div>
    )
}

export const InputSelect = (props: InpusSelectProps) => {
    const classNameAsString: string = `${resolveWidth(props.width)} flex flex-col gap-2 overflow-x-hidden`
    // console.log(classNameAsString)
    return (
        <div className={classNameAsString}>
            <label htmlFor={props.elements[0].key}>{props.label}</label>
            <div className='overflow-x-scroll __scrollbar'>
                <div className="w-full flex gap-1 mb-1">
                    {getInputElements(props.elements)}
                </div>
            </div>
        </div>
    )
}