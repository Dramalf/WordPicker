import React, { useState, useEffect, useRef, useContext, createContext } from 'react'
import { List, Input, Button, DatePicker2, Tab, Checkbox, NumberPicker } from '@alifd/next';
import './index.scss'
import { handleKeypress } from './utils';
import WordsContext from './WordsContext';
import tabsConfig from './tabs.config'
const { RangePicker } = DatePicker2;
export default function App() {
    const [words, setWords] = useState([{ word: '快去添加吧', meaning: "f+a添加选中单词,f+e添加释义" }]);
    const [copyWords, setCopyWords] = useState(words.slice(0, 3));
    useEffect(() => {
        document.addEventListener('keypress', handleKeypress);
        chrome.runtime.sendMessage({
            type: 'INIT', data: ''
        }, (response) => {
            setWords(response)
        });
    }, [])
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
                {/* <Tab
                    onChange={() => {
                        chrome.runtime.sendMessage({
                            type: 'INIT', data: ''
                        }, (response) => {
                            setWords(response)
                        });
                    }}
                >
                    <Tab.Item title="全部" >
                        <div className='words-list'>
                            <List
                                size='small'
                                dataSource={words}
                                divider
                                renderItem={(item) => (
                                    <List.Item
                                        title={item.word}
                                        key={item.id}
                                        className="word-item"
                                        onClick={(e) => {
                                            let last = document.querySelector('.move');
                                            if (last) {
                                                last.classList.remove('move')
                                            }
                                            e.currentTarget.querySelector('.delete-btn').classList.add('move')
                                        }}
                                        extra={(<div className='delete-btn' onClick={(e) => {
                                            e.stopPropagation();
                                            setWords(words.filter(w => w.word !== item.word));
                                            chrome.runtime.sendMessage({ type: 'DELETE_WORD', data: item })
                                        }}>
                                            <div>delete</div>
                                        </div>)}
                                    >
                                        <Input
                                            className='meaning-input'
                                            hasBorder={false}
                                            style={{ backgroundColor: "lightgoldenrodyellow", color: "#e3e4e5" }}
                                            defaultValue={item.meaning}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                let last = document.querySelector('.move');
                                                if (last) {
                                                    last.classList.remove('move');
                                                }
                                            }}
                                            onFocus={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                                            onBlur={(e) => { e.currentTarget.style.backgroundColor = "lightgoldenrodyellow"; }}
                                            onChange={(v) => { chrome.runtime.sendMessage({ type: 'EDIT_MEANING', data: { word: item.word, meaning: v } }) }}
                                        ></Input>
                                    </List.Item>
                                )}
                            >
                            </List>
                        </div>
                    </Tab.Item>
                    <Tab.Item title="未释义" >
                        <div className='words-list'>
                            <List
                                size='small'
                                dataSource={words.filter(i => !i.meaning)}
                                divider
                                renderItem={(item) => (
                                    <List.Item
                                        title={item.word}
                                        key={item.id}
                                        className="word-item"
                                        onClick={(e) => {
                                            let last = document.querySelector('.move');
                                            if (last) {
                                                last.classList.remove('move')
                                            }
                                            e.currentTarget.querySelector('.delete-btn').classList.add('move')
                                        }}
                                        extra={(<div className='delete-btn' onClick={(e) => {
                                            e.stopPropagation();
                                            setWords(words.filter(w => w.word !== item.word));
                                            chrome.runtime.sendMessage({ type: 'DELETE_WORD', data: item })
                                        }}>
                                            <div>delete</div>
                                        </div>)}
                                    >
                                        <Input
                                            className='meaning-input'
                                            hasBorder={false}
                                            style={{ backgroundColor: "lightgoldenrodyellow", color: "#e3e4e5" }}
                                            defaultValue={item.meaning}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                let last = document.querySelector('.move');
                                                if (last) {
                                                    last.classList.remove('move');
                                                }
                                            }}
                                            onFocus={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
                                            onBlur={(e) => { e.currentTarget.style.backgroundColor = "lightgoldenrodyellow"; }}
                                            onChange={(v) => {
                                                chrome.runtime.sendMessage({ type: 'EDIT_MEANING', data: { word: item.word, meaning: v } })
                                            }}
                                        ></Input>
                                    </List.Item>
                                )}
                            >
                            </List>
                        </div>
                    </Tab.Item>
                    <Tab.Item title="导出" >
                        <Tab tabPosition='left'
                        >
                            <Tab.Item title="按数量" >
                                <div className='tab3'>

                                    <div> 最近<NumberPicker style={{ width: '40px' }} defaultValue={3} min={1} onChange={(v) => {
                                        setCopyWords(words.slice(0, v));
                                    }} type="inline"></NumberPicker>条（共${words.length}条）</div>
                                    <div><Button onClick={() => {
                                        const text = copyWords.map(w => w.word + ":" + w.meaning + '\r\n').join('');
                                        navigator.clipboard.writeText(text)
                                    }}>复制</Button></div>
                                </div>

                            </Tab.Item>
                            <Tab.Item title="按时间" >
                                <div className='tab3'>
                                    <RangePicker
                                        showTime
                                        timePanelProps={{
                                            defaultValue: ["09:00", "23:59"],
                                            format: "HH:mm",
                                            minuteStep: 15
                                        }}
                                        onOk={(t) => {
                                            const start = new Date(t[0]).getTime();
                                            const end = new Date(t[1]).getTime();
                                            setCopyWords(words.filter(w => w.id < end && w.id > start));
                                        }}
                                    />
                                    <div><Button onClick={() => {
                                        const text = copyWords.map(w => w.word + ":" + w.meaning + '\r\n').join('');
                                        navigator.clipboard.writeText(text)
                                    }}>复制</Button></div>
                                </div>
                            </Tab.Item>
                        </Tab>
                    </Tab.Item>
                </Tab> */}

            </div>
        </WordsContext.Provider>

    )
}
