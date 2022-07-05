import {Input, InputNumber, Button, List, Divider} from 'antd';
import {useCallback, useState} from 'react';
import {cloneDeep, partial} from 'lodash';
// why unresolved
// eslint-disable-next-line import/no-unresolved
import {produce} from 'immer';
import styles from './JiraGenerator.less';

// - [FE] / assignee:"xx@qq.com" cfield:"Story Points:1"

const templateRow = {
    summary: '',
    assignee: '',
    storyPoint: 1,
};

type Row = typeof templateRow;

const JiraGenerator = () => {
    const [list, setList] = useState<Row[]>([cloneDeep(templateRow)]);
    const [result, setResult] = useState<string[]>([]);


    const handleAdd = useCallback(
        () => {
            setList(prev => [...prev, cloneDeep(templateRow)]);
        },
        []
    );

    const handleRowChange = useCallback(
        (index: number, key: string, value: string | number) => {
            const result = produce(list, draft => {
                const target = draft[index];
                target[key] = value;
            });
            setList(result);
        },
        [list]
    );

    const handleInputEvent = useCallback(
        (index: number, key: string, e) => {
            handleRowChange(index, key, e.target.value);
        },
        [handleRowChange]
    );

    const handleGenerateClick = useCallback(
        () => {
            const str = list.map(item => (
                // eslint-disable-next-line max-len
                `- [FE]${item.summary} / assignee:"${item.assignee}@shopee.com" cfield:"Story Points:${item.storyPoint}"`
            )).join('\n');
            setResult(prev => [str, ...prev]);
        },
        [list]
    );

    return (
        <div>
            <Divider orientation="left">Jira Generator</Divider>
            <List
                dataSource={list}
                // eslint-disable-next-line react/jsx-no-bind
                renderItem={(item, index) => {
                    return (
                        <List.Item
                            key={index}
                            className={styles.list}
                        >
                            <div>
                                Summary:
                                <Input
                                    value={item.summary}
                                    onChange={partial(handleInputEvent, index, 'summary')}
                                    style={{display: 'inline-block', width: '300px'}}
                                />
                            </div>
                            <div>
                                Assignee:
                                <Input
                                    value={item.assignee}
                                    onChange={partial(handleInputEvent, index, 'assignee')}
                                    style={{display: 'inline-block', width: '200px'}}
                                />
                                @shopee.com
                            </div>
                            <div>
                                {'Story Points:'}
                                <InputNumber
                                    value={item.storyPoint}
                                    onChange={partial(handleRowChange, index, 'storyPoint')}
                                    style={{display: 'inline-block', width: '80px'}}
                                    step={0.5}
                                />
                            </div>
                        </List.Item>
                    );
                }}
            />
            <Button type="primary" onClick={handleAdd}>Add</Button>
            <Button type="primary" onClick={handleGenerateClick} style={{marginLeft: 20}}>Generate</Button>

            <div style={{marginTop: 50, padding: 20}}>
                <h2>Result:</h2>
                <List
                    dataSource={result}
                    // eslint-disable-next-line react/jsx-no-bind
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <pre>{item}</pre>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default JiraGenerator;
