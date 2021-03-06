import {Input, InputNumber, Button, List, Divider, message, Checkbox} from 'antd';
import {useCallback, useState, useMemo} from 'react';
import {cloneDeep, partial} from 'lodash';
// why unresolved
// eslint-disable-next-line import/no-unresolved
import {produce} from 'immer';
import copy from 'copy-to-clipboard';
import styles from './JiraGenerator.less';

// - [FE] / assignee:"xx@qq.com" cfield:"Story Points:1"

const templateRow = {
    summary: '',
    useFePrefix: true,
    assignee: '',
    storyPoint: 1,
};

type Row = typeof templateRow;

const JiraGenerator = () => {
    const [list, setList] = useState<Row[]>([cloneDeep(templateRow)]);


    const handleAdd = useCallback(
        () => {
            setList(prev => [...prev, cloneDeep(templateRow)]);
        },
        []
    );

    const handleRowChange = useCallback(
        (index: number, key: string, value: string | number) => {
            const newList = produce(list, draft => {
                const target = draft[index];
                target[key] = value;
            });
            setList(newList);
        },
        [list]
    );

    const handleDelete = useCallback(
        (index: number) => {
            const newList = produce(list, draft => {
                draft.splice(index, 1);
            });
            setList(newList);
        },
        [list]
    );

    const handleCopy = useCallback(
        resultStr => {
            const isValid = list.every(item => (item.summary && item.assignee && item.storyPoint));
            if (!isValid) {
                message.error('Summary/Assignee/StoryPoints is required');
                return;
            }

            copy(resultStr);
            message.success('Copied');
        },
        [list]
    );

    const handleInputEvent = useCallback(
        (index: number, key: string, e) => {
            handleRowChange(index, key, e.target.value);
        },
        [handleRowChange]
    );

    const handleCheckboxChange = useCallback(
        (index: number, key: string, e) => {
            handleRowChange(index, key, e.target.checked);
        },
        [handleRowChange]
    );

    const resultStr = useMemo(
        () => {
            const str = list.map(item => (
                // eslint-disable-next-line max-len
                `- ${item.useFePrefix ? '[FE]' : ''}${item.summary} / assignee:"${item.assignee}@shopee.com" cfield:"Story Points:${item.storyPoint}"`
            )).join('\n');
            return str;
        },
        [list]
    );

    return (
        <div style={{padding: 20}}>
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
                                {'Summary: '}
                                <Checkbox
                                    checked={item.useFePrefix}
                                    onChange={partial(handleCheckboxChange, index, 'useFePrefix')}
                                >
                                    {'[FE]'}
                                </Checkbox>
                                <Input
                                    value={item.summary}
                                    onChange={partial(handleInputEvent, index, 'summary')}
                                    style={{display: 'inline-block', width: '300px'}}
                                />
                            </div>
                            <div>
                                {'Assignee:'}
                                <Input
                                    value={item.assignee}
                                    onChange={partial(handleInputEvent, index, 'assignee')}
                                    style={{display: 'inline-block', width: '200px'}}
                                />
                                {'@shopee.com'}
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
                            <div>
                                <Button
                                    danger
                                    type="link"
                                    onClick={partial(handleDelete, index)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </List.Item>
                    );
                }}
            />
            <Button type="primary" onClick={handleAdd}>Add</Button>

            <div style={{marginTop: 50, padding: 20}}>
                <h2>Result:</h2>
                <pre>{resultStr}</pre>
                <Button style={{marginLeft: 30}} onClick={partial(handleCopy, resultStr)} type="primary">Copy</Button>
            </div>
        </div>
    );
};

export default JiraGenerator;
