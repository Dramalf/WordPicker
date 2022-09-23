import React, { useState, useEffect, useRef } from 'react'
import { Switch, Input, Button, Form,Collapse } from '@alifd/next';
import { popupUtil } from '../util';
import './index.scss'
const FormItem = Form.Item;
const Panel = Collapse.Panel;
export default function App() {
    const [mockList, setMockList] = useState([])
    useEffect(() => {
        popupUtil.sendMessage({type:'GET_INIT_DATA'},(res)=>{
            res&&setMockList(JSON.parse(res))
        })
        // popupUtil.insertFunc(
        //     {
        //         func: popupUtil.getHistoryMOCK_LIST,
        //         callback: (injectionResults) => {
        //             for (const storage in injectionResults ){
        //                 // storage && storage.result && setMockList(JSON.parse(storage.result))
        //                 popupUtil.sendMessage({ "data": injectionResults,'type':'11kk' })
        //                 console.log(storage)
        //             }
        
        //         }
        //     }
        // );
    }, [])
    useEffect(()=>{
        popupUtil.sendMessage({id:'update',data:mockList})
    },[mockList])
    const init = async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getHistoryMOCK_LIST
        }, (res) => {
            console.log(res)
        })
    }
    const handleSwitched = (v) => {
        // document.body.style.backgroundColor = v?'blue':'red';
        // const o = { name: 'mlf', sex: 'male' }
        // const s = JSON.stringify(o);
        // const b = new Blob([s], { type: 'application/json' })
        // const u = window.URL.createObjectURL(b);
        chrome.runtime.sendMessage({
            type: 'ENABLE_PROXY', data: {
                mockList
            }
        }, (response) => {
        });
    }
    const handleConfirm = async () => {
        chrome.runtime.sendMessage({
            type: 'INSERT_SCRIPT', data: {
                targetUrl: chrome.runtime.getURL('js/content.js')
            }
        }, (response) => {
        });
        const insertURL = chrome.runtime.getURL('js/content.js');
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: async (url, urlFilter) => {
                let s = document.createElement('script');
                window.localStorage.setItem('urlFilter', urlFilter);
                const loaded = new Promise((resolve) => {
                    s.addEventListener('load', resolve);
                });
                s.src = url;
                (document.head || document.documentElement).appendChild(s);
                await loaded;

            },
            args: [insertURL, proxyUrl]
        });

    }
    const handleAddRule=(v) => {
        v.id = new Date().getTime();
        const nl = [v, ...mockList]
        setMockList(nl);
        chrome.storage.sync.set({mockList:nl});
        popupUtil.sendMessage({list:nl,type:"insert one"})
        popupUtil.insertFunc({
            func: popupUtil.setNewMockRecord,
            args: [JSON.stringify(nl)]
        })
      
    }
    const handleRemoveRule=(mock,index)=>{
        let nl=mockList.filter(m=>m.id!==mock.id)
        setMockList(nl);
        chrome.storage.sync.set({mockList:nl});
        popupUtil.sendMessage({type:"REMOVE_RULE",data:{id:index}});
        popupUtil.insertFunc({
            func: popupUtil.setNewMockRecord,
            args: [JSON.stringify(nl)]
        })
    }
    return (
        <div className='popup-wrapper'>
            <div className='popup-header'>
                <h1>Drama Proxy</h1>
                <Switch onChange={handleSwitched}/>
            </div>
            <div className='history-mock'>
            <Collapse accordion>
            {mockList && mockList.map((mock,index) => {
                    return (
                        <Panel title={mock.urlFilter} key={mock.id}>
                            <Form labelAlign='inset' colon >
                                <FormItem name="urlFilter" label="URL filter">
                                    <Input defaultValue={mock.urlFilter} />
                                </FormItem>
                                <FormItem name="targetUrl" label="Target URL" >
                                    <Input defaultValue={mock.targetUrl} />
                                </FormItem>
                                <FormItem name="mockJson" label="Mock Json" >
                                    <Input.TextArea defaultValue={mock.mockJson} aria-label="TextArea" />
                                </FormItem>
                            </Form>
                            <Button warning onClick={()=>{handleRemoveRule(mock,index)}}>delete</Button>
                        </Panel>
                    )
                })}
                </Collapse>
         
            </div>
            <div className='add-mock'>
            <Collapse defaultExpandedKeys={['add']}>
                <Panel title="add rule" key='add'>
                <Form labelAlign='inset' colon>
                    <FormItem name="urlFilter" label="URL filter" required requiredMessage="Please input your urlFilter!">
                        <Input />
                    </FormItem>
                    <FormItem name="targetUrl" label="Target URL" required requiredMessage="Please input your targetUrl!" >
                        <Input />
                    </FormItem>
                    <FormItem name="mockJson" label="Mock Json" >
                        <Input.TextArea
                            defaultValue='{"data":"mock"}'
                        />
                    </FormItem>
                    <FormItem label=" " colon={false}>
                        <Form.Submit
                            type="primary"
                            validate
                            onClick={handleAddRule}
                            style={{ marginRight: 8 }}
                        >
                            add
                        </Form.Submit>
                    </FormItem>
                </Form>
                </Panel>
                </Collapse>
            </div>
        </div>
    )
}
