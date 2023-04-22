import {Input, InputNumber, Button, List, Divider, message, Checkbox, AutoComplete} from 'antd';
import {useCallback, useState, useMemo} from 'react';
import {cloneDeep, concat, isEmpty, partial, uniq} from 'lodash';
import {useLocalStorageState} from 'ahooks';
// why unresolved
// eslint-disable-next-line import/no-unresolved
import {produce} from 'immer';
import copy from 'copy-to-clipboard';
import styles from './index.less';

// - [FE] / assignee:"xx@qq.com" cfield:"Story Points:1"

const templateRow = {
    summary: '',
    useFePrefix: true,
    assignee: '',
    storyPoint: 1,
};

type Row = typeof templateRow;

interface UseHistoryAssignees {
    (): {
        historyAssignees: string[];
        setHistoryAssignees: any;
        getHistoryAssigneeOptions: (query: string) => any[];
    }
}

const HISTORY_ASSIGNEES_KEY = 'jiraGeneratorHistoryAssignees';

const useHistoryAssignees: UseHistoryAssignees = () => {
    const [historyStorage, setHistoryStorage] = useLocalStorageState<string[]>(HISTORY_ASSIGNEES_KEY, {
        defaultValue: [],
        serializer: values => JSON.stringify(values),
        deserializer: value => JSON.parse(value),
    });

    const getHistoryAssigneeOptions = useCallback(
        query => {
            return historyStorage.filter(item => {
                if (!query) {
                    return true;
                }
                return String(item).includes(query);
            }).map(item => ({value: item}));
        },
        [historyStorage]
    );

    const setHistoryAssignees = useCallback(
        (values: string[]) => {
            const result = uniq(concat(values, historyStorage));
            setHistoryStorage(result);
        },
        [historyStorage, setHistoryStorage]
    );

    return {
        historyAssignees: historyStorage,
        setHistoryAssignees,
        getHistoryAssigneeOptions,
    };
};

const JiraGenerator = () => {
    const [list, setList] = useState<Row[]>([cloneDeep(templateRow)]);
    const [snapshots, setSnapshots] = useState<string[]>([]);

    const {setHistoryAssignees, getHistoryAssigneeOptions} = useHistoryAssignees();

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

    const validateCurrentList = useCallback(
        () => {
            const isValid = list.every(item => (item.summary && item.assignee && item.storyPoint));
            if (!isValid) {
                message.error('Summary/Assignee/StoryPoints is required');
            }
            return isValid;
        },
        [list]
    );

    const handleCopy = useCallback(
        resultStr => {
            if (!validateCurrentList()) {
                return;
            }

            copy(resultStr);
            message.success('Copied');

            const assignees = list.map(item => item.assignee);
            setHistoryAssignees(assignees);
        },
        [list, setHistoryAssignees, validateCurrentList]
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

    const handleSnapshotClick = useCallback(
        () => {
            if (!validateCurrentList()) {
                return;
            }

            setSnapshots(prev => [resultStr, ...prev]);
        },
        [resultStr, validateCurrentList]
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
                                {/* <Input
                                    value={item.assignee}
                                    onChange={partial(handleInputEvent, index, 'assignee')}
                                    style={{display: 'inline-block', width: '200px'}}
                                /> */}
                                <AutoComplete
                                    value={item.assignee}
                                    onChange={partial(handleRowChange, index, 'assignee')}
                                    style={{width: 200}}
                                    options={getHistoryAssigneeOptions(item.assignee)}
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
                <Button onClick={handleSnapshotClick} style={{marginLeft: 30}}>Snapshot</Button>
            </div>

            {!isEmpty(snapshots) && (
                <div style={{marginTop: 20, padding: 20}}>
                    <h3>Snapshots:</h3>
                    {/* eslint-disable-next-line react/no-array-index-key */}
                    {snapshots.map((item, index) => <pre key={index} style={{marginBottom: '2em'}}>{item}</pre>)}
                </div>
            )}
        </div>
    );
};

export default JiraGenerator;
