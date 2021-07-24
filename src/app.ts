import * as MRE from '@microsoft/mixed-reality-extension-sdk';

const HELP_BUTTON_POSITION = {x: 0.5, y: 0.5, z: 0}
const WELCOME_TEXT = `
Welcome! Let's chat and explore Altspace.

Commands: (coming soon)

Learn more at github.com/tuesy/jimmybot
`;

export default class App {
  public assets: MRE.AssetContainer;

  constructor(public context: MRE.Context, public params: MRE.ParameterSet) {
    this.assets = new MRE.AssetContainer(context);
    this.context.onStarted(() => this.started());
  }

  private async started() {
    this.createHelpButton();
  }

  private createHelpButton() {    const button = MRE.Actor.CreateFromLibrary(this.context, {
      resourceId: 'artifact:1579238405710021245',
      actor: {
        name: 'Help Button',
        transform: { local: { position: HELP_BUTTON_POSITION } },
        collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } }
      }
    });
    button.setBehavior(MRE.ButtonBehavior).onClick(user => {
      user.prompt(WELCOME_TEXT, true).then(res => {
        if (res.submitted) {
            // clicked 'OK'

        }
        else {
            // clicked 'Cancel'
        }
      })
      .catch(err => {
        console.error(err);
      });
    });
    return button;
  }

}