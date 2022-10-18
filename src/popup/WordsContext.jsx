import {createContext} from 'react';
const props={
    words:[],
    copyWords:[],
    setWords:()=>{},
    setCopyWords:()=>{}
}
export default createContext(props);