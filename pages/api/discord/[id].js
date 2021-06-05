

import {Client as DiscordClient} from 'discord.js'
import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'

import {addCors, time, RedisHelper} from '../../../components'


const mapMessage = (m) => {

  const mentions = m.mentions.users.array().map(item => ({id: item.id, name: item.username}))

  //<@!803926999529160734>
  const content = m.content.replace(/<@!([0-9]+)>/g, (match, id) => {
    const lookup = mentions.find(mention => mention.id == id);
    return lookup ? `@${lookup.name}` : "";
  }) 

  return ({
    id: m.id,
    content: content, 
    user: m.author.username, 
    avatar: m.author.avatar,
    ts: m.createdTimestamp,
    localdate: new Date(m.createdTimestamp).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
  })

}


async function handler(req, res) {

    const {query: {id}} = req;

    await addCors(req, res)

    const client = new DiscordClient();
    client.login( process.env.DISCORD_BOT_TOKEN  );
    const redis = new RedisHelper(`__channel${id}`)

    const sendFreshData = (data) => {
      if(!isEmpty(data) && !res.finished){
        res.json( data )
      }
    }

    const data = await redis.getList(60)

    //add cache TTL check!
    sendFreshData(data)

   // console.log(res)

    client.on('ready', async () => {
      console.log(`Logged in as ${client.user.tag}!`);
      //const guild = await client.guilds.fetch("803790453967290418")
      //console.log(guild.channels)
      const channel = await client.channels.fetch(id)
      const lastMessageId = channel.lastMessageId;
      const messages = await channel.messages.fetch({
        limit: 10,
        //after: "803930115964796928"
      });
      const filtered = messages.array().filter(m => !m.pinned && !m.deleted && !m.system)
      const cleared = filtered.map(m => mapMessage(m))
      client.destroy()
      await redis.addToList(cleared)
      sendFreshData(cleared);
      redis.quit()
    });


}

export default handler

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '1mb',
      },
    },
}

  /**
   <ref *2> TextChannel {
  type: 'text',
  deleted: false,
  id: '803790592768212992',
  name: 'scena-a',
  rawPosition: 1,
  parentID: '803790453967290419',
  permissionOverwrites: Collection(0) [Map] {},
  topic: null,
  lastMessageID: '814996344308760576',
  rateLimitPerUser: 0,
  lastPinTimestamp: 1611764036581,
  guild: <ref *1> Guild {
    members: GuildMemberManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    },
    channels: GuildChannelManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    },
    roles: RoleManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]],
      guild: [Circular *1]
    },
    presences: PresenceManager {
      cacheType: [class Collection extends Collection],
      cache: [Collection [Map]]
    },
    voiceStates: VoiceStateManager {
      cacheType: [class Collection extends Collection],
      cache: Collection(0) [Map] {},
      guild: [Circular *1]
    },
    deleted: false,
    available: true,
    id: '803790453967290418',
    shardID: 0,
    name: 'ehandel',
    icon: null,
    splash: null,
    discoverySplash: null,
    region: 'europe',
    memberCount: 3,
    large: false,
    features: [],
    applicationID: null,
    afkTimeout: 300,
    afkChannelID: null,
    systemChannelID: '803790453967290421',
    embedEnabled: undefined,
    premiumTier: 0,
    premiumSubscriptionCount: 0,
    verificationLevel: 'LOW',
    explicitContentFilter: 'DISABLED',
    mfaLevel: 0,
    joinedTimestamp: 1614351065644,
    defaultMessageNotifications: 'ALL',
    systemChannelFlags: SystemChannelFlags { bitfield: 2 },
    maximumMembers: 100000,
    maximumPresences: null,
    approximateMemberCount: null,
    approximatePresenceCount: null,
    vanityURLCode: null,
    vanityURLUses: null,
    description: null,
    banner: null,
    rulesChannelID: null,
    publicUpdatesChannelID: null,
    preferredLocale: 'en-US',
    ownerID: '770430299045232660',
    emojis: GuildEmojiManager {
      cacheType: [class Collection extends Collection],
      cache: Collection(0) [Map] {},
      guild: [Circular *1]
    }
  },
  messages: MessageManager {
    cacheType: [class LimitedCollection extends Collection],
    cache: LimitedCollection(0) [Map] { maxSize: 200 },
    channel: [Circular *2]
  },
  nsfw: false,
  _typing: Map(0) {}
}


  
   <ref *1> Message {
    channel: TextChannel {
      type: 'text',
      deleted: false,
      id: '803790592768212992',
      name: 'scena-a',
      rawPosition: 1,
      parentID: '803790453967290419',
      permissionOverwrites: Collection(0) [Map] {},
      topic: null,
      lastMessageID: '814996344308760576',
      rateLimitPerUser: 0,
      lastPinTimestamp: 1611764036581,
      guild: [Guild],
      messages: [MessageManager],
      nsfw: false,
      _typing: Map(0) {}
    },
    deleted: false,
    id: '814996344308760576',
    type: 'DEFAULT',
    system: false,
    content: 'test',
    author: User {
      id: '770430299045232660',
      system: null,
      locale: null,
      flags: [UserFlags],
      username: 'AdamTEH',
      bot: false,
      discriminator: '5812',
      avatar: null,
      lastMessageID: null,
      lastMessageChannelID: null
    },
    pinned: false,
    tts: false,
    nonce: null,
    embeds: [],
    attachments: Collection(0) [Map] {},
    createdTimestamp: 1614380670383,
    editedTimestamp: 0,
    reactions: ReactionManager {
      cacheType: [class Collection extends Collection],
      cache: Collection(0) [Map] {},
      message: [Circular *1]
    },
    mentions: MessageMentions {
      everyone: false,
      users: Collection(0) [Map] {},
      roles: Collection(0) [Map] {},
      _members: null,
      _channels: null,
      crosspostedChannels: Collection(0) [Map] {}
    },
    webhookID: null,
    application: null,
    activity: null,
    _edits: [],
    flags: MessageFlags { bitfield: 0 },
    reference: null
  }


   */