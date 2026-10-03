import { contextBridge } from 'electron';
import type { Bridge } from '../shared/bridge';

const bridge: Bridge = {};

contextBridge.exposeInMainWorld('bridge', bridge);
