import * as MRE from '@microsoft/mixed-reality-extension-sdk';

const HELP_BUTTON_POSITION = {x: 0, y: 0.1, z: 0}
const HELP_BUTTON_TEXT = `What is my purpose?
You help Altspacers.

'top' - Top things to do in Altspace

Enter a command and click "OK".

Learn more at github.com/tuesy/jimmybot
`;
const WELCOME_TEXT = 'JimmyBot 1.0'
const TOPTHINGS = `Top Things to do in Altspace
- Take a relaxing boat ride in "Journey to the Cove" (VAL222)
- Bounce around in "Jump Park" (JOR455)
- Explore the "Madana Lounge" (EKH984)
- Play basketball in "Space Court 1.5" (THE262)
- Watch sunrise/sunset in "Enchanged Meadow" (DON006)
`

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
        transform: { local: { position: { x: 0, y: 0.8, z: 0 } } },
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
          this.infoText.text.contents = this.resultMessageFor(res.text);
        }
        else{
          // user clicked 'Cancel'
          this.infoText.text.contents = WELCOME_TEXT;
        }
      })
      .catch(err => {
        console.error(err);
      });
    });
    return button;
  }

  private resultMessageFor(query: string){
    query = query.toLowerCase();
    switch(query){
      case 'top':
        return TOPTHINGS;
      case 'help':
        return `......`;
      default:
        return `Sorry, I don't know that one.`
    }
  }

}