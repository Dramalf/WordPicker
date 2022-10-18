import React, { useContext } from 'react'
import WordsContext from '../../WordsContext';
import { List, Input } from '@alifd/next';
import './index.scss'
export default function WordsList(props) {
    const {constraint=()=>true}=props
    const { words, setWords  } = useContext(WordsContext);
    return (
        <div className='config-setting-wrapper'>
            
        </div>
    )
}
