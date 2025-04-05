import { createContext, useState } from "react"
import run from "../config/gemini"

export const Context = createContext()

const ContextProvider = (Props) => {

    const [input, setInput] = useState("")
    const [resentPrompt, setResentPrompt] = useState("")
    const [prevPrompts, setPrevPrompts] = useState([])
    const [showResult, setshowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 25 * index)
    }

    const newChat = () => {
        setLoading(false)
        setshowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setshowResult(true)
        let response
        if (prompt !== undefined) {
            response = await run(prompt)
            setResentPrompt(prompt)
        }
        else {
            setPrevPrompts(prev => [...prev, input])
            setResentPrompt(input)
            response = await run(input)
        }
        let responseArray = response.split("*")
        let formattedResponse = ""

        for (let i = 0; i < responseArray.length; i++) {
            if (i % 2 === 1) {
                formattedResponse += "<b>" + responseArray[i] + "</b>"
            } else {
                formattedResponse += responseArray[i]
            }
        }
        let words = formattedResponse.split(" ")
        for (let i = 0; i < words.length; i++) {
            delayPara(i, words[i] + " ")
        }
        setLoading(false)
        setInput("")
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setResentPrompt,
        resentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {Props.children}
        </Context.Provider>
    )
}

export default ContextProvider