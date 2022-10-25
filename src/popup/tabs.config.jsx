import WordsList from "./components/WordsList"
import ExportSelector from './components/ExportSelector'
import ConfigSetting from "./components/ConfigSetting"
const tabsSetting = [
    {
        title: "全部",
        comp: WordsList

    },
    {
        title: "未释义",
        comp: WordsList,
        args: {
            constraint: i => !i.meaning
        }
    },
    {
        title: "导出",
        comp: ExportSelector
    },
    {
        title: '配置',
        comp: ConfigSetting
    }
]
export default tabsSetting