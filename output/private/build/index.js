"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名
block_basekit_server_api_1.basekit.addDomainList([...feishuDm]);
block_basekit_server_api_1.basekit.addField({
    // 定义捷径的i18n语言资源
    i18n: {
        messages: {
            'zh-CN': {
                "param_attachment_label": "选择需要提取URL的附件字段",
                "param_format_label": "返回格式",
                "format_plain": "普通字符串（换行分隔）",
                "format_array": "JSON数组格式",
                "format_dict": "字典格式（键值对）",
            },
            'en-US': {
                "param_attachment_label": "Select attachment field to extract URLs",
                "param_format_label": "Return Format",
                "format_plain": "Plain string (line-separated)",
                "format_array": "JSON array format",
                "format_dict": "Dictionary format (key-value pairs)",
            },
            'ja-JP': {
                "param_attachment_label": "URLを抽出する添付ファイルフィールドを選択",
                "param_format_label": "戻り値の形式",
                "format_plain": "プレーン文字列（改行区切り）",
                "format_array": "JSON配列形式",
                "format_dict": "辞書形式（キーバリューペア）",
            },
        }
    },
    // 定义捷径的入参
    formItems: [
        {
            key: 'attachments',
            label: t('param_attachment_label'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'format',
            label: t('param_format_label'),
            component: block_basekit_server_api_1.FieldComponent.Radio,
            props: {
                options: [
                    { label: t('format_plain'), value: 'plain' },
                    { label: t('format_array'), value: 'array' },
                    { label: t('format_dict'), value: 'dict' },
                ]
            },
            validator: {
                required: false,
            }
        },
    ],
    // 定义捷径的返回结果类型 - 文本字段
    resultType: {
        type: block_basekit_server_api_1.FieldType.Text,
    },
    // formItemParams 为运行时传入的字段参数,对应字段配置里的 formItems
    execute: async (formItemParams, context) => {
        // 获取入参
        const { attachments, format } = formItemParams;
        /**
         * 为方便查看日志,使用此方法替代console.log
         */
        function debugLog(arg, showContext = false) {
            // @ts-ignore
            if (!showContext) {
                console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
                return;
            }
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg
            }), '\n');
        }
        // 入口第一行日志,展示formItemParams和context,方便调试
        debugLog('=====附件转URL开始=====v3.0', true);
        try {
            // 检查是否有附件
            if (!attachments || attachments.length === 0) {
                debugLog({ '===错误': '未选择附件' });
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: '未选择附件',
                };
            }
            debugLog({ '===附件数量': attachments.length, '===附件列表': attachments, '===格式': format });
            // 提取所有附件的URL,转成数组
            const urlArray = attachments
                .filter((attachment) => attachment && attachment.tmp_url)
                .map((attachment) => attachment.tmp_url);
            if (urlArray.length === 0) {
                debugLog({ '===错误': '所有附件都无效' });
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: '[]',
                };
            }
            // 根据用户选择的格式返回不同结果
            // 默认返回普通字符串（换行分隔）
            const formatType = format?.value || 'plain';
            let result;
            if (formatType === 'array') {
                // JSON数组格式
                result = JSON.stringify(urlArray);
            }
            else if (formatType === 'dict') {
                // 字典格式（键值对）
                const dict = urlArray.reduce((acc, url, index) => {
                    acc[`url_${index + 1}`] = url;
                    return acc;
                }, {});
                result = JSON.stringify(dict);
            }
            else {
                // 普通字符串（换行分隔）
                result = urlArray.join('\n');
            }
            debugLog({
                '===处理成功': {
                    totalAttachments: attachments.length,
                    validAttachments: urlArray.length,
                    formatType,
                    resultPreview: result.slice(0, 200) + '...'
                }
            });
            // 返回成功结果 - 文本字段返回字符串
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: result,
            };
        }
        catch (e) {
            // 捕获未知错误
            debugLog({
                '===999 未知错误': String(e)
            });
            // 返回错误
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNEc7QUFFNUcsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLDJCQUEyQjtBQUMzQixrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUVyQyxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLGdCQUFnQjtJQUNoQixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUU7Z0JBQ1Asd0JBQXdCLEVBQUUsZ0JBQWdCO2dCQUMxQyxvQkFBb0IsRUFBRSxNQUFNO2dCQUM1QixjQUFjLEVBQUUsYUFBYTtnQkFDN0IsY0FBYyxFQUFFLFVBQVU7Z0JBQzFCLGFBQWEsRUFBRSxXQUFXO2FBQzNCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLHdCQUF3QixFQUFFLHlDQUF5QztnQkFDbkUsb0JBQW9CLEVBQUUsZUFBZTtnQkFDckMsY0FBYyxFQUFFLCtCQUErQjtnQkFDL0MsY0FBYyxFQUFFLG1CQUFtQjtnQkFDbkMsYUFBYSxFQUFFLHFDQUFxQzthQUNyRDtZQUNELE9BQU8sRUFBRTtnQkFDUCx3QkFBd0IsRUFBRSx3QkFBd0I7Z0JBQ2xELG9CQUFvQixFQUFFLFFBQVE7Z0JBQzlCLGNBQWMsRUFBRSxnQkFBZ0I7Z0JBQ2hDLGNBQWMsRUFBRSxVQUFVO2dCQUMxQixhQUFhLEVBQUUsZ0JBQWdCO2FBQ2hDO1NBQ0Y7S0FDRjtJQUNELFVBQVU7SUFDVixTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLEtBQUssRUFBRSxDQUFDLENBQUMsd0JBQXdCLENBQUM7WUFDbEMsU0FB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