import React, { useContext } from 'react'
import WordsContext from '../../WordsContext';
import { Button, DatePicker2, Tab, Checkbox, NumberPicker } from '@alifd/next';
import './index.scss'
const { RangePicker } = DatePicker2;

export default function ExportSelector(props) {
    const { words,setCopyWords,copyWords } = useContext(WordsContext);
    return (
        <Tab tabPosition='left'
        >
            <Tab.Item title="按数量" >
                <div className='tab3'>

                    <div> 最近<NumberPicker style={{ width: '40px' }} defaultValue={3} min={1} onChange={(v) => {
                        setCopyWords(words.slice(0, v));
                    }} type="inline"></NumberPicker>条（共{words.length}条）</div>
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
    )
}
