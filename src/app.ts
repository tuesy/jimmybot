import * as MRE from '@microsoft/mixed-reality-extension-sdk';

const fetch = require('node-fetch');
const utf8 = require('utf8');

const HELP_BUTTON_POSITION = {x: 0, y: 0.6, z: 0}
const HELP_BUTTON_TEXT = `What is my purpose?
You help Altspacers.

'top' - Top things to do in Altspace
'sg1' - Stargate addresses

Enter a command and click "OK".

Learn more at github.com/tuesy/jimmybot
`;
const WELCOME_TEXT = 'JimmyBot 1.1'
const TOPTHINGS = `Top Things to do in Altspace
- Take a relaxing boat ride in "Journey to the Cove" (VAL222)
- Bounce around in "Jump Park" (JOR455)
- Explore the "Madana Lounge" (EKH984)
- Play basketball in "Space Court 1.5" (THE262)
- Watch sunrise/sunset in "Enchanged Meadow" (DON006)
`
const STARGATE_ADDRESSES = `Stargate Addresses:

ttttttt - Stargate Commmand, Earth
yMIrtMa (cpital 'i') - Abydos
EooFzva - Chulak
ozhhvHa - Cold Lazarus
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
        transform: { local: { position: { x: 0, y: 0, z: 0 } } },
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
        transform: {
          local: {
            position: HELP_BUTTON_POSITION,
            rotation: MRE.Quaternion.FromEulerAngles(0, MRE.DegreesToRadians * 90, 0)
          }
        },
        collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.5, z: 0.5 } } }
      }
    });
    button.setBehavior(MRE.ButtonBehavior).onClick(user => {
      user.prompt(HELP_BUTTON_TEXT, true).then(res => {
        if(res.submitted){
          this.respondTo(user, res.text);
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

  private async respondTo(user: MRE.User, query: string){
    query = query.toLowerCase();
    switch(query){
      case 'top':
        this.infoText.text.contents = TOPTHINGS;
        break;
      case 'sg1':
        this.infoText.text.contents = STARGATE_ADDRESSES;
        break;
      default:
        let uri = "https://jimmybot.azurewebsites.net/qnamaker/knowledgebases/bce0aa7c-2947-40c9-a11a-fd3c9936b41f/generateAnswer";
        this.infoText.text.contents = await fetch(uri, {
          method: 'POST',
          body: JSON.stringify({'question': query}), // need to convert to JSON here!
          headers: {
            'Content-type': 'application/json',
            'Authorization': 'EndpointKey d34b45ac-1907-48a8-82c1-4d5a046fa031'
          }
        }).then((res: any) => res.json()).then((json: any) =>
           // update text
          `<color=#389eeb>${user.name}: <color=#EEEEEE>${query}\n<color=#bf92df>JimmyBot: <color=#EEEEEE>${json['answers'][0]['answer']}`
        );
        break;
    }
  }
}