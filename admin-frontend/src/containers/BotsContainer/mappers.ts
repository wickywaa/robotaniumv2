import { IBot, IGame, ILoggedInUser, emptyGame } from '../../models';

export const mapBotToTestGame = (bot: IBot, user: ILoggedInUser): IGame => ({
  ...emptyGame,
  _id: '',
  name: `test game ${new Date().getTime()}`,
  startTime: new Date().getTime(),
  endTime: null,
  players: [user._id],
  adminPlayerId: user._id,
  bots: [{
    _id: bot._id,
    name: bot.name,
    cockpits: bot.cockpits.map(camera => ({
      _id: camera._id,
      name: camera.name,
      player: {
        name: user.userName,
        id: user._id
      },
      status: 'offline',
      sessionId: ''
    })),
    socketId: '',
    adminId: user._id
  }],
  gameType: 'private',
  reason: 'test',
  chatEnabled: true,
  voiceChatEnabled: true,
  camerasEnabled: true,
  gamestopped: false,
  gamesStoppedBy: '',
  gameStoppedReason: '',
  gameinSeconds: 0,
  chat: [],
  notes: []
});