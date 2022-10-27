import React, { useState, useEffect, useRef, useContext, createContext } from 'react'
import {  Tab, Switch } from '@alifd/next';
import './index.scss'
import WordsContext from './WordsContext';
import tabsConfig from './tabs.config'
async function getTabId() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab.id
} 
export default function App() {
    const [words, setWords] = useState([{ word: '快去添加吧', meaning: "f+a添加选中单词,f+e添加释义" }]);
    const [enableState,setEnableState]=useState(true);
    const [copyWords, setCopyWords] = useState(words.slice(0, 3));
    useEffect(() => {
       
        getAllWords()
        getEnableState()
    }, [])
    const getAllWords=async ()=>{
        chrome.runtime.sendMessage({
            type: 'INIT', data: ''
        }, (response) => {
            setWords(response)
        });
    }
    const getEnableState=async ()=>{
        const tabId = await getTabId();
        const res=await chrome.tabs.sendMessage(tabId, {type:"GET_ENABLE_STATE",data:''});
        chrome.runtime.sendMessage({
            type: 'get data', data: res
        })
        setEnableState(res==='true');
    }
    const renderTabItems = () => {
        return tabsConfig.map(t => {
            const {comp:TabComp,title,args={}}=t;
            return <Tab.Item title={title}>
                <TabComp  {...args} />
            </Tab.Item>
        })
    }
    return (
        <WordsContext.Provider
            value={{
                words,
                setWords,
                copyWords,
                setCopyWords
            }}
        >
            <div className='popup-wrapper'>
                <Tab
                    onChange={() => {
                        chrome.runtime.sendMessage({
                            type: 'INIT', data: ''
                        }, (response) => {
                            setWords(response)
                        });
                    }}


                >
                    {renderTabItems()}
                </Tab>
                <div className='switch-wrapper'>
                    <Switch checked={enableState} onChange={async (v)=>{
                       const tabId = await getTabId();
                       const res=await chrome.tabs.sendMessage(tabId, {type:"SET_ENABLE_STATE",data:v+''});
                       setEnableState(v);
                       }} />
                </div>
            </div>
        </WordsContext.Provider>

    )
}
