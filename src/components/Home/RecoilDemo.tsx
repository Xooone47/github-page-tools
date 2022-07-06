import {Radio} from 'antd';
import {useCallback} from 'react';
import {atom, selector, useRecoilState, useRecoilValue} from 'recoil';

const listState = atom({
    key: 'listState',
    default: [
        {name: 'Tom', sex: 'male'},
        {name: 'Allen', sex: 'male'},
        {name: 'Lucy', sex: 'female'},
    ],
});

const filterState = atom({
    key: 'filterState',
    default: 'all',
});

const filteredListState = selector({ // selector定义派生状态
    key: 'filteredListState',
    get: ({get}) => {
        const list = get(listState);
        const filter = get(filterState);
        return filter === 'all' ? list : list.filter(item => item.sex === filter);
    },
});

const RecoilDemo = () => {
    const [filter, setFilter] = useRecoilState(filterState);
    const filteredList = useRecoilValue(filteredListState);

    const handleFilterChange = useCallback(
        e => {
            setFilter(e.target.value);
        },
        [setFilter]
    );

    return (
        <div>
            <Radio.Group value={filter} onChange={handleFilterChange}>
                <Radio value="all">all</Radio>
                <Radio value="male">male</Radio>
                <Radio value="female">female</Radio>
            </Radio.Group>
            <ul className="list">
                {filteredList.map(item => (
                    <li key={item.name}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecoilDemo;
