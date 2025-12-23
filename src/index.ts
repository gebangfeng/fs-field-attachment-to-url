import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名
basekit.addDomainList([...feishuDm]);

basekit.addField({
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
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'format',
      label: t('param_format_label'),
      component: FieldComponent.Radio,
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
    type: FieldType.Text,
  },
  // formItemParams 为运行时传入的字段参数,对应字段配置里的 formItems
  execute: async (formItemParams, context) => {
    // 获取入参
    const { attachments, format } = formItemParams;

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
    debugLog('=====附件转URL开始=====v3.0', true);

    try {
      // 检查是否有附件
      if (!attachments || attachments.length === 0) {
        debugLog({ '===错误': '未选择附件' });
        return {
          code: FieldCode.Success,
          data: '未选择附件',
        };
      }

      debugLog({ '===附件数量': attachments.length, '===附件列表': attachments, '===格式': format });

      // 提取所有附件的URL,转成数组
      const urlArray = attachments
        .filter((attachment: any) => attachment && attachment.tmp_url)
        .map((attachment: any) => attachment.tmp_url);

      if (urlArray.length === 0) {
        debugLog({ '===错误': '所有附件都无效' });
        return {
          code: FieldCode.Success,
          data: '[]',
        };
      }

      // 根据用户选择的格式返回不同结果
      // 默认返回普通字符串（换行分隔）
      const formatType = format?.value || 'plain';
      let result: string;

      if (formatType === 'array') {
        // JSON数组格式
        result = JSON.stringify(urlArray);
      } else if (formatType === 'dict') {
        // 字典格式（键值对）
        const dict = urlArray.reduce((acc: any, url: string, index: number) => {
          acc[`url_${index + 1}`] = url;
          return acc;
        }, {});
        result = JSON.stringify(dict);
      } else {
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
        code: FieldCode.Success,
        data: result,
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
