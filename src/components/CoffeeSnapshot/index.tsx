import {Form, Radio, Input, InputNumber, Button, Divider, message, Typography} from 'antd';
import {useCallback, useState} from 'react';
import {isEmpty, partial} from 'lodash';
import copy from 'copy-to-clipboard';
// import styles from './index.less';


const bakingOptions = [
    {label: '浅', value: '浅'},
    {label: '中浅', value: '中浅'},
    {label: '中', value: '中'},
    {label: '中深', value: '中深'},
    {label: '深', value: '深'},
];

const handleOptions = [
    {label: '水洗', value: '水洗'},
    {label: '日晒', value: '日晒'},
    {label: '蜜处理', value: '蜜处理'},
    {label: '厌氧', value: '厌氧'},
    {label: '酒桶发酵', value: '酒桶发酵'},
];

const brewOptions = [
    {label: '手冲', value: '手冲'},
    {label: '冷萃', value: '冷萃'},
];

const formInitialValues = {
    title: '',
    bakingDegree: '中',
    handle: '水洗',
    brew: '手冲',
    taste: '',
    preference: 5,
    price: undefined,
    weight: undefined,
};

const calcPriceOfUnit = (price: number, weight: number, brew: string) => {
    const unit = brew === '冷萃' ? 20 : 15;
    const result = ((price / weight) * unit).toFixed(1);
    return `${result}元（${unit}g）`;
};

const texts = {
    title: (title: string, brew: string) => `「${brew}」${title}`,
    preference: (preference: number) => `个人喜爱度：${preference}/10`,
    price: (price: number, weight: number, brew: string) => {
        return `价格：${price}元/${weight}g；单杯价：${calcPriceOfUnit(price, weight, brew)}`;
    },
    ps: '\n（个人记录全凭喜好，如有偏差概不负责）',
};

const JiraGenerator = () => {
    const [snapshots, setSnapshots] = useState<string[]>([]);
    const [form] = Form.useForm();
    const [preview, setPreview] = useState('');

    const {validateFields} = form;


    const onFormValuesChange = useCallback(
        (changedValues, allValues) => {
            const {
                title,
                bakingDegree,
                handle,
                brew,
                taste,
                preference,
                price,
                weight,
            } = allValues;

            // 烘焙度：浅
            // 处理方式：水洗
            // 冲泡：手冲
            // 口感：相比冷萃，酸感更明显，花香突出，但茶香几乎消失
            // 个人喜爱度：5 / 10
            // 价格：46元 / 100g；单杯价：6.9元（15g）
            // （个人记录全凭喜好，如有偏差概不负责）
            const previewTexts = [
                texts.title(title, brew),
                `烘焙度：${bakingDegree}`,
                `处理方式：${handle}`,
                `冲泡：${brew}`,
                `口感：${taste}`,
                texts.preference(preference),
                texts.price(price || 0, weight || 0, brew),
                texts.ps,
            ];

            setPreview(previewTexts.join('\n'));
        },
        []
    );

    const handleCopy = useCallback(
        async resultStr => {
            try {
                await validateFields();
                copy(resultStr);
                message.success('Copied');
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log(e);
            }
        },
        [validateFields]
    );

    const handleSnapshotClick = useCallback(
        async () => {
            try {
                await validateFields();
                setSnapshots(prev => [preview, ...prev]);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log(e);
            }
        },
        [preview, validateFields]
    );

    return (
        <div style={{padding: 20}}>
            <Divider orientation="left">Coffee Snapshot</Divider>
            <Form
                form={form}
                layout="vertical"
                initialValues={formInitialValues}
                onValuesChange={onFormValuesChange}
            >
                <Form.Item name="title" label="标题" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item name="bakingDegree" label="烘焙度" rules={[{required: true}]}>
                    <Radio.Group buttonStyle="solid" options={bakingOptions} />
                </Form.Item>
                <Form.Item name="handle" label="处理方式" rules={[{required: true}]}>
                    <Radio.Group buttonStyle="solid" options={handleOptions} />
                </Form.Item>
                <Form.Item name="brew" label="冲泡" rules={[{required: true}]}>
                    <Radio.Group buttonStyle="solid" options={brewOptions} />
                </Form.Item>
                <Form.Item name="taste" label="口感" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item name="preference" label="个人喜爱度" rules={[{required: true}]}>
                    <InputNumber step={0.5} />
                </Form.Item>
                <Form.Item name="price" label="价格" rules={[{required: true}]}>
                    <InputNumber step={0.1} />
                </Form.Item>
                <Form.Item name="weight" label="克重" rules={[{required: true}]}>
                    <InputNumber step={1} />
                </Form.Item>
            </Form>
            <div style={{marginTop: 50, padding: 20}}>
                <Typography.Title level={4}>Preview</Typography.Title>
                <pre>{preview}</pre>
                <Button style={{marginLeft: 30}} onClick={partial(handleCopy, preview)} type="primary">Copy</Button>
                <Button onClick={handleSnapshotClick} style={{marginLeft: 30}}>Snapshot</Button>
            </div>

            {!isEmpty(snapshots) && (
                <div style={{marginTop: 20, padding: 20}}>
                    <Typography.Title level={4}>Snapshots:</Typography.Title>
                    {/* eslint-disable-next-line react/no-array-index-key */}
                    {snapshots.map((item, index) => <pre key={index} style={{marginBottom: '2em'}}>{item}</pre>)}
                </div>
            )}
        </div>
    );
};

export default JiraGenerator;
