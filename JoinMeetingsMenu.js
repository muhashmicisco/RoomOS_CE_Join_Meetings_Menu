const xapi = require('xapi');

// Define the mapping of widget IDs to SIP domains
const widgetToDomainMap = {
  'fwbx': '@meetingsite.webex.com',
  'cwbx': '@webex.com',
  'mst': '.tennantID@m.webex.com',
  'zoom': '@zoomcrc.com'
};

// Function to prompt the user for a meeting ID
function promptMeetingID(widgetId) {
  xapi.command('UserInterface Message TextInput Display', {
    Duration: 0,
    FeedbackId: `meeting_id_prompt_${widgetId}`,
    InputType: 'Numeric',
    Placeholder: 'Enter Meeting ID',
    Title: 'Meeting ID',
    Text: 'Please enter the meeting ID to dial:'
  });
}

// Event listener for the user's input
xapi.event.on('UserInterface Message TextInput Response', (event) => {
  if (event.FeedbackId.startsWith('meeting_id_prompt_')) {
    const widgetId = event.FeedbackId.split('_').pop();
    const meetingID = event.Text;
    dialMeeting(widgetId, meetingID);
  }
});

// Function to dial the meeting ID appended to the corresponding SIP domain
function dialMeeting(widgetId, meetingID) {
  const sipDomain = widgetToDomainMap[widgetId];
  if (sipDomain) {
    const fullAddress = `${meetingID}${sipDomain}`;
    xapi.command('Dial', { Number: fullAddress });
  } else {
    console.log('Invalid widget ID or SIP domain not found');
  }
}

// Event listener for widget actions
xapi.event.on('UserInterface Extensions Widget Action', (event) => {
  if (event.Type === 'clicked') {
    promptMeetingID(event.WidgetId);
  }
});
