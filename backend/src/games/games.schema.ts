import * as mongoose from 'mongoose';
import { } from './interfaces';
import { IGame, IGameMethods, IGameModel } from './interfaces/games.interface';
import { Bot } from 'src/bots/bots.schema';

const { Schema } = mongoose;

const connectedCockpitSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'User' },
    player: {
      id: { type: String, default: null },
      name: { type: String, default: null }
  },
    name: { type: String, default: 'unknown_name' },
    sessionId: { type: String, default: '' },
    accessToken: { type: String, default: '' },
    status: { type: String, default: 'offline' },
});

const connectedBotSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, default: 'unknown_name' },
  adminId: { type: String, default: '' },
  cockpits: [connectedCockpitSchema],
});

// Define the Game schema
export const gameSchema = new Schema({
  name: { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: false },
  players: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  adminPlayerId: { type: String, required: false },
  bots: [connectedBotSchema],  // Now an array of connected bots
  gameType: {
    type: String,
    enum: ['public', 'private'],
    required: true,
  },
  reason: {
    type: String,
    enum: ['game', 'practise', 'test'],
    required: true,
  },
  chatEnabled: { type: Boolean, required: true },
  voiceChatEnabled: { type: Boolean, required: true },
  camerasEnabled: { type: Boolean, required: true },
  gamestopped: { type: Boolean, required: true },
  gamesStoppedBy: { type: String, required: false },
  gameStoppedReason: { type: String, required: false, default:''},
  gameinSeconds: { type: Number, required: true },
  chat: [
    {
      userId: { type: String, required: true },
      message: { type: String, required: true },
    },
  ],
  notes: [
    {
      adminId: { type: String, required: true },
      note: { type: String, required: true },
    },
  ]
});

// Create and export the Game model
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;