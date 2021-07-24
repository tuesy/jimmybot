import * as MRE from '@microsoft/mixed-reality-extension-sdk';

const HELP_BUTTON_POSITION = {x: 0, y: 0.1, z: 0}
const HELP_BUTTON_TEXT = `
Welcome! Let's chat and explore Altspace.

Commands: (coming soon)

Learn more at github.com/tuesy/jimmybot
`;
const WELCOME_TEXT = 'JimmyBot 1.0'

export default class App {
  public assets: MRE.AssetContainer;

  private infoText : any;

  constructor(public context: MRE.Context, public params: MRE.ParameterSet) {
    this.assets = new MRE.AssetContainer(context);
    this.context.onStarted(() => this.started());
  }

  private async started() {
    this.createUI();
    this.createHelpButton();
  }

  private createUI() {
    this.infoText = MRE.Actor.Create(this.context, {
      actor: {
        name: 'Info Text',
        transform: { local: { position: { x: 0, y: 1, z: 0 } } },
        collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } },
        text: {
          contents: WELCOME_TEXT,
          height: 0.1,
          anchor: MRE.TextAnchorLocation.MiddleCenter,
          justify: MRE.TextJustify.Center
        }
      }
    });
  }

  private createHelpButton() {
    const button = MRE.Actor.CreateFromLibrary(this.context, {
      resourceId: 'artifact:1579238405710021245',
      actor: {
        name: 'Help Button',
        transform: { local: { position: HELP_BUTTON_POSITION } },
        collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } }
      }
    });
    button.setBehavior(MRE.ButtonBehavior).onClick(user => {
      user.prompt(HELP_BUTTON_TEXT, true).then(res => {
        if(res.submitted){
          if(res.text.length == 0){
            this.infoText.text.contents = `Sorry, ENTER doesn't work right now.\n\nPlease click 'OK'`;
          }
          else{
            this.infoText.text.contents = this.resultMessageFor(res.text);
          }
        }
        else{
          // user clicked 'Cancel'
        }
      })
      .catch(err => {
        console.error(err);
      });
    });
    return button;
  }

  private resultMessageFor(query: string){
    return `Search results for:\n\n"${query}"`;
  }

}