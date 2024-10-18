const { ManagementClient } = require("auth0");

const management = new ManagementClient({
  domain: process.env.MANAGEMENT_DOMAIN,
  clientId: process.env.MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.MANAGEMENT_CLIENT_SECRET,
  scope: "create:organization_invitations",
});

// Organization ID from Auth0
const organizationId = "org_aXtq6tMfnNLld8Bi"; // Replace with your org ID

// Function to send an invitation
async function sendOrgInvitation(userEmail) {
  try {
    const invitation = await management.organizations.createInvitation(
      {
        id: organizationId,
      },
      {
        invitee: {
          email: userEmail,
        },
        inviter: {
          name: "Your App Name",
        },
        client_id: process.env.CLIENT_ID,
        // Connection used for signup/login
        send_invitation_email: true,
      }
    );
    console.log("Invitation sent: ", invitation);
    return invitation;
  } catch (error) {
    console.error("Error sending invitation: ", error);
  }
}

module.exports = { sendOrgInvitation };
