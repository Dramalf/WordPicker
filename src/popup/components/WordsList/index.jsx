import React, { useContext } from 'react'
import WordsContext from '../../WordsContext';
import { List, Input } from '@alifd/next';
import './index.scss'
export default function WordsList(props) {
    const {constraint=()=>true}=props
    const { words, setWords  } = useContext(WordsContext);
    return (
        <div className='words-list'>
            <List
                size='small'
                dataSource={words.filter(constraint)}
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
    )
}
