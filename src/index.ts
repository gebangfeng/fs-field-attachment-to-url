import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名
basekit.addDomainList([...feishuDm]);

basekit.addField({
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
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: true,
      }
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/link.svg',
      },
      properties: [
        {
          key: 'id',
          isGroupByKey: true,
          type: FieldType.Text,
          label: 'id',
          hidden: true,
        },
        {
          key: 'url',
          type: FieldType.Text,
          label: t('res_url_label'),
          primary: true,
        },
        {
          key: 'name',
          type: FieldType.Text,
          label: t('res_name_label'),
        },
        {
          key: 'size',
          type: FieldType.Number,
          label: t('res_size_label'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          }
        },
        {
          key: 'type',
          type: FieldType.Text,
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
    function debugLog(arg: any, showContext = false) {
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
          code: FieldCode.Success,
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
          code: FieldCode.Success,
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
        code: FieldCode.Success,
        data: {
          id: attachmentUrl, // 使用URL作为唯一ID
          url: attachmentUrl,
          name: attachmentName,
          size: sizeInKB,
          type: attachmentType,
        },
      };
    } catch (e) {
      // 捕获未知错误
      debugLog({
        '===999 未知错误': String(e)
      });

      // 返回错误
      return {
        code: FieldCode.Error,
      };
    }
  },
});

export default basekit;
