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
                "param_attachment_label": "选择附件字段",
                "res_url_label": "附件URL",
                "res_name_label": "文件名称",
                "res_size_label": "文件大小(KB)",
                "res_type_label": "文件类型",
            },
            'en-US': {
                "param_attachment_label": "Select Attachment Field",
                "res_url_label": "Attachment URL",
                "res_name_label": "File Name",
                "res_size_label": "File Size(KB)",
                "res_type_label": "File Type",
            },
            'ja-JP': {
                "param_attachment_label": "添付ファイルフィールドを選択",
                "res_url_label": "添付ファイルURL",
                "res_name_label": "ファイル名",
                "res_size_label": "ファイルサイズ(KB)",
                "res_type_label": "ファイルタイプ",
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
    ],
    // 定义捷径的返回结果类型
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/link.svg',
            },
            properties: [
                {
                    key: 'id',
                    isGroupByKey: true,
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: 'id',
                    hidden: true,
                },
                {
                    key: 'url',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('res_url_label'),
                    primary: true,
                },
                {
                    key: 'name',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('res_name_label'),
                },
                {
                    key: 'size',
                    type: block_basekit_server_api_1.FieldType.Number,
                    label: t('res_size_label'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    }
                },
                {
                    key: 'type',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('res_type_label'),
                },
            ],
        },
    },
    // formItemParams 为运行时传入的字段参数,对应字段配置里的 formItems
    execute: async (formItemParams, context) => {
        // 获取入参
        const { attachments } = formItemParams;
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
        debugLog('=====附件转URL开始=====v1.0', true);
        try {
            // 检查是否有附件
            if (!attachments || attachments.length === 0) {
                debugLog({ '===错误': '未选择附件' });
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: {
                        id: Date.now().toString(),
                        url: '未选择附件',
                        name: '-',
                        size: 0,
                        type: '-',
                    },
                };
            }
            // 获取第一个附件
            const attachment = attachments[0];
            debugLog({ '===附件信息': attachment });
            // 检查附件是否有效
            if (!attachment || !attachment.tmp_url) {
                debugLog({ '===错误': '附件无效或缺少URL' });
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
                    data: {
                        id: Date.now().toString(),
                        url: '附件无效',
                        name: attachment?.name || '-',
                        size: 0,
                        type: attachment?.type || '-',
                    },
                };
            }
            // 提取附件信息
            const attachmentUrl = attachment.tmp_url || '';
            const attachmentName = attachment.name || '未知文件';
            const attachmentSize = attachment.size || 0;
            const attachmentType = attachment.type || 'unknown';
            // 计算文件大小(转换为KB)
            const sizeInKB = attachmentSize / 1024;
            debugLog({
                '===处理成功': {
                    url: attachmentUrl.slice(0, 100) + '...',
                    name: attachmentName,
                    size: sizeInKB,
                    type: attachmentType,
                }
            });
            // 返回成功结果
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    id: attachmentUrl, // 使用URL作为唯一ID
                    url: attachmentUrl,
                    name: attachmentName,
                    size: sizeInKB,
                    type: attachmentType,
                },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNkg7QUFFN0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLDJCQUEyQjtBQUMzQixrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUVyQyxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLGdCQUFnQjtJQUNoQixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUU7Z0JBQ1Asd0JBQXdCLEVBQUUsUUFBUTtnQkFDbEMsZUFBZSxFQUFFLE9BQU87Z0JBQ3hCLGdCQUFnQixFQUFFLE1BQU07Z0JBQ3hCLGdCQUFnQixFQUFFLFVBQVU7Z0JBQzVCLGdCQUFnQixFQUFFLE1BQU07YUFDekI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1Asd0JBQXdCLEVBQUUseUJBQXlCO2dCQUNuRCxlQUFlLEVBQUUsZ0JBQWdCO2dCQUNqQyxnQkFBZ0IsRUFBRSxXQUFXO2dCQUM3QixnQkFBZ0IsRUFBRSxlQUFlO2dCQUNqQyxnQkFBZ0IsRUFBRSxXQUFXO2FBQzlCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLHdCQUF3QixFQUFFLGdCQUFnQjtnQkFDMUMsZUFBZSxFQUFFLFdBQVc7Z0JBQzVCLGdCQUFnQixFQUFFLE9BQU87Z0JBQ3pCLGdCQUFnQixFQUFFLGFBQWE7Z0JBQy9CLGdCQUFnQixFQUFFLFNBQVM7YUFDNUI7U0FDRjtLQUNGO0lBQ0QsVUFBVTtJQUNWLFNBQVMsRUFBRTtRQUNUO1lBQ0UsR0FBRyxFQUFFLGFBQWE7WUFDbEIsS0FBSyxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQztZQUNsQyxT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