import { Context, Schema, h } from 'koishi'
import { } from 'koishi-plugin-monetary'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import { Answer, testlocalAnswerLsit } from './data'

export const name = 'smmcat-answer'

export interface Config {
  watingTime: number;
  watingPlay: number;
  answersNumOfRush: number
  debug: boolean;
  atQQ: boolean;
  useLocal: boolean
  localPath: string
}

const inject = ['monetary'];

const usage = `
目前题目来源于B站，由于部分题目只有正确答案，没有选项；采用 ChatGPT 智能补充选项 (效果挺差！)


如果您有题目和内容。欢迎联系我们！让我们一起为答题系统越做越好！
答题有您更精彩！[加入QQ群](https://qm.qq.com/q/tLNugrQ7gO)
`;

export const Config: Schema<Config> = Schema.object({
  watingTime: Schema.number().default(60000).description('每轮出题等待的秒数'),
  watingPlay: Schema.number().default(10000).description('每次回答等待的秒数'),
  debug: Schema.boolean().default(false).description('控制台显示更多信息'),
  atQQ: Schema.boolean().default(false).description('艾特QQ [兼容机制]'),
  useLocal: Schema.boolean().default(false).description('使用本地题库 (否则使用云端题库)'),
  localPath: Schema.string().default('./data/answerData').description('本地题库存放目录'),
  answersNumOfRush: Schema.number().default(10).description('默认抢答题每轮数量')
})

export function apply(ctx: Context, config: Config) {

  // 获取随机题目
  async function getRandomAnswer({ sed = '1', num = config.answersNumOfRush }) {
    return ctx.http.get('http://1.15.99.237:8081/rom', {
      params: { sed, num }
    });
  }
  // 获取题目列表
  async function getAnswerMenu() {
    return ctx.http.get('http://1.15.99.237:8081/menu');
  }

  const answerClass = {
    playUser: {},
    guildList: {},
    userList: {},
    localAnswer: {},
    answerMenu: [],
    // 初始化
    async init() {
      if (!config.useLocal) {
        // 获取云端题库列表
        const result = await getAnswerMenu();
        config.debug && console.log(result.data);
        this.answerMenu = result.data;
      } else {
        // 获取本地题库列表
        const upath = path.join(ctx.baseDir, config.localPath)
        if (!fs.existsSync(upath)) {
          fs.mkdirSync(upath, { recursive: true })
          fs.writeFileSync(path.join(upath, './test.json'), JSON.stringify(testlocalAnswerLsit), 'utf-8')
          console.log(`检测到您可能是首次使用本地答题功能，已给在${path.join(upath, './test.json')}您生成本地测试题目。\n` +
            `如需增量可以按照 test.json 文件的格式进行添加内容`);
        }
        const dirList = fs.readdirSync(upath).filter(file =>
          path.extname(file).toLowerCase() === '.json'
        )
        const dict = { ok: 0, err: 0 }
        const temp: { [keys: string]: Answer } = {}
        const tempMenu = []
        const eventList = dirList.map((item) => {
          return new Promise((resolve, reject) => {
            try {
              const data: Answer = JSON.parse(fs.readFileSync(path.join(upath, item), 'utf-8'))
              temp[data.guild] = data
              tempMenu.push({
                len: Object.keys(data.content).length,
                guild: data.guild,
                msg: data.msg,
                pic: data.pic
              })
              dict.ok++
              resolve(true)
            } catch (error) {
              dict.err++
              resolve(false)
            }
          })
        })
        await Promise.all(eventList)
        this.localAnswer = temp
        this.answerMenu = tempMenu
        config.debug && console.log(`[smmcat-answer]:本地题库加载完成。成功${dict.ok}个,失败:${dict.err}个`);
      }
    },
    // 获取群信息
    getGuildList(guildId) {
      if (!guildId)
        return null;
      if (!this.guildList[guildId]) {
        this.guildList[guildId] = {
          playIndex: -1,
          isUse: false,
          timer: null,
          playUser: {},
          // 初始化群信息
          initGuildInfo() {
            const playUser = Object.keys(this.playUser);
            if (playUser.length) {
              playUser.forEach(item => {
                answerClass.playUser[item] = false;
              });
            }
            this.timer();
            this.isUse = false; // 是否进行游戏
            this.playIndex = -1; // 题目下标
            this.timer = null; // 重置定时器
            this.playUser = {};
          },
          async startAnswer(guild = '') {
            if (this.isUse)
              return { code: false, msg: '正在游戏！请不要重复开启' };
            if (!config.useLocal) {
              const type = await this.createAnswerUseNetwork(guild);
              if (!type.code) return type
            } else {
              const type = await this.createAnswerUseLocal(guild);
              if (!type) return { code: false, msg: '没有找到对应题目' };
            }
            this.isUse = true;
            return { code: true, msg: `${this.pic ? h.image(this.pic) : ''}\n题库来自：${this.answerGuild}\n一共${this.answerItem.length}道题。\n现在开始进行游戏，请听题` };
          },
          // 获取网络题目
          async createAnswerUseNetwork(guild = '') {
            const answerMenu = answerClass.answerMenu;
            if (!guild) {
              // 随机抽选一个题目
              this.answerMenu = answerMenu[random(0, answerMenu.length)];
            } else {
              const select = answerMenu.find((item) => item.guild === guild)
              this.answerMenu = select;
            }
            if (!this.answerMenu) return { code: false, msg: '没有找到对应题目' };
            try {
              // 获取网络题目
              const result = await getRandomAnswer({ sed: this.answerMenu.id });
              if (!result)
                return { code: false, msg: '获取网络题目失败' };
              // 赋值群内对象
              this.pic = result.data.pic ? result.data.pic : null; // 题目图片
              this.answerGuild = result.data.guild; // 题目范围
              this.answerMsg = result.data.msg; // 题目信息
              this.answerItem = result.data.content; // 题目内容
              this.beginTime = +new Date(); // 时间戳
              config.debug && console.log(this.answerItem);
              return { code: true, msg: '' }
            }
            catch (error) {
              return { code: false, msg: '网络问题，未知错误' };
            }
          },
          // 获取本地题目
          createAnswerUseLocal(guild = '') {
            const answerMenu = answerClass.answerMenu;
            const answerList: { [keys: string]: Answer } = answerClass.localAnswer
            let result = null
            if (!guild) {
              const selectMenu = answerMenu[random(0, answerMenu.length)]
              result = answerList[selectMenu.guild]
            } else {
              result = answerList[guild]
            }
            if (!result) return false
            const content = getFreeList(Object.values(result.content)).slice(0, config.answersNumOfRush).filter(item => item)
            content.forEach(item => item.column = getFreeList(item.column))
            this.pic = result.pic ? result.pic : null; // 题目图片
            this.answerGuild = result.guild; // 题目范围
            this.answerMsg = result.msg; // 题目信息
            this.answerItem = content; // 题目内容
            this.beginTime = +new Date(); // 时间戳
            config.debug && console.log(this.answerItem);
            return true
          },
          // 结果格式化
          answerRusultFormat() {
            return `
${this.pic ? h.image(this.pic) : ''}
答题结束 结算统计
\n
题目：${this.answerGuild}
详情：${this.answerMsg}
参与人数：${Object.keys(this.playUser).length}
总答对次数：${Object.values(this.playUser).reduce((a: any, c: any) => a + c.success, 0)}
总答错次数：${Object.values(this.playUser).reduce((a: any, c: any) => a + c.error, 0)}
`;
          },
          /**
           * 持续播放题目
           */
          async nextAnswerPlayByGuildId(session) {
            let at = '';
            if (config.atQQ) {
              at = `<at id="${session.userId}" />`;
            }
            this.timer && this.timer();
            ++this.playIndex;
            if (this.playIndex >= this.answerItem.length) {
              const msg = this.answerRusultFormat();
              this.initGuildInfo();
              await session.send(at + '所有题目发送完毕，答题结束');
              await session.send(msg);
              return;
            }
            this.timer = ctx.setTimeout(() => {
              this.nextAnswerPlayByGuildId(session);
            }, config.watingTime);
            config.debug && console.log(`答案：` + this.answerItem[this.playIndex].susses);
            await session.send(at + this.answerPlayFormat(this.answerItem[this.playIndex], this.playIndex));
          },
          // 问题列表格式化
          answerPlayFormat(answer, index) {
            const dict = { 0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G' };
            return `
${answer.pic ? h.image(answer.pic) : ''}      
${this.answerGuild}[第 ${index + 1} 题]
${answer.ask}
${answer.column.map((item, index) => { return `${dict[index]}. ${item}`; }).join('\n')}   
请选择你觉得正确的答案，发送 /回答 A ~ ${dict[answer.column.length - 1]} 回复
`;
          },
          // 判断题目的回答是否正确
          async checkAnswerRight(query, session, fn) {
            let at = '';
            if (config.atQQ) {
              at = `<at id="${session.userId}" />`;
            }
            if (!this.isUse) {
              await session.send(at + '还未开始抢答游戏，请发送 /开始抢答');
              return;
            }
            if (!this.playUser[session.userId]) {
              if (answerClass.playUser[session.userId]) {
                await session.send(at + '你已经在别的群游玩，请等待目标群结束');
                return;
              }
              answerClass.playUser[session.userId] = true;
              this.playUser[session.userId] = {
                timer: 0,
                success: 0,
                error: 0,
                combo: 0
              };
            }
            const watime = +new Date() - this.playUser[session.userId].timer;
            if (watime < config.watingPlay) {
              await session.send(at + `你回答的频率太快，请等待${Math.floor((config.watingPlay - watime) / 1000)}秒`);
              return;
            }
            this.playUser[session.userId].timer = +new Date();
            query = query.toUpperCase();
            const index = this.playIndex;
            const dict = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5 };
            if (dict[query] !== 0 && !dict[query]) {
              await session.send(at + '[×] 回答有误，请按  /回答 标识 格式发送');
              return;
            }
            // 提取答案
            const result = this.answerItem[index].column[dict[query]];
            // 判断结果 
            if (!(this.answerItem[index].susses.includes(result))) {
              ++this.playUser[session.userId].error; // 答错数 + 1
              this.playUser[session.userId].combo = 0; // 中断连击
              // 额外内容
              if (this.answerItem[index].more.lose && this.answerItem[index].more.lose.length) {
                const loseMsgList = this.answerItem[index].more.lose
                await session.send(at + loseMsgList[random(0, loseMsgList.length)])
              }
              await session.send(at + '[×] 回答错误' +
                `\n答对次数：${this.playUser[session.userId].success}\n答错次数：${this.playUser[session.userId].error}`);
              fn && await fn({ result: false });
              return;
            }
            else {
              ++this.playUser[session.userId].success; // 答对数 + 1
              ++this.playUser[session.userId].combo;
              const query = {
                result: true,
                mark: this.answerItem[index].mark,
                more: this.answerItem[index].more,
                combo: this.playUser[session.userId].combo - 1
              };
              // 额外内容
              if (this.answerItem[index].more.get && this.answerItem[index].more.get.length) {
                const getMsgList = this.answerItem[index].more.get
                await session.send(at + getMsgList[random(0, getMsgList.length)])
              }
              await session.send(at + '[√] 回答正确' +
                `\n答对次数：${this.playUser[session.userId].success}\n答错次数：${this.playUser[session.userId].error}${this.playUser[session.userId].combo - 1 ? `\n连续答对：${this.playUser[session.userId].combo - 1}` : ''}`);
              fn && await fn(query);
              await this.nextAnswerPlayByGuildId(session);
            }
          }
        };
      }
      return this.guildList[guildId];
    },
  };
  ctx
    .command('回答 <option>')
    .userFields(['id']).action(async ({ session }, option) => {
      let at = '';
      if (config.atQQ) {
        at = `<at id="${session.userId}" />`;
      }
      const select = option?.trim();
      if (!select) {
        await session.send(at + '请输入选项，例如 /回答 A');
        return;
      }
      const temp = answerClass.getGuildList(session.guildId);
      await temp.checkAnswerRight(select, session, async (info) => {
        if (!info.result)
          return;
        const add = info.mark || 1;
        const combo = info.combo;
        await ctx.monetary.gain(session.user.id, add + combo);
        await session.send(at + '获得奖励积分：' + add + '分' + `${combo ? `\n连续答对额外奖励 ${combo} 分` : ''}`);
      });
    });
  ctx
    .command('结束抢答')
    .action(async ({ session }) => {
      let at = '';
      if (config.atQQ) {
        at = `<at id="${session.userId}" />`;
      }
      const temp = answerClass.getGuildList(session.guildId);
      if (!temp.isUse) {
        await session.send(at + '似乎还没开始答题..');
        return;
      }
      await temp.initGuildInfo();
      await session.send(at + '已结束答题');
    });
  ctx
    .command('开始抢答 <answerName:text>')
    .action(async ({ session }, answerName) => {
      let at = '';
      if (config.atQQ) {
        at = `<at id="${session.userId}" />`;
      }
      const temp = answerClass.getGuildList(session.guildId);
      config.debug && console.log(temp);
      if (!temp) {
        await session.send(at + temp.msg);
        return;
      }
      const result = await temp.startAnswer(answerName);
      if (!result.code) {
        await session.send(at + result.msg);
        return;
      }
      await session.send(at + result.msg);
      await temp.nextAnswerPlayByGuildId(session);
    });
  ctx
    .command('答题题目')
    .action(async ({ session }) => {
      let at = ''
      if (config.atQQ) {
        at = `<at id="${session.userId}" />`
      }
      await answerClass.init()
      const answer = answerClass.answerMenu
      const msg = answer.map(item => {
        return `${item.pic ? `${h.image(item.pic)}\n` : ''}${item.guild}\n${item.msg}\n题目数量：${item.len}`
      }).join('\n')
      const sedMsg = msg ? `目前随机题库为以下内容：` + msg : '没有存在的题库'
      await session.send(at + sedMsg)
    })
  function random(min, max) {
    const randomBuffer = crypto.randomBytes(4);
    const randomNumber = randomBuffer.readUInt32LE(0) / 0x100000000;
    return Math.floor(min + randomNumber * (max - min));
  }
  // 打乱数组
  function getFreeList(arr) {
    let arrAdd = [...arr];
    for (let i = 1; i < arrAdd.length; i++) {
      const random = Math.floor(Math.random() * (i + 1));
      //交换两个数组
      [arrAdd[i], arrAdd[random]] = [arrAdd[random], arrAdd[i]];
    }
    return arrAdd;
  }
  ctx.on('ready', async () => {
    await answerClass.init();
  });
}

