import * as MRE from '@microsoft/mixed-reality-extension-sdk';

const fetch = require('node-fetch');
const DEBUG = false;

export default class JimmyBot {
	public assets: MRE.AssetContainer;

	constructor(public context: MRE.Context, public params: MRE.ParameterSet) {
	  this.assets = new MRE.AssetContainer(context);

    this.context.onStarted(() => this.started());
    this.context.onUserLeft(user => this.userLeft(user));
    this.context.onUserJoined(user => this.userJoined(user));
	}

	private async started() {
	}

  private userLeft(user: MRE.User) {
  }

  private userJoined(user: MRE.User) {
  }
}