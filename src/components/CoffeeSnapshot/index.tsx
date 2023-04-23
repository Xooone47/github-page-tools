import {Form, Radio, Input, InputNumber, Button, Divider, message} from 'antd';
import {useCallback, useState} from 'react';
import {isEmpty, partial} from 'lodash';
import copy from 'copy-to-clipboard';
// import styles from './index.less';


const hongbeiOptions = [
    {label: '浅', value: '浅'},
    {label: '中浅', value: '中浅'},
    {label: '中', value: '中'},
    {label: '中深', value: '中深'},
    {label: '深', value: '深'},
];

const chuliOptions = [
    // {label: '', value: ''},
    {label: '水洗', value: '水洗'},
    {label: '日晒', value: '日晒'},
    {label: '蜜处理', value: '蜜处理'},
    {label: '厌氧', value: '厌氧'},
    {label: '酒桶发酵', value: '酒桶发酵'},
];

const chongpaoOptions = [
    {label: '手冲', value: '手冲'},
    {label: '冷萃', value: '冷萃'},
];

const formInitialValues = {
    title: '',
    hongbei: '中',
    chuli: '水洗',
    chongpao: '手冲',
    kougan: '',
    xiaidu: 5,
    price: undefined,
    kezhong: undefined,
};

const calcPriceOfUnit = (price: number, kezhong: number, chongpao: string) => {
    const unit = chongpao === '冷萃' ? 20 : 15;
    const result = ((price / kezhong) * unit).toFixed(1);
    return `${result}元（${unit}g）`;
};

const texts = {
    title: (title: string, chongpao: string) => `「${chongpao}」${title}`,
    xiaidu: (xiaidu: number) => `个人喜爱度：${xiaidu}/10`,
    price: (price: number, kezhong: number, chongpao: string) => {
        return `价格：${price}元/${kezhong}g；单杯价：${calcPriceOfUnit(price, kezhong, chongpao)}`;
    },
    ps: '\n（个人记录全凭喜好，如有偏差概不负责）',
};

const JiraGenerator = () => {
    const [snapshots, setSnapshots] = useState<string[]>([]);
    const [form] = Form.useForm();
    const [preview, setPreview] = useState('');


    const onFormValuesChange = useCallback(
        (changedValues, allValues) => {
            const {
                title,
                hongbei,
                chuli,
                chongpao,
                kougan,
                xiaidu,
                price,
                kezhong,
            } = allValues;

            // 烘焙度：浅
            // 处理方式：水洗
            // 冲泡：手冲
            // 口感：相比冷萃，酸感更明显，花香突出，但茶香几乎消失
            // 个人喜爱度：5 / 10
            // 价格：46元 / 100g；单杯价：6.9元（15g）
            // （个人记录全凭喜好，如有偏差概不负责）
            const previewTexts = [
                texts.title(title, chongpao),
                `烘焙度：${hongbei}`,
                `处理方式：${chuli}`,
                `冲泡：${chongpao}`,
                `口感：${kougan}`,
                texts.xiaidu(xiaidu),
                texts.price(price || 0, kezhong || 0, chongpao),
                texts.ps,
            ];

            setPreview(previewTexts.join('\n'));
        },
        []
    );

    const handleCopy = useCallback(
        resultStr => {
            copy(resultStr);
            message.success('Copied');

        },
        []
    );

    const handleSnapshotClick = useCallback(
        () => {
            setSnapshots(prev => [preview, ...prev]);
        },
        [preview]
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
                <Form.Item name="hongbei" label="烘焙度" rules={[{required: true}]}>
                    <Radio.Group buttonStyle="solid" options={hongbeiOptions} />
                </Form.Item>
                <Form.Item name="chuli" label="处理方式" rules={[{required: true}]}>
                    <Radio.Group buttonStyle="solid" options={chuliOptions} />
                </Form.Item>
                <Form.Item name="chongpao" label="冲泡" rules={[{required: true}]}>
                    <Radio.Group buttonStyle="solid" options={chongpaoOptions} />
                </Form.Item>
                <Form.Item name="kougan" label="口感" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item name="xiaidu" label="个人喜爱度" rules={[{required: true}]}>
                    <InputNumber step={0.5} />
                </Form.Item>
                <Form.Item name="price" label="价格" rules={[{required: true}]}>
                    <InputNumber step={0.1} />
                </Form.Item>
                <Form.Item name="kezhong" label="克重" rules={[{required: true}]}>
                    <InputNumber step={1} />
                </Form.Item>
            </Form>
            <div style={{marginTop: 50, padding: 20}}>
                <div>Preview:</div>
                <pre>{preview}</pre>
                <Button style={{marginLeft: 30}} onClick={partial(handleCopy, preview)} type="primary">Copy</Button>
                <Button onClick={handleSnapshotClick} style={{marginLeft: 30}}>Snapshot</Button>
            </div>
            {/*
            <div style={{marginTop: 50, padding: 20}}>
                <h2>Result:</h2>
                <pre>{resultStr}</pre>
                <Button style={{marginLeft: 30}} onClick={partial(handleCopy, resultStr)} type="primary">Copy</Button>
                <Button onClick={handleSnapshotClick} style={{marginLeft: 30}}>Snapshot</Button>
            </div> */}

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
