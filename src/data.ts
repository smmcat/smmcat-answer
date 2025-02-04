export type Answer = {
    /** 题目信息 */
    msg: string,
    /** 题目标题 */
    guild: string,
    /** 题目配图 */
    pic: string,
    /** 答题列表 */
    content: AnswerItem
}

/** 答题列表 */
export type AnswerItem = {
    /** 题目id */
    [keys: number]: {
        /** 题目id */
        id: number,
        /** 题目得分 */
        mark: number,
        /** 题目问题 */
        ask: string,
        /** 提示 */
        more: {
            /** 成功提示 */
            get?: string[],
            /** 失败提示 */
            lose?: string[]
        },
        /** 正确答案 */
        susses: string[],
        /** 题目配图 */
        pic?: string,
        /** 题目选项 */
        column: string[]
    }
}


export const testlocalAnswerLsit: Answer = {
    msg: "本地演示题目",
    guild: "B站鬼畜区送分题",
    pic: "https://smmcat.cn/run/answer/6.png",
    content: {
        "0": {
            "id": 0,
            "mark": 1,
            "ask": "森之妖精是谁？",
            "more": {
                "get": [
                    "[tip!] 比利王就是森之妖精，这是送分了！"
                ]
            },
            "susses": [
                "比利海灵顿"
            ],
            "pic": "https://smmcat.cn/run/answer/item/%E6%AF%94%E5%88%A9.png",
            "column": [
                "比利海灵顿",
                "木吉",
                "贝奥兰迪",
                "井上"
            ]
        },
        "1": {
            "id": 1,
            "mark": 1,
            "ask": "图中人物是谁？",
            "more": {},
            "susses": [
                "贝奥兰迪"
            ],
            "pic": "https://smmcat.cn/run/answer/item/贝奥兰迪.png",
            "column": [
                "贝奥兰迪",
                "van样",
                "比利海灵顿",
                "木吉",
                "香蕉君"
            ]
        },
        "2": {
            "id": 2,
            "mark": 1,
            "ask": "图中人物是谁？",
            "more": {},
            "susses": [
                "比利海灵顿"
            ],
            "pic": "https://smmcat.cn/run/answer/item/比利.png",
            "column": [
                "贝奥兰迪",
                "van样",
                "比利海灵顿",
                "木吉",
                "香蕉君"
            ]
        },
        "3": {
            "id": 3,
            "mark": 1,
            "ask": "图中人物是谁？",
            "more": {},
            "susses": [
                "木吉"
            ],
            "pic": "https://smmcat.cn/run/answer/item/木吉.png",
            "column": [
                "贝奥兰迪",
                "van样",
                "比利海灵顿",
                "木吉",
                "香蕉君"
            ]
        },
        "4": {
            "id": 4,
            "mark": 1,
            "ask": "图中人物是谁？",
            "more": {},
            "susses": [
                "van样"
            ],
            "pic": "https://smmcat.cn/run/answer/item/van样.png",
            "column": [
                "贝奥兰迪",
                "van样",
                "比利海灵顿",
                "木吉",
                "香蕉君"
            ]
        },
        "5": {
            "id": 5,
            "mark": 1,
            "ask": "图中人物是谁？",
            "more": {},
            "susses": [
                "香蕉君"
            ],
            "pic": "https://smmcat.cn/run/answer/item/香蕉君.png",
            "column": [
                "贝奥兰迪",
                "van样",
                "比利海灵顿",
                "木吉",
                "香蕉君"
            ]
        },
        "6": {
            "id": 6,
            "mark": 1,
            "ask": "van样什么形态下最弱？",
            "more": {
                "get": [
                    "[yes!] 更衣室与猎天使魔男贝奥兰迪战斗时的只穿紫色内裤的无装甲形态，也是最弱的"
                ]
            },
            "susses": [
                "紫色内裤无装甲形态"
            ],
            "column": [
                "紫色内裤无装甲形态",
                "皮革内裤黑色面具形态",
                "TDN链甲+皮裤的轻TDN装甲",
                "MASTER+军帽黑暗形态",
                "DDF天使形态"
            ]
        },
        "7": {
            "id": 7,
            "mark": 1,
            "ask": "妖精王是谁？",
            "more": {},
            "susses": [
                "奇奇拉鲁"
            ],
            "column": [
                "比利海灵顿",
                "魔男",
                "奇奇拉鲁",
                "van达克霍姆"
            ]
        },
        "8": {
            "id": 8,
            "mark": 1,
            "ask": "比利王的必杀绝技是什么？",
            "more": {},
            "susses": [
                "炒饭烧"
            ],
            "column": [
                "炒饭烧",
                "王の提肛",
                "鬼步",
                "神の救济"
            ]
        },
        "9": {
            "id": 9,
            "mark": 1,
            "ask": "因为没有执行元首的命令而让元首十分愤怒的人是",
            "more": {
                "get": [
                    "[yes!] 没有足够兵力执行命令直接引发了元首愤怒这一片段的斯坦纳（屎蛋）"
                ]
            },
            "susses": [
                "斯坦纳"
            ],
            "pic": "https://smmcat.cn/run/answer/item/元首.png",
            "column": [
                "斯坦纳",
                "戈培尔",
                "地图君",
                "飞过来"
            ]
        },
        "10": {
            "id": 10,
            "mark": 1,
            "ask": "圣地亚哥世界观中，不使用金坷垃的小麦须根最多能长到多长？",
            "more": {
                "get": [
                    "小麦须根最长一米半 用了金坷垃能变成两米 参见探索与发现篇"
                ]
            },
            "susses": [
                "两米"
            ],
            "column": [
                "半米",
                "一米",
                "一米半",
                "两米"
            ]
        },
        "11": {
            "id": 11,
            "mark": 1,
            "ask": "金坷垃原版中，没戴过眼镜出场的角色有？",
            "more": {
                "get": [
                    "[tip!] 注意这里是问没戴过眼镜的角色 美美和三个威廉姓氏（威廉伯爵 威廉博士 金坷垃封面上的威廉boss）都没有戴过眼镜 非非有戴眼镜 日日也有戴眼镜只不过被东仙一拳糊脸那个时候打掉了，\n因为无法拯救的画质原因很多人注意不到"
                ]
            },
            "susses": [
                "非非"
            ],
            "column": [
                "美美",
                "非非",
                "日日",
                "威廉博士"
            ]
        },
        "12": {
            "id": 12,
            "mark": 1,
            "ask": "老中医专治什么？",
            "more": {},
            "susses": [
                "坐骨神经痛"
            ],
            "pic": "https://smmcat.cn/run/answer/item/博士.png",
            "column": [
                "提乾涉经",
                "坐骨神经痛",
                "风湿骨病",
                "咳喘"
            ]
        },
        "13": {
            "id": 13,
            "mark": 1,
            "ask": "最后祝你_____，再见",
            "more": {},
            "susses": [
                "身体健康"
            ],
            "pic": "https://smmcat.cn/run/answer/item/博士.png",
            "column": [
                "提乾涉经",
                "身体健康",
                "万事如意",
                "恭喜FA财"
            ]
        },
        "14": {
            "id": 14,
            "mark": 1,
            "ask": "有本人授权音源的鬼畜明星是？",
            "more": {},
            "susses": [
                "葛平"
            ],
            "column": [
                "葛平",
                "雷军",
                "庞麦郎",
                "波澜哥"
            ]
        },
        "15": {
            "id": 15,
            "mark": 1,
            "ask": "增员操有几个阶段形态？",
            "more": {
                "get": [
                    "[yes!] C增员操六个形态 第一个是右手动 第二个两手一起 第三个左脚也跟着动 第四个手脚并用 第五个头也跟着摇 第六个雨刷模式"
                ]
            },
            "susses": [
                "六个"
            ],
            "column": [
                "四个",
                "五个",
                "六个",
                "七个"
            ]
        },
        "16": {
            "id": 16,
            "mark": 1,
            "ask": "炎先知最擅长什么？",
            "more": {
                "get": [
                    "[yes!] 五指神功的第三式 摇摆神功！"
                ]
            },
            "susses": [
                "五指神功第三式"
            ],
            "column": [
                "五指神功第一式",
                "五指神功第二式",
                "五指神功第三式",
                "五指神功第四式"
            ]
        },
        "17": {
            "id": 17,
            "mark": 1,
            "ask": "破恨南飞是谁的素材剪辑组成的名句？",
            "more": {
                "get": [
                    "[tip!] B破恨南飞是梁逸峰的念诗剪辑组成的"
                ]
            },
            "susses": [
                "梁逸峰"
            ],
            "column": [
                "大力哥",
                "梁逸峰",
                "金立哥",
                "小红帽"
            ]
        },
        "18": {
            "id": 18,
            "mark": 1,
            "ask": "杰哥不要本篇中提到的全国妇幼保护专线电话是？",
            "more": {
                "get": [
                    "[yes!] 就算没留意剩下的选项那么奇葩也没人选吧kora！"
                ]
            },
            "susses": [
                "113"
            ],
            "column": [
                "113",
                "114",
                "810",
                "364"
            ]
        },
        "19": {
            "id": 19,
            "mark": 1,
            "ask": "KBC是谁的外号？",
            "more": {
                "get": [
                    "[tip!] KBC=KeyBoardCrusher=键盘破坏者=德国boy"
                ]
            },
            "susses": [
                "德国boy"
            ],
            "column": [
                "德国boy",
                "小黄",
                "元首",
                "阿凡提"
            ]
        },
        "20": {
            "id": 20,
            "mark": 1,
            "ask": "哪个人物不是元首本人的空耳中提到的？",
            "more": {
                "get": [
                    "[tip!] 茶叶蛋是被枪决的时候那个人吼出来的空耳"
                ]
            },
            "susses": [
                "茶叶蛋"
            ],
            "column": [
                "俺妹",
                "菲律宾酋长",
                "茶叶蛋",
                "阿凡提"
            ]
        }
    }
}